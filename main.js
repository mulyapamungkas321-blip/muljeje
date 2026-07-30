import confetti from 'canvas-confetti';
import bgmFile from './BeautifullBazzii.mp3';

// ==========================================
// 1. PETAL & HEART CANVAS SYSTEM
// ==========================================
const canvas = document.getElementById('petal-canvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

class Petal {
  constructor(x, y, isBurst = false) {
    this.x = x || Math.random() * width;
    this.y = y || (isBurst ? y : -20);
    this.size = Math.random() * 12 + 8;
    this.speedY = isBurst ? (Math.random() - 0.5) * 8 : Math.random() * 1.5 + 1;
    this.speedX = isBurst ? (Math.random() - 0.5) * 8 : Math.random() * 1 - 0.5;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 2;
    this.opacity = Math.random() * 0.7 + 0.3;

    // Types: 0 = Pink Petal, 1 = Sage Leaf, 2 = Sparkle
    this.type = Math.floor(Math.random() * 3);
  }

  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.y * 0.02) + this.speedX;
    this.rotation += this.rotSpeed;

    if (this.y > height + 20) {
      this.y = -20;
      this.x = Math.random() * width;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;

    if (this.type === 0) {
      ctx.fillStyle = '#F3A5B1';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 1) {
      ctx.fillStyle = '#A8C4B2';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size / 1.2, this.size / 2.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#FFF';
      ctx.font = `${this.size}px sans-serif`;
      ctx.fillText('✨', 0, 0);
    }

    ctx.restore();
  }
}

let petals = [];
const TOTAL_PETALS = 35;

for (let i = 0; i < TOTAL_PETALS; i++) {
  petals.push(new Petal());
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  petals.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

function triggerBurst(x, y) {
  for (let i = 0; i < 25; i++) {
    petals.push(new Petal(x, y, true));
  }
  confetti({
    particleCount: 40,
    spread: 70,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors: ['#F3A5B1', '#7C9A86', '#FAECEE', '#FFF']
  });
}

// ==========================================
// 3. SEQUENTIAL STEP NAVIGATION LOGIC
// ==========================================
function goToPage(stepNum) {
  const pageSteps = document.querySelectorAll('.page-step');
  const stepItems = document.querySelectorAll('.step-item');

  pageSteps.forEach((page) => {
    if (page.id === `page-${stepNum}`) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  stepItems.forEach((item) => {
    const itemStep = parseInt(item.dataset.step, 10);
    if (itemStep <= stepNum) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Confetti when moving forward
  if (stepNum > 1) {
    confetti({
      particleCount: 35,
      spread: 60,
      colors: ['#F3A5B1', '#7C9A86', '#FFF']
    });
  }
}

// ==========================================
// 4. INITIALIZATION & EVENT HANDLERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Splash Screen Audio Player
  const bgm = document.getElementById('bgm');
  const splashOverlay = document.getElementById('splash-overlay');
  const splashBtn = document.getElementById('splash-play-btn');

  if (bgm) {
    bgm.src = bgmFile;
  }

  function startMusic() {
    if (!bgm) return;
    bgm.loop = true;
    bgm.play().then(() => {
      if (splashOverlay) splashOverlay.classList.add('hidden');
    }).catch((err) => {
      console.log('Audio playback prevented:', err);
      if (splashOverlay) splashOverlay.classList.add('hidden');
    });
  }

  if (splashBtn) splashBtn.addEventListener('click', startMusic);
  if (splashOverlay) splashOverlay.addEventListener('click', startMusic);
  // Header Step Tracker Click Handler
  const stepItems = document.querySelectorAll('.step-item');
  stepItems.forEach((item) => {
    item.addEventListener('click', () => {
      const step = parseInt(item.dataset.step, 10);
      goToPage(step);
    });
  });

  // Next Page Buttons
  const nextBtns = document.querySelectorAll('.go-next-btn');
  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.dataset.goto, 10);
      goToPage(targetStep);
    });
  });

  // Previous Page Buttons
  const prevBtns = document.querySelectorAll('.go-prev-btn');
  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.dataset.goto, 10);
      goToPage(targetStep);
    });
  });

  // Petal Shower Button
  const petalShowerBtn = document.getElementById('petal-shower-btn');
  if (petalShowerBtn) {
    petalShowerBtn.addEventListener('click', (e) => {
      triggerBurst(e.clientX, e.clientY);
    });
  }

  // Hero Flower Centerpiece Interaction
  const heroFlowerCard = document.getElementById('main-flower-card');
  if (heroFlowerCard) {
    heroFlowerCard.addEventListener('click', (e) => {
      const rect = heroFlowerCard.getBoundingClientRect();
      triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  // Envelope 3D Open
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');

  function openEnvelope() {
    if (!envelope) return;
    envelope.classList.toggle('open');
    if (envelope.classList.contains('open')) {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#F3A5B1', '#7C9A86', '#FFF']
      });
    }
  }

  if (envelope) envelope.addEventListener('click', openEnvelope);
  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  // Sub-tabs inside Love Letter section
  const subtabBtns = document.querySelectorAll('.subtab-btn');
  const subtabPanes = document.querySelectorAll('.subtab-pane');

  subtabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      subtabBtns.forEach((b) => b.classList.remove('active'));
      subtabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = `tab-${btn.dataset.tab}`;
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Gallery Lightbox Modal
  const polaroids = document.querySelectorAll('.polaroid-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxDate = document.getElementById('lightbox-date');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  polaroids.forEach((card) => {
    card.addEventListener('click', () => {
      const imgSrc = card.dataset.img;
      const caption = card.dataset.caption;
      const date = card.dataset.date;

      lightboxImg.src = imgSrc;
      lightboxCaption.textContent = caption || '';
      lightboxDate.textContent = date || '';

      const details = lightboxModal.querySelector('.lightbox-details');
      if (details) {
        details.style.display = (caption || date) ? '' : 'none';
      }

      lightboxModal.classList.remove('hidden');
    });
  });

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.add('hidden');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
});
