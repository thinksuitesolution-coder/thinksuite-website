const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001/api'
  : '/api';

function token() { return localStorage.getItem('ts_admin_token'); }
function authHeaders() { return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` }; }

async function api(method, path, body) {
  const opts = { method, headers: authHeaders() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  const data = await res.json();
  if (res.status === 401) { logout(); return; }
  return data;
}

function logout() {
  localStorage.removeItem('ts_admin_token');
  localStorage.removeItem('ts_admin_user');
  window.location.href = 'login.html';
}

function requireAuth() {
  if (!token()) { window.location.href = 'login.html'; return false; }
  const user = JSON.parse(localStorage.getItem('ts_admin_user') || '{}');
  document.getElementById('sidebar-name') && (document.getElementById('sidebar-name').textContent = user.name || 'Admin');
  document.getElementById('sidebar-role') && (document.getElementById('sidebar-role').textContent = user.role || 'Admin');
  document.getElementById('sidebar-avatar') && (document.getElementById('sidebar-avatar').textContent = (user.name||'A')[0].toUpperCase());
  document.getElementById('logout-btn') && document.getElementById('logout-btn').addEventListener('click', logout);
  return true;
}

function fmtDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtAgo(d) {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// UI helpers
const UI = {
  showAlert(msg, type = 'success', containerId = 'alert-container') {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    setTimeout(() => { if (el) el.innerHTML = ''; }, 4000);
  },
  showModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  },
  hideModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }
};

// ─── LOGIN ─────────────────────────────────────────
async function initLogin() {
  if (token()) { window.location.href = 'dashboard.html'; return; }
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');
    btn.textContent = 'Signing in...'; btn.disabled = true;
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('ts_admin_token', data.token);
        localStorage.setItem('ts_admin_user', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
      } else {
        errEl.textContent = data.message || 'Invalid credentials';
      }
    } catch {
      errEl.textContent = 'Cannot connect to server. Make sure backend is running.';
    }
    btn.textContent = 'Sign In'; btn.disabled = false;
  });
}

// ─── DASHBOARD ─────────────────────────────────────
async function initDashboard() {
  if (!requireAuth()) return;
  try {
    const res = await api('GET', '/dashboard/stats');
    if (!res?.success) return;
    const d = res.data;
    document.getElementById('stat-blogs') && (document.getElementById('stat-blogs').textContent = d.blogs);
    document.getElementById('stat-drafts') && (document.getElementById('stat-drafts').textContent = d.drafts + ' drafts');
    document.getElementById('stat-projects') && (document.getElementById('stat-projects').textContent = d.projects);
    document.getElementById('stat-leads-new') && (document.getElementById('stat-leads-new').textContent = d.leads_new);
    document.getElementById('stat-leads-total') && (document.getElementById('stat-leads-total').textContent = d.leads_total + ' total');
    document.getElementById('stat-active-subs') && (document.getElementById('stat-active-subs').textContent = d.active_subs);
    document.getElementById('stat-open-jobs') && (document.getElementById('stat-open-jobs').textContent = d.open_jobs);
    if (d.expiring_subs > 0 && document.getElementById('stat-expiring-badge')) {
      document.getElementById('stat-expiring-badge').textContent = d.expiring_subs + ' expiring';
      document.getElementById('stat-expiring-badge').style.display = 'inline-flex';
    }
    if (d.new_apps > 0 && document.getElementById('stat-apps-badge')) {
      document.getElementById('stat-apps-badge').textContent = d.new_apps + ' new';
      document.getElementById('stat-apps-badge').style.display = 'inline-flex';
    }
  } catch {}
}

// ─── BLOGS ─────────────────────────────────────────
async function initBlogList() {
  if (!requireAuth()) return;
  let currentStatus = '';
  const tbody = document.getElementById('blogs-tbody');
  const searchInput = document.getElementById('blog-search');

  async function load() {
    const res = await api('GET', `/blogs${currentStatus ? '?status=' + currentStatus : ''}`);
    if (!res?.success) return;
    const q = (searchInput?.value || '').toLowerCase();
    const rows = res.data.filter(b => !q || b.title.toLowerCase().includes(q) || (b.category||'').toLowerCase().includes(q));
    if (!rows.length) { tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:40px">No posts found</td></tr>`; return; }
    tbody.innerHTML = rows.map(b => `
      <tr>
        <td><div class="td-primary">${b.title}</div><div class="td-sub">${b.slug}</div></td>
        <td>${b.category || '-'}</td>
        <td>${b.author}</td>
        <td><span class="status-pill status-${b.status}">${b.status}</span></td>
        <td>${b.views}</td>
        <td>${fmtDate(b.published_at || b.created_at)}</td>
        <td><div class="action-btns">
          <a href="blog-editor.html?id=${b.id}" class="action-btn" title="Edit">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
          </a>
          <button class="action-btn action-btn-danger" onclick="ThinkAdmin.deleteBlog(${b.id},'${b.title.replace(/'/g,"\\'")}')">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </button>
        </div></td>
      </tr>`).join('');
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatus = btn.dataset.status || '';
      load();
    });
  });
  searchInput?.addEventListener('input', load);
  load();
}

