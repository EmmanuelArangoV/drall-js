export function SideBardComponent() {
    const header = document.createElement('div');
    header.classList.add('sidebard-header');
    header.innerHTML =
        `
        <h2 class="sidebar-title">Your Order</h2>
        <span class="order-count">2</span>
        <button class="link-button">Clear all</button>`;

    const orderItems = document.createElement('div');
    orderItems.classList.add('order-items');


}