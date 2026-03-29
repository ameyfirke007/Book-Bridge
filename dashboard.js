/* ============================================================
   BookBridge - Dashboard Module (dashboard.js)
   Connected with Spring Boot Backend
============================================================ */

const DashboardPage = (() => {

    const user = Auth.requireAuth('login.html');
    if (!user) return {};

    const BOOK_API = "http://localhost:8080/api/books";
    const ORDER_API = "http://localhost:8080/api/orders";

    const token = localStorage.getItem("jwtToken");

    /* ─── Populate profile info ───────────────────────────── */

    const populateProfile = () => {

        const initials =
            user.fullName.split(' ')
                .map(w => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

        document.querySelectorAll('.user-initial')
            .forEach(el => el.textContent = initials);

        document.querySelectorAll('.user-name')
            .forEach(el => el.textContent = user.fullName);

        document.querySelectorAll('.user-email')
            .forEach(el => el.textContent = user.email);

        document.querySelectorAll('.user-college')
            .forEach(el => el.textContent = user.college);

        document.querySelectorAll('.user-course')
            .forEach(el => el.textContent = user.course);

        ['fullName', 'email', 'college', 'course'].forEach(field => {

            const input = document.getElementById('profile_' + field);

            if (input) input.value = user[field] || '';

        });
    };

    /* ─── Load Stats ─────────────────────────────────────── */

    const loadStats = async () => {

        try {

            const booksRes = await fetch(`${BOOK_API}`);
            const allBooks = await booksRes.json();

            const ordersRes = await fetch(`${ORDER_API}/user/${user.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const myPurchases = await ordersRes.json();

            const myListings =
                allBooks.filter(b => b.sellerId === user.id);

            const moneySaved =
                myPurchases.reduce((sum, o) =>
                    sum + (o.originalPrice - o.sellPrice), 0);

            const setCount = (id, val, prefix = '', suffix = '') => {

                const el = document.getElementById(id);

                if (el)
                    Books.animateCounter(el, val, 1200, prefix, suffix);
            };

            setCount('stat_listed', myListings.length);
            setCount('stat_purchased', myPurchases.length);
            setCount('stat_saved', moneySaved, '₹');
            setCount('stat_total', allBooks.length);

            return { myListings, myPurchases };

        } catch (err) {

            console.error("Dashboard stats error", err);

            return { myListings: [], myPurchases: [] };

        }
    };

    /* ─── Load listed books ─────────────────────────────── */

    const loadListings = (myListings) => {

        const grid = document.getElementById('myListingsGrid');
        if (!grid) return;

        if (!myListings.length) {

            grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;padding:40px 0;">
                <div class="empty-icon">📚</div>
                <h3>No listings yet</h3>
                <p>List your first book and start earning!</p>
                <a href="sell-book.html" class="btn btn-primary" style="margin-top:16px;">+ Sell a Book</a>
            </div>`;

            return;
        }

        grid.innerHTML =
            myListings
                .map(b =>
                    Books.renderBookCard(b, {
                        showBuyBtn: false,
                        showDeleteBtn: true
                    })
                ).join('');

        setTimeout(() => {

            grid.querySelectorAll('.scroll-animate')
                .forEach((el, i) => {

                    setTimeout(() =>
                        el.classList.add('visible'), i * 80);

                });

        }, 50);
    };

    /* ─── Load purchases ─────────────────────────────────── */

    const loadPurchases = (myPurchases) => {

        const list = document.getElementById('myPurchasesList');
        if (!list) return;

        if (!myPurchases.length) {

            list.innerHTML = `
            <div class="empty-state" style="padding:40px 0;">
                <div class="empty-icon">🛒</div>
                <h3>No purchases yet</h3>
                <p>Browse books and make your first purchase!</p>
                <a href="buy-books.html" class="btn btn-primary" style="margin-top:16px;">Browse Books</a>
            </div>`;

            return;
        }

        const sorted =
            [...myPurchases]
                .sort((a, b) =>
                    new Date(b.orderDate) - new Date(a.orderDate));

        list.innerHTML = sorted.map(o => {

            const date =
                new Date(o.orderDate)
                    .toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    });

            const statusClass = {
                'Ordered': 'status-ordered',
                'Packed': 'status-packed',
                'Out for Delivery': 'status-outDelivery',
                'Delivered': 'status-delivered'
            }[o.status] || 'status-ordered';

            return `

            <div class="order-item scroll-animate">

                <img src="${o.bookImage || 'assets/book-placeholder.png'}"
                     class="order-img"
                     onerror="this.src='assets/book-placeholder.png'">

                <div class="order-details">

                    <div class="order-book-title">
                        ${o.bookTitle}
                    </div>

                    <div class="order-meta">

                        <span>👤 Seller: ${o.sellerName}</span>

                        <span>📅 Date: ${date}</span>

                        <span>💰 Paid:
                            <span style="color:var(--success);font-weight:700;">
                                ₹${o.sellPrice}
                            </span>
                        </span>

                    </div>

                    <span class="status-badge ${statusClass}">
                        ${o.status}
                    </span>

                </div>

            </div>

            `;

        }).join('');

        setTimeout(() => {

            list.querySelectorAll('.scroll-animate')
                .forEach((el, i) => {

                    setTimeout(() =>
                        el.classList.add('visible'), i * 80);

                });

        }, 50);
    };

    /* ─── Delete book ───────────────────────────────────── */

    const deleteBook = async (bookId) => {

        if (!confirm('Are you sure you want to remove this listing?'))
            return;

        try {

            await fetch(`${BOOK_API}/${bookId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            UI.showToast('Book listing removed!', 'info');

            init();

        } catch (err) {

            console.error(err);

            UI.showToast('Delete failed', 'error');

        }
    };

    /* ─── Profile form ──────────────────────────────────── */

    const initProfileForm = () => {

        const form = document.getElementById('profileForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {

            e.preventDefault();

            const updates = {

                fullName:
                    document.getElementById('profile_fullName')
                        ?.value?.trim(),

                college:
                    document.getElementById('profile_college')
                        ?.value?.trim(),

                course:
                    document.getElementById('profile_course')
                        ?.value?.trim()

            };

            Auth.updateProfile(updates);

            UI.showToast('Profile updated successfully! ✅', 'success');

            populateProfile();

        });
    };

    /* ─── Init ─────────────────────────────────────────── */

    const init = async () => {

        populateProfile();

        const { myListings, myPurchases } =
            await loadStats();

        loadListings(myListings);

        loadPurchases(myPurchases);

        initProfileForm();

    };

    init();

    return {
        deleteBook
    };

})();