async function deleteBlog(id, title) {
  if (!confirm(`Delete "${title}"?`)) return;
  const res = await api('DELETE', `/blogs/${id}`);
  if (res?.success) { UI.showAlert('Post deleted'); initBlogList(); }
  else UI.showAlert('Delete failed', 'error');
}

// ─── BLOG EDITOR ───────────────────────────────────
async function initBlogEditor() {
  if (!requireAuth()) return;
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  document.getElementById('page-title').textContent = editId ? 'Edit Post' : 'New Post';

  if (editId) {
    const res = await api('GET', `/blogs/${editId}`);
    if (res?.success) {
      const b = res.data;
      document.getElementById('title').value = b.title || '';
      document.getElementById('excerpt').value = b.excerpt || '';
      document.getElementById('content').value = b.content || '';
      document.getElementById('author').value = b.author || '';
      document.getElementById('category').value = b.category || '';
      document.getElementById('tags').value = b.tags || '';
      document.getElementById('status').value = b.status || 'draft';
      document.getElementById('cover_image').value = b.cover_image || '';
      if (b.cover_image) {
        const img = document.getElementById('img-preview');
        if (img) { img.src = b.cover_image; img.classList.add('show'); }
      }
    }
  }

  document.getElementById('cover_image')?.addEventListener('input', (e) => {
    const img = document.getElementById('img-preview');
    if (!img) return;
    if (e.target.value) { img.src = e.target.value; img.classList.add('show'); }
    else img.classList.remove('show');
  });

  document.getElementById('blog-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      title: document.getElementById('title').value,
      excerpt: document.getElementById('excerpt').value,
      content: document.getElementById('content').value,
      author: document.getElementById('author').value,
      category: document.getElementById('category').value,
      tags: document.getElementById('tags').value,
      status: document.getElementById('status').value,
      cover_image: document.getElementById('cover_image').value
    };
    const res = editId ? await api('PUT', `/blogs/${editId}`, body) : await api('POST', '/blogs', body);
    if (res?.success) {
      UI.showAlert(editId ? 'Post updated!' : 'Post created!');
      setTimeout(() => { window.location.href = 'blogs.html'; }, 1200);
    } else UI.showAlert(res?.message || 'Save failed', 'error');
  });
}

// ─── PROJECTS ──────────────────────────────────────
async function initProjectList() {
  if (!requireAuth()) return;
  let currentStatus = '';
  const tbody = document.getElementById('projects-tbody');
  const searchInput = document.getElementById('project-search');

  async function load() {
    const res = await api('GET', `/projects${currentStatus ? '?status=' + currentStatus : ''}`);
    if (!res?.success) return;
    const q = (searchInput?.value || '').toLowerCase();
    const rows = res.data.filter(p => !q || p.title.toLowerCase().includes(q) || (p.client||'').toLowerCase().includes(q));
    if (!rows.length) { tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:40px">No projects found</td></tr>`; return; }
    tbody.innerHTML = rows.map(p => `
      <tr>
        <td>${p.cover_image ? `<img src="${p.cover_image}" style="width:48px;height:36px;object-fit:cover;border-radius:6px">` : '<div style="width:48px;height:36px;background:rgba(255,255,255,.05);border-radius:6px"></div>'}</td>
        <td><div class="td-primary">${p.title}</div><div class="td-sub">${p.slug}</div></td>
        <td>${p.client || '-'}</td>
        <td>${p.category || '-'}</td>
        <td><span class="status-pill status-${p.status}">${p.status}</span></td>
        <td>${p.year || '-'}</td>
        <td><div class="action-btns">
          <a href="project-editor.html?id=${p.id}" class="action-btn">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
          </a>
          <button class="action-btn action-btn-danger" onclick="ThinkAdmin.deleteProject(${p.id},'${p.title.replace(/'/g,"\\'")}')">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </button>
        </div></td>
      </tr>`).join('');
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatus = btn.dataset.status || '';
      load();
    });
  });
  searchInput?.addEventListener('input', load);
  load();
}

