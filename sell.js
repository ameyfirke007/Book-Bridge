/* ============================================================
   BookBridge - Sell Book Module (sell.js)
============================================================ */

const SellPage = (() => {
    const form = document.getElementById('sellBookForm');
    if (!form) return {};

    // Require auth
    const user = Auth.requireAuth('login.html');
    if (!user) return {};

    let previewImage = 'assets/book-placeholder.png';

    /* ─── Image preview ────────────────────────────────────── */
    const imgInput = document.getElementById('bookImage');
    if (imgInput) {
        imgInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                previewImage = ev.target.result;
                const preview = document.getElementById('bookImagePreview');
                if (preview) preview.src = previewImage;
                const previewWrap = document.getElementById('imagePreviewWrap');
                if (previewWrap) previewWrap.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    }

    /* ─── Live preview update ─────────────────────────────── */
    const updatePreview = () => {
        const title = document.getElementById('bookTitle')?.value || 'Book Title';
        const author = document.getElementById('author')?.value || 'Author Name';
        const branch = document.getElementById('branch')?.value || 'Branch';
        const subject = document.getElementById('subject')?.value || 'Subject';
        const cond = document.getElementById('condition')?.value || 'Good';
        const orig = parseFloat(document.getElementById('originalPrice')?.value) || 0;
        const sell = parseFloat(document.getElementById('sellingPrice')?.value) || 0;
        const savings = orig > 0 ? Math.round(((orig - sell) / orig) * 100) : 0;

        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const setSrc = (id, val) => { const el = document.getElementById(id); if (el) el.src = val; };

        setVal('prev_title', title);
        setVal('prev_author', 'by ' + author);
        setVal('prev_branch', `${branch} • ${subject}`);
        setVal('prev_cond', cond);
        setVal('prev_orig', '₹' + orig);
        setVal('prev_sell', '₹' + sell);
        setVal('prev_savings', savings + '% off');
        setVal('prev_seller', user.fullName);
        setVal('prev_college', user.college);
        setSrc('prev_img', previewImage);

        const condEl = document.getElementById('prev_condBadge');
        if (condEl) {
            condEl.className = 'book-condition ' + ({ 'New': 'cond-new', 'Good': 'cond-good', 'Used': 'cond-used' }[cond] || 'cond-good');
        }
    };

    ['bookTitle', 'author', 'branch', 'subject', 'condition', 'originalPrice', 'sellingPrice'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updatePreview);
        if (el && el.tagName === 'SELECT') el.addEventListener('change', updatePreview);
    });

    /* ─── Validation ──────────────────────────────────────── */
    const validate = () => {
        let valid = true;
        const fields = [
            { id: 'bookTitle', min: 2, msg: 'Book title is required (min 2 chars).' },
            { id: 'author', min: 2, msg: 'Author name is required.' },
            { id: 'branch', min: 1, msg: 'Select a branch.' },
            { id: 'subject', min: 2, msg: 'Subject is required.' },
            { id: 'originalPrice', msg: 'Original price must be > 0.', custom: v => parseFloat(v) > 0 },
            { id: 'sellingPrice', msg: 'Selling price must be > 0.', custom: v => parseFloat(v) > 0 }
        ];
        fields.forEach(({ id, min, msg, custom }) => {
            const el = document.getElementById(id);
            const err = document.getElementById(id + 'Error');
            if (!el) return;
            const val = el.value.trim();
            const ok = custom ? custom(val) : val.length >= (min || 1);
            if (!ok) {
                el.classList.add('error'); if (err) { err.textContent = msg; err.style.display = 'block'; }
                valid = false;
            } else {
                el.classList.remove('error'); if (err) err.style.display = 'none';
            }
        });
        // selling < original
        const orig = parseFloat(document.getElementById('originalPrice')?.value);
        const sell = parseFloat(document.getElementById('sellingPrice')?.value);
        const sellErr = document.getElementById('sellingPriceError');
        if (orig > 0 && sell >= orig) {
            const el = document.getElementById('sellingPrice');
            if (el) el.classList.add('error');
            if (sellErr) { sellErr.textContent = 'Selling price must be less than original price.'; sellErr.style.display = 'block'; }
            valid = false;
        }
        return valid;
    };

    /* ─── Form submit ─────────────────────────────────────── */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validate()) return;
        const btn = form.querySelector('.auth-submit') || form.querySelector('button[type="submit"]');
        if (btn) btn.classList.add('loading');

        const book = {
            title:         document.getElementById('bookTitle').value.trim(),
            author:        document.getElementById('author').value.trim(),
            branch:        document.getElementById('branch').value,
            subject:       document.getElementById('subject').value.trim(),
            condition:     document.getElementById('condition').value,
            originalPrice: parseFloat(document.getElementById('originalPrice').value),
            sellingPrice:  parseFloat(document.getElementById('sellingPrice').value),
            description:   document.getElementById('description')?.value.trim() || '',
            image:         previewImage,
            sellerId:      user.id,
            sellerName:    user.fullName,
            sellerCollege: user.college,
            verified:      true,
            listedDate:    new Date().toISOString().split('T')[0]
        };

        fetch("http://localhost:8080/api/books/sell", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(book)
        })
        .then(res => {
            if (btn) btn.classList.remove('loading');
            if (res.ok) {
                const successMsg = document.getElementById('successMsg');
                if (successMsg) {
                    successMsg.style.display = 'flex';
                    form.reset();
                    previewImage = 'assets/book-placeholder.png';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    alert('Book listed successfully!');
                    window.location.href = 'dashboard.html';
                }
            } else {
                res.text().then(msg => alert('Error listing book: ' + (msg || 'Unknown error')));
            }
        })
        .catch(err => {
            if (btn) btn.classList.remove('loading');
            console.error("Error saving book:", err);
            alert('Network error. Please check if the server is running.');
        });
    });
    return { updatePreview };
})();