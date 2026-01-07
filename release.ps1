$ErrorActionPreference = 'Stop'

param(
  [string]$Message = '',
  [switch]$Push,
  [string]$Remote = 'origin'
)

function Exec([string]$cmd) {
  $out = & git @($cmd -split ' ')
  if ($LASTEXITCODE -ne 0) { throw "git failed: $cmd" }
  return $out
}

function Get-LatestSemverTag {
  $tags = & git tag --list
  if ($LASTEXITCODE -ne 0) { throw "git failed: tag --list" }
  $semver = @()
  foreach ($t in $tags) {
    $tt = ($t | Out-String).Trim()
    if ($tt -match '^v?\d+\.\d+\.\d+$') { $semver += $tt }
  }
  if ($semver.Count -eq 0) { return $null }
  $sorted = $semver | Sort-Object { [version]($_.TrimStart('v')) }
  return $sorted[-1]
}

function Next-Tag([string]$latest) {
  if (-not $latest) { return 'v0.0.1' }
  $v = [version]($latest.TrimStart('v'))
  $next = New-Object System.Version($v.Major, $v.Minor, ($v.Build + 1))
  return "v$($next.Major).$($next.Minor).$($next.Build)"
}

if (-not (Test-Path -Path '.git')) {
  Write-Error "Not a git repository: $(Get-Location)"
  exit 1
}

Exec 'fetch --tags'

$latest = Get-LatestSemverTag
$nextTag = Next-Tag $latest

$status = & git status --porcelain
if ($LASTEXITCODE -ne 0) { throw "git failed: status" }
if (-not $status) {
  Write-Host "Working tree clean, nothing to commit."
  exit 0
}

& git add -A
if ($LASTEXITCODE -ne 0) { throw "git failed: add -A" }

if (-not $Message) { $Message = "chore: release $nextTag" }
& git commit -m $Message
if ($LASTEXITCODE -ne 0) { throw "git failed: commit" }

& git tag $nextTag
if ($LASTEXITCODE -ne 0) { throw "git failed: tag $nextTag" }

Write-Host "Created commit and tag: $nextTag"

if ($Push) {
  & git push $Remote HEAD
  if ($LASTEXITCODE -ne 0) { throw "git failed: push" }
  & git push $Remote $nextTag
  if ($LASTEXITCODE -ne 0) { throw "git failed: push tag" }
  Write-Host "Pushed to $Remote (commit + tag)."
}

