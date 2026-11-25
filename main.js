/* =====================================================================
   NIKOLA RADESKI REVERSE-ENGINEERED PORTFOLIO ENGINE
   Powered by Lenis (Smooth Momentum) + GSAP & ScrollTrigger
   Preloader is handled inline in index.html for zero-cache-miss guarantee
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------------------------------------------------------------------
     1. LENIS ULTRA-SMOOTH MOMENTUM SCROLLING (IDENTICAL TO NIKOLA)
  --------------------------------------------------------------------- */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false
    });

    // Synchronize Lenis with GSAP ScrollTrigger ticker
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Smooth Anchor Navigation via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -20, duration: 1.2 });
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     2. LIVE REAL-TIME CLOCK (CHENNAI, INDIA IST UTC+5:30)
  --------------------------------------------------------------------- */
  (function initLiveClock() {
    const clockEl = document.getElementById('istClock');
    if (!clockEl) return;

    function updateClock() {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      clockEl.textContent = formatter.format(now);
    }

    updateClock();
    setInterval(updateClock, 1000);
  })();

  /* ---------------------------------------------------------------------
     3. HERO SECTION ENTRANCE & PARALLAX (SYNCHRONIZED WITH PRELOADER)
  --------------------------------------------------------------------- */
  (function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    // Create paused timeline so it doesn't execute behind the black preloader screen
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

    // Staggered cinematic hero entrance
    tl.fromTo('.hero-col-left', 
      { opacity: 0, x: -40 }, 
      { opacity: 1, x: 0, duration: 1.15 }
    )
    .fromTo('.hero-portrait-card', 
      { opacity: 0, scale: 0.93, y: 30 }, 
      { opacity: 1, scale: 1, y: 0, duration: 1.25 }, 
      '-=0.85'
    )
    .fromTo('.hero-col-right', 
      { opacity: 0, x: 40 }, 
      { opacity: 1, x: 0, duration: 1.15 }, 
      '-=0.95'
    )
    .fromTo('.hero-kicker-pill, .live-time-pill, .hero-subline-pill', 
      { opacity: 0, y: 16 }, 
      { opacity: 1, y: 0, duration: 0.85, stagger: 0.14 }, 
      '-=0.65'
    );

    function playHero() {
      // Smooth 100ms offset so the black curtain begins dissolving as hero motion starts
      setTimeout(() => {
        tl.play();
      }, 100);
    }

    // Coordinate with preloader lifecycle
    const preloader = document.getElementById('preloader');
    const isPreloaderActive = preloader && !sessionStorage.getItem('preloaderShown') && document.body.classList.contains('preloader-active');

    if (window.__heroEntranceTriggered) {
      playHero();
    } else if (isPreloaderActive) {
      window.addEventListener('heroEntranceTrigger', playHero, { once: true });
    } else {
      playHero();
    }

    // Subtle scroll parallax on hero portrait image
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to('.hero-portrait-card img', {
        y: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  })();

  /* ---------------------------------------------------------------------
     4. KINETIC SCROLL-SCRUB WORD ILLUMINATION (GSAP SCROLLTRIGGER)
  --------------------------------------------------------------------- */
  (function initScrollScrub() {
    const container = document.getElementById('scrubStatement');
    if (!container) return;

    const rawText = container.textContent.trim();
    const words = rawText.split(/\s+/);
    container.innerHTML = '';

    const wordEls = [];

    words.forEach((word, idx) => {
      const span = document.createElement('span');
      span.className = 'scrub-word';
      // Append trailing space INSIDE span for universal spacing
      span.textContent = word + (idx < words.length - 1 ? ' ' : '');
      
      const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (['deterministic', '262', 'scale', 'resilient', 'correctness', 'production'].includes(clean)) {
        span.classList.add('accent-word');
      }
      container.appendChild(span);
      wordEls.push(span);
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 82%',
          end: 'bottom 45%',
          scrub: 0.8,
        }
      });

      scrubTl.to(wordEls, {
        opacity: 1,
        stagger: {
          each: 0.04,
          ease: 'power1.inOut'
        },
        onUpdate: function() {
          wordEls.forEach((el) => {
            const currentOpacity = parseFloat(gsap.getProperty(el, 'opacity'));
            if (currentOpacity > 0.65) {
              if (el.classList.contains('accent-word')) {
                el.style.color = 'var(--accent)';
              } else {
                el.style.color = 'var(--text-dark)';
              }
            } else {
              el.style.color = 'var(--text-dark)';
            }
          });
        }
      });
    } else {
      // Fallback scroll listener
      function updateScrub() {
        const rect = container.getBoundingClientRect();
        const winH = window.innerHeight;
        const start = winH * 0.85;
        const end = winH * 0.35;
        const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
        const count = Math.floor(progress * wordEls.length);

        wordEls.forEach((span, idx) => {
          if (idx <= count) {
            span.style.opacity = '1';
            span.style.color = span.classList.contains('accent-word') ? 'var(--accent)' : 'var(--text-dark)';
          } else {
            span.style.opacity = '0.18';
            span.style.color = 'var(--text-dark)';
          }
        });
      }
      window.addEventListener('scroll', updateScrub, { passive: true });
      updateScrub();
    }
  })();

  /* ---------------------------------------------------------------------
     5. STICKY CAPABILITIES SPLIT CONTROLLER WITH SMOOTH PREVIEW SWAP
  --------------------------------------------------------------------- */
  (function initCapabilitiesSplit() {
    const cards = document.querySelectorAll('.capability-card');
    const previewCard = document.getElementById('stickyPreviewCard');
    const terminalTitle = document.getElementById('spTerminalTitle');
    const badge = document.getElementById('spBadge');
    const heading = document.getElementById('spHeading');
    const codeBox = document.getElementById('spCodeBox');
    const stack = document.getElementById('spStack');

    if (!cards.length || !previewCard) return;

    const previewData = [
      {
        termTitle: 'kural-ava-fsm // inspect',
        badge: 'DETERMINISTIC FSM AGENT',
        heading: 'KURAL-AVA Banking Engine',
        code: `// Finite State Machine Invariants\nstate: <span class="hl-g">AUTH_CONFIRMED</span>\nintent: <span class="hl-b">DISPATCH_TRANSFER</span>\nsafety_guard: <span class="hl-g">STRICT_DETERMINISTIC</span>\ntests_passing: <span class="hl-c">262 / 262 verified</span>\ntelemetry: <span class="hl-g">0ms hallucination risk</span>`,
        stack: 'FastAPI · React 19 · TS 5.8'
      },
      {
        termTitle: 'retinal-topology // networkx',
        badge: 'BIOMEDICAL VISION & GRAPH AI',
        heading: 'Vascular Network Stability',
        code: `// Graph Laplacian Perturbation\nnodes: <span class="hl-b">1,420 bifurcations</span>\nedges: <span class="hl-b">2,110 vessels</span>\nalgorithm: <span class="hl-g">Haar + Spectral Cluster</span>\nrobustness: <span class="hl-c">0.94 topological stability</span>\ninference: <span class="hl-g">real-time OpenCV pipeline</span>`,
        stack: 'OpenCV · NetworkX · ResNet-18'
      },
      {
        termTitle: 'fullstack-architecture // docker',
        badge: 'SCALABLE RELATIONAL BACKEND',
        heading: 'High-Throughput Web Engine',
        code: `// Relational Schema & ORM Model\nengine: <span class="hl-b">SQLAlchemy 2.0 Async</span>\nmigrations: <span class="hl-g">Alembic Versioned</span>\nauth: <span class="hl-c">JWT + Role-Based Access</span>\nfrontend: <span class="hl-g">React 19 Concurrent</span>\nstatus: <span class="hl-b">Strict OpenAPI 3.1 Spec</span>`,
        stack: 'React 19 · TypeScript · Node.js'
      },
      {
        termTitle: 'mentiscope-iitm // cognitive',
        badge: 'NIRMAAN IIT MADRAS INCUBATED',
        heading: 'CHC Psychometric Platform',
        code: `// Clinical Cognitive Stimulus Pipeline\nframework: <span class="hl-c">CHC Theory (Gs/Gv-Sp)</span>\ncombinations: <span class="hl-g">5,000+ stimuli generated</span>\nlatency: <span class="hl-b">&lt; 18ms per interaction</span>\nvalidation: <span class="hl-g">Report v4.57.0 Verified</span>\nincubation: <span class="hl-c">NIRMAAN, IIT Madras</span>`,
        stack: 'Python · Psychometrics · Data'
      },
      {
        termTitle: 'regression-pipeline // scikit',
        badge: 'PREDICTIVE COMPENSATION ML',
        heading: 'Salary Regression Model',
        code: `// K-Fold Cross-Validation Matrix\nmodel: <span class="hl-g">Ensemble Gradient Regressor</span>\nmetric_r2: <span class="hl-c">0.92 cross-validation</span>\nfeatures: <span class="hl-b">Engineered Experience & Level</span>\ninterpretability: <span class="hl-g">SHAP Feature Insights</span>\nlatency: <span class="hl-b">4ms batch scoring</span>`,
        stack: 'Scikit-learn · Pandas · NumPy'
      },
      {
        termTitle: 'pytest-suite // verification',
        badge: 'TEST-DRIVEN PRECISION',
        heading: '262 Tests Passing Suite',
        code: `// Pytest Verification Telemetry\ntests_collected: <span class="hl-c">262 items</span>\nstatus: <span class="hl-g">262 passed in 1.42s (100%)</span>\ncoverage: <span class="hl-g">96% branch coverage</span>\nfail_fast: <span class="hl-b">Strict Invariant Asserts</span>\ndefense: <span class="hl-c">Deterministic Error Fallbacks</span>`,
        stack: 'pytest · CI/CD · TDD Engineering'
      }
    ];

    let currentIndex = 0;

    function activateCard(index) {
      if (index === currentIndex && cards[index].classList.contains('active')) return;
      currentIndex = index;

      cards.forEach((c, idx) => c.classList.toggle('active', idx === index));
      const data = previewData[index] || previewData[0];

      // Smooth GSAP transition on terminal card
      if (typeof gsap !== 'undefined') {
        gsap.to(previewCard, {
          opacity: 0.6,
          scale: 0.98,
          duration: 0.15,
          ease: 'power2.in',
          onComplete: () => {
            terminalTitle.textContent = data.termTitle;
            badge.textContent = data.badge;
            heading.textContent = data.heading;
            codeBox.innerHTML = data.code;
            stack.textContent = data.stack;

            gsap.to(previewCard, {
              opacity: 1,
              scale: 1,
              duration: 0.25,
              ease: 'power2.out'
            });
          }
        });
      } else {
        terminalTitle.textContent = data.termTitle;
        badge.textContent = data.badge;
        heading.textContent = data.heading;
        codeBox.innerHTML = data.code;
        stack.textContent = data.stack;
      }
    }

    cards.forEach((card, idx) => {
      card.addEventListener('click', () => activateCard(idx));
    });

    // Auto-switch as cards scroll past
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.preview, 10);
          if (!isNaN(idx)) activateCard(idx);
        }
      });
    }, { rootMargin: '-20% 0px -40% 0px' });

    cards.forEach(card => observer.observe(card));

    // Staggered reveal for capability cards
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo('.capability-card', 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.capabilities-list',
            start: 'top 82%'
          }
        }
      );
    }
  })();

  /* ---------------------------------------------------------------------
     6. PROJECTS GRID ENTRANCE REVEAL (GSAP)
  --------------------------------------------------------------------- */
  (function initProjectsReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.fromTo('.project-card', 
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 85%'
        }
      }
    );
  })();

  /* ---------------------------------------------------------------------
     7. AWARDS & CREDIBILITY TABLE REVEAL (GSAP)
  --------------------------------------------------------------------- */
  (function initAwardsReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.fromTo('.award-row', 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.awards-table',
          start: 'top 85%'
        }
      }
    );
  })();

  /* ---------------------------------------------------------------------
     8. CAREER TIMELINE: SIGNATURE NIKOLA BLUR-FADE-IN ANIMATION
  --------------------------------------------------------------------- */
  (function initTimelineBlurFade() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      items.forEach((item) => {
        gsap.fromTo(item, 
          { opacity: 0, filter: 'blur(8px)', y: 30 },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 86%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }

    // Interactive lens focus based on screen center
    function updateLens() {
      const centerY = window.innerHeight / 2;
      let closestItem = null;
      let minDistance = Infinity;

      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenterY = rect.top + rect.height / 2;
        const dist = Math.abs(centerY - itemCenterY);

        if (dist < minDistance) {
          minDistance = dist;
          closestItem = item;
        }
      });

      items.forEach(item => {
        item.classList.toggle('lens-focus', item === closestItem);
      });
    }

    window.addEventListener('scroll', updateLens, { passive: true });
    updateLens();
  })();

  /* ---------------------------------------------------------------------
     9. REVIEWS GRID STAGGERED REVEAL (GSAP)
  --------------------------------------------------------------------- */
  (function initReviewsReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.fromTo('.review-card', 
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.reviews-grid',
          start: 'top 85%'
        }
      }
    );
  })();

  /* ---------------------------------------------------------------------
     10. FLOATING DOCK NAVBAR DYNAMICS & CONTACT SLIDE FLIP
  --------------------------------------------------------------------- */
  (function initDockNav() {
    const dockCta = document.getElementById('dockCta');
    const contactSection = document.getElementById('contact');
    const links = document.querySelectorAll('.dock-link');
    const sections = document.querySelectorAll('section[id]');

    // Contact Observer: flips orange CTA -> white "Hello, it's me"
    if (contactSection && dockCta) {
      const contactObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            dockCta.classList.add('in-contact');
          } else {
            dockCta.classList.remove('in-contact');
          }
        });
      }, { threshold: 0.25 });
      contactObs.observe(contactSection);
    }

    // Scroll active link updater
    function updateActiveDock() {
      const scrollPos = window.scrollY + 320;
      let currentSectionId = '';

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const h = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + h) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      links.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${currentSectionId}`);
      });
    }

    window.addEventListener('scroll', updateActiveDock, { passive: true });
    updateActiveDock();
  })();

  /* ---------------------------------------------------------------------
     11. FAQ ACCORDION INTERACTION WITH ROTATING ICON
  --------------------------------------------------------------------- */
  (function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  })();

  /* ---------------------------------------------------------------------
     12. TOAST NOTIFICATION & COPY EMAIL
  --------------------------------------------------------------------- */
  window.showToast = function(msg) {
    const toast = document.getElementById('toastNotice');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'vinaykartheek.bathala@gmail.com';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Copied email to clipboard!');
        });
      } else {
        showToast('vinaykartheek.bathala@gmail.com');
      }
    });
  }

  /* ---------------------------------------------------------------------
     13. BACK TO TOP BUTTON WITH LENIS SMOOTH INTEGRATION
  --------------------------------------------------------------------- */
  (function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 450);
    }, { passive: true });

    btn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.4 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  })();

  /* ---------------------------------------------------------------------
     14. MAGNETIC CURSOR MICRO-INTERACTION (NIKOLA SIGNATURE DETAIL)
  --------------------------------------------------------------------- */
  (function initMagneticButtons() {
    // Only apply on fine-pointer devices (desktop mice, not touchscreens)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const magnets = document.querySelectorAll('.dock-cta-btn, .pill-btn-dark, .proj-link-arrow, .back-to-top-btn');
      magnets.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translate(0px, 0px)';
          el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          setTimeout(() => { el.style.transition = ''; }, 400);
        });
      });
    }
  })();

});
