/* =========================================================
   LOADING SCREEN
========================================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hide'), 600);
});

/* =========================================================
   YEAR
========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   CUSTOM CURSOR
========================================================= */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursorRing(){
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

document.querySelectorAll('a, button, .project-card, .cert-card, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
});

/* =========================================================
   PARTICLE BACKGROUND
========================================================= */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticles(){
  const count = Math.min(70, Math.floor(window.innerWidth / 20));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.6,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    hue: Math.random() > 0.5 ? '124,58,237' : '34,211,238'
  }));
}
createParticles();

function drawParticles(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.hue}, 0.6)`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* =========================================================
   NAVBAR SCROLL STATE + ACTIVE LINK
========================================================= */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });

  document.getElementById('backToTop').classList.toggle('show', window.scrollY > 500);
});

/* =========================================================
   MOBILE NAV TOGGLE
========================================================= */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navToggle.classList.remove('open');
  navMenu.classList.remove('open');
}));

/* =========================================================
   THEME TOGGLE (DARK / LIGHT)
========================================================= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}
applyTheme('dark');

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light');
});

/* =========================================================
   TYPING ANIMATION (HERO ROLE)
========================================================= */
const roles = ['Web Developer', 'AI Content Creator', 'Informatics Graduate'];
const typedEl = document.getElementById('typedRole');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const current = roles[roleIndex];
  if (!deleting){
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0){
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 85);
}
typeLoop();

/* =========================================================
   SCROLL REVEAL (Intersection Observer)
========================================================= */
const revealItems = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealItems.forEach(item => revealObserver.observe(item));

/* =========================================================
   COUNTER NUMBER ANIMATION
========================================================= */
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => {
      count += step;
      if (count >= target){ el.textContent = target; return; }
      el.textContent = count;
      requestAnimationFrame(tick);
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* =========================================================
   SKILL BARS + CIRCULAR PROGRESS ON SCROLL
========================================================= */
const skillBars = document.querySelectorAll('.skill-bar');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const bar = entry.target;
    const percent = bar.dataset.percent;
    const fill = bar.querySelector('.skill-fill');
    const label = bar.querySelector('.skill-percent');
    fill.style.width = percent + '%';
    let n = 0;
    const tick = () => {
      n++;
      label.textContent = n + '%';
      if (n < percent) requestAnimationFrame(tick);
    };
    tick();
    skillObserver.unobserve(bar);
  });
}, { threshold: 0.4 });
skillBars.forEach(bar => skillObserver.observe(bar));

const circleSkills = document.querySelectorAll('.circle-skill');
const CIRCUMFERENCE = 2 * Math.PI * 52;
const circleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const percent = parseInt(el.dataset.percent, 10);
    const ring = el.querySelector('.ring-fill');
    const label = el.querySelector('.circle-percent');
    const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
    ring.style.strokeDashoffset = offset;
    let n = 0;
    const tick = () => {
      n++;
      label.textContent = n + '%';
      if (n < percent) requestAnimationFrame(tick);
    };
    tick();
    circleObserver.unobserve(el);
  });
}, { threshold: 0.4 });
circleSkills.forEach(c => circleObserver.observe(c));

/* =========================================================
   PROJECT CARD TILT EFFECT
========================================================= */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* =========================================================
   CERTIFICATE MODAL
========================================================= */
const certModal = document.getElementById('certModal');
const certModalTitle = document.getElementById('certModalTitle');
const certModalDesc = document.getElementById('certModalDesc');
const certModalThumb = document.getElementById('certModalThumb');

const certModalDownload = document.getElementById('certModalDownload');

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const imgSrc = card.dataset.certImg;
    const pdfSrc = card.dataset.certPdf;
    const title = card.dataset.certTitle;

    certModalTitle.textContent = title;
    certModalDesc.textContent = card.dataset.certDesc;
    certModalThumb.innerHTML = `<img src="${imgSrc}" alt="${title}">`;

    if (certModalDownload){
      if (pdfSrc && pdfSrc !== '#'){
        certModalDownload.href = pdfSrc;
        certModalDownload.setAttribute('download', title.replace(/\s+/g, '_') + '.pdf');
        certModalDownload.style.display = 'inline-flex';
      } else {
        certModalDownload.style.display = 'none'; 
      }
    }

    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeCertModal(){
  certModal.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('certModalClose').addEventListener('click', closeCertModal);
document.getElementById('certModalBackdrop').addEventListener('click', closeCertModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCertModal(); });

/* =========================================================
   CONTACT FORM VALIDATION
========================================================= */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formErrorMsg = document.getElementById('formErrorMsg');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');

function setError(inputId, errorId, message){
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  error.textContent = message;
  input.closest('.form-group').classList.toggle('error', !!message);
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 3){
    setError('name', 'nameError', 'Nama minimal 3 karakter.'); valid = false;
  } else setError('name', 'nameError', '');

  if (!emailRegex.test(email)){
    setError('email', 'emailError', 'Masukkan alamat email yang valid.'); valid = false;
  } else setError('email', 'emailError', '');

  if (subject.length < 3){
    setError('subject', 'subjectError', 'Subject minimal 3 karakter.'); valid = false;
  } else setError('subject', 'subjectError', '');

  if (message.length < 10){
    setError('message', 'messageError', 'Pesan minimal 10 karakter.'); valid = false;
  } else setError('message', 'messageError', '');

  if (!valid) return;

  // Kirim ke Formspree
  formSuccess.classList.remove('show');
  formErrorMsg.classList.remove('show');
  submitBtn.disabled = true;
  submitBtnText.textContent = 'Mengirim...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok){
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    } else {
      formErrorMsg.classList.add('show');
    }
  } catch (err){
    formErrorMsg.classList.add('show');
  } finally {
    submitBtn.disabled = false;
    submitBtnText.textContent = 'Kirim Pesan';
  }
});

/* =========================================================
   BUTTON RIPPLE EFFECT
========================================================= */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

// /* =========================================================
//    DOWNLOAD CV (placeholder behaviour)
// ========================================================= */
// document.getElementById('downloadCV').addEventListener('click', (e) => {
//   e.preventDefault();
//   alert('File CV belum tersedia. Silakan tambahkan tautan file CV Anda pada tombol ini.');
// });

/* =========================================================
   BACK TO TOP
========================================================= */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================================
   MOUSE PARALLAX ON HERO BLOBS
========================================================= */
const blobs = document.querySelectorAll('.blob');
document.querySelector('.hero').addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;
  blobs.forEach((blob, i) => {
    const factor = (i + 1) * 18;
    blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});