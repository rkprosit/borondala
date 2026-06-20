// Navbar scroll
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

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
const hero = document.querySelector('.hero');
const slidesContainer = document.querySelector('.hero-slideshow');
const slides = Array.from(document.querySelectorAll('.hero-slide'));
const heroContent = document.querySelector('.hero-content');
let currentSlide = 0;
let slideInterval;

// Shuffle slides
slides.sort(() => Math.random() - 0.5);
slides.forEach(slide => slidesContainer.appendChild(slide));
slides[0].classList.add('active');

function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

function startSlideshow() {
  if (slideInterval) return;
  slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideshow() {
  clearInterval(slideInterval);
  slideInterval = null;
}

startSlideshow();

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) startSlideshow();
    else stopSlideshow();
  });
}, { threshold: 0 });
heroObserver.observe(hero);

setTimeout(() => {
  heroContent.classList.add('text-hidden');
}, 5000);

// Portfolio filter
const API_BASE = 'backend';
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioGrid = document.querySelector('.portfolio-grid');
const videoGrid = document.querySelector('.video-grid');
const showMorePortfolio = document.getElementById('showMorePortfolio');
const showMoreVideo = document.getElementById('showMoreVideo');
const showAllPortfolio = document.getElementById('showAllPortfolio');
const showAllVideo = document.getElementById('showAllVideo');

const INITIAL_SHOW = 8;
const INITIAL_VIDEO = 4;
const SHOW_MORE_INCREMENT = 4;

let portfolioData = [];
let videoData = [];
let portfolioVisibleCount = INITIAL_SHOW;
let videoVisibleCount = INITIAL_VIDEO;

async function fetchPortfolio(category) {
  const params = category && category !== 'all' ? `?category=${category}` : '';
  const res = await fetch(`${API_BASE}/get_portfolio.php${params}`);
  const data = await res.json();
  return data.success ? data.data : [];
}

async function fetchVideos() {
  const res = await fetch(`${API_BASE}/get_videos.php`);
  const data = await res.json();
  return data.success ? data.data : [];
}

function buildPortfolioHTML(items) {
  return items.map(item => `
    <div class="portfolio-item fade-in" data-category="${item.category}" data-id="${item.id}">
      <img loading="lazy" decoding="async" src="${item.image_path}" alt="${item.alt_text || item.title}">
      <div class="portfolio-overlay">
        <h3>${item.title}</h3>
        <span>${item.category}</span>
      </div>
    </div>
  `).join('');
}

function buildVideoHTML(items) {
  return items.map(v => {
    const thumb = v.thumbnail_url || (
      (v.youtube_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/) || [])[1]
        ? `https://img.youtube.com/vi/${v.youtube_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)[1]}/maxresdefault.jpg`
        : ''
    );
    return `
      <div class="video-item fade-in" data-src="${v.youtube_url}">
        <div class="video-thumb">
          <img loading="lazy" src="${thumb}" alt="${v.title}" style="width:100%; height:100%; object-fit:cover;">
          <div class="play-btn"></div>
        </div>
        <div class="video-info">
          <h4>${v.title}</h4>
          <span>${v.category}</span>
        </div>
      </div>
    `;
  }).join('');
}

function getPortfolioItems() {
  return Array.from(portfolioGrid.querySelectorAll('.portfolio-item'));
}

function getVideoItems() {
  return Array.from(videoGrid.querySelectorAll('.video-item'));
}

function applyPortfolioVisibility() {
  const filter = document.querySelector('.filter-btn.active')?.dataset?.filter || 'all';
  const items = filter === 'all' ? portfolioData : portfolioData.filter(i => i.category === filter);
  const allItems = getPortfolioItems();

  allItems.forEach(el => {
    const match = filter === 'all' || el.dataset.category === filter;
    el.style.display = match ? '' : 'none';
  });

  allItems.forEach((el, i) => {
    el.style.display = i < portfolioVisibleCount ? '' : 'none';
  });

  if (showMorePortfolio) showMorePortfolio.classList.toggle('hidden', portfolioVisibleCount >= items.length);
  if (showAllPortfolio) showAllPortfolio.classList.toggle('hidden', portfolioVisibleCount >= items.length);
}

function getFilteredCount() {
  const filter = document.querySelector('.filter-btn.active')?.dataset?.filter || 'all';
  return filter === 'all' ? portfolioData.length : portfolioData.filter(i => i.category === filter).length;
}

