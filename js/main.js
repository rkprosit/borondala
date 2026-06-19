// Navbar scroll
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Hero slideshow
const slidesContainer = document.querySelector('.hero-slideshow');
const slides = Array.from(document.querySelectorAll('.hero-slide'));
const heroContent = document.querySelector('.hero-content');
let currentSlide = 0;

// Shuffle slides
slides.sort(() => Math.random() - 0.5);
slides.forEach(slide => slidesContainer.appendChild(slide));
slides[0].classList.add('active');

function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 3000);

setTimeout(() => {
  heroContent.classList.add('text-hidden');
}, 5000);

// Portfolio filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioGrid = document.querySelector('.portfolio-grid');
const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));

function shufflePortfolio() {
  portfolioItems.forEach(item => {
    item.classList.remove('wide', 'tall');
    item.style.order = Math.floor(Math.random() * 1000);
    if (Math.random() < 0.25) item.classList.add('wide');
    if (Math.random() < 0.15) item.classList.add('tall');
  });
  portfolioItems.sort(() => Math.random() - 0.5).forEach(item => portfolioGrid.appendChild(item));
}

shufflePortfolio();

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    if (filter === 'all') {
      portfolioGrid.classList.add('all-view');
    } else {
      portfolioGrid.classList.remove('all-view');
      shufflePortfolio();
    }

    portfolioItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = 'block';
        setTimeout(() => item.style.opacity = '1', 10);
      } else {
        item.style.opacity = '0';
        setTimeout(() => item.style.display = 'none', 300);
      }
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');
let currentIndex = 0;
let lightboxImages = [];

document.querySelectorAll('.portfolio-item').forEach((item, index) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const allImgs = document.querySelectorAll('.portfolio-item img');
    lightboxImages = Array.from(allImgs).map(i => i.src);
    currentIndex = Array.from(allImgs).indexOf(img);
    openLightbox(currentIndex);
  });
});

function openLightbox(index) {
  lightboxImg.src = lightboxImages[index];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
  lightboxImg.src = lightboxImages[currentIndex];
});

lightboxNext.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % lightboxImages.length;
  lightboxImg.src = lightboxImages[currentIndex];
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
});

// Video modal
const videoModal = document.getElementById('videoModal');
const videoPlayer = videoModal.querySelector('video');
const videoIframe = videoModal.querySelector('iframe');
const videoClose = videoModal.querySelector('.lightbox-close');

document.querySelectorAll('.video-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.dataset.src;
    if (src) {
      if (src.includes('youtube') || src.includes('youtu.be')) {
        const id = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
        if (id) {
          videoIframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
          videoIframe.style.display = 'block';
          videoPlayer.style.display = 'none';
        }
      } else {
        videoPlayer.src = src;
        videoPlayer.style.display = 'block';
        videoIframe.style.display = 'none';
      }
      videoModal.classList.add('open');
      videoPlayer.play();
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeVideo() {
  videoModal.classList.remove('open');
  videoPlayer.pause();
  videoPlayer.src = '';
  videoIframe.src = '';
  videoIframe.style.display = 'none';
  videoPlayer.style.display = 'block';
  document.body.style.overflow = '';
}

videoClose.addEventListener('click', closeVideo);
videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) closeVideo();
});

// Estimate modal
const estimateModal = document.getElementById('estimateModal');
const estimateClose = estimateModal.querySelector('.estimate-close');
const estimateForm = document.getElementById('estimateForm');

function openEstimate() {
  estimateModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeEstimate() {
  estimateModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('navEstimate').addEventListener('click', (e) => {
  e.preventDefault();
  openEstimate();
});

document.getElementById('heroEstimate').addEventListener('click', (e) => {
  e.preventDefault();
  openEstimate();
});

estimateClose.addEventListener('click', closeEstimate);

estimateModal.addEventListener('click', (e) => {
  if (e.target === estimateModal) closeEstimate();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && estimateModal.classList.contains('open')) closeEstimate();
});

estimateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(estimateForm);
  await fetch(estimateForm.action, { method: 'POST', body: data });
  alert('Thank you! I will review your request and get back to you within 24 hours with a custom estimate.');
  closeEstimate();
  estimateForm.reset();
});

