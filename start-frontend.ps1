# Script para iniciar el frontend de AceNet

Write-Host "Iniciando Frontend de AceNet..." -ForegroundColor Green

# Navegar al directorio del frontend
Set-Location -Path $PSScriptRoot\frontend

# Verificar si existen los node_modules
if (-Not (Test-Path "node_modules")) {
    Write-Host "[!] No se encontraron dependencias. Instalando..." -ForegroundColor Yellow
    npm install
    Write-Host "[OK] Dependencias instaladas" -ForegroundColor Green
}

# Iniciar el servidor de desarrollo
Write-Host "`n[*] Iniciando servidor de desarrollo React..." -ForegroundColor Green
Write-Host "[*] La aplicacion se abrira en: http://localhost:3000" -ForegroundColor Cyan
Write-Host "[STOP] Presiona Ctrl+C para detener el servidor`n" -ForegroundColor Yellow

npm start
