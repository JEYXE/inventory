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
    const description = document.getElementById('productDescription').value;
    const category = document.getElementById('productCategory').value;
    const measureUnit = document.getElementById('productMeasure').value;

    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description,category,measureUnit})
    })
    .then(response => response.json())
    .then(data => {
        if (data.product) {
            alert('Producto creado');
        } else {
            alert(data);
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
