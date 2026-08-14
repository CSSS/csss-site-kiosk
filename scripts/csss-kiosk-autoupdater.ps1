<#
  csss-kiosk-autoupdater.ps1
  Pull-based updater: checks GitHub Releases for a newer version,
  downloads it, swaps it in, and rolls back automatically if the
  health check fails after restart.

  Run this on a schedule via Task Scheduler
#>
$ErrorActionPreference = "Stop"

# ---------------- CONFIG (edit these) ----------------
$RepoOwner      = "CSSS"
$RepoName       = "csss-site-kiosk"
$ServiceName    = "CSSS-Kiosk-Server"                 # name you gave it in Servy
$AppRoot        = "C:\apps\csss-kiosk"                # folder that holds the live app
$BackupRoot     = "C:\apps\csss-kiosk_backup"
$TempDir        = "C:\apps\csss-kiosk_temp"
$VersionFile    = Join-Path $AppRoot "VERSION"
$HealthCheckUrl = "http://localhost:8080/health"
$LogFile        = "C:\apps\logs\csss-kiosk\csss-kiosk-update-log.txt"
# -------------------------------------------------------

function Write-Log($msg) {
    $logDir = Split-Path $LogFile -Parent
    if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

    # Rotate if the log has grown past 5MB, keep one previous copy
    if ((Test-Path $LogFile) -and (Get-Item $LogFile).Length -gt 5MB) {
        $oldLog = "$LogFile.old"
        if (Test-Path $oldLog) { Remove-Item $oldLog -Force }
        Rename-Item -Path $LogFile -NewName (Split-Path $oldLog -Leaf)
    }

    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
    Add-Content -Path $LogFile -Value $line
    Write-Host $line
}

function Get-AuthHeaders {
    $headers = @{ "User-Agent" = "csss-kiosk-updater" }
    return $headers
}

try {
    Write-Log "Checking for updates..."

    $headers = Get-AuthHeaders
    $apiUrl = "https://api.github.com/repos/$RepoOwner/$RepoName/releases/latest"
    $release = Invoke-RestMethod -Uri $apiUrl -Headers $headers

    $latestTag = $release.tag_name
    $currentVersion = if (Test-Path $VersionFile) { (Get-Content $VersionFile -Raw).Trim() } else { "" }

    if ($latestTag -eq $currentVersion) {
        Write-Log "Already up to date ($currentVersion). Nothing to do."
        exit 0
    }

    Write-Log "New version found: $latestTag (current: $currentVersion)"

    # /releases/latest shouldn't return drafts or prereleases, but this will avoid them
    if ($release.draft -or $release.prerelease) {
        Write-Log "Release $latestTag is a draft/prerelease. Skipping."
        exit 0
    }

    # A release can exist (tag pushed / created via UI) before the CI workflow finishes uploading the zip.
    # Retry a few times within this run rather than immediately treating it as a failure.
    $zipAsset = $null
    $shaAsset = $null
    $maxAssetRetries = 3
    for ($i = 0; $i -lt $maxAssetRetries; $i++) {
        $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$RepoOwner/$RepoName/releases/tags/$latestTag" -Headers $headers
        $zipAsset = $release.assets | Where-Object { $_.name -like "*.zip" } | Select-Object -First 1
        $shaAsset = $release.assets | Where-Object { $_.name -like "*.sha256" } | Select-Object -First 1

        if ($zipAsset) { break }

        Write-Log "Zip asset not yet available for $latestTag (attempt $($i+1)/$maxAssetRetries). Waiting..."
        Start-Sleep -Seconds 15
    }

    if (-not $zipAsset) {
        # Not a failure — the release just isn't ready yet. VERSION file
        # is untouched, so the next scheduled run will pick it up once
        # the build finishes uploading.
        Write-Log "WARNING: no zip asset found on release $latestTag after $maxAssetRetries attempts. Will retry on next scheduled run."
        exit 0
    }

    if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
    New-Item -ItemType Directory -Path $TempDir | Out-Null

    $zipPath = Join-Path $TempDir $zipAsset.name
    Write-Log "Downloading $($zipAsset.name)..."
    Invoke-WebRequest -Uri $zipAsset.browser_download_url -Headers $headers -OutFile $zipPath

    # Verify checksum if the release includes one
    if ($shaAsset) {
        $shaPath = Join-Path $TempDir $shaAsset.name
        Invoke-WebRequest -Uri $shaAsset.browser_download_url -Headers $headers -OutFile $shaPath
        $expected = (Get-Content $shaPath -Raw).Split(" ")[0].Trim()
        $actual = (Get-FileHash -Path $zipPath -Algorithm SHA256).Hash.ToLower()
        if ($expected.ToLower() -ne $actual) {
            Write-Log "ERROR: checksum mismatch. Expected $expected got $actual. Aborting."
            exit 1
        }
        Write-Log "Checksum verified."
    }

    $extractDir = Join-Path $TempDir "extracted"
    Expand-Archive -Path $zipPath -DestinationPath $extractDir -Force
    # node_modules ships inside the release zip (built + pruned in CI),
    # so nothing further to install here — extract and swap only.

    Write-Log "Stopping service $ServiceName..."
    Stop-Service -Name $ServiceName -ErrorAction Stop
    Start-Sleep -Seconds 2

    # Backup current live folder, then promote the new one
    if (Test-Path $BackupRoot) { Remove-Item $BackupRoot -Recurse -Force }
    if (Test-Path $AppRoot) { Rename-Item -Path $AppRoot -NewName (Split-Path $BackupRoot -Leaf) }
    Rename-Item -Path $extractDir -NewName (Split-Path $AppRoot -Leaf)
    Move-Item -Path (Join-Path $TempDir (Split-Path $AppRoot -Leaf)) -Destination $AppRoot

    Set-Content -Path $VersionFile -Value $latestTag

    Write-Log "Starting service $ServiceName..."
    Start-Service -Name $ServiceName
    Start-Sleep -Seconds 5

    # Health check with retries
    $healthy = $false
    for ($i = 0; $i -lt 5; $i++) {
        try {
            $resp = Invoke-WebRequest -Uri $HealthCheckUrl -UseBasicParsing -TimeoutSec 5
            if ($resp.StatusCode -eq 200) { $healthy = $true; break }
        } catch { Start-Sleep -Seconds 3 }
    }

    if (-not $healthy) {
        Write-Log "Health check FAILED. Rolling back to previous version..."
        Stop-Service -Name $ServiceName -ErrorAction SilentlyContinue

        if (-not (Test-Path $BackupRoot)) {
            # No backup exists — do NOT delete AppRoot in this case: it
            # still contains the last known-good version (just running
            # the new/broken code that failed health). Leave it in place
            # rather than destroying the only copy we have.
            Write-Log "ERROR: no backup exists to roll back to. Leaving $AppRoot untouched (still contains the failed update) rather than deleting it. Manual intervention required."
            Start-Service -Name $ServiceName -ErrorAction SilentlyContinue
            exit 1
        }

        Remove-Item $AppRoot -Recurse -Force
        Rename-Item -Path $BackupRoot -NewName (Split-Path $AppRoot -Leaf)
        Start-Service -Name $ServiceName
        Write-Log "Rollback complete. Still on previous version."
        exit 1
    }


    Write-Log "Update to $latestTag succeeded and health check passed."
    Remove-Item $TempDir -Recurse -Force -ErrorAction SilentlyContinue
}
catch {
    Write-Log "ERROR: $($_.Exception.Message)"
    exit 1
}
