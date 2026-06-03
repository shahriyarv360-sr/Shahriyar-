/* =========================================
   SHAHRIYAR RAHMAN — script.js
   ========================================= */

/* ── 1. Custom Cursor ── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let cx = window.innerWidth/2, cy = window.innerHeight/2;
let tx = cx, ty = cy;

document.addEventListener('mousemove', e => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';
  tx = e.clientX; ty = e.clientY;
});

(function moveCursor() {
  cx += (tx - cx) * 0.14;
  cy += (ty - cy) * 0.14;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  requestAnimationFrame(moveCursor);
})();

// Scale cursor on hover targets
document.querySelectorAll('a, button, .skill-box, .info-card, .c-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform  = 'translate(-50%,-50%) scale(1.7)';
    cursor.style.borderColor = 'var(--purple)';
    cursor.style.background  = 'rgba(168,85,247,0.12)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform  = 'translate(-50%,-50%) scale(1)';
    cursor.style.borderColor = 'var(--cyan)';
    cursor.style.background  = 'transparent';
  });
});

/* ── 2. Star Canvas ── */
const canvas = document.getElementById('stars');
const ctx    = canvas.getContext('2d');
let W, H, stars = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initStars(); });

function initStars() {
  stars = [];
  for (let i = 0; i < 140; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.6 + 0.1,
      color: Math.random() > 0.6 ? '0,229,255' : Math.random() > 0.5 ? '168,85,247' : '236,72,153'
    });
  }
}
initStars();

function drawStars() {
  ctx.clearRect(0, 0, W, H);
  stars.forEach(s => {
    s.x += s.vx; s.y += s.vy;
    if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
    if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.color},${s.a})`;
    ctx.fill();
  });
  // Connect close stars
  for (let i = 0; i < stars.length; i++) {
    for (let j = i+1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(0,229,255,${(1 - d/110) * 0.12})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawStars);
}
drawStars();

/* ── 3. Navbar shrink + active link ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('shrink', window.scrollY > 60);
  highlightNav();
});

function highlightNav() {
  const scrollY = window.scrollY + 130;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector(`.nl[href="#${sec.id}"]`);
    if (!link) return;
    link.classList.toggle('active',
      scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
}

/* ── 4. Hamburger / Drawer ── */
const ham     = document.getElementById('ham');
const drawer  = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const drawerClose = document.getElementById('drawerClose');

function openDrawer() {
  drawer.classList.add('open');
  overlay.classList.add('show');
  const s = ham.querySelectorAll('span');
  s[0].style.transform = 'rotate(45deg) translate(5px,5px)';
  s[1].style.opacity   = '0';
  s[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
}
function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('show');
  ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

ham.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
document.querySelectorAll('.dl').forEach(l => l.addEventListener('click', closeDrawer));

/* ── 5. Typed Text ── */
const roles = [
  'CST Student 💻',
  'Web Developer 🌐',
  'Creative Coder ✨',
  'Problem Solver 🧩',
  'Future Engineer 🚀'
];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const cur = roles[ri];
  if (!deleting) {
    typedEl.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { deleting = true; setTimeout(type, 2000); return; }
  } else {
    typedEl.textContent = cur.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri+1) % roles.length; }
  }
  setTimeout(type, deleting ? 50 : 85);
}
type();

/* ── 6. Scroll Reveal + Skill Bars ── */
const revEls = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      // animate skill bars inside this element
      e.target.querySelectorAll('.sk-bar').forEach(b => {
        b.style.width = b.dataset.w + '%';
      });
      // if the element itself is a skill-box
      if (e.target.classList.contains('skill-box')) {
        const b = e.target.querySelector('.sk-bar');
        if (b) b.style.width = b.dataset.w + '%';
      }
    }
  });
}, { threshold: 0.15 });

revEls.forEach(el => revObs.observe(el));

/* ── 7. Contact Form ── */
document.getElementById('cForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '✓ Message Sent!';
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.style.background = '';
    this.reset();
  }, 3000);
});

/* ── 8. Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── 9. Hero visible on load ── */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('in'));
});

/* ── 10. Project Filters ── */
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.proj-card').forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
        // re-trigger reveal
        setTimeout(() => card.classList.add('in'), 10);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});