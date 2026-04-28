// MAI Design Audit Tracker - App Logic (Updated to new UI)
// Data is now persisted in IndexedDB and falls back to mai-audit-data.json if empty

const app = {
  data: { audits: [] },
  currentAuditId: null,

  async init() {
    await this.loadData();
    this.bindDraftEvents();
    this.renderDashboard();
  },

  bindDraftEvents() {
    const form = document.getElementById('finding-form');
    if (form) {
      form.addEventListener('input', () => {
        const id = document.getElementById('finding-id').value;
        if (!id) {
          const draft = {
            title: document.getElementById('finding-title').value,
            category: document.getElementById('finding-category').value,
            componentLevel: document.getElementById('finding-level').value,
            description: document.getElementById('finding-desc').value,
            recommendation: document.getElementById('finding-recommendation').value,
            status: document.getElementById('finding-status').value,
            priority: document.getElementById('finding-priority').value,
            severity: document.getElementById('finding-severity').value,
            figmaUrl: document.getElementById('finding-figma-url').value,
            notes: document.getElementById('finding-notes').value
          };
          localStorage.setItem('mai_finding_draft', JSON.stringify(draft));
        }
      });
    }
  },

  async loadData() {
    let saved;
    try {
      saved = await idbKeyval.get('mai_audit_data');
    } catch(e) { console.error("IDB error", e); }

    // Migration from localStorage to IndexedDB if first time
    if (!saved) {
      const localStr = localStorage.getItem('mai_audit_data');
      if (localStr) {
        try { 
          saved = JSON.parse(localStr); 
          await idbKeyval.set('mai_audit_data', saved);
          localStorage.removeItem('mai_audit_data');
        } catch (e) {}
      }
    }

    if (saved) {
      this.data = saved;
    } else {
      // Fallback: Fetch default data from mai-audit-data.json
      try {
        const response = await fetch('mai-audit-data.json');
        if (response.ok) {
          const defaultData = await response.json();
          // The JSON already contains the full { audits: [...] } structure
          this.data = defaultData;
          this.saveData();
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (e) {
        console.warn("Could not load mai-audit-data.json fallback, starting empty.", e);
        this.data = { audits: [] };
      }
    }
  },

  saveData() {
    idbKeyval.set('mai_audit_data', this.data).catch(e => console.error("Failed saving to IDB", e));
  },

  navigate(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('nav-dashboard').style.display = view === 'dashboard' ? 'none' : 'inline-flex';
    document.getElementById('hdr-main-btn').textContent = view === 'dashboard' ? '＋ New Audit' : '＋ New Finding';
    document.getElementById('hdr-main-btn').onclick = view === 'dashboard' ? () => this.openAuditModal() : () => this.openFindingModal();

    if (view === 'dashboard') {
      document.getElementById('header-title').innerHTML = `[MAI] Maxxi Marketing+ <span>Tracker</span>`;
      document.getElementById('view-dashboard').classList.add('active');
      this.currentAuditId = null;
      this.renderDashboard();
    } else if (view === 'audit-detail') {
      const a = this.data.audits.find(x => x.id === this.currentAuditId);
      document.getElementById('header-title').innerHTML = `${a.fileName} <span>Audit</span>`;
      document.getElementById('view-audit-detail').classList.add('active');
      this.renderAuditDetail();
    }
  },

  // Helpers for Badges
  getPriorityTag(pri) {
    if (pri === 'critical' || pri === 'high') return `<span class="fc-tag tag-red">PRI: ${pri.toUpperCase()}</span>`;
    if (pri === 'medium') return `<span class="fc-tag tag-yellow">PRI: MED</span>`;
    return `<span class="fc-tag tag-neutral">PRI: LOW</span>`;
  },

  getStatusTag(status) {
    if (status === 'open') return `<span class="fc-tag tag-blue">OPEN</span>`;
    if (status === 'reviewed') return `<span class="fc-tag tag-purple">REVIEWED</span>`;
    if (status === 'in_progress') return `<span class="fc-tag tag-yellow">IN PROGRESS</span>`;
    if (status === 'resolved') return `<span class="fc-tag tag-green">RESOLVED</span>`;
    return `<span class="fc-tag tag-neutral">${status.toUpperCase()}</span>`;
  },

  getLevelTag(lvl) {
    return `<span class="fc-tag tag-neutral">LVL: ${lvl.toUpperCase()}</span>`;
  },

  // --- Dashboard Methods ---
  renderDashboard() {
    this.renderStats();
    const list = document.getElementById('audit-list');
    list.innerHTML = '';

    if (this.data.audits.length === 0) {
      list.innerHTML = '<p style="color:var(--ink4); padding: 40px;">No projects or audits found. Create one to get started.</p>';
      return;
    }

    // Group audits by project name
    const projects = {};
    this.data.audits.forEach(audit => {
      const projName = audit.projectName || 'MM+';
      if (!projects[projName]) projects[projName] = [];
      projects[projName].push(audit);
    });

    Object.keys(projects).sort().forEach(projName => {
      // Render Project Group Header
      const projSection = document.createElement('div');
      projSection.style.marginBottom = '40px';
      
      const projHeader = document.createElement('div');
      projHeader.innerHTML = `
        <h2 style="font-family: var(--display); color: var(--ink); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <i class="ph ph-folder" style="color: var(--g500);"></i> ${projName}
        </h2>
      `;
      projSection.appendChild(projHeader);
      
      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
      grid.style.gap = '20px';
      
      projects[projName].forEach(audit => {
        const findings = audit.findings || [];
        const openCount = findings.filter(f => f.status === 'open' || f.status === 'in_progress').length;
        
        const card = document.createElement('div');
        card.className = 'file-card audit-card';
        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <h3 class="ac-title">${audit.title}</h3>
            <button class="icon-btn danger" onclick="event.stopPropagation(); app.deleteAudit('${audit.id}')">
              <i class="ph ph-trash"></i>
            </button>
          </div>
          <div class="ac-meta">
            <span><i class="ph ph-files"></i> ${audit.stream} / ${audit.platform}</span>
            <span><i class="ph ph-calendar"></i> ${audit.auditDate}</span>
          </div>
          <p class="ac-desc">${audit.summary || 'No summary provided.'}</p>
          <div class="ac-foot">
            <div class="fc-tags">
              ${this.getStatusTag(audit.status)}
              <span class="fc-tag tag-neutral">${findings.length} Findings</span>
            </div>
            <span class="ac-stats">${openCount} Open Action Items</span>
          </div>
        `;
        card.addEventListener('click', () => {
          this.currentAuditId = audit.id;
          this.navigate('audit-detail');
        });
        grid.appendChild(card);
      });
      
      projSection.appendChild(grid);
      list.appendChild(projSection);
    });
  },

  renderStats() {
    const statsContainer = document.getElementById('dashboard-stats');
    const totalAudits = this.data.audits.length;
    let totalFindings = 0;
    let openFindings = 0;
    let extractions = 0;

    this.data.audits.forEach(a => {
      if (a.findings) {
        totalFindings += a.findings.length;
        openFindings += a.findings.filter(f => f.status === 'open' || f.status === 'in_progress').length;
        extractions += a.findings.filter(f => f.category.includes('extraction')).length;
      }
    });

    statsContainer.innerHTML = `
      <div class="summary">
        <div class="sum-title">Audits Summary</div>
        <div class="sum-grid">
          <div class="sum-card"><div class="sum-num">${totalAudits}</div><div class="sum-lbl">Total Audits</div></div>
          <div class="sum-card"><div class="sum-num">${totalFindings}</div><div class="sum-lbl">Total Findings</div></div>
          <div class="sum-card"><div class="sum-num warn">${openFindings}</div><div class="sum-lbl">Open Action Items</div></div>
          <div class="sum-card"><div class="sum-num" style="color:var(--purple);">${extractions}</div><div class="sum-lbl">Extraction Opps</div></div>
        </div>
      </div>
    `;
  },

  // --- Audit Detail Methods ---
  renderAuditDetail() {
    const audit = this.data.audits.find(a => a.id === this.currentAuditId);
    if (!audit) return this.navigate('dashboard');

    const headerInfo = document.getElementById('audit-header-info');
    headerInfo.innerHTML = `
      <div class="ad-header">
        <div>
          <h2 class="ad-title">${audit.title}</h2>
          <div class="fc-tags" style="margin-top: 8px;">
            ${this.getStatusTag(audit.status)}
            <span class="fc-tag tag-neutral">${audit.stream} / ${audit.platform}</span>
          </div>
        </div>
        ${audit.summary ? `<p class="ad-desc">${audit.summary}</p>` : ''}
        <div class="ad-meta-grid">
          <div class="ad-meta-item"><span class="ad-meta-lbl">File Name</span><span class="ad-meta-val">${audit.fileName}</span></div>
          <div class="ad-meta-item"><span class="ad-meta-lbl">Reviewer</span><span class="ad-meta-val">${audit.reviewer}</span></div>
          <div class="ad-meta-item"><span class="ad-meta-lbl">Date</span><span class="ad-meta-val">${audit.auditDate}</span></div>
          ${audit.figmaFileUrl ? `<div class="ad-meta-item"><span class="ad-meta-lbl">Source</span><a href="${audit.figmaFileUrl}" target="_blank" class="ad-meta-val" style="color:var(--blue);text-decoration:none;">Open Figma ↗</a></div>` : ''}
        </div>
      </div>
    `;

    const categories = new Set();
    if(audit.findings) audit.findings.forEach(f => categories.add(f.category));
    const catFilter = document.getElementById('filter-category');
    catFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(c => { catFilter.innerHTML += `<option value="${c}">${c}</option>`; });

    document.getElementById('search-input').value = '';
    document.getElementById('filter-status').value = 'all';

    this.filterFindings();
  },

  filterFindings() {
    const audit = this.data.audits.find(a => a.id === this.currentAuditId);
    if (!audit || !audit.findings) return;

    const query = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('filter-category').value;
    const status = document.getElementById('filter-status').value;

    const filtered = audit.findings.filter(f => {
      const matchQuery = f.title.toLowerCase().includes(query) || (f.description && f.description.toLowerCase().includes(query));
      const matchCategory = category === 'all' || f.category === category;
      const matchStatus = status === 'all' || f.status === status;
      return matchQuery && matchCategory && matchStatus;
    });

    this.renderFindingsList(filtered);
  },

  renderFindingsList(findings) {
    const list = document.getElementById('findings-list');
    list.innerHTML = '';

    if (findings.length === 0) {
      list.innerHTML = '<div style="padding: 60px; text-align: center; color: var(--ink4); background: white; border: 1px solid var(--bdr); border-radius: 16px;"><i class="ph ph-magnifying-glass" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i><br>No findings match your criteria.</div>';
      return;
    }

    findings.forEach(f => {
      const item = document.createElement('div');
      item.className = 'finding-card';
      
      const isExtraction = f.category.includes('extraction');
      const accentColor = f.status === 'resolved' ? 'var(--g500)' : (isExtraction ? 'var(--purple)' : 'var(--blue)');
      item.style.setProperty('--card-accent', accentColor);

      item.innerHTML = `
        <div class="fc-header">
          <div class="fc-badges-row">
            ${this.getStatusTag(f.status)}
            ${this.getPriorityTag(f.priority)}
            ${this.getLevelTag(f.componentLevel)}
          </div>
          <div class="fc-actions-row">
            <button class="icon-btn" onclick="app.openFindingModal('${f.id}')" title="Edit Finding"><i class="ph ph-pencil-simple"></i></button>
            ${f.figmaUrl ? `<a href="${f.figmaUrl}" target="_blank" class="icon-btn" style="color:var(--blue);" title="View in Figma"><i class="ph ph-figma-logo"></i></a>` : ''}
            <button class="icon-btn danger" onclick="app.deleteFinding('${f.id}')" title="Delete Finding"><i class="ph ph-trash"></i></button>
          </div>
        </div>
        
        <div class="fc-body">
          <div class="fc-main-info">
            <h4 class="fc-title">${f.title}</h4>
            <p class="fc-desc">${f.description || '<em style="color:var(--ink4)">No description provided.</em>'}</p>
            <div class="fc-meta-row">
              <span class="fc-meta-pill"><i class="ph ph-tag"></i> ${f.category}</span>
              <span class="fc-meta-pill"><i class="ph ph-lightbulb"></i> Rec: <strong style="color:var(--ink);">${f.recommendation}</strong></span>
            </div>
          </div>
          
          <div class="fc-sidebar">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <span class="fc-sidebar-label">Progress Status</span>
              <select class="fc-status-select" onchange="app.saveInlineStatus('${f.id}', this.value)">
                <option value="open" ${f.status==='open'?'selected':''}>Open</option>
                <option value="reviewed" ${f.status==='reviewed'?'selected':''}>Reviewed</option>
                <option value="in_progress" ${f.status==='in_progress'?'selected':''}>In Progress</option>
                <option value="resolved" ${f.status==='resolved'?'selected':''}>Resolved</option>
              </select>
            </div>
            ${f.severity ? `
            <div style="display:flex; flex-direction:column; gap:4px; margin-top:8px;">
              <span class="fc-sidebar-label">Severity Level</span>
              <span style="font-size:13px; font-weight:600; color:var(--ink2); text-transform:capitalize;">${f.severity}</span>
            </div>` : ''}
          </div>
        </div>
        
        <div class="fc-footer">
          <div class="fc-note-wrapper">
            <div class="fc-note-icon"><i class="ph ph-note-pencil"></i></div>
            <textarea class="fc-note-input" placeholder="Add an internal note or context... (auto-saves)" onchange="app.saveInlineNote('${f.id}', this.value)">${f.notes || ''}</textarea>
          </div>
          ${this.renderImageGallery(f)}
          <div class="fc-paste-zone" tabindex="0" data-finding-id="${f.id}">
            <i class="ph ph-clipboard"></i> Press ⌘V here to paste a screenshot
          </div>
        </div>
      `;
      list.appendChild(item);
    });

    // Bind paste listeners to all paste zones
    document.querySelectorAll('.fc-paste-zone').forEach(zone => {
      zone.addEventListener('paste', (e) => {
        const findingId = zone.getAttribute('data-finding-id');
        app.handleImagePaste(e, findingId);
      });
    });

    // Also allow paste on note textareas
    this.bindNotePasteListeners();
  },

  renderImageGallery(finding) {
    const images = finding.images || [];
    if (images.length === 0) return '';
    const thumbs = images.map((src, idx) => `
      <div class="fc-img-thumb">
        <img src="${src}" alt="Screenshot ${idx + 1}" loading="lazy" />
        <div class="fc-img-overlay">
          <button class="fc-img-btn view" onclick="event.stopPropagation(); app.openLightbox('${finding.id}', ${idx})" title="View full"><i class="ph ph-arrows-out"></i></button>
          <button class="fc-img-btn delete" onclick="event.stopPropagation(); app.deleteImage('${finding.id}', ${idx})" title="Remove"><i class="ph ph-trash"></i></button>
        </div>
      </div>
    `).join('');

    return `
      <div class="fc-images">
        <div class="fc-images-label"><i class="ph ph-images"></i> Attachments (${images.length})</div>
        <div class="fc-images-grid">${thumbs}</div>
      </div>
    `;
  },

  handleImagePaste(e, findingId) {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (ev) => {
          const base64 = ev.target.result;
          this.compressAndAddImage(findingId, base64);
        };
        reader.readAsDataURL(file);
        return;
      }
    }
  },

  compressAndAddImage(findingId, base64) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1600; // Restored high quality now that we have unlimited storage
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF'; // ensure transparent bg becomes white, not black
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.9); // High quality JPEG
      this.addImageToFinding(findingId, compressedBase64);
    };
    img.src = base64;
  },

  addImageToFinding(findingId, base64) {
    const audit = this.data.audits.find(a => a.id === this.currentAuditId);
    if (!audit) return;
    const finding = audit.findings.find(f => f.id === findingId);
    if (!finding) return;
    if (!finding.images) finding.images = [];
    finding.images.push(base64);
    
    try {
      this.saveData();
      this.renderAuditDetail();
    } catch (e) {
      finding.images.pop(); // Revert the push
      alert("IndexedDB storage limit reached! Cannot save more images.");
    }
  },

  deleteImage(findingId, imgIdx) {
    const audit = this.data.audits.find(a => a.id === this.currentAuditId);
    if (!audit) return;
    const finding = audit.findings.find(f => f.id === findingId);
    if (!finding || !finding.images) return;
    finding.images.splice(imgIdx, 1);
    this.saveData();
    this.renderAuditDetail();
  },

  openLightbox(findingId, imgIdx) {
    const audit = this.data.audits.find(a => a.id === this.currentAuditId);
    if (!audit) return;
    const finding = audit.findings.find(f => f.id === findingId);
    if (!finding || !finding.images || !finding.images[imgIdx]) return;

    const images = finding.images;
    let current = imgIdx;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    const render = () => {
      const hasMultiple = images.length > 1;
      overlay.innerHTML = `
        <button class="lightbox-close" title="Close (Esc)">
          <i class="ph ph-x"></i>
        </button>
        ${hasMultiple ? `<button class="lightbox-nav lightbox-prev" title="Previous (←)"><i class="ph ph-caret-left"></i></button>` : ''}
        <img src="${images[current]}" alt="Screenshot ${current + 1}" />
        ${hasMultiple ? `<button class="lightbox-nav lightbox-next" title="Next (→)"><i class="ph ph-caret-right"></i></button>` : ''}
        ${hasMultiple ? `<div class="lightbox-counter">${current + 1} / ${images.length}</div>` : ''}
      `;

      // Bind close
      overlay.querySelector('.lightbox-close').onclick = () => cleanup();

      // Bind nav buttons
      if (hasMultiple) {
        overlay.querySelector('.lightbox-prev').onclick = (e) => { e.stopPropagation(); navigate(-1); };
        overlay.querySelector('.lightbox-next').onclick = (e) => { e.stopPropagation(); navigate(1); };
      }
    };

    const navigate = (dir) => {
      current = (current + dir + images.length) % images.length;
      render();
    };

    const cleanup = () => {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
    };

    overlay.onclick = (e) => { if (e.target === overlay) cleanup(); };

    const onKey = (e) => {
      if (e.key === 'Escape') { cleanup(); return; }
      if (images.length > 1) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); navigate(1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); navigate(-1); }
      }
    };

    render();
    document.body.appendChild(overlay);
    document.addEventListener('keydown', onKey);
  },

  // --- Modals ---
  openModal(id) { document.getElementById(id).classList.add('active'); },
  closeModal(id) { document.getElementById(id).classList.remove('active'); },

  openAuditModal(auditId = null) {
    const form = document.getElementById('audit-form');
    form.reset();
    
    if (auditId) {
      const audit = this.data.audits.find(a => a.id === auditId);
      document.getElementById('audit-modal-title').textContent = 'Edit Audit Details';
      document.getElementById('audit-id').value = audit.id;
      document.getElementById('audit-project').value = audit.projectName || 'MM+';
      document.getElementById('audit-title').value = audit.title;
      document.getElementById('audit-stream').value = audit.stream;
      document.getElementById('audit-platform').value = audit.platform;
      document.getElementById('audit-filename').value = audit.fileName;
      document.getElementById('audit-reviewer').value = audit.reviewer;
      document.getElementById('audit-figma-url').value = audit.figmaFileUrl || '';
      document.getElementById('audit-summary').value = audit.summary || '';
    } else {
      document.getElementById('audit-modal-title').textContent = 'New Audit';
      document.getElementById('audit-id').value = '';
      document.getElementById('audit-project').value = 'MM+';
      document.getElementById('audit-reviewer').value = 'Design Ops';
    }
    this.openModal('audit-modal-overlay');
  },

  saveAudit(e) {
    e.preventDefault();
    const id = document.getElementById('audit-id').value;
    const data = {
      projectName: document.getElementById('audit-project').value || 'MM+',
      title: document.getElementById('audit-title').value,
      stream: document.getElementById('audit-stream').value,
      platform: document.getElementById('audit-platform').value,
      fileName: document.getElementById('audit-filename').value,
      reviewer: document.getElementById('audit-reviewer').value,
      figmaFileUrl: document.getElementById('audit-figma-url').value,
      summary: document.getElementById('audit-summary').value,
    };

    if (id) {
      const audit = this.data.audits.find(a => a.id === id);
      Object.assign(audit, data);
    } else {
      this.data.audits.unshift({
        id: 'audit-' + Date.now(), ...data,
        auditDate: new Date().toISOString().split('T')[0],
        status: 'open', findings: []
      });
    }

    this.saveData();
    this.closeModal('audit-modal-overlay');
    this.currentAuditId ? this.renderAuditDetail() : this.renderDashboard();
  },

  deleteAudit(id) {
    if (confirm('Are you sure you want to delete this audit?')) {
      this.data.audits = this.data.audits.filter(a => a.id !== id);
      this.saveData();
      this.renderDashboard();
    }
  },

  openFindingModal(findingId = null) {
    const form = document.getElementById('finding-form');
    form.reset();
    
    if (findingId) {
      const audit = this.data.audits.find(a => a.id === this.currentAuditId);
      const finding = audit.findings.find(f => f.id === findingId);
      
      document.getElementById('finding-modal-title').textContent = 'Edit Finding';
      document.getElementById('finding-id').value = finding.id;
      document.getElementById('finding-title').value = finding.title;
      document.getElementById('finding-category').value = finding.category;
      document.getElementById('finding-level').value = finding.componentLevel || 'atomic';
      document.getElementById('finding-desc').value = finding.description || '';
      document.getElementById('finding-recommendation').value = finding.recommendation || 'keep local';
      document.getElementById('finding-status').value = finding.status || 'open';
      document.getElementById('finding-priority').value = finding.priority || 'medium';
      document.getElementById('finding-severity').value = finding.severity || 'medium';
      document.getElementById('finding-figma-url').value = finding.figmaUrl || '';
      document.getElementById('finding-notes').value = finding.notes || '';
    } else {
      document.getElementById('finding-modal-title').textContent = 'New Finding';
      document.getElementById('finding-id').value = '';
      const draftStr = localStorage.getItem('mai_finding_draft');
      if (draftStr) {
        try {
          const draft = JSON.parse(draftStr);
          document.getElementById('finding-title').value = draft.title || '';
          document.getElementById('finding-category').value = draft.category || 'local component';
          document.getElementById('finding-level').value = draft.componentLevel || 'atomic';
          document.getElementById('finding-desc').value = draft.description || '';
          document.getElementById('finding-recommendation').value = draft.recommendation || 'keep local';
          document.getElementById('finding-status').value = draft.status || 'open';
          document.getElementById('finding-priority').value = draft.priority || 'medium';
          document.getElementById('finding-severity').value = draft.severity || 'medium';
          document.getElementById('finding-figma-url').value = draft.figmaUrl || '';
          document.getElementById('finding-notes').value = draft.notes || '';
        } catch(e){}
      }
    }
    this.openModal('finding-modal-overlay');
  },

  saveInlineNote(findingId, val) {
    const audit = this.data.audits.find(a => a.id === this.currentAuditId);
    if (!audit) return;
    const finding = audit.findings.find(f => f.id === findingId);
    if (finding) {
      finding.notes = val;
      this.saveData();
    }
  },

  // Also support paste on the note textarea itself
  bindNotePasteListeners() {
    document.querySelectorAll('.fc-note-input').forEach(textarea => {
      if (textarea._pastebound) return;
      textarea._pastebound = true;
      textarea.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            e.preventDefault();
            const card = textarea.closest('.finding-card');
            const pasteZone = card ? card.querySelector('.fc-paste-zone') : null;
            const findingId = pasteZone ? pasteZone.getAttribute('data-finding-id') : null;
            if (!findingId) return;
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (ev) => {
              app.compressAndAddImage(findingId, ev.target.result);
            };
            reader.readAsDataURL(file);
            return;
          }
        }
      });
    });
  },

  saveInlineStatus(findingId, val) {
    const audit = this.data.audits.find(a => a.id === this.currentAuditId);
    if (!audit) return;
    const finding = audit.findings.find(f => f.id === findingId);
    if (finding) {
      finding.status = val;
      this.saveData();
      this.renderAuditDetail();
    }
  },

  saveFinding(e) {
    e.preventDefault();
    const audit = this.data.audits.find(a => a.id === this.currentAuditId);
    if (!audit) return;
    if (!audit.findings) audit.findings = [];

    const id = document.getElementById('finding-id').value;
    const fData = {
      title: document.getElementById('finding-title').value,
      category: document.getElementById('finding-category').value,
      componentLevel: document.getElementById('finding-level').value,
      description: document.getElementById('finding-desc').value,
      recommendation: document.getElementById('finding-recommendation').value,
      status: document.getElementById('finding-status').value,
      priority: document.getElementById('finding-priority').value,
      severity: document.getElementById('finding-severity').value,
      figmaUrl: document.getElementById('finding-figma-url').value,
      notes: document.getElementById('finding-notes').value
    };

    if (id) {
      const idx = audit.findings.findIndex(f => f.id === id);
      if (idx !== -1) audit.findings[idx] = { ...audit.findings[idx], ...fData };
    } else {
      audit.findings.unshift({ id: 'finding-' + Date.now(), ...fData });
    }

    // Auto-update audit status based on findings
    const allResolved = audit.findings.every(f => f.status === 'resolved');
    if (audit.findings.length > 0 && allResolved) audit.status = 'resolved';
    else if (audit.findings.some(f => f.status === 'in_progress' || f.status === 'open')) audit.status = 'in_progress';

    if (!id) {
      localStorage.removeItem('mai_finding_draft');
    }

    this.saveData();
    this.closeModal('finding-modal-overlay');
    this.renderAuditDetail();
  },

  deleteFinding(id) {
    if (confirm('Are you sure you want to delete this finding?')) {
      const audit = this.data.audits.find(a => a.id === this.currentAuditId);
      audit.findings = audit.findings.filter(f => f.id !== id);
      this.saveData();
      this.renderAuditDetail();
    }
  },

  exportData() {
    const dataStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mai-audit-data.json';
    a.click();
  },

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported && imported.audits) {
          if (confirm('Merge imported audits with your existing data?')) {
            imported.audits.forEach(newAudit => {
              if (this.data.audits.find(a => a.id === newAudit.id)) newAudit.id += '-' + Date.now();
              this.data.audits.push(newAudit);
            });
            this.saveData();
            this.renderDashboard();
          }
        } else { alert('Invalid file format.'); }
      } catch (err) { alert('Error parsing JSON.'); }
    };
    reader.readAsText(file);
    event.target.value = '';
  }
};

// Close modals on overlay click
document.querySelectorAll('.overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) app.closeModal(this.id);
  });
});

document.addEventListener('DOMContentLoaded', () => app.init());
