// MAI Design Audit Tracker - App Logic (Updated to new UI)

const SEED_DATA = {
  id: "audit-mmplus-fa-001",
  title: "MM+ Aktivitas Promosi FA Audit",
  stream: "MAI",
  platform: "Tablet",
  fileName: "[MM+] Aktivitas Promosi FA",
  figmaFileUrl: "https://figma.com/file/sample",
  reviewer: "Rakha",
  auditDate: "2026-04-27",
  summary: "Audit for identifying local components, reused patterns, extraction opportunities, and UI kit alignment.",
  status: "in_progress",
  findings: [
    {
      id: "finding-f1",
      title: "Contains components used locally",
      description: "Found several components that are defined and used only within this local file.",
      category: "local component",
      componentLevel: "atomic",
      recommendation: "keep local",
      priority: "low",
      severity: "low",
      status: "open",
      figmaUrl: "",
      notes: ""
    },
    {
      id: "finding-f2",
      title: "Use component from another file",
      description: "Using a header dashboard component from '📊 [MM+] Dashboard Monitoring', and a tab component from '💳 [MM+] Registration Flow (NPWP)'.",
      category: "cross-file dependency",
      componentLevel: "compound",
      recommendation: "extract to ui kit",
      priority: "medium",
      severity: "medium",
      status: "open",
      figmaUrl: "",
      notes: ""
    },
    {
      id: "finding-f3",
      title: "Use component from Master/UI Kit",
      description: "Properly utilizing Tile Menu, Top app bars, buttons, note view, and activity card from the Master UI Kit.",
      category: "master/ui kit usage",
      componentLevel: "compound",
      recommendation: "no action yet",
      priority: "low",
      severity: "low",
      status: "resolved",
      figmaUrl: "",
      notes: "Good usage of existing kit."
    },
    {
      id: "finding-f4-1",
      title: "Text pairing extraction opportunity",
      description: "Text pairing is used in many pages as plain elements instead of a reusable component.",
      category: "plain element extraction opportunity",
      componentLevel: "atomic",
      recommendation: "extract to ui kit",
      priority: "medium",
      severity: "low",
      status: "open",
      figmaUrl: "",
      notes: ""
    },
    {
      id: "finding-f4-2",
      title: "Chips filter and table cells extraction opportunity",
      description: "Chips filter and table cells are used as plain elements.",
      category: "plain element extraction opportunity",
      componentLevel: "atomic",
      recommendation: "extract to ui kit",
      priority: "medium",
      severity: "medium",
      status: "open",
      figmaUrl: "https://www.figma.com/design/6GkVnVU6qOrj7JrUQtzKh6/%F0%9F%94%8A--MM---Aktivitas-Promosi-FA?node-id=5573-54014&t=tYlIone8UUzVgR6Y-11",
      notes: ""
    },
    {
      id: "finding-f4-3",
      title: "Bottom sheet extraction opportunity",
      description: "Bottom sheet with various content used 3+ times as plain elements.",
      category: "plain element extraction opportunity",
      componentLevel: "compound",
      recommendation: "extract to design system",
      priority: "high",
      severity: "medium",
      status: "open",
      figmaUrl: "https://www.figma.com/design/6GkVnVU6qOrj7JrUQtzKh6/%F0%9F%94%8A--MM---Aktivitas-Promosi-FA?node-id=4648-19625&t=tYlIone8UUzVgR6Y-11",
      notes: "Needs slots for different content."
    },
    {
      id: "finding-f4-4",
      title: "Tab bar below App Bar extraction opportunity",
      description: "The tab bar below the App Bar is used 3+ times. The tab itself is already a component.",
      category: "plain element extraction opportunity",
      componentLevel: "compound",
      recommendation: "extract to ui kit",
      priority: "medium",
      severity: "medium",
      status: "open",
      figmaUrl: "https://www.figma.com/design/6GkVnVU6qOrj7JrUQtzKh6/%F0%9F%94%8A--MM---Aktivitas-Promosi-FA?node-id=4468-17179&t=tYlIone8UUzVgR6Y-11",
      notes: ""
    },
    {
      id: "finding-f4-5",
      title: "Bottom action bar / CTA Approval bar extraction",
      description: "Sticky bottom action/CTA Approval bar used 3+ times with many variants (form approval, CTA next/previous) but same layout.",
      category: "plain element extraction opportunity",
      componentLevel: "compound",
      recommendation: "extract to ui kit",
      priority: "high",
      severity: "medium",
      status: "open",
      figmaUrl: "https://www.figma.com/design/6GkVnVU6qOrj7JrUQtzKh6/%F0%9F%94%8A--MM---Aktivitas-Promosi-FA?node-id=4793-31212&t=tYlIone8UUzVgR6Y-11",
      notes: "Use slots or variants for left/right action combinations."
    },
    {
      id: "finding-f4-6",
      title: "State patterns extraction opportunity",
      description: "Empty state, success state, and confirmation state patterns used 3+ times.",
      category: "plain element extraction opportunity",
      componentLevel: "pattern",
      recommendation: "extract to design system",
      priority: "high",
      severity: "medium",
      status: "open",
      figmaUrl: "https://www.figma.com/design/6GkVnVU6qOrj7JrUQtzKh6/%F0%9F%94%8A--MM---Aktivitas-Promosi-FA?node-id=5953-42326&t=tYlIone8UUzVgR6Y-11",
      notes: ""
    },
    {
      id: "finding-f4-7",
      title: "Pop up dialog extraction opportunity",
      description: "Pop up dialogs are built as plain elements. Can be extracted as a new component.",
      category: "plain element extraction opportunity",
      componentLevel: "compound",
      recommendation: "extract to ui kit",
      priority: "high",
      severity: "low",
      status: "open",
      figmaUrl: "",
      notes: "Needs slots because the content varies."
    },
    {
      id: "finding-f5",
      title: "Not using existing table cell component",
      description: "A table cell was built from scratch instead of using the already created table cell component.",
      category: "missing component reuse",
      componentLevel: "atomic",
      recommendation: "replace with existing component",
      priority: "medium",
      severity: "medium",
      status: "open",
      figmaUrl: "https://www.figma.com/design/6GkVnVU6qOrj7JrUQtzKh6/%F0%9F%94%8A--MM---Aktivitas-Promosi-FA?node-id=9854-109935&t=tYlIone8UUzVgR6Y-11",
      notes: "Already created table cell component here: https://www.figma.com/design/6GkVnVU6qOrj7JrUQtzKh6/%F0%9F%94%8A--MM---Aktivitas-Promosi-FA?node-id=7111-78680&t=tYlIone8UUzVgR6Y-11"
    },
    {
      id: "finding-f6",
      title: "Deep clicking problem in log component",
      description: "To change indicator, PD has to double click the indicator layer to select it and change the attribute (earlier, center, latest).",
      category: "deep clicking issue",
      componentLevel: "atomic",
      recommendation: "refactor nested properties",
      priority: "medium",
      severity: "low",
      status: "open",
      figmaUrl: "https://www.figma.com/design/6GkVnVU6qOrj7JrUQtzKh6/%F0%9F%94%8A--MM---Aktivitas-Promosi-FA?node-id=12496-90535&t=tYlIone8UUzVgR6Y-11",
      notes: "We can use nested system instead to surface properties."
    }
  ]
};

