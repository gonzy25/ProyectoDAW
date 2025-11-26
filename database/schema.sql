-- Base de datos para AceNet - Sistema de gestión de club de pádel
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS acenet_db;
USE acenet_db;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email)
);

-- Tabla de Pistas
CREATE TABLE IF NOT EXISTS pistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    tipo_superficie VARCHAR(50) NOT NULL,
    estado ENUM('disponible', 'no_disponible', 'mantenimiento') DEFAULT 'disponible' NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(500),
    INDEX idx_estado (estado)
);

-- Tabla de Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    pista_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    duracion INT NOT NULL COMMENT 'Duración en minutos',
    estado ENUM('confirmada', 'cancelada', 'completada') DEFAULT 'confirmada' NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (pista_id) REFERENCES pistas(id) ON DELETE CASCADE,
    INDEX idx_fecha (fecha),
    INDEX idx_usuario (usuario_id),
    INDEX idx_pista (pista_id),
    INDEX idx_estado (estado),
    UNIQUE KEY unique_booking (pista_id, fecha, hora_inicio, estado)
);

-- Datos de ejemplo para pistas
INSERT INTO pistas (nombre, ubicacion, tipo_superficie, estado, descripcion, imagen_url) VALUES
('Pista 1 Central', 'Planta baja, sector A', 'Césped artificial', 'disponible', 'Pista principal con iluminación LED y gradas para espectadores', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'),
('Pista 2', 'Planta baja, sector B', 'Cristal templado', 'disponible', 'Pista panorámica con paredes de cristal', 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'),
('Pista 3', 'Primera planta, sector A', 'Césped artificial', 'disponible', 'Pista estándar con buena ventilación', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'),
('Pista 4 Exterior', 'Exterior', 'Hormigón poroso', 'disponible', 'Pista de entrenamiento profesional', 'https://images.unsplash.com/photo-1617882702439-dea8e8846c39?w=800');

-- Datos de ejemplo para usuarios (contraseña: "password123" hasheada)
-- Nota: En producción, las contraseñas deben ser hasheadas desde la aplicación
INSERT INTO usuarios (nombre, apellidos, email, telefono, password_hash) VALUES
('Admin', 'Sistema', 'admin@acenet.com', '600123456', 'scrypt:32768:8:1$example$hash'),
('Juan', 'Pérez García', 'juan@example.com', '600234567', 'scrypt:32768:8:1$example$hash'),
('María', 'López Martínez', 'maria@example.com', '600345678', 'scrypt:32768:8:1$example$hash');

-- Crear vista para reservas con información completa
CREATE OR REPLACE VIEW vista_reservas_completas AS
SELECT 
    r.id,
    r.fecha,
    r.hora_inicio,
    r.duracion,
    r.estado AS estado_reserva,
    r.fecha_creacion,
    u.id AS usuario_id,
    CONCAT(u.nombre, ' ', u.apellidos) AS usuario_nombre,
    u.email AS usuario_email,
    u.telefono AS usuario_telefono,
    p.id AS pista_id,
    p.nombre AS pista_nombre,
    p.ubicacion AS pista_ubicacion,
    p.tipo_superficie AS pista_tipo
FROM reservas r
INNER JOIN usuarios u ON r.usuario_id = u.id
INNER JOIN pistas p ON r.pista_id = p.id;

-- Crear procedimiento almacenado para verificar disponibilidad
DELIMITER //
CREATE PROCEDURE verificar_disponibilidad(
    IN p_pista_id INT,
    IN p_fecha DATE,
    IN p_hora TIME
)
BEGIN
    SELECT COUNT(*) AS reservas_activas
    FROM reservas
    WHERE pista_id = p_pista_id
      AND fecha = p_fecha
      AND hora_inicio = p_hora
      AND estado = 'confirmada';
END //
DELIMITER ;

-- Crear trigger para prevenir reservas duplicadas
DELIMITER //
CREATE TRIGGER before_insert_reserva
BEFORE INSERT ON reservas
FOR EACH ROW
BEGIN
    DECLARE existe INT;
    
    SELECT COUNT(*) INTO existe
    FROM reservas
    WHERE pista_id = NEW.pista_id
      AND fecha = NEW.fecha
      AND hora_inicio = NEW.hora_inicio
      AND estado = 'confirmada';
    
    IF existe > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ya existe una reserva confirmada para esta pista en este horario';
    END IF;
END //
DELIMITER ;

-- Crear trigger para actualizar estado de reservas antiguas
DELIMITER //
CREATE EVENT actualizar_reservas_completadas
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    UPDATE reservas
    SET estado = 'completada'
    WHERE estado = 'confirmada'
      AND CONCAT(fecha, ' ', hora_inicio) < NOW()
      AND fecha < CURDATE();
END //
DELIMITER ;