function applyVideoVisibility() {
  const allItems = getVideoItems();
  allItems.forEach((el, i) => { el.style.display = i < videoVisibleCount ? '' : 'none'; });
  if (showMoreVideo) showMoreVideo.classList.toggle('hidden', videoVisibleCount >= videoData.length);
  if (showAllVideo) showAllVideo.classList.toggle('hidden', videoVisibleCount >= videoData.length);
}

function shuffleGrid(grid) {
  const items = Array.from(grid.querySelectorAll('.portfolio-item, .video-item'));
  items.forEach(item => {
    item.classList.remove('wide', 'tall');
    item.style.order = '';
    if (item.classList.contains('portfolio-item')) {
      if (Math.random() < 0.25) item.classList.add('wide');
      if (Math.random() < 0.15) item.classList.add('tall');
    }
  });
  items.sort(() => Math.random() - 0.5).forEach(item => grid.appendChild(item));
}

async function loadPortfolio() {
  portfolioData = await fetchPortfolio();
  portfolioGrid.innerHTML = buildPortfolioHTML(portfolioData);
  shuffleGrid(portfolioGrid);
  applyPortfolioVisibility();
  setupLightbox();
}

async function loadVideos() {
  videoData = await fetchVideos();
  videoGrid.innerHTML = buildVideoHTML(videoData);
  applyVideoVisibility();
  setupVideoModal();
}

if (showMorePortfolio) {
  showMorePortfolio.addEventListener('click', () => {
    portfolioVisibleCount += SHOW_MORE_INCREMENT;
    applyPortfolioVisibility();
    setTimeout(() => {
      document.querySelector('.show-more-btn:not(.hidden)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  });
}

if (showMoreVideo) {
  showMoreVideo.addEventListener('click', () => {
    videoVisibleCount += SHOW_MORE_INCREMENT;
    applyVideoVisibility();
    setTimeout(() => {
      document.querySelector('.show-more-btn:not(.hidden)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  });
}

if (showAllPortfolio) {
  showAllPortfolio.addEventListener('click', () => {
    portfolioVisibleCount = getFilteredCount();
    applyPortfolioVisibility();
  });
}

if (showAllVideo) {
  showAllVideo.addEventListener('click', () => {
    videoVisibleCount = videoData.length;
    applyVideoVisibility();
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    portfolioGrid.classList.toggle('all-view', btn.dataset.filter === 'all');
    portfolioVisibleCount = INITIAL_SHOW;
    applyPortfolioVisibility();
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
let currentIndex = 0;
let lightboxImages = [];

function getVisibleItems() {
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset?.filter || 'all';
  const items = Array.from(portfolioGrid.querySelectorAll('.portfolio-item'));
  return items.filter(item => {
    if (activeFilter === 'all') return item.style.display !== 'none';
    return item.dataset.category === activeFilter && item.style.display !== 'none';
  });
}

function setupLightbox() {
  portfolioGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.portfolio-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;
    const visible = getVisibleItems();
    lightboxImages = visible.map(i => i.querySelector('img')?.src).filter(Boolean);
    currentIndex = lightboxImages.indexOf(img.src);
    if (currentIndex === -1) currentIndex = 0;
    if (!lightboxImages.length) return;
    lightboxImg.src = lightboxImages[currentIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightbox.addEventListener('click', (e) => {
  if (e.target.classList.contains('lightbox-close') || e.target === lightbox) {
    closeLightbox();
  } else if (e.target.classList.contains('lightbox-prev')) {
    currentIndex = (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src = lightboxImages[currentIndex];
  } else if (e.target.classList.contains('lightbox-next')) {
    currentIndex = (currentIndex + 1) % lightboxImages.length;
    lightboxImg.src = lightboxImages[currentIndex];
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (lightbox.classList.contains('open')) closeLightbox();
    if (estimateModal.classList.contains('open')) closeEstimate();
    return;
  }
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src = lightboxImages[currentIndex];
  }
  if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % lightboxImages.length;
    lightboxImg.src = lightboxImages[currentIndex];
  }
});

// Video modal
const videoModal = document.getElementById('videoModal');
const videoPlayer = videoModal.querySelector('video');
const videoIframe = videoModal.querySelector('iframe');
const videoClose = videoModal.querySelector('.lightbox-close');

function setupVideoModal() {
  videoGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.video-item');
    if (!item) return;
    const src = item.dataset.src;
    if (!src) return;
    if (src.includes('youtube') || src.includes('youtu.be')) {
      const id = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
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
  });
}

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

function observeNew() {
  document.querySelectorAll('.fade-in:not(.observed)').forEach(el => {
    el.classList.add('observed');
    observer.observe(el);
  });
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([loadPortfolio(), loadVideos()]);
  observeNew();
});
