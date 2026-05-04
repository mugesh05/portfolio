
// ━━━ TYPED ━━━
const _strings = ['Full Stack Developer & UI Designer', 'React & Node.js Specialist', 'UI/UX Enthusiast'];
let _si = 0, _ci = 0, _del = false, _pause = false;
const _tel = document.getElementById('typed');
function _type() {
  if (_pause) { setTimeout(_type, 1900); _pause = false; return; }
  const s = _strings[_si];
  if (!_del) { _tel.textContent = s.substring(0, _ci + 1); _ci++; if (_ci === s.length) { _del = true; _pause = true; } setTimeout(_type, 62); }
  else { _tel.textContent = s.substring(0, _ci - 1); _ci--; if (_ci === 0) { _del = false; _si = (_si + 1) % _strings.length; } setTimeout(_type, 30); }
}
_type();

// ━━━ CURSOR ━━━
const _cur = document.getElementById('cur'), _dot = document.getElementById('dot');
let mx = 0, my = 0, cx = 0, cy = 0, dx = 0, dy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
(function _tick() {
  cx += (mx - cx) * .14; cy += (my - cy) * .14;
  dx += (mx - dx) * .55; dy += (my - dy) * .55;
  _cur.style.transform = `translate(${cx - 18}px,${cy - 18}px)`;
  _dot.style.transform = `translate(${dx - 2.5}px,${dy - 2.5}px)`;
  requestAnimationFrame(_tick);
})();
document.querySelectorAll('a,button,.pcard,.sc,.skcat,.ccard,.ecard,.stag').forEach(el => {
  el.addEventListener('mouseenter', () => _cur.classList.add('h'));
  el.addEventListener('mouseleave', () => _cur.classList.remove('h'));
});
document.addEventListener('mousedown', () => _cur.classList.add('c'));
document.addEventListener('mouseup', () => _cur.classList.remove('c'));

// ━━━ NAV SCROLL ━━━
const _nav = document.getElementById('nav');
window.addEventListener('scroll', () => _nav.classList.toggle('sc', scrollY > 55), { passive: true });

// ━━━ SCROLL PROGRESS ━━━
const _prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
  _prog.style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
}, { passive: true });

// ━━━ MOBILE MENU ━━━
const _mb = document.getElementById('mb'), _mob = document.getElementById('mob');
_mb.addEventListener('click', () => { _mb.classList.toggle('open'); _mob.classList.toggle('open'); });
_mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { _mb.classList.remove('open'); _mob.classList.remove('open'); }));

// ━━━ SMOOTH SCROLL ━━━
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ━━━ REVEAL ━━━
const _ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('v'); });
}, { threshold: 0.08 });
document.querySelectorAll('.rev').forEach(el => _ro.observe(el));

// ━━━ SKILL BARS ━━━
const _bo = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bf').forEach(b => { b.style.width = b.dataset.w + '%'; });
      _bo.unobserve(e.target);
    }
  });
}, { threshold: 0.18 });
document.querySelectorAll('.skcat').forEach(el => _bo.observe(el));

// ━━━ COUNTER ━━━
const _co = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, tgt = parseFloat(el.dataset.n), dec = tgt % 1 !== 0;
    let st = null;
    (function _step(ts) {
      if (!st) st = ts;
      const p = Math.min((ts - st) / 1800, 1), ease = 1 - Math.pow(1 - p, 4);
      el.textContent = dec ? (tgt * ease).toFixed(1) : Math.round(tgt * ease);
      if (p < 1) requestAnimationFrame(_step);
    })(performance.now());
    _co.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.sn[data-n]').forEach(el => _co.observe(el));

// ━━━ PROFILE CARD 3D TILT ━━━
const _pc = document.getElementById('pc');
if (_pc && window.innerWidth > 1024) {
  document.addEventListener('mousemove', e => {
    const r = _pc.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width * 13;
    const y = (e.clientY - r.top - r.height / 2) / r.height * -13;
    _pc.style.transform = `perspective(880px) rotateX(${y}deg) rotateY(${x}deg)`;
  }, { passive: true });
  document.addEventListener('mouseleave', () => _pc.style.transform = '');
}

// ━━━ CARD AMBIENT GLOW ━━━
document.querySelectorAll('.sc,.pcard,.ccard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.background = `radial-gradient(circle at ${((e.clientX - r.left) / r.width * 100).toFixed(1)}% ${((e.clientY - r.top) / r.height * 100).toFixed(1)}%,rgba(167,139,250,.05) 0%,var(--card) 55%)`;
  }, { passive: true });
  card.addEventListener('mouseleave', () => card.style.background = '');
});

// ━━━ CONTACT FORM ━━━
document.getElementById('cf').addEventListener('submit', e => {
  e.preventDefault();
  const inputs = [...e.target.querySelectorAll('input,textarea')].map(i => i.value.trim());
  const [name, email, subject, msg] = inputs;
  window.location.href = `mailto:mksmugesh269@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Hi Mugesh,\n\nName: ' + name + '\nEmail: ' + email + '\n\n' + msg)}`;
  const btn = e.target.querySelector('.fsub');
  btn.textContent = 'Opening email client…'; btn.style.background = 'linear-gradient(135deg,#34d399,#38bdf8)';
  setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; e.target.reset(); }, 3000);
});

// ━━━ MAGNETIC BTNS ━━━
document.querySelectorAll('.btn-p,.hire').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .18}px)`;
  }, { passive: true });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});
