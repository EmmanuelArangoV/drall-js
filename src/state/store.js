import JsonService from "../services/jsonService.js";

const STORAGE_KEY = 'restautant_session';

// GET -> Traer datos del localStorage
// SET -> Guardar datos en el localStorage

const state = {
    cart: []
}

const subscribers = [];

// Funcion inicial para traer datos del localStorage
// localStorage -> js se usa JSON.parse()
//js -> localStorage se usa JSON.stringify

function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            throw new Error('Error fetching storage data.');
        }
        const data_ready = JSON.parse(data);
        const cart = data_ready.cart

        return cart || []; // OR

    } catch (error) {
        console.error('Error loading state from storage:', error.message);
        return [];
    }
}

// Guardar en el local Storage cualquier nuevo producto
function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart: state.cart }));
    } catch (error) {
        console.log('Error saving storage', error);
    }
}

// Obtengo una copia del carrito
function getCart() {
    return {
        // Pasar el carrito totalmente igual
        cart: state.cart.map(i => ({ ...i}))
    }
}

// Notifica acerca de cualquier cambio
function notify() {
    saveToStorage();
    const copy_cart = getCart();

    subscribers.forEach(sub => {
        try {
            sub(copy_cart); // -> Acá llamo a un suscriptor en este caso es la funcion render de sidebar
        } catch (err) {
            console.error('Error al subscribir', error.message)
        }
    });
}



// Inicializar el carrito
state.cart = loadFromStorage();

function addToCart(product) {
    const existing = state.cart.find(i => i.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            alt: product.alt,
            category: product.category,
            quantity: 1
        });
    }
    notify();
}

function updateQuantity(productId, quantity) {
    const index = state.cart.findIndex(i => i.id === productId);

    if (index === -1) return;

    if (quantity <= 0) {
        state.cart.splice(index, 1); // Borra solo el elemento en el que está parado
    } else {
        state.cart[index].quantity = quantity
    }
    notify();
}

function removeProduct(productId) {
    const index = state.cart.findIndex(i => i.id === productId);
    state.cart.splice(index, 1); // Borra solo el elemento en el que está parado
    notify();
}

function clearCart() {
    state.cart = [];
    notify();
}

// Primer subscripcion y envía un video
function subscribe(subscriber) {
    if (typeof subscriber !== 'function') throw new Error('It needs to be a function');
    subscribers.push(subscriber);

    try {
        subscriber(getCart()); // Acá llamo a un suscriptor en este caso es la funcion render de sidebar
    } catch (e) {
        console.error('Subscriber initial call error', e.message);
    }
}

async function makeOrder() {
    const items = state.cart.map(i => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity
    }));

    const subtotal = Number(state.cart
        .reduce((accumulator, item) => accumulator + item.price * item.quantity, 0)
        .toFixed(2)
    );
    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const order = {
        items,
        subtotal,
        tax,
        total,
        createdAt: new Date().toISOString()
    };

    try {
        const response = await JsonService.postOrder(order);
        if (response && response.success) {
            clearCart();
            return { success: true, data: response.data }
        } else {
            return { success: false, error: response.error}
        }
    } catch (e) {
        console.error('Error', e.message);
        return { success: false, error: e.message}
    }
}

const store = {
    addToCart,
    updateQuantity,
    removeProduct,
    clearCart,
    subscribe,
    makeOrder
}

export default store;