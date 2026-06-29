/* ============================================================
   THINKSUITE ADMIN PANEL — JAVASCRIPT
   ============================================================ */

const API = '/api';

/* ============================================================
   AUTH UTILITIES
   ============================================================ */
const Auth = {
  getToken: () => localStorage.getItem('ts_admin_token'),
  getUser:  () => { try { return JSON.parse(localStorage.getItem('ts_admin_user')); } catch { return null; } },
  logout: () => { localStorage.removeItem('ts_admin_token'); localStorage.removeItem('ts_admin_user'); window.location.href = '/admin/login.html'; },
  headers: () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${Auth.getToken()}` }),
  requireAuth: () => {
    if (!Auth.getToken()) { window.location.href = '/admin/login.html'; return false; }
    return true;
  }
};

/* ============================================================
   API UTILITY
   ============================================================ */
const Api = {
  get: async (path) => {
    const res = await fetch(API + path, { headers: Auth.headers() });
    if (res.status === 401) { Auth.logout(); return null; }
    return res.json();
  },
  post: async (path, body) => {
    const res = await fetch(API + path, { method: 'POST', headers: Auth.headers(), body: JSON.stringify(body) });
    if (res.status === 401) { Auth.logout(); return null; }
    return res.json();
  },
  postForm: async (path, formData) => {
    const token = Auth.getToken();
    const res = await fetch(API + path, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    if (res.status === 401) { Auth.logout(); return null; }
    return res.json();
  },
  put: async (path, body) => {
    const res = await fetch(API + path, { method: 'PUT', headers: Auth.headers(), body: JSON.stringify(body) });
    if (res.status === 401) { Auth.logout(); return null; }
    return res.json();
  },
  putForm: async (path, formData) => {
    const token = Auth.getToken();
    const res = await fetch(API + path, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    if (res.status === 401) { Auth.logout(); return null; }
    return res.json();
  },
  delete: async (path) => {
    const res = await fetch(API + path, { method: 'DELETE', headers: Auth.headers() });
    if (res.status === 401) { Auth.logout(); return null; }
    return res.json();
  }
};

/* ============================================================
   UI UTILITIES
   ============================================================ */
const UI = {
  showAlert: (msg, type = 'success', containerId = 'alert-container') => {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `<div class="alert ${type}">${type === 'success' ? '✅' : '❌'} ${msg}</div>`;
    setTimeout(() => { el.innerHTML = ''; }, 4000);
  },
  showModal: (id) => { document.getElementById(id)?.classList.add('open'); },
  hideModal: (id) => { document.getElementById(id)?.classList.remove('open'); },
  formatDate: (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
  truncate: (str, n = 60) => str && str.length > n ? str.slice(0, n) + '…' : (str || ''),
  setLoading: (btn, loading, text = 'Saving…', original = 'Save') => {
    if (loading) { btn.disabled = true; btn.textContent = text; }
    else { btn.disabled = false; btn.textContent = original; }
  }
};

/* ============================================================
   SIDEBAR INIT
   ============================================================ */
function initSidebar() {
  const user = Auth.getUser();
  const nameEl = document.getElementById('sidebar-name');
  const roleEl = document.getElementById('sidebar-role');
  const avatarEl = document.getElementById('sidebar-avatar');
  if (user) {
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role === 'super_admin' ? 'Super Admin' : 'Editor';
    if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
  }

  // Active link
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.getAttribute('href') === path || path.includes(link.getAttribute('href')?.split('/').pop().split('.')[0])) {
      link.classList.add('active');
    }
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    if (confirm('Sign out of admin panel?')) Auth.logout();
  });
}

/* ============================================================
   DASHBOARD
   ============================================================ */
async function initDashboard() {
  if (!Auth.requireAuth()) return;
  initSidebar();

  try {
    const data = await Api.get('/dashboard/stats');
    if (!data?.success) return;
    const s = data.data;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('stat-blogs', s.blogs || 0);
    set('stat-pub-blogs', s.published_blogs || 0);
    set('stat-projects', s.projects || 0);
    set('stat-messages', s.messages || 0);
    set('stat-leads', s.leads || 0);
    if (s.unread > 0) {
      const badge = document.getElementById('stat-unread-badge');
      if (badge) badge.textContent = `${s.unread} Unread`;
    }
    if (s.leads > 0) {
      const badge = document.getElementById('stat-leads-badge');
      if (badge) badge.textContent = `${s.leads} New`;
    }
  } catch (err) { console.error('Dashboard stats error:', err); }
}

/* ============================================================
   BLOG MANAGER
   ============================================================ */
async function initBlogList() {
  if (!Auth.requireAuth()) return;
  initSidebar();

  const tbody = document.getElementById('blogs-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--gray-500);padding:40px">Loading…</td></tr>';

  try {
    const data = await Api.get('/blogs/all');
    if (!data?.success) return;

    if (data.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">📝</div><div class="empty-title">No blog posts yet</div><div class="empty-text">Create your first insight to get started.</div></div></td></tr>';
      return;
    }

    tbody.innerHTML = data.data.map(blog => `
      <tr>
        <td class="td-title">${UI.truncate(blog.title, 55)}<div class="meta">${blog.slug}</div></td>
        <td>${blog.category || '—'}</td>
        <td><span class="status-pill ${blog.status}">${blog.status}</span></td>
        <td>${blog.views || 0}</td>
        <td>${UI.formatDate(blog.published_at || blog.created_at)}</td>
        <td>
          <div class="action-btns">
            <a href="/admin/blog-editor.html?id=${blog.id}" class="action-btn edit" title="Edit">✏️</a>
            <a href="/blog/${blog.slug}" target="_blank" class="action-btn view" title="View">👁️</a>
            <button class="action-btn delete" onclick="deleteBlog(${blog.id}, '${blog.title.replace(/'/g, "\\'")}')" title="Delete">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--red-500)">Failed to load posts.</td></tr>';
  }

  // Search
  document.getElementById('blog-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    tbody.querySelectorAll('tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

async function deleteBlog(id, title) {
  if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
  try {
    const data = await Api.delete(`/blogs/${id}`);
    if (data?.success) { UI.showAlert('Post deleted successfully.'); await initBlogList(); }
    else UI.showAlert(data?.message || 'Delete failed.', 'error');
  } catch (err) { UI.showAlert('Delete failed.', 'error'); }
}

/* ============================================================
   BLOG EDITOR
   ============================================================ */
async function initBlogEditor() {
  if (!Auth.requireAuth()) return;
  initSidebar();

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  const form = document.getElementById('blog-form');
  if (!form) return;

  if (editId) {
    document.getElementById('editor-page-title').textContent = 'Edit Post';
    try {
      const res = await fetch(`/api/blogs/${await getBlogSlugById(editId)}`);
      const { data } = await res.json();
      if (data) populateBlogForm(data);
    } catch (err) { console.error('Failed to load post:', err); }
  }

  // Image preview
  const imageInput = document.getElementById('image');
  const previewEl = document.getElementById('image-preview');
  if (imageInput) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewEl.innerHTML = `<div class="image-preview"><img src="${e.target.result}" alt="Preview"><div class="image-preview-remove" onclick="clearImage()">×</div></div>`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Slug auto-generate
  const titleInput = document.getElementById('title');
  const slugInput  = document.getElementById('slug');
  if (titleInput && slugInput && !editId) {
    titleInput.addEventListener('input', () => {
      slugInput.value = titleInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    });
  }

  // Char counters
  const metaDesc = document.getElementById('meta_description');
  const metaCounter = document.getElementById('meta-desc-count');
  if (metaDesc && metaCounter) {
    metaDesc.addEventListener('input', () => { metaCounter.textContent = metaDesc.value.length + '/160'; });
  }

  // Simple toolbar
  initEditorToolbar();

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-btn');
    UI.setLoading(btn, true, 'Saving…', 'Save Post');

    const formData = new FormData(form);
    const isPublish = document.getElementById('publish-toggle')?.checked;
    formData.set('status', isPublish ? 'published' : 'draft');
    formData.set('content', document.getElementById('content-area').value);

    try {
      let data;
      if (editId) {
        data = await Api.putForm(`/blogs/${editId}`, formData);
      } else {
        data = await Api.postForm('/blogs', formData);
      }
      if (data?.success) {
        UI.showAlert(editId ? 'Post updated successfully!' : 'Post created successfully!');
        if (!editId) setTimeout(() => { window.location.href = '/admin/blogs.html'; }, 1500);
      } else {
        UI.showAlert(data?.message || 'Save failed.', 'error');
      }
    } catch (err) { UI.showAlert('Save failed. Please try again.', 'error'); }
    finally { UI.setLoading(btn, false, 'Saving…', 'Save Post'); }
  });
}

