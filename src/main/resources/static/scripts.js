// scripts.js
document.addEventListener('DOMContentLoaded', () => {

    async function validarToken(token) {
        try {
            const response = await fetch('/validateToken', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.text();
                return data; // Suponiendo que el backend devuelve un campo 'valido'
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error validando el token:', error);
            return null;
        }
    }
    const authenticateFormContainer = document.getElementById('authenticateFormContainer');
    const authenticate = async (event) => {
        event.preventDefault();
        const userName = document.getElementById('userName').value;
        const password = document.getElementById('password').value;
        const credencials = {
            userName,
            password
        }
        try {
            const response = await fetch('/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credencials)
            });
            if (!response.ok) {

                alert('Usuario ó contraseña incorrecto');
                throw new Error('No se logró el ingreso');
            }
            const tokenResponse = await response.json();
            showSection('home');
            menu.style.display = 'flex';
            localStorage.token = tokenResponse.token;
            localStorage.email = tokenResponse.userName;
            token = localStorage.token;
        } catch (error) {
            console.error('Error:', error);
        }
    };
    authenticateFormContainer.querySelector('form').addEventListener('submit', authenticate);
    //Funciones para la seccion productos*****************************************************************************
    // evento para mostrar secciones
    window.showSection = (sectionId) => {
        document.querySelectorAll('main section').forEach(section => {

            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');

        if (sectionId == 'products') {
            loadPage(currentPage);
            productCreateFormContainer.style.display = 'none';
            categoryCreateFormContainer.style.display = 'none';
            document.getElementById('categoryCreateForm').reset();
            document.getElementById('productCreateForm').reset();


        }
        if (sectionId == 'movimientos') {
            movementTableLoad(movementCurrentPage);
            document.getElementById('movementForm').reset();
            movementFormContainer.style.display = 'none';


        }
        if (sectionId == 'product') {


        }
    };
    //funcion para salir
    const logOutBtn = document.getElementById('logOutBtn');
    logOutBtn.addEventListener("click", function () {
        var mensaje = "¿Estás seguro de que deseas salir?";
        var opcion = confirm(mensaje);
        if (opcion) {
            localStorage.clear();
            location.reload();
        } else {

        }

    });
    // Funcion ocultar menu
    const hideMenuBtn = document.getElementById('hideMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    hideMenuBtn.addEventListener("click", function () {
        sidebar.classList.toggle('collapsed');
    });
    //Funciones para la seccion productos***************************************************************************
    //evento para mostrar formulario de nuevo producto
    const newProductBtn = document.getElementById('newProductBtn');
    const productCreateFormContainer = document.getElementById('productCreateFormContainer');
    newProductBtn.addEventListener('click', () => {
        productCreateFormContainer.style.display = 'block';
        fetchCategorias(createProductCategory);
    });
    function filterTable() {
        const filter = document.getElementById('filterInput').value.toLowerCase();
        const rows = document.querySelectorAll('#productTable tbody tr');
        rows.forEach(row => {
            const cells = Array.from(row.cells);
            const match = cells.some(cell => cell.innerText.toLowerCase().includes(filter));
            row.style.display = match ? '' : 'none';
        });
    }
    document.getElementById('filterInput').addEventListener('keyup', filterTable);
    let sortOrder = 'asc'; // Estado inicial de ordenamiento

    window.sortTable = (columnIndex) => {
        const table = document.getElementById('productTable');
        const rows = Array.from(table.rows).slice(1);
        const sortedRows = rows.sort((a, b) => {
            const cellA = a.cells[columnIndex].innerText.toLowerCase();
            const cellB = b.cells[columnIndex].innerText.toLowerCase();
            if (sortOrder === 'asc') {
                return cellA.localeCompare(cellB);
            } else {
                return cellB.localeCompare(cellA);
            }
        });

        function obtenerFilas() {
            const tabla = document.getElementById('productTable');
            const filas = tabla.getElementsByTagName('tr');
            for (let i = 0; i < filas.length; i++) {
                console.log(filas[i].innerText);
            }
        }

        obtenerFilas();

        // Alternar el estado de ordenamiento
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

        table.tBodies[0].append(...sortedRows);
    };

    // funcion para cargar productos en la tabla con paginación
    const pageSizeSelect = document.getElementById('pageSize');
    const itemTableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const paginationControls = document.getElementById('paginationControls');
    let currentPage = 0;
    let pageSize = parseInt(pageSizeSelect.value);
    function loadPage(page) {
        fetch(`/api/products?page=${page}&size=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
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
                    row.insertCell(5).textContent = item.quantity;
                    const verIcono = document.createElement('span');
                    verIcono.innerHTML = '👁️'; // Puedes usar un icono de tu elección
                    verIcono.style.cursor = 'pointer';
                    verIcono.onmouseover = 'Ver';
                    verIcono.onclick = () => productDetails(item.id);
                    row.insertCell(6).appendChild(verIcono);
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

    //evento cambiar numero de productos por pagina
    pageSizeSelect.addEventListener('change', function () {
        pageSize = parseInt(this.value);
        loadPage(0);
    });
    //funcion para traer el el detalle del producto desde el icono de la tabla
    let productMovementId = 0;
    function productDetails(id) {
        productMovementId = id,
        showSection('product');
        productUpdateFormContainer.style.display = 'none';
        document.getElementById('Form').reset();
        newCategoryUpdateProductFormContainer.style.display = 'none';
        fetchCategorias(categorySelect);
        productMovementTableLoad(productMovementCurrentPage, id);
        fetch(`/api/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('jsonContainer');
                container.innerHTML = '';
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const item = document.createElement('div');
                        item.className = 'json-item';
                        const keyElement = document.createElement('div');
                        keyElement.className = 'json-key';
                        keyElement.textContent = key;
                        const valueElement = document.createElement('div');
                        valueElement.id = key;
                        valueElement.textContent = data[key];
                        item.appendChild(keyElement);
                        item.appendChild(valueElement);
                        container.appendChild(item);
                    }
                }

            });
    }
    //Funciones para crear un producto******************************************************************************
    // Función para obtener datos de la API y llenar el selector de categorías
    const fetchCategorias = async (categorySelect) => {
        try {
            const response = await fetch('/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener las categorías');
            }
            const categorias = await response.json();

            categorySelect.innerHTML = '';
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const createProductCategory = document.getElementById('createProductCategory');

    // Función para enviar datos del formulario de productos a la API
    const createProduct = async (event) => {
        event.preventDefault();
        const name = document.getElementById('createProductName').value;
        const description = document.getElementById('createProductDescription').value;
        const measureUnit = document.getElementById('createProductMeasureUnit').value;
        const categoryId = document.getElementById('createProductCategory').value;
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
            alert('Producto creado satisfactoriamente')
            // Actualizar la tabla de productos
            loadPage(currentPage);
            // Ocultar el formulario
            document.getElementById('productCreateForm').reset();
            productCreateFormContainer.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
        }
    };
    //evento de envío al formulario de productos
    productCreateFormContainer.querySelector('form').addEventListener('submit', createProduct);
    //evento para ocultar formulario de nuevo producto
    const cancelCreateProductBtn = document.getElementById('cancelCreateProductBtn');
    cancelCreateProductBtn.addEventListener('click', function () {
        productCreateFormContainer.style.display = 'none';
        categoryCreateFormContainer.style.display = 'none';
        document.getElementById('categoryCreateForm').reset();
        document.getElementById('productCreateForm').reset();
    });
    // evento para mostrar formulario de categoría nueva
    const newCategoryBtn = document.getElementById('newCategoryBtn');
    const categoryCreateFormContainer = document.getElementById('categoryCreateFormContainer');
    newCategoryBtn.addEventListener('click', function () {
        categoryCreateFormContainer.style.display = 'block';
    });
    //funsion para enviar forumlario de categorias a la API
    const createCategory = async (event) => {
        event.preventDefault();
        const name = document.getElementById('createCategoryname').value;
        const categoria = {
            name
        };
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
            alert('Categoría creada satisfactoriamente');
            fetchCategorias(createProductCategory);
            document.getElementById('categoryCreateForm').reset();
            categoryCreateFormContainer.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
        }
    };
    //evento de envío al formulario de categorias
    categoryCreateFormContainer.querySelector('form').addEventListener('submit', createCategory);
    //evento para ocultar formulario de nueva categoria
    const cancelNewCategoryBtn = document.getElementById('cancelNewCategoryBtn');
    cancelNewCategoryBtn.addEventListener('click', function () {
        categoryCreateFormContainer.style.display = 'none';
        document.getElementById('categoryCreateForm').reset();
    });
    //Funciones para la vista de producto***************************************************************************
    const categorySelect = document.getElementById('categorySelect');
    //evento para el boton de volver
    const volverBoton = document.getElementById("volverBtn");
    volverBoton.addEventListener("click", function () {
        showSection('products');
        productUpdateFormContainer.style.display = 'none';
        document.getElementById('Form').reset();
        newCategoryUpdateProductFormContainer.style.display = 'none';
    });
    //funcion para copiar valores en el formulario de actualizar producto
    function copyValues() {
        // Obtener valores de los elementos de origen
        const productName = document.getElementById('name').textContent;
        const productDescription = document.getElementById('description').textContent;
        const productCategory = document.getElementById('category').textContent;
        const productMeasureUnit = document.getElementById('measureUnit').textContent;
        // Asignar valores a los elementos de destino
        document.getElementById('updateNombre').value = productName;
        document.getElementById('updateDescription').value = productDescription;
        for (let i = 0; i < document.getElementById('categorySelect').options.length; i++) {
            if (document.getElementById('categorySelect').options[i].textContent === productCategory) {
                document.getElementById('categorySelect').value = document.getElementById('categorySelect').options[i].value;
                break;
            }
        }
        document.getElementById('updateMeasureUnit').value = productMeasureUnit;
    }
    //evento para boton actualizar
    const productUpdateFormContainer = document.getElementById('productUpdateFormContainer');
    const updateProductBtn = document.getElementById('actualizarProductoBtn');
    updateProductBtn.addEventListener("click", function () {
        productUpdateFormContainer.style.display = 'block';
        copyValues();
    });
    //funsion para actualizar producto
    const productUpdate = async (event) => {
        event.preventDefault();
        const id = document.getElementById('id').textContent;
        const name = document.getElementById('updateNombre').value;
        const description = document.getElementById('updateDescription').value;
        const measureUnit = document.getElementById('updateMeasureUnit').value;
        const categoryId = document.getElementById('categorySelect').value;
        const producto = {
            name,
            description,
            measureUnit,
            categoryId
        };
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
            alert('Producto actualizado satisfactoriamente')
            // Actualizar la tabla de productos
            loadPage(currentPage);
            productDetails(id);
            // Ocultar el formulario
            productUpdateFormContainer.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
        }
    };
    productUpdateFormContainer.querySelector('form').addEventListener('submit', productUpdate);
    //evento para boton cancelar actualizar producto
    const cancelUpdateProductBtn = document.getElementById('cancelUpdateProductBtn');
    cancelUpdateProductBtn.addEventListener("click", function () {
        productUpdateFormContainer.style.display = 'none';
        document.getElementById('Form').reset();
        newCategoryUpdateProductFormContainer.style.display = 'none';
    });
    //evento para boton nueva categoria en formulario actualizar producto
    const newCategoryUpdateProductBtn = document.getElementById('newCategoryUpdateProductBtn');
    const newCategoryUpdateProductFormContainer = document.getElementById('newCategoryUpdateProductFormContainer');
    newCategoryUpdateProductBtn.addEventListener("click", function () {
        newCategoryUpdateProductFormContainer.style.display = 'block';
    });
    const createCategory2 = async (event) => {
        event.preventDefault();
        const name = document.getElementById('newCategoryNameUpdateProductForm').value;
        const categoria = {
            name
        };
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
            alert('Categoría creada satisfactoriamente')
            fetchCategorias(categorySelect);
            document.getElementById('Form').reset();
            newCategoryUpdateProductFormContainer.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
        }
    };
    //evento de envío al formulario de categorias
    newCategoryUpdateProductFormContainer.querySelector('form').addEventListener('submit', createCategory2);
    //evento para ocultar formulario de nueva categoria
    const cancelarNuevaCategoriaBtn = document.getElementById('cancelarNuevaCategoriaBtn');
    cancelarNuevaCategoriaBtn.addEventListener('click', function () {
        newCategoryUpdateProductFormContainer.style.display = 'none';
        document.getElementById('Form').reset();
    });
    //funcion para eliminar producto
    function deleteProducto(id) {
        const options = {
            method: 'DELETE', // Método HTTP DELETE
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`// Tipo de contenido
            }
        };
        fetch(`/api/products/${id}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                loadPage(currentPage);
                showSection('products');
                return alert('El producto se eliminó correctamente');
            })
            .then(data => {
                console.log('Recurso eliminado:', data);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('El producto no se puede eliminar, ya tiene movimientos asociados');
            });
    }
    const deleteProductBtn = document.getElementById('eliminarProductoBtn');
    deleteProductBtn.addEventListener("click", function () {
        document.getElementById('Form').reset();
        newCategoryUpdateProductFormContainer.style.display = 'none';
        productUpdateFormContainer.style.display = 'none';
        const id = document.getElementById('id').textContent;
        var mensaje = "¿Estás seguro de que deseas eliminar el producto?";
        var opcion = confirm(mensaje);
        if (opcion) {
            deleteProducto(id);
        } else {

        }
    });
    //funcion para traer los movimientos del producto
    const productMovementPageSizeSelect = document.getElementById('productMovementPageSize');
    const productMovementTableBody = document.getElementById('productMovementTable').getElementsByTagName('tbody')[0];
    const productMovementPaginationControls = document.getElementById('productMovementPaginationControls');
    let productMovementCurrentPage = 0;
    let productMovementPageSize = parseInt(productMovementPageSizeSelect.value);
    function productMovementTableLoad(page, id) {
        fetch(`/api/movements/${id}?page=${page}&size=${productMovementPageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                productMovementTableBody.innerHTML = '';
                data.content.forEach(item => {
                    const row = productMovementTableBody.insertRow();
                    row.insertCell(0).textContent = item.id;
                    row.insertCell(1).textContent = item.movementDate;
                    row.insertCell(2).textContent = item.productName;
                    row.insertCell(3).textContent = item.quantity;
                    row.insertCell(4).textContent = item.movementType;
                    row.insertCell(5).textContent = item.reason;
                });
                productMovementPaginationControls.innerHTML = '';
                for (let i = 0; i < data.totalPages; i++) {
                    const button = document.createElement('button');
                    button.textContent = i + 1;
                    button.addEventListener('click', () => productMovementTableLoad(i, id));
                    productMovementPaginationControls.appendChild(button);
                }
            });
    }
    //evento cambiar numero de movimientos por pagina
    productMovementPageSizeSelect.addEventListener('change', function () {
        productMovementPageSize = parseInt(this.value);
        productMovementTableLoad(0, productMovementId);
    });

    //funciones para movimientos***********************************************************************************
    // evento para mostrar formulario de nuevo movimiento
    const nuevoMovimientoBtn = document.getElementById('nuevoMovimientoBtn');
    const movementFormContainer = document.getElementById('movementFormContainer');
    nuevoMovimientoBtn.addEventListener('click', () => {
        movementFormContainer.style.display = 'block';
        fetchProducts(createMovementProduct);
    });
    // funcion para traer todos los movimientos
    const movementPageSizeSelect = document.getElementById('movementPageSize');
    const movementTableBody = document.getElementById('movementTable').getElementsByTagName('tbody')[0];
    const movementPaginationControls = document.getElementById('movementPaginationControls');
    let movementCurrentPage = 0;
    let movementPageSize = parseInt(movementPageSizeSelect.value);
    function movementTableLoad(page) {
        fetch(`/api/movements?page=${page}&size=${movementPageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                movementTableBody.innerHTML = '';
                data.content.forEach(item => {
                    const row = movementTableBody.insertRow();
                    row.insertCell(0).textContent = item.id;
                    row.insertCell(1).textContent = item.movementDate;
                    row.insertCell(2).textContent = item.productName;
                    row.insertCell(3).textContent = item.quantity;
                    row.insertCell(4).textContent = item.movementType;
                    row.insertCell(5).textContent = item.reason;
                });
                movementPaginationControls.innerHTML = '';
                for (let i = 0; i < data.totalPages; i++) {
                    const button = document.createElement('button');
                    button.textContent = i + 1;
                    button.addEventListener('click', () => movementTableLoad(i));
                    movementPaginationControls.appendChild(button);
                }
            });
    }

    //evento cambiar numero de movimientos por pagina
    movementPageSizeSelect.addEventListener('change', function () {
        movementPageSize = parseInt(this.value);
        movementTableLoad(0);
    });
    // Función para obtener datos de la API y llenar el selector de productos
    const fetchProducts = async (productSelect) => {
        try {
            const response = await fetch('/api/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener las categorías');
            }
            const products = await response.json();

            productSelect.innerHTML = '';
            products.content.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                productSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const createMovementProduct = document.getElementById('productId');

    // evento para guardar un nuevo movimiento
    const createMovement = async (event) => {
        event.preventDefault();
        const movementDate = document.getElementById('movementDate').value;
        const productId = document.getElementById('productId').value;
        const quantity = document.getElementById('quantity').value;
        const movementType = document.getElementById('movementType').value;
        const reason = document.getElementById('reason').value;
        const movement = {
            movementDate,
            productId,
            quantity,
            movementType,
            reason
        };
        try {
            const response = await fetch('/api/movements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(movement)
            });
            if (!response.ok) {
                const respuesta = await response.json();
                alert(respuesta.name);
                throw new Error('Error al insertar nuevo registro');
            }
            const newMovement = await response.json();
            console.log('Producto creado:', newMovement);
            movementTableLoad(movementCurrentPage);
            document.getElementById('movementForm').reset();
            movementFormContainer.style.display = 'none';
            alert('El movimiento se creó correctamente');
        } catch (error) {
            console.error('Error:', error);
        }
    };
    movementFormContainer.querySelector('form').addEventListener('submit', createMovement);
    // evento para cancelar un nuevo movimiento
    const cancelCreateMovementBtn = document.getElementById('cancelCreateMovementBtn');
    cancelCreateMovementBtn.addEventListener('click', function () {
        movementFormContainer.style.display = 'none';
        document.getElementById('movementForm').reset();
    });
    const menu = document.getElementById('menu');
    let token = localStorage.getItem('token');
    async function usarValidacion(token) {
        const resultado = await validarToken(token);
        if (resultado) {
            console.log('Token válido:', resultado);
            // Aquí puedes agregar la lógica que necesites cuando el token es válido
            showSection('home');
            menu.style.display = 'flex';
        } else {
            console.log('Token inválido o error en la validación');
            // Aquí puedes manejar el caso de token inválido o error
            showSection('authenticate');
        }
    }

    if (token) {
        usarValidacion(token);
    } else {
        // Redirigir al formulario de login si no hay token
        showSection('authenticate');

    }
});