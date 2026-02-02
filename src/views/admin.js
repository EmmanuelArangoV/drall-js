import JsonService from "../services/jsonService.js";

export function AdminView() {
    const main = document.createElement('main');
    main.classList.add('layout', 'dashboard-layout');

    const section = document.createElement('section');
    section.classList.add('content');

    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header');
    const h1 = document.createElement('h1'); h1.classList.add('page-title'); h1.textContent = 'Recent Orders';
    const actions = document.createElement('div'); actions.classList.add('actions');
    const btnRefresh = document.createElement('button'); btnRefresh.classList.add('button','tertiary'); btnRefresh.textContent = 'Refresh';
    actions.appendChild(btnRefresh);
    sectionHeader.appendChild(h1); sectionHeader.appendChild(actions);

    const tableContainer = document.createElement('div'); tableContainer.classList.add('table-container');
    const table = document.createElement('table'); table.classList.add('table');
    const thead = document.createElement('thead'); thead.innerHTML = `<tr><th>ID</th><th>User</th><th>Date</th><th>Status</th><th>Total</th></tr>`;
    const tbody = document.createElement('tbody');
    table.appendChild(thead); table.appendChild(tbody);
    tableContainer.appendChild(table);

    // Aside (detalle mejorado)
    const aside = document.createElement('aside'); aside.classList.add('sidebar','detail-sidebar');

    // DETAIL HEADER: título, id y status
    const detailHeader = document.createElement('div'); detailHeader.classList.add('detail-header');
    const titleRow = document.createElement('div'); titleRow.style.display = 'flex'; titleRow.style.justifyContent = 'space-between'; titleRow.style.alignItems = 'center';
    const detailTitle = document.createElement('div');
    const dtSmall = document.createElement('p'); dtSmall.classList.add('detail-title'); dtSmall.textContent = 'ORDER DETAILS';
    const detailId = document.createElement('h3'); detailId.classList.add('detail-id'); detailId.textContent = '';
    detailTitle.appendChild(dtSmall); detailTitle.appendChild(detailId);

    const statusWrap = document.createElement('div'); statusWrap.style.display = 'flex'; statusWrap.style.alignItems = 'center'; statusWrap.style.gap = '0.5rem';
    const statusBadge = document.createElement('span'); statusBadge.classList.add('status-badge'); statusBadge.textContent = '';
    // small action buttons (copy id, open raw)
    const copyBtn = document.createElement('button'); copyBtn.classList.add('link-button'); copyBtn.textContent = 'Copy ID';
    copyBtn.addEventListener('click', () => { navigator.clipboard?.writeText(detailId.textContent || ''); copyBtn.textContent = 'Copied'; setTimeout(()=> copyBtn.textContent = 'Copy ID',900); });

    statusWrap.appendChild(statusBadge); statusWrap.appendChild(copyBtn);
    titleRow.appendChild(detailTitle); titleRow.appendChild(statusWrap);
    detailHeader.appendChild(titleRow);

    aside.appendChild(detailHeader);

    // CUSTOMER block: avatar + info
    const customerInfo = document.createElement('div'); customerInfo.classList.add('customer-info');
    // left avatar
    const custAvatar = document.createElement('div'); custAvatar.classList.add('customer-avatar');
    const avatarSVG = document.createElement('svg'); avatarSVG.setAttribute('viewBox','0 0 24 24'); avatarSVG.innerHTML = '<path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>';
    custAvatar.appendChild(avatarSVG);

    const custDetails = document.createElement('div'); custDetails.classList.add('customer-details');
    const custLabel = document.createElement('p'); custLabel.classList.add('customer-label'); custLabel.textContent = 'Customer';
    const custName = document.createElement('p'); custName.classList.add('customer-name'); custName.textContent = '';
    const custContact = document.createElement('p'); custContact.classList.add('customer-contact'); custContact.textContent = '';
    custDetails.appendChild(custLabel); custDetails.appendChild(custName); custDetails.appendChild(custContact);

    customerInfo.appendChild(custAvatar); customerInfo.appendChild(custDetails);
    aside.appendChild(customerInfo);

    // Items section: clear header + list container
    const itemsSection = document.createElement('div'); itemsSection.classList.add('detail-section');
    const itemsHeader = document.createElement('h4'); itemsHeader.classList.add('section-label'); itemsHeader.textContent = 'Items';
    const itemsWrapper = document.createElement('div'); itemsWrapper.classList.add('detail-items');
    itemsSection.appendChild(itemsHeader); itemsSection.appendChild(itemsWrapper);
    aside.appendChild(itemsSection);

    // Summary card
    const summary = document.createElement('div'); summary.classList.add('detail-summary');
    const rowSub = document.createElement('div'); rowSub.classList.add('summary-row'); const lblSub = document.createElement('span'); lblSub.classList.add('summary-label'); lblSub.textContent = 'Subtotal'; const valSub = document.createElement('span'); valSub.classList.add('summary-value'); valSub.textContent = '$ 0.00'; rowSub.appendChild(lblSub); rowSub.appendChild(valSub);
    const rowTax = document.createElement('div'); rowTax.classList.add('summary-row'); const lblTax = document.createElement('span'); lblTax.classList.add('summary-label'); lblTax.textContent = 'Tax (8%)'; const valTax = document.createElement('span'); valTax.classList.add('summary-value'); valTax.textContent = '$ 0.00'; rowTax.appendChild(lblTax); rowTax.appendChild(valTax);
    const rowTot = document.createElement('div'); rowTot.classList.add('summary-row','total'); const lblTot = document.createElement('span'); lblTot.classList.add('summary-label'); lblTot.textContent = 'Total'; const valTot = document.createElement('span'); valTot.classList.add('summary-value'); valTot.textContent = '$ 0.00'; rowTot.appendChild(lblTot); rowTot.appendChild(valTot);
    summary.appendChild(rowSub); summary.appendChild(rowTax); summary.appendChild(rowTot);
    aside.appendChild(summary);

    // Status update area (sticky bottom)
    const statusUpdate = document.createElement('div'); statusUpdate.classList.add('status-update'); statusUpdate.style.marginTop = '0.5rem';
    const label = document.createElement('h4'); label.classList.add('section-label'); label.textContent = 'UPDATE STATUS';
    const select = document.createElement('select'); select.classList.add('select'); ['preparing','pending','ready','delivered','cancelled'].forEach(opt => { const o = document.createElement('option'); o.value = opt; o.textContent = opt.charAt(0).toUpperCase()+opt.slice(1); select.appendChild(o); });
    const updateBtn = document.createElement('button'); updateBtn.classList.add('button','primary'); updateBtn.textContent = 'Update Status';
    const spacer = document.createElement('div'); spacer.style.height = '0.5rem';
    statusUpdate.appendChild(label); statusUpdate.appendChild(select); statusUpdate.appendChild(spacer); statusUpdate.appendChild(updateBtn);
    aside.appendChild(statusUpdate);

    // Assemble main
    main.appendChild(section); main.appendChild(aside);
    section.appendChild(sectionHeader); section.appendChild(tableContainer);

    // Load orders and render table rows
    async function loadOrders() {
        tbody.innerHTML = '';
        itemsWrapper.innerHTML = '';
        valSub.textContent = '$ 0.00'; valTax.textContent = '$ 0.00'; valTot.textContent = '$ 0.00';
        const res = await JsonService.getOrders();
        if (!res.success) {
            const tr = document.createElement('tr'); const td = document.createElement('td'); td.colSpan = 5; td.textContent = 'Error loading orders: ' + res.error; tr.appendChild(td); tbody.appendChild(tr); return;
        }

        const orders = res.orders || [];
        orders.forEach(o => {
            const tr = document.createElement('tr');
            const tdId = document.createElement('td'); tdId.textContent = o.id;
            const tdUser = document.createElement('td'); tdUser.textContent = o.customerName || o.user || (o.items && o.items.length>0 ? o.items[0].name : '');
            const tdDate = document.createElement('td'); tdDate.textContent = new Date(o.createdAt).toLocaleString();
            const tdStatus = document.createElement('td'); const statusSpan = document.createElement('span'); statusSpan.classList.add('status-badge'); statusSpan.textContent = o.status || 'preparing'; tdStatus.appendChild(statusSpan);
            const tdTotal = document.createElement('td'); tdTotal.classList.add('price'); tdTotal.textContent = `$${(o.total || 0).toFixed(2)}`;
            tr.appendChild(tdId); tr.appendChild(tdUser); tr.appendChild(tdDate); tr.appendChild(tdStatus); tr.appendChild(tdTotal);
            tr.dataset.orderId = o.id;
            tbody.appendChild(tr);
        });
    }

    // Attach handlers (selection, details, update)
    attachAdminHandlers({ tbody, select, updateBtn, detailId, statusBadge, customerInfo, itemsWrapper, valSub, valTax, valTot });

    btnRefresh.addEventListener('click', () => loadOrders());

    // initial load
    loadOrders();

    return main;
}

