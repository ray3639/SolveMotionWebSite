Write-Host "=== SolveMotionWebSite Local Server ===" -ForegroundColor Cyan
Set-Location "C:\src\SolveMotionWebSite"
Write-Host "Serving from: C:\src\SolveMotionWebSite" -ForegroundColor Yellow
Write-Host "Starting: py -m http.server 8080" -ForegroundColor Green
py -m http.server 8080