async function getBlogSlugById(id) {
  const data = await Api.get('/blogs/all');
  const blog = data?.data?.find(b => b.id == id);
  return blog?.slug;
}

function populateBlogForm(data) {
  const fields = ['title', 'slug', 'excerpt', 'category', 'tags', 'meta_title', 'meta_description', 'meta_keywords', 'read_time'];
  fields.forEach(f => { const el = document.getElementById(f); if (el) el.value = data[f] || ''; });
  const contentArea = document.getElementById('content-area');
  if (contentArea) contentArea.value = data.content || '';
  const publishToggle = document.getElementById('publish-toggle');
  if (publishToggle) publishToggle.checked = data.status === 'published';
  if (data.image) {
    const previewEl = document.getElementById('image-preview');
    if (previewEl) previewEl.innerHTML = `<div class="image-preview"><img src="${data.image}" alt="Current image"><div class="image-preview-remove" onclick="clearImage()">×</div></div>`;
  }
}

function clearImage() {
  document.getElementById('image-preview').innerHTML = '';
  document.getElementById('image').value = '';
}

function initEditorToolbar() {
  const textarea = document.getElementById('content-area');
  if (!textarea) return;

  const wrapSelection = (before, after) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    textarea.value = textarea.value.substring(0, start) + before + selected + after + textarea.value.substring(end);
    textarea.focus();
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
  };

  const insertAtCursor = (text) => {
    const start = textarea.selectionStart;
    textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(start);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
  };

  document.getElementById('tb-h2')?.addEventListener('click', () => insertAtCursor('\n<h2></h2>\n'));
  document.getElementById('tb-h3')?.addEventListener('click', () => insertAtCursor('\n<h3></h3>\n'));
  document.getElementById('tb-bold')?.addEventListener('click', () => wrapSelection('<strong>', '</strong>'));
  document.getElementById('tb-italic')?.addEventListener('click', () => wrapSelection('<em>', '</em>'));
  document.getElementById('tb-link')?.addEventListener('click', () => { const url = prompt('URL:'); if (url) wrapSelection(`<a href="${url}">`, '</a>'); });
  document.getElementById('tb-ul')?.addEventListener('click', () => insertAtCursor('\n<ul>\n  <li></li>\n  <li></li>\n</ul>\n'));
  document.getElementById('tb-ol')?.addEventListener('click', () => insertAtCursor('\n<ol>\n  <li></li>\n  <li></li>\n</ol>\n'));
  document.getElementById('tb-quote')?.addEventListener('click', () => wrapSelection('<blockquote>', '</blockquote>'));
  document.getElementById('tb-p')?.addEventListener('click', () => wrapSelection('<p>', '</p>'));
  document.getElementById('tb-preview')?.addEventListener('click', () => {
    const preview = document.getElementById('content-preview');
    const area = document.getElementById('content-area');
    if (!preview || !area) return;
    preview.style.display = preview.style.display === 'none' ? 'block' : 'none';
    preview.innerHTML = area.value;
  });
}

