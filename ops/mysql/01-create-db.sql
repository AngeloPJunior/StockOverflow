CREATE DATABASE IF NOT EXISTS stock_overflow
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE USER IF NOT EXISTS 'stock'@'10.0.0.%' IDENTIFIED BY 'TroqueEstaSenha!';
GRANT ALL PRIVILEGES ON stock_overflow.* TO 'stock'@'10.0.0.%';
FLUSH PRIVILEGES;
