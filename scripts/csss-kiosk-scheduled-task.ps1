<#
  Registers the CSSS kiosk autoupdater as a Windows scheduled task.

  Run this script once from an elevated PowerShell session. The resulting
  task runs as SYSTEM every 30 minutes and does not depend on a user being
  logged in.
#>

[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$TaskName = "CSSS-Kiosk-Updater",

    [ValidateNotNullOrEmpty()]
    [string]$UpdaterScript = "C:\apps\scripts\csss-kiosk\csss-kiosk-autoupdater.ps1",

    [ValidateRange(1, 1439)]
    [int]$IntervalMinutes = 30
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal($identity)
$administratorRole = [Security.Principal.WindowsBuiltInRole]::Administrator

if (-not $currentPrincipal.IsInRole($administratorRole)) {
    throw "Run this script from an elevated PowerShell session."
}

if (-not (Test-Path -LiteralPath $UpdaterScript -PathType Leaf)) {
    throw "Updater script not found: $UpdaterScript"
}

$updaterPath = (Resolve-Path -LiteralPath $UpdaterScript).Path
$workingDirectory = Split-Path -Path $updaterPath -Parent
$powershellPath = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$powershellArguments = '-NoProfile -NonInteractive -ExecutionPolicy Bypass -File "{0}"' -f $updaterPath

$action = New-ScheduledTaskAction `
    -Execute $powershellPath `
    -Argument $powershellArguments `
    -WorkingDirectory $workingDirectory

$trigger = New-ScheduledTaskTrigger `
    -Once `
    -At (Get-Date).AddMinutes(1) `
    -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes)

$principal = New-ScheduledTaskPrincipal `
    -UserId "SYSTEM" `
    -LogonType ServiceAccount `
    -RunLevel Highest

$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -MultipleInstances IgnoreNew

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Settings $settings `
    -Description "Checks GitHub Releases for kiosk application updates every $IntervalMinutes minutes." `
    -Force | Out-Null

$taskInfo = Get-ScheduledTaskInfo -TaskName $TaskName

Write-Host "Scheduled task '$TaskName' registered successfully."
Write-Host "Next run: $($taskInfo.NextRunTime)"
