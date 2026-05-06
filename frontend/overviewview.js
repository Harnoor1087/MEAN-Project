// ─── Admin Overview View ──────────────────────────────────────────

export function renderOverviewView(state) {
  const { candidates, jobs } = state;
  const shortlisted = candidates.filter(c => c.status === 'shortlisted').length;
  const avgScore = Math.round(candidates.reduce((s,c) => s + c.final_score, 0) / candidates.length);

  return `
    <div>
      <div class="page-header">
        <div class="page-header-top">
          <div>
            <h1 class="page-title">Dashboard Overview</h1>
            <p class="page-subtitle">AI-powered hiring analytics — at a glance</p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Report
            </button>
            <button class="btn btn-primary btn-sm" onclick="switchAdminTab('create-job')">
              + New Job
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid-4 mb-6">
        <div class="stat-card accent">
          <div class="stat-icon accent" style="background:var(--accent-light);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-label">Total Candidates</div>
          <div class="stat-value">${candidates.length}</div>
          <div class="stat-delta">↑ 12 this week</div>
        </div>
        <div class="stat-card success">
          <div class="stat-icon" style="background:var(--success-light);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="1.75"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="stat-label">Shortlisted</div>
          <div class="stat-value">${shortlisted}</div>
          <div class="stat-delta">${Math.round(shortlisted/candidates.length*100)}% acceptance rate</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-icon" style="background:var(--warning-light);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
          </div>
          <div class="stat-label">Active Jobs</div>
          <div class="stat-value">${jobs.filter(j=>j.status==='active').length}</div>
          <div class="stat-delta">${jobs.reduce((s,j)=>s+j.openings,0)} total openings</div>
        </div>
        <div class="stat-card info">
          <div class="stat-icon" style="background:var(--info-light);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--info)" stroke-width="1.75"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div class="stat-label">Avg. Fit Score</div>
          <div class="stat-value">${avgScore}</div>
          <div class="stat-delta">Company benchmark: 75</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px;">

        <!-- Score Distribution Chart -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="font-medium" style="color:var(--text-primary);">Score Distribution</div>
              <div class="text-xs text-muted mt-1">All candidates by fit score range</div>
            </div>
            <select class="form-control form-control-sm" style="width:auto;font-size:0.8rem;">
              <option>All Jobs</option>
              ${jobs.map(j=>`<option>${j.title}</option>`).join('')}
            </select>
          </div>
          ${scoreDistributionChart(candidates)}
        </div>

        <!-- Status Breakdown -->
        <div class="card">
          <div class="font-medium mb-1" style="color:var(--text-primary);">Status Breakdown</div>
          <div class="text-xs text-muted mb-4">Current pipeline</div>
          ${statusDonut(candidates)}
        </div>
      </div>

      <!-- Recent Candidates + Top Jobs -->
      <div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <div class="font-medium" style="color:var(--text-primary);">Recent Applicants</div>
            <button class="btn btn-ghost btn-sm" onclick="switchAdminTab('candidates')">View All →</button>
          </div>
          <div class="table-wrap" style="border-radius:var(--radius-md);">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th><th>Job</th><th>Score</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${candidates.slice(0,5).map(c => `
                  <tr>
                    <td>
                      <div class="flex items-center gap-2">
                        <div class="candidate-avatar">${c.name.slice(0,2).toUpperCase()}</div>
                        <div>
                          <div class="text-sm font-medium">${c.name}</div>
                          <div class="text-xs text-muted">${c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td class="text-sm text-secondary">${c.job}</td>
                    <td>
                      <span class="score-pill ${scoreClass(c.final_score)}">${c.final_score}</span>
                    </td>
                    <td>
                      <span class="badge badge-${statusBadge(c.status)}">${c.status}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <div class="font-medium" style="color:var(--text-primary);">Active Jobs</div>
            <button class="btn btn-ghost btn-sm" onclick="switchAdminTab('jobs')">Manage →</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${jobs.map(j => `
              <div style="display:flex;align-items:center;gap:12px;padding:10px;background:var(--bg-muted);border-radius:var(--radius-md);">
                <div style="width:36px;height:36px;background:var(--accent-light);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                </div>
                <div style="flex:1;min-width:0;">
                  <div class="text-sm font-medium truncate">${j.title}</div>
                  <div class="text-xs text-muted">${j.applicants} applicants · ${j.openings} openings</div>
                </div>
                <span class="badge badge-success">${j.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Register as global for tab switching
if (typeof window !== 'undefined') {
  window.renderOverviewHTML = (state) => renderOverviewView(state);
}

function scoreDistributionChart(candidates) {
  const ranges = [
    { label: '90-100', min: 90, max: 101, color: 'var(--success)' },
    { label: '80-89',  min: 80, max: 90,  color: 'var(--accent)'  },
    { label: '70-79',  min: 70, max: 80,  color: 'var(--warning)' },
    { label: '60-69',  min: 60, max: 70,  color: '#f97316'        },
    { label: '<60',    min: 0,  max: 60,  color: 'var(--danger)'  },
  ];
  const max = Math.max(...ranges.map(r => candidates.filter(c => c.final_score >= r.min && c.final_score < r.max).length)) || 1;

  return `
    <div style="display:flex;align-items:flex-end;gap:16px;height:120px;margin-bottom:16px;">
      ${ranges.map(r => {
        const count = candidates.filter(c => c.final_score >= r.min && c.final_score < r.max).length;
        const pct = Math.round((count / max) * 100);
        return `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;">
            <div style="margin-top:auto;font-size:0.7rem;color:var(--text-muted);font-weight:600;">${count}</div>
            <div style="width:100%;height:${Math.max(pct,4)}%;background:${r.color};border-radius:4px 4px 0 0;opacity:0.82;transition:height 0.5s;"></div>
            <div style="font-size:0.7rem;color:var(--text-muted);white-space:nowrap;">${r.label}</div>
          </div>
        `;
      }).join('')}
    </div>
    <div class="flex items-center gap-4">
      ${ranges.map(r => `
        <div class="flex items-center gap-1">
          <div style="width:8px;height:8px;background:${r.color};border-radius:2px;opacity:0.8;"></div>
          <span class="text-xs text-muted">${r.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function statusDonut(candidates) {
  const statuses = [
    { key: 'shortlisted', label: 'Shortlisted', color: 'var(--success)' },
    { key: 'review',      label: 'In Review',   color: 'var(--accent)'  },
    { key: 'pending',     label: 'Pending',      color: 'var(--warning)' },
    { key: 'rejected',    label: 'Rejected',     color: 'var(--danger)'  },
  ];
  const total = candidates.length;

  return `
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${statuses.map(s => {
        const count = candidates.filter(c => c.status === s.key).length;
        const pct = Math.round(count/total*100);
        return `
          <div>
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <div style="width:8px;height:8px;border-radius:2px;background:${s.color};"></div>
                <span class="text-sm" style="color:var(--text-secondary);">${s.label}</span>
              </div>
              <span class="text-sm font-medium">${count} <span class="text-muted">(${pct}%)</span></span>
            </div>
            <div class="progress-bar" style="height:5px;">
              <div class="progress-fill" style="width:${pct}%;background:${s.color};"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function scoreClass(score) {
  if (score >= 85) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'average';
  return 'poor';
}

function statusBadge(status) {
  const map = { shortlisted: 'success', review: 'accent', pending: 'warning', rejected: 'danger' };
  return map[status] || 'muted';
}