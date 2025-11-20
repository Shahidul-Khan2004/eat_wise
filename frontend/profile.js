function getAccess(){return localStorage.getItem('accessToken')||''}
function authHeader(){const t=getAccess();return t?{"Authorization":"Bearer "+t}:{} }

async function loadProfile(){
  const msg=document.getElementById('msg');
  msg.textContent='Loading...'; msg.className='';
  const apiBase=`${location.protocol}//${location.hostname}:8000/api/profile/`;
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
    const apiBase=`${location.protocol}//${location.hostname}:8000/api/profile/`;
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
});
