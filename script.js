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
