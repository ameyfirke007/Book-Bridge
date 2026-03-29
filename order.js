/* ============================================================
   BookBridge - Order Tracking Module (order.js)
============================================================ */
const OrderPage = (() => {

    const container = document.getElementById('ordersContainer');
    if (!container) return {};

    const STATUSES = ['Ordered', 'Packed', 'Out for Delivery', 'Delivered'];

    const STATUS_ICONS = {
        'Ordered': '📦',
        'Packed': '📬',
        'Out for Delivery': '🚚',
        'Delivered': '✅'
    };

    let ordersData = [];

    /* ─── Render tracker steps ────────────────────────────── */

    const renderTracker = (currentStatus) => {

        const currentIdx = STATUSES.indexOf(currentStatus);

        return `
        <div class="order-tracker">
        ${STATUSES.map((s, i) => `
        <div class="tracker-step ${i < currentIdx ? 'done' : i === currentIdx ? 'active' : ''}">
            <div class="tracker-dot">${i < currentIdx ? '✓' : STATUS_ICONS[s]}</div>
            <div class="tracker-label">${s}</div>
        </div>
        `).join('')}
        </div>`;
    };

    /* ─── Render single order card ────────────────────────── */

    const renderOrderCard = (order) => {

        const date = new Date(order.orderDate)
            .toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

        return `
        <div class="card scroll-animate">

            <div style="display:flex;gap:16px;flex-wrap:wrap">

                <img src="${order.bookImage || 'assets/book-placeholder.png'}"
                     class="order-img">

                <div style="flex:1">

                    <h3>${order.bookTitle}</h3>

                    <p>Seller: ${order.sellerName || ''}</p>

                    <p><strong>Order ID:</strong> ${order.id}</p>

                    <p><strong>Date:</strong> ${date}</p>

                    <p style="color:var(--success);font-weight:700">
                        ₹${order.sellPrice || ''}
                    </p>

                    <span class="status-badge">
                        ${STATUS_ICONS[order.status]} ${order.status}
                    </span>

                </div>

            </div>

            <div style="margin-top:16px">

                ${renderTracker(order.status)}

            </div>

        </div>`;
    };

    /* ─── Load orders from backend ────────────────────────── */

    const loadOrders = async () => {

        const user = Auth.getCurrentUser();

        if (!user) {

            container.innerHTML = `
            <div class="empty-state">
                <h3>Please login to view orders</h3>
            </div>`;

            return;
        }

        try {

            const res = await fetch(
                `http://localhost:8080/api/orders/user/${user.id}`
            );

            ordersData = await res.json();

        } catch (err) {

            console.error("Error loading orders", err);

        }

        if (!ordersData.length) {

            container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>No orders yet</h3>
                <p>You haven't purchased any books yet.</p>
                <a href="buy-books.html" class="btn btn-primary">
                    Browse Books
                </a>
            </div>`;

            return;
        }

        const sorted =
            [...ordersData].sort(
                (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
            );

        container.innerHTML = sorted
            .map(renderOrderCard)
            .join('');

        setTimeout(() => {

            container.querySelectorAll('.scroll-animate')
                .forEach((el, i) => {

                    setTimeout(() => {
                        el.classList.add('visible');
                    }, i * 100);

                });

        }, 100);
    };

    /* ─── Init ────────────────────────────────────────────── */

    loadOrders();

    return { loadOrders };

})();