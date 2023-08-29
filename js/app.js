// Declaración de variables globales
let total = 0;
let cart = [];
let productFeatured = [];
const productContainer = document.getElementById('product-container');
const trolleyContainer = document.getElementById('trolley-container');
const productContainerMain = document.getElementById('product-container-main');
const totalPrice = document.getElementById('total-price');
const stockProducts = [];

// Función para recuperar el stock almacenado en localStorage
function recoverStock() {
    let stock = JSON.parse(localStorage.getItem('stock'));
    if (stock) stockProducts.push(...stock);
}

// Obtener datos desde un archivo JSON usando jQuery
$.getJSON('products.json', function (data) {
    // Almacenar datos en localStorage
    localStorage.setItem('stock', JSON.stringify(data));
    // Recuperar stock almacenado
    recoverStock();
    
    // Función para mostrar productos en un contenedor
    const showProducts = (array, container, clickHandler) => {
        for (const product of array) {
            const div = document.createElement('div');
            div.classList.add('product');
            div.innerHTML = `
                <div class="card">
                    <img src=${product.image} class="card-img-top" alt=""/>
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${formatPrice(product.price)}</p>
                        <div class="button-properties">
                            <button type="button" data-bs-toggle="modal" data-bs-target="#showModal" id="button${product.id}" class="btn btn-primary mb-2 px-5 text-uppercase w-100">Comprar ahora</button>
                            <button type="button" id="addProductmore${product.id}" class="btn btn-outline-primary px-5 text-uppercase">Agregar al carrito</button>
                        </div>
                    </div>
                </div>`;
            container.appendChild(div);

            // Agregar manejadores de eventos a los botones
            const button = document.getElementById(`button${product.id}`);
            button.addEventListener('click', () => clickHandler(product.id));
            const button2 = document.getElementById(`addProductmore${product.id}`);
            button2.addEventListener('click', () => clickHandler(product.id));
        }
    };

    // Mostrar productos en función de la página actual
    if (window.location.pathname === '/productos.html') {
        showProducts(data, productContainer, addToCart);
    } else {
        productFeatured = data.filter(prod => prod.destacado === 'true');
        showProducts(productFeatured, productContainerMain, addToCartMain);
    }
});

// Función para formatear precios
function formatPrice(price) {
    return price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });
}

// Función para agregar productos al carrito en la página de Productos
function addToCart(id) {
    let repeated = cart.find(prodRepeated => prodRepeated.id == id);
    if (repeated) {
        repeated.stock++;
        document.getElementById(`stock${repeated.id}`).innerHTML = `<p id="stock${repeated.id}"> Cantidad: ${repeated.stock}</p>`;
        updateCart();
    } else {
        let addToProduct = stockProducts.find(prod => prod.id == id);
        cart.push(addToProduct);
        addToProduct.stock = 1;
        updateCart();
        const div = document.createElement('div');
        div.classList.add('productInCart');
        div.innerHTML = `<p>${addToProduct.name}</p>
                        <p>Precio: $${addToProduct.price}</p>
                        <p id="stock${addToProduct.id}"> Cantidad: ${addToProduct.stock}</p>
                        <button id="remove${addToProduct.id}" class="button-remove"> <i class="fas fa-backspace"></i></button>`;
        trolleyContainer.appendChild(div);

        // Agregar manejador de evento para el botón de eliminar
        const buttonRemove = document.getElementById(`remove${addToProduct.id}`);
        buttonRemove.addEventListener('click', () => {
            buttonRemove.parentElement.remove();
            cart = cart.filter(prodE => prodE.id != addToProduct.id);
            updateCart();
        });
    }
}

// Función para agregar productos al carrito en la página principal
function addToCartMain(id) {
    let repeated = cart.find(prodRepeated => prodRepeated.id == id);
    if (repeated) {
        repeated.stock++;
        document.getElementById(`stock${repeated.id}`).innerHTML = `<p id="stock${repeated.id}"> Cantidad: ${repeated.stock}</p>`;
        updateCart();
    } else {
        let addToProduct = stockProducts.find(prod => prod.id == id);
        cart.push(addToProduct);
        addToProduct.stock = 1;
        updateCart();
        const div = document.createElement('div');
        div.classList.add('productInCart');
        div.innerHTML = `<p>${addToProduct.name}</p>
                        <p>Precio: $${addToProduct.price}</p>
                        <p id="stock${addToProduct.id}"> Cantidad: ${addToProduct.stock}</p>
                        <button id="remove${addToProduct.id}" class="button-remove"> <i class="fas fa-backspace"></i></button>`;
        trolleyContainer.appendChild(div);

        // Agregar manejador de evento para el botón de eliminar
        const buttonRemove = document.getElementById(`remove${addToProduct.id}`);
        buttonRemove.addEventListener('click', () => {
            buttonRemove.parentElement.remove();
            cart = cart.filter(prodE => prodE.id != addToProduct.id);
            updateCart();
            reset()
        });
    }
}
// Función para actualizar el total del carrito
function updateCart() {
    totalPrice.innerText = cart.reduce((acc, el) => acc + (el.price * el.stock), 0).toFixed(3);
}
