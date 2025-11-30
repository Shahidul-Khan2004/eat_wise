document.addEventListener('DOMContentLoaded', init);

let ALL = [];
let API = '';

function init(){
  API = getApi();
  bindFilters();
  load();
}

function getApi(){
  const base = 'https://eat-wise-silk.vercel.app';
  return `${base}/api/foodItems/`;
}

async function load(){
  const list = document.getElementById('items');
  list.innerHTML = '<p style="color:#6b7280;padding:20px;text-align:center;">⏳ Loading food items...</p>';
  const data = await fetch(API).then(r=>r.json());
  const items = Array.isArray(data) ? data : (data.results || []);
  ALL = items.map(x=>({
    id: x.id,
    name: x.name || `Item ${x.id||''}`,
    category: x.category || 'Uncategorized',
    days: Number(x.expirationTimeDays ?? 0),
    cost: x.costPerUnit != null ? String(x.costPerUnit) : '—'
  }));
  fillCategories(ALL);
  render();
}

function bindFilters(){
  ['q','category','expiry'].forEach(id=>{
    const el = document.getElementById(id);
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  const refresh = document.getElementById('refreshBtn');
  if (refresh) refresh.addEventListener('click', load);
}

function fillCategories(items){
  const sel = document.getElementById('category');
  const cur = sel.value || 'all';
  const cats = Array.from(new Set(items.map(i=>i.category))).sort();
  sel.innerHTML = `<option value="all">All categories</option>` + cats.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  sel.value = cur;
}

function render(){
  const list = document.getElementById('items');
  const q = document.getElementById('q').value.trim().toLowerCase();
  const cat = document.getElementById('category').value;
  const exp = document.getElementById('expiry').value;

  const filtered = ALL.filter(i=>{
    if(q && !i.name.toLowerCase().includes(q)) return false;
    if(cat !== 'all' && i.category !== cat) return false;
    if(exp === 'soon7' && !(i.days <= 7)) return false;
    if(exp === 'soon30' && !(i.days <= 30)) return false;
    if(exp === 'later' && !(i.days > 30)) return false;
    return true;
  });

  list.innerHTML = filtered.map(card).join('');
  list.querySelectorAll('.item').forEach(el=>{
    el.addEventListener('click',()=>{
      const id = Number(el.getAttribute('data-id'));
      const item = filtered.find(i=>i.id===id) || ALL.find(i=>i.id===id);
      showDetails(item);
    });
  });
}

function card(i){
  const label = `${i.days} day${i.days===1?'':'s'}`;
  return `
  <li class="item" data-id="${i.id}">
    <h3>${escapeHtml(i.name)}</h3>
    <div class="meta">
      <span class="badge">${escapeHtml(i.category)}</span>
      <span class="badge">${label}</span>
      <span class="badge">${escapeHtml(String(i.cost))} tk</span>
    </div>
  </li>`;
}

function showDetails(i){
  if(!i) return;
  document.getElementById('d-name').textContent = i.name;
  document.getElementById('d-category').textContent = i.category;
  document.getElementById('d-cost').textContent = `${i.cost} tk`;
  document.getElementById('d-exp').textContent = `${i.days} day${i.days===1?'':'s'}`;
  document.getElementById('details').hidden = false;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'
  })[m]);
}
