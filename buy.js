/* ============================================================
   BookBridge - Buy Books Page Module (buy.js)
   Connected with Spring Boot Backend
============================================================ */

const BuyPage = (() => {

    const grid = document.getElementById('booksGrid');
    if (!grid) return {};

    const BOOK_API = "http://localhost:8080/api/books";
    const ORDER_API = "http://localhost:8080/api/orders";

    let allBooks = [];

    let filters = {
        query: '',
        branch: '',
        subject: '',
        maxPrice: '',
        condition: ''
    };

    /* ─── Populate Filter Dropdowns ───────────────────────── */

    const populateFilters = () => {

        const branchSel = document.getElementById('filterBranch');
        const subjectSel = document.getElementById('filterSubject');

        const branches = [...new Set(allBooks.map(b => b.branch))];
        const subjects = [...new Set(allBooks.map(b => b.subject))];

        if (branchSel) {
            branchSel.innerHTML =
                '<option value="">All Branches</option>' +
                branches.map(b => `<option value="${b}">${b}</option>`).join('');
        }

        if (subjectSel) {
            subjectSel.innerHTML =
                '<option value="">All Subjects</option>' +
                subjects.map(s => `<option value="${s}">${s}</option>`).join('');
        }
    };

    /* ─── Render Books ───────────────────────────────────── */

    const render = (books) => {

        const countEl = document.getElementById('booksCount');

        if (countEl)
            countEl.textContent =
                `${books.length} book${books.length !== 1 ? 's' : ''} found`;

        if (!books.length) {

            grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <div class="empty-icon">📚</div>
                <h3>No books found</h3>
                <p>Try adjusting your filters.</p>
            </div>`;

            return;
        }

        grid.innerHTML = books.map(b => `

        <div class="book-card scroll-animate" data-id="${b.id}">

            <img src="${b.image || 'assets/book-placeholder.png'}"
                 class="book-img"
                 onerror="this.src='assets/book-placeholder.png'">

            <div class="book-info">

                <h3>${b.title}</h3>
                <p>${b.author}</p>

                <p class="book-branch">
                    ${b.branch} • ${b.subject}
                </p>

                <div class="price-row">
                    <span class="orig-price">₹${b.originalPrice}</span>
                    <span class="sell-price">₹${b.sellingPrice}</span>
                </div>

                <button class="buy-btn"
                    onclick="BuyPage.handleBuyNow(${b.id})">
                    🛒 Buy Now
                </button>

            </div>

        </div>

        `).join('');

        setTimeout(() => {
            grid.querySelectorAll('.scroll-animate').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 80);
            });
        }, 50);
    };

    /* ─── Apply Filters ───────────────────────────────────── */

    const applyFilters = () => {

        const maxPrice =
            filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;

        let filtered = allBooks.filter(book => {

            const matchQuery =
                !filters.query ||
                book.title.toLowerCase().includes(filters.query.toLowerCase()) ||
                book.author.toLowerCase().includes(filters.query.toLowerCase());

            const matchBranch =
                !filters.branch || book.branch === filters.branch;

            const matchSubject =
                !filters.subject || book.subject === filters.subject;

            const matchPrice =
                !filters.maxPrice || book.sellingPrice <= maxPrice;

            const matchCondition =
                !filters.condition || book.condition === filters.condition;

            return matchQuery &&
                matchBranch &&
                matchSubject &&
                matchPrice &&
                matchCondition;

        });

        // Apply sort
        const sortVal = document.getElementById('sortBooks')?.value || '';
        if (sortVal === 'price_asc')  filtered = filtered.slice().sort((a, b) => a.sellingPrice - b.sellingPrice);
        if (sortVal === 'price_desc') filtered = filtered.slice().sort((a, b) => b.sellingPrice - a.sellingPrice);
        if (sortVal === 'newest')     filtered = filtered.slice().sort((a, b) => new Date(b.listedDate) - new Date(a.listedDate));
        if (sortVal === 'savings')    filtered = filtered.slice().sort((a, b) =>
            ((b.originalPrice - b.sellingPrice) / b.originalPrice) -
            ((a.originalPrice - a.sellingPrice) / a.originalPrice));

        render(filtered);
    };


    /* ─── Search Listener ─────────────────────────────────── */

    const searchInput = document.getElementById('searchBooks');

    if (searchInput) {

        let debounce;

        searchInput.addEventListener('input', (e) => {

            clearTimeout(debounce);

            debounce = setTimeout(() => {

                filters.query = e.target.value;
                applyFilters();

            }, 300);

        });
    }

    /* ─── Filter Listeners ────────────────────────────────── */

    ['filterBranch', 'filterSubject', 'filterCondition', 'filterPrice']
        .forEach(id => {

            const el = document.getElementById(id);
            if (!el) return;

            el.addEventListener('change', (e) => {

                const key = {
                    filterBranch:    'branch',
                    filterSubject:   'subject',
                    filterCondition: 'condition',
                    filterPrice:     'maxPrice'
                }[id];

                filters[key] = e.target.value;

                applyFilters();

            });

        });

    /* ─── Sort Listener ───────────────────────────────────── */

    const sortSel = document.getElementById('sortBooks');
    if (sortSel) {
        sortSel.addEventListener('change', () => applyFilters());
    }

    /* ─── Clear Filters ───────────────────────────────────── */

    const clearBtn = document.getElementById('clearFilters');

    if (clearBtn) {

        clearBtn.addEventListener('click', () => {

            filters = {
                query: '',
                branch: '',
                subject: '',
                maxPrice: '',
                condition: ''
            };

            if (searchInput) searchInput.value = '';

            ['filterBranch', 'filterSubject', 'filterCondition', 'filterPrice']
                .forEach(id => {

                    const el = document.getElementById(id);
                    if (el) el.value = '';

                });

            applyFilters();

        });
    }

    /* ─── Buy Book (Create Order API) ─────────────────────── */

    const handleBuyNow = async (bookId) => {

        const currentUser = Auth.getCurrentUser();
        const token = localStorage.getItem("jwtToken");

        if (!currentUser) {

            UI.showToast('Please login to purchase books!', 'warning');

            setTimeout(() => window.location.href = 'login.html', 1500);

            return;
        }

        const book = allBooks.find(b => b.id == bookId);

        if (!book) {
            UI.showToast('Book not found.', 'error');
            return;
        }

        const order = {
            bookId: book.id,
            buyerId: currentUser.id
        };

        try {

            const response = await fetch(`${ORDER_API}/create`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify(order)

            });

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error("Book already purchased");
                } else {
                    throw new Error("Order failed. Status: " + response.status);
                }
            }

            UI.showToast(`"${book.title}" ordered successfully! 🎉`, 'success');

            setTimeout(() => {

                if (confirm('View your orders now?')) {
                    window.location.href = 'track-order.html';
                }

            }, 800);

        } catch (err) {

            console.error(err);

            UI.showToast(err.message || 'Order failed.', 'error');

        }
    };

    /* ─── Load Books from Backend ─────────────────────────── */

    /* ─── Skeleton HTML helper ─────────────────────────────── */
    const skeletonCard = () => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton skeleton-line wide"></div>
                <div class="skeleton skeleton-line mid"></div>
                <div class="skeleton skeleton-line short"></div>
            </div>
        </div>`;

    const init = async () => {

        grid.innerHTML = Array(6).fill(skeletonCard()).join('');

        try {

            const res = await fetch(`${BOOK_API}`);

            allBooks = await res.json();

            populateFilters();

            setTimeout(() => applyFilters(), 300);

        } catch (err) {

            console.error("Error loading books", err);

            UI.showToast("Failed to load books", "error");

        }
    };

    init();

    return { handleBuyNow };

})();