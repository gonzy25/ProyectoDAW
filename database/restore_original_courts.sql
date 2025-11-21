-- Script para restaurar las 4 pistas originales de AceNet
-- Este script elimina todas las pistas actuales y crea las 4 originales

-- Desactivar el modo seguro temporalmente
SET SQL_SAFE_UPDATES = 0;

-- Desactivar comprobaciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar todas las reservas
DELETE FROM reservas;

-- Eliminar todas las pistas
DELETE FROM pistas;

-- Resetear auto_increment
ALTER TABLE pistas AUTO_INCREMENT = 1;
ALTER TABLE reservas AUTO_INCREMENT = 1;

-- Reactivar comprobaciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Reactivar el modo seguro
SET SQL_SAFE_UPDATES = 1;

-- Insertar las 4 pistas originales
INSERT INTO pistas (nombre, ubicacion, tipo_superficie, estado, descripcion, imagen_url) VALUES
('Pista Central 1', 'Planta baja, sector A', 'Césped artificial', 'disponible', 'Pista principal con iluminación LED y gradas para espectadores', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'),
('Pista 2', 'Planta baja, sector B', 'Cristal templado', 'disponible', 'Pista panorámica con paredes de cristal', 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'),
('Pista 3', 'Primera planta, sector A', 'Césped artificial', 'disponible', 'Pista estándar con buena ventilación', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'),
('Pista 4', 'Primera planta, sector B', 'Hormigón poroso', 'disponible', 'Pista de entrenamiento profesional', 'https://images.unsplash.com/photo-1617882702439-dea8e8846c39?w=800');

-- Confirmación
SELECT 'Las 4 pistas originales han sido restauradas correctamente' AS mensaje;
SELECT * FROM pistas;
