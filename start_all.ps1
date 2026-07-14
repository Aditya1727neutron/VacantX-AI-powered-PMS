# Smart Parking — Start All Services
# This script starts the AI module, backend, and frontend in separate terminals.
# Run this from the project root: .\start_all.ps1

Write-Host ""
Write-Host ('=' * 44) -ForegroundColor Cyan
Write-Host '  Smart Parking — Starting All Services' -ForegroundColor Cyan
Write-Host ('=' * 44) -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot
$venvPython = Join-Path $projectRoot '.venv\Scripts\python.exe'
$aiDir = Join-Path $projectRoot 'ai_module'
$backendDir = Join-Path $projectRoot 'backend'
$frontendDir = Join-Path $projectRoot 'frontend'

Write-Host '[1/3] Starting AI Module on port 8001...' -ForegroundColor Yellow
$aiCommand = "& { Set-Location -LiteralPath '$aiDir'; & '$venvPython' src/prediction_api.py }"
Start-Process powershell -ArgumentList @('-NoExit', '-Command', $aiCommand)

Start-Sleep -Seconds 2

Write-Host '[2/3] Starting Backend on port 8000...' -ForegroundColor Yellow
$backendCommand = "& { Set-Location -LiteralPath '$backendDir'; & '$venvPython' -m app.main }"
Start-Process powershell -ArgumentList @('-NoExit', '-Command', $backendCommand)

Start-Sleep -Seconds 3

Write-Host '[3/3] Starting Frontend on port 5173...' -ForegroundColor Yellow
$frontendCommand = "& { Set-Location -LiteralPath '$frontendDir'; npm run dev }"
Start-Process powershell -ArgumentList @('-NoExit', '-Command', $frontendCommand)

Write-Host ""
Write-Host ('=' * 44) -ForegroundColor Green
Write-Host '  All services started!' -ForegroundColor Green
Write-Host '  Frontend:  http://localhost:5173' -ForegroundColor White
Write-Host '  Backend:   http://localhost:8000/docs' -ForegroundColor White
Write-Host '  AI Module: http://localhost:8001/health' -ForegroundColor White
Write-Host ('=' * 44) -ForegroundColor Green
Write-Host ""
