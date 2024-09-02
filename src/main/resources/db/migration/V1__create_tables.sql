CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    quantity INT NOT NULL
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

INSERT INTO products (name, description, category, quantity) VALUES
('Producto A', 'Descripción del Producto A', 'Categoría 1', 100),
('Producto B', 'Descripción del Producto B', 'Categoría 2', 50);

INSERT INTO Usuarios (nombre, email, contraseña, rol) VALUES
('Admin', 'admin@example.com', 'hashed_password', 'administrador'),
('Usuario', 'usuario@example.com', 'hashed_password', 'usuario');