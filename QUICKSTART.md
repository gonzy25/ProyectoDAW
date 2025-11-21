# Guía de Inicio Rápido - AceNet

##  Instalación Rápida

### Paso 1: Instalar MySQL
1. Descarga MySQL desde: https://dev.mysql.com/downloads/mysql/
2. Instala y configura MySQL con un usuario root

### Paso 2: Crear la Base de Datos
Abre MySQL Workbench o el terminal de MySQL:
```bash
mysql -u root -p
```
Luego ejecuta:
```sql
source database/schema.sql
```

### Paso 3: Configurar Backend
```powershell
cd backend
python -m venv venv
```

**Nota importante:** Si al activar el entorno virtual obtienes un error de políticas de ejecución, ejecuta primero:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego continúa con:
```powershell
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```
Edita `.env` con tus credenciales de MySQL.

### Paso 4: Configurar Frontend
```powershell
cd frontend
npm install
```

### Paso 5: Iniciar la Aplicación
Opción 1 - Automático (recomendado):
```powershell
.\start-app.ps1
```

Opción 2 - Manual:
Terminal 1 (Backend):
```powershell
.\start-backend.ps1
```

Terminal 2 (Frontend):
```powershell
.\start-frontend.ps1
```

## 📱 Acceder a la Aplicación

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:5000/api

## 👤 Usuarios de Prueba

Después de ejecutar el schema.sql, tendrás usuarios de ejemplo (la contraseña debe ser hasheada al registrarte):

- admin@acenet.com
- juan@example.com
- maria@example.com

## 🎯 Primeros Pasos

1. Abre http://localhost:3000
2. Haz clic en "Regístrate aquí"
3. Completa el formulario de registro
4. Una vez dentro, explora:
   - Ver Pistas
   - Nueva Reserva
   - Mis Reservas

## ❓ Solución de Problemas

### Error de conexión a MySQL
- Verifica que MySQL esté ejecutándose
- Comprueba las credenciales en `.env`
- Asegúrate de que el puerto 3306 esté libre

### Error en el Frontend
- Ejecuta `npm install` en la carpeta frontend
- Verifica que el puerto 3000 esté libre
- Limpia el cache: `npm cache clean --force`

### Error en el Backend
- Activa el entorno virtual: `venv\Scripts\activate`
- Si hay error de políticas: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Instala dependencias: `pip install -r requirements.txt`
- Verifica que el puerto 5000 esté libre

## 📞 Contacto

Para más información, consulta el README.md principal del proyecto.