async function deleteProject(id, title) {
  if (!confirm(`Delete "${title}"?`)) return;
  const res = await api('DELETE', `/projects/${id}`);
  if (res?.success) { UI.showAlert('Project deleted'); initProjectList(); }
  else UI.showAlert('Delete failed', 'error');
}

// ─── PROJECT EDITOR ────────────────────────────────
async function initProjectEditor() {
  if (!requireAuth()) return;
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  document.getElementById('page-title').textContent = editId ? 'Edit Project' : 'New Project';

  if (editId) {
    const res = await api('GET', `/projects/${editId}`);
    if (res?.success) {
      const p = res.data;
      document.getElementById('title').value = p.title || '';
      document.getElementById('client').value = p.client || '';
      document.getElementById('category').value = p.category || '';
      document.getElementById('excerpt').value = p.excerpt || '';
      document.getElementById('description').value = p.description || '';
      document.getElementById('cover_image').value = p.cover_image || '';
      document.getElementById('tags').value = p.tags || '';
      document.getElementById('url').value = p.url || '';
      document.getElementById('year').value = p.year || '';
      document.getElementById('status').value = p.status || 'published';
      document.getElementById('featured').checked = !!p.featured;
      document.getElementById('sort_order').value = p.sort_order || 0;
      if (p.cover_image) {
        const img = document.getElementById('img-preview');
        if (img) { img.src = p.cover_image; img.classList.add('show'); }
      }
    }
  }

  document.getElementById('cover_image')?.addEventListener('input', (e) => {
    const img = document.getElementById('img-preview');
    if (!img) return;
    if (e.target.value) { img.src = e.target.value; img.classList.add('show'); }
    else img.classList.remove('show');
  });

  document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      title: document.getElementById('title').value,
      client: document.getElementById('client').value,
      category: document.getElementById('category').value,
      excerpt: document.getElementById('excerpt').value,
      description: document.getElementById('description').value,
      cover_image: document.getElementById('cover_image').value,
      tags: document.getElementById('tags').value,
      url: document.getElementById('url').value,
      year: document.getElementById('year').value,
      status: document.getElementById('status').value,
      featured: document.getElementById('featured').checked,
      sort_order: parseInt(document.getElementById('sort_order').value) || 0
    };
    const res = editId ? await api('PUT', `/projects/${editId}`, body) : await api('POST', '/projects', body);
    if (res?.success) {
      UI.showAlert(editId ? 'Project updated!' : 'Project created!');
      setTimeout(() => { window.location.href = 'projects.html'; }, 1200);
    } else UI.showAlert(res?.message || 'Save failed', 'error');
  });
}

