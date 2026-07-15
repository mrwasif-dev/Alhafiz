/* ===== Theme (light/dark) ===== */
(function(){
  const saved = localStorage.getItem('ahri_theme');
  const theme = saved || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  window.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.getElementById('themeToggle');
    updateIcon(theme);
    if(btn){
      btn.addEventListener('click', ()=>{
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ahri_theme', next);
        updateIcon(next);
      });
    }
  });
  function updateIcon(theme){
    const btn = document.getElementById('themeToggle');
    if(btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
})();

/* ===== Mobile nav ===== */
window.addEventListener('DOMContentLoaded', ()=>{
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if(ham && nav){
    ham.addEventListener('click', ()=> nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> nav.classList.remove('open')));
  }

  /* mark active nav link */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a=>{
    if(a.getAttribute('href') === path) a.classList.add('active');
  });

  /* scroll reveal */
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.15});
  items.forEach(i=> io.observe(i));

  /* update auth-dependent nav bits */
  refreshAuthUI();
});

function refreshAuthUI(){
  const user = JSON.parse(localStorage.getItem('ahri_current_user') || 'null');
  const slot = document.getElementById('authSlot');
  if(!slot) return;
  if(user){
    slot.innerHTML = `<a href="account.html" class="btn btn-outline">👤 ${user.name.split(' ')[0]}</a>`;
  } else {
    slot.innerHTML = `<a href="login.html" class="btn btn-outline">Log In</a><a href="register.html" class="btn btn-gold">Register</a>`;
  }
}
