# AceNet - Sistema de Gestión de Club de Pádel

## Descripción General

AceNet es una aplicación web full-stack moderna y completa para la gestión integral de un club de pádel. La plataforma permite a los usuarios registrarse, explorar pistas disponibles, realizar reservas en tiempo real y gestionar todas sus reservas de manera eficiente e intuitiva.

El sistema está diseñado siguiendo las mejores prácticas de desarrollo web moderno, implementando una arquitectura cliente-servidor robusta con separación clara entre el frontend (React), backend (Flask) y la capa de persistencia (MySQL).

## Tecnologías

### Frontend
- **React** 18.2.0
- **React Router** 6.20.0
- **Axios** para peticiones HTTP
- **CSS3** para estilos

### Backend
- **Python** 3.x
- **Flask** 3.0.0
- **Flask-SQLAlchemy** para ORM
- **Flask-JWT-Extended** para autenticación
- **Flask-CORS** para CORS
- **PyMySQL** para conexión con MySQL

### Base de Datos
- **MySQL** 8.x

## Estructura del Proyecto

```
ProyectoDAW/
├── frontend/                 # Aplicación React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js       # Configuración de Axios
│   │   ├── components/      # Componentes React (JS)
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Navbar.js
│   │   │   ├── CourtList.js
│   │   │   ├── BookingForm.js
│   │   │   └── MyBookings.js
│   │   ├── styles/          # Estilos CSS
│   │   │   ├── App.css
│   │   │   ├── index.css
│   │   │   ├── Login.css
│   │   │   ├── Register.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Navbar.css
│   │   │   ├── CourtList.css
│   │   │   ├── BookingForm.css
│   │   │   └── MyBookings.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/                  # API REST en Flask
│   ├── models/              # Modelos de base de datos
│   │   ├── user.py
│   │   ├── court.py
│   │   └── booking.py
│   ├── routes/              # Rutas de la API
│   │   ├── auth_routes.py
│   │   ├── court_routes.py
│   │   ├── booking_routes.py
│   │   └── user_routes.py
│   ├── app.py               # Aplicación principal
│   ├── requirements.txt
│   └── .env.example
│
└── database/                # Scripts de base de datos
    ├── schema.sql           # Esquema de la BD
    └── README.md
```

## Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- Python 3.8 o superior
- MySQL 8.0 o superior

### 1. Configurar la Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar el script de creación
source database/schema.sql
```

O desde MySQL Workbench, ejecuta el archivo `database/schema.sql`.

### 2. Configurar el Backend

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
copy .env.example .env
# Editar .env con tus credenciales de MySQL
```

Edita el archivo `.env` con tus credenciales:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=acenet_db
DB_PORT=3306
SECRET_KEY=tu_clave_secreta
JWT_SECRET_KEY=tu_jwt_secret_key
```

### 3. Configurar el Frontend

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install
```

## Ejecución

### Iniciar el Backend

```bash
cd backend
venv\Scripts\activate  # En Windows
python app.py
```

El servidor se ejecutará en `http://localhost:5000`

### Iniciar el Frontend

