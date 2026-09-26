$ErrorActionPreference = "Stop"
. "C:\src\GlobalDevEnvironmentLoader.ps1"
Write-Host "=== SolveMotionWebSite Local Staging Server ===" -ForegroundColor Cyan
Set-Location "C:\src"
Write-Host "Serving from: C:\src" -ForegroundColor Yellow
Write-Host "Production-style staging URL:" -ForegroundColor Green
Write-Host "http://localhost:8080/SolveMotionWebSite/applications.html" -ForegroundColor Cyan
Write-Host "SolveMind direct URL:" -ForegroundColor Green
Write-Host "http://localhost:8080/SolveMotionWebSite/webapps/solvemind/" -ForegroundColor Cyan
Write-Host "Starting: governed Python http.server on loopback port 8080" -ForegroundColor Green
& $env:SOLVEMOTION_BACKEND_PYTHON -m http.server 8080 --bind 127.0.0.1