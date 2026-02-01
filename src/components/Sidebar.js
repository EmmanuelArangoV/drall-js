// javascript
import store from "../state/store.js";

export function SideBardComponent() {
    // Contenedores principales
    const header = document.createElement('div');
    header.classList.add('sidebar-header');
    header.innerHTML =
        `
        <h2 class="sidebar-title">Your Order</h2>
        <span class="order-count">0</span>
        <button class="link-button clear-all">Clear all</button>`;

    const orderItems = document.createElement('div');
    orderItems.classList.add('order-items');

    const orderSummary = document.createElement('div');
    orderSummary.classList.add('order-summary');

    const checkoutButton = document.createElement('button');
    checkoutButton.classList.add('button', 'primary');
    checkoutButton.innerHTML =
        `
        Confirm Order
        <svg class="button-icon-right" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');
    sidebar.appendChild(header);
    sidebar.appendChild(orderItems);
    sidebar.appendChild(orderSummary);
    sidebar.appendChild(checkoutButton);

    // Handlers que se registran UNA sola vez
    const clearBtn = header.querySelector('.clear-all');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            store.clearCart();
        });
    }

    checkoutButton.addEventListener('click', async () => {
        if (checkoutButton.disabled) return;
        checkoutButton.disabled = true;
        const originalText = checkoutButton.textContent;
        checkoutButton.textContent = 'Processing';

        const response = await store.makeOrder();

        if (response.success) {
            checkoutButton.textContent = 'Order made';
            setTimeout(() => checkoutButton.textContent = originalText, 1000);
            // `makeOrder` ya limpia el carrito en `store` si fue exitoso
        } else {
            setTimeout(() => checkoutButton.textContent = originalText, 1000);
            console.error('Pasó algo malo', response.error);
        }

        checkoutButton.disabled = false;
    });

    // Suscribimos pasando el sidebar local como primer parámetro
    store.subscribe(cart => render(sidebar, cart));

    return sidebar
}

function calculateTotals(cart) {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    return {subtotal, tax, total};
}

// Recibe todos los avisos del canal
function render(sidebar, cartObject) {
    const cart = cartObject.cart || [];

    // Actualizamos contador de productos
    const count = cart.reduce((s,i) => s + i.quantity, 0);
    const countElement = sidebar.querySelector('.order-count');
    countElement.textContent = count || null;

    // Order Items section
    const orderItems = sidebar.querySelector('.order-items');
    orderItems.innerHTML = '';

    if (cart.length === 0) {
        orderItems.innerHTML = '<p>Your order is empty</p>'
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add("order-item");
            itemElement.dataset.id = item.id;

            const priceProduct = item.price * item.quantity
            itemElement.innerHTML =
                `<img src="${item.image}" alt=${item.alt} class="item-image">
                    <div class="item-details">
                        <h4 class="item-name">${item.name}</h4>
                        <p class="item-price">$${priceProduct}</p>
                        <div class="quantity-control">
                            <button class="quantity-button decrease">−</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-button increase">+</button>
                            <button class="remove-button">Remove</button>
                        </div>
                    </div>`;

            const decrease = itemElement.querySelector('.decrease');
            const increase = itemElement.querySelector('.increase');
            const removeBtn = itemElement.querySelector('.remove-button');

            decrease.addEventListener('click', () => {
                const newQuantity = item.quantity - 1;
                store.updateQuantity(item.id, newQuantity);
            });

            increase.addEventListener('click', () => {
                const newQuantity = item.quantity + 1;
                store.updateQuantity(item.id, newQuantity);
            });

            removeBtn.addEventListener('click', () => {
                store.removeProduct(item.id);
            });

            orderItems.appendChild(itemElement);
        });
    }

    const totals = calculateTotals(cart);

    const orderSummary = sidebar.querySelector('.order-summary');
    orderSummary.innerHTML = `
                <div class="summary-row">
                    <span class="summary-label">Subtotal</span>
                    <span class="summary-value">$ ${totals.subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Tax (8%)</span>
                    <span class="summary-value">$ ${totals.tax.toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span class="summary-label">Total</span>
                    <span class="summary-value">$ ${totals.total.toFixed(2)}</span>
                </div>`;
}
