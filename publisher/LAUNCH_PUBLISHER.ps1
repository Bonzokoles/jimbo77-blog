<#
.SYNOPSIS
    JIMBO77 Publisher MOA — PowerShell launcher
.DESCRIPTION
    Starts all 3 sub-agents and provides usage info.
    Run from publisher/ directory.
#>
$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "JIMBO77 Publisher MOA"

Write-Host "`n=== JIMBO77 PUBLISHER MOA SYSTEM ===" -ForegroundColor Cyan
Write-Host "Blog: jimbo77.org  |  Deploy: Vercel`n" -ForegroundColor DarkGray

Set-Location $PSScriptRoot

# Check .env
if (-not (Test-Path ".env")) {
    Write-Host "[WARN] .env not found! Copy .env.example → .env and fill API keys." -ForegroundColor Yellow
}

# Create venv if needed
if (-not (Test-Path "venv")) {
    Write-Host "[SETUP] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    & .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt
}
else {
    & .\venv\Scripts\Activate.ps1
}

Write-Host "`n[1/3] Starting SUB-AGENTS..." -ForegroundColor Green

$agents = @(
    @{ Name = "Writer Agent"; Port = 6030; Script = "agents\writer_agent.py" },
    @{ Name = "SEO Agent"; Port = 6031; Script = "agents\seo_agent.py" },
    @{ Name = "Research Agent"; Port = 6062; Script = "agents\research_agent.py" }
)

foreach ($a in $agents) {
    $cmd = "cd '$PSScriptRoot'; .\venv\Scripts\Activate.ps1; python $($a.Script)"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd -WindowStyle Minimized
    Write-Host "  + $($a.Name) -> http://localhost:$($a.Port)" -ForegroundColor DarkCyan
}

Write-Host "`n[2/3] Waiting 5s for agents to boot..." -ForegroundColor DarkGray
Start-Sleep -Seconds 5

Write-Host "`n[3/3] ALL SYSTEMS GO!" -ForegroundColor Green
Write-Host @"

===================================================
  Writer Agent:    http://localhost:6030
  SEO Agent:       http://localhost:6031
  Research Agent:  http://localhost:6062
===================================================

USAGE:
  python publisher_workflow.py --daily --deploy
  python publisher_workflow.py --daily --category "AI Odkrycia" --deploy
  python publisher_workflow.py --topic "Moj nowy projekt" --tags AI Dev --deploy

"@ -ForegroundColor White
