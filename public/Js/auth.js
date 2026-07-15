/* =====================================================================
   Accounts — talks to your MongoDB-backed API (see /backend) when
   js/api-config.js has been set up. Falls back to saving in this
   browser only (localStorage) so the site still works before then.
   ===================================================================== */

function showMsg(el, text, type){
  el.textContent = text;
  el.className = 'form-msg show ' + type;
}
function setCurrentUser(u){
  localStorage.setItem('ahri_current_user', JSON.stringify(u));
}

/* -------- local fallback helpers -------- */
function getLocalUsers(){ return JSON.parse(localStorage.getItem('ahri_users') || '[]'); }
function saveLocalUsers(list){ localStorage.setItem('ahri_users', JSON.stringify(list)); }

async function apiRegister(name, email, phone, password){
  if(window.apiReady()){
    try{
      const res = await fetch(`${window.API_BASE}/auth/register`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({name, email, phone, password})
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'Registration failed.');
      return data.user;
    }catch(err){
      if(err instanceof TypeError){ // network/server unreachable — fall back below
        console.warn('API unreachable, saving locally instead:', err);
      } else {
        throw err; // a real error from the server (e.g. duplicate email)
      }
    }
  }
  // fallback
  const users = getLocalUsers();
  if(users.some(u=>u.email === email)) throw new Error('An account with this email already exists. Try logging in instead.');
  if(password.length < 4) throw new Error('Password must be at least 4 characters.');
  users.push({name, email, phone, password});
  saveLocalUsers(users);
  return {name, email, phone};
}

async function apiLogin(email, password){
  if(window.apiReady()){
    try{
      const res = await fetch(`${window.API_BASE}/auth/login`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({email, password})
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'Login failed.');
      return data.user;
    }catch(err){
      if(err instanceof TypeError){
        console.warn('API unreachable, checking local accounts instead:', err);
      } else {
        throw err;
      }
    }
  }
  // fallback
  const users = getLocalUsers();
  const found = users.find(u=> u.email === email && u.password === password);
  if(!found) throw new Error('No matching account found. Check your details or register below.');
  return {name: found.name, email: found.email, phone: found.phone};
}

window.addEventListener('DOMContentLoaded', ()=>{
  /* -------- Register -------- */
  const regForm = document.getElementById('registerForm');
  if(regForm){
    regForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const msg = document.getElementById('regMsg');
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const phone = document.getElementById('regPhone').value.trim();
      const password = document.getElementById('regPassword').value;

      if(!name || !email || password.length < 4){
        showMsg(msg, 'Please fill all fields — password must be at least 4 characters.', 'err');
        return;
      }
      try{
        const user = await apiRegister(name, email, phone, password);
        setCurrentUser(user);
        showMsg(msg, 'Account created! Redirecting to your account…', 'ok');
        setTimeout(()=> location.href = 'account.html', 900);
      }catch(err){
        showMsg(msg, err.message, 'err');
      }
    });
  }

  /* -------- Login -------- */
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const msg = document.getElementById('loginMsg');
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      try{
        const user = await apiLogin(email, password);
        setCurrentUser(user);
        showMsg(msg, 'Welcome back! Redirecting…', 'ok');
        setTimeout(()=> location.href = 'account.html', 700);
      }catch(err){
        showMsg(msg, err.message, 'err');
      }
    });
  }

  /* -------- Account page -------- */
  const accBox = document.getElementById('accountBox');
  if(accBox){
    const user = JSON.parse(localStorage.getItem('ahri_current_user') || 'null');
    if(!user){
      location.href = 'login.html';
    } else {
      document.getElementById('accName').textContent = user.name;
      document.getElementById('accEmail').textContent = user.email;
      document.getElementById('accPhone').textContent = user.phone || '—';
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn){
      logoutBtn.addEventListener('click', ()=>{
        localStorage.removeItem('ahri_current_user');
        location.href = 'index.html';
      });
    }
  }
});
