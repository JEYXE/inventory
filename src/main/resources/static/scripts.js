/**function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('product-management').style.display = 'block';
        } else {
            alert('Login fallido');
        }
    });
} **/

function createProduct() {
    const name = document.getElementById('productName').value;
    const quantity = document.getElementById('productQuantity').value;

    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, quantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.body) {
            alert('Producto creado');
        } else {
            alert('Error al crear producto');
        }
    });
}

function listProducts() {
    fetch('/api/products')
    .then(response => response.json())
    .then(data => {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        data.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - ${product.quantity}`;
            productList.appendChild(li);
        });
    });
}

function addStock() {
    const id = document.getElementById('productId').value;
    const quantity = document.getElementById('movementQuantity').value;

    fetch(`/api/products/${id}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Stock agregado');
        } else {
            alert('Error al agregar stock');
        }
    });
}

function removeStock() {
    const id = document.getElementById('productId').value;
    const quantity = document.getElementById('movementQuantity').value;

    fetch(`/api/products/${id}/remove`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Stock removido');
        } else {
            alert('Error al remover stock');
        }
    });
}
