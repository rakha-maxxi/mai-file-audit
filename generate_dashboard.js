const fs = require('fs');

// Read JSON data
const rawData = fs.readFileSync('mai-audit-data.json', 'utf8');

const template = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MAI Design Audit Dashboard</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">

  <!-- Phosphor Icons -->
  <script src="https://unpkg.com/@phosphor-icons/web"><\/script>

  <style>
    :root {
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-display: 'Syne', sans-serif;
      --color-bg-body: #F4F5F7;
      --color-background-primary: #FFFFFF;
      --color-background-secondary: #F8F9FA;
      --color-background-tertiary: #EEF0F3;
      --color-text-primary: #111827;
      --color-text-secondary: #4B5563;
      --color-text-tertiary: #9CA3AF;
      --color-border-primary: #E5E7EB;
      --color-border-secondary: #E5E7EB;
      --color-border-tertiary: #F3F4F6;
      --color-accent: #6366F1;
      --color-accent-pale: #EEF2FF;
      --color-success: #059669;
      --color-success-bg: #ECFDF5;
      --color-warning: #D97706;
      --color-warning-bg: #FEF3C7;
      --color-danger: #DC2626;
      --color-danger-bg: #FEF2F2;
      --border-radius-md: 12px;
      --border-radius-lg: 16px;
      --border-radius-xl: 24px;
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      --shadow-lg: 0 10px 25px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-sans); background-color: var(--color-bg-body); color: var(--color-text-primary); line-height: 1.5; -webkit-font-smoothing: antialiased; }
    .container { max-width: 1280px; margin: 0 auto; padding: 2rem; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }

    .dash-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem; background: var(--color-background-primary); padding: 2rem; border-radius: var(--border-radius-xl); box-shadow: var(--shadow-sm); }
    .header-title { font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--color-text-primary); margin-bottom: 6px; letter-spacing: -0.02em; }
    .header-meta { font-size: 14px; color: var(--color-text-secondary); display: flex; align-items: center; gap: 16px; }
    .header-meta span { display: flex; align-items: center; gap: 6px; }

    .metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 1.5rem; }
    .metric { background: var(--color-background-primary); border-radius: var(--border-radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); transition: transform 0.2s ease, box-shadow 0.2s ease; border: 1px solid var(--color-border-tertiary); }
    .metric:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .metric-val { font-family: var(--font-display); font-size: 36px; font-weight: 700; color: var(--color-text-primary); line-height: 1; margin-bottom: 8px; }
    .metric-lbl { font-size: 13px; font-weight: 500; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    
    .metric-val.warn { color: var(--color-warning); }
    .metric-val.danger { color: var(--color-danger); }
    .metric-val.ok { color: var(--color-success); }

    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem; }
    .card { background: var(--color-background-primary); border: 1px solid var(--color-border-tertiary); border-radius: var(--border-radius-xl); padding: 1.75rem; box-shadow: var(--shadow-sm); }
    .card h3 { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px; }

    .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .bar-label { font-size: 13px; font-weight: 500; color: var(--color-text-secondary); width: 170px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-transform: capitalize; }
    .bar-track { flex: 1; background: var(--color-background-tertiary); border-radius: 6px; height: 10px; overflow: hidden; position: relative; }
    .bar-fill { height: 100%; border-radius: 6px; position: absolute; left: 0; top: 0; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
    .bar-count { font-size: 13px; font-weight: 600; color: var(--color-text-primary); width: 24px; text-align: right; flex-shrink: 0; }

    .findings-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px; }
    .findings-table th { font-size: 12px; font-weight: 600; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--color-border-secondary); }
    .findings-table td { padding: 16px; border-bottom: 1px solid var(--color-border-tertiary); color: var(--color-text-primary); vertical-align: middle; transition: background 0.15s ease; }
    .findings-table tr:last-child td { border-bottom: none; }
    .findings-table tr:hover td { background: var(--color-background-secondary); cursor: default; }

    .badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
    .badge-high { background: var(--color-danger-bg); color: var(--color-danger); }
    .badge-medium { background: var(--color-warning-bg); color: var(--color-warning); }
    .badge-low { background: var(--color-success-bg); color: var(--color-success); }
    .badge-open { background: var(--color-background-tertiary); color: var(--color-text-secondary); }
    .badge-resolved { background: var(--color-success-bg); color: var(--color-success); }
    .badge-inprog { background: var(--color-accent-pale); color: var(--color-accent); }

    .project-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: var(--border-radius-md); margin-bottom: 8px; background: var(--color-background-secondary); border: 1px solid transparent; transition: border 0.2s ease, background 0.2s ease; }
    .project-row:hover { background: var(--color-background-primary); border: 1px solid var(--color-border-primary); }
    .project-name { font-size: 14px; font-weight: 600; color: var(--color-text-primary); max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .project-meta { font-size: 12px; color: var(--color-text-secondary); margin-top: 4px; display: flex; align-items: center; gap: 6px; text-transform: capitalize; }
    .project-count { font-size: 20px; font-weight: 700; font-family: var(--font-display); color: var(--color-text-primary); }

    .chart-wrap { position: relative; width: 100%; height: 220px; display: flex; justify-content: center; }
    .legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-top: 16px; font-size: 13px; font-weight: 500; color: var(--color-text-secondary); }
    .legend-item { display: flex; align-items: center; gap: 6px; text-transform: capitalize; }
    .legend-dot { width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; }

    .full-card { background: var(--color-background-primary); border: 1px solid var(--color-border-tertiary); border-radius: var(--border-radius-xl); padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm); }
    .full-card h3 { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border-secondary); }

    .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .dot-open { background: var(--color-text-tertiary); }
    .dot-resolved { background: var(--color-success); }
    .dot-inprog { background: var(--color-accent); }

    .td-title { font-weight: 600; color: var(--color-text-primary); margin-bottom: 4px; }
    .td-desc { font-size: 12px; color: var(--color-text-secondary); }
  </style>
