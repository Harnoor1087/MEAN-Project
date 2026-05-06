// ─── Login Component ──────────────────────────────────────────────

export function renderLogin({ auth, navigate }) {
  return `
    <div class="auth-layout">
      ${leftPanel('Sign in to continue', 'Track candidates, manage job postings, and access AI-powered hiring analytics.')}
      <div class="auth-panel-right">
        <div class="auth-form-container">
          <div class="auth-form-header">
            <h2 class="auth-form-title">Welcome back</h2>
            <p class="auth-form-subtitle">Sign in to your AIRIS account</p>
          </div>

          <div class="auth-form-card">
            <div id="login-alert" class="hidden"></div>

            <!-- Demo credentials hint -->
            <div class="alert alert-info mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style="font-size:0.8125rem;">
                Demo: <strong>admin@airis.dev</strong> / <strong>admin123</strong> (Admin) &nbsp;|&nbsp;
                <strong>user@airis.dev</strong> / <strong>user123</strong> (Candidate)
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <svg class="input-group-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input class="form-control" id="login-email" type="email" placeholder="you@company.com" autocomplete="email" />
              </div>
            </div>

            <div class="form-group">
              <div class="flex items-center justify-between mb-1">
                <label class="form-label" style="margin-bottom:0">Password</label>
                <a style="font-size:0.75rem;cursor:pointer;">Forgot password?</a>
              </div>
              <div class="input-password-wrap">
                <input class="form-control" id="login-password" type="password" placeholder="Enter your password" autocomplete="current-password" />
                <button class="toggle-password" type="button" onclick="togglePwd('login-password', this)">
                  ${eyeIcon()}
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between mb-6">
              <label class="toggle-wrap" style="font-size:0.875rem;color:var(--text-secondary);">
                <span class="toggle">
                  <input type="checkbox" id="remember-me">
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </span>
                Remember me
              </label>
            </div>

            <button class="btn btn-primary w-full" id="login-btn" style="justify-content:center;" onclick="handleLogin()">
              Sign In
            </button>

            <div class="auth-divider">
              <div class="auth-divider-line"></div>
              <span class="auth-divider-text">OR QUICK ACCESS</span>
              <div class="auth-divider-line"></div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <button class="btn btn-secondary" style="justify-content:center;font-size:0.8125rem;" 
                onclick="quickLogin('admin@airis.dev','admin123')">
                🏢 Admin Demo
              </button>
              <button class="btn btn-secondary" style="justify-content:center;font-size:0.8125rem;" 
                onclick="quickLogin('user@airis.dev','user123')">
                👤 Candidate Demo
              </button>
            </div>
          </div>

          <div class="auth-footer">
            Don't have an account? <a onclick="navigate('/register')">Create account</a>
          </div>
        </div>
      </div>
    </div>

    <script data-deferred>
      window.togglePwd = function(id, btn) {
        const inp = document.getElementById(id);
        if (!inp) return;
        inp.type = inp.type === 'password' ? 'text' : 'password';
      };

      window.quickLogin = function(email, pwd) {
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = pwd;
        handleLogin();
      };

      window.handleLogin = async function() {
        const email = document.getElementById('login-email').value.trim();
        const pwd   = document.getElementById('login-password').value;
        const btn   = document.getElementById('login-btn');
        const alertEl = document.getElementById('login-alert');
        alertEl.className = 'hidden';

        if (!email || !pwd) {
          alertEl.className = 'alert alert-danger mb-4';
          alertEl.innerHTML = '⚠️ Please enter your email and password.';
          return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Signing in…';

        // Mock login for demo — replace with real auth.login() call
        await new Promise(r => setTimeout(r, 900));

        const mockUsers = {
          'admin@airis.dev': { name: 'Admin User', role: 'admin', email: 'admin@airis.dev' },
          'user@airis.dev':  { name: 'Priya Sharma', role: 'user', email: 'user@airis.dev' },
        };

        const mockPasswords = { 'admin@airis.dev': 'admin123', 'user@airis.dev': 'user123' };

        if (mockUsers[email] && mockPasswords[email] === pwd) {
          const user = mockUsers[email];
          const fakeToken = btoa(JSON.stringify({sub: user.email, exp: Math.floor(Date.now()/1000)+86400})) + '.payload.' + btoa(JSON.stringify(user));
          localStorage.setItem('airis_jwt', fakeToken);
          localStorage.setItem('airis_user', JSON.stringify(user));
          window.navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          alertEl.className = 'alert alert-danger mb-4';
          alertEl.innerHTML = '❌ Invalid credentials. Try the demo buttons below.';
          btn.disabled = false;
          btn.innerHTML = 'Sign In';
        }
      };
    </script>
  `;
}

export function leftPanel(heading, desc) {
  return `
    <div class="auth-panel-left">
      <div class="auth-left-top">
        <div class="auth-brand">
          <div class="auth-brand-icon">AI</div>
          <span class="auth-brand-name">AIRIS</span>
        </div>
        <h2 class="auth-left-headline">
          ${heading}<br/><span class="glow">powered by AI</span>
        </h2>
        <p class="auth-left-desc">${desc}</p>
        <ul class="auth-feature-list">
          ${[
            'NLP-powered resume parsing',
            'Weighted skill scoring engine',
            'Real-time candidate ranking',
            'Actionable gap analysis',
            'JWT-secured access control',
          ].map(f => `
            <li class="auth-feature-item">
              <span class="auth-feature-check">✓</span>
              ${f}
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="auth-preview-card">
        <div class="auth-preview-name">Priya Sharma</div>
        <div class="auth-preview-role">Applied: ML Engineer</div>
        <div class="auth-preview-score">91</div>
        <div class="auth-preview-label">AI Role Fit Score · Rank #1 of 24</div>
        <div class="progress-bar mt-2" style="height:4px;">
          <div class="progress-fill success" style="width:91%;background:#34d399;"></div>
        </div>
      </div>
    </div>
  `;
}

function eyeIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}