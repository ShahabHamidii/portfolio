// Every feature below is wrapped in its own try/catch so that if one part
// fails in a given browser, it can't silently take the rest of the page
// down with it (each block used to run inline after the previous one).
document.addEventListener("DOMContentLoaded", () => {
  safe("theme toggle", initThemeToggle);
  safe("footer year", initFooterYear);
  safe("mobile nav", initMobileNav);
  safe("scrollspy", initScrollspy);
  safe("scroll reveal", initScrollReveal);
  safe("skills", initSkills);
  safe("custom cursor", initCustomCursor);
  safe("hero canvas", initHeroCanvas);
  safe("typewriter", initTypewriter);
  safe("terminal", initTerminal);
  safe("back to top", initBackToTop);
});

function safe(label, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[portfolio] "${label}" failed to initialize:`, err);
  }
}

// ---------- Theme toggle (persisted, respects system preference on first visit) ----------
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }
}

function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ---------- Mobile nav toggle ----------
function initMobileNav() {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }
}

// ---------- Scrollspy: highlight active nav link ----------
function initScrollspy() {
  const sections = document.querySelectorAll(".section");
  const navItems = document.querySelectorAll(".nav-link");
  if (!sections.length) return;
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navItems.forEach((link) => {
            link.classList.toggle("active", link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));
}

// ---------- Generic scroll-reveal for cards & sections ----------
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    ".reveal, .project-card, .mini-project-card, .job-card, .edu-card, .contact-card, .info-card, .main-card"
  );
  if (!revealEls.length) return;
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
    revealObserver.observe(el);
  });
}

// ---------- Skills: tabs + bars that re-animate every time they scroll into view ----------
function initSkills() {
  const tabs = document.querySelectorAll(".skill-tab");
  const panels = document.querySelectorAll(".skill-panel");
  if (!tabs.length || !panels.length) return;

  function resetBars(panel) {
    if (!panel) return;
    panel.querySelectorAll(".skill-bar-fill").forEach((fill) => {
      fill.style.transition = "none";
      fill.style.width = "0%";
      void fill.offsetWidth; // force reflow so the next width change transitions again
      fill.style.transition = "";
    });
  }
  function fillBars(panel) {
    if (!panel) return;
    panel.querySelectorAll(".skill-bar-fill").forEach((fill) => {
      const level = fill.getAttribute("data-level");
      requestAnimationFrame(() => requestAnimationFrame(() => (fill.style.width = level + "%")));
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = document.getElementById(tab.dataset.target);
      panel.classList.add("active");
      resetBars(panel);
      fillBars(panel);
    });
  });

  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const activePanel = document.querySelector(".skill-panel.active");
          if (entry.isIntersecting) fillBars(activePanel);
          else resetBars(activePanel);
        });
      },
      { threshold: 0.3 }
    );
    skillObserver.observe(skillsSection);
  }
}

// ---------- Custom cursor: diamond marker + text caret ----------
function initCustomCursor() {
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!isFinePointer) return;
  const cursor = document.getElementById("cx-cursor");
  if (!cursor) return;

  const TEXT_SELECTOR = "p, h1, h2, h3, h4, li, span:not(.cx-cursor *)";
  const INTERACTIVE_SELECTOR = "a, button, .skill-tab, .contact-card";

  document.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const interactive = el.closest(INTERACTIVE_SELECTOR);
    const textEl = !interactive && el.closest(TEXT_SELECTOR);
    cursor.classList.toggle("is-hover", !!interactive);
    cursor.classList.toggle("is-text", !!textEl);
  });
  document.addEventListener("mousedown", () => cursor.classList.add("is-down"));
  document.addEventListener("mouseup", () => cursor.classList.remove("is-down"));
  document.addEventListener("mouseleave", () => document.body.classList.add("cx-hidden"));
  document.addEventListener("mouseenter", () => document.body.classList.remove("cx-hidden"));
}

// ---------- Hero background: dot/line constellation that connects to the cursor ----------
function initHeroCanvas() {
  const heroCanvas = document.getElementById("hero-canvas");
  const heroSection = document.getElementById("home");
  if (!heroCanvas || !heroSection) return;
  const ctx = heroCanvas.getContext("2d");
  if (!ctx) return;

  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let points = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let running = false;
  let rafId = null;

  const LINK_DIST = 130;
  const MOUSE_DIST = 190;
  const COUNT_DENSITY = 16000;

  let colors = { dot: "rgba(120, 190, 255, 0.75)", link: "93, 170, 255", mouseLink: "89, 224, 201" };
  function updateColors() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    colors = isLight
      ? { dot: "rgba(47, 127, 224, 0.55)", link: "47, 127, 224", mouseLink: "13, 154, 134" }
      : { dot: "rgba(120, 190, 255, 0.75)", link: "93, 170, 255", mouseLink: "89, 224, 201" };
  }
  updateColors();
  document.addEventListener("themechange", updateColors);

  function resize() {
    const rect = heroSection.getBoundingClientRect();
    w = rect.width; h = rect.height;
    if (w <= 0 || h <= 0) return;
    heroCanvas.width = Math.round(w * dpr);
    heroCanvas.height = Math.round(h * dpr);
    heroCanvas.style.width = w + "px";
    heroCanvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(18, Math.min(55, Math.round((w * h) / COUNT_DENSITY)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    points.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = colors.dot;
      ctx.fill();
    });

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = `rgba(${colors.link}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (mouse.active) {
      points.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_DIST) {
          const alpha = (1 - dist / MOUSE_DIST) * 0.85;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${colors.mouseLink}, ${alpha})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      });
    }
  }

  function loop() {
    if (!running) { rafId = null; return; }
    draw();
    rafId = requestAnimationFrame(loop);
  }
  function start() {
    if (w <= 0 || h <= 0) resize();
    if (running) return;
    running = true;
    if (!rafId) rafId = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function onMouseMove(e) {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouse.active = x >= 0 && y >= 0 && x <= w && y <= h;
    mouse.x = x; mouse.y = y;
  }
  function onMouseLeave() { mouse.active = false; }

  resize();
  window.addEventListener("resize", () => safe("hero canvas resize", resize));
  document.addEventListener("mousemove", onMouseMove);
  heroSection.addEventListener("mouseleave", onMouseLeave);

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { resize(); start(); }
        else stop();
      });
    },
    { threshold: 0.05 }
  );
  heroObserver.observe(heroSection);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) start();
    }
  });

  // Kick things off immediately if the hero is already on screen at load.
  const initialRect = heroSection.getBoundingClientRect();
  if (initialRect.bottom > 0 && initialRect.top < window.innerHeight) start();
}

