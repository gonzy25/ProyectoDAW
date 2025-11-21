# Configuración de Base de Datos MySQL para AceNet

## Instrucciones de Instalación

### 1. Instalar MySQL
- Descarga MySQL desde: https://dev.mysql.com/downloads/mysql/
- Para Windows, puedes usar el instalador MySQL Installer

### 2. Crear la Base de Datos

Ejecuta el siguiente comando en MySQL Workbench o en el terminal:

```bash
mysql -u root -p < schema.sql
```

O conecta a MySQL y ejecuta:

```sql
source schema.sql
```

### 3. Configurar Credenciales

Crea un archivo `.env` en la carpeta `backend` basado en `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=acenet_db
DB_PORT=3306
```

## Estructura de la Base de Datos

### Tabla: usuarios
Almacena la información de los usuarios del club.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único del usuario (PK) |
| nombre | VARCHAR(100) | Nombre del usuario |
| apellidos | VARCHAR(100) | Apellidos del usuario |
| email | VARCHAR(120) | Email único del usuario |
| telefono | VARCHAR(20) | Teléfono de contacto |
| password_hash | VARCHAR(255) | Contraseña hasheada |
| fecha_registro | DATETIME | Fecha de registro |
| activo | BOOLEAN | Estado del usuario |

### Tabla: pistas
Almacena la información de las pistas de pádel.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único de la pista (PK) |
| nombre | VARCHAR(100) | Nombre de la pista |
| ubicacion | VARCHAR(200) | Ubicación física |
| tipo_superficie | VARCHAR(50) | Tipo de superficie |
| estado | ENUM | Estado: disponible, no_disponible, mantenimiento |
| descripcion | TEXT | Descripción detallada |

### Tabla: reservas
Almacena las reservas de pistas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único de la reserva (PK) |
| usuario_id | INT | ID del usuario (FK) |
| pista_id | INT | ID de la pista (FK) |
| fecha | DATE | Fecha de la reserva |
| hora_inicio | TIME | Hora de inicio |
| duracion | INT | Duración en minutos |
| estado | ENUM | Estado: confirmada, cancelada, completada |
| fecha_creacion | DATETIME | Fecha de creación |

## Vistas

### vista_reservas_completas
Vista que combina información de reservas, usuarios y pistas para consultas complejas.

## Procedimientos Almacenados

### verificar_disponibilidad(pista_id, fecha, hora)
Verifica si una pista está disponible en un horario específico.

## Triggers

### before_insert_reserva
Previene la creación de reservas duplicadas para la misma pista y horario.

## Eventos Programados

### actualizar_reservas_completadas
Actualiza automáticamente el estado de reservas antiguas a "completada" diariamente.

## Usuarios de Ejemplo

El script crea usuarios de ejemplo con la contraseña "password123" (debe ser hasheada en la aplicación):

- admin@acenet.com
- juan@example.com
- maria@example.com

## Comandos Útiles

### Ver todas las reservas activas:
```sql
SELECT * FROM vista_reservas_completas WHERE estado_reserva = 'confirmada';
```

### Ver disponibilidad de una pista:
```sql
CALL verificar_disponibilidad(1, '2025-11-10', '10:00:00');
```

### Listar todas las pistas disponibles:
```sql
SELECT * FROM pistas WHERE estado = 'disponible';
```
