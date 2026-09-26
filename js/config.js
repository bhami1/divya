/**
 * ====================================================================
 *  HER OWN LITTLE UNIVERSE — CONFIGURATION & CONTENT DATA
 * ====================================================================
 *  You can easily edit all texts, photos, and cards in this file.
 *  Just change the text between the quotation marks.
 * ====================================================================
 */

window.UNIVERSE_CONFIG = {
  // ------------------------------------------------------------------
  // 1. OPENING / LANDING SCREEN
  // ------------------------------------------------------------------
  landing: {
    prologueLine1: "Some people are ordinary.",
    prologueLine2: "Some people have their own universe.",
    nameReveal: "DIVYA",
    subheading: "A little universe made for DIVYA✦",
    enterButtonText: "Enter her universe",
    cosmicTag: "COSMIC COORDINATES: RA 18h 36m | DEC +38° 47′ 01″"
  },

  // ------------------------------------------------------------------
  // 2. HER UNIVERSE (CENTERPIECE SECTION)
  // ------------------------------------------------------------------
  centerpiece: {
    sectionTag: "✦ THE GRAVITATIONAL CORE ✦",
    introText: "At the centre of this universe…",
    name: "DIVYA",
    photo: "public/img.jpeg",
    photoAlt: "Divya — Centre of the Universe",
    titles: [
      "MSc Physics Student",
      "Professional Overthinker",
      "Collector of Memories",
      "And somehow, still one of my favourite humans."
    ],
    bioDescription: "Spreading warmth, laughter, and a little bit of chaotic entropy wherever she goes. A celestial anomaly that defies the standard model of ordinary beings.",
    stats: [
      { label: "Wavelength", value: "Pure Joy", unit: "λ" },
      { label: "Gravitational Pull", value: "Irresistible", unit: "G" },
      { label: "Favourite State", value: "Overthinking", unit: "ψ" },
      { label: "Constellation", value: "Divya Major", unit: "✦" }
    ]
  },

  // ------------------------------------------------------------------
  // 3. PHOTO CONSTELLATION GALLERY
  // ------------------------------------------------------------------
  // All 7 supplied photographs arranged with cosmic captions and coordinates
  photos: [
    {
      id: 1,
      src: "public/img.jpeg",
      title: "The Stellar Silhouette",
      date: "Celestial Archive",
      caption: "Dressed in starlight and gentle grace. At the center of every frame and memory.",
      tag: "Center Star",
      size: "large"
    },
    {
      id: 2,
      src: "public/WhatsApp Image 2026-09-26 at 23.00.42.jpeg",
      title: "Ocean Tide & Golden Hour",
      date: "Coastline Coordinates",
      caption: "Wind in her hair, endless ocean ahead, and a smile brighter than a thousand supernovas.",
      tag: "Solar Radiance",
      size: "tall"
    },
    {
      id: 3,
      src: "public/emg.jpeg",
      title: "Little Steps, Infinite Smiles",
      date: "Earth Epoch",
      caption: "Guiding tiny footsteps with boundless patience and the sweetest warmth in the cosmos.",
      tag: "Pure Wonder",
      size: "medium"
    },
    {
      id: 4,
      src: "public/WhatsApp Image 2026-09-26 at 23.00.43.jpeg",
      title: "Laughing With The Horizon",
      date: "Sunny Shores",
      caption: "Catching the ocean breeze, holding onto memories, and soaking in the infinite horizon.",
      tag: "Serenity",
      size: "medium"
    },
    {
      id: 5,
      src: "public/imggg.jpeg",
      title: "Cosmic Lullaby",
      date: "Peaceful Orbit",
      caption: "Holding a sleeping world in her arms. The gentlest, purest gravity there is.",
      tag: "Tender Light",
      size: "tall"
    },
    {
      id: 6,
      src: "public/imgguh.jpeg",
      title: "Double the Charm",
      date: "Joyful Moments",
      caption: "Shared smiles, festive outfits, and laughter echoing across the universe.",
      tag: "Celestial Bond",
      size: "large"
    },
    {
      id: 7,
      src: "public/WhatsApp Image 2026-09-26 at 23.00.44.jpeg",
      title: "Contemplating The Infinite",
      date: "Serene Shoreline",
      caption: "Standing barefoot where the waves kiss the golden sand, lost in peaceful cosmic thoughts.",
      tag: "Deep Reflection",
      size: "tall"
    }
  ],

  // ------------------------------------------------------------------
  // 4. PHYSICS × HER (PLAYFUL CARDS)
  // ------------------------------------------------------------------
  physicsCards: [
    {
      icon: "ψ",
      symbol: "|ψ⟩",
      title: "Quantum State",
      quote: "Currently existing in multiple states: studying, procrastinating, and somehow surviving.",
      formulaNote: "Collapse of wave function: Pending coffee",
      badge: "Quantum Mechanics"
    },
    {
      icon: "Δt",
      symbol: "t' = γ(t - vx/c²)",
      title: "Relativity",
      quote: "Time moves differently when an assignment is due tomorrow.",
      formulaNote: "Time dilation reaches maximum near deadlines",
      badge: "Special Relativity"
    },
    {
      icon: "ΔS",
      symbol: "ΔS ≥ 0",
      title: "Entropy",
      quote: "Her room after one productive study session.",
      formulaNote: "The universe's disorder is strictly non-decreasing",
      badge: "Thermodynamics"
    },
    {
      icon: "Σ",
      symbol: "|Tired⟩ + |Scrolling⟩",
      title: "Superposition",
      quote: "Can simultaneously say ‘I’m tired’ and continue scrolling for another hour.",
      formulaNote: "Co-existing states of absolute exhaustion and screen time",
      badge: "Quantum Paradox"
    },
    {
      icon: "G",
      symbol: "F = G(m₁·m₂)/r²",
      title: "Gravity",
      quote: "Somehow attracts chaos wherever she goes.",
      formulaNote: "Infinite radius of chaotic attraction",
      badge: "Classical Mechanics"
    },
    {
      icon: "λ",
      symbol: "E = h·c/λ",
      title: "Photon Resonance",
      quote: "Radiating vibrant energy that effortlessly lights up every room she steps into.",
      formulaNote: "Spectral emission: 100% genuine warmth",
      badge: "Electrodynamics"
    }
  ],

  // ------------------------------------------------------------------
  // 5. BIRTHDAY & FRIENDSHIP WISHES (CELESTIAL LETTER)
  // ------------------------------------------------------------------
  wishes: {
    sectionTag: "✦ CELESTIAL WISHES ✦",
    heading: "A Wish Written In The Stars",
    subtitle: "To the brightest star in our galaxy on her special day",
    letterText: [
      "Happy Birthday, Divya!",
      "In a vast cosmos spanning billions of light-years and countless galaxies, having someone like you as a friend makes this whole existence infinitely more fun, meaningful, and wonderfully chaotic.",
      "May this upcoming orbit around the sun bring you endless breakthroughs in physics, unshakeable peace in your mind, unforgettable adventures, and every ounce of happiness you deserve.",
      "Keep shining, keep questioning the universe, and never lose that radiant smile."
    ],
    signature: "Always cheering for you from across the cosmos ✦",
    actionButton: "Release a Shooting Star ✦"
  },

  // ------------------------------------------------------------------
  // 6. FOOTER
  // ------------------------------------------------------------------
  footer: {
    quote: "“The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, the carbon in our apple pies were made in the interiors of collapsing stars. We are made of starstuff.”",
    author: "— Carl Sagan",
    dedication: "Crafted with cosmic love for Divya's Universe ✦"
  }
};
