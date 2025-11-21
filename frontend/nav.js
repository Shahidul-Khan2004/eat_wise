document.addEventListener('DOMContentLoaded', () => {
  // Ensure body gets layout class for navbar styling override
  document.body.classList.add('with-nav');
  
  // Add special class for home page
  const current = location.pathname.split('/').pop() || 'index.html';
  if (current === 'index.html') {
    document.body.classList.add('home-page');
  }
  const navRoot = document.getElementById('navbar');
  if(!navRoot) return;

  const isLoggedIn = !!localStorage.getItem('accessToken');
  const links = [];

  // Common link
  links.push({ href: 'index.html', label: 'Home' });

  // Resources is public (no backend change needed) so always show it
  links.push({ href: 'resources.html', label: 'Resources' });

  if(!isLoggedIn){
    links.push({ href: 'register.html', label: 'Register' });
    links.push({ href: 'login.html', label: 'Login' });
  } else {
    links.push({ href: 'profile.html', label: 'Profile' });
    links.push({ href: 'inventory.html', label: 'Inventory' });
  }

  const current = location.pathname.split('/').pop() || 'index.html';

  const frag = document.createDocumentFragment();
  links.forEach(l => {
    const a = document.createElement('a');
    a.href = l.href;
    a.textContent = l.label;
    if(l.href === current) a.classList.add('active');
    frag.appendChild(a);
  });

  const spacer = document.createElement('div');
  spacer.className = 'spacer';
  frag.appendChild(spacer);

  if(isLoggedIn){
    const btn = document.createElement('button');
    btn.className = 'logout';
    btn.type = 'button';
    btn.textContent = 'Logout';
    btn.addEventListener('click', () => {
      try { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); } catch(_){}
      location.href = 'login.html';
    });
    frag.appendChild(btn);
  }

  navRoot.appendChild(frag);
});
