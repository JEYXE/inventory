CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category INT,
    quantity INT NOT NULL DEFAULT 0,
    measure_unit ENUM('gr', 'ml', 'und') NOT NULL,
    FOREIGN KEY (category) REFERENCES categories(id)
);

CREATE TABLE movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    movement_type ENUM('entrada', 'salida') NOT NULL,
    quantity INT NOT NULL,
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'usuario') NOT NULL
);

INSERT INTO categories (name) VALUES
('Categoría 1'),
('Categoría 2');


INSERT INTO products (name, description, category, quantity, measure_unit) VALUES
('Producto A', 'Descripción del Producto A', 1, 0, 'gr'),
('Producto B', 'Descripción del Producto B', 2, 0, 'ml');


INSERT INTO users (name, email, user_password, rol) VALUES
('Admin', 'admin@example.com', 'hashed_password', 'administrador'),
('Usuario', 'usuario@example.com', 'hashed_password', 'usuario');

INSERT INTO movements (movement_date, product_id, quantity, movement_type) VALUES
('2024-09-26T00:00:00', 1, 10, 'entrada'),
('2024-09-26T00:00:00', 2, 20, 'salida');