# Script para iniciar el backend de AceNet

Write-Host "Iniciando Backend de AceNet..." -ForegroundColor Green

# Navegar al directorio del backend
Set-Location -Path $PSScriptRoot\backend

# Verificar si existe el entorno virtual
if (-Not (Test-Path "venv")) {
    Write-Host "[!] No se encontro el entorno virtual. Creandolo..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "[OK] Entorno virtual creado" -ForegroundColor Green
}

# Activar el entorno virtual
Write-Host "[*] Activando entorno virtual..." -ForegroundColor Cyan
.\venv\Scripts\Activate.ps1

# Verificar si existe el archivo .env
if (-Not (Test-Path ".env")) {
    Write-Host "[!] No se encontro el archivo .env" -ForegroundColor Yellow
    Write-Host "[*] Copia .env.example a .env y configura tus credenciales" -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[OK] Archivo .env creado desde .env.example" -ForegroundColor Green
        Write-Host "[!] No olvides editar .env con tus credenciales!" -ForegroundColor Yellow
    }
}

# Instalar dependencias si es necesario
Write-Host "[*] Verificando dependencias..." -ForegroundColor Cyan
pip install -r requirements.txt

# Iniciar el servidor
Write-Host "`n[*] Iniciando servidor Flask..." -ForegroundColor Green
Write-Host "[*] El servidor estara disponible en: http://localhost:5000" -ForegroundColor Cyan
Write-Host "[STOP] Presiona Ctrl+C para detener el servidor`n" -ForegroundColor Yellow

python app.py
