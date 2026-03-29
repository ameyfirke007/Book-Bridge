/* ============================================================
   BookBridge - AI Chatbot Module (chatbot.js)
   Uses OpenRouter free API for AI responses
============================================================ */

const Chatbot = (() => {
    const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
    // Using free model via OpenRouter (no key required for limited usage)
    // For production: add your key. For demo: uses a fallback response system.
    const API_KEY = ''; // Add your OpenRouter API key here for full functionality

    const SYSTEM_PROMPT = `You are BookBridge Support Assistant — a friendly, knowledgeable helper for the BookBridge platform where students buy and sell second-hand academic engineering books within their college community.

Your role:
- Help students find affordable textbooks
- Guide sellers on listing books
- Answer questions about orders, pricing, and delivery
- Provide tips on book care and study resources
- Be concise, helpful, and encouraging

Platform features:
- Students can buy/sell second-hand engineering books
- Filter by branch (CSE, Mechanical, Electrical, Civil, IT)
- Track orders with Ordered > Packed > Out for Delivery > Delivered
- Verified seller badges for trusted listings

Keep responses short (2-4 sentences) and student-friendly. Use emojis occasionally.`;

    /* ─── Fallback responses (no API key mode) ────────────── */
    const FALLBACK_RESPONSES = {
        greeting: ["Hello! 👋 Welcome to BookBridge! I'm your support assistant. How can I help you find affordable textbooks today?",
            "Hi there! 📚 I'm the BookBridge Assistant. Ask me anything about buying, selling, or tracking your textbooks!"],
        buy: ["To buy books, go to the **Buy Books** page and use filters to find books by branch, subject, or price range. 🛒 Click 'Buy Now' on any book card to place your order!",
            "You can browse all available books on the Buy Books page. Filter by your branch like CSE or Mechanical, and sort by price to find the best deals! 💰"],
        sell: ["To sell a book, click **Sell Book** in the navigation. Fill in book details, set your selling price (lower than original), and upload a photo. Your listing goes live instantly! 📖",
            "Listing a book is easy! Go to Sell Book page, enter title, author, branch, condition, and price. You'll see a live preview before submitting. ✅"],
        track: ["Track your orders on the **Track Order** page. You'll see the delivery status: Ordered → Packed → Out for Delivery → Delivered. 🚚",
            "Go to Track Order page to view all your purchases and their current delivery status. You can also simulate progress for testing! 📦"],
        price: ["Prices are set by sellers. Books typically cost 30-60% less than retail! 💸 Use the price filter on the Buy Books page to find books within your budget.",
            "You'll save a lot buying second-hand! The savings percentage is shown on each book card. Look for books marked 'New' if you want near-mint condition! 📊"],
        contact: ["For urgent issues, use the Contact Form on the Customer Care page. I'm also here 24/7 to answer your questions! 😊",
            "You can reach our support team via the Contact Form. For quick answers, just ask me here! 🤝"],
        default: ["That's a great question! For the best assistance, please browse our **Buy Books** or **Sell Book** pages. You can also check the FAQ section for common answers. 📚",
            "I'm here to help! Try navigating to the specific page you need — Home for browsing, Buy Books for purchasing, or Sell Book to list your textbooks. 🎓",
            "BookBridge makes textbook exchange easy and affordable for students! Is there something specific about buying, selling, or tracking orders I can help you with? 🌟"]
    };

    const getFallback = (input) => {
        const lower = input.toLowerCase();
        if (/hello|hi|hey|greet/.test(lower)) return pick(FALLBACK_RESPONSES.greeting);
        if (/buy|purchase|order|find|search/.test(lower)) return pick(FALLBACK_RESPONSES.buy);
        if (/sell|list|upload|offer/.test(lower)) return pick(FALLBACK_RESPONSES.sell);
        if (/track|delivery|status|ship|deliver|order/.test(lower)) return pick(FALLBACK_RESPONSES.track);
        if (/price|cost|cheap|afford|discount|saving/.test(lower)) return pick(FALLBACK_RESPONSES.price);
        if (/contact|support|help|issue|problem|complain/.test(lower)) return pick(FALLBACK_RESPONSES.contact);
        return pick(FALLBACK_RESPONSES.default);
    };
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    /* ─── API call ────────────────────────────────────────── */
    const history = [];

    const getAIResponse = async (userMessage) => {
        history.push({ role: 'user', content: userMessage });
        if (!API_KEY) {
            await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
            const resp = getFallback(userMessage);
            history.push({ role: 'assistant', content: resp });
            return resp;
        }
        try {
            const res = await fetch(OPENROUTER_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'BookBridge Support'
                },
                body: JSON.stringify({
                    model: 'mistralai/mistral-7b-instruct:free',
                    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history.slice(-8)],
                    max_tokens: 200,
                    temperature: 0.7
                })
            });
            if (!res.ok) throw new Error('API error ' + res.status);
            const data = await res.json();
            const reply = data.choices?.[0]?.message?.content || getFallback(userMessage);
            history.push({ role: 'assistant', content: reply });
            return reply;
        } catch (e) {
            console.warn('AI API error, using fallback:', e);
            const fallback = getFallback(userMessage);
            history.push({ role: 'assistant', content: fallback });
            return fallback;
        }
    };

    /* ─── DOM references ──────────────────────────────────── */
    const widget = document.getElementById('chatbotWidget');
    const toggleBtn = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const closeBtn = document.getElementById('chatClose');
    const messages = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    if (!widget || !toggleBtn) return {};

    let isOpen = false;
    let unreadCount = 0;

    /* ─── Toggle chat window ──────────────────────────────── */
    const toggle = () => {
        isOpen = !isOpen;
        chatWindow.classList.toggle('open', isOpen);
        if (isOpen) {
            clearUnread();
            if (messages.children.length === 0) {
                addBotMessage("Hi! 👋 I'm your BookBridge Assistant. Ask me about buying books, selling textbooks, or tracking your orders!");
                addQuickReplies(['How to buy?', 'How to sell?', 'Track order', 'Pricing help']);
            }
            setTimeout(() => input?.focus(), 100);
        }
    };

    const clearUnread = () => {
        unreadCount = 0;
        const badge = document.querySelector('.chat-unread');
        if (badge) badge.style.display = 'none';
    };

    toggleBtn.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', toggle);

    /* ─── Add messages ────────────────────────────────────── */
    const addBotMessage = (text) => {
        const div = document.createElement('div');
        div.className = 'chat-message bot';
        div.innerHTML = `
      <div class="chat-avatar">🤖</div>
      <div class="chat-bubble">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    };

    const addUserMessage = (text) => {
        // Hide quick replies
        const qr = messages.querySelector('.chat-quick-replies');
        if (qr) qr.remove();
        const div = document.createElement('div');
        div.className = 'chat-message user';
        div.innerHTML = `<div class="chat-bubble">${text}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    };

    const showTyping = () => {
        const div = document.createElement('div');
        div.className = 'chat-message bot typing-msg';
        div.innerHTML = `
      <div class="chat-avatar">🤖</div>
      <div class="chat-bubble">
        <div class="typing-indicator">
          <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
        </div>
      </div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    };

    /* ─── Quick replies ───────────────────────────────────── */
    const addQuickReplies = (replies) => {
        const div = document.createElement('div');
        div.className = 'chat-quick-replies';
        div.innerHTML = replies.map(r => `<button class="quick-reply-btn" onclick="Chatbot.sendMessage('${r}')">${r}</button>`).join('');
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    };

    /* ─── Send message ────────────────────────────────────── */
    const sendMessage = async (text) => {
        const msg = (text || input?.value?.trim());
        if (!msg) return;
        if (input) input.value = '';
        addUserMessage(msg);
        const typingEl = showTyping();
        try {
            const reply = await getAIResponse(msg);
            typingEl.remove();
            addBotMessage(reply);
            // Add contextual quick replies
            if (/buy|purchase|order/.test(msg.toLowerCase())) {
                addQuickReplies(['Show books', 'Price filter', 'Track order']);
            } else if (/sell|list/.test(msg.toLowerCase())) {
                addQuickReplies(['How to price?', 'Verified badge', 'Contact support']);
            }
        } catch (e) {
            typingEl.remove();
            addBotMessage('Sorry, I ran into a small issue. Please try again! 😅');
        }
    };

    if (sendBtn) sendBtn.addEventListener('click', () => sendMessage());
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

    /* ─── Show "unread" notification after delay ──────────── */
    setTimeout(() => {
        if (!isOpen) {
            unreadCount = 1;
            const badge = document.querySelector('.chat-unread');
            if (badge) badge.style.display = 'flex';
        }
    }, 5000);

    return { sendMessage, toggle };
})();
