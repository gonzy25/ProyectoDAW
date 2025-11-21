-- Script para borrar TODAS las pistas de la base de datos
-- ADVERTENCIA: Esto eliminará todas las pistas y sus reservas asociadas

-- Desactivamos el modo seguro temporalmente
SET SQL_SAFE_UPDATES = 0;

-- Desactivamos las comprobaciones de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminamos todas las reservas asociadas a las pistas
DELETE FROM reservas;

-- Eliminamos todas las pistas
DELETE FROM pistas;

-- Reactivamos las comprobaciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Reactivamos el modo seguro
SET SQL_SAFE_UPDATES = 1;

-- Reseteamos el auto_increment para que empiece desde 1 de nuevo
ALTER TABLE pistas AUTO_INCREMENT = 1;
ALTER TABLE reservas AUTO_INCREMENT = 1;

-- Confirmación
SELECT 'Todas las pistas y reservas han sido eliminadas correctamente' AS mensaje;