// ─── LEADS ─────────────────────────────────────────
async function initLeadList() {
  if (!requireAuth()) return;
  let currentStatus = '';
  const tbody = document.getElementById('leads-tbody');
  const searchInput = document.getElementById('lead-search');

  async function load() {
    const res = await api('GET', `/leads${currentStatus ? '?status=' + currentStatus : ''}`);
    if (!res?.success) return;
    const q = (searchInput?.value || '').toLowerCase();
    const rows = res.data.filter(l => !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.company||'').toLowerCase().includes(q));
    if (!rows.length) { tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:40px">No leads found</td></tr>`; return; }
    tbody.innerHTML = rows.map(l => `
      <tr onclick="ThinkAdmin.markLeadRead(${l.id})" style="cursor:pointer">
        <td><div class="td-primary">${l.is_read ? '' : '<span class="unread-dot"></span>'}${l.name}</div><div class="td-sub">${l.email}</div></td>
        <td>${l.phone || '-'}</td>
        <td>${l.company || '-'}</td>
        <td>${l.service || '-'}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${(l.message||'').replace(/"/g,'')}">${l.message || '-'}</td>
        <td>
          <select class="app-status-select" onchange="ThinkAdmin.updateLeadStatus(${l.id}, this.value)">
            ${['new','contacted','qualified','converted','lost'].map(s => `<option value="${s}" ${l.status===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </td>
        <td>${fmtDate(l.created_at)}</td>
        <td><div class="action-btns">
          <button class="action-btn action-btn-danger" onclick="event.stopPropagation();ThinkAdmin.deleteLead(${l.id},'${l.name.replace(/'/g,"\\'")}')">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </button>
        </div></td>
      </tr>`).join('');
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatus = btn.dataset.status || '';
      load();
    });
  });
  searchInput?.addEventListener('input', load);
  load();
}

async function markLeadRead(id) {
  await api('PUT', `/leads/${id}/read`);
}

async function updateLeadStatus(id, status) {
  await api('PUT', `/leads/${id}/status`, { status });
}

async function deleteLead(id, name) {
  if (!confirm(`Delete lead from "${name}"?`)) return;
  const res = await api('DELETE', `/leads/${id}`);
  if (res?.success) { UI.showAlert('Lead deleted'); initLeadList(); }
  else UI.showAlert('Delete failed', 'error');
}

// ─── SUBSCRIPTIONS ─────────────────────────────────
function daysChip(days) {
  if (days < 0) return `<span class="days-chip days-expired">Expired</span>`;
  if (days < 7) return `<span class="days-chip days-critical">${days}d left</span>`;
  if (days <= 30) return `<span class="days-chip days-warning">${days}d left</span>`;
  return `<span class="days-chip days-good">${days}d left</span>`;
}

async function initSubscriptionList() {
  if (!requireAuth()) return;
  let currentStatus = '';
  let currentTool = '';
  const tbody = document.getElementById('subs-tbody');
  const searchInput = document.getElementById('sub-search');

  async function loadStats() {
    const res = await api('GET', '/subscriptions/stats');
    if (!res?.success) return;
    const d = res.data;
    document.getElementById('stat-active-subs') && (document.getElementById('stat-active-subs').textContent = d.active);
    document.getElementById('stat-expiring-subs') && (document.getElementById('stat-expiring-subs').textContent = d.expiring);
    document.getElementById('stat-subscribers') && (document.getElementById('stat-subscribers').textContent = d.subscribers);
    document.getElementById('stat-revenue') && (document.getElementById('stat-revenue').textContent = '₹' + Number(d.active_value).toLocaleString('en-IN'));
  }

  async function load() {
    let path = '/subscriptions?x=1';
    if (currentStatus) path += '&status=' + currentStatus;
    if (currentTool) path += '&tool=' + currentTool;
    const res = await api('GET', path);
    if (!res?.success) return;
    const q = (searchInput?.value || '').toLowerCase();
    const rows = res.data.filter(s => !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.company||'').toLowerCase().includes(q));
    if (!rows.length) { tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--gray-500);padding:40px">No subscriptions</td></tr>`; return; }
    tbody.innerHTML = rows.map(s => `
      <tr>
        <td><div class="td-primary">${s.name}</div><div class="td-sub">${s.email}${s.company ? ' · ' + s.company : ''}</div></td>
        <td><span class="tool-badge tool-${s.tool}">${s.tool}</span></td>
        <td>${s.plan}</td>
        <td>${fmtDate(s.start_date)}</td>
        <td>${fmtDate(s.end_date)}<div style="margin-top:3px">${daysChip(s.days_left)}</div></td>
        <td>₹${Number(s.amount).toLocaleString('en-IN')}</td>
        <td><span class="status-pill status-${s.payment_status}">${s.payment_status}</span></td>
        <td><span class="status-pill status-${s.status}">${s.status}</span></td>
        <td><div class="action-btns">
          <a href="subscription-editor.html?id=${s.id}" class="action-btn" title="Edit">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
          </a>
          <button class="action-btn action-btn-danger" onclick="ThinkAdmin.deleteSubscription(${s.id},'${s.name.replace(/'/g,"\\'")}')">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </button>
        </div></td>
      </tr>`).join('');
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatus = btn.dataset.status || '';
      load();
    });
  });
  document.getElementById('tool-filter')?.addEventListener('change', (e) => { currentTool = e.target.value; load(); });
  searchInput?.addEventListener('input', load);
  loadStats();
  load();
}