```bash
cd frontend
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## Funcionalidades Principales

### Sistema de Autenticación y Autorización

**Registro de Usuarios:**
- Formulario completo con validación de campos (nombre, apellidos, email, teléfono, contraseña)
- Validación de contraseñas coincidentes en el cliente
- Verificación de email único en el servidor
- Hasheo seguro de contraseñas usando Werkzeug (scrypt)
- Carrusel de imágenes de pádel como fondo visual atractivo
- Logo de la marca en esquina superior izquierda

**Inicio de Sesión:**
- Autenticación mediante email y contraseña
- Generación de JWT (JSON Web Token) para sesiones seguras
- Token almacenado en localStorage del navegador
- Persistencia de sesión entre recargas de página
- Redirección automática al dashboard tras login exitoso
- Mismo diseño visual que el registro (carrusel de imágenes)

**Gestión de Sesiones:**
- Tokens JWT con expiración configurable
- Renovación automática de tokens mediante interceptores de Axios
- Cierre de sesión con limpieza completa del localStorage
- Protección de rutas mediante React Router
- Redirección automática a login si no hay sesión activa

### Dashboard Interactivo

**Panel Principal:**
- Mensaje de bienvenida personalizado con el nombre del usuario
- 4 tarjetas de acceso rápido con imágenes de fondo:
  - **Ver Pistas**: Acceso al catálogo completo de pistas
  - **Nueva Reserva**: Formulario de creación de reservas
  - **Mis Reservas**: Gestión de reservas personales
  - **Mi Perfil**: Información del usuario (email, teléfono)
- Efecto hover con zoom en las imágenes de las tarjetas
- Textos con sombras para mejorar legibilidad sobre imágenes

**Módulo de Noticias de Pádel:**
- Carrusel automático con 4 noticias actualizadas del mundo del pádel
- Cambio automático cada 5 segundos
- Navegación manual mediante botones laterales (‹ y ›)
- Indicadores de progreso clicables en la parte inferior
- Cada noticia incluye:
  - Imagen de fondo relacionada
  - Fecha de publicación
  - Título destacado
  - Descripción breve
- Diseño split-screen: imagen a un lado, detalles con gradiente al otro
- Transiciones suaves entre noticias
- Diseño responsive que se adapta a móviles

### Gestión de Pistas

**Visualización de Pistas:**
- Grid responsivo que muestra todas las pistas disponibles
- Cada tarjeta de pista incluye:
  - Imagen de la pista (con fallback a imagen por defecto)
  - Nombre de la pista
  - Ubicación física dentro del club
  - Tipo de superficie (césped artificial, cristal templado, hormigón poroso)
  - Estado actual (disponible/no disponible/mantenimiento)
  - Descripción detallada
- Efecto hover con overlay "Ver Pista"
- Badge de estado con colores distintivos
- Imágenes con manejo de errores (onError fallback)

**Características de las Pistas:**
- Estado en tiempo real de disponibilidad
- Información técnica detallada
- URLs de imágenes almacenadas en base de datos
- Filtrado por estado disponible para reservas

### Sistema de Reservas

**Creación de Reservas:**
- Formulario intuitivo con los siguientes campos:
  - **Selección de Pista**: Dropdown con solo pistas disponibles
  - **Fecha**: Date picker con validación de fecha mínima (hoy)
  - **Hora de Inicio**: Select con franjas horarias de 8:00 a 22:30 (intervalos de 30 min)
  - **Duración**: Opciones de 60, 90 o 120 minutos
- Validaciones en tiempo real de todos los campos
- El usuario_id se obtiene automáticamente del token JWT (seguridad)
- Verificación de conflictos de horario en el servidor
- Confirmación visual de reserva exitosa
- Mensajes de error detallados si hay problemas

**Mis Reservas:**
- Lista completa de todas las reservas del usuario autenticado
- Ordenadas por fecha descendente (más recientes primero)
- Cada reserva muestra:
  - Nombre de la pista reservada
  - Fecha de la reserva
  - Hora de inicio y duración
  - Estado (confirmada/cancelada/completada)
  - Botón de cancelación (solo para reservas futuras)
- Confirmación antes de cancelar
- Actualización automática tras cancelar
- Badge de estado con colores:
  - Verde: confirmada
  - Rojo: cancelada
  - Gris: completada

**Reglas de Negocio:**
- No se pueden reservar pistas en el pasado
- No se pueden hacer reservas duplicadas (mismo horario/pista)
- Solo se pueden cancelar reservas propias
- Las reservas se marcan como completadas automáticamente tras su fecha
- Verificación de disponibilidad de pista antes de confirmar

### 👤 Perfil de Usuario

**Información Personal:**
- Visualización de datos del usuario:
  - Nombre completo
  - Email
  - Teléfono
  - Fecha de registro
- Tarjeta en el dashboard con imagen de fondo
- Datos protegidos mediante autenticación JWT

### Interfaz de Usuario

**Diseño Visual:**
- **Navbar Fijo Superior:**
  - Logo de AceNet (50px) en esquina izquierda
  - Links de navegación: Inicio, Pistas, Nueva Reserva, Mis Reservas
  - Información del usuario (nombre con icono)
  - Botón de cerrar sesión (rojo)
  - Color de fondo: #2c3e50 (azul oscuro)
  - Responsive con efectos hover

- **Login/Register:**
  - Carrusel de 4 imágenes de pádel de fondo
  - Transiciones fade entre imágenes cada 5 segundos
  - Overlay oscuro semitransparente (50%)
  - Logo de marca en esquina superior izquierda (60px)
  - Formulario centrado en tarjeta blanca con sombra
  - Animación de entrada (fadeInUp)

- **Dashboard:**
  - Diseño de tarjetas con imágenes de fondo
  - Gradientes oscuros para legibilidad
  - Efectos hover con zoom en imágenes
  - Módulo de noticias con diseño moderno
  - Colores corporativos consistentes

- **Pistas:**
  - Grid responsivo adaptable
  - Tarjetas con imágenes, overlay y hover effects
  - Badge de estado con colores semánticos
  - Layout que se ajusta a diferentes tamaños de pantalla

**Elementos Visuales:**
- Favicon personalizado con logo de AceNet
- Apple touch icon para dispositivos móviles
- Theme color configurado (#2c3e50)
- Sombras sutiles (box-shadow)
- Bordes redondeados (border-radius)
- Transiciones suaves (0.3s ease)
- Tipografía clara y legible

## Stack Tecnológico Detallado

### Frontend (React)

**Librerías y Frameworks:**
- **React 18.2.0**: Biblioteca principal para UI con componentes funcionales y hooks
  - useState: Gestión de estado local en componentes
  - useEffect: Efectos secundarios (llamadas API, timers)
  - Componentes funcionales modernos
  
- **React Router 6.20.0**: Navegación SPA (Single Page Application)
  - BrowserRouter: Enrutamiento basado en historial del navegador
  - Routes y Route: Definición de rutas
  - Link y Navigate: Navegación programática
  - Rutas protegidas con redirección condicional
  - useNavigate hook para redirecciones

- **Axios 1.6.2**: Cliente HTTP para comunicación con API
  - Instancia configurada con baseURL
  - Interceptores de peticiones para agregar token JWT automáticamente
  - Manejo centralizado de headers (Authorization, Content-Type)
  - Gestión de errores con try-catch

**Organización del Código:**
- **Componentes**: Lógica de UI separada en archivos .js
- **Estilos**: CSS modular en carpeta styles/ separada
- **API**: Configuración centralizada de Axios y endpoints
- **Logo**: Assets en carpeta logo/

**Características Frontend:**
- SPA sin recarga de página
- Estado global mediante props drilling
- Persistencia de autenticación en localStorage
- Validación de formularios en cliente
- Manejo de estados de carga (loading)
- Manejo de errores con mensajes al usuario
- Código modular y reutilizable

### Backend (Flask/Python)

**Framework y Librerías:**
- **Flask 3.0.0**: Microframework web minimalista
  - Blueprints para organización modular de rutas
  - @app decorators para definir endpoints
  - Manejo de peticiones HTTP (GET, POST, PUT, DELETE)
  - Soporte para JSON como formato de intercambio

- **Flask-SQLAlchemy 3.1.1**: ORM (Object-Relational Mapping)
  - Modelos definidos como clases Python
  - Mapeo automático a tablas MySQL
  - Consultas mediante sintaxis orientada a objetos
  - Relaciones entre modelos (ForeignKey, relationships)
  - Migraciones y gestión de esquema

- **Flask-JWT-Extended 4.5.3**: Autenticación con tokens JWT
  - create_access_token(): Generación de tokens
  - @jwt_required(): Decorador para proteger rutas
  - get_jwt_identity(): Obtener ID de usuario del token
  - Manejo de tokens expirados, inválidos y faltantes
  - Configuración de ubicación del token (headers)

- **Flask-CORS 4.0.0**: Gestión de CORS (Cross-Origin Resource Sharing)
  - Configuración manual con @app.before_request
  - Headers: Access-Control-Allow-Origin, Allow-Headers, Allow-Methods
  - Manejo de peticiones OPTIONS (preflight)

- **PyMySQL 1.1.0 + mysql-connector-python 8.2.0**: Drivers MySQL
  - Conexión a base de datos MySQL
  - Soporte para autenticación caching_sha2_password
  - Requiere cryptography para cifrado

- **python-dotenv 1.0.0**: Variables de entorno
  - Carga de configuración desde archivo .env
  - Separación de secretos del código fuente

- **Werkzeug 3.0.1**: Utilidades WSGI
  - generate_password_hash(): Hasheo seguro de contraseñas
  - check_password_hash(): Verificación de contraseñas

**Arquitectura Backend:**
- **Patrón MVC adaptado**:
  - Models: Definición de entidades (User, Court, Booking)
  - Routes: Controladores con lógica de negocio
  - Views: Respuestas JSON (API REST)

- **Estructura modular**:
  - app.py: Aplicación principal, configuración, registro de blueprints
  - database.py: Instancia de SQLAlchemy separada (evita imports circulares)
  - models/: Modelos de base de datos
  - routes/: Blueprints organizados por recurso

**Modelos de Datos:**

```python
User (usuarios):
- id (PK)
- nombre, apellidos
- email (unique)
- telefono
- password_hash
- activo (boolean)
- fecha_registro (timestamp)
- Métodos: set_password(), check_password(), to_dict()

