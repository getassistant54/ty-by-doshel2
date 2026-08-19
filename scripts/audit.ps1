$MaxLines = 150
$Errors = @()
$Warnings = @()

Write-Host "Audit starting..."

$files = Get-ChildItem -Recurse -Include *.js, *.html, *.css | Where-Object {
    $_.FullName -notmatch '\\.git|node_modules|notibot-bridge\.js|vendor-lucide\.js|tailwind\.min\.css'
}

foreach ($file in $files) {
    $rel = $file.FullName.Replace($pwd.Path + "\", "")
    $lines = (Get-Content -Path $file.FullName).Count
    if ($lines -gt $MaxLines) {
        $Errors += "[FILE_SIZE] $rel ($lines lines > limit $MaxLines)"
    }
    
    $content = Get-Content -Path $file.FullName -Raw
    if ($content -match 'api[_-]?key\s*=\s*[''"][a-zA-Z0-9_\-]{16,}[''"]') {
        $Errors += "[SECRET_IN_CODE] $rel has possible API key"
    }
    
    if ($rel -notmatch 'bridge\.js|index\.html' -and $content -match 'window\.notibot\.') {
        $Warnings += "[NOTIBOT_OUTSIDE_BRIDGE] $rel calls window.notibot directly"
    }
}

if ($Warnings.Count -gt 0) {
    Write-Host "Warnings:" -ForegroundColor Yellow
    foreach ($w in $Warnings) { Write-Host "  * $w" }
}

if ($Errors.Count -gt 0) {
    Write-Host "Errors:" -ForegroundColor Red
    foreach ($e in $Errors) { Write-Host "  * $e" }
    exit 1
} else {
    Write-Host "SUCCESS: All files satisfy max $MaxLines lines and architecture rules." -ForegroundColor Green
    exit 0
}
