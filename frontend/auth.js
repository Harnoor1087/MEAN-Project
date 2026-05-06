// ─── Auth Service ─────────────────────────────────────────────────
// Mirrors an Angular service pattern with JWT auth

export class AuthService {
  static #instance = null;
  #API_BASE = 'http://localhost:5000/api'; // Python backend URL
  #TOKEN_KEY = 'airis_jwt';
  #USER_KEY = 'airis_user';

  static getInstance() {
    if (!AuthService.#instance) AuthService.#instance = new AuthService();
    return AuthService.#instance;
  }

  // ── HTTP helpers ────────────────────────────────────────────────
  async #post(endpoint, data, auth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${this.#API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || json.error || 'Request failed');
    return json;
  }

  async #get(endpoint) {
    const token = this.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${this.#API_BASE}${endpoint}`, { headers });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Request failed');
    return json;
  }

  // ── Auth actions ─────────────────────────────────────────────────
  async login(email, password) {
    const data = await this.#post('/auth/login', { email, password });
    if (data.access_token) {
      localStorage.setItem(this.#TOKEN_KEY, data.access_token);
      localStorage.setItem(this.#USER_KEY, JSON.stringify(data.user));
    }
    return data;
  }

  async register(payload) {
    // payload: { name, email, password, role }
    const data = await this.#post('/auth/register', payload);
    return data;
  }

  logout() {
    localStorage.removeItem(this.#TOKEN_KEY);
    localStorage.removeItem(this.#USER_KEY);
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  // ── State ────────────────────────────────────────────────────────
  getToken() {
    return localStorage.getItem(this.#TOKEN_KEY);
  }

  getCurrentUser() {
    const raw = localStorage.getItem(this.#USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch { return false; }
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isUser() {
    const user = this.getCurrentUser();
    return user?.role === 'user' || user?.role === 'candidate';
  }

  // ── Admin API ────────────────────────────────────────────────────
  async getCandidates() {
    return this.#get('/admin/candidates');
  }

  async getJobs() {
    return this.#get('/admin/jobs');
  }

  async createJob(payload) {
    return this.#post('/admin/jobs', payload, true);
  }

  async rankCandidates(jobId) {
    return this.#get(`/admin/rank?job_id=${jobId}`);
  }

  async updateSkillWeight(payload) {
    return this.#post('/admin/skills/weight', payload, true);
  }

  // ── Candidate API ────────────────────────────────────────────────
  async getMyAnalysis() {
    return this.#get('/candidate/analysis');
  }

  async uploadResume(file) {
    const token = this.getToken();
    const form = new FormData();
    form.append('resume', file);
    const res = await fetch(`${this.#API_BASE}/candidate/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Upload failed');
    return json;
  }
}

// ── Mock data for demo (used when backend not available) ─────────────
export const MOCK_CANDIDATES = [
  { id: 1, name: 'Priya Sharma',    email: 'priya@example.com',  job: 'ML Engineer',       final_score: 91, matched: 8, total: 10, status: 'shortlisted', experience: '4 yrs', skills: ['Python','TensorFlow','MLOps','Docker'] },
  { id: 2, name: 'Arjun Mehta',     email: 'arjun@example.com',  job: 'ML Engineer',       final_score: 87, matched: 7, total: 10, status: 'shortlisted', experience: '3 yrs', skills: ['Python','PyTorch','Scikit-learn'] },
  { id: 3, name: 'Sneha Patel',     email: 'sneha@example.com',  job: 'Data Scientist',    final_score: 82, matched: 9, total: 12, status: 'review',       experience: '5 yrs', skills: ['R','Python','Tableau','SQL'] },
  { id: 4, name: 'Rajiv Kumar',     email: 'rajiv@example.com',  job: 'Backend Dev',       final_score: 78, matched: 6, total: 10, status: 'review',       experience: '2 yrs', skills: ['Django','PostgreSQL','REST APIs'] },
  { id: 5, name: 'Meera Singh',     email: 'meera@example.com',  job: 'Data Scientist',    final_score: 74, matched: 7, total: 12, status: 'pending',      experience: '3 yrs', skills: ['Python','Pandas','Power BI'] },
  { id: 6, name: 'Vikram Nair',     email: 'vikram@example.com', job: 'Backend Dev',       final_score: 69, matched: 5, total: 10, status: 'pending',      experience: '1 yr',  skills: ['Flask','MySQL','Git'] },
  { id: 7, name: 'Ananya Roy',      email: 'ananya@example.com', job: 'ML Engineer',       final_score: 65, matched: 5, total: 10, status: 'pending',      experience: '2 yrs', skills: ['Python','Keras','NumPy'] },
  { id: 8, name: 'Kabir Joshi',     email: 'kabir@example.com',  job: 'Data Scientist',    final_score: 59, matched: 4, total: 12, status: 'rejected',     experience: '1 yr',  skills: ['Excel','Python'] },
];

export const MOCK_JOBS = [
  {
    id: 1, title: 'Senior ML Engineer', department: 'AI Research', openings: 2,
    description: 'Build and deploy production ML models for resume intelligence. Work on NLP pipelines, model optimization, and MLOps infrastructure.',
    mandatory_skills: [
      { name: 'Python',     weight: 25 },
      { name: 'TensorFlow', weight: 20 },
      { name: 'MLOps',      weight: 15 },
    ],
    optional_skills: [
      { name: 'Docker',     weight: 10 },
      { name: 'Kubernetes', weight: 10 },
      { name: 'SQL',        weight: 8  },
    ],
    applicants: 24, status: 'active',
  },
  {
    id: 2, title: 'Data Scientist', department: 'Analytics', openings: 1,
    description: 'Analyze candidate datasets, build statistical models, and deliver data-driven hiring insights for company leadership.',
    mandatory_skills: [
      { name: 'Python', weight: 20 },
      { name: 'R',      weight: 15 },
      { name: 'SQL',    weight: 20 },
    ],
    optional_skills: [
      { name: 'Tableau',    weight: 12 },
      { name: 'Power BI',   weight: 10 },
      { name: 'Statistics', weight: 10 },
    ],
    applicants: 18, status: 'active',
  },
  {
    id: 3, title: 'Backend Developer', department: 'Engineering', openings: 3,
    description: 'Design and build Python REST APIs powering the AIRIS platform. Collaborate with frontend and ML teams for seamless integration.',
    mandatory_skills: [
      { name: 'Python',  weight: 20 },
      { name: 'Django',  weight: 20 },
      { name: 'REST API', weight: 15 },
    ],
    optional_skills: [
      { name: 'PostgreSQL', weight: 12 },
      { name: 'Redis',      weight: 10 },
      { name: 'Docker',     weight: 10 },
    ],
    applicants: 31, status: 'active',
  },
];

export const MOCK_MY_ANALYSIS = {
  name: 'Priya Sharma',
  job: 'Senior ML Engineer',
  final_score: 91,
  percentile: 94,
  rank: 1,
  total_applicants: 24,
  skill_scores: [
    { skill: 'Python',     score: 95, weight: 25, matched: true,  mandatory: true  },
    { skill: 'TensorFlow', score: 88, weight: 20, matched: true,  mandatory: true  },
    { skill: 'MLOps',      score: 82, weight: 15, matched: true,  mandatory: true  },
    { skill: 'Docker',     score: 90, weight: 10, matched: true,  mandatory: false },
    { skill: 'Kubernetes', score: 0,  weight: 10, matched: false, mandatory: false },
    { skill: 'SQL',        score: 74, weight: 8,  matched: true,  mandatory: false },
  ],
  monthly_trend: [72, 75, 78, 82, 85, 88, 91],
  gap_analysis: [
    { area: 'Kubernetes', suggestion: 'Complete CKA certification — high demand in job postings.' },
    { area: 'System Design', suggestion: 'Strengthen distributed systems knowledge for senior roles.' },
  ],
};