async function deleteSubscription(id, name) {
  if (!confirm(`Delete subscription for "${name}"?`)) return;
  const res = await api('DELETE', `/subscriptions/${id}`);
  if (res?.success) { UI.showAlert('Subscription deleted'); initSubscriptionList(); }
  else UI.showAlert('Delete failed', 'error');
}

function fillDates(months) {
  const start = new Date();
  const end = new Date(start);
  end.setMonth(end.getMonth() + months);
  const fmt = d => d.toISOString().split('T')[0];
  document.getElementById('start_date') && (document.getElementById('start_date').value = fmt(start));
  document.getElementById('end_date') && (document.getElementById('end_date').value = fmt(end));
  const plan = document.getElementById('plan');
  if (plan) plan.value = months === 1 ? 'monthly' : months === 3 ? 'quarterly' : 'annual';
}

async function initSubscriptionEditor() {
  if (!requireAuth()) return;
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  document.getElementById('page-title').textContent = editId ? 'Edit Subscription' : 'Add Subscription';

  if (editId) {
    const res = await api('GET', `/subscriptions/${editId}`);
    if (res?.success) populateSubForm(res.data);
    document.getElementById('payment-section') && (document.getElementById('payment-section').style.display = 'block');
    loadPaymentHistory(editId);
  } else {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start_date') && (document.getElementById('start_date').value = today);
  }

  document.getElementById('sub-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      name: document.getElementById('sub-name').value,
      email: document.getElementById('sub-email').value,
      phone: document.getElementById('sub-phone').value,
      company: document.getElementById('sub-company').value,
      sub_notes: document.getElementById('sub-notes').value,
      tool: document.getElementById('tool').value,
      plan: document.getElementById('plan').value,
      start_date: document.getElementById('start_date').value,
      end_date: document.getElementById('end_date').value,
      amount: document.getElementById('amount').value,
      currency: 'INR',
      status: document.getElementById('status').value,
      payment_status: document.getElementById('payment_status').value,
      auto_renew: document.getElementById('auto_renew').checked,
      notes: document.getElementById('notes').value
    };
    const res = editId ? await api('PUT', `/subscriptions/${editId}`, body) : await api('POST', '/subscriptions', body);
    if (res?.success) {
      UI.showAlert(editId ? 'Subscription updated!' : 'Subscription created!');
      setTimeout(() => { window.location.href = 'subscriptions.html'; }, 1200);
    } else UI.showAlert(res?.message || 'Save failed', 'error');
  });

  document.getElementById('payment-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!editId) return;
    const body = {
      amount: document.getElementById('pay-amount').value,
      paid_at: document.getElementById('pay-date').value,
      method: document.getElementById('pay-method').value,
      transaction_id: document.getElementById('pay-txn').value,
      notes: document.getElementById('pay-notes').value
    };
    const res = await api('POST', `/subscriptions/${editId}/payment`, body);
    if (res?.success) {
      UI.showAlert('Payment logged!');
      document.getElementById('payment-form').reset();
      loadPaymentHistory(editId);
    } else UI.showAlert('Failed to log payment', 'error');
  });
}