const app = {
  data: { audits: [] },
  currentAuditId: null,

  init() {
    this.loadData();
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

  loadData() {
    const saved = localStorage.getItem('mai_audit_data');
    if (saved) {
      try { this.data = JSON.parse(saved); } catch (e) { this.data = { audits: [] }; }
    } else {
      this.data.audits.push(SEED_DATA);
      this.saveData();
    }
  },

  saveData() {
    localStorage.setItem('mai_audit_data', JSON.stringify(this.data));
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
      list.innerHTML = '<p style="color:var(--ink4); padding: 40px;">No audits found. Create one to get started.</p>';
      return;
    }

    this.data.audits.forEach(audit => {
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
          <span><i class="ph ph-folder"></i> ${audit.stream} / ${audit.platform}</span>
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
      list.appendChild(card);
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
          this.addImageToFinding(findingId, base64);
        };
        reader.readAsDataURL(file);
        return;
      }
    }
  },

  addImageToFinding(findingId, base64) {
    const audit = this.data.audits.find(a => a.id === this.currentAuditId);
    if (!audit) return;
    const finding = audit.findings.find(f => f.id === findingId);
    if (!finding) return;
    if (!finding.images) finding.images = [];
    finding.images.push(base64);
    this.saveData();
    this.renderAuditDetail();
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
      document.getElementById('audit-reviewer').value = 'Design Ops';
    }
    this.openModal('audit-modal-overlay');
  },

  saveAudit(e) {
    e.preventDefault();
    const id = document.getElementById('audit-id').value;
    const data = {
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
              app.addImageToFinding(findingId, ev.target.result);
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
