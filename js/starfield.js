/**
 * ====================================================================
 *  STARFIELD & COSMIC PARTICLE CANVAS ENGINE
 * ====================================================================
 *  Renders multi-layered starfields, shooting stars, nebula dust,
 *  and the warp speed transition effect.
 * ====================================================================
 */

class CosmicStarfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = (this.canvas.width = window.innerWidth);
    this.height = (this.canvas.height = window.innerHeight);

    this.stars = [];
    this.shootingStars = [];
    this.nebulaClouds = [];
    
    // Warp speed state
    this.isWarping = false;
    this.warpProgress = 0;

    // Mouse parallax
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.targetMouseX = this.width / 2;
    this.targetMouseY = this.height / 2;

    this.init();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  init() {
    this.stars = [];
    const starCount = Math.floor((this.width * this.height) / 3200);

    const colors = [
      '#ffffff',
      '#f6d89a', // starlight gold
      '#bae6fd', // icy cyan
      '#e9d5ff', // celestial violet
      '#fffbeb'  // warm white
    ];

    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 1000,
        radius: Math.random() * 1.5 + 0.3,
        baseAlpha: Math.random() * 0.7 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        layer: Math.random() < 0.2 ? 'foreground' : 'background'
      });
    }

    // Nebula dust centers
    this.nebulaClouds = [
      { x: this.width * 0.2, y: this.height * 0.3, radius: 350, color: 'rgba(168, 85, 247, 0.04)' },
      { x: this.width * 0.8, y: this.height * 0.65, radius: 450, color: 'rgba(56, 189, 248, 0.035)' },
      { x: this.width * 0.5, y: this.height * 0.9, radius: 400, color: 'rgba(246, 216, 154, 0.025)' }
    ];

    // Schedule spontaneous shooting stars
    this.scheduleSpontaneousMeteors();
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
    });
  }

  scheduleSpontaneousMeteors() {
    const nextMeteorIn = Math.random() * 6000 + 4000;
    setTimeout(() => {
      this.spawnShootingStar();
      this.scheduleSpontaneousMeteors();
    }, nextMeteorIn);
  }

  spawnShootingStar(customStartX, customStartY) {
    const startX = customStartX !== undefined ? customStartX : Math.random() * this.width * 0.8;
    const startY = customStartY !== undefined ? customStartY : Math.random() * (this.height * 0.4);
    const length = Math.random() * 160 + 100;
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2; // approx 45 degrees
    const speed = Math.random() * 14 + 18;

    this.shootingStars.push({
      x: startX,
      y: startY,
      length: length,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      opacity: 1,
      fadeSpeed: 0.015,
      thickness: Math.random() * 2 + 1.2,
      color: Math.random() > 0.4 ? '#f6d89a' : '#ffffff'
    });
  }

  triggerWarpSpeed(durationMs = 1500, callback) {
    this.isWarping = true;
    const startTime = performance.now();

    const warpInterval = () => {
      const elapsed = performance.now() - startTime;
      this.warpProgress = Math.min(elapsed / durationMs, 1);

      if (this.warpProgress < 1) {
        requestAnimationFrame(warpInterval);
      } else {
        setTimeout(() => {
          this.isWarping = false;
          this.warpProgress = 0;
          if (callback) callback();
        }, 300);
      }
    };
    requestAnimationFrame(warpInterval);
  }

  animate(time) {
    // Smooth mouse parallax interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    const offsetX = (this.mouseX - this.width / 2) * 0.02;
    const offsetY = (this.mouseY - this.height / 2) * 0.02;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Nebula Clouds
    for (const cloud of this.nebulaClouds) {
      const grad = this.ctx.createRadialGradient(
        cloud.x + offsetX * 0.5, cloud.y + offsetY * 0.5, 0,
        cloud.x + offsetX * 0.5, cloud.y + offsetY * 0.5, cloud.radius
      );
      grad.addColorStop(0, cloud.color);
      grad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // 2. Draw Stars (with Warp Speed logic)
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      if (this.isWarping) {
        // Warp streaks stretching outward from screen center
        const warpMultiplier = Math.sin(this.warpProgress * Math.PI) * 45;
        const angle = Math.atan2(star.y - centerY, star.x - centerX);
        const tailLength = Math.max(2, warpMultiplier * (star.layer === 'foreground' ? 3 : 1.5));

        const endX = star.x + Math.cos(angle) * tailLength;
        const endY = star.y + Math.sin(angle) * tailLength;

        this.ctx.beginPath();
        this.ctx.strokeStyle = star.color;
        this.ctx.lineWidth = star.radius * (1 + this.warpProgress * 1.5);
        this.ctx.moveTo(star.x, star.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // Move star outward faster
        star.x += Math.cos(angle) * (warpMultiplier * 0.8 + 2);
        star.y += Math.sin(angle) * (warpMultiplier * 0.8 + 2);

        // Wrap around boundary
        if (star.x < 0 || star.x > this.width || star.y < 0 || star.y > this.height) {
          star.x = centerX + (Math.random() - 0.5) * 200;
          star.y = centerY + (Math.random() - 0.5) * 200;
        }
      } else {
        // Normal gentle twinkling state with subtle parallax
        const px = star.layer === 'foreground' ? offsetX * 1.5 : offsetX * 0.5;
        const py = star.layer === 'foreground' ? offsetY * 1.5 : offsetY * 0.5;

        const currentAlpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.35;
        const clampedAlpha = Math.max(0.15, Math.min(1, currentAlpha));

        this.ctx.beginPath();
        this.ctx.arc(star.x + px, star.y + py, star.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = star.color;
        this.ctx.globalAlpha = clampedAlpha;
        this.ctx.fill();

        // Extra corona stardust glow for foreground stars
        if (star.layer === 'foreground') {
          this.ctx.beginPath();
          this.ctx.arc(star.x + px, star.y + py, star.radius * 2.8, 0, Math.PI * 2);
          this.ctx.fillStyle = star.color;
          this.ctx.globalAlpha = clampedAlpha * 0.15;
          this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
      }
    }

    // 3. Draw Shooting Stars / Meteors
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const meteor = this.shootingStars[i];

      const grad = this.ctx.createLinearGradient(
        meteor.x, meteor.y,
        meteor.x - meteor.dx * (meteor.length / meteor.speed),
        meteor.y - meteor.dy * (meteor.length / meteor.speed)
      );
      grad.addColorStop(0, meteor.color);
      grad.addColorStop(0.3, 'rgba(246, 216, 154, 0.6)');
      grad.addColorStop(1, 'transparent');

      this.ctx.beginPath();
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = meteor.thickness;
      this.ctx.lineCap = 'round';
      this.ctx.moveTo(meteor.x, meteor.y);
      this.ctx.lineTo(
        meteor.x - meteor.dx * (meteor.length / meteor.speed),
        meteor.y - meteor.dy * (meteor.length / meteor.speed)
      );
      this.ctx.stroke();

      // Meteor head spark
      this.ctx.beginPath();
      this.ctx.arc(meteor.x, meteor.y, meteor.thickness * 1.8, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = '#f6d89a';
      this.ctx.shadowBlur = 12;
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // reset

      meteor.x += meteor.dx;
      meteor.y += meteor.dy;
      meteor.opacity -= meteor.fadeSpeed;

      if (meteor.opacity <= 0 || meteor.x > this.width + 100 || meteor.y > this.height + 100) {
        this.shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(this.animate);
  }
}

window.CosmicStarfield = CosmicStarfield;