function populateSubForm(d) {
  document.getElementById('sub-name') && (document.getElementById('sub-name').value = d.name || '');
  document.getElementById('sub-email') && (document.getElementById('sub-email').value = d.email || '');
  document.getElementById('sub-phone') && (document.getElementById('sub-phone').value = d.phone || '');
  document.getElementById('sub-company') && (document.getElementById('sub-company').value = d.company || '');
  document.getElementById('sub-notes') && (document.getElementById('sub-notes').value = d.sub_notes || '');
  document.getElementById('tool') && (document.getElementById('tool').value = d.tool || 'ThinkVirtual');
  document.getElementById('plan') && (document.getElementById('plan').value = d.plan || 'monthly');
  document.getElementById('start_date') && (document.getElementById('start_date').value = d.start_date?.split('T')[0] || '');
  document.getElementById('end_date') && (document.getElementById('end_date').value = d.end_date?.split('T')[0] || '');
  document.getElementById('amount') && (document.getElementById('amount').value = d.amount || 0);
  document.getElementById('status') && (document.getElementById('status').value = d.status || 'active');
  document.getElementById('payment_status') && (document.getElementById('payment_status').value = d.payment_status || 'pending');
  document.getElementById('auto_renew') && (document.getElementById('auto_renew').checked = !!d.auto_renew);
  document.getElementById('notes') && (document.getElementById('notes').value = d.notes || '');
}

async function loadPaymentHistory(subId) {
  const res = await api('GET', `/subscriptions/${subId}/payments`);
  const el = document.getElementById('payment-history');
  if (!el) return;
  if (!res?.data?.length) { el.innerHTML = '<p style="color:var(--gray-500);font-size:.8rem">No payments recorded yet</p>'; return; }
  el.innerHTML = res.data.map(p => `
    <div class="payment-row">
      <div><div class="payment-amount">₹${Number(p.amount).toLocaleString('en-IN')}</div><div class="td-sub">${p.method}${p.transaction_id ? ' · ' + p.transaction_id : ''}</div></div>
      <div class="td-sub">${fmtDate(p.paid_at)}</div>
    </div>`).join('');
}

// ─── CAREERS ───────────────────────────────────────
async function initCareersList() {
  if (!requireAuth()) return;
  const tbody = document.getElementById('jobs-tbody');
  let editingId = null;

  async function load() {
    const res = await api('GET', '/careers');
    if (!res?.success) return;
    if (!res.data.length) { tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--gray-500);padding:40px">No job openings. Post your first job!</td></tr>`; return; }
    tbody.innerHTML = res.data.map(j => `
      <tr>
        <td><div class="td-primary">${j.title}</div></td>
        <td>${j.department || '-'}</td>
        <td><span class="badge badge-purple">${j.location}</span></td>
        <td><span class="badge badge-cyan">${j.type}</span></td>
        <td>${j.applications || 0}</td>
        <td><span class="status-pill status-${j.status}">${j.status}</span></td>
        <td>${fmtDate(j.created_at)}</td>
        <td><div class="action-btns">
          <button class="action-btn" onclick="ThinkAdmin.editJob(${j.id})" title="Edit">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
          </button>
          <button class="action-btn" onclick="ThinkAdmin.toggleJobStatus(${j.id},'${j.status}')" title="Toggle status">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          </button>
          <button class="action-btn action-btn-danger" onclick="ThinkAdmin.deleteJob(${j.id},'${j.title.replace(/'/g,"\\'")}')">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </button>
        </div></td>
      </tr>`).join('');
  }

  window.ThinkAdmin.editJob = async (id) => {
    editingId = id;
    const res = await api('GET', `/careers`);
    const job = res?.data?.find(j => j.id === id);
    if (!job) return;
    document.getElementById('job-modal-title').textContent = 'Edit Job';
    document.getElementById('job-edit-id').value = id;
    document.getElementById('job-title').value = job.title;
    document.getElementById('job-dept').value = job.department || '';
    document.getElementById('job-location').value = job.location;
    document.getElementById('job-type').value = job.type;
    document.getElementById('job-salary').value = job.salary_range || '';
    document.getElementById('job-status').value = job.status;
    document.getElementById('job-desc').value = job.description || '';
    document.getElementById('job-req').value = job.requirements || '';
    UI.showModal('job-modal');
  };

  window.ThinkAdmin.toggleJobStatus = async (id, status) => {
    const newStatus = status === 'open' ? 'closed' : 'open';
    const res = await api('GET', '/careers');
    const job = res?.data?.find(j => j.id === id);
    if (!job) return;
    await api('PUT', `/careers/${id}`, { ...job, status: newStatus });
    load();
  };

  window.ThinkAdmin.deleteJob = async (id, title) => {
    if (!confirm(`Delete job "${title}"?`)) return;
    const res = await api('DELETE', `/careers/${id}`);
    if (res?.success) { UI.showAlert('Job deleted'); load(); }
    else UI.showAlert('Delete failed', 'error');
  };

  document.getElementById('new-job-btn')?.addEventListener('click', () => {
    editingId = null;
    document.getElementById('job-modal-title').textContent = 'Post New Job';
    document.getElementById('job-form').reset();
    document.getElementById('job-edit-id').value = '';
    UI.showModal('job-modal');
  });

  document.getElementById('job-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      title: document.getElementById('job-title').value,
      department: document.getElementById('job-dept').value,
      location: document.getElementById('job-location').value,
      type: document.getElementById('job-type').value,
      salary_range: document.getElementById('job-salary').value,
      status: document.getElementById('job-status').value,
      description: document.getElementById('job-desc').value,
      requirements: document.getElementById('job-req').value
    };
    const id = document.getElementById('job-edit-id').value;
    const res = id ? await api('PUT', `/careers/${id}`, body) : await api('POST', '/careers', body);
    if (res?.success) { UI.showAlert(id ? 'Job updated!' : 'Job posted!'); UI.hideModal('job-modal'); load(); }
    else UI.showAlert(res?.message || 'Save failed', 'error');
  });

  load();
}

