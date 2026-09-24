/**
 * ==========================================================================
 * CloudOps - DevOps & Cloud Infrastructure Landing Page
 * Script: Pure Vanilla JavaScript (No external frameworks or libraries)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Background Particle & Interactive Network Canvas
     -------------------------------------------------------------------------- */
  initParticleCanvas();

  /* --------------------------------------------------------------------------
     2. Sticky Navigation Bar & Active Links on Scroll
     -------------------------------------------------------------------------- */
  initNavigation();

  /* --------------------------------------------------------------------------
     3. Mobile Menu Toggle
     -------------------------------------------------------------------------- */
  initMobileMenu();

  /* --------------------------------------------------------------------------
     4. Intersection Observer - Fade In On Scroll
     -------------------------------------------------------------------------- */
  initScrollAnimations();

  /* --------------------------------------------------------------------------
     5. Statistics Counter Animation (Intersection Observer)
     -------------------------------------------------------------------------- */
  initCounterAnimation();

  /* --------------------------------------------------------------------------
     6. Process Timeline Interactive Step Highlight
     -------------------------------------------------------------------------- */
  initTimelineHighlight();

  /* --------------------------------------------------------------------------
     7. Pricing Switcher (Monthly / Yearly)
     -------------------------------------------------------------------------- */
  initPricingToggle();

  /* --------------------------------------------------------------------------
     8. FAQ Accordion
     -------------------------------------------------------------------------- */
  initFaqAccordion();

  /* --------------------------------------------------------------------------
     9. Contact Form Validation & Toast Feedback
     -------------------------------------------------------------------------- */
  initContactForm();

  /* --------------------------------------------------------------------------
     10. Back to Top Button
     -------------------------------------------------------------------------- */
  initBackToTop();

  /* --------------------------------------------------------------------------
     11. Floating Live Chat Widget (Temporary Demo)
     -------------------------------------------------------------------------- */
  initLiveChat();
});

/**
 * Particle Canvas Engine
 * Renders an interactive mesh network of nodes with connections and mouse repulsion
 */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
  const maxDistance = 130;

  const mouse = {
    x: null,
    y: null,
    radius: 140,
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1.2;
      this.speedX = (Math.random() - 0.5) * 0.85;
      this.speedY = (Math.random() - 0.5) * 0.85;
      this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(37, 99, 235, ';
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce on boundaries
      if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > height) this.speedY = -this.speedY;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = (dx / dist) * force * 2;
          const dirY = (dy / dist) * force * 2;
          this.x -= dirX;
          this.y -= dirY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.22;
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    animationFrameId = requestAnimationFrame(animate);
  }

  init();
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    init();
  });

  // Mouse move on hero section
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }
}

/**
 * Sticky Navigation & Active Section Tracking
 */
function initNavigation() {
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScroll() {
    const scrollPos = window.scrollY;

    // Header background toggle
    if (scrollPos > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Menu
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link, .nav-menu .btn');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    toggleBtn.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Scroll Reveal Animation using IntersectionObserver
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up');
  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach((el) => el.classList.add('appear'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => observer.observe(el));
}

/**
 * Counter Animation for Statistics
 */
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateSingleCounter(el);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((num) => observer.observe(num));

  function animateSingleCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const isDecimal = element.getAttribute('data-decimal') === 'true';
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const easeProgress = 1 - (1 - progress) * (1 - progress);

      const currentVal = easeProgress * target;

      if (isDecimal) {
        element.textContent = currentVal.toFixed(2);
      } else {
        element.textContent = Math.floor(currentVal).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = isDecimal ? target.toFixed(2) : target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

/**
 * Process Timeline Interactive Active Highlight
 */
function initTimelineHighlight() {
  const steps = document.querySelectorAll('.timeline-step');
  if (!steps.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelector('.step-card')?.classList.add('active-step');
        }
      });
    },
    { threshold: 0.3 }
  );

  steps.forEach((step) => observer.observe(step));
}

/**
 * Pricing Billing Cycle Switcher (Monthly vs Yearly)
 */
