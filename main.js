/* ━━━━━ CURSOR ━━━━━
   Uses transform:translate so there's zero conflict with top/left.
   Dot offset by half its size (5.5px), ring by half its size (18px).
*/

(function(){
  var dot  = document.getElementById('cd');
  var ring = document.getElementById('cr');
  var mx = 0, my = 0, rx = 0, ry = 0;
  var inited = false;

  document.addEventListener('mousemove', function(e){
    mx = e.clientX;
    my = e.clientY;
    if (!inited) { rx = mx; ry = my; inited = true; }
  });

  document.addEventListener('mouseover', function(e){
    var el = e.target;
    if (el.closest('a') || el.closest('button')){
      dot.style.width  = '20px';
      dot.style.height = '20px';
      ring.style.width  = '54px';
      ring.style.height = '54px';
      ring.style.opacity = '0.45';
    } else {
      dot.style.width  = '11px';
      dot.style.height = '11px';
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.opacity = '1';
    }
  });

  (function loop(){
    dot.style.transform  = 'translate(' + (mx - 5.5)  + 'px,' + (my - 5.5)  + 'px)';
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.transform = 'translate(' + (rx - 18) + 'px,' + (ry - 18) + 'px)';
    requestAnimationFrame(loop);
  })();
})();

/* ━━━━━ THEME ━━━━━ */
var html = document.documentElement;
var tb   = document.getElementById('tbtn');
function syncTheme(){ tb.textContent = html.dataset.theme === 'dark' ? '☀️' : '🌙'; }
tb.addEventListener('click', function(){
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  syncTheme();
});
syncTheme();

/* ━━━━━ HAMBURGER ━━━━━ */
var hb  = document.getElementById('hbtn');
var drw = document.getElementById('drw');
hb.addEventListener('click', function(){ hb.classList.toggle('op'); drw.classList.toggle('op'); });
function cdrw(){ hb.classList.remove('op'); drw.classList.remove('op'); }

/* ━━━━━ ACTIVE NAV ON SCROLL ━━━━━ */
var secs = document.querySelectorAll('section[id]');
var nas  = document.querySelectorAll('.npill a');
window.addEventListener('scroll', function(){
  var id = 'home';
  secs.forEach(function(s){ if (window.scrollY >= s.offsetTop - 100) id = s.id; });
  nas.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href') === '#' + id); });
}, {passive:true});

/* ━━━━━ COUNTER-ROTATE SKILL NODES ━━━━━ */
function applyRot(){
  document.querySelectorAll('.sr1 .nd').forEach(function(n){ n.style.animation = 'ccw 8s linear infinite'; });
  document.querySelectorAll('.sr2 .nd').forEach(function(n){ n.style.animation = 'cw 13s linear infinite'; });
  document.querySelectorAll('.sr3 .nd').forEach(function(n){ n.style.animation = 'ccw 22s linear infinite'; });
}
applyRot();

/* ━━━━━ SKILL TABS ━━━━━ */
function swTab(id, btn){
  document.querySelectorAll('.spanel').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.stab').forEach(function(b){ b.classList.remove('on'); });
  document.getElementById('p-' + id).classList.add('on');
  btn.classList.add('on');
  applyRot();
  animBars();
}

/* ━━━━━ SKILL BAR ANIMATION ━━━━━ */
function animBars(){
  document.querySelectorAll('.spanel.on .ski').forEach(function(el, i){
    el.classList.remove('go');
    void el.offsetWidth;
    setTimeout(function(){ el.classList.add('go'); }, 80 * i);
  });
}

/* ━━━━━ SCROLL REVEAL ━━━━━ */
var obs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if (!e.isIntersecting) return;
    e.target.classList.add('vis');
  });
}, {threshold: 0.1});
document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });

new IntersectionObserver(function(entries){
  if (entries[0].isIntersecting) animBars();
}, {threshold: 0.2}).observe(document.getElementById('skills'));
setTimeout(animBars, 600);

/* ━━━━━ CONTACT FORM → MAILTO ━━━━━ */
document.getElementById('cf').addEventListener('submit', function(e){
  e.preventDefault();
  var name = document.getElementById('fn').value.trim();
  var email= document.getElementById('fe').value.trim();
  var subj = document.getElementById('fs').value.trim();
  var msg  = document.getElementById('fm').value.trim();
  if (!name || !email || !subj || !msg) return;
  var body = 'Hi Mugesh,\n\nName: ' + name + '\nEmail: ' + email + '\n\n' + msg + '\n\n— via Portfolio';
  window.location.href = 'mailto:mksmugesh269@gmail.com?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  var btn = document.getElementById('fbtxt');
  btn.textContent = 'Opening email…';
  setTimeout(function(){ btn.textContent = 'Send Message'; }, 3000);
});

