function getAccess(){return localStorage.getItem('accessToken')||''}
function authHeader(){const t=getAccess();return t?{"Authorization":"Bearer "+t}:{} }

async function loadProfile(){
  const msg=document.getElementById('msg');
  msg.textContent='Loading...'; msg.className='';
  const apiBase='https://eat-wise-silk.vercel.app/api/profile/';
  try{
    const res=await fetch(apiBase,{headers:{...authHeader()}});
    if(!res.ok){msg.textContent='Failed to load profile'; msg.className='err'; return;}
    const data=await res.json();
    const f=document.getElementById('profileForm');
    f.householdSize.value=data.householdSize||1;
    f.dietaryPreferences.value=data.dietaryPreferences||'';
    f.location.value=data.location||'';
    f.budgetRange.value=data.budgetRange||'';
    // populate non-editable name/email from localStorage when available
    const displayName = document.getElementById('displayName');
    const displayEmail = document.getElementById('displayEmail');
    const storedName = localStorage.getItem('username') || '';
    const storedEmail = localStorage.getItem('email') || '';
    displayName.value = storedName;
    displayEmail.value = storedEmail;
    msg.textContent='';
  }catch(e){msg.textContent='Network error'; msg.className='err';}
}

document.addEventListener('DOMContentLoaded',()=>{
  const f=document.getElementById('profileForm');
  const msg=document.getElementById('msg');

  if(!getAccess()){
    msg.textContent='Not logged in. Redirecting...'; msg.className='err';
    setTimeout(()=>location.href='login.html',800);
    return;
  }

  // show stored name/email immediately (will be overwritten if profile fetch provides others)
  const displayName = document.getElementById('displayName');
  const displayEmail = document.getElementById('displayEmail');
  if(displayName) displayName.value = localStorage.getItem('username') || '';
  if(displayEmail) displayEmail.value = localStorage.getItem('email') || '';

  loadProfile();

  f.addEventListener('submit',async(e)=>{
    e.preventDefault();
    msg.textContent='Saving...'; msg.className='';
    const body={
      householdSize: parseInt(f.householdSize.value,10)||1,
      dietaryPreferences: f.dietaryPreferences.value.trim(),
      location: f.location.value.trim(),
      budgetRange: f.budgetRange.value.trim()
    };
    const apiBase='https://eat-wise-silk.vercel.app/api/profile/';
    try{
      const res=await fetch(apiBase,{
        method:'PATCH',
        headers:{'Content-Type':'application/json',...authHeader()},
        body: JSON.stringify(body)
      });
      if(!res.ok){let txt='Save failed'; try{txt=await res.text()}catch(_){ }; msg.textContent=txt; msg.className='err'; return;}
      msg.textContent='Saved'; msg.className='ok';
    }catch(err){msg.textContent='Network error'; msg.className='err';}
  });

  // Inventory & Consumption functionality
  const apiBase = `${location.protocol}//${location.hostname}:8000/api`;
  
  // Load food items for dropdowns
  async function loadFoodItems() {
    try {
      const res = await fetch(`${apiBase}/foodItems/`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  // Populate food item dropdowns
  async function populateFoodDropdowns() {
    const items = await loadFoodItems();
    const invSelect = document.getElementById('invFoodItem');
    const consSelect = document.getElementById('consFoodItem');
    
    const options = items.map(item => 
      `<option value="${item.id}">${item.name} (${item.category})</option>`
    ).join('');
    
    if (invSelect) invSelect.innerHTML = '<option value="">Select food item</option>' + options;
    if (consSelect) consSelect.innerHTML = '<option value="">Select food item</option>' + options;
  }

  // Load user inventory
  async function loadInventory() {
    const list = document.getElementById('inventoryList');
    try {
      const res = await fetch(`${apiBase}/userInventory/`, {headers: authHeader()});
      if (!res.ok) { list.innerHTML = '<p class="muted">Failed to load inventory</p>'; return; }
      const items = await res.json();
      
      if (items.length === 0) {
        list.innerHTML = '<p class="muted">No items in inventory yet.</p>';
        return;
      }
      
      list.innerHTML = items.map(item => `
        <div class="inv-item" style="border:1px solid #e5e7eb; padding:12px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${item.food_item_name}</strong> - ${item.quantity} ${item.unit}
            ${item.expiry_date ? `<span style="color:#6b7280;"> (Expires: ${item.expiry_date})</span>` : ''}
          </div>
          <button onclick="deleteInventory(${item.id})" style="background:#bc4749; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Delete</button>
        </div>
      `).join('');
    } catch {
      list.innerHTML = '<p class="muted">Error loading inventory</p>';
    }
  }

  // Load consumption logs
  async function loadConsumption() {
    const list = document.getElementById('consumptionList');
    try {
      const res = await fetch(`${apiBase}/consumptionLogs/`, {headers: authHeader()});
      if (!res.ok) { list.innerHTML = '<p class="muted">Failed to load consumption history</p>'; return; }
      const logs = await res.json();
      
      if (logs.length === 0) {
        list.innerHTML = '<p class="muted">No consumption logs yet.</p>';
        return;
      }
      
      list.innerHTML = logs.map(log => `
        <div class="cons-item" style="border:1px solid #e5e7eb; padding:12px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${log.food_item_name}</strong> - ${log.quantity_consumed} ${log.unit}
            <span style="color:#6b7280;"> (${log.consumption_date})</span>
            ${log.notes ? `<div style="font-size:13px; color:#6b7280; margin-top:4px;">${log.notes}</div>` : ''}
          </div>
          <button onclick="deleteConsumption(${log.id})" style="background:#bc4749; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Delete</button>
        </div>
      `).join('');
    } catch {
      list.innerHTML = '<p class="muted">Error loading consumption history</p>';
    }
  }

  // Show/hide forms
  document.getElementById('addInventoryBtn').addEventListener('click', () => {
    document.getElementById('addInventoryForm').style.display = 'block';
  });
  document.getElementById('cancelInvBtn').addEventListener('click', () => {
    document.getElementById('addInventoryForm').style.display = 'none';
    document.getElementById('inventoryForm').reset();
  });

  document.getElementById('logConsumptionBtn').addEventListener('click', () => {
    document.getElementById('logConsumptionForm').style.display = 'block';
  });
  document.getElementById('cancelConsBtn').addEventListener('click', () => {
    document.getElementById('logConsumptionForm').style.display = 'none';
    document.getElementById('consumptionForm').reset();
  });

  // Add to inventory
  document.getElementById('inventoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      food_item: parseInt(document.getElementById('invFoodItem').value),
      quantity: parseFloat(document.getElementById('invQuantity').value),
      unit: document.getElementById('invUnit').value.trim(),
      expiry_date: document.getElementById('invExpiry').value || null
    };
    
    try {
      const res = await fetch(`${apiBase}/userInventory/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', ...authHeader()},
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        document.getElementById('addInventoryForm').style.display = 'none';
        document.getElementById('inventoryForm').reset();
        loadInventory();
      } else {
        alert('Failed to add item');
      }
    } catch {
      alert('Network error');
    }
  });

  // Log consumption
  document.getElementById('consumptionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      food_item: parseInt(document.getElementById('consFoodItem').value),
      quantity_consumed: parseFloat(document.getElementById('consQuantity').value),
      unit: document.getElementById('consUnit').value.trim(),
      notes: document.getElementById('consNotes').value.trim() || null
    };
    
    try {
      const res = await fetch(`${apiBase}/consumptionLogs/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', ...authHeader()},
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        document.getElementById('logConsumptionForm').style.display = 'none';
        document.getElementById('consumptionForm').reset();
        loadConsumption();
      } else {
        alert('Failed to log consumption');
      }
    } catch {
      alert('Network error');
    }
  });

  // Delete functions (global so onclick works)
  window.deleteInventory = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      const res = await fetch(`${apiBase}/userInventory/${id}/`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (res.ok) loadInventory();
      else alert('Failed to delete');
    } catch {
      alert('Network error');
    }
  };

  window.deleteConsumption = async (id) => {
    if (!confirm('Delete this log?')) return;
    try {
      const res = await fetch(`${apiBase}/consumptionLogs/${id}/`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (res.ok) loadConsumption();
      else alert('Failed to delete');
    } catch {
      alert('Network error');
    }
  };

  // Initialize
  populateFoodDropdowns();
  loadInventory();
  loadConsumption();
});