// ---------- Hero subtitle: rotating typewriter of short bio lines ----------
function initTypewriter() {
  const twEl = document.getElementById("typewriter");
  const twDataEl = document.getElementById("typewriter-data");
  if (!twEl) return;

  let lines = [
    "Building Scalable Backend Applications",
    "RESTful API Developer",
    "Clean Architecture Enthusiast",
    "Python · Django · PostgreSQL · Docker",
  ];
  if (twDataEl) {
    try {
      const parsed = JSON.parse(twDataEl.textContent);
      if (Array.isArray(parsed) && parsed.length) lines = parsed;
    } catch (e) {
      // fall back to the default lines above
    }
  }

  let lineIndex = 0, charIndex = 0, deleting = false;
  const TYPE_SPEED = 42, DELETE_SPEED = 24, HOLD = 1600, GAP = 350;

  function tick() {
    const current = lines[lineIndex];
    if (!deleting) {
      charIndex++;
      twEl.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        setTimeout(tick, HOLD);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      twEl.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
        setTimeout(tick, GAP);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }
  setTimeout(tick, 500);
}

// ---------- Terminal: types a short session, then loops forever ----------
function initTerminal() {
  const termBody = document.getElementById("terminal-body");
  if (!termBody) return;

  const termLines = [
    { type: "cmd", text: "whoami" },
    { type: "out", text: "shahab_hamidi — backend developer" },
    { type: "cmd", text: "cat stack.txt" },
    { type: "out", text: "python · django · drf · postgres · docker · git" },
    { type: "cmd", text: "./run --focus" },
    { type: "out", text: "building clean, secure, well-modeled APIs." },
    { type: "cmd", text: "status" },
    { type: "key", text: "open to backend opportunities ✓" },
  ];
  const speed = 26;

  function runSession() {
    termBody.innerHTML = "";
    let li = 0, ci = 0;

    function typeNext() {
      if (li >= termLines.length) {
        setTimeout(runSession, 2600);
        return;
      }
      const line = termLines[li];
      if (ci === 0) {
        const p = document.createElement("div");
        if (line.type === "cmd") p.innerHTML = '<span class="prompt">$ </span><span class="cmd-text"></span>';
        else p.innerHTML = `<span class="${line.type === "key" ? "key" : "out"}"></span>`;
        termBody.appendChild(p);
      }
      const target = termBody.lastChild.querySelector(line.type === "cmd" ? ".cmd-text" : "span");
      if (ci < line.text.length) {
        target.textContent += line.text[ci];
        ci++;
        setTimeout(typeNext, line.type === "cmd" ? speed : speed / 2);
      } else {
        li++; ci = 0;
        setTimeout(typeNext, 260);
      }
    }
    typeNext();
  }
  setTimeout(runSession, 500);
}

// ---------- Back to top button ----------
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 600);
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
