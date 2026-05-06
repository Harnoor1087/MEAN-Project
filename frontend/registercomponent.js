// ─── Register Component ───────────────────────────────────────────
import { leftPanel } from '../login/login.component.js';

export function renderRegister({ auth, navigate }) {
  return `
    <div class="auth-layout">
      ${leftPanel('Create your account', 'Join AIRIS to get AI-powered hiring analytics or track your candidate performance.')}
      <div class="auth-panel-right">
        <div class="auth-form-container" style="max-width:460px;">
          <div class="auth-form-header">
            <h2 class="auth-form-title">Create account</h2>
            <p class="auth-form-subtitle">Get started with AIRIS — free forever</p>
          </div>

          <div class="auth-form-card">
            <div id="reg-alert" class="hidden"></div>

            <!-- Role Selection -->
            <div class="form-group">
              <label class="form-label">I am a</label>
              <div class="auth-role-select">
                <div class="auth-role-btn selected" id="role-user" onclick="selectRole('user')">
                  <span class="role-emoji">👤</span>
                  <span class="role-label">Candidate</span>
                </div>
                <div class="auth-role-btn" id="role-admin" onclick="selectRole('admin')">
                  <span class="role-emoji">🏢</span>
                  <span class="role-label">Company Admin</span>
                </div>
              </div>
              <input type="hidden" id="reg-role" value="user" />
            </div>

            <div class="grid-2" style="gap:12px;">
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">First Name</label>
                <input class="form-control" id="reg-fname" type="text" placeholder="Priya" />
              </div>
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">Last Name</label>
                <input class="form-control" id="reg-lname" type="text" placeholder="Sharma" />
              </div>
            </div>

            <div class="form-group" style="margin-top:16px;">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <svg class="input-group-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input class="form-control" id="reg-email" type="email" placeholder="you@company.com" />
              </div>
            </div>

            <div id="reg-company-field" class="form-group hidden">
              <label class="form-label">Company Name</label>
              <input class="form-control" id="reg-company" type="text" placeholder="Acme Technologies Pvt. Ltd." />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-password-wrap">
                <input class="form-control" id="reg-password" type="password" placeholder="Min. 8 characters" oninput="checkPasswordStrength(this.value)" />
                <button class="toggle-password" type="button" onclick="togglePwd('reg-password')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <div class="password-strength" id="pwd-strength">
                <div class="ps-bar" id="ps1"></div>
                <div class="ps-bar" id="ps2"></div>
                <div class="ps-bar" id="ps3"></div>
                <div class="ps-bar" id="ps4"></div>
              </div>
              <div class="form-hint" id="pwd-hint">Use 8+ chars with numbers & symbols</div>
            </div>

            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <div class="input-password-wrap">
                <input class="form-control" id="reg-confirm" type="password" placeholder="Repeat password" />
                <button class="toggle-password" type="button" onclick="togglePwd('reg-confirm')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <label class="flex items-start gap-2 mb-6" style="font-size:0.8125rem;color:var(--text-secondary);cursor:pointer;">
              <input type="checkbox" id="reg-terms" style="margin-top:3px;accent-color:var(--accent);">
              I agree to the <a>Terms of Service</a> and <a>Privacy Policy</a>
            </label>

            <button class="btn btn-primary w-full" id="reg-btn" style="justify-content:center;" onclick="handleRegister()">
              Create Account
            </button>
          </div>

          <div class="auth-footer">
            Already have an account? <a onclick="navigate('/login')">Sign in</a>
          </div>
        </div>
      </div>
    </div>

    <script data-deferred>
      let selectedRole = 'user';

      window.selectRole = function(role) {
        selectedRole = role;
        document.getElementById('reg-role').value = role;
        document.getElementById('role-user').classList.toggle('selected', role === 'user');
        document.getElementById('role-admin').classList.toggle('selected', role === 'admin');
        const companyField = document.getElementById('reg-company-field');
        if (role === 'admin') companyField.classList.remove('hidden');
        else companyField.classList.add('hidden');
      };

      window.togglePwd = function(id) {
        const inp = document.getElementById(id);
        if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
      };

      window.checkPasswordStrength = function(pwd) {
        const bars = [document.getElementById('ps1'),document.getElementById('ps2'),
                      document.getElementById('ps3'),document.getElementById('ps4')];
        const hint = document.getElementById('pwd-hint');
        bars.forEach(b => { b.className = 'ps-bar'; });

        let score = 0;
        if (pwd.length >= 8)  score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        const cls = score <= 1 ? 'weak' : score <= 2 ? 'medium' : score <= 3 ? 'medium' : 'strong';
        const labels = ['','Weak','Fair','Good','Strong'];
        for (let i = 0; i < score; i++) bars[i].classList.add(cls);
        hint.textContent = score > 0 ? labels[score] + ' password' : 'Use 8+ chars with numbers & symbols';
        hint.style.color = cls === 'weak' ? 'var(--danger)' : cls === 'medium' ? 'var(--warning)' : 'var(--success)';
      };

      window.handleRegister = async function() {
        const fname = document.getElementById('reg-fname').value.trim();
        const lname = document.getElementById('reg-lname').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pwd   = document.getElementById('reg-password').value;
        const conf  = document.getElementById('reg-confirm').value;
        const terms = document.getElementById('reg-terms').checked;
        const btn   = document.getElementById('reg-btn');
        const alert = document.getElementById('reg-alert');
        alert.className = 'hidden';

        if (!fname || !lname) { showError('Please enter your full name.'); return; }
        if (!email)           { showError('Please enter your email address.'); return; }
        if (pwd.length < 8)   { showError('Password must be at least 8 characters.'); return; }
        if (pwd !== conf)     { showError('Passwords do not match.'); return; }
        if (!terms)           { showError('Please accept the Terms of Service.'); return; }

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Creating account…';

        await new Promise(r => setTimeout(r, 1000));

        // Mock registration — in production, call auth.register()
        const user = { name: fname + ' ' + lname, role: selectedRole, email };
        const fakeToken = btoa(JSON.stringify({sub: email, exp: Math.floor(Date.now()/1000)+86400})) + '.payload.' + btoa(JSON.stringify(user));
        localStorage.setItem('airis_jwt', fakeToken);
        localStorage.setItem('airis_user', JSON.stringify(user));

        window.navigate(selectedRole === 'admin' ? '/admin' : '/dashboard');
      };

      function showError(msg) {
        const el = document.getElementById('reg-alert');
        el.className = 'alert alert-danger mb-4';
        el.innerHTML = '⚠️ ' + msg;
      }
    </script>
  `;
}