/* ============================================================
   PROJECT MANAGER
   ============================================================ */
async function initProjectList() {
  if (!Auth.requireAuth()) return;
  initSidebar();

  const tbody = document.getElementById('projects-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--gray-500);padding:40px">Loading…</td></tr>';

  try {
    const data = await Api.get('/projects/all');
    if (!data?.success) return;

    if (data.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">⚙️</div><div class="empty-title">No projects yet</div><div class="empty-text">Add your first case study.</div></div></td></tr>';
      return;
    }

    tbody.innerHTML = data.data.map(proj => `
      <tr>
        <td class="td-title">${UI.truncate(proj.title, 50)}<div class="meta">${proj.slug}</div></td>
        <td>${proj.client || '—'}</td>
        <td>${proj.industry || '—'}</td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <span class="status-pill ${proj.status}">${proj.status}</span>
            ${proj.featured ? '<span class="status-pill featured">Featured</span>' : ''}
          </div>
        </td>
        <td>${UI.formatDate(proj.created_at)}</td>
        <td>
          <div class="action-btns">
            <a href="/admin/project-editor.html?id=${proj.id}" class="action-btn edit" title="Edit">✏️</a>
            <button class="action-btn delete" onclick="deleteProject(${proj.id}, '${proj.title.replace(/'/g, "\\'")}')" title="Delete">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--red-500)">Failed to load projects.</td></tr>';
  }
}

async function deleteProject(id, title) {
  if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
  try {
    const data = await Api.delete(`/projects/${id}`);
    if (data?.success) { UI.showAlert('Project deleted.'); await initProjectList(); }
    else UI.showAlert(data?.message || 'Delete failed.', 'error');
  } catch (err) { UI.showAlert('Delete failed.', 'error'); }
}

/* ============================================================
   PROJECT EDITOR
   ============================================================ */
async function initProjectEditor() {
  if (!Auth.requireAuth()) return;
  initSidebar();

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  const form = document.getElementById('project-form');
  if (!form) return;

  if (editId) {
    document.getElementById('editor-page-title').textContent = 'Edit Project';
    try {
      const data = await Api.get('/projects/all');
      const proj = data?.data?.find(p => p.id == editId);
      if (proj) {
        const fullRes = await fetch(`/api/projects/${proj.slug}`);
        const { data: fullProj } = await fullRes.json();
        if (fullProj) populateProjectForm(fullProj);
      }
    } catch (err) { console.error('Failed to load project:', err); }
  }

  // Image preview
  const imageInput = document.getElementById('image');
  const previewEl = document.getElementById('image-preview');
  if (imageInput) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewEl.innerHTML = `<div class="image-preview"><img src="${e.target.result}" alt="Preview"><div class="image-preview-remove" onclick="clearProjectImage()">×</div></div>`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Slug auto-generate
  const titleInput = document.getElementById('title');
  const slugInput  = document.getElementById('slug');
  if (titleInput && slugInput && !editId) {
    titleInput.addEventListener('input', () => {
      slugInput.value = titleInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-btn');
    UI.setLoading(btn, true, 'Saving…', 'Save Project');
    const formData = new FormData(form);

    try {
      let data;
      if (editId) { data = await Api.putForm(`/projects/${editId}`, formData); }
      else { data = await Api.postForm('/projects', formData); }

      if (data?.success) {
        UI.showAlert(editId ? 'Project updated!' : 'Project created!');
        if (!editId) setTimeout(() => { window.location.href = '/admin/projects.html'; }, 1500);
      } else {
        UI.showAlert(data?.message || 'Save failed.', 'error');
      }
    } catch (err) { UI.showAlert('Save failed.', 'error'); }
    finally { UI.setLoading(btn, false, 'Saving…', 'Save Project'); }
  });
}

function populateProjectForm(data) {
  const fields = ['title', 'slug', 'client', 'industry', 'problem', 'system_built', 'outcome', 'tags', 'tech_stack', 'duration'];
  fields.forEach(f => { const el = document.getElementById(f); if (el) el.value = data[f] || ''; });
  const statusEl = document.getElementById('status');
  if (statusEl) statusEl.value = data.status || 'draft';
  const featuredEl = document.getElementById('featured');
  if (featuredEl) featuredEl.checked = data.featured;
  if (data.image) {
    const previewEl = document.getElementById('image-preview');
    if (previewEl) previewEl.innerHTML = `<div class="image-preview"><img src="${data.image}" alt="Current"><div class="image-preview-remove" onclick="clearProjectImage()">×</div></div>`;
  }
}

function clearProjectImage() {
  document.getElementById('image-preview').innerHTML = '';
  document.getElementById('image').value = '';
}

/* ============================================================
   LEADS MANAGER
   ============================================================ */
async function initLeadsList() {
  if (!Auth.requireAuth()) return;
  initSidebar();

  const tbody = document.getElementById('leads-tbody');
  if (!tbody) return;

  let allLeads = [];
  let currentFilter = '';

  async function loadLeads(status = '') {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:40px">Loading…</td></tr>';
    try {
      const url = status ? `/leads?status=${status}` : '/leads';
      const data = await Api.get(url);
      if (!data?.success) return;
      allLeads = data.data || [];
      renderLeads(allLeads);
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--red-500)">Failed to load leads.</td></tr>';
    }
  }

  function renderLeads(leads) {
    if (leads.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">🎯</div><div class="empty-title">No leads yet</div><div class="empty-text">Leads from contact forms will appear here.</div></div></td></tr>';
      return;
    }

    tbody.innerHTML = leads.map(lead => `
      <tr class="lead-row" id="lead-row-${lead.id}">
        <td>
          ${!lead.is_read ? '<span class="unread-dot"></span>' : ''}
          <strong style="font-size:.9rem">${lead.name}</strong>
          <div class="lead-source"><a href="mailto:${lead.email}" style="color:var(--purple-400)">${lead.email}</a>${lead.phone ? ` · ${lead.phone}` : ''}</div>
          ${lead.message ? `<div class="lead-msg">${UI.truncate(lead.message, 80)}</div>` : ''}
        </td>
        <td style="font-size:.875rem;color:var(--gray-300)">${lead.company || '—'}</td>
        <td style="font-size:.875rem;color:var(--gray-300)">${lead.service || '—'}</td>
        <td><span style="font-size:.75rem;padding:3px 9px;background:rgba(255,255,255,.05);border-radius:999px;color:var(--gray-500)">${lead.source.replace(/_/g,' ')}</span></td>
        <td>
          <select class="status-select" onchange="updateLeadStatus(${lead.id}, this.value)">
            <option value="new" ${lead.status==='new'?'selected':''}>New</option>
            <option value="contacted" ${lead.status==='contacted'?'selected':''}>Contacted</option>
            <option value="qualified" ${lead.status==='qualified'?'selected':''}>Qualified</option>
            <option value="closed" ${lead.status==='closed'?'selected':''}>Closed</option>
          </select>
        </td>
        <td style="font-size:.8125rem;color:var(--gray-500)">${UI.formatDate(lead.created_at)}</td>
        <td>
          <div class="action-btns">
            ${!lead.is_read ? `<button class="action-btn view" onclick="markLeadRead(${lead.id})" title="Mark as read">✓</button>` : ''}
            <button class="action-btn delete" onclick="deleteLead(${lead.id}, '${lead.name.replace(/'/g, "\\'")}')" title="Delete">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.status;
      loadLeads(currentFilter);
    });
  });

  // Search
  document.getElementById('lead-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allLeads.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.company || '').toLowerCase().includes(q) ||
      (l.service || '').toLowerCase().includes(q)
    );
    renderLeads(filtered);
  });

  await loadLeads();
}

