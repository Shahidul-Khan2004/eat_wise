(function(){
  // Only run on resources page
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  if (currentPage !== 'resources.html') return;

  const apiBase = (location.protocol === 'file:' || !location.hostname)
    ? 'http://127.0.0.1:8000/api'
    : `${location.protocol}//${location.hostname}:8000/api`;

  const els = {};
  document.addEventListener('DOMContentLoaded', () => {
    els.grid = document.getElementById('res-grid');
    els.msg = document.getElementById('res-msg');
    els.q = document.getElementById('res-q');
    els.category = document.getElementById('res-category');
    els.type = document.getElementById('res-type');
    els.refresh = document.getElementById('res-refresh');

    const bind = () => {
      els.q.addEventListener('input', scheduleFilter);
      els.category.addEventListener('change', filterAndRender);
      els.type.addEventListener('change', filterAndRender);
      els.refresh.addEventListener('click', () => load(true));
    };

    bind();
    load();
  });

  let all = [];
  let filterTimer;
  function scheduleFilter(){
    clearTimeout(filterTimer);
    filterTimer = setTimeout(filterAndRender, 180);
  }

  async function load(force=false){
    if(!force && all.length) return filterAndRender();
    setStatus('Loading resources...');
    try {
      const res = await fetch(`${apiBase}/resources/manage/`);
      if(!res.ok) throw new Error('Server responded ' + res.status);
      all = await res.json();
      populateSelects();
      filterAndRender();
      setStatus('');
    } catch(err){
      setStatus('Failed to load: ' + err.message);
    }
  }

  function setStatus(text){
    if(!els.msg) return;
    els.msg.textContent = text;
  }

  function populateSelects(){
    const categories = [...new Set(all.map(r=>r.category).filter(Boolean))].sort();
    const types = [...new Set(all.map(r=>r.type).filter(Boolean))].sort();
    fillSelect(els.category, categories, 'All categories');
    fillSelect(els.type, types, 'All types');
  }

  function fillSelect(sel, values, label){
    if(!sel) return;
    const current = sel.value;
    sel.innerHTML = `<option value="all">${label}</option>` + values.map(v=>`<option value="${v}">${v}</option>`).join('');
    if([...sel.options].some(o=>o.value===current)) sel.value=current;
  }

  function filterAndRender(){
    const q = (els.q.value||'').toLowerCase();
    const cat = els.category.value;
    const typ = els.type.value;
    const filtered = all.filter(r => {
      if(q && !r.title.toLowerCase().includes(q)) return false;
      if(cat !== 'all' && r.category !== cat) return false;
      if(typ !== 'all' && r.type !== typ) return false;
      return true;
    });
    render(filtered);
  }

  function render(list){
    if(!els.grid) return;
    els.grid.innerHTML = '';
    if(!list.length){
      els.grid.innerHTML = '<div class="res-empty">No resources match.</div>';
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(r => {
      const div = document.createElement('div');
      div.className = 'res-item';
      div.innerHTML = `
        <h2>${escapeHtml(r.title)}</h2>
        <div class="res-meta">
          <span class="res-badge">${r.category||'Uncategorized'}</span>
          <span class="res-badge">${r.type||'Type'}</span>
        </div>
        <p style="margin:0;font-size:13px;color:#374151;line-height:1.35">${escapeHtml(r.description||'')}</p>
        ${r.url ? `<a class="res-link" href="${escapeAttr(r.url)}" target="_blank" rel="noopener">Visit Link →</a>` : ''}
      `;
      frag.appendChild(div);
    });
    els.grid.appendChild(frag);
  }

  function escapeHtml(str){
    return (str||'').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt','"':'&quot;','\'':'&#39;'}[s]));
  }
  function escapeAttr(str){
    return (str||'').replace(/["][<>]/g,'');
  }
})();
