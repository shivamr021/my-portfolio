document.addEventListener('DOMContentLoaded', () => {
  // ===== Sticky header handling =====
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let headerHeight = header.offsetHeight;

  // Add scrolled class to header for styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Intersection observer for active nav links
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (link && entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {
    rootMargin: `-${headerHeight}px 0px -55% 0px`,
    threshold: 0.01
  });
  sections.forEach(s => observer.observe(s));
  window.addEventListener('resize', () => { headerHeight = header.offsetHeight; });

  // ===== Footer year =====
  const currentYear = String(new Date().getFullYear());
  document.getElementById('yearFooter').textContent = currentYear;

  // ===== Projects filter =====
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.project');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    const key = chip.dataset.filter;
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').split(' ');
      const show = key === 'all' || tags.includes(key);
      card.style.display = show ? '' : 'none';
    });
  }));
  document.querySelector('.filter-chip[data-filter="all"]')?.click();

  // ===== Contact form submission =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const statusEl = document.getElementById('formStatus');
      const submitBtn = form.querySelector('button[type="submit"]');

      statusEl.textContent = 'Sending…';
      statusEl.className = 'form-status'; // Reset classes
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
          }),
        });

        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.error || `Server error: ${response.status}`);
        }

        await response.json();
        statusEl.textContent = 'Message sent successfully!';
        statusEl.classList.add('success');
        form.reset();
      } catch (error) {
        console.error('Failed to send email:', error);
        statusEl.textContent = 'Something went wrong. Please try again.';
        statusEl.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        setTimeout(() => {
          statusEl.textContent = 'I usually reply within a day.';
          statusEl.className = 'form-status';
        }, 5000);
      }
    });
  }

  // ===== Animated counters =====
  (() => {
    const counters = document.querySelectorAll('.count');
    if (!counters.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        if (!ent.isIntersecting) return;
        const el = ent.target; const target = +el.dataset.to;
        let v = 0; const duration = 900; const start = performance.now();
        function step(t) {
          const k = Math.min(1, (t - start) / duration);
          v = Math.floor(target * (0.5 - 0.5 * Math.cos(Math.PI * k)));
          el.textContent = v;
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: .6 });
    counters.forEach(c => obs.observe(c));
  })();

  // ===== Skills: Constellation <-> Grid toggle =====
  (() => {
    const btns = document.querySelectorAll('[data-skillview]');
    const constBox = document.getElementById('skillsConstellation');
    const grid = document.getElementById('skillsGrid');

    function setView(mode) {
      btns.forEach(b => b.classList.toggle('is-active', b.dataset.skillview === mode));
      const isConst = mode === 'constellation';
      constBox.classList.toggle('hidden', !isConst);
      grid.classList.toggle('hidden', isConst);
      localStorage.setItem('skills-view', mode);

      document.dispatchEvent(new CustomEvent('skillsviewchange', { detail: { mode } }));
    }

    setView(localStorage.getItem('skills-view') || 'grid'); // Default to grid view
    btns.forEach(b => b.addEventListener('click', () => setView(b.dataset.skillview)));
  })();

  // ===== Constellation Canvas =====
  (function () {
    const cvs = document.getElementById('constellation');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const legend = document.getElementById('legend');
    const wrapper = cvs.closest('.constellation-wrapper');

    const nodes = [
      { label: 'Python', lvl: 4.5, tier: 'core' },
      { label: 'Django', lvl: 4.4, tier: 'core' },
      { label: 'Pandas', lvl: 4.1, tier: 'core' },
      { label: 'LangChain', lvl: 3.8, tier: 'ai' },
      { label: 'Ollama', lvl: 3.7, tier: 'ai' },
      { label: 'RAG Agents', lvl: 3.6, tier: 'ai' },
      { label: 'TensorFlow', lvl: 3.2, tier: 'ai' },
      { label: 'Bootstrap', lvl: 3.4, tier: 'builder' },
      { label: 'Streamlit', lvl: 3.6, tier: 'builder' },
      { label: 'API Integrations', lvl: 3.9, tier: 'builder' }
    ];

    const state = {
      dpr: 1, w: 0, h: 0,
      pts: [],
      mouse: { x: 0, y: 0, active: false },
      focus: -1,
      running: true,
      margin: 36
    };

    function sizeCanvas() {
      const r = wrapper.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      state.dpr = Math.min(2, window.devicePixelRatio || 1);
      cvs.style.width = r.width + 'px';
      cvs.style.height = r.height + 'px';
      cvs.width = Math.floor(r.width * state.dpr);
      cvs.height = Math.floor(r.height * state.dpr);
      state.w = r.width; state.h = r.height;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    }

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    function initPoints() {
      const innerW = state.w - state.margin * 2;
      const innerH = state.h - state.margin * 2;
      const R = Math.min(innerW, innerH) * 0.38;
      state.pts = nodes.map((n, i) => {
        const a = (i / nodes.length) * Math.PI * 2;
        return {
          n,
          r: R * (0.55 + 0.35 * Math.random()),
          a,
          s: (0.0008 + Math.random() * 0.0016) * (Math.random() < .5 ? -1 : 1),
          x: 0, y: 0
        };
      });
    }

    function drawBackground() {
      const grd = ctx.createLinearGradient(0, 0, state.w, state.h);
      grd.addColorStop(0, 'rgba(0,0,0,0.20)');
      grd.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, state.w, state.h);
    }

    function positionLegend() {
      if (!legend) return;
      legend.innerHTML = '';
      state.pts.forEach((p, idx) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'absolute text-xs glass rounded-full px-2 py-1';
        el.style.left = `${p.x + 10}px`;
        el.style.top = `${p.y - 8}px`;
        el.textContent = p.n.label;
        el.tabIndex = 0;
        el.addEventListener('mouseenter', () => state.focus = idx);
        el.addEventListener('mouseleave', () => state.focus = -1);
        el.addEventListener('click', () => state.focus = (state.focus === idx ? -1 : idx));
        legend.appendChild(el);
      });
    }

    function draw() {
      if (!state.running) return;
      ctx.clearRect(0, 0, state.w, state.h);
      drawBackground();

      const cx = state.w / 2, cy = state.h / 2;
      const minX = state.margin, maxX = state.w - state.margin;
      const minY = state.margin, maxY = state.h - state.margin;

      state.pts.forEach((p, idx) => {
        p.a += (state.focus === idx ? p.s * 0.35 : p.s);
        p.x = clamp(cx + Math.cos(p.a) * p.r, minX, maxX);
        p.y = clamp(cy + Math.sin(p.a) * p.r, minY, maxY);

        if (state.mouse.active) {
          const dx = p.x - state.mouse.x, dy = p.y - state.mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const pull = (140 - dist) / 140 * 8;
            p.x = clamp(p.x + (dx / dist) * pull, minX, maxX);
            p.y = clamp(p.y + (dy / dist) * pull, minY, maxY);
          }
        }
      });

      for (let i = 0; i < state.pts.length; i++) {
        for (let j = i + 1; j < state.pts.length; j++) {
          const a = state.pts[i], b = state.pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const MAX = 160;
          if (d < MAX) {
            const o = (1 - d / MAX) * ((state.focus === i || state.focus === j) ? 0.9 : 0.55);
            ctx.strokeStyle = `rgba(169, 156, 255,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      state.pts.forEach((p, idx) => {
        const rad = 4 + p.n.lvl;
        const fill = (idx === state.focus) ? '#00e5ff' : (p.n.tier === 'ai' ? '#ffd166' : '#A99CFF');
        ctx.shadowColor = fill; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = fill; ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
      });

      positionLegend();
      requestAnimationFrame(draw);
    }

    function refresh(shouldReinit = false) {
      sizeCanvas();
      if (shouldReinit) initPoints();
    }

    function setMouse(e) {
      const rect = cvs.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
      if (clientX == null || clientY == null) return;
      state.mouse.x = clientX - rect.left;
      state.mouse.y = clientY - rect.top;
      state.mouse.active = true;
    }
    cvs.addEventListener('mousemove', setMouse);
    cvs.addEventListener('mouseleave', () => state.mouse.active = false);
    cvs.addEventListener('touchstart', setMouse, { passive: true });
    cvs.addEventListener('touchmove', setMouse, { passive: true });
    cvs.addEventListener('touchend', () => state.mouse.active = false);

    const ro = new ResizeObserver(() => {
      const wasW = state.w, wasH = state.h;
      refresh(false);
      if (Math.abs(state.w - wasW) > 10 || Math.abs(state.h - wasH) > 10) {
        initPoints();
      }
    });
    if (wrapper) ro.observe(wrapper);

    document.addEventListener('skillsviewchange', (e) => {
      if (e.detail?.mode === 'constellation') {
        requestAnimationFrame(() => {
          refresh(true);
        });
      }
    });

    refresh(true);
    draw();
    window.addEventListener('resize', () => refresh(false));
  })();
});

