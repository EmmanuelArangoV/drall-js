import JsonService from "../services/jsonService.js";

const STORAGE_KEY = 'restautant_session';

// Estado interno
const state = {
    cart: [],
    user: null
}

// Subscriptores separados para carrito y usuario
const cartSubscribers = [];
const userSubscribers = [];

// Carga el estado completo (cart + user) desde localStorage
function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return { cart: [], user: null };
        const parsed = JSON.parse(data);
        return {
            cart: Array.isArray(parsed.cart) ? parsed.cart : [],
            user: parsed.user || null
        };
    } catch (error) {
        console.error('Error loading state from storage:', error.message);
        return { cart: [], user: null };
    }
}

// Guarda el estado completo en localStorage
function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart: state.cart, user: state.user }));
    } catch (error) {
        console.error('Error saving storage', error);
    }
}

// Devuelve copia del carrito (inmutable desde fuera)
function getCart() {
    return {
        cart: state.cart.map(i => ({ ...i }))
    };
}

// Devuelve usuario
function getUser() {
    return state.user ? { ...state.user } : null;
}

function getRole() {
    return state.user && state.user.role ? state.user.role : null;
}

// Notifica cambios en carrito
function notifyCart() {
    saveToStorage();
    const copy = getCart();
    cartSubscribers.forEach(sub => {
        try {
            sub(copy);
        } catch (err) {
            console.error('Error in cart subscriber', err.message || err);
        }
    });
}

// Notifica cambios en usuario
function notifyUser() {
    saveToStorage();
    const copy = getUser();
    userSubscribers.forEach(sub => {
        try {
            sub(copy);
        } catch (err) {
            console.error('Error in user subscriber', err.message || err);
        }
    });
}

// Inicializar estado desde storage
const initial = loadFromStorage();
state.cart = initial.cart || [];
state.user = initial.user || null;

// --- Carrito (se respeta la lógica original) ---
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
    notifyCart();
}

function updateQuantity(productId, quantity) {
    const index = state.cart.findIndex(i => i.id === productId);

    if (index === -1) return;

    if (quantity <= 0) {
        state.cart.splice(index, 1);
    } else {
        state.cart[index].quantity = quantity;
    }
    notifyCart();
}

function removeProduct(productId) {
    const index = state.cart.findIndex(i => i.id === productId);
    if (index === -1) return;
    state.cart.splice(index, 1);
    notifyCart();
}

function clearCart() {
    state.cart = [];
    notifyCart();
}

// Suscripción al carrito (mantengo compatibilidad)
function subscribe(subscriber) {
    if (typeof subscriber !== 'function') throw new Error('It needs to be a function');
    cartSubscribers.push(subscriber);
    try {
        subscriber(getCart());
    } catch (e) {
        console.error('Subscriber initial call error', e.message || e);
    }
}

// --- Usuario: getter/setter y subscripciones ---
function setUser(user) {
    // user puede ser null (logout) o un objeto con al menos {id, email, role}
    state.user = user ? { ...user } : null;
    notifyUser();
}

function subscribeUser(subscriber) {
    if (typeof subscriber !== 'function') throw new Error('It needs to be a function');
    userSubscribers.push(subscriber);
    try {
        subscriber(getUser());
    } catch (e) {
        console.error('User subscriber initial call error', e.message || e);
    }
}

// --- Make Order (se mantiene) ---
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
        createdAt: new Date().toISOString(),
        status: 'preparing'
    };

    // Si hay usuario autenticado, agregamos metadata
    const user = state.user;
    if (user) {
        order.customerName = user.name || user.email;
        order.customerEmail = user.email;
        order.user = user.id || user.email;
    }

    try {
        const response = await JsonService.postOrder(order);
        if (response && response.success) {
            clearCart();
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.error };
        }
    } catch (e) {
        console.error('Error', e.message || e);
        return { success: false, error: e.message };
    }
}

const store = {
    // cart
    addToCart,
    updateQuantity,
    removeProduct,
    clearCart,
    subscribe, // cart subscriber
    // user
    getUser,
    setUser,
    getRole,
    subscribeUser,
    // orders
    makeOrder,
    // helper
    getCart
};

export default store;