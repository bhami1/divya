/**
 * ====================================================================
 *  HER OWN LITTLE UNIVERSE — MAIN CONTROLLER
 * ====================================================================
 *  Hydrates data, orchestrates landing warp transition, cursor trail,
 *  scroll animations, and interactive shooting stars.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.UNIVERSE_CONFIG;
  if (!config) {
    console.error('Universe config not loaded.');
    return;
  }

  // 1. Initialize Starfield Canvas
  const starfield = new CosmicStarfield('starfield-canvas');

  // 2. Hydrate Dynamic Page Content
  hydrateContent(config);

  // 3. Initialize Constellation Gallery & Lightbox
  const constellation = new ConstellationManager();

  // 4. Setup Custom Cosmic Cursor
  setupCosmicCursor();

  // 5. Setup Landing Screen Transition
  setupLandingTransition(starfield);

  // 6. Setup Audio Toggle
  setupAudioToggle();

  // 7. Setup "Release a Shooting Star" Action
  setupShootingStarTrigger(starfield);

  // 8. Setup Scroll Reveals
  setupScrollReveals();
});

/**
 * Hydrates all static sections from config.js
 */
function hydrateContent(cfg) {
  // Opening Landing Screen
  const lProlog1 = document.getElementById('landing-prologue-1');
  const lProlog2 = document.getElementById('landing-prologue-2');
  const lName = document.getElementById('landing-name');
  const lSub = document.getElementById('landing-subheading');
  const lBtn = document.getElementById('enter-universe-btn');
  const lTag = document.getElementById('landing-coords-tag');

  if (lProlog1) lProlog1.textContent = cfg.landing.prologueLine1;
  if (lProlog2) lProlog2.textContent = cfg.landing.prologueLine2;
  if (lName) lName.textContent = cfg.landing.nameReveal;
  if (lSub) lSub.innerHTML = `${cfg.landing.subheading.replace('DIVYA', '<strong class="highlight-gold">DIVYA</strong>')} <span class="spark">✦</span>`;
  if (lBtn) lBtn.querySelector('.btn-label').textContent = cfg.landing.enterButtonText;
  if (lTag) lTag.textContent = cfg.landing.cosmicTag;

  // Her Universe (Centerpiece)
  const cBadge = document.getElementById('centerpiece-badge');
  const cIntro = document.getElementById('centerpiece-intro');
  const cName = document.getElementById('centerpiece-name');
  const cImg = document.getElementById('centerpiece-img');
  const cList = document.getElementById('centerpiece-manifesto');
  const cBio = document.getElementById('centerpiece-bio');
  const cStats = document.getElementById('centerpiece-stats');

  if (cBadge) cBadge.textContent = cfg.centerpiece.sectionTag;
  if (cIntro) cIntro.textContent = cfg.centerpiece.introText;
  if (cName) cName.textContent = cfg.centerpiece.name;
  if (cImg) {
    cImg.src = encodeURI(cfg.centerpiece.photo);
    cImg.alt = cfg.centerpiece.photoAlt;
  }

  if (cList) {
    cList.innerHTML = '';
    cfg.centerpiece.titles.forEach((title, idx) => {
      const li = document.createElement('li');
      const isLast = idx === cfg.centerpiece.titles.length - 1;
      li.className = `hero-manifesto-item ${isLast ? 'highlight-friend' : ''}`;
      li.innerHTML = `
        <span class="manifesto-bullet">✦</span>
        <span>${title}</span>
      `;
      cList.appendChild(li);
    });
  }

  if (cBio) cBio.textContent = cfg.centerpiece.bioDescription;

  if (cStats) {
    cStats.innerHTML = '';
    cfg.centerpiece.stats.forEach((stat) => {
      const chip = document.createElement('div');
      chip.className = 'stat-chip';
      chip.innerHTML = `
        <div class="stat-header">
          <span>${stat.label}</span>
          <span class="stat-unit">${stat.unit}</span>
        </div>
        <div class="stat-value">${stat.value}</div>
      `;
      cStats.appendChild(chip);
    });
  }

  // Physics × Her Cards
  const pGrid = document.getElementById('physics-grid');
  if (pGrid) {
    pGrid.innerHTML = '';
    cfg.physicsCards.forEach((card, index) => {
      const el = document.createElement('div');
      el.className = 'physics-card';
      el.dataset.index = index;

      el.innerHTML = `
        <div>
          <div class="card-top-bar">
            <span class="card-badge">${card.badge}</span>
            <span class="card-icon-glyph">${card.icon}</span>
          </div>
          <div class="card-symbol">${card.symbol}</div>
          <h3 class="card-title">${card.title}</h3>
          <p class="card-quote">“${card.quote}”</p>
        </div>
        <div class="card-footer-note">✦ ${card.formulaNote}</div>
      `;

      el.addEventListener('mouseenter', () => {
        if (window.CosmicAudio) {
          window.CosmicAudio.playStarlightChime(1.1 + index * 0.08);
        }
      });

      pGrid.appendChild(el);
    });
  }

  // Celestial Wishes / Birthday Letter
  const wBadge = document.getElementById('wishes-badge');
  const wHeading = document.getElementById('wishes-heading');
  const wSub = document.getElementById('wishes-sub');
  const wParagraphs = document.getElementById('letter-paragraphs');
  const wSig = document.getElementById('wishes-signature');
  const wBtn = document.getElementById('btn-make-wish');

  if (wBadge) wBadge.textContent = cfg.wishes.sectionTag;
  if (wHeading) wHeading.textContent = cfg.wishes.heading;
  if (wSub) wSub.textContent = cfg.wishes.subtitle;

  if (wParagraphs) {
    wParagraphs.innerHTML = '';
    cfg.wishes.letterText.forEach((pText, i) => {
      const p = document.createElement('p');
      p.className = `letter-p ${i === 0 ? 'salutation' : ''}`;
      p.textContent = pText;
      wParagraphs.appendChild(p);
    });
  }

  if (wSig) wSig.textContent = cfg.wishes.signature;
  if (wBtn) wBtn.querySelector('.btn-wish-label').textContent = cfg.wishes.actionButton;

  // Footer
  const fQuote = document.getElementById('footer-quote');
  const fAuthor = document.getElementById('footer-author');
  const fDedication = document.getElementById('footer-dedication');

  if (fQuote) fQuote.textContent = cfg.footer.quote;
  if (fAuthor) fAuthor.textContent = cfg.footer.author;
  if (fDedication) fDedication.textContent = cfg.footer.dedication;
}

