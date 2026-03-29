/* ============================================================
   BookBridge - Authentication Module (auth.js)
   Handles signup, login, logout via Spring Boot API
   Session stored in localStorage (user object)
============================================================ */

const API_BASE = "http://localhost:8080/api/auth";
const SESSION_KEY = "user";

const Auth = (() => {

    /* ─── Session Helpers ─────────────────────────────────── */
    const getSession   = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    const saveSession  = (user) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    const clearSession = () => localStorage.removeItem(SESSION_KEY);

    /* ─── Signup (API) ────────────────────────────────────── */
    const signup = async ({ fullName, email, college, course, password }) => {
        try {
            const res = await fetch(`${API_BASE}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, college, course, password })
            });
            if (!res.ok) {
                const msg = await res.text();
                return { success: false, message: msg || "Signup failed. Please try again." };
            }
            const user = await res.json();
            saveSession(user);
            return { success: true, user };
        } catch (err) {
            console.error("Signup error:", err);
            return { success: false, message: "Network error. Is the server running?" };
        }
    };

    /* ─── Login (API) ─────────────────────────────────────── */
    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) {
                return { success: false, message: "Invalid email or password. Please try again." };
            }
            const user = await res.json();
            saveSession(user);
            return { success: true, user };
        } catch (err) {
            console.error("Login error:", err);
            return { success: false, message: "Network error. Is the server running?" };
        }
    };

    /* ─── Logout ──────────────────────────────────────────── */
    const logout = () => {
        clearSession();
        window.location.href = 'index.html';
    };

    /* ─── Get Current User ────────────────────────────────── */
    const getCurrentUser = () => getSession();

    /* ─── Require Auth (redirect if not logged in) ────────── */
    const requireAuth = (redirectTo = 'login.html') => {
        const user = getSession();
        if (!user) {
            window.location.href = redirectTo;
            return null;
        }
        return user;
    };

    /* ─── Update Profile (localStorage session only) ─────── */
    const updateProfile = (updates) => {
        const session = getSession();
        if (!session) return { success: false };
        const updated = { ...session, ...updates };
        saveSession(updated);
        return { success: true, user: updated };
    };

    return { signup, login, logout, getCurrentUser, requireAuth, updateProfile };
})();


/* ─── Signup Form Logic ───────────────────────────────────── */
const SignupForm = (() => {
    const form = document.getElementById('signupForm');
    if (!form) return;

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthFill  = document.querySelector('.strength-fill');
    const strengthText  = document.querySelector('.strength-text');

    if (passwordInput && strengthFill) {
        passwordInput.addEventListener('input', () => {
            const val = passwordInput.value;
            let strength = 0;
            if (val.length >= 8) strength++;
            if (/[A-Z]/.test(val)) strength++;
            if (/[0-9]/.test(val)) strength++;
            if (/[^A-Za-z0-9]/.test(val)) strength++;
            const colors = ['#E53E3E','#E53E3E','#D69E2E','#38A169','#38A169'];
            const labels = ['','Weak','Fair','Good','Strong'];
            const pct = (strength / 4) * 100;
            strengthFill.style.width = pct + '%';
            strengthFill.style.background = colors[strength];
            if (strengthText) strengthText.textContent = labels[strength] || '';
        });
    }

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (!target) return;
            target.type = target.type === 'password' ? 'text' : 'password';
            btn.textContent = target.type === 'password' ? '👁️' : '🙈';
        });
    });

    const validate = () => {
        let valid = true;
        const fields = [
            { id: 'fullName',  min: 2, msg: 'Full name must be at least 2 characters.' },
            { id: 'email',     regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Please enter a valid email.' },
            { id: 'college',   min: 2, msg: 'College name is required.' },
            { id: 'course',    min: 1, msg: 'Course/Branch is required.' },
            { id: 'password',  min: 6, msg: 'Password must be at least 6 characters.' }
        ];
        fields.forEach(({ id, min, regex, msg }) => {
            const el  = document.getElementById(id);
            const err = document.getElementById(id + 'Error');
            if (!el) return;
            const val = el.value.trim();
            let fieldValid = true;
            if (min   && val.length < min)    fieldValid = false;
            if (regex && !regex.test(val))    fieldValid = false;
            if (!fieldValid) {
                el.classList.add('error');
                if (err) { err.textContent = msg; err.style.display = 'flex'; }
                valid = false;
            } else {
                el.classList.remove('error');
                if (err) err.style.display = 'none';
            }
        });
        // Confirm password
        const pwd  = document.getElementById('password');
        const cpwd = document.getElementById('confirmPassword');
        const cpwdErr = document.getElementById('confirmPasswordError');
        if (pwd && cpwd && pwd.value !== cpwd.value) {
            cpwd.classList.add('error');
            if (cpwdErr) { cpwdErr.textContent = 'Passwords do not match.'; cpwdErr.style.display = 'flex'; }
            valid = false;
        } else if (cpwd) {
            cpwd.classList.remove('error');
            if (cpwdErr) cpwdErr.style.display = 'none';
        }
        // Terms
        const terms    = document.getElementById('agreeTerms');
        const termsErr = document.getElementById('termsError');
        if (terms && !terms.checked) {
            if (termsErr) { termsErr.textContent = 'You must agree to the terms.'; termsErr.style.display = 'flex'; }
            valid = false;
        } else if (termsErr) termsErr.style.display = 'none';

        return valid;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validate()) return;
        const btn     = form.querySelector('.auth-submit');
        const alertEl = document.getElementById('formAlert');
        if (btn) btn.classList.add('loading');

        const result = await Auth.signup({
            fullName: document.getElementById('fullName').value,
            email:    document.getElementById('email').value,
            college:  document.getElementById('college').value,
            course:   document.getElementById('course').value,
            password: document.getElementById('password').value
        });

        if (btn) btn.classList.remove('loading');
        if (result.success) {
            window.location.href = 'dashboard.html';
        } else {
            if (alertEl) {
                alertEl.textContent = result.message;
                alertEl.style.display = 'flex';
                alertEl.className = 'alert alert-error';
            }
        }
    });
})();


/* ─── Login Form Logic ────────────────────────────────────── */
const LoginForm = (() => {
    const form = document.getElementById('loginForm');
    if (!form) return;

    // Pre-fill remembered email
    const remEmail = document.getElementById('email');
    if (remEmail && localStorage.getItem('bb_remember_email')) {
        remEmail.value = localStorage.getItem('bb_remember_email');
    }

    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (!target) return;
            target.type = target.type === 'password' ? 'text' : 'password';
            btn.textContent = target.type === 'password' ? '👁️' : '🙈';
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email    = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('rememberMe')?.checked || false;
        const alertEl  = document.getElementById('formAlert');

        if (!email || !password) {
            if (alertEl) {
                alertEl.textContent = 'Please enter your email and password.';
                alertEl.style.display = 'flex';
                alertEl.className = 'alert alert-error';
            }
            return;
        }

        const btn = form.querySelector('.auth-submit');
        if (btn) btn.classList.add('loading');

        const result = await Auth.login(email, password);

        if (btn) btn.classList.remove('loading');
        if (result.success) {
            if (remember) {
                localStorage.setItem('bb_remember_email', email);
            } else {
                localStorage.removeItem('bb_remember_email');
            }
            window.location.href = 'dashboard.html';
        } else {
            if (alertEl) {
                alertEl.textContent = result.message;
                alertEl.style.display = 'flex';
                alertEl.className = 'alert alert-error';
            }
        }
    });
})();


/* ─── Navbar Auth State ───────────────────────────────────── */
const updateNavAuth = () => {
    const user   = Auth.getCurrentUser();
    const navCta = document.querySelector('.nav-cta');
    if (!navCta) return;
    if (user) {
        navCta.innerHTML = `
          <a href="dashboard.html" class="nav-avatar" title="${user.fullName}">${(user.fullName || 'U').charAt(0).toUpperCase()}</a>
          <button class="btn-ghost" onclick="Auth.logout()" style="color:rgba(255,255,255,0.8);background:none;border:none;cursor:pointer;padding:8px 14px;font-size:0.9rem;font-weight:500;border-radius:8px;">Logout</button>
        `;
    }
};

document.addEventListener('DOMContentLoaded', updateNavAuth);
