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

  const links = navLinks
    ? [...navLinks.querySelectorAll('a')].map((a) => ({ label: a.textContent.trim(), href: a.getAttribute('href') || '#' }))
    : [];

  const utilityDock = document.createElement('div');
  utilityDock.className = 'utility-dock';
  utilityDock.innerHTML = `
    <button type="button" class="dock-btn" data-dock="quick" aria-label="クイック移動">⚡ クイック</button>
    <button type="button" class="dock-btn" data-dock="random" aria-label="ランダム記事">🎲 ランダム</button>
    <button type="button" class="dock-btn" data-dock="focus" aria-label="集中モード">🌓 集中</button>
  `;
  document.body.appendChild(utilityDock);

  const quickPanel = document.createElement('div');
  quickPanel.className = 'quick-panel';
  quickPanel.innerHTML = `
    <div class="quick-panel-inner" role="dialog" aria-modal="true" aria-label="クイックナビゲーション">
      <div class="quick-panel-head">
        <strong>どこへ移動する？</strong>
        <button type="button" class="quick-close" aria-label="閉じる">✕</button>
      </div>
      <p class="quick-hint">ショートカット: <kbd>/</kbd> で開く / <kbd>Esc</kbd> で閉じる</p>
      <div class="quick-links"></div>
    </div>
  `;
  document.body.appendChild(quickPanel);

  const quickLinks = quickPanel.querySelector('.quick-links');
  links.forEach((item) => {
    const a = document.createElement('a');
    a.className = 'quick-link';
    a.href = item.href;
    a.textContent = item.label;
    quickLinks?.appendChild(a);
  });

  const closeQuickPanel = () => quickPanel.classList.remove('open');
  const openQuickPanel = () => quickPanel.classList.add('open');

  quickPanel.addEventListener('click', (e) => {
    if (e.target === quickPanel || (e.target instanceof HTMLElement && e.target.classList.contains('quick-close'))) {
      closeQuickPanel();
    }
  });

  const randomPool = [
    'news.html',
    'patch-notes.html',
    'mpl.html',
    'about.html',
    'company.html',
    'contact.html',
  ];

  const savedFocus = localStorage.getItem('mobascope_focus_mode');
  if (savedFocus === '1') document.body.classList.add('focus-mode');

  utilityDock.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.dock;

    if (action === 'quick') openQuickPanel();
    if (action === 'random') {
      const next = randomPool[Math.floor(Math.random() * randomPool.length)];
      window.location.href = next;
    }
    if (action === 'focus') {
      document.body.classList.toggle('focus-mode');
      localStorage.setItem('mobascope_focus_mode', document.body.classList.contains('focus-mode') ? '1' : '0');
    }
  });

  const isTypingField = (el) =>
    el instanceof HTMLElement &&
    (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !isTypingField(document.activeElement)) {
      event.preventDefault();
      openQuickPanel();
    }
    if (event.key === 'Escape') closeQuickPanel();
  });

  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canTilt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const tiltTargets = document.querySelectorAll('.card, .kv-card, .kv-mini, .feature-block');
    tiltTargets.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-2px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }
})();
