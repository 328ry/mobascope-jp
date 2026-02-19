(() => {
  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  let lastScroll = window.scrollY;

  const isMobileNav = () => window.matchMedia('(max-width: 960px)').matches;

  const updateNavState = () => {
    if (!nav) return;

    if (isMobileNav()) {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else if (!nav.dataset.locked) {
        nav.classList.remove('scrolled');
      }

      if (window.scrollY > lastScroll && window.scrollY > 100) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
    } else {
      nav.classList.remove('hidden');
      nav.classList.add('scrolled');
      navLinks?.classList.remove('open');
    }

    lastScroll = window.scrollY;
  };

  window.addEventListener('scroll', updateNavState, { passive: true });
  window.addEventListener('resize', updateNavState);
  updateNavState();

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', navLinks.classList.contains('open') ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  const fadeItems = document.querySelectorAll('.fade-in');
  if (fadeItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.16 }
    );

    fadeItems.forEach((item) => observer.observe(item));
  }

  const filterBlocks = document.querySelectorAll('[data-filter-group]');
  filterBlocks.forEach((block) => {
    const buttons = block.querySelectorAll('.filter-btn');
    const items = block.querySelectorAll('[data-category]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const value = btn.dataset.filter;

        items.forEach((item) => {
          if (value === 'all' || item.dataset.category.includes(value)) {
            item.classList.remove('hidden-item');
          } else {
            item.classList.add('hidden-item');
          }
        });
      });
    });
  });

  const newsList = document.querySelector('[data-news-list]');
  const loadMore = document.querySelector('[data-load-more]');
  if (newsList && loadMore) {
    const hiddenItems = [...newsList.querySelectorAll('[data-page="2"]')];
    loadMore.addEventListener('click', () => {
      hiddenItems.forEach((item) => item.classList.remove('hidden-item'));
      loadMore.classList.add('hidden-item');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
