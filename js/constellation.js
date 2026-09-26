/**
 * ====================================================================
 *  CONSTELLATION GALLERY & CELESTIAL LIGHTBOX
 * ====================================================================
 *  Renders photos as an irregular stellar constellation with connecting
 *  SVG lines, dynamic hover aura, and fullscreen lightbox modal.
 * ====================================================================
 */

class ConstellationManager {
  constructor() {
    this.container = document.getElementById('constellation-grid');
    this.svgContainer = document.getElementById('constellation-svg');
    this.lightbox = document.getElementById('cosmic-lightbox');
    this.currentIndex = 0;
    this.photos = window.UNIVERSE_CONFIG ? window.UNIVERSE_CONFIG.photos : [];

    this.init();
  }

  init() {
    if (!this.container || !this.photos || this.photos.length === 0) return;

    this.renderCards();
    this.setupLightbox();
    this.drawConstellationLines();

    window.addEventListener('resize', () => {
      this.drawConstellationLines();
    });

    // Re-draw lines after images finish loading
    window.addEventListener('load', () => {
      setTimeout(() => this.drawConstellationLines(), 300);
    });
  }

  renderCards() {
    this.container.innerHTML = '';

    this.photos.forEach((photo, index) => {
      const card = document.createElement('div');
      const slotClass = `card-slot-${(index % 7) + 1}`;
      card.className = `photo-star-card ${slotClass}`;
      card.dataset.index = index;

      card.innerHTML = `
        <div class="star-card-media">
          <div class="star-node-dot"></div>
          <span class="star-tag-badge">${photo.tag || 'Star'}</span>
          <img src="${encodeURI(photo.src)}" alt="${photo.title}" loading="lazy" />
        </div>
        <div class="star-card-details">
          <div class="star-date-stamp">${photo.date || 'Epoch'} ✦ [ID: α-${index + 1}]</div>
          <h3 class="star-card-title">${photo.title}</h3>
          <p class="star-card-caption">${photo.caption}</p>
        </div>
      `;

      card.addEventListener('mouseenter', () => {
        if (window.CosmicAudio) {
          window.CosmicAudio.playStarlightChime(1 + (index * 0.1));
        }
      });

      card.addEventListener('click', () => {
        this.openLightbox(index);
      });

      this.container.appendChild(card);
    });
  }

  drawConstellationLines() {
    if (!this.svgContainer) return;
    this.svgContainer.innerHTML = '';

    const cards = this.container.querySelectorAll('.photo-star-card');
    if (cards.length < 2) return;

    const containerRect = this.container.getBoundingClientRect();
    const svgRect = this.svgContainer.getBoundingClientRect();

    // Map each card's star-node-dot center point
    const points = [];
    cards.forEach((card) => {
      const dot = card.querySelector('.star-node-dot');
      if (dot) {
        const dotRect = dot.getBoundingClientRect();
        points.push({
          x: dotRect.left + dotRect.width / 2 - svgRect.left,
          y: dotRect.top + dotRect.height / 2 - svgRect.top
        });
      }
    });

    // Generate constellation connections (star sequence with occasional branch)
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [1, 4], [0, 3]
    ];

    connections.forEach(([fromIdx, toIdx]) => {
      if (points[fromIdx] && points[toIdx]) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', points[fromIdx].x);
        line.setAttribute('y1', points[fromIdx].y);
        line.setAttribute('x2', points[toIdx].x);
        line.setAttribute('y2', points[toIdx].y);
        line.setAttribute('class', 'constellation-line');
        this.svgContainer.appendChild(line);
      }
    });
  }

  setupLightbox() {
    if (!this.lightbox) return;

    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxTitle = document.getElementById('lightbox-title');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.lightboxTag = document.getElementById('lightbox-tag');
    this.lightboxMeta = document.getElementById('lightbox-meta');

    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });

    // Close on clicking backdrop
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxContent();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.CosmicAudio) {
      window.CosmicAudio.playStarlightChime(1.2);
    }
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.updateLightboxContent();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const photo = this.photos[this.currentIndex];
    if (!photo) return;

    if (this.lightboxImg) {
      this.lightboxImg.style.opacity = '0';
      this.lightboxImg.src = encodeURI(photo.src);
      this.lightboxImg.alt = photo.title;
      this.lightboxImg.onload = () => {
        this.lightboxImg.style.transition = 'opacity 0.3s ease';
        this.lightboxImg.style.opacity = '1';
      };
    }

    if (this.lightboxTitle) this.lightboxTitle.textContent = photo.title;
    if (this.lightboxCaption) this.lightboxCaption.textContent = photo.caption;
    if (this.lightboxTag) this.lightboxTag.textContent = `${photo.tag || 'Constellation Node'} ✦ [${this.currentIndex + 1}/${this.photos.length}]`;
    if (this.lightboxMeta) this.lightboxMeta.textContent = `Coordinates: RA ${(18 + this.currentIndex).toFixed(1)}h | ${photo.date || 'Stellar Epoch'}`;
  }
}

window.ConstellationManager = ConstellationManager;
