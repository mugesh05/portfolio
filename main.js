(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const body = document.body;

  /* ---------- Intro curtain, then hero sequence ---------- */
  const intro = $('.intro');
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    body.classList.add('is-ready');
    if (intro) setTimeout(() => intro.remove(), 1500);
  };
  if (reduce) {
    start();
  } else {
    const go = () => setTimeout(start, 700);
    document.readyState === 'complete' ? go() : addEventListener('load', go);
    setTimeout(start, 3000); // safety net if load is slow
  }

  /* ---------- Scroll-triggered reveals ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => revealIO.observe(el));

  /* ---------- Word-by-word text reveal driven by scroll ---------- */
  const scrub = $('[data-scrub]');
  let words = [];
  if (scrub) {
    const text = scrub.textContent.trim().split(/\s+/);
    scrub.setAttribute('aria-label', text.join(' '));
    scrub.innerHTML = text.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    words = $$('.w', scrub);
    if (reduce) words.forEach((w) => w.classList.add('on'));
  }

  /* ---------- Single rAF scroll loop: progress, header, parallax, scrub ---------- */
  const bar = $('.progress');
  const header = $('#header');
  const parallax = $$('[data-parallax]').map((el) => ({ el, speed: parseFloat(el.dataset.parallax) || 0.08, visible: false }));
  const parIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const item = parallax.find((p) => p.el === e.target);
      if (item) item.visible = e.isIntersecting;
    });
  }, { rootMargin: '15% 0px' });
  parallax.forEach((p) => parIO.observe(p.el));

  let lastY = 0, ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    header.classList.toggle('is-solid', y > 40);
    const menuOpen = body.classList.contains('menu-open');
    header.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 400);
    lastY = y;

    if (!reduce) {
      parallax.forEach((p) => {
        if (!p.visible) return;
        const r = p.el.getBoundingClientRect();
        const offset = r.top + r.height / 2 - innerHeight / 2;
        const v = (-offset * p.speed).toFixed(1);
        if (p.el.classList.contains('shot')) p.el.style.setProperty('--py', v + 'px'); // image drifts inside its frame
        else p.el.style.transform = `translate3d(0,${v}px,0)`;
      });
    }

    if (words.length && !reduce) {
      const r = scrub.getBoundingClientRect();
      const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.25), 0, 1);
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();

  /* ---------- Active nav link ---------- */
  const links = $$('.nav a');
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'services', 'about', 'contact'].forEach((id) => { const s = document.getElementById(id); if (s) navIO.observe(s); });

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger');
  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  links.forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width: 880px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

  /* ---------- Smooth in-page navigation (works with reduced motion too) ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Project screenshot fallback ---------- */
  $$('.shot img').forEach((img) => {
    const fail = () => img.closest('.shot').classList.add('no-img');
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fail();
  });

  /* ---------- Desktop-only interactions ---------- */
  if (fine && !reduce) {
    // Custom cursor
    const cursor = $('.cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    const label = $('b', ring);
    body.classList.add('has-cursor');
    cursor.classList.add('is-hidden');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', (e) => {
      const labelled = e.target.closest('[data-cursor]');
      const clickable = e.target.closest('a,button,select,input,textarea');
      cursor.classList.toggle('is-link', !!labelled);
      cursor.classList.toggle('is-small', !labelled && !!clickable);
      label.textContent = labelled ? labelled.dataset.cursor : '';
    });

    // Magnetic buttons
    $$('[data-magnetic]').forEach((el) => {
      const strength = 0.3;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    // Spotlight on service cards
    $$('.card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', e.clientX - r.left + 'px');
        card.style.setProperty('--my', e.clientY - r.top + 'px');
      });
    });
  }

  /* ---------- Project enquiry form (opens email or WhatsApp, no backend needed) ---------- */
  const form = $('#enquiry');
  const msg = $('#formMsg');
  const EMAIL = 'mksmugesh269@gmail.com';
  const WHATSAPP = '917708858849';

  const validate = () => {
    let ok = true;
    $$('input,select,textarea', form).forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('is-bad', bad);
      f.setAttribute('aria-invalid', String(bad));
      if (bad) ok = false;
    });
    return ok;
  };
  form.addEventListener('input', (e) => e.target.classList.remove('is-bad'));

  $$('[data-via]', form).forEach((btn) => {
    btn.addEventListener('click', () => {
      msg.classList.remove('is-error');
      if (!validate()) {
        msg.textContent = 'Please fill in every field with a valid email so I can reply.';
        msg.classList.add('is-error');
        return;
      }
      const d = Object.fromEntries(new FormData(form));
      const text = `Hi Mugesh,\n\nI'm ${d.name}. I'm interested in: ${d.type}.\n\n${d.message}\n\nReply to: ${d.email}`;
      if (btn.dataset.via === 'whatsapp') {
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
        msg.textContent = 'Opening WhatsApp with your message ready to send.';
      } else {
        location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Project enquiry: ' + d.type)}&body=${encodeURIComponent(text)}`;
        msg.textContent = `Opening your email app. If nothing opens, write to ${EMAIL}.`;
      }
    });
  });
})();
