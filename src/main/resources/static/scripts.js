// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    //constantes
    const nuevoProductoBtn = document.getElementById('nuevoProductoBtn');
    const productoForm = document.getElementById('productoForm');
    const nuevoMovimientoBtn = document.getElementById('nuevoMovimientoBtn');
    const movimientoForm = document.getElementById('movimientoForm');
    const categoriaForm = document.getElementById('nuevaCategoriaForm');
    const pageSizeSelect = document.getElementById('pageSize');
    const itemTableBody = document.getElementById('productosTable').getElementsByTagName('tbody')[0];
    const paginationControls = document.getElementById('paginationControls');
    //variables
    let currentPage = 0;
    let pageSize = parseInt(pageSizeSelect.value);
    //evento cambiar numero de productos por pagina
    pageSizeSelect.addEventListener('change', function () {
        pageSize = parseInt(this.value);
        loadPage(0);
    });
    //evento para mostrar formulario de nuevo producto
    nuevoProductoBtn.addEventListener('click', () => {
        productoForm.style.display = 'block';
    });
    // evento para mostrar formulario de nuevo movimiento
    nuevoMovimientoBtn.addEventListener('click', () => {
        movimientoForm.style.display = 'block';
    });
    // evento para mostrar formulario de categoría nueva
    document.getElementById('nuevaCategoriaBtn').addEventListener('click', function () {
        categoriaForm.style.display = 'block';
    });
    //evento para ocultar formulario de nueva categoria
    document.getElementById('cancelarNuevaCategoriaBtn').addEventListener('click', function () {
        document.getElementById('nuevaCategoriaForm').style.display = 'none';
        document.getElementById('Form').reset();
    });
    //evento para ocultar formulario de nuevo producto
    document.getElementById('cancelarBtn').addEventListener('click', function () {
        productoForm.style.display = 'none';
        document.getElementById('mainForm').reset();
    });
    // evento para mostrar secciones
    window.showSection = (sectionId) => {
        document.querySelectorAll('main section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
    };
    // funcion para cargar productos en la tabla con paginación
    function loadPage(page) {
        fetch(`/api/products?page=${page}&size=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                itemTableBody.innerHTML = '';
                data.content.forEach(item => {
                    const row = itemTableBody.insertRow();
                    row.insertCell(0).textContent = item.id;
                    row.insertCell(1).textContent = item.name;
                    row.insertCell(2).textContent = item.description;
                    row.insertCell(3).textContent = item.measureUnit;
                    row.insertCell(4).textContent = item.category;
                    row.insertCell(3).textContent = item.quantity;
                });
                paginationControls.innerHTML = '';
                for (let i = 0; i < data.totalPages; i++) {
                    const button = document.createElement('button');
                    button.textContent = i + 1;
                    button.addEventListener('click', () => loadPage(i));
                    paginationControls.appendChild(button);
                }
            });
    }
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
    // Función para enviar datos del formulario de productos a la API
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
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (!response.ok) {
                const rspuesta = await response.json();
                alert(rspuesta.name);
                throw new Error('Error al crear el producto');
            }

            const nuevoProducto = await response.json();
            console.log('Producto creado:', nuevoProducto);
            // Actualizar la tabla de productos
            loadPage(currentPage);
            // Ocultar el formulario
            document.getElementById('mainForm').reset();
            productoForm.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
        }
    };
    //funsion para enviar forumlario de categorias a la API
    const enviarCategoria = async (event) => {
        event.preventDefault();
        const name = document.getElementById('nuevaCategoriaNombre').value;
        const categoria = {
            name
        };
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
            });
            if (!response.ok) {
                const respuesta = await response.json();
                alert(respuesta.name);
                throw new Error('Error al crear la categoria');
            }
            const nuevoCategoria = await response.json();
            console.log('Producto creado:', nuevoCategoria);
            fetchCategorias();
            document.getElementById('Form').reset();
            categoriaForm.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
        }
    };
    //evento de envío al formulario de productos
    productoForm.querySelector('form').addEventListener('submit', enviarProducto);
      //evento de envío al formulario de productos
    categoriaForm.querySelector('form').addEventListener('submit', enviarCategoria);
    // Llamar a las funciones para obtener los datos al cargar la página
    loadPage(currentPage);
    fetchCategorias();
});
// Funcion ocultar menu
function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
}
//funcion para salir
function logout() {
    // Lógica para cerrar sesión
}