Court (pistas):
- id (PK)
- nombre
- ubicacion
- tipo_superficie
- estado (enum: disponible/no_disponible/mantenimiento)
- descripcion
- imagen_url
- Relación: One-to-Many con Booking

Booking (reservas):
- id (PK)
- usuario_id (FK -> usuarios)
- pista_id (FK -> pistas)
- fecha
- hora_inicio
- duracion (minutos)
- estado (enum: confirmada/cancelada/completada)
- fecha_creacion (timestamp)
- Relaciones: Many-to-One con User y Court
```

**API REST Endpoints:**

*Autenticación (auth_routes.py):*
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (protegido)

*Pistas (court_routes.py):*
- GET /api/courts (público)
- GET /api/courts/:id
- POST /api/courts (protegido)
- PUT /api/courts/:id (protegido)
- DELETE /api/courts/:id (protegido)

*Reservas (booking_routes.py):*
- GET /api/bookings (protegido)
- GET /api/bookings/user/:userId (protegido)
- POST /api/bookings (protegido)
- PUT /api/bookings/:id (protegido)
- DELETE /api/bookings/:id (protegido)
- GET /api/bookings/availability (protegido)

*Usuarios (user_routes.py):*
- GET /api/users/:id (protegido)
- PUT /api/users/:id (protegido)

**Seguridad Backend:**
- Contraseñas hasheadas con scrypt (Werkzeug)
- JWT tokens con secret keys configurables
- Validación de datos de entrada
- Autorización por usuario (solo puede ver/modificar sus datos)
- Manejo de errores con códigos HTTP apropiados
- CORS configurado para desarrollo local

### Base de Datos (MySQL)

**Esquema de Datos:**
- 3 tablas principales con relaciones
- Claves primarias auto-incrementales
- Claves foráneas con restricciones
- Índices para optimización de consultas
- Tipos de datos apropiados (VARCHAR, TEXT, DATETIME, ENUM, INT)

**Características Avanzadas:**

**Triggers:**
```sql
before_reserva_insert:
- Se ejecuta antes de insertar una reserva
- Verifica conflictos de horario
- Impide reservas duplicadas en misma pista/fecha/hora
- Lanza error si hay conflicto
```

**Vistas:**
```sql
vista_reservas_completas:
- JOIN de reservas, usuarios y pistas
- Muestra información completa de cada reserva
- Útil para consultas y reportes
```

**Procedimientos Almacenados:**
```sql
verificar_disponibilidad:
- Input: pista_id, fecha, hora_inicio
- Output: disponible (boolean)
- Lógica de negocio en base de datos
```

**Eventos:**
```sql
actualizar_reservas_completadas:
- Se ejecuta diariamente a las 00:00
- Marca como 'completadas' reservas pasadas
- Automatización de mantenimiento
```

**Datos Iniciales:**
- 4 pistas con imágenes de Unsplash
- Usuarios de ejemplo (contraseñas hasheadas)
- Configuración de tipos ENUM

## Flujo de Funcionamiento

### Flujo de Autenticación:

1. Usuario accede a /login
2. Introduce credenciales (email + password)
3. Frontend envía POST /api/auth/login
4. Backend verifica email existe en BD
5. Backend compara password hasheado
6. Backend genera JWT token con user.id
7. Backend responde: { token, user }
8. Frontend guarda token en localStorage
9. Frontend guarda user en estado (App.js)
10. Redirección automática a /dashboard
11. En cada petición posterior, Axios interceptor añade header: "Authorization: Bearer {token}"

### Flujo de Reserva:

1. Usuario navega a /booking
2. Frontend carga pistas disponibles (GET /api/courts)
3. Usuario llena formulario:
   - Selecciona pista
   - Elige fecha (>= hoy)
   - Elige hora (8:00-22:30)
   - Selecciona duración (60/90/120 min)
4. Click en "Reservar Pista"
5. Frontend envía POST /api/bookings con datos + JWT token
6. Backend extrae user_id del token JWT
7. Backend valida campos obligatorios
8. Backend verifica que pista existe y está disponible
9. Backend consulta BD por conflictos de horario
10. Si no hay conflicto:
    - Crea Booking con estado='confirmada'
    - Commit a base de datos
    - Trigger verifica disponibilidad
    - Responde 201 con reserva creada
11. Frontend muestra mensaje de éxito
12. Frontend resetea formulario
13. Usuario puede ver la reserva en /my-bookings

### Flujo de Carga de Pistas:

1. Usuario navega a /courts
2. Componente CourtList monta
3. useEffect ejecuta fetchCourts()
4. Axios GET /api/courts (endpoint público)
5. Backend consulta Court.query.all()
6. SQLAlchemy genera SQL SELECT * FROM pistas
7. Backend serializa con court.to_dict()
8. Backend añade imagen_url o fallback
9. Responde JSON array de pistas
10. Frontend recibe response.data
11. useState actualiza courts
12. React renderiza grid de tarjetas
13. Cada tarjeta muestra imagen con onError fallback
14. Hover muestra overlay "Ver Pista"

## Diagrama de Componentes

```
App.js (Estado Global: user, isAuthenticated)
├── Login/Register (Carrusel + Formulario)
├── Dashboard (Protegido)
│   ├── Navbar (Logo + Links + User + Logout)
│   ├── Header (Bienvenida)
│   ├── Grid de Tarjetas (Ver Pistas, Nueva Reserva, Mis Reservas, Perfil)
│   └── Módulo de Noticias (Carrusel)
├── CourtList (Protegido)
│   ├── Navbar
│   └── Grid de Pistas (Imágenes + Info)
├── BookingForm (Protegido)
│   ├── Navbar
│   └── Formulario (Pista + Fecha + Hora + Duración)
└── MyBookings (Protegido)
    ├── Navbar
    └── Lista de Reservas (Info + Botón Cancelar)
