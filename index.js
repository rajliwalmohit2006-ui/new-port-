/**
 * ===================================================
 * MOHIT'S PORTFOLIO - JAVASCRIPT & AI CHAT ENGINE
 * Includes Dark/Light Theme Switcher & AI Bot
 * ===================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------
  // 1. THEME MANAGER (DARK / LIGHT THEME TOGGLE)
  // ---------------------------------------------------
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const savedTheme = localStorage.getItem("mohit_portfolio_theme") || "dark";

  function applyTheme(theme, notify = false) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mohit_portfolio_theme", theme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        "title",
        theme === "light"
          ? "Switch to Dark Theme 🌙"
          : "Switch to Light Theme ☀️",
      );
      themeToggleBtn.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme",
      );
    }

    if (notify && typeof showToast === "function") {
      showToast(
        theme === "light" ? "Light Mode Active ☀️" : "Dark Mode Active 🌙",
        theme === "light"
          ? "Switched to clean modern light theme."
          : "Switched to original dark cyber theme.",
      );
    }
  }

  // Apply saved theme on initial load
  applyTheme(savedTheme, false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(newTheme, true);
    });
  }

  // ---------------------------------------------------
  // 2. DYNAMIC TYPING EFFECT (Hero Section)
  // ---------------------------------------------------
  const typingElement = document.getElementById("typing-text");
  const roles = [
    "Front-End Web Developer",
    "UI/UX & React Enthusiast",
    "JavaScript Specialist",
    "Tailwind CSS Expert",
    "Modern Web Craftsman",
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // ---------------------------------------------------
  // 3. MOBILE NAVIGATION & SMOOTH ACTIVE LINK
  // ---------------------------------------------------
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-item");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
      }
    });
  }

  // Close mobile nav when clicking a link
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (navLinks && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        const icon = mobileToggle?.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      }
    });
  });

  // Update active nav link on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute("id");
      const matchingLink = document.querySelector(
        `.nav-links a[href*="${sectionId}"]`,
      );

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach((link) => link.classList.remove("active"));
        if (matchingLink) matchingLink.classList.add("active");
      }
    });
  });

  // ---------------------------------------------------
  // 4. TOAST NOTIFICATION SYSTEM
  // ---------------------------------------------------
  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toast-title");
  const toastMsg = document.getElementById("toast-msg");
  let toastTimeout;

  function showToast(title, message, isSuccess = true) {
    if (!toast) return;

    if (toastTitle) toastTitle.textContent = title;
    if (toastMsg) toastMsg.textContent = message;

    const icon = toast.querySelector(".toast-icon");
    if (icon) {
      icon.className = isSuccess
        ? "fa-solid fa-circle-check toast-icon"
        : "fa-solid fa-circle-exclamation toast-icon";
      icon.style.color = isSuccess ? "var(--emerald)" : "#ef4444";
    }

    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }

  // ---------------------------------------------------
  // 5. CONTACT FORM HANDLER
  // ---------------------------------------------------
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("form-submit-btn");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value.trim();
      const contactHandle = document
        .getElementById("contact_handle")
        ?.value.trim();
      const message = document.getElementById("message")?.value.trim();

      if (!name || !contactHandle || !message) {
        showToast(
          "Form Incomplete",
          "Please fill in all required fields.",
          false,
        );
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Web3Forms could not send the message.");
        }

        showToast(
          "Message Sent! 🚀",
          `Thank you, ${name}! Mohit will reach out to ${contactHandle} soon.`,
        );
        contactForm.reset();

      } catch (error) {
        showToast(
          "Message Not Sent",
          error.message || "Please try again in a moment.",
          false,
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Send Message';
        }
      }
    });
  }

  // Project demo triggers
  document.querySelectorAll(".demo-toast-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Demo Preview", "Launching project showcase demo...", true);
    });
  });

  // ---------------------------------------------------
  // 6. FLOATING AI CHATBOT ENGINE
  // ---------------------------------------------------
  const aiChatTrigger = document.getElementById("ai-chat-trigger");
  const aiChatModal = document.getElementById("ai-chat-modal");
  const closeChatBtn = document.getElementById("close-chat-btn");
  const clearChatBtn = document.getElementById("clear-chat-btn");
  const openAiNavBtn = document.getElementById("open-ai-chat-btn");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const quickChips = document.querySelectorAll(".chip-btn");
  const triggerChatButtons = document.querySelectorAll(".trigger-chat");

  function toggleChat(forceOpen = null) {
    if (!aiChatModal || !aiChatTrigger) return;
    const isOpen =
      forceOpen !== null ? forceOpen : !aiChatModal.classList.contains("open");

    if (isOpen) {
      aiChatModal.classList.add("open");
      aiChatTrigger.classList.add("active");
      setTimeout(() => chatInput?.focus(), 300);
    } else {
      aiChatModal.classList.remove("open");
      aiChatTrigger.classList.remove("active");
    }
  }

  if (aiChatTrigger) {
    aiChatTrigger.addEventListener("click", () => toggleChat());
  }
  if (closeChatBtn) {
    closeChatBtn.addEventListener("click", () => toggleChat(false));
  }
  if (openAiNavBtn) {
    openAiNavBtn.addEventListener("click", () => toggleChat(true));
  }
  triggerChatButtons.forEach((btn) => {
    btn.addEventListener("click", () => toggleChat(true));
  });

  // Clear floating chat history
  if (clearChatBtn) {
    clearChatBtn.addEventListener("click", () => {
      if (!chatMessages) return;
      chatMessages.innerHTML = `
                <div class="chat-message ai-message">
                    <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                    <div class="msg-bubble">
                        <p>👋 <strong>Chat reset!</strong> I'm ready for new questions about Mohit's work, skills, or projects.</p>
                    </div>
                </div>
            `;
      showToast("Chat Cleared", "Conversation reset.", true);
    });
  }

  // Scroll floating chat to bottom
  function scrollChatToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // Append a user message
  function appendUserMessage(text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-message user-message";
    msgDiv.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-user"></i></div>
            <div class="msg-bubble"><p>${escapeHTML(text)}</p></div>
        `;
    chatMessages.appendChild(msgDiv);
    scrollChatToBottom();
  }

  // Append AI typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message ai-message typing-indicator-msg";
    typingDiv.id = "ai-typing-indicator";
    typingDiv.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble">
                <div class="typing-dots">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
    chatMessages.appendChild(typingDiv);
    scrollChatToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById("ai-typing-indicator");
    if (indicator) indicator.remove();
  }

  // Append AI response
  function appendAIMessage(htmlContent) {
    removeTypingIndicator();
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-message ai-message";
    msgDiv.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble">${htmlContent}</div>
        `;
    chatMessages.appendChild(msgDiv);
    scrollChatToBottom();
  }

  function escapeHTML(str) {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
  }

  // ---------------------------------------------------
  // 7. AI INTENT & KNOWLEDGE PROCESSING
  // ---------------------------------------------------
  function generateAIResponse(userText) {
    const text = userText.toLowerCase().trim();

    // 1. GREETINGS
    if (
      text.match(
        /^(hi|hello|hey|namaste|hola|hlo|heya|yo|good morning|good evening|sup)/,
      )
    ) {
      return `<p>Hello there! ✨ I'm <strong>Mohit's AI Assistant</strong>.</p>
                    <p>I can help you explore Mohit's <strong>tech skills</strong>, check out his <strong>projects</strong>, or get his <strong>Instagram</strong> to connect!</p>`;
    }

    // 2. WHO IS MOHIT / ABOUT
    if (
      text.includes("who is") ||
      text.includes("about") ||
      text.includes("mohit") ||
      text.includes("introduce") ||
      text.includes("bio")
    ) {
      return `<p><strong>Mohit</strong> is an enthusiastic <strong>Front-End Web Developer</strong> from India crafting modern, fast, and responsive web applications.</p>
                    <p>He specializes in <strong>HTML5, CSS3, Modern JavaScript (ES6+), React.js, and Tailwind CSS</strong>.</p>`;
    }

    // 3. SKILLS / TECH STACK
    if (
      text.includes("skill") ||
      text.includes("tech") ||
      text.includes("stack") ||
      text.includes("react") ||
      text.includes("javascript") ||
      text.includes("tailwind") ||
      text.includes("css") ||
      text.includes("html") ||
      text.includes("tool")
    ) {
      return `<p>⚡ <strong>Mohit's Core Tech Stack:</strong></p>
                    <ul style="padding-left: 18px; margin: 6px 0; font-size: 0.85rem;">
                        <li><strong>Frontend:</strong> HTML5, CSS3, Modern JavaScript (ES6+), React.js</li>
                        <li><strong>Styling:</strong> Tailwind CSS, Flexbox, CSS Grid, Responsive Design</li>
                        <li><strong>Tools & APIs:</strong> Git, GitHub, REST APIs, JSON</li>
                    </ul>
                    <p>He builds clean, accessible, and high-performance user interfaces.</p>`;
    }

    // 4. PROJECTS / WORK
    if (
      text.includes("project") ||
      text.includes("work") ||
      text.includes("portfolio") ||
      text.includes("app") ||
      text.includes("showcase") ||
      text.includes("built")
    ) {
      return `<p>🚀 <strong>Mohit's Featured Projects:</strong></p>
                    <ol style="padding-left: 18px; margin: 6px 0; font-size: 0.85rem;">
                        <li><strong>AI Interactive Portfolio:</strong> Fully responsive site powered by real-time AI assistance!</li>
                        <li><strong>E-Commerce Storefront:</strong> Sleek shopping cart interface with interactive product filtering.</li>
                        <li><strong>Weather Dashboard:</strong> Live weather tracker fetching dynamic meteorological forecasts.</li>
                    </ol>
                    <p>You can browse the <strong><a href="#projects" style="color: var(--primary); font-weight: 700; text-decoration: underline;">Projects Section</a></strong> to explore live demos!</p>`;
    }

    // 5. INSTAGRAM & SOCIAL
    if (
      text.includes("instagram") ||
      text.includes("insta") ||
      text.includes("ig") ||
      text.includes("social")
    ) {
      return `<p>📸 <strong>Connect on Instagram:</strong></p>
                    <p>Follow and message Mohit on Instagram at: <br><a href="https://instagram.com/_xmohit21" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 700; text-decoration: underline;">@_xmohit21</a></p>
                    <p>Send a DM for project inquiries, freelance collabs, or to say hello!</p>`;
    }

    // 6. CONTACT / HIRE
    if (
      text.includes("contact") ||
      text.includes("hire") ||
      text.includes("reach") ||
      text.includes("call") ||
      text.includes("message") ||
      text.includes("phone")
    ) {
      return `<p>📬 <strong>Get In Touch with Mohit:</strong></p>
                    <p>📝 <strong>Contact Form:</strong> You can send a direct message in the <a href="#contact" style="color: var(--primary); font-weight: 700; text-decoration: underline;">Contact Section</a>!</p>
                    <p>📸 <strong>Instagram:</strong> Reach out directly on Instagram at <a href="https://instagram.com/_xmohit21" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 700; text-decoration: underline;">@_xmohit21</a></p>
                    <p>He is open for freelance projects, internships, and full-time frontend developer roles.</p>`;
    }

    // 7. SERVICES / WHAT CAN YOU DO
    if (
      text.includes("service") ||
      text.includes("offer") ||
      text.includes("do for me") ||
      text.includes("freelance") ||
      text.includes("make") ||
      text.includes("website")
    ) {
      return `<p>💼 <strong>Services Mohit Offers:</strong></p>
                    <ul style="padding-left: 18px; margin: 6px 0; font-size: 0.85rem;">
                        <li>🎨 <strong>Custom Website Development</strong> (Responsive, fast, SEO-ready)</li>
                        <li>⚡ <strong>Frontend UI/UX Design</strong> (Translating designs into responsive code)</li>
                        <li>🛠️ <strong>Website Redesign & Speed Optimization</strong></li>
                    </ul>`;
    }

    // 8. PRICING / RATES / COST
    if (
      text.includes("price") ||
      text.includes("cost") ||
      text.includes("charge") ||
      text.includes("rate") ||
      text.includes("budget") ||
      text.includes("fee")
    ) {
      return `<p>💰 <strong>Pricing & Rates:</strong></p>
                    <p>Mohit provides flexible and competitive rates according to project requirements and scope. Feel free to DM on <a href="https://instagram.com/_xmohit21" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 700; text-decoration: underline;">Instagram (@_xmohit21)</a> with your project details!</p>`;
    }

    // 9. EXPERIENCE / EDUCATION
    if (
      text.includes("experience") ||
      text.includes("education") ||
      text.includes("study") ||
      text.includes("degree") ||
      text.includes("college") ||
      text.includes("background")
    ) {
      return `<p>🎓 <strong>Experience & Background:</strong></p>
                    <p>Mohit has built 10+ frontend projects with extensive hands-on experience in JavaScript, responsive web development, and modern CSS architecture.</p>`;
    }

    // 10. FUN / BOT IDENTITY
    if (
      text.includes("who are you") ||
      text.includes("what is your name") ||
      text.includes("are you ai") ||
      text.includes("robot")
    ) {
      return `<p>🤖 I am <strong>Mohit's AI Portfolio Assistant</strong>! I was built with modern JavaScript to help visitors learn about Mohit's development work and connect with him.</p>`;
    }

    // 11. DEFAULT / FALLBACK
    return `<p>That's an interesting question! 😊</p>
                <p>I can best assist you with:</p>
                <ul style="padding-left: 18px; margin: 4px 0; font-size: 0.85rem;">
                    <li>Mohit's <strong>tech skills & stack</strong></li>
                    <li>His <strong>latest projects & code</strong></li>
                    <li>His <strong>freelance services</strong></li>
                    <li>Connecting with him on <strong>Instagram (<a href="https://instagram.com/_xmohit21" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 700;">@_xmohit21</a>)</strong></li>
                </ul>
                <p>What would you like to know more about?</p>`;
  }

  // Floating chat form submit handler
  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      appendUserMessage(message);
      chatInput.value = "";

      showTypingIndicator();

      setTimeout(() => {
        const aiReply = generateAIResponse(message);
        appendAIMessage(aiReply);
      }, 600);
    });
  }

  // Quick Question Chips click handler
  quickChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const query = chip.getAttribute("data-query");
      if (!query) return;

      appendUserMessage(query);
      showTypingIndicator();

      setTimeout(() => {
        const aiReply = generateAIResponse(query);
        appendAIMessage(aiReply);
      }, 500);
    });
  });
});
