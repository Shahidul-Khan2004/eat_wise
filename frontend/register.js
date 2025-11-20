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

    const apiBase = `${location.protocol}//${location.hostname}:8000/api`;
    const res = await fetch(`${apiBase}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      msg.textContent = 'Registration successful!';
      msg.className = 'ok';
      form.reset();
    } else {
      let text = '';
      try { text = await res.text(); } catch (_) {}
      msg.textContent = text || 'Registration failed.';
      msg.className = 'err';
    }
  });
});