</head>

<body>
  <div class="container">
    <h2 class="sr-only">MAI Design Audit Dashboard</h2>

    <div class="dash-header">
      <div>
        <div class="header-title">MAI Design Ops Dashboard</div>
        <div class="header-meta">
          <span><i class="ph ph-user-circle"></i> Rakha</span>
          <span><i class="ph ph-calendar-blank"></i> <span id="dateRange">Today</span></span>
          <span><i class="ph ph-folders"></i> <span id="streamName">MAI</span> Stream</span>
        </div>
      </div>
      <div style="display:flex; gap:12px;">
        <span class="badge badge-inprog"><span class="status-dot dot-inprog"></span><span id="headerInProgress">0</span> In Progress</span>
        <span class="badge badge-open"><span class="status-dot dot-open"></span><span id="headerOpen">0</span> Open</span>
      </div>
    </div>

    <div class="metric-grid">
      <div class="metric">
        <div class="metric-val" id="metricAudits">0</div>
        <div class="metric-lbl">Audits Total</div>
      </div>
      <div class="metric">
        <div class="metric-val warn" id="metricFindings">0</div>
        <div class="metric-lbl">Total Findings</div>
      </div>
      <div class="metric">
        <div class="metric-val danger" id="metricHigh">0</div>
        <div class="metric-lbl">High Priority</div>
      </div>
      <div class="metric">
        <div class="metric-val ok" id="metricResolved">0</div>
        <div class="metric-lbl">Resolved</div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <h3><i class="ph ph-files"></i> Findings by Project</h3>
        <div id="projectsContainer"></div>
      </div>

      <div class="card">
        <h3><i class="ph ph-chart-bar"></i> Findings by Category</h3>
        <div style="margin-top: 1rem;" id="categoriesContainer"></div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <h3><i class="ph ph-warning-circle"></i> Priority Breakdown</h3>
        <div class="chart-wrap">
          <canvas id="priorityChart" role="img"></canvas>
        </div>
        <div class="legend" id="priorityLegend"></div>
      </div>
      <div class="card">
        <h3><i class="ph ph-stack"></i> Component Level Distribution</h3>
        <div class="chart-wrap">
          <canvas id="levelChart" role="img"></canvas>
        </div>
        <div class="legend" id="levelLegend"></div>
      </div>
    </div>

    <div class="full-card">
      <h3><i class="ph ph-lightning" style="color:var(--color-warning);"></i> High-Priority Action Items</h3>
      <table class="findings-table">
        <thead>
          <tr>
            <th>Finding</th>
            <th>File</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="highPriorityFindings"></tbody>
      </table>
    </div>

    <div class="full-card">
      <h3><i class="ph ph-list-dashes"></i> Complete Findings Log</h3>
      <table class="findings-table">
        <thead>
          <tr>
            <th style="width: 40%">Finding</th>
            <th style="width: 25%">File</th>
            <th style="width: 15%">Category</th>
            <th style="width: 10%">Priority</th>
            <th style="width: 10%">Status</th>
          </tr>
        </thead>
        <tbody id="allFindings"></tbody>
      </table>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"><\/script>
  <script>
    const STATIC_DATA = __INJECT_JSON_HERE__;
    
    // Aggregation Variables
    let allFindings = [];
    let highPriorityFindings = [];
    
    let totalAudits = STATIC_DATA.audits ? STATIC_DATA.audits.length : 0;
    let totalFindings = 0;
    let highPriorityCount = 0;
    let resolvedCount = 0;
    let openCount = 0;
    let inProgCount = 0;
    
    let projectStats = {};
    let categoryStats = {};
    let priorityStats = { high: 0, medium: 0, low: 0 };
    let levelStats = { atomic: 0, template: 0, compound: 0, pattern: 0, token: 0 };
    
    let dates = [];

    // Process Data
    if (STATIC_DATA.audits) {
      STATIC_DATA.audits.forEach(audit => {
        if(audit.auditDate) dates.push(new Date(audit.auditDate));
        
        const projName = audit.projectName || audit.title || 'Unknown';
        if(!projectStats[projName]) {
          projectStats[projName] = { 
            name: projName, 
            platform: audit.platform || 'Desktop', 
            status: audit.status || 'open', 
            count: 0 
          };
        }
        
        if (audit.findings && audit.findings.length > 0) {
          audit.findings.forEach(f => {
            totalFindings++;
            projectStats[projName].count++;
            
            const findingObj = {
              title: f.title || 'Untitled Finding',
              desc: f.description || '',
              file: audit.fileName || audit.title || 'Unknown File',
              project: projName,
              cat: (f.category || 'other').toLowerCase(),
              priority: (f.priority || 'low').toLowerCase(),
              status: (f.status || 'open').toLowerCase(),
              rec: f.recommendation || ''
            };
            
            allFindings.push(findingObj);
            
            // Priority
            if (priorityStats[findingObj.priority] !== undefined) {
              priorityStats[findingObj.priority]++;
            } else {
              priorityStats.low++;
            }
            
            if (findingObj.priority === 'high') {
              highPriorityCount++;
              highPriorityFindings.push(findingObj);
            }
            
            // Status
            if (findingObj.status === 'resolved') resolvedCount++;
            else if (findingObj.status === 'in_progress' || findingObj.status === 'in progress') inProgCount++;
            else openCount++;
            
            // Category
            if (!categoryStats[findingObj.cat]) categoryStats[findingObj.cat] = 0;
            categoryStats[findingObj.cat]++;
            
            // Level (Guess from title/description)
            const text = (findingObj.title + ' ' + findingObj.desc + ' ' + findingObj.rec).toLowerCase();
            if(text.includes('atomic')) levelStats.atomic++;
            else if(text.includes('template')) levelStats.template++;
            else if(text.includes('compound') || text.includes('molecule')) levelStats.compound++;
            else if(text.includes('pattern') || text.includes('flow')) levelStats.pattern++;
            else if(text.includes('token') || text.includes('color') || text.includes('font')) levelStats.token++;
            else levelStats.atomic++; // default fallback
          });
        }
      });
    }

    // Populate Top Metrics
    document.getElementById('metricAudits').innerText = totalAudits;
    document.getElementById('metricFindings').innerText = totalFindings;
    document.getElementById('metricHigh').innerText = highPriorityCount;
    document.getElementById('metricResolved').innerText = resolvedCount;
    
    document.getElementById('headerOpen').innerText = openCount;
    document.getElementById('headerInProgress').innerText = inProgCount;
    
    if (dates.length > 0) {
      dates.sort((a,b) => a - b);
      const start = dates[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const end = dates[dates.length - 1].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      document.getElementById('dateRange').innerText = start === end.substring(0, start.length) ? end : start + ' – ' + end;
    }

    // Render Projects
    const projectsContainer = document.getElementById('projectsContainer');
    Object.values(projectStats).sort((a,b) => b.count - a.count).forEach(proj => {
      const icon = proj.platform.toLowerCase().includes('mobile') ? 'ph-device-mobile' : 
                   proj.platform.toLowerCase().includes('tablet') ? 'ph-device-tablet' : 'ph-monitor';
      projectsContainer.innerHTML += \`
        <div class="project-row">
          <div>
            <div class="project-name">\${proj.name}</div>
            <div class="project-meta"><i class="ph \${icon}"></i> \${proj.platform} &nbsp;·&nbsp; \${proj.status.replace('_', ' ')}</div>
          </div>
          <div class="project-count">\${proj.count}</div>
        </div>
      \`;
    });

    // Render Categories
    const categoriesContainer = document.getElementById('categoriesContainer');
    const catColors = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6B7280', '#14B8A6', '#8B5CF6'];
    let catIndex = 0;
    const sortedCats = Object.entries(categoryStats).sort((a,b) => b[1] - a[1]);
    const maxCat = sortedCats.length > 0 ? sortedCats[0][1] : 1;
    
    sortedCats.forEach(([cat, count]) => {
      const pct = (count / maxCat) * 100;
      const color = catColors[catIndex % catColors.length];
      catIndex++;
      categoriesContainer.innerHTML += \`
        <div class="bar-row">
          <div class="bar-label">\${cat}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width:\${pct}%; background:\${color};"></div>
          </div>
          <div class="bar-count">\${count}</div>
        </div>
      \`;
    });

    // Render Charts
    const chartFontFamily = "'Inter', -apple-system, sans-serif";
    
    // Priority Chart
    const pData = [priorityStats.high, priorityStats.medium, priorityStats.low];
    new Chart(document.getElementById('priorityChart'), {
      type: 'doughnut',
      data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{ data: pData, backgroundColor: ['#EF4444', '#F59E0B', '#10B981'], borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: { backgroundColor: '#111827', titleFont: { family: chartFontFamily, size: 13 }, bodyFont: { family: chartFontFamily, size: 14, weight: 'bold' }, padding: 12, cornerRadius: 8 }
        },
        cutout: '75%'
      }
    });
    
    document.getElementById('priorityLegend').innerHTML = \`
      <span class="legend-item"><span class="legend-dot" style="background:#EF4444;"></span>High (\${pData[0]})</span>
      <span class="legend-item"><span class="legend-dot" style="background:#F59E0B;"></span>Medium (\${pData[1]})</span>
      <span class="legend-item"><span class="legend-dot" style="background:#10B981;"></span>Low (\${pData[2]})</span>
    \`;

    // Level Chart
    const lData = [levelStats.atomic, levelStats.template, levelStats.compound, levelStats.pattern, levelStats.token];
    new Chart(document.getElementById('levelChart'), {
      type: 'doughnut',
      data: {
        labels: ['Atomic', 'Template', 'Compound', 'Pattern', 'Token'],
        datasets: [{ data: lData, backgroundColor: ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#6B7280'], borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: { backgroundColor: '#111827', titleFont: { family: chartFontFamily, size: 13 }, bodyFont: { family: chartFontFamily, size: 14, weight: 'bold' }, padding: 12, cornerRadius: 8 }
        },
        cutout: '75%'
      }
    });

    document.getElementById('levelLegend').innerHTML = \`
      <span class="legend-item"><span class="legend-dot" style="background:#6366F1;"></span>Atomic (\${lData[0]})</span>
      <span class="legend-item"><span class="legend-dot" style="background:#8B5CF6;"></span>Template (\${lData[1]})</span>
      <span class="legend-item"><span class="legend-dot" style="background:#10B981;"></span>Compound (\${lData[2]})</span>
      <span class="legend-item"><span class="legend-dot" style="background:#F59E0B;"></span>Pattern (\${lData[3]})</span>
      <span class="legend-item"><span class="legend-dot" style="background:#6B7280;"></span>Token (\${lData[4]})</span>
    \`;

    // Helper to format badges
    function formatCatBadge(cat) {
      let color = '#6B7280', bg = '#F3F4F6';
      if(cat.includes('extraction')) { color = 'var(--color-accent)'; bg = 'var(--color-accent-pale)'; }
      else if(cat.includes('local')) { color = '#8B5CF6'; bg = '#EDE9FE'; }
      else if(cat.includes('usage') || cat.includes('system')) { color = '#10B981'; bg = '#D1FAE5'; }
      else if(cat.includes('missing')) { color = '#F59E0B'; bg = '#FEF3C7'; }
      return \`<span class="badge" style="background:\${bg}; color:\${color}; text-transform:capitalize;">\${cat}</span>\`;
    }

    // Render High Priority Findings
    const tbodyHigh = document.getElementById('highPriorityFindings');
    highPriorityFindings.forEach(f => {
      const statusClass = f.status === 'resolved' ? 'badge-resolved' : f.status.includes('prog') ? 'badge-inprog' : 'badge-open';
      const dotClass = f.status === 'resolved' ? 'dot-resolved' : f.status.includes('prog') ? 'dot-inprog' : 'dot-open';
      
      tbodyHigh.innerHTML += \`
        <tr>
          <td>
            <div class="td-title">\${f.title}</div>
            <div class="td-desc">\${f.rec || f.desc}</div>
          </td>
          <td style="color:var(--color-text-secondary); font-size:13px;">\${f.file}</td>
          <td>\${formatCatBadge(f.cat)}</td>
          <td><span class="badge \${statusClass}"><span class="status-dot \${dotClass}"></span><span style="text-transform:capitalize;">\${f.status.replace('_',' ')}</span></span></td>
        </tr>
      \`;
    });
    
    if (highPriorityFindings.length === 0) {
      tbodyHigh.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--color-text-tertiary);">No high priority findings!</td></tr>';
    }

    // Render All Findings
    const tbodyAll = document.getElementById('allFindings');
    allFindings.forEach(f => {
      const priorityClass = f.priority === 'high' ? 'badge-high' : f.priority === 'medium' ? 'badge-medium' : 'badge-low';
      const statusClass = f.status === 'resolved' ? 'badge-resolved' : f.status.includes('prog') ? 'badge-inprog' : 'badge-open';
      const dotClass = f.status === 'resolved' ? 'dot-resolved' : f.status.includes('prog') ? 'dot-inprog' : 'dot-open';
      
      tbodyAll.innerHTML += \`
        <tr>
          <td>
            <div class="td-title">\${f.title}</div>
            <div class="td-desc">\${f.desc}</div>
          </td>
          <td style="color:var(--color-text-secondary); font-size:13px;">\${f.file}</td>
          <td>\${formatCatBadge(f.cat)}</td>
          <td><span class="badge \${priorityClass}" style="text-transform:capitalize;">\${f.priority}</span></td>
          <td><span class="badge \${statusClass}"><span class="status-dot \${dotClass}"></span><span style="text-transform:capitalize;">\${f.status.replace('_',' ')}</span></span></td>
        </tr>
      \`;
    });
    
    if (allFindings.length === 0) {
      tbodyAll.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--color-text-tertiary);">No findings available!</td></tr>';
    }
  <\/script>
</body>
</html>`;

const finalHtml = template.replace('__INJECT_JSON_HERE__', rawData);
fs.writeFileSync('mai_audit_dashboard.html', finalHtml);
console.log('Successfully generated dynamic mai_audit_dashboard.html from mai-audit-data.json!');
