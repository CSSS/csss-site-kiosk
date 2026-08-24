<#
  csss-kiosk-autoupdater.ps1

  Pull-based updater:
    - Checks the latest GitHub Release
    - Downloads the packaged release
    - Verifies SHA256
    - Stops the kiosk service
    - Moves the current installation to a backup
    - Promotes the new installation
    - Restarts the service
    - Verifies /health
    - Automatically rolls back if anything goes wrong

  Recommended:
    - Keep this script OUTSIDE C:\apps\csss-kiosk
    - Run through Task Scheduler with "Run with highest privileges"
#>

$ErrorActionPreference = "Stop"

# ---------------- CONFIG ----------------

$RepoOwner   = "CSSS"
$RepoName    = "csss-site-kiosk"

$ServiceName = "CSSS-Kiosk-Server"

$AppRoot     = "C:\apps\csss-kiosk"
$BackupRoot  = "C:\apps\csss-kiosk_backup"
$TempDir     = "C:\apps\csss-kiosk_temp"

$VersionFile = Join-Path $AppRoot "VERSION"

$HealthCheckUrl = "http://localhost:8080/health"

$LogFile = "C:\apps\logs\csss-kiosk\csss-kiosk-update-log.txt"

# ----------------------------------------


function Write-Log {
    param(
        [Parameter(Mandatory)]
        [string]$Message
    )

    $logDir = Split-Path $LogFile -Parent

    if (-not (Test-Path $logDir)) {
        New-Item `
            -ItemType Directory `
            -Path $logDir `
            -Force |
            Out-Null
    }

    # Rotate log after 5 MB.
    if (
        (Test-Path $LogFile) -and
        (Get-Item $LogFile).Length -gt 5MB
    ) {
        $oldLog = "$LogFile.old"

        if (Test-Path $oldLog) {
            Remove-Item $oldLog -Force
        }

        Rename-Item `
            -Path $LogFile `
            -NewName (Split-Path $oldLog -Leaf)
    }

    $line = "[{0}] {1}" -f `
        (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), `
        $Message

    Add-Content -Path $LogFile -Value $line

    Write-Host $line
}


function Get-AuthHeaders {
    return @{
        "User-Agent" = "csss-kiosk-updater"
    }
}


function Stop-KioskService {
    $service = Get-Service `
        -Name $ServiceName `
        -ErrorAction Stop

    if ($service.Status -eq "Stopped") {
        Write-Log "Service $ServiceName is already stopped."
        return
    }

    Write-Log "Stopping service $ServiceName..."

    Stop-Service `
        -Name $ServiceName `
        -ErrorAction Stop

    $service.WaitForStatus(
        [System.ServiceProcess.ServiceControllerStatus]::Stopped,
        [TimeSpan]::FromSeconds(30)
    )

    $service.Refresh()

    if ($service.Status -ne "Stopped") {
        throw "Service $ServiceName did not stop within 30 seconds."
    }

    Write-Log "Service $ServiceName stopped."
}


function Start-KioskService {
    $service = Get-Service `
        -Name $ServiceName `
        -ErrorAction Stop

    if ($service.Status -eq "Running") {
        Write-Log "Service $ServiceName is already running."
        return
    }

    Write-Log "Starting service $ServiceName..."

    Start-Service `
        -Name $ServiceName `
        -ErrorAction Stop

    $service.WaitForStatus(
        [System.ServiceProcess.ServiceControllerStatus]::Running,
        [TimeSpan]::FromSeconds(30)
    )

    $service.Refresh()

    if ($service.Status -ne "Running") {
        throw "Service $ServiceName did not start within 30 seconds."
    }

    Write-Log "Service $ServiceName started."
}


function Test-KioskHealth {
    param(
        [Parameter(Mandatory)]
        [string]$ExpectedVersion
    )

    Write-Log "Waiting for kiosk health check..."

    for ($i = 1; $i -le 5; $i++) {
        try {
            $response = Invoke-WebRequest `
                -Uri $HealthCheckUrl `
                -UseBasicParsing `
                -TimeoutSec 5

            $reportedVersion = $response.Content.Trim()

            if (
                $response.StatusCode -eq 200 -and
                $reportedVersion -eq $ExpectedVersion
            ) {
                Write-Log "Health check passed. Server reports $reportedVersion."
                return $true
            }

            Write-Log (
                "Health check attempt {0}/5 returned HTTP {1}, version '{2}'." -f `
                    $i,
                    $response.StatusCode,
                    $reportedVersion
            )
        }
        catch {
            Write-Log (
                "Health check attempt {0}/5 failed: {1}" -f `
                    $i,
                    $_.Exception.Message
            )
        }

        if ($i -lt 5) {
            Start-Sleep -Seconds 3
        }
    }

    return $false
}


# Used to determine what recovery is necessary if the update
# fails halfway through.
$LiveMovedToBackup = $false
$NewVersionPromoted = $false
$ServiceWasStopped = $false