// Chatbot
const chatbot = document.getElementById('chatbot');
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotBody = document.getElementById('chatbotBody');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const quickReplies = document.getElementById('quickReplies');

const responses = {
  default: [
    "I'm not sure I understand. Could you try asking about our **services**, **pricing**, **booking**, **portfolio**, or **contact** details?",
    "Feel free to ask me about what we offer! Try: services, pricing, booking, portfolio, or contact."
  ],
  services: [
    "We offer a wide range of photography services including:\n\n📸 **Wedding Photography** — Full-day coverage, candid & traditional\n💑 **Pre-Wedding Shoots** — Creative love stories at scenic locations\n🎂 **Birthday Parties** — Kids' birthdays, sweet 16, milestone celebrations\n🏢 **Corporate Events** — Conferences, parties, product launches\n🎬 **Videography** — Cinematic wedding films, highlight reels, event coverage\n\nWould you like details on any specific service?",
    "You can check out our portfolio in the Portfolio section above to see samples of each category!"
  ],
  pricing: [
    "We have flexible packages to suit different needs:\n\n**Basic** — 4 hrs, 200+ photos — ideal for small events & birthdays\n**Standard** ⭐ Popular — 8 hrs, 500+ photos, 1 video reel — great for pre-weddings & intimate weddings\n**Premium** — Full day, 1000+ photos, 2 videographers, album — for grand weddings\n\nAll packages include edited digital files and an online gallery. Want a custom quote? Click **Get Estimate** above!",
    "Every event is unique! For a personalized quote, just use the **Get Estimate** button and I'll help you out."
  ],
  booking: [
    "Booking is easy! Here's how:\n\n1️⃣ Check out my **portfolio** to see my work\n2️⃣ Use the **Get Estimate** button to tell me about your event\n3️⃣ I'll get back to you within **24 hours** with a custom quote\n4️⃣ Once you confirm, we'll lock in your date!\n\nFor urgent bookings, feel free to **call** or **WhatsApp** me directly using the buttons on this page.",
    "Ready to book? Just hit the **Get Estimate** button and fill in the details. I'll respond within 24 hours!"
  ],
  portfolio: [
    "You can view my full portfolio in the **Portfolio** section above! I've organized it by category:\n\n💍 Wedding\n💕 Pre-Wedding\n🎂 Birthday\n🎉 Events\n\nJust click on any photo to view it full-size. There's also a **Video** section with cinematic films!",
    "Head over to the **Portfolio** section above to see my latest work across weddings, pre-weddings, birthdays, and events!"
  ],
  contact: [
    "You can reach me through any of these:\n\n📞 **Call:** +91 80136 38040 / +91 96418 50851\n💬 **WhatsApp:** +91 80136 38040\n📧 **Email:** borondalaphotography@gmail.com\n📍 **Location:** Hooghly, West Bengal, India\n\nOr use the **Get Estimate** button to send me a detailed message!",
    "I'm just a call or WhatsApp away! Check the **Contact** section or use the floating buttons on this page."
  ],
  thanks: [
    "You're welcome! 😊 If you have any more questions, feel free to ask. Have a great day!",
    "Happy to help! Don't hesitate to reach out if you need anything else."
  ],
  greeting: [
    "Hello! 👋 Welcome to Borondala Photography. How can I assist you today?",
    "Hi there! Looking for a photographer? I can tell you about our services, pricing, and more!"
  ]
};

