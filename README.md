# 📚 BookBridge – Student Textbook Marketplace

> **Buy, Sell & Exchange Second-Hand Academic Books Within Your College Community**

BookBridge is a digital platform that connects students to buy and sell used engineering textbooks at affordable prices. Save up to 70% on academic books while helping fellow students learn!

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth System** | Sign up / Login with localStorage-based custom authentication |
| 📚 **Buy Books** | Browse books with filters by branch, subject, price, condition |
| 💰 **Sell Books** | List used textbooks with image upload and live preview |
| 🚚 **Order Tracking** | Real-time status tracker (Ordered → Packed → Out for Delivery → Delivered) |
| 📊 **Dashboard** | Sidebar with stats, listings, purchases, profile management |
| 🤖 **AI Chatbot** | OpenRouter-powered support bot with smart fallbacks |
| 🎧 **Customer Care** | FAQ accordion + Contact form |
| 📱 **Responsive Design** | Mobile-first, works on all screen sizes |
| ✨ **Animations** | Scroll animations, card hover effects, button ripples, counters |

---

## 🎨 Color Palette

| Color | Hex | Usage |
|---|---|---|
| Navy Blue | `#1A365D` | Navbar, headers, primary UI |
| Academic Gold | `#F6AD55` | Buttons, CTA, highlights |
| Soft White | `#F7FAFC` | Page backgrounds |
| Success Green | `#38A169` | Price tags, verified badges |

---

## 📁 Folder Structure

```
BookBridge/
│
├── index.html           ← Home page (Hero, Search, Categories, Featured Books)
├── login.html           ← Login page
├── signup.html          ← Registration page
├── sell-book.html       ← Book listing form with live preview
├── buy-books.html       ← Browse all books with filters
├── track-order.html     ← Order tracking with progress steps
├── customer-care.html   ← FAQ, Contact Form, AI Chatbot
├── dashboard.html       ← User dashboard (stats, listings, purchases)
│
├── css/
│   ├── style.css        ← Global styles, navbar, hero, footer, cards
│   ├── auth.css         ← Login/signup page styles
│   ├── dashboard.css    ← Dashboard layout, sidebar, stat cards
│   └── animations.css   ← Keyframes, chatbot, order tracker, skeletons
│
├── js/
│   ├── auth.js          ← Authentication (signup, login, logout, session)
│   ├── books.js         ← Book CRUD, filtering, rendering, UI helpers
│   ├── sell.js          ← Sell book form logic + live preview
│   ├── buy.js           ← Buy page filters, search, sort, purchase flow
│   ├── order.js         ← Order tracking, status progression
│   ├── dashboard.js     ← Dashboard: stats, listings, purchases, profile
│   └── chatbot.js       ← AI chatbot via OpenRouter + fallback responses
│
├── data/
│   └── books-data.json  ← 12 sample engineering textbooks seed data
│
├── assets/
│   ├── logo.png         ← BookBridge logo
│   └── book-placeholder.png ← Default book cover image
│
└── README.md
```

---

## 🚀 How to Run the Project

### Option 1: Open Directly (Simplest)
> ⚠️ Some browsers block `fetch()` for local files. Use Option 2 for best experience.

1. Navigate to the project folder
2. Double-click `index.html` to open in your browser

### Option 2: Use VS Code Live Server (Recommended)
1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension
3. Right-click on `index.html` → **"Open with Live Server"**
4. The site will open at `http://127.0.0.1:5500`

### Option 3: Python HTTP Server
```bash
# Navigate to the project folder in terminal
cd BookBridge

# Python 3
python -m http.server 8080

# Open in browser: http://localhost:8080
```

### Option 4: Node.js
```bash
npx http-server . -p 8080
# Open in browser: http://localhost:8080
```

---

## 🧪 Test Accounts & Sample Data

- **Sample Books**: 12 engineering books are auto-seeded from `data/books-data.json` on first load
- **Create Account**: Use the Sign Up page with any email/password
- **Demo Login**: Use the "Demo Login" button on the Login page for instant access

---

## 🤖 AI Chatbot Setup (Optional)

The chatbot works out of the box with smart fallback responses. For real AI responses:

1. Create a free account at [OpenRouter.ai](https://openrouter.ai)
2. Generate a free API key
3. Open `js/chatbot.js` and set:
   ```javascript
   const API_KEY = 'your-openrouter-api-key-here';
   ```
4. The chatbot uses the free `mistralai/mistral-7b-instruct` model

---

## 📱 Pages Overview

| Page | URL | Description |
|---|---|---|
| Home | `index.html` | Hero, search, categories, featured books, how-it-works |
| Login | `login.html` | Email + password auth, demo login |
| Sign Up | `signup.html` | Registration with password strength indicator |
| Buy Books | `buy-books.html` | Filtered book grid with search and sort |
| Sell Book | `sell-book.html` | Book listing form with live card preview |
| Track Order | `track-order.html` | Animated 4-step delivery progress tracker |
| Customer Care | `customer-care.html` | FAQ, contact form, AI chatbot |
| Dashboard | `dashboard.html` | User stats, listings, purchases, profile |

---

## 🔮 Future Improvements

- [ ] **Real Backend** – Replace localStorage with Node.js + MongoDB or Firebase
- [ ] **Payment Gateway** – Integrate Razorpay / Stripe for secure transactions
- [ ] **Real-time Chat** – Socket.io based buyer-seller messaging
- [ ] **Book Exchange System** – Allow bartering without money
- [ ] **College SSO** – Sign in with institutional email verification
- [ ] **Mobile App** – React Native or Flutter app
- [ ] **Admin Panel** – Manage listings, users, orders
- [ ] **Review System** – Buyer ratings for sellers
- [ ] **Image CDN** – Cloudinary integration for book images
- [ ] **Notification System** – Push notifications for order updates

---

## 🛠 Technologies Used

- **HTML5** – Semantic markup, accessibility attributes
- **CSS3** – Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** – ES6+ modules, async/await, localStorage
- **Google Fonts** – Inter + Poppins typography
- **OpenRouter API** – Free AI model (Mistral 7B) for chatbot

---

## 👨‍💻 Author

**BookBridge** – Built as a demonstration of a complete, production-quality frontend MVP using only HTML, CSS, and JavaScript. No frameworks required!

---

*© 2026 BookBridge – Made with ❤️ for Students*