// ─── APPLICATIONS ──────────────────────────────────
async function initApplicationsList() {
  if (!requireAuth()) return;
  let currentStatus = '';
  const tbody = document.getElementById('apps-tbody');
  const searchInput = document.getElementById('app-search');

  async function load() {
    const res = await api('GET', `/careers/applications/all${currentStatus ? '?status=' + currentStatus : ''}`);
    if (!res?.success) return;
    const q = (searchInput?.value || '').toLowerCase();
    const rows = res.data.filter(a => !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || (a.job_title||'').toLowerCase().includes(q));
    if (!rows.length) { tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--gray-500);padding:40px">No applications yet</td></tr>`; return; }
    tbody.innerHTML = rows.map(a => `
      <tr onclick="ThinkAdmin.markAppRead(${a.id})" style="cursor:pointer">
        <td>
          <div class="td-primary">${a.is_read ? '' : '<span class="unread-dot"></span>'}${a.name}</div>
          <div class="td-sub">${a.email}${a.phone ? ' · ' + a.phone : ''}</div>
          ${a.cover_letter ? `<div class="td-sub" style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.cover_letter}</div>` : ''}
        </td>
        <td>${a.job_title || '-'}</td>
        <td>${a.portfolio_url ? `<a href="${a.portfolio_url}" target="_blank" style="color:var(--cyan-500);text-decoration:underline">View</a>` : '-'}</td>
        <td>
          <select class="app-status-select" onchange="event.stopPropagation();ThinkAdmin.updateAppStatus(${a.id}, this.value)">
            ${['new','screening','interview','offered','rejected'].map(s => `<option value="${s}" ${a.status===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </td>
        <td>${fmtDate(a.created_at)}</td>
        <td><button class="action-btn action-btn-danger" onclick="event.stopPropagation();ThinkAdmin.deleteApplication(${a.id},'${a.name.replace(/'/g,"\\'")}')">
          <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        </button></td>
      </tr>`).join('');
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatus = btn.dataset.status || '';
      load();
    });
  });
  searchInput?.addEventListener('input', load);
  load();
}

async function markAppRead(id) { await api('PUT', `/careers/applications/${id}/read`); }
async function updateAppStatus(id, status) { await api('PUT', `/careers/applications/${id}/status`, { status }); }
async function deleteApplication(id, name) {
  if (!confirm(`Delete application from "${name}"?`)) return;
  const res = await api('DELETE', `/careers/applications/${id}`);
  if (res?.success) { UI.showAlert('Application deleted'); initApplicationsList(); }
  else UI.showAlert('Delete failed', 'error');
}

window.ThinkAdmin = {
  initLogin, initDashboard,
  initBlogList, deleteBlog, initBlogEditor,
  initProjectList, deleteProject, initProjectEditor,
  initLeadList, markLeadRead, updateLeadStatus, deleteLead,
  initSubscriptionList, deleteSubscription, initSubscriptionEditor, fillDates,
  initCareersList, initApplicationsList, markAppRead, updateAppStatus, deleteApplication
};
window.UI = UI;
