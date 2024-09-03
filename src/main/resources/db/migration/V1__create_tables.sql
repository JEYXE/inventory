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

CREATE TABLE Inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    tipo_movimiento ENUM('entrada', 'salida') NOT NULL,
    cantidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES products(id)
);

CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'usuario') NOT NULL
);

INSERT INTO categories (name) VALUES
('Categoría 1'),
('Categoría 2');


INSERT INTO products (name, description, category, quantity, measure_unit) VALUES
('Producto A', 'Descripción del Producto A', 1, 100, 'gr'),
('Producto B', 'Descripción del Producto B', 2, 50, 'ml');


INSERT INTO Usuarios (nombre, email, contraseña, rol) VALUES
('Admin', 'admin@example.com', 'hashed_password', 'administrador'),
('Usuario', 'usuario@example.com', 'hashed_password', 'usuario');