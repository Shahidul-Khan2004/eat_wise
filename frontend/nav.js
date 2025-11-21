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

  // Logo as home link
  const logoLink = document.createElement('a');
  logoLink.href = 'index.html';
  logoLink.className = 'nav-logo-link';
  logoLink.innerHTML = '<img src="eatwiselogo2.png" alt="EatWise" class="nav-logo" />';
  navRoot.appendChild(logoLink);

  // Resources and inventory are public (no backend change needed) so always show them
  links.push({ href: 'resources.html', label: 'Resources' });
  links.push({ href: 'inventory.html', label: 'Inventory' });

  // Don't show register/login in navbar on home page (hero has buttons)
  const isHomePage = current === 'index.html';
  
  if(!isLoggedIn){
    if (!isHomePage) {
      links.push({ href: 'register.html', label: 'Register' });
      links.push({ href: 'login.html', label: 'Login' });
    }
  } else {
    // Show profile for logged-in users
    links.push({ href: 'profile.html', label: 'Profile' });
  }

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
