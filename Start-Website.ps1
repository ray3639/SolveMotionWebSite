Write-Host "=== SolveMotionWebSite Local Staging Server ===" -ForegroundColor Cyan
Set-Location "C:\src"
Write-Host "Serving from: C:\src" -ForegroundColor Yellow
Write-Host "Production-style staging URL:" -ForegroundColor Green
Write-Host "http://localhost:8080/SolveMotionWebSite/applications.html" -ForegroundColor Cyan
Write-Host "SolveMind direct URL:" -ForegroundColor Green
Write-Host "http://localhost:8080/SolveMotionWebSite/webapps/solvemind/" -ForegroundColor Cyan
Write-Host "Starting: py -m http.server 8080" -ForegroundColor Green
py -m http.server 8080