/* ============================================================
   BookBridge - Books Module (books.js)
   Connected with Spring Boot Backend APIs
============================================================ */

const Books = (() => {

    const API_URL = "http://localhost:8080/api/books";

    /* ─── GET ALL BOOKS ───────────────────────────── */
    const getAllBooks = async () => {
        try {
            const res = await fetch(API_URL);
            return await res.json();
        } catch (err) {
            console.error("Error loading books:", err);
            return [];
        }
    };

    /* ─── ADD BOOK ───────────────────────────────── */
    const addBook = async (book) => {
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(book)
            });

            return await res.json();
        } catch (err) {
            console.error("Error adding book:", err);
        }
    };

    /* ─── DELETE BOOK ────────────────────────────── */
    const deleteBook = async (bookId) => {
        try {
            await fetch(`${API_URL}/${bookId}`, {
                method: "DELETE"
            });
        } catch (err) {
            console.error("Error deleting book:", err);
        }
    };

    /* ─── GET BOOK BY ID ─────────────────────────── */
    const getBookById = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            return await res.json();
        } catch (err) {
            console.error("Error fetching book:", err);
        }
    };

    /* ─── UPDATE BOOK ────────────────────────────── */
    const updateBook = async (bookId, updates) => {
        try {
            const res = await fetch(`${API_URL}/${bookId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updates)
            });

            return await res.json();
        } catch (err) {
            console.error("Error updating book:", err);
        }
    };

    /* ─── FILTER BOOKS ───────────────────────────── */
    const filterBooks = async ({
        query = '',
        branch = '',
        subject = '',
        minPrice = 0,
        maxPrice = Infinity,
        condition = ''
    } = {}) => {

        const books = await getAllBooks();

        return books.filter(book => {

            const matchQuery = !query ||
                [book.title, book.author, book.subject, book.sellerName]
                    .some(f => f && f.toLowerCase().includes(query.toLowerCase()));

            const matchBranch = !branch ||
                book.branch?.toLowerCase() === branch.toLowerCase();

            const matchSubject = !subject ||
                book.subject?.toLowerCase() === subject.toLowerCase();

            const matchPrice =
                book.sellingPrice >= minPrice &&
                book.sellingPrice <= maxPrice;

            const matchCond = !condition ||
                book.condition?.toLowerCase() === condition.toLowerCase();

            return matchQuery && matchBranch && matchSubject && matchPrice && matchCond;
        });
    };

    /* ─── GET UNIQUE BRANCHES ────────────────────── */
    const getBranches = async () => {
        const books = await getAllBooks();
        return [...new Set(books.map(b => b.branch))].sort();
    };

    /* ─── GET UNIQUE SUBJECTS ────────────────────── */
    const getSubjects = async () => {
        const books = await getAllBooks();
        return [...new Set(books.map(b => b.subject))].sort();
    };

    /* ─── SAVINGS % ──────────────────────────────── */
    const savingsPercent = (original, selling) =>
        Math.round(((original - selling) / original) * 100);

    /* ─── ANIMATE COUNTER ────────────────────────── */
    const animateCounter = (el, target, duration = 1500, prefix = '', suffix = '') => {
        if (!el) return;
        const start = Date.now();
        const tick = () => {
            const elapsed  = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            const val      = Math.round(eased * target);
            el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    /* ─── RENDER BOOK CARD ───────────────────────── */
    const renderBookCard = (book, options = {}) => {

        const {
            showBuyBtn = true,
            showEditBtn = false,
            showDeleteBtn = false
        } = options;

        const savings = savingsPercent(book.originalPrice, book.sellingPrice);

        const condClass = {
            'New': 'cond-new',
            'Good': 'cond-good',
            'Used': 'cond-used'
        }[book.condition] || 'cond-good';

        const initials =
            book.sellerName
                ? book.sellerName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                : '??';

        return `
        <div class="book-card scroll-animate" data-id="${book.id}">
        
        <div class="book-img-wrap">
        <img src="${book.image || 'assets/book-placeholder.png'}"
             alt="${book.title}"
             onerror="this.src='assets/book-placeholder.png'">

        <span class="book-condition ${condClass}">
        ${book.condition}
        </span>

        ${book.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
        </div>

        <div class="book-body">

        <div class="book-branch">
        ${book.branch} • ${book.subject}
        </div>

        <h3 class="book-title">${book.title}</h3>

        <p class="book-author">
        by ${book.author}
        </p>

        <div class="book-prices">
        <span class="book-original-price">₹${book.originalPrice}</span>
        <span class="book-selling-price">₹${book.sellingPrice}</span>
        <span class="book-savings">${savings}% off</span>
        </div>

        <div class="book-seller">

        <div class="seller-avatar">${initials}</div>

        <div class="seller-info">
        <div class="seller-name">${book.sellerName}</div>
        <div class="seller-college">${book.sellerCollege || ''}</div>
        </div>

        </div>

        <div class="book-actions">

        ${showBuyBtn ?
                `<button class="btn btn-success btn-sm"
                 onclick="BuyPage.handleBuyNow('${book.id}')">
                 🛒 Buy Now
                 </button>`
                : ''}

        ${showEditBtn ?
                `<button class="btn btn-sm"
                 style="background:rgba(26,54,93,0.08);color:var(--primary);"
                 onclick="DashboardPage.editBook('${book.id}')">
                 ✏️ Edit
                 </button>`
                : ''}

        ${showDeleteBtn ?
                `<button class="btn btn-sm"
                 style="background:rgba(229,62,62,0.1);color:var(--danger);"
                 onclick="DashboardPage.deleteBook('${book.id}')">
                 🗑 Delete
                 </button>`
                : ''}

        </div>

        </div>
        </div>
        `;
    };

    return {
        getAllBooks,
        addBook,
        deleteBook,
        getBookById,
        updateBook,
        filterBooks,
        getBranches,
        getSubjects,
        savingsPercent,
        renderBookCard,
        animateCounter
    };

})();


/* ============================================================
   UI Helper Module
============================================================ */

const UI = (() => {

    const showToast = (message, type = "success", duration = 3000) => {

        let container = document.querySelector(".toast-container");

        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;

        toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">✕</button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, duration);
    };

    const init = () => {
        // Hide preloader globally on all pages
        const pl = document.getElementById('pageLoader');
        if (pl) {
            setTimeout(() => pl.classList.add('hidden'), 350);
        }
        // Activate scroll animations already in DOM
        initScrollAnimations();
    };

    const initScrollAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    };

    return { init, showToast, initScrollAnimations };

})();


document.addEventListener("DOMContentLoaded", () => {
    UI.init();
});