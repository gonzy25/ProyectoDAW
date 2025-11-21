# Script para iniciar toda la aplicación AceNet

Write-Host @"
    
    ============================================
                                            
         AceNet - Club de Padel          
                                            
       Sistema de Gestion de Reservas   
                                            
    ============================================
    
"@ -ForegroundColor Cyan

Write-Host "Inicializando la aplicacion completa...`n" -ForegroundColor Green

# Función para verificar si un puerto está en uso
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Verificar MySQL
Write-Host "[*] Verificando servicios..." -ForegroundColor Yellow
$mysqlRunning = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue | Where-Object {$_.Status -eq 'Running'}
if (-not $mysqlRunning) {
    Write-Host "[!] MySQL no esta ejecutandose. Asegurate de iniciar MySQL primero." -ForegroundColor Red
    Write-Host "    Puedes iniciarlo desde MySQL Workbench o services.msc`n" -ForegroundColor Yellow
}

# Iniciar Backend en una nueva ventana
Write-Host "[*] Iniciando Backend (Python/Flask)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-backend.ps1"
Start-Sleep -Seconds 3

# Iniciar Frontend en una nueva ventana
Write-Host "[*] Iniciando Frontend (React)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-frontend.ps1"

Write-Host "`n[OK] Aplicacion iniciada!" -ForegroundColor Green
Write-Host @"

[INFO] Servicios disponibles:
   - Frontend: http://localhost:3000
   - Backend:  http://localhost:5000
   - API:      http://localhost:5000/api

[NOTAS]
   - El backend puede tardar unos segundos en estar listo
   - El frontend se abrira automaticamente en tu navegador
   - Asegurate de tener MySQL ejecutandose

[STOP] Para detener la aplicacion:
   - Cierra las ventanas de PowerShell que se abrieron
   - O presiona Ctrl+C en cada una

"@ -ForegroundColor White

Write-Host "Disfruta usando AceNet!" -ForegroundColor Green
