// javascript
import store from "../state/store.js";

export function SideBardComponent() {
    // Contenedores principales
    const header = document.createElement('div');
    header.classList.add('sidebar-header');

    const titleEl = document.createElement('h2');
    titleEl.classList.add('sidebar-title');
    titleEl.textContent = 'Your Order';

    const orderCount = document.createElement('span');
    orderCount.classList.add('order-count');
    orderCount.textContent = '0';

    const clearBtn = document.createElement('button');
    clearBtn.classList.add('link-button', 'clear-all');
    // Añadir icono a Clear all
    const clearIcon = document.createElement('svg');
    clearIcon.setAttribute('viewBox','0 0 24 24');
    clearIcon.classList.add('button-icon');
    clearIcon.innerHTML = '<path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6L18.3333 19.3333C18.292 20.0794 17.6815 20.6667 16.9343 20.6667H7.06566C6.31847 20.6667 5.70799 20.0794 5.66667 19.3333L5 6M10 11V17M14 11V17M9 6V4C9 3.46957 9.21071 2.96086 9.58579 2.58579C9.96086 2.21071 10.4696 2 11 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    clearBtn.appendChild(clearIcon);
    const clearText = document.createTextNode('Clear all');
    clearBtn.appendChild(clearText);

    header.appendChild(titleEl);
    header.appendChild(orderCount);
    header.appendChild(clearBtn);

    const orderItems = document.createElement('div');
    orderItems.classList.add('order-items');

    const orderSummary = document.createElement('div');
    orderSummary.classList.add('order-summary');

    const checkoutButton = document.createElement('button');
    checkoutButton.classList.add('button', 'primary');
    // Compose button content without innerHTML
    const checkoutText = document.createTextNode('Confirm Order');
    const checkoutIcon = document.createElement('svg');
    checkoutIcon.classList.add('button-icon-right');
    checkoutIcon.setAttribute('viewBox','0 0 24 24');
    checkoutIcon.innerHTML = '<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    checkoutButton.appendChild(checkoutText);
    checkoutButton.appendChild(checkoutIcon);

    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');
    sidebar.appendChild(header);
    sidebar.appendChild(orderItems);
    sidebar.appendChild(orderSummary);
    sidebar.appendChild(checkoutButton);

    // Handlers que se registran UNA sola vez
    clearBtn.addEventListener('click', () => {
        store.clearCart();
    });

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

// Crea un item de orden usando appendChild
function createOrderItem(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('order-item');
    itemElement.dataset.id = item.id;

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.alt || item.name;
    img.classList.add('item-image');

    const details = document.createElement('div');
    details.classList.add('item-details');

    const name = document.createElement('h4');
    name.classList.add('item-name');
    name.textContent = item.name;

    const price = document.createElement('p');
    price.classList.add('item-price');
    price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

    const qtyControl = document.createElement('div');
    qtyControl.classList.add('quantity-control');

    const dec = document.createElement('button'); dec.classList.add('quantity-button','decrease'); dec.textContent = '−';
    const qty = document.createElement('span'); qty.classList.add('quantity'); qty.textContent = item.quantity;
    const inc = document.createElement('button'); inc.classList.add('quantity-button','increase'); inc.textContent = '+';
    const removeBtn = document.createElement('button'); removeBtn.classList.add('remove-button');
    // Añadir icono y texto al botón de remover (icono primero)
    const removeIcon = document.createElement('svg');
    removeIcon.setAttribute('viewBox','0 0 24 24');
    removeIcon.classList.add('button-icon');
    removeIcon.innerHTML = '<path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    const removeText = document.createTextNode('Remove');
    removeBtn.appendChild(removeIcon);
    removeBtn.appendChild(removeText);

    qtyControl.appendChild(dec);
    qtyControl.appendChild(qty);
    qtyControl.appendChild(inc);
    qtyControl.appendChild(removeBtn);

    details.appendChild(name);
    details.appendChild(price);
    details.appendChild(qtyControl);

    itemElement.appendChild(img);
    itemElement.appendChild(details);

    // Attach handlers for this item
    dec.addEventListener('click', () => {
        const newQuantity = item.quantity - 1;
        store.updateQuantity(item.id, newQuantity);
    });

    inc.addEventListener('click', () => {
        const newQuantity = item.quantity + 1;
        store.updateQuantity(item.id, newQuantity);
    });

    removeBtn.addEventListener('click', () => {
        store.removeProduct(item.id);
    });

    return itemElement;
}

// Recibe todos los avisos del canal
function render(sidebar, cartObject) {
    const cart = cartObject.cart || [];

    // Actualizamos contador de productos
    const count = cart.reduce((s,i) => s + i.quantity, 0);
    const countElement = sidebar.querySelector('.order-count');
    countElement.textContent = count || '0';

    // Order Items section
    const orderItems = sidebar.querySelector('.order-items');
    // Limpiar contenido previo
    while (orderItems.firstChild) orderItems.removeChild(orderItems.firstChild);

    if (cart.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Your order is empty';
        orderItems.appendChild(p);
    } else {
        cart.forEach(item => {
            const itemEl = createOrderItem(item);
            orderItems.appendChild(itemEl);
        });
    }

    const totals = calculateTotals(cart);

    const orderSummary = sidebar.querySelector('.order-summary');
    // Limpiar y construir summary
    while (orderSummary.firstChild) orderSummary.removeChild(orderSummary.firstChild);

    const row1 = document.createElement('div'); row1.classList.add('summary-row');
    const label1 = document.createElement('span'); label1.classList.add('summary-label'); label1.textContent = 'Subtotal';
    const value1 = document.createElement('span'); value1.classList.add('summary-value'); value1.textContent = `$ ${totals.subtotal.toFixed(2)}`;
    row1.appendChild(label1); row1.appendChild(value1);

    const row2 = document.createElement('div'); row2.classList.add('summary-row');
    const label2 = document.createElement('span'); label2.classList.add('summary-label'); label2.textContent = 'Tax (8%)';
    const value2 = document.createElement('span'); value2.classList.add('summary-value'); value2.textContent = `$ ${totals.tax.toFixed(2)}`;
    row2.appendChild(label2); row2.appendChild(value2);

    const row3 = document.createElement('div'); row3.classList.add('summary-row','total');
    const label3 = document.createElement('span'); label3.classList.add('summary-label'); label3.textContent = 'Total';
    const value3 = document.createElement('span'); value3.classList.add('summary-value'); value3.textContent = `$ ${totals.total.toFixed(2)}`;
    row3.appendChild(label3); row3.appendChild(value3);

    orderSummary.appendChild(row1);
    orderSummary.appendChild(row2);
    orderSummary.appendChild(row3);
}
