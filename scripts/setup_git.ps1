# setup_git.ps1
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$zipPath = "$env:TEMP\mingit.zip"
$destPath = "$env:LOCALAPPDATA\Programs\MinGit"

Write-Host "Downloading MinGit..."
Invoke-WebRequest -Uri "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/MinGit-2.44.0-64-bit.zip" -OutFile $zipPath

Write-Host "Extracting..."
Expand-Archive -Path $zipPath -DestinationPath $destPath -Force
Remove-Item $zipPath -Force

$gitExe = "$destPath\cmd\git.exe"
if (Test-Path $gitExe) {
    Write-Host "Git installed successfully:"
    & $gitExe --version
} else {
    Write-Host "Failed to find git.exe"
}
