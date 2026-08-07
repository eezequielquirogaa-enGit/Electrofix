-- ========================================================
-- SCRIPT DE CREACIÓN Y POBLADO DE BASE DE DATOS - ELECTROFIX
-- ========================================================

-- 1. Creación de la Base de Datos
CREATE DATABASE IF NOT EXISTS `electrofix_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `electrofix_db`;

-- --------------------------------------------------------

-- 2. Estructura de la Tabla: `servicios`
DROP TABLE IF EXISTS `servicios`;
CREATE TABLE `servicios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(10) NOT NULL UNIQUE,
  `titulo` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `icono` VARCHAR(50) NOT NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Poblado de datos iniciales para `servicios`
INSERT INTO `servicios` (`codigo`, `titulo`, `descripcion`, `icono`) VALUES
('s1', 'Diagnóstico y Reparación', 'Revisión completa de placa, motor, bomba y rodamientos a domicilio.', 'wrench'),
('s2', 'Mantenimiento Preventivo', 'Limpieza interna, cambio de mangueras y ajuste general de componentes.', 'shield-check'),
('s3', 'Reparación de Placas Electrónicas', 'Reparación a nivel componente para placas principales de todas las marcas.', 'cpu');

-- --------------------------------------------------------

-- 3. Estructura de la Tabla: `productos` (Lavarropas y Repuestos)
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(10) NOT NULL UNIQUE,
  `nombre` VARCHAR(150) NOT NULL,
  `categoria` ENUM('lavarropas', 'repuesto') NOT NULL,
  `estado` ENUM('nuevo', 'usado') NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `imagen` VARCHAR(500) NOT NULL,
  `stock` INT DEFAULT 1,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Poblado de datos iniciales para `productos` (extraídos de data.js)
INSERT INTO `productos` (`codigo`, `nombre`, `categoria`, `estado`, `precio`, `descripcion`, `imagen`, `stock`) VALUES
('p1', 'Lavarropas Automático 7kg', 'lavarropas', 'usado', 280000.00, 'Restaurado a nuevo. Carga frontal, 1000 RPM, excelente estado general y 6 meses de garantía.', 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcS9sZu1HeOovRehAD9dPcy1bDM-yKO7P4SGomGc3vMHqrJkqo7jA0nz8lVTWTN5ytXQjvAOUzNr2Q-bu2g', 1),
('p2', 'Bomba de Desagüe Universal', 'repuesto', 'nuevo', 18500.00, 'Compatible con la mayoría de marcas (Drean, Whirlpool, LG). Alta durabilidad.', 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRkjZGhp7fItoOG_L-S6vNKeQ1hdt00NHv9xCZSrE_a41Url4eKnNgWZBswTuFVgJos27QBWF96KNFI0wc', 10),
('p3', 'Plaqueta Electrónica Universal', 'repuesto', 'nuevo', 42000.00, 'Plaqueta de reemplazo programable para lavarropas de carga superior y frontal.', 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQzIpD6hGJL1MbFswSXCRxelT4zkDaT3QXUeN__nK5CPO7i6iXTk20Jc6ns2wgmuuIPvFJcpsfpTmsvF5I', 5),
('p4', 'Correa de Transmisión 5V', 'repuesto', 'nuevo', 9500.00, 'Correa elástica original para motor de lavarropas de diversas marcas.', 'https://www.serviceitalia.com.ar/images/uploads/ecommerce/1487_00.png', 15);

-- --------------------------------------------------------

-- 4. Estructura de la Tabla: `usuarios` (Para la autenticación en login.html)
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL, -- Guardar siempre con hash (ej. bcrypt) en producción
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuario Administrador por defecto
-- Usuario: admin@electrofix.com | Contraseña provisional: admin123
INSERT INTO `usuarios` (`usuario`, `email`, `password`) VALUES
('admin', 'admin@electrofix.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1n1pGz2M1/S4D6UGBf2j0.Xo5YJ/u7S');