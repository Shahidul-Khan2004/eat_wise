document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('loginForm');
  const msg=document.getElementById('msg');

  form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    msg.textContent=''; msg.className='';

    const body={
      username: form.username.value.trim(),
      password: form.password.value
    };

    const apiBase = 'https://eat-wise-silk.vercel.app/api/auth/login/';

    try {
      const res = await fetch(apiBase,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(body)
      });
      if(!res.ok){
        let txt='Login failed.'; try{txt=await res.text()}catch(_){ };
        msg.textContent=txt; msg.className='err'; return;
      }
      const data = await res.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      // store the username so profile page can show it (non-editable)
      try{ localStorage.setItem('username', body.username); }catch(_){ }
      msg.textContent='Login successful'; msg.className='ok';
      setTimeout(()=>{ location.href='profile.html'; },600);
    } catch(err){
      msg.textContent='Network error.'; msg.className='err';
    }
  });
});