async function markLeadRead(id) {
  try {
    await Api.put(`/leads/${id}/read`, {});
    const row = document.getElementById(`lead-row-${id}`);
    if (row) {
      row.querySelector('.unread-dot')?.remove();
      row.querySelector('.action-btn.view')?.remove();
    }
  } catch (err) {}
}

async function updateLeadStatus(id, status) {
  try {
    const data = await Api.put(`/leads/${id}/status`, { status });
    if (!data?.success) UI.showAlert('Status update failed.', 'error');
  } catch (err) { UI.showAlert('Status update failed.', 'error'); }
}

async function deleteLead(id, name) {
  if (!confirm(`Delete lead from "${name}"? This cannot be undone.`)) return;
  try {
    const data = await Api.delete(`/leads/${id}`);
    if (data?.success) {
      UI.showAlert('Lead deleted.');
      document.getElementById(`lead-row-${id}`)?.remove();
    } else {
      UI.showAlert(data?.message || 'Delete failed.', 'error');
    }
  } catch (err) { UI.showAlert('Delete failed.', 'error'); }
}

/* ============================================================
   EXPORT
   ============================================================ */
window.ThinkAdmin = { initDashboard, initBlogList, deleteBlog, initBlogEditor, initProjectList, deleteProject, initProjectEditor, initLeadsList, markLeadRead, updateLeadStatus, deleteLead };