function initPricingToggle() {
  const toggle = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('monthly-label');
  const yearlyLabel = document.getElementById('yearly-label');
  const priceElements = document.querySelectorAll('.price-val');
  const periodElements = document.querySelectorAll('.price-period');

  if (!toggle) return;

  const pricingData = {
    monthly: [
      { price: '15.000.000', period: 'VNĐ / tháng' },
      { price: '35.000.000', period: 'VNĐ / tháng' },
      { price: 'Tùy biến', period: 'Theo yêu cầu' },
    ],
    yearly: [
      { price: '12.000.000', period: 'VNĐ / tháng (tiết kiệm 20%)' },
      { price: '28.000.000', period: 'VNĐ / tháng (tiết kiệm 20%)' },
      { price: 'Tùy biến', period: 'Ưu đãi hợp đồng năm' },
    ],
  };

  toggle.addEventListener('click', () => {
    const isYearly = toggle.classList.toggle('yearly');
    toggle.setAttribute('aria-checked', isYearly);

    if (isYearly) {
      monthlyLabel?.classList.remove('active');
      yearlyLabel?.classList.add('active');
      updatePrices(pricingData.yearly);
    } else {
      yearlyLabel?.classList.remove('active');
      monthlyLabel?.classList.add('active');
      updatePrices(pricingData.monthly);
    }
  });

  function updatePrices(dataList) {
    priceElements.forEach((el, index) => {
      if (dataList[index]) {
        el.style.opacity = '0';
        setTimeout(() => {
          el.textContent = dataList[index].price;
          if (periodElements[index]) {
            periodElements[index].textContent = dataList[index].period;
          }
          el.style.opacity = '1';
        }, 150);
      }
    });
  }
}

/**
 * FAQ Accordion with smooth animation
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Contact Form Validation and Interactive Toast Feedback
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notification');
  if (!form) return;

  const fields = {
    name: {
      el: document.getElementById('contact-name'),
      validate: (v) => v.trim().length >= 2,
      errorMsg: 'Vui lòng nhập họ và tên của bạn (tối thiểu 2 ký tự)',
    },
    email: {
      el: document.getElementById('contact-email'),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      errorMsg: 'Email không hợp lệ. Vui lòng nhập định dạng: name@domain.com',
    },
    phone: {
      el: document.getElementById('contact-phone'),
      validate: (v) => /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(v.replace(/\s+/g, '')),
      errorMsg: 'Số điện thoại không hợp lệ (gồm 10 số, đầu số VN: 03, 05, 07, 08, 09)',
    },
    message: {
      el: document.getElementById('contact-message'),
      validate: (v) => v.trim().length >= 10,
      errorMsg: 'Vui lòng nhập nội dung mô tả nhu cầu (tối thiểu 10 ký tự)',
    },
  };

  // Real-time validation on blur & input
  Object.keys(fields).forEach((key) => {
    const item = fields[key];
    if (!item.el) return;

    item.el.addEventListener('blur', () => validateField(key));
    item.el.addEventListener('input', () => {
      if (item.el.closest('.form-group').classList.contains('has-error')) {
        validateField(key);
      }
    });
  });

  function validateField(key) {
    const item = fields[key];
    const group = item.el.closest('.form-group');
    const errEl = group.querySelector('.error-message');
    const isValid = item.validate(item.el.value);

    if (!isValid) {
      group.classList.add('has-error');
      item.el.classList.add('invalid');
      if (errEl) errEl.textContent = item.errorMsg;
      return false;
    } else {
      group.classList.remove('has-error');
      item.el.classList.remove('invalid');
      return true;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isAllValid = true;

    Object.keys(fields).forEach((key) => {
      const valid = validateField(key);
      if (!valid) isAllValid = false;
    });

    if (!isAllValid) {
      // Focus the first invalid field
      const firstInvalid = form.querySelector('.form-input.invalid, .form-textarea.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Submit animation simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" style="width:18px;height:18px;animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"></circle>
      </svg>
      Đang gửi yêu cầu...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      // Show Toast Notification
      showToast('Gửi yêu cầu tư vấn thành công!', 'Chuyên viên DevOps cấp cao của CloudOps sẽ liên hệ với bạn trong vòng 15 phút.');
    }, 1200);
  });

  function showToast(title, message) {
    if (!toast) return;
    const titleEl = toast.querySelector('.toast-content h5');
    const msgEl = toast.querySelector('.toast-content p');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    },
    { passive: true }
  );

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/**
 * 11. Floating Live Chat Widget (Temporary Demo)
 * Simulates interactive technical DevOps support consultation
 */