try {
    Write-Log "----------------------------------------"
    Write-Log "Checking for updates..."

    $headers = Get-AuthHeaders

    # ----------------------------------------
    # Get latest release
    # ----------------------------------------

    $apiUrl = (
        "https://api.github.com/repos/{0}/{1}/releases/latest" -f `
            $RepoOwner,
            $RepoName
    )

    $release = Invoke-RestMethod `
        -Uri $apiUrl `
        -Headers $headers

    $latestTag = $release.tag_name

    if ([string]::IsNullOrWhiteSpace($latestTag)) {
        throw "GitHub returned a release without a tag."
    }

    $currentVersion = ""

    if (Test-Path $VersionFile) {
        $currentVersion = (
            Get-Content $VersionFile -Raw
        ).Trim()
    }

    Write-Log "Installed version: '$currentVersion'"
    Write-Log "Latest version:    '$latestTag'"

    if ($latestTag -eq $currentVersion) {
        Write-Log "Already up to date. Nothing to do."
        exit 0
    }

    if ($release.draft -or $release.prerelease) {
        Write-Log "Release $latestTag is a draft/prerelease. Skipping."
        exit 0
    }

    Write-Log "New version found: $latestTag"

    # ----------------------------------------
    # Find release assets
    # ----------------------------------------

    # Match the exact filenames produced by GitHub Actions.
    $expectedZipName = "app-$latestTag.zip"
    $expectedShaName = "$expectedZipName.sha256"

    $zipAsset = $null
    $shaAsset = $null

    $maxAssetRetries = 3

    for ($i = 1; $i -le $maxAssetRetries; $i++) {

        $tagUrl = (
            "https://api.github.com/repos/{0}/{1}/releases/tags/{2}" -f `
                $RepoOwner,
                $RepoName,
                $latestTag
        )

        $release = Invoke-RestMethod `
            -Uri $tagUrl `
            -Headers $headers

        $zipAsset = $release.assets |
            Where-Object { $_.name -eq $expectedZipName } |
            Select-Object -First 1

        $shaAsset = $release.assets |
            Where-Object { $_.name -eq $expectedShaName } |
            Select-Object -First 1

        if ($zipAsset) {
            break
        }

        Write-Log (
            "Release asset $expectedZipName is not available yet " +
            "(attempt $i/$maxAssetRetries)."
        )

        if ($i -lt $maxAssetRetries) {
            Start-Sleep -Seconds 15
        }
    }

    if (-not $zipAsset) {
        Write-Log (
            "WARNING: release $latestTag exists, but $expectedZipName " +
            "has not been uploaded yet. Will retry next scheduled run."
        )

        exit 0
    }

    # ----------------------------------------
    # Prepare temporary directory
    # ----------------------------------------

    if (Test-Path $TempDir) {
        Write-Log "Removing previous temporary update directory..."

        Remove-Item `
            $TempDir `
            -Recurse `
            -Force
    }

    New-Item `
        -ItemType Directory `
        -Path $TempDir |
        Out-Null

    # ----------------------------------------
    # Download release
    # ----------------------------------------

    $zipPath = Join-Path $TempDir $zipAsset.name

    Write-Log "Downloading $($zipAsset.name)..."

    Invoke-WebRequest `
        -Uri $zipAsset.browser_download_url `
        -Headers $headers `
        -OutFile $zipPath `
        -UseBasicParsing

    # ----------------------------------------
    # Verify checksum
    # ----------------------------------------

    if (-not $shaAsset) {
        throw "Release $latestTag does not contain $expectedShaName."
    }

    $shaPath = Join-Path $TempDir $shaAsset.name

    Write-Log "Downloading checksum..."

    Invoke-WebRequest `
        -Uri $shaAsset.browser_download_url `
        -Headers $headers `
        -OutFile $shaPath `
        -UseBasicParsing

    $expectedHash = (
        (Get-Content $shaPath -Raw).Split(" ")[0]
    ).Trim().ToLower()

    $actualHash = (
        Get-FileHash `
            -Path $zipPath `
            -Algorithm SHA256
    ).Hash.ToLower()

    if ($expectedHash -ne $actualHash) {
        throw (
            "Checksum mismatch. Expected $expectedHash, " +
            "got $actualHash."
        )
    }

    Write-Log "Checksum verified."

    # ----------------------------------------
    # Extract release
    # ----------------------------------------

    $extractDir = Join-Path $TempDir "extracted"

    Write-Log "Extracting release..."

    Expand-Archive `
        -Path $zipPath `
        -DestinationPath $extractDir `
        -Force

    # Make sure the archive looks like a valid kiosk package
    # before touching the currently installed version.

    $newServer = Join-Path $extractDir "server\server.js"
    $newFrontend = Join-Path `
        $extractDir `
        "frontend\dist\csss-site-kiosk\browser\index.html"

    if (-not (Test-Path $newServer)) {
        throw "Release package does not contain server\server.js."
    }

    if (-not (Test-Path $newFrontend)) {
        throw "Release package does not contain the Angular frontend."
    }

    Write-Log "Release package verified."

    # ----------------------------------------
    # Prepare for directory swap
    # ----------------------------------------

    $AppParent = Split-Path $AppRoot -Parent

    # Very important on Windows:
    # don't have the current working directory inside AppRoot while
    # trying to rename AppRoot.
    Set-Location $AppParent

    Write-Log "Working directory changed to $AppParent."

    # ----------------------------------------
    # Stop service
    # ----------------------------------------

    Stop-KioskService
    $ServiceWasStopped = $true

    # ----------------------------------------
    # Remove old backup
    # ----------------------------------------

    if (Test-Path $BackupRoot) {
        Write-Log "Removing previous backup..."

        Remove-Item `
            $BackupRoot `
            -Recurse `
            -Force `
            -ErrorAction Stop
    }

    # ----------------------------------------
    # Move live installation to backup
    # ----------------------------------------

    if (Test-Path $AppRoot) {
        Write-Log "Moving current installation to backup..."

        Move-Item `
            -Path $AppRoot `
            -Destination $BackupRoot `
            -ErrorAction Stop

        $LiveMovedToBackup = $true
    }

    # ----------------------------------------
    # Promote new installation
    # ----------------------------------------

    Write-Log "Promoting $latestTag to live installation..."

    Move-Item `
        -Path $extractDir `
        -Destination $AppRoot `
        -ErrorAction Stop

    $NewVersionPromoted = $true

    # Ensure VERSION reflects what was installed.
    Set-Content `
        -Path $VersionFile `
        -Value $latestTag `
        -NoNewline

    Write-Log "Installed VERSION set to $latestTag."

    # ----------------------------------------
    # Start new version
    # ----------------------------------------

    Start-KioskService
    $ServiceWasStopped = $false

    # ----------------------------------------
    # Health check
    # ----------------------------------------

    $healthy = Test-KioskHealth `
        -ExpectedVersion $latestTag

    if (-not $healthy) {
        throw "Health check failed for $latestTag."
    }

    # ----------------------------------------
    # Update succeeded
    # ----------------------------------------

    Write-Log "Update to $latestTag succeeded."

    # The new version has started and passed its health check,
    # so the old installation is no longer needed.
    if (Test-Path $BackupRoot) {
        Write-Log "Removing previous-version backup..."

        Remove-Item `
            $BackupRoot `
            -Recurse `
            -Force `
            -ErrorAction SilentlyContinue
    }

    if (Test-Path $TempDir) {
        Remove-Item `
            $TempDir `
            -Recurse `
            -Force `
            -ErrorAction SilentlyContinue
    }

    Write-Log "Update complete."

    exit 0
}
catch {
    Write-Log "UPDATE FAILED."

    Write-Log "ERROR: $($_.Exception.Message)"

    if ($_.InvocationInfo.ScriptLineNumber) {
        Write-Log (
            "Line {0}: {1}" -f `
                $_.InvocationInfo.ScriptLineNumber,
                $_.InvocationInfo.Line.Trim()
        )
    }

    # ----------------------------------------
    # Recovery
    # ----------------------------------------

    try {
        Write-Log "Beginning recovery..."

        # If the service happened to start before the failure,
        # stop it before modifying the installation.
        try {
            $service = Get-Service `
                -Name $ServiceName `
                -ErrorAction Stop

            if ($service.Status -ne "Stopped") {
                Stop-KioskService
            }
        }
        catch {
            Write-Log (
                "WARNING: could not stop service during recovery: " +
                $_.Exception.Message
            )
        }

        # Make absolutely sure we aren't operating from inside
        # the installation directory.
        $AppParent = Split-Path $AppRoot -Parent
        Set-Location $AppParent

        # If the new version was promoted, remove it before
        # restoring the previous installation.
        if (
            $NewVersionPromoted -and
            (Test-Path $AppRoot)
        ) {
            Write-Log "Removing failed new installation..."

            Remove-Item `
                $AppRoot `
                -Recurse `
                -Force `
                -ErrorAction Stop

            $NewVersionPromoted = $false
        }

        # Restore the known-good previous installation.
        if (
            $LiveMovedToBackup -and
            (Test-Path $BackupRoot)
        ) {
            Write-Log "Restoring previous installation..."

            Move-Item `
                -Path $BackupRoot `
                -Destination $AppRoot `
                -ErrorAction Stop

            $LiveMovedToBackup = $false

            Write-Log "Previous installation restored."
        }

        # Even if the failure occurred before the directory swap,
        # AppRoot may still contain the original working version.
        if (Test-Path $AppRoot) {
            try {
                Start-KioskService
                $ServiceWasStopped = $false

                Write-Log "Kiosk service restarted after recovery."
            }
            catch {
                Write-Log (
                    "ERROR: application was restored, but the service " +
                    "could not be restarted: " +
                    $_.Exception.Message
                )
            }
        }
        else {
            Write-Log (
                "ERROR: no live installation exists at $AppRoot. " +
                "Manual intervention is required."
            )
        }
    }
    catch {
        Write-Log (
            "ROLLBACK FAILED: " +
            $_.Exception.Message
        )

        if ($_.InvocationInfo.ScriptLineNumber) {
            Write-Log (
                "Rollback line {0}: {1}" -f `
                    $_.InvocationInfo.ScriptLineNumber,
                    $_.InvocationInfo.Line.Trim()
            )
        }
    }

    exit 1
}
