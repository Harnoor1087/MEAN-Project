// ─── AIRIS Angular App ────────────────────────────────────────────
// Single-Page Application with Angular-style component architecture

import { AuthService, MOCK_CANDIDATES, MOCK_JOBS, MOCK_MY_ANALYSIS } from './services/auth.service.js';
import { renderHome }      from './components/home/home.component.js';
import { renderLogin }     from './components/login/login.component.js';
import { renderRegister }  from './components/register/register.component.js';
import { renderAdmin }     from './components/admin/admin.component.js';
import { renderCandidate } from './components/candidate/candidate.component.js';

const auth = AuthService.getInstance();

// ── Theme ───────────────────────────────────────────────────────────
const savedTheme = localStorage.getItem('airis_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('airis_theme', next);
  document.querySelectorAll('[data-theme-icon]').forEach(el => {
    el.innerHTML = next === 'dark' ? sunIcon() : moonIcon();
  });
}
window.toggleTheme = toggleTheme;

// ── Router ───────────────────────────────────────────────────────────
const routes = {
  '/':          () => renderHome(appState),
  '/login':     () => renderLogin(appState),
  '/register':  () => renderRegister(appState),
  '/admin':     () => auth.isLoggedIn() && auth.isAdmin()  ? renderAdmin(appState)     : navigate('/login'),
  '/dashboard': () => auth.isLoggedIn() && auth.isUser()   ? renderCandidate(appState) : navigate('/login'),
};

export function navigate(path) {
  window.history.pushState({}, '', path);
  render();
}
window.navigate = navigate;

window.addEventListener('popstate', render);
window.addEventListener('auth:logout', () => navigate('/'));

// ── App State ─────────────────────────────────────────────────────
const appState = {
  auth,
  navigate,
  theme: savedTheme,
  // mock data for demo
  candidates: MOCK_CANDIDATES,
  jobs: MOCK_JOBS,
  myAnalysis: MOCK_MY_ANALYSIS,
};

// ── Root Render ───────────────────────────────────────────────────
function render() {
  const path = window.location.pathname;
  const outlet = document.getElementById('app-outlet');
  if (!outlet) return;

  const renderer = routes[path] || routes['/'];
  const content = renderer();
  outlet.innerHTML = content || '';
  attachNavbarEvents();

  // Run any deferred scripts
  outlet.querySelectorAll('script[data-deferred]').forEach(s => {
    const fn = new Function(s.textContent);
    try { fn(); } catch(e) { console.error(e); }
  });
}

// ── Navbar HTML ───────────────────────────────────────────────────
function buildNavbar() {
  const user = auth.getCurrentUser();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const path = window.location.pathname;

  const navLinks = user ? (
    auth.isAdmin() ? `
      <li><button class="nav-link ${path==='/admin'?'active':''}" onclick="navigate('/admin')">
        ${dashIcon()} Dashboard
      </button></li>
    ` : `
      <li><button class="nav-link ${path==='/dashboard'?'active':''}" onclick="navigate('/dashboard')">
        ${chartIcon()} My Analysis
      </button></li>
    `
  ) : `
    <li><button class="nav-link ${path==='/'?'active':''}" onclick="navigate('/')">Home</button></li>
    <li><button class="nav-link ${path==='/login'?'active':''}" onclick="navigate('/login')">Sign In</button></li>
    <li><button class="nav-link ${path==='/register'?'active':''}" onclick="navigate('/register')">Register</button></li>
  `;

  const userMenu = user ? `
    <div class="dropdown" id="user-dropdown">
      <div class="user-avatar" onclick="toggleDropdown()" title="${user.name}">
        ${user.name.slice(0,2).toUpperCase()}
      </div>
      <div class="dropdown-menu hidden" id="dropdown-menu">
        <div class="dropdown-user-info">
          <div class="dropdown-user-name">${user.name}</div>
          <div class="dropdown-user-role">${user.role === 'admin' ? 'Company Admin' : 'Candidate'}</div>
        </div>
        ${auth.isAdmin() ? `<button class="dropdown-item" onclick="navigate('/admin')">
          ${dashIcon()} Admin Dashboard
        </button>` : `<button class="dropdown-item" onclick="navigate('/dashboard')">
          ${chartIcon()} My Analysis
        </button>`}
        <div class="dropdown-divider"></div>
        <button class="dropdown-item danger" onclick="handleLogout()">
          ${logoutIcon()} Sign Out
        </button>
      </div>
    </div>
  ` : `
    <button class="btn btn-primary btn-sm" onclick="navigate('/login')">Sign In</button>
  `;

  return `
    <nav class="navbar">
      <div class="navbar-inner">
        <a class="navbar-brand" onclick="navigate('/')" style="cursor:pointer">
          <div class="brand-icon">AI</div>
          <span class="brand-name">AIRIS</span>
          <span class="brand-badge">v2.0</span>
        </a>
        <ul class="navbar-nav">${navLinks}</ul>
        <div class="navbar-actions">
          <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">
            <span data-theme-icon>${isDark ? sunIcon() : moonIcon()}</span>
          </button>
          ${userMenu}
        </div>
      </div>
    </nav>
  `;
}

function attachNavbarEvents() {
  window.toggleDropdown = function() {
    const menu = document.getElementById('dropdown-menu');
    if (menu) menu.classList.toggle('hidden');
  };
  window.handleLogout = function() {
    auth.logout();
    navigate('/');
  };
  document.addEventListener('click', function(e) {
    const dd = document.getElementById('user-dropdown');
    if (dd && !dd.contains(e.target)) {
      const menu = document.getElementById('dropdown-menu');
      if (menu) menu.classList.add('hidden');
    }
  }, { once: true });
}

// ── Icons ─────────────────────────────────────────────────────────
export function moonIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}
export function sunIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
}
export function dashIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
}
export function chartIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
}
export function logoutIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`;
}
export { buildNavbar };

// ── Bootstrap app ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('app-root');
  if (!root) return;

  // Inject CSS links
  ['assets/styles/global.css',
   'app/components/navbar/navbar.css',
   'app/components/navbar/sidebar.css',
   'app/components/home/home.css',
   'app/components/login/auth.css',
   'app/components/admin/admin.css',
   'app/components/candidate/candidate.css',
  ].forEach(href => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = href;
      document.head.appendChild(link);
    }
  });

  root.innerHTML = `
    ${buildNavbar()}
    <main id="app-outlet"></main>
  `;
  render();
});