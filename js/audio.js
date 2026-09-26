/**
 * ====================================================================
 *  COSMIC WEB AUDIO ENGINE (OFFLINE-CAPABLE AMBIENCE)
 * ====================================================================
 *  Generates an ethereal cosmic ambient synth and celestial chimes
 *  using pure Web Audio API without needing external MP3 files.
 * ====================================================================
 */

class CosmicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.filter = null;
    this.oscillators = [];
    this.lfo = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      // Low pass filter for soft cosmic warmth
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(420, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(3, this.ctx.currentTime);

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startAmbience() {
    this.initContext();
    if (this.isPlaying) return;

    // Harmonic cosmic drone frequencies (Ebm9 / Celestial chord: Eb, Bb, Db, F, G)
    const baseFreqs = [77.78, 116.54, 155.56, 174.61, 233.08];

    this.oscillators = baseFreqs.map((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Gentle detuning for spatial richness
      const detuneAmount = (idx - 2) * 5;
      osc.detune.setValueAtTime(detuneAmount, this.ctx.currentTime);

      const amp = idx === 0 ? 0.22 : 0.08 / (idx + 0.5);
      oscGain.gain.setValueAtTime(amp, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.filter);
      osc.start();

      return { osc, oscGain };
    });

    // LFO for slow breathing nebula filter sweeps
    this.lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow 12s cycle
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);

    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    this.lfo.start();

    // Fade in gracefully
    this.masterGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 3);
    this.isPlaying = true;
    this.updateUI(true);
  }

  stopAmbience() {
    if (!this.isPlaying || !this.ctx) return;

    // Fade out smoothly
    this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
    setTimeout(() => {
      this.oscillators.forEach(({ osc }) => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      if (this.lfo) {
        try { this.lfo.stop(); this.lfo.disconnect(); } catch (e) {}
      }
      this.oscillators = [];
      this.isPlaying = false;
      this.updateUI(false);
    }, 1300);
  }

  toggle() {
    if (this.isPlaying) {
      this.stopAmbience();
    } else {
      this.startAmbience();
    }
  }

  // Play celestial starlight chime when hovering/clicking stars
  playStarlightChime(pitchMultiplier = 1) {
    if (!this.isPlaying && !this.ctx) {
      // Auto initialize context on first chime click
      this.initContext();
    }
    if (!this.ctx) return;

    const chimeNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const baseNote = chimeNotes[Math.floor(Math.random() * chimeNotes.length)] * pitchMultiplier;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseNote, this.ctx.currentTime);

    // Exponential chime envelope
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.3);
  }

  // Play cinematic warp sound for entering universe
  playWarpSound() {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.6);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3500, this.ctx.currentTime + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.7);
  }

  updateUI(playing) {
    const btn = document.getElementById('audio-toggle-btn');
    const label = document.getElementById('audio-status-label');
    if (!btn) return;

    if (playing) {
      btn.classList.add('playing');
      if (label) label.textContent = 'MUSIC ON';
    } else {
      btn.classList.remove('playing');
      if (label) label.textContent = 'MUSIC OFF';
    }
  }
}

window.CosmicAudio = new CosmicAudioEngine();
