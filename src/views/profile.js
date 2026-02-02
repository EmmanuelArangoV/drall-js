import store from "../state/store.js";
import JsonService from "../services/jsonService.js";

export function ProfileView() {
    const main = document.createElement('main');
    main.classList.add('layout', 'profile-layout');

    const section = document.createElement('section');
    section.classList.add('content');

    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header');
    const h1 = document.createElement('h1'); h1.classList.add('page-title'); h1.textContent = 'Recent Orders';
    sectionHeader.appendChild(h1);

    const list = document.createElement('div'); list.classList.add('list');

    section.appendChild(sectionHeader);
    section.appendChild(list);

    const aside = document.createElement('aside'); aside.classList.add('sidebar','profile-sidebar');
    const profileCard = document.createElement('div'); profileCard.classList.add('profile-card');

    const avatar = document.createElement('div'); avatar.classList.add('avatar');
    const img = document.createElement('img'); img.src = '';
    img.alt = 'User'; avatar.appendChild(img);
    const avatarBadge = document.createElement('div'); avatarBadge.classList.add('avatar-badge'); avatar.appendChild(avatarBadge);

    const profileName = document.createElement('h2'); profileName.classList.add('profile-name'); profileName.textContent = '';
    const profileEmail = document.createElement('p'); profileEmail.classList.add('profile-email'); profileEmail.textContent = '';
    const profileRole = document.createElement('span'); profileRole.classList.add('profile-role'); profileRole.textContent = '';

    profileCard.appendChild(avatar);
    profileCard.appendChild(profileName);
    profileCard.appendChild(profileEmail);
    profileCard.appendChild(profileRole);

    aside.appendChild(profileCard);

    main.appendChild(section);
    main.appendChild(aside);

    populateUser(profileName, profileEmail, profileRole, img);

    // load user orders via API
    async function loadUserOrders() {
        const user = store.getUser();
        list.innerHTML = '';
        if (!user) {
            const p = document.createElement('p'); p.textContent = 'Please log in to view your orders.'; list.appendChild(p); return;
        }

        const res = await JsonService.getOrders();
        if (!res.success) {
            const p = document.createElement('p'); p.textContent = 'Error loading orders: ' + res.error; list.appendChild(p); return;
        }

        const orders = (res.orders || []).filter(o => {
            // algunos orders pueden tener customerEmail o user
            if (o.customerEmail) return o.customerEmail === user.email;
            if (o.user) return o.user === user.email || o.user === user.id;
            return false;
        });

        if (orders.length === 0) {
            const p = document.createElement('p'); p.textContent = 'No orders found for this user.'; list.appendChild(p); return;
        }

        orders.forEach(o => {
            const article = document.createElement('article'); article.classList.add('list-item','order');
            article.style.cursor = 'pointer';
            const icon = document.createElement('div'); icon.classList.add('status-icon', o.status === 'delivered' ? 'success' : 'warning');
            icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 16V6C13 4.93913 12.5786 3.92172 11.8284 3.17157C11.0783 2.42143 10.0609 2 9 2H5C3.93913 2 2.92172 2.42143 2.17157 3.17157C1.42143 3.92172 1 4.93913 1 6V18C1 19.0609 1.42143 20.0783 2.17157 20.8284C2.92172 21.5786 3.93913 22 5 22H9C10.0609 22 11.0783 21.5786 11.8284 20.8284C12.5786 20.0783 13 19.0609 13 18V16ZM13 16H19C20.0609 16 21.0783 15.5786 21.8284 14.8284C22.5786 14.0783 23 13.0609 23 12V12C23 10.9391 22.5786 9.92172 21.8284 9.17157C21.0783 8.42143 20.0609 8 19 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

            const info = document.createElement('div'); info.classList.add('order-info');
            const orderId = document.createElement('h3'); orderId.classList.add('order-id'); orderId.textContent = o.id;
            const meta = document.createElement('p'); meta.classList.add('order-meta'); meta.textContent = `${new Date(o.createdAt).toLocaleString()} • ${o.items ? o.items.length : 0} Items`;
            info.appendChild(orderId); info.appendChild(meta);

            const actions = document.createElement('div'); actions.classList.add('order-actions');
            const totalEl = document.createElement('p'); totalEl.classList.add('order-total'); totalEl.textContent = `$${(o.total||0).toFixed(2)}`;
            const statusBadge = document.createElement('span'); statusBadge.classList.add('status-badge', o.status || 'pending'); statusBadge.textContent = (o.status || 'Pending').charAt(0).toUpperCase() + (o.status || 'Pending').slice(1);
            actions.appendChild(totalEl); actions.appendChild(statusBadge);

            article.appendChild(icon); article.appendChild(info); article.appendChild(actions);

            // Detalle expandible (oculto inicialmente)
            const detail = document.createElement('div'); detail.classList.add('order-detail'); detail.style.display = 'none';
            detail.style.marginTop = '8px'; detail.style.paddingTop = '8px'; detail.style.borderTop = '1px solid var(--muted, #eee)';
            // Items list dentro del detalle
            const itemsList = document.createElement('div'); itemsList.classList.add('detail-items');
            (o.items || []).forEach(it => {
                const row = document.createElement('div'); row.classList.add('detail-item');
                const q = document.createElement('span'); q.classList.add('item-quantity'); q.textContent = `${it.quantity}x`;
                const infoIt = document.createElement('div'); infoIt.classList.add('item-info');
                const t = document.createElement('p'); t.classList.add('item-title'); t.textContent = it.name;
                infoIt.appendChild(t);
                const p = document.createElement('span'); p.classList.add('item-price'); p.textContent = `$${(it.price * it.quantity).toFixed(2)}`;
                row.appendChild(q); row.appendChild(infoIt); row.appendChild(p);
                itemsList.appendChild(row);
            });
            detail.appendChild(itemsList);
            // Summary
            const sum = document.createElement('div'); sum.classList.add('detail-summary'); sum.style.marginTop = '8px';
            sum.innerHTML = `<div class="summary-row"><span class="summary-label">Subtotal</span><span class="summary-value">$ ${(o.subtotal||0).toFixed(2)}</span></div>
                             <div class="summary-row"><span class="summary-label">Tax (8%)</span><span class="summary-value">$ ${(o.tax||0).toFixed(2)}</span></div>
                             <div class="summary-row total"><span class="summary-label">Total</span><span class="summary-value">$ ${(o.total||0).toFixed(2)}</span></div>`;
            detail.appendChild(sum);
            article.appendChild(detail);

            // Toggle expand/collapse al click en el artículo
            article.addEventListener('click', (ev) => {
                // evitar toggle si se clickea algún botón dentro (none present here), y prevenir bubbling si se requiere
                const isButton = ev.target.closest('button');
                if (isButton) return;
                detail.style.display = detail.style.display === 'none' ? '' : 'none';
            });

            list.appendChild(article);
        });
    }

    loadUserOrders();

    return main;
}

function populateUser(nameEl, emailEl, roleEl, imgEl) {
    const user = store.getUser();
    if (!user) {
        nameEl.textContent = 'Guest';
        emailEl.textContent = '';
        roleEl.textContent = 'Visitor';
        imgEl.src = `https://ui-avatars.com/api/?name=Guest&background=888&color=fff&size=120`;
        return;
    }

    nameEl.textContent = user.name || user.email || 'User';
    emailEl.textContent = user.email || '';
    roleEl.textContent = (user.role || 'User').charAt(0).toUpperCase() + (user.role || 'User').slice(1);
    imgEl.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=00D26B&color=fff&size=120`;
}