function initLiveChat() {
  const wrapper = document.getElementById('live-chat-wrapper');
  const toggleBtn = document.getElementById('live-chat-toggle');
  const closeBtn = document.getElementById('chat-close-btn');
  const clearBtn = document.getElementById('chat-clear-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const typingIndicator = document.getElementById('chat-typing-indicator');
  const quickChips = document.querySelectorAll('.quick-chip');
  const chatStartTime = document.getElementById('chat-start-time');

  if (!wrapper || !toggleBtn || !chatForm || !chatInput || !chatMessages) return;

  // Format current time for display
  function formatCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Set initial header timestamp
  if (chatStartTime) {
    chatStartTime.textContent = `Hôm nay, ${formatCurrentTime()}`;
  }

  // Toggle live chat open/closed state
  toggleBtn.addEventListener('click', () => {
    const isOpen = wrapper.classList.toggle('open');
    if (isOpen) {
      setTimeout(() => {
        chatInput.focus();
        scrollToBottom();
      }, 150);
    }
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      wrapper.classList.remove('open');
    });
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrapper.classList.contains('open')) {
      wrapper.classList.remove('open');
    }
  });

  // Reset / Clear chat conversation
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      // Remove all user and bot replies except the initial greeting, chips, and typing indicator
      const dynamicMsgs = chatMessages.querySelectorAll('.chat-msg.dynamic-msg');
      dynamicMsgs.forEach((msg) => msg.remove());
      scrollToBottom();
      chatInput.focus();
    });
  }

  // Handle Quick Chips
  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query') || chip.textContent.trim();
      handleUserSendMessage(query);
    });
  });

  // Handle Chat Form Submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    handleUserSendMessage(text);
  });

  // Main message handler
  function handleUserSendMessage(text) {
    // 1. Add user message
    appendMessage(text, 'user');
    chatInput.value = '';

    // 2. Show typing indicator
    showTypingIndicator();
    scrollToBottom();

    // 3. Generate bot response with simulated realistic network delay
    const delay = Math.floor(Math.random() * 400) + 700; // 700ms - 1100ms
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      hideTypingIndicator();
      appendMessage(botResponse, 'bot');
      scrollToBottom();
    }, delay);
  }

  // Append message to chat container
  function appendMessage(contentHtml, sender) {
    const msgEl = document.createElement('div');
    msgEl.className = `chat-msg ${sender} dynamic-msg`;

    const timeStr = formatCurrentTime();

    if (sender === 'user') {
      msgEl.innerHTML = `
        <div class="msg-body">
          <div class="msg-bubble">${escapeHtml(contentHtml)}</div>
          <span class="msg-time">${timeStr}</span>
        </div>
      `;
    } else {
      msgEl.innerHTML = `
        <div class="msg-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <div class="msg-body">
          <div class="msg-bubble">${contentHtml}</div>
          <span class="msg-time">${timeStr}</span>
        </div>
      `;
    }

    // Insert right before typing indicator
    if (typingIndicator) {
      chatMessages.insertBefore(msgEl, typingIndicator);
    } else {
      chatMessages.appendChild(msgEl);
    }
  }

  // Show / hide typing dots
  function showTypingIndicator() {
    if (!typingIndicator) return;
    typingIndicator.style.display = 'flex';
    chatMessages.appendChild(typingIndicator); // ensure it's at the very bottom
  }

  function hideTypingIndicator() {
    if (!typingIndicator) return;
    typingIndicator.style.display = 'none';
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Rule-based DevOps consultation assistant logic
  function generateBotResponse(input) {
    const text = input.toLowerCase();

    if (text.includes('k8s') || text.includes('kubernetes') || text.includes('cụm') || text.includes('pod') || text.includes('cluster')) {
      return `
        <p><strong>Về dịch vụ Kubernetes:</strong> CloudOps chuyên thiết kế & vận hành cụm Kubernetes production trên AWS (EKS), GCP (GKE), Azure (AKS) hoặc Bare-metal.</p>
        <p>Hệ thống bao gồm đầy đủ Ingress NGINX, Cert-Manager tự động cấp SSL Let's Encrypt, ArgoCD GitOps và HPA tự co giãn tài nguyên. Quý khách đang quản lý quy mô bao nhiêu microservices ạ?</p>
      `;
    }

    if (text.includes('ci/cd') || text.includes('cicd') || text.includes('pipeline') || text.includes('github') || text.includes('gitlab') || text.includes('jenkins') || text.includes('deploy')) {
      return `
        <p><strong>Về Tự động hóa CI/CD:</strong> Chúng tôi thiết lập pipeline chuẩn DevSecOps với GitHub Actions / GitLab CI. Tự động kiểm tra chất lượng code, Docker Layer caching giúp rút ngắn thời gian build từ 20 phút xuống còn dưới 3 phút, và tự động deploy <strong>Zero-downtime</strong>.</p>
        <p>Quý khách đang lưu trữ mã nguồn trên GitHub, GitLab hay Bitbucket?</p>
      `;
    }

    if (text.includes('giá') || text.includes('chi phí') || text.includes('báo giá') || text.includes('cost') || text.includes('finops') || text.includes('tiền') || text.includes('gói')) {
      return `
        <p><strong>Báo giá dịch vụ DevOps:</strong></p>
        <p>• <strong>Gói Starter:</strong> 499$/tháng (Phù hợp hệ thống nhỏ, 1-3 cụm)<br>
        • <strong>Gói Professional:</strong> 1,299$/tháng (Hỗ trợ 24/7, tối ưu FinOps, CI/CD nâng cao)<br>
        • <strong>Gói Enterprise:</strong> May đo theo quy mô hạ tầng lớn.</p>
        <p>Đặc biệt, dịch vụ <strong>FinOps Audit</strong> của chúng tôi cam kết giúp tiết kiệm từ 30% đến 50% tiền server AWS/GCP ngay trong tháng đầu tiên!</p>
      `;
    }

    if (text.includes('khẩn cấp') || text.includes('sự cố') || text.includes('24/7') || text.includes('cứu hộ') || text.includes('down') || text.includes('sập') || text.includes('lỗi')) {
      return `
        <p>🚨 <strong>Đội ngũ trực On-call 24/7:</strong></p>
        <p>Đối với sự cố hạ tầng khẩn cấp (server down, quá tải database, DDOS), kỹ sư cấp cao của chúng tôi phản hồi trong <strong>dưới 15 phút</strong> qua kênh liên lạc ưu tiên.</p>
        <p>Quý khách vui lòng liên hệ ngay hotline trực tiếp: <strong>+84 (0) 90 123 4567</strong> hoặc để lại số điện thoại ngay tại đây để được kỹ sư liên hệ lại lập tức!</p>
      `;
    }

    if (text.includes('docker') || text.includes('container') || text.includes('containerize')) {
      return `
        <p><strong>Về Docker & Containerization:</strong></p>
        <p>CloudOps giúp chuẩn hóa toàn bộ Dockerfile: sử dụng Multi-stage build, base image siêu nhẹ (Alpine/Distroless), cấu hình non-root user và quét lỗ hổng Trivy, đảm bảo container an toàn tuyệt đối và khởi động cực nhanh.</p>
      `;
    }

    if (text.includes('giám sát') || text.includes('monitor') || text.includes('prometheus') || text.includes('grafana') || text.includes('log') || text.includes('alert')) {
      return `
        <p><strong>Hệ thống Giám sát & Cảnh báo:</strong></p>
        <p>Triển khai bộ công cụ hoàn chỉnh: <strong>Prometheus + Grafana + Loki</strong>. Cung cấp Dashboard trực quan theo dõi CPU, RAM, Network, HTTP Error Rate và tự động bắn tin cảnh báo tức thời qua Telegram/Slack của đội ngũ kỹ thuật.</p>
      `;
    }

    if (text.includes('liên hệ') || text.includes('hotline') || text.includes('sđt') || text.includes('email') || text.includes('gặp') || text.includes('tư vấn')) {
      return `
        <p>Quý khách có thể gửi thông tin liên hệ (Email hoặc SĐT) ngay trong khung chat này, hoặc gọi hotline <strong>+84 (0) 90 123 4567</strong>. Đội ngũ CloudOps sẽ liên hệ và chuẩn bị bản phác thảo kiến trúc miễn phí cho dự án của bạn!</p>
      `;
    }

    // Default polite and professional response
    return `
      <p>Cảm ơn quý khách đã gửi thông tin: <em>"${escapeHtml(input)}"</em>.</p>
      <p>Yêu cầu của bạn đã được chuyển tới kỹ sư DevOps phụ trách ca trực. Để nhận tư vấn kiến trúc chuyên sâu và bản báo giá chi tiết, bạn có thể để lại <strong>Email</strong> hoặc <strong>Số điện thoại</strong> ngay tại đây nhé!</p>
    `;
  }

  // HTML entity escaper
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