/**
 * Setup Landing Screen "Enter Her Universe" Transition
 */
function setupLandingTransition(starfield) {
  const enterBtn = document.getElementById('enter-universe-btn');
  const openingScreen = document.getElementById('opening-screen');
  const heroSection = document.getElementById('her-universe');

  if (!enterBtn || !openingScreen) return;

  enterBtn.addEventListener('click', () => {
    // Play warp sound and start cosmic ambient soundscape
    if (window.CosmicAudio) {
      window.CosmicAudio.playWarpSound();
      window.CosmicAudio.startAmbience();
    }

    // Trigger warp speed streak effect on canvas
    starfield.triggerWarpSpeed(1400, () => {
      openingScreen.classList.add('universe-entered');
      
      // Smoothly focus/scroll to hero
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Re-trigger constellation line calculation after unhiding
      setTimeout(() => {
        if (window.ConstellationManager) {
          const c = new window.ConstellationManager();
          c.drawConstellationLines();
        }
      }, 600);
    });
  });
}

/**
 * Custom Cosmic Cursor with Smooth Inertia
 */
function setupCosmicCursor() {
  const dot = document.querySelector('.cursor-dot');
  const trail = document.querySelector('.cursor-trail');
  if (!dot || !trail) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  const renderCursor = () => {
    trailX += (mouseX - trailX) * 0.18;
    trailY += (mouseY - trailY) * 0.18;
    trail.style.left = `${trailX}px`;
    trail.style.top = `${trailY}px`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Hover expansion on interactive items
  const interactives = document.querySelectorAll('button, a, .photo-star-card, .physics-card');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      trail.style.transform = 'translate(-50%, -50%) scale(1.6)';
      trail.style.borderColor = 'rgba(246, 216, 154, 0.8)';
      dot.style.transform = 'translate(-50%, -50%) scale(1.4)';
    });
    el.addEventListener('mouseleave', () => {
      trail.style.transform = 'translate(-50%, -50%) scale(1)';
      trail.style.borderColor = 'rgba(246, 216, 154, 0.35)';
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

/**
 * Ambient Audio Toggle Button
 */
function setupAudioToggle() {
  const btn = document.getElementById('audio-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (window.CosmicAudio) {
      window.CosmicAudio.toggle();
    }
  });
}

/**
 * "Release a Shooting Star" Button Interaction
 */
function setupShootingStarTrigger(starfield) {
  const btn = document.getElementById('btn-make-wish');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Spawn 2 cascading shooting stars across canvas
    starfield.spawnShootingStar(window.innerWidth * 0.2, window.innerHeight * 0.2);
    setTimeout(() => {
      starfield.spawnShootingStar(window.innerWidth * 0.5, window.innerHeight * 0.1);
    }, 250);

    if (window.CosmicAudio) {
      window.CosmicAudio.playStarlightChime(1.5);
    }

    // Button feedback pulse
    const originalText = btn.querySelector('.btn-wish-label').textContent;
    btn.querySelector('.btn-wish-label').textContent = 'Star Released Across The Cosmos ✦';
    btn.style.background = 'rgba(246, 216, 154, 0.25)';
    btn.style.boxShadow = '0 0 40px rgba(246, 216, 154, 0.6)';

    setTimeout(() => {
      btn.querySelector('.btn-wish-label').textContent = originalText;
      btn.style.background = '';
      btn.style.boxShadow = '';
    }, 2800);
  });
}

/**
 * Scroll Reveal Animations (Intersection Observer)
 */
function setupScrollReveals() {
  const elements = document.querySelectorAll('.photo-star-card, .physics-card, .wishes-parchment, .hero-grid');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
