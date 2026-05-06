// ─── Admin Dashboard Component ────────────────────────────────────
import { renderCandidatesView }  from './views/candidates.view.js';
import { renderJobsView }        from './views/jobs.view.js';
import { renderRankingView }     from './views/ranking.view.js';
import { renderOverviewView }    from './views/overview.view.js';

export function renderAdmin(state) {
  const user = state.auth.getCurrentUser();
  const name = user?.name || 'Admin';
  const initials = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  return `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="admin-sidebar">
        <div class="sidebar-section-label">Main</div>

        <button class="sidebar-item active" id="nav-overview" onclick="switchAdminTab('overview')">
          ${gridIcon()} Overview
        </button>
        <button class="sidebar-item" id="nav-candidates" onclick="switchAdminTab('candidates')">
          ${usersIcon()} Candidates
          <span class="sidebar-item-badge">${state.candidates.length}</span>
        </button>
        <button class="sidebar-item" id="nav-ranking" onclick="switchAdminTab('ranking')">
          ${trophyIcon()} Rankings
        </button>

        <div class="sidebar-section-label">Jobs</div>
        <button class="sidebar-item" id="nav-jobs" onclick="switchAdminTab('jobs')">
          ${briefcaseIcon()} Job Postings
          <span class="sidebar-item-badge">${state.jobs.length}</span>
        </button>
        <button class="sidebar-item" id="nav-create-job" onclick="switchAdminTab('create-job')">
          ${plusIcon()} Create Job
        </button>

        <div class="sidebar-section-label">Settings</div>
        <button class="sidebar-item" onclick="">
          ${settingsIcon()} Skills & Weights
        </button>

        <div class="sidebar-spacer"></div>

        <div class="sidebar-user-card">
          <div class="sidebar-avatar">${initials}</div>
          <div>
            <div class="sidebar-user-name">${name}</div>
            <div class="sidebar-user-role">Company Admin</div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="admin-content">
        <div id="admin-tab-content">
          ${renderOverviewView(state)}
        </div>
      </main>
    </div>

    <script data-deferred>
      window._adminState = ${JSON.stringify({
        candidates: state.candidates,
        jobs: state.jobs,
      })};

      window.switchAdminTab = function(tab) {
        // Update sidebar active states
        ['overview','candidates','ranking','jobs','create-job'].forEach(t => {
          const el = document.getElementById('nav-' + t);
          if (el) el.classList.remove('active');
        });
        const active = document.getElementById('nav-' + tab);
        if (active) active.classList.add('active');

        // Load view (simplified — in full Angular, use router outlets)
        const outlet = document.getElementById('admin-tab-content');
        const views = {
          'overview':    () => window.renderOverviewHTML(_adminState),
          'candidates':  () => window.renderCandidatesHTML(_adminState),
          'ranking':     () => window.renderRankingHTML(_adminState),
          'jobs':        () => window.renderJobsHTML(_adminState),
          'create-job':  () => window.renderCreateJobHTML(_adminState),
        };
        if (views[tab]) outlet.innerHTML = views[tab]();
      };
    </script>
  `;
}

// ── SVG Icons ─────────────────────────────────────────────────────
export function gridIcon()      { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`; }
export function usersIcon()     { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`; }
export function trophyIcon()    { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="8 8 3 8 3 3 21 3 21 8 16 8"/><path d="M8 8v5a4 4 0 0 0 8 0V8"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/></svg>`; }
export function briefcaseIcon() { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/></svg>`; }
export function plusIcon()      { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`; }
export function settingsIcon()  { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`; }
export function editIcon()      { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`; }
export function trashIcon()     { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`; }
export function eyeIcon()       { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`; }