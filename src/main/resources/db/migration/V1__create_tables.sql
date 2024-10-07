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
    reason TEXT NOT NULL,
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
('Admin', 'admin@example.com', '$2a$12$7evmTHfV5/I7OOzOEsuRWOAWaRsykZxiZXMoFV4vd9nNmj1NF05tO', 'administrador'),
('Usuario', 'usuario@example.com', '$2a$12$zlUnqRf2ENoOP444IXqq/upgiiRxNsY0N6.PYKWe09D8.cPfulrRm', 'usuario');