function getResponse(input) {
  const text = input.toLowerCase().trim();

  if (/\b(hi|hello|hey|hlo|hii)\b/.test(text))
    return { text: pick(responses.greeting), hideQuickReplies: true };
  if (/\b(thank|thanks|thnx|ty)\b/.test(text))
    return { text: pick(responses.thanks), hideQuickReplies: true };
  if (/\b(service|offer|provide|wedding|pre.?wedding|birthday|event|corporate|what do you)\b/.test(text))
    return { text: pick(responses.services) };
  if (/\b(price|pricing|cost|rate|package|plan|how much|budget|charge|fee|starting)\b/.test(text))
    return { text: pick(responses.pricing) };
  if (/\b(book|booking|reserve|hire|appoint|schedule|available|date|how to)\b/.test(text))
    return { text: pick(responses.booking) };
  if (/\b(portfolio|work|sample|gallery|photo|picture|show|see|view)\b/.test(text))
    return { text: pick(responses.portfolio) };
  if (/\b(contact|reach|call|phone|mobile|email|whatsapp|location|address|map)\b/.test(text))
    return { text: pick(responses.contact) };
  if (/\b(estimate|quote|quotation|cost estimate)\b/.test(text))
    return { text: "You can get a personalized estimate by clicking the **Get Estimate** button at the top of the page! Just fill in your event details and I'll get back to you within 24 hours.", suggestQuick: true };

  return { text: pick(responses.default) };
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  const content = document.createElement('div');
  content.className = 'msg-content';
  content.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  div.appendChild(content);
  chatbotBody.insertBefore(div, chatbotBody.querySelector('.typing') || chatbotBody.querySelector('.quick-replies') || null);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'typing';
  div.id = 'typingIndicator';
  for (let i = 0; i < 3; i++) {
    const span = document.createElement('span');
    div.appendChild(span);
  }
  chatbotBody.appendChild(div);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;

  const qr = chatbotBody.querySelector('.quick-replies');
  if (qr) qr.style.display = 'none';
}

function hideTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function handleResponse(text, hideQuickReplies) {
  hideTyping();
  addMessage(text, 'bot');
  chatbotBody.scrollTop = chatbotBody.scrollHeight;

  const qr = document.getElementById('quickReplies');
  if (!hideQuickReplies) {
    qr.style.display = 'flex';
  } else {
    qr.style.display = 'none';
  }
}

function sendMessage(text) {
  if (!text.trim()) return;
  addMessage(text, 'user');
  chatbotInput.value = '';

  const qr = document.getElementById('quickReplies');
  qr.style.display = 'none';

  showTyping();

  setTimeout(() => {
    const { text: reply, hideQuickReplies, suggestQuick } = getResponse(text);
    handleResponse(reply, hideQuickReplies || suggestQuick);
    if (suggestQuick) {
      setTimeout(() => {
        const btn = document.createElement('div');
        btn.className = 'quick-replies';
        btn.style.marginTop = '8px';
        btn.innerHTML = '<button data-query="estimate">Get Estimate</button>';
        chatbotBody.appendChild(btn);
        btn.querySelector('button').addEventListener('click', () => {
          openEstimate();
          closeChatbot();
        });
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
      }, 300);
    }
  }, 800 + Math.random() * 600);
}

function openChatbot() {
  chatbot.classList.add('open');
}

function closeChatbot() {
  chatbot.classList.remove('open');
}

chatbotBtn.addEventListener('click', () => {
  if (chatbot.classList.contains('open')) {
    closeChatbot();
  } else {
    openChatbot();
  }
});

chatbotClose.addEventListener('click', closeChatbot);

chatbotSend.addEventListener('click', () => {
  sendMessage(chatbotInput.value);
});

chatbotInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage(chatbotInput.value);
  }
});

quickReplies.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const query = e.target.dataset.query;
    const labels = { services: 'Tell me about services', pricing: 'What are your prices?', booking: 'How to book?', portfolio: 'Show portfolio', contact: 'Contact info' };
    sendMessage(labels[query] || query);
  }
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