function attachAdminHandlers(ctx) {
    const { tbody, select, updateBtn, detailId, statusBadge, customerInfo, itemsWrapper, valSub, valTax, valTot } = ctx;
    let selectedOrderId = null;

    // row click: select + load details
    tbody.addEventListener('click', async (e) => {
        const tr = e.target.closest('tr'); if (!tr) return;
        // visual selection
        const prev = tbody.querySelector('tr.selected'); if (prev) prev.classList.remove('selected');
        tr.classList.add('selected');

        selectedOrderId = tr.dataset.orderId;
        detailId.textContent = selectedOrderId;

        const res = await JsonService.getOrderById(selectedOrderId);
        if (!res.success) return;
        const order = res.order;

        // status badge: set text and class for color
        const status = order.status || 'preparing';
        statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        // normalize classes: remove previous status classes and add the current
        statusBadge.className = 'status-badge ' + (status || 'preparing');

        // customer
        const name = order.customerName || order.user || 'Guest';
        const email = order.customerEmail || '';
        // fill customer block
        const cDetails = customerInfo.querySelector('.customer-details');
        if (cDetails) {
            cDetails.querySelector('.customer-name').textContent = name;
            cDetails.querySelector('.customer-contact').textContent = email;
        }
        // avatar: initials (simple)
        const avatar = customerInfo.querySelector('.customer-avatar');
        if (avatar) {
            avatar.innerHTML = '';
            const svg = document.createElement('svg'); svg.setAttribute('viewBox','0 0 24 24'); svg.innerHTML = '<path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>';
            avatar.appendChild(svg);
        }

        // show createdAt under ID if available
        const headerSmall = document.querySelector('.detail-header .detail-meta');
        if (headerSmall) headerSmall.remove();
        if (order.createdAt) {
            const meta = document.createElement('p'); meta.classList.add('detail-meta'); meta.style.marginTop = '6px'; meta.style.color = 'var(--color-text-secondary)'; meta.textContent = new Date(order.createdAt).toLocaleString();
            const dh = customerInfo.parentElement.querySelector('.detail-header');
            if (dh) dh.appendChild(meta);
        }

        // items: fetch thumbnails in parallel
        itemsWrapper.innerHTML = '';
        const items = order.items || [];
        // fetch product data for thumbnails
        const productPromises = items.map(it => it.productId ? JsonService.getProductById(it.productId) : Promise.resolve({ success: false }));
        const products = await Promise.all(productPromises);

        items.forEach((it, idx) => {
            const prodRes = products[idx];
            const thumb = (prodRes && prodRes.success && prodRes.product && prodRes.product.image) ? prodRes.product.image : null;

            const itemEl = document.createElement('div'); itemEl.classList.add('detail-item');

            // thumbnail
            const thumbDiv = document.createElement('div'); thumbDiv.style.width = '56px'; thumbDiv.style.height = '56px'; thumbDiv.style.flex = '0 0 56px'; thumbDiv.style.borderRadius = '8px'; thumbDiv.style.overflow = 'hidden'; thumbDiv.style.background = 'var(--color-secondary)';
            if (thumb) {
                const iImg = document.createElement('img'); iImg.src = thumb; iImg.alt = it.name; iImg.style.width = '100%'; iImg.style.height = '100%'; iImg.style.objectFit = 'cover'; thumbDiv.appendChild(iImg);
            } else {
                const placeholder = document.createElement('div'); placeholder.style.width = '100%'; placeholder.style.height = '100%'; placeholder.style.display = 'flex'; placeholder.style.alignItems = 'center'; placeholder.style.justifyContent = 'center'; placeholder.style.color = 'var(--color-text-secondary)'; placeholder.textContent = it.name.charAt(0) || '?'; thumbDiv.appendChild(placeholder);
            }

            const infoDiv = document.createElement('div'); infoDiv.classList.add('item-info'); infoDiv.style.marginLeft = '12px';
            const title = document.createElement('p'); title.classList.add('item-title'); title.textContent = it.name; title.style.marginBottom = '6px';
            infoDiv.appendChild(title);
            if (it.note) { const note = document.createElement('p'); note.classList.add('item-note'); note.textContent = it.note; note.style.fontSize = '0.85rem'; note.style.color = 'var(--color-text-secondary)'; infoDiv.appendChild(note); }

            const priceSpan = document.createElement('div'); priceSpan.classList.add('item-price'); priceSpan.textContent = `$${(it.price*it.quantity).toFixed(2)}`;
            priceSpan.style.marginLeft = 'auto'; priceSpan.style.fontWeight = '700';

            itemEl.style.display = 'flex'; itemEl.style.alignItems = 'center'; itemEl.style.gap = '12px';
            const qtySpan = document.createElement('span'); qtySpan.classList.add('item-quantity'); qtySpan.textContent = `${it.quantity}x`; qtySpan.style.fontWeight = '700'; qtySpan.style.minWidth = '36px';

            itemEl.appendChild(thumbDiv);
            itemEl.appendChild(qtySpan);
            itemEl.appendChild(infoDiv);
            itemEl.appendChild(priceSpan);

            itemsWrapper.appendChild(itemEl);
        });

        // summary
        valSub.textContent = `$ ${Number(order.subtotal || 0).toFixed(2)}`;
        valTax.textContent = `$ ${Number(order.tax || 0).toFixed(2)}`;
        valTot.textContent = `$ ${Number(order.total || 0).toFixed(2)}`;

        // set select to current status
        select.value = order.status || 'preparing';
    });

    // Update status
    updateBtn.addEventListener('click', async () => {
        if (!selectedOrderId) return alert('No order selected');
        const newStatus = select.value;
        const res = await JsonService.updateOrder(selectedOrderId, { status: newStatus });
        if (!res.success) { alert('Error updating order: ' + res.error); return; }
        AdminView();
    });
}
