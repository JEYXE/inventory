// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const nuevoProductoBtn = document.getElementById('nuevoProductoBtn');
    const productoForm = document.getElementById('productoForm');
    const nuevoMovimientoBtn = document.getElementById('nuevoMovimientoBtn');
    const movimientoForm = document.getElementById('movimientoForm');

    nuevoProductoBtn.addEventListener('click', () => {
        productoForm.style.display = 'block';
    });

    nuevoMovimientoBtn.addEventListener('click', () => {
        movimientoForm.style.display = 'block';
    });

    // Función para mostrar secciones
    window.showSection = (sectionId) => {
        document.querySelectorAll('main section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
    };

    // Función para obtener datos de la API y llenar la tabla de productos
    const fetchProductos = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            const productos = await response.json();
            const productosTable = document.getElementById('productosTable');
            productosTable.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Unidad</th>
                    <th>Categoría</th>
                    <th>Quantity</th>
                </tr>
            `;
            productos.forEach(producto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.name}</td>
                    <td>${producto.description}</td>
                    <td>${producto.measureUnit}</td>
                    <td>${producto.category}</td>
                    <td>${producto.quantity}</td>
                `;
                productosTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para obtener datos de la API y llenar el selector de categorías
    const fetchCategorias = async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error('Error al obtener las categorías');
            }
            const categorias = await response.json();
            const categoriaSelect = document.getElementById('categoria');
            categoriaSelect.innerHTML = '';
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.name;
                categoriaSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

// Función para enviar datos del formulario a la API
const enviarProducto = async (event) => {
    event.preventDefault();
    const name = document.getElementById('nombre').value;
    const description = document.getElementById('descripcion').value;
    const measureUnit = document.getElementById('unidad').value;
    const categoryId = document.getElementById('categoria').value;

    const producto = {
        name,
        description,
        measureUnit,
        categoryId
    };
    console.log(producto);

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            throw new Error('Error al crear el producto');
        }

        const nuevoProducto = await response.json();
        console.log('Producto creado:', nuevoProducto);
        // Actualizar la tabla de productos
        fetchProductos();
        // Ocultar el formulario
        productoForm.style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
    }
};

// Añadir evento de envío al formulario de productos
productoForm.querySelector('form').addEventListener('submit', enviarProducto);
    // Llamar a las funciones para obtener los datos al cargar la página
    fetchProductos();
    fetchCategorias();
});
