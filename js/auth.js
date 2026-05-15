// ============================================
// ZYZIRE 0.0.3 — js/auth.js
// ============================================

function authTab(t) {
  const isLogin = t === 'login';
  document.getElementById('tab-login').style.background  = isLogin  ? 'var(--v)' : 'transparent';
  document.getElementById('tab-login').style.color       = isLogin  ? '#fff'     : 'var(--muted)';
  document.getElementById('tab-signup').style.background = !isLogin ? 'var(--v)' : 'transparent';
  document.getElementById('tab-signup').style.color      = !isLogin ? '#fff'     : 'var(--muted)';
  document.getElementById('auth-name-wrap').style.display = isLogin ? 'none' : 'block';
  document.getElementById('tab-login').dataset.mode = t;
  document.getElementById('auth-btn').textContent = isLogin ? 'Sign In' : 'Create Account';
  clearAuthError();
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3500);
}

function clearAuthError() {
  document.getElementById('auth-error').style.display = 'none';
}

function getAccounts() {
  try { return JSON.parse(localStorage.getItem('vos_accounts')) || {}; }
  catch(e) { return {}; }
}

function doLogin() {
  const mode     = document.getElementById('tab-login').dataset.mode || 'login';
  const name     = document.getElementById('auth-name').value.trim();
  const email    = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();

  if (!email || !password)                          { showAuthError('Please fill in all fields'); return; }
  if (!email.includes('@') || !email.includes('.')) { showAuthError('Enter a valid email address'); return; }
  if (password.length < 6)                          { showAuthError('Password must be at least 6 characters'); return; }

  const accounts = getAccounts();

  if (mode === 'signup') {
    if (!name)            { showAuthError('Please enter your name'); return; }
    if (accounts[email])  { showAuthError('Account exists — sign in instead'); return; }
    accounts[email] = { name, password };
    localStorage.setItem('vos_accounts', JSON.stringify(accounts));
    currentUser = { email, name };
  } else {
    if (!accounts[email])                      { showAuthError('No account found — sign up first'); return; }
    if (accounts[email].password !== password) { showAuthError('Incorrect password'); return; }
    currentUser = { email, name: accounts[email].name };
  }

  localStorage.setItem('vos_session', JSON.stringify(currentUser));
  load();
  enterApp();
}

function guestLogin() {
  currentUser = { email: 'guest', name: 'Guest' };
  load();
  enterApp();
}

function enterApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('main-app').style.display    = 'flex';
  document.getElementById('header-username').textContent = currentUser.name || 'User';
  goTab('dashboard');
}

function doLogout() {
  save();
  localStorage.removeItem('vos_session');
  currentUser = null;
  document.getElementById('main-app').style.display    = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  // clear inputs
  ['auth-name','auth-email','auth-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

window.addEventListener('load', () => {
  try {
    const s = JSON.parse(localStorage.getItem('vos_session'));
    if (s && s.email) {
      currentUser = s;
      load();
      enterApp();
      return;
    }
  } catch(e) {}
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('main-app').style.display    = 'none';
});
