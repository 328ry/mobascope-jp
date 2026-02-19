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

  const progressBar = document.querySelector('.scroll-progress-bar');
  const updateProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(scrollTop / max, 1) : 0;
    progressBar.style.transform = `scaleX(${ratio})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const trailContainer = document.querySelector('.trail-nav');
  const trailSections = [...document.querySelectorAll('[data-trail-section]')];
  if (trailContainer && trailSections.length) {
    trailContainer.innerHTML = '';
    trailSections.forEach((section, index) => {
      if (!section.id) section.id = `trail-section-${index + 1}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'trail-dot';
      button.dataset.target = section.id;
      button.setAttribute('aria-label', section.dataset.trailLabel || `セクション${index + 1}`);
      if (index === 0) button.classList.add('active');
      trailContainer.appendChild(button);
    });

    const dots = [...trailContainer.querySelectorAll('.trail-dot')];
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const id = dot.dataset.target;
        const target = id ? document.getElementById(id) : null;
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          dots.forEach((d) => d.classList.remove('active'));
          const active = dots.find((dot) => dot.dataset.target === entry.target.id);
          active?.classList.add('active');
        });
      },
      { threshold: 0.35 }
    );
    trailSections.forEach((section) => sectionObserver.observe(section));
  }

  const storyLanes = document.querySelectorAll('.story-lane');
  storyLanes.forEach((lane) => {
    lane.addEventListener(
      'wheel',
      (event) => {
        if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
        lane.scrollLeft += event.deltaY;
        event.preventDefault();
      },
      { passive: false }
    );
  });

  const timeNode = document.querySelector('[data-live-time]');
  if (timeNode) {
    const updateLiveTime = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      timeNode.textContent = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())} JST`;
    };
    updateLiveTime();
    setInterval(updateLiveTime, 60000);
  }
})();
