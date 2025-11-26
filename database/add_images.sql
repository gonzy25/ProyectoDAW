-- Script para agregar la columna imagen_url a las pistas existentes

USE acenet_db;

-- Agregar la columna imagen_url si no existe
ALTER TABLE pistas;

-- Actualizar las pistas existentes con imágenes
UPDATE pistas SET imagen_url = 'https://wpt-open500.com/wp-content/uploads/2022/08/Curiosidades-pista-padel-blog.jpg' WHERE id = 1;
UPDATE pistas SET imagen_url = 'https://www.qualitysportinstalacionesdeportivas.com/wp-content/uploads/2019/10/fabrica-de-pistas-de-padel.jpg' WHERE id = 2;
UPDATE pistas SET imagen_url = 'https://padelgest.com/wp-content/uploads/2024/04/pista-padel-cubierta.jpg' WHERE id = 3;
UPDATE pistas SET imagen_url = 'https://padelmagic.es/wp-content/uploads/2023/09/0b5a1993-7eab-42d2-b85e-e947cbd5a751.jpg' WHERE id = 4;

-- Para pistas sin imagen, se usará la imagen por defecto desde el código