```

## Características de Seguridad Implementadas

1. **Contraseñas**: Hash scrypt con salt automático
2. **JWT**: Tokens firmados con secret key
3. **Autorización**: Verificación de propiedad de recursos
4. **Validación**: Cliente y servidor validan datos
5. **CORS**: Configurado para origen específico
6. **SQL Injection**: Prevenido con ORM (SQLAlchemy)
7. **XSS**: React escapa automáticamente variables
8. **Secrets**: Variables sensibles en .env (no en código)
9. **Triggers BD**: Prevención de datos inconsistentes
10. **Safe Updates**: Desactivación temporal para scripts de mantenimiento

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Pistas
- `GET /api/courts` - Listar todas las pistas
- `GET /api/courts/:id` - Obtener una pista
- `POST /api/courts` - Crear pista (admin)
- `PUT /api/courts/:id` - Actualizar pista
- `DELETE /api/courts/:id` - Eliminar pista

### Reservas
- `GET /api/bookings` - Listar todas las reservas
- `GET /api/bookings/user/:userId` - Reservas de un usuario
- `POST /api/bookings` - Crear reserva
- `PUT /api/bookings/:id` - Actualizar reserva
- `DELETE /api/bookings/:id` - Cancelar reserva
- `GET /api/bookings/availability` - Verificar disponibilidad

### Usuarios
- `GET /api/users/:id` - Obtener perfil de usuario
- `PUT /api/users/:id` - Actualizar perfil

## Seguridad

- Las contraseñas se hashean usando Werkzeug
- JWT tokens para autenticación
- CORS configurado para desarrollo
- Validación de datos en backend
- Triggers en BD para prevenir reservas duplicadas

## Diseño

La aplicación cuenta con:
- Diseño moderno y limpio
- Colores corporativos
- Interfaz intuitiva y fácil de usar
- Feedback visual para acciones del usuario
- Cards y componentes reutilizables



## Scripts de Utilidad

- `start-app.ps1`: Inicia backend y frontend simultáneamente
- `start-backend.ps1`: Inicia solo el servidor Flask
- `start-frontend.ps1`: Inicia solo la aplicación React
- `delete_all_courts.sql`: Elimina todas las pistas y reservas
- `restore_original_courts.sql`: Restaura las 4 pistas originales
- `add_images.sql`: Migración para añadir columna imagen_url

## Mejores Prácticas Implementadas

**Frontend:**
- Componentes funcionales con hooks
- Separación de lógica y presentación
- CSS modular por componente
- Manejo centralizado de API
- Estados de carga y error
- Validación en tiempo real

**Backend:**
- Arquitectura modular con blueprints
- Separación de responsabilidades (models/routes)
- Respuestas JSON consistentes
- Códigos HTTP semánticos
- Logging de errores
- Configuración externalizada

**Base de Datos:**
- Normalización de tablas
- Relaciones con integridad referencial
- Índices en columnas frecuentes
- Triggers para lógica de negocio
- Eventos para mantenimiento
- Datos de ejemplo para desarrollo


## Autor

**Alejandro González López**
Proyecto de DAW (Desarrollo de Aplicaciones Web)

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025

