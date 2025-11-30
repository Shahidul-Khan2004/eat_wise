document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('regForm');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = {
      username: form.username.value.trim(),
      password: form.password.value,
      email: form.email.value.trim(),
      householdSize: parseInt(form.householdSize.value, 10) || 1,
      dietaryPreferences: form.dietaryPreferences.value.trim(),
      location: form.location.value.trim(),
      budgetRange: form.budgetRange.value.trim(),
    };

    const apiBase = 'https://eat-wise-silk.vercel.app/api';
    // backend registration endpoint is /api/register/
    const res = await fetch(`${apiBase}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      // registration serializer returns tokens + basic user info
      try{
        const data = await res.json();
        if(data.access) localStorage.setItem('accessToken', data.access);
        if(data.refresh) localStorage.setItem('refreshToken', data.refresh);
      }catch(_){ }
      try{ localStorage.setItem('username', body.username); localStorage.setItem('email', body.email); }catch(_){ }
      msg.textContent = 'Registration successful! Redirecting to profile...';
      msg.className = 'ok';
      form.reset();
      setTimeout(()=>{ location.href='profile.html'; },700);
    } else {
      let text = '';
      try { text = await res.text(); } catch (_) {}
      msg.textContent = text || 'Registration failed.';
      msg.className = 'err';
    }
  });
});
