// Synthesized data from Michio Kaku's five future-oriented books
// (excluding string theory):
// 1. Physics of the Impossible (2008)
// 2. Physics of the Future (2011)
// 3. The Future of the Mind (2014)
// 4. The Future of Humanity (2018)
// 5. Quantum Supremacy (2023)

export const KARDASHEV_PRESETS = [
  { id: 'today', label: 'Today (0.73)', k: 0.73, solar: 12.1, fission: 11.9, fusion: 0, orbital: 0 },
  { id: 'type1', label: 'Type I (1.00)', k: 1.0, solar: 15.6, fission: 14.2, fusion: 15.7, orbital: 15.2 },
  { id: 'type2', label: 'Type II (2.00)', k: 2.0, solar: 16.0, fission: 14.5, fusion: 17.0, orbital: 26.0 },
  { id: 'type3', label: 'Type III (3.00)', k: 3.0, solar: 16.0, fission: 14.5, fusion: 17.0, orbital: 36.0 }
];

// Compute Sagan-Kardashev number: K = (log10(P) - 6) / 10
export function computeKardashev(watts) {
  if (!watts || watts <= 1e6) return 0.0;
  const k = (Math.log10(watts) - 6) / 10;
  return Math.max(0.73, Math.min(3.0, k));
}

export function formatWatts(watts) {
  if (watts <= 0) return '0 W';
  const exp = Math.floor(Math.log10(watts));
  const mantissa = watts / Math.pow(10, exp);
  const units = [
    { e: 36, label: 'Galactic' },
    { e: 26, label: 'Stellar' },
    { e: 16, label: 'Planetary' },
    { e: 12, label: 'TW' },
    { e: 9, label: 'GW' }
  ];
  if (exp < 15 && exp >= 12) {
    return `${(watts / 1e12).toFixed(1)} TW`;
  }
  const unitNote = units.find((u) => exp >= u.e);
  return `${mantissa.toFixed(2)} x 10^${exp} W${unitNote && exp >= 16 ? '' : ''}`;
}

export function describeCivilizationTier(k) {
  if (k < 0.98) {
    return {
      tier: 'Type 0 (Transition)',
      plain: 'Fossil & early renewables',
      frontier: 'Class I emerging'
    };
  }
  if (k < 1.98) {
    return {
      tier: 'Type I (Planetary)',
      plain: 'Full planetary energy harness',
      frontier: 'Class I unlocked'
    };
  }
  if (k < 2.95) {
    return {
      tier: 'Type II (Stellar)',
      plain: 'Whole-star Dyson swarm',
      frontier: 'Class II unlocked'
    };
  }
  return {
    tier: 'Type III (Galactic)',
    plain: 'Billions of stars harnessed',
    frontier: 'Class II+ cosmic scale'
  };
}

export const KARDASHEV_UNLOCKS = [
  {
    id: 'fusion-grid',
    name: 'Commercial Fusion Grid',
    minK: 0.78,
    classTag: 'Class I',
    summary: 'Clean magnetic and laser fusion plants replace fossil baseload power.',
    law: 'Nuclear binding energy (E = mc^2)'
  },
  {
    id: 'weather-control',
    name: 'Planetary Weather Steering',
    minK: 0.95,
    classTag: 'Class I',
    summary: 'Orbital mirrors and ocean thermal arrays calm hurricanes and droughts.',
    law: 'Atmospheric thermodynamics'
  },
  {
    id: 'space-elevator',
    name: 'Carbon-Nanotube Space Elevator',
    minK: 1.0,
    classTag: 'Class I',
    summary: 'A tethered ribbon lifts payloads into orbit at a fraction of rocket cost.',
    law: 'Centrifugal & gravitational balance'
  },
  {
    id: 'laser-sails',
    name: 'Laser-Pushed Starships',
    minK: 1.15,
    classTag: 'Class I',
    summary: 'Gigawatt planetary laser arrays accelerate gram-scale probes to 20% light speed.',
    law: 'Radiation pressure (p = E/c)'
  },
  {
    id: 'dyson-swarm',
    name: 'Stellar Dyson Swarm',
    minK: 1.95,
    classTag: 'Class II',
    summary: 'Millions of orbiting solar collectors capture the entire output of a host star.',
    law: 'Stefan-Boltzmann radiation law'
  },
  {
    id: 'warp-metric',
    name: 'Spacetime Warp Bubble',
    minK: 2.35,
    classTag: 'Class II',
    summary: 'Extreme negative energy compresses space ahead and expands it behind a craft.',
    law: 'Einstein field equations (Alcubierre metric)'
  },
  {
    id: 'wormhole-net',
    name: 'Galactic Wormhole Transit',
    minK: 2.9,
    classTag: 'Class II',
    summary: 'Planck-scale energy stabilizes shortcuts across spiral arms of a galaxy.',
    law: 'General Relativity & quantum gravity'
  }
];

// Tab 2: Future of the Mind
export const MIND_LEVELS = [
  {
    id: 'l0',
    level: 'Level 0',
    name: 'Thermostat & Plant',
    loops: 4,
    horizon: 'Present instant',
    decode: 18,
    waveFreq: 1.2,
    waveChaos: 0.08,
    summary: 'Monitors a single variable like temperature or sunlight using simple feedback loops.'
  },
  {
    id: 'l1',
    level: 'Level I',
    name: 'Reptile (Space)',
    loops: 120,
    horizon: 'Seconds ahead',
    decode: 42,
    waveFreq: 2.6,
    waveChaos: 0.18,
    summary: 'Builds a live 3D map of position in space to hunt, flee, and navigate terrain.'
  },
  {
    id: 'l2',
    level: 'Level II',
    name: 'Mammal (Social)',
    loops: 1400,
    horizon: 'Minutes to hours',
    decode: 68,
    waveFreq: 4.5,
    waveChaos: 0.28,
    summary: 'Adds emotions and social hierarchy models to predict what packmates will do next.'
  },
  {
    id: 'l3',
    level: 'Level III',
    name: 'Human (Time)',
    loops: 10000,
    horizon: 'Decades ahead',
    decode: 84,
    waveFreq: 7.0,
    waveChaos: 0.36,
    summary: 'The prefrontal cortex simulates future timelines, plans years ahead, and invents tools.'
  },
  {
    id: 'bci',
    level: 'BCI Link',
    name: 'Augmented Mind',
    loops: 48000,
    horizon: 'Multi-generational',
    decode: 96,
    waveFreq: 9.5,
    waveChaos: 0.22,
    summary: 'Neural sensors translate electrical thought patterns directly into machines, speech, and shared memory.'
  }
];

export const MIND_PILLARS = [
  {
    title: 'Brain-Computer Interfaces (BCIs)',
    summary: 'Non-invasive sensors and micro-arrays read motor intent directly from the cortex to steer cursors, robotic limbs, and wheelchairs.',
    term: 'EEG',
    plain: 'Scalp sensor reading brainwaves'
  },
  {
    title: 'Memory Prosthetics',
    summary: 'Silicon chips modeled on the hippocampus replay electrical spike patterns to restore short-term memory formation.',
    term: 'Hippocampus',
    plain: 'Brain hub that indexes memories'
  },
  {
    title: 'Dream & Visual Decoding',
    summary: 'High-resolution scans map visual cortex voxels to reconstruct rough moving images of what a person sees or dreams.',
    term: 'fMRI',
    plain: 'Blood-flow scanner mapping brain activity'
  }
];

// Tab 3: Physics of the Future (2026 - 2100)
export const FUTURE_DOMAINS = [
  {
    id: 'fusion',
    name: 'Fusion Power',
    metricLabel: 'Fusion Q-Factor',
    metricPlain: 'Energy out divided by energy in',
    unit: 'Q',
    summary: 'Magnetic tokamaks and laser-ignition reactors replicate stellar fusion on Earth using abundant hydrogen from seawater.',
    term: 'Q-factor',
    plain: 'Net energy gain above 1.0',
    milestones: [
      { year: 2026, val: 1.5, note: 'Lab ignition demonstrated; pilot magnets tested.' },
      { year: 2045, val: 10.0, note: 'First commercial demonstration fusion plants feed regional grids.' },
      { year: 2075, val: 25.0, note: 'Compact modular fusion powers cities and desalination.' },
      { year: 2100, val: 50.0, note: 'Fusion becomes the primary planetary baseload alongside orbital solar.' }
    ]
  },
  {
    id: 'smart-matter',
    name: 'Smart Matter',
    metricLabel: 'Lattice Density',
    metricPlain: 'Programmable micro-nodes per cm',
    unit: 'nodes',
    summary: 'Millimeter-scale robotic modules called catoms rearrange electronically to turn one physical surface into any tool or shape.',
    term: 'Catoms',
    plain: 'Programmable shape-shifting micro-robots',
    milestones: [
      { year: 2026, val: 12, note: 'Centimeter-scale modular robots assemble simple 2D shapes.' },
      { year: 2050, val: 240, note: 'Sub-millimeter programmable surfaces adapt ergonomics on command.' },
      { year: 2080, val: 1800, note: 'Everyday furniture and tools reconfigure from software blueprints.' },
      { year: 2100, val: 5000, note: 'True claytronics blurs the boundary between software and solid objects.' }
    ]
  },
  {
    id: 'longevity',
    name: 'Longevity',
    metricLabel: 'Active Healthspan',
    metricPlain: 'Estimated healthy functional years',
    unit: 'yrs',
    summary: 'Gene editing, senescent-cell clearance, and lab-grown organs shift medicine from treating late disease to repairing cellular wear.',
    term: 'Telomeres',
    plain: 'Protective caps on chromosome ends',
    milestones: [
      { year: 2026, val: 74, note: 'Early CRISPR therapies and AI-designed drugs enter clinics.' },
      { year: 2045, val: 88, note: 'Routine senolytic treatments clear damaged aging cells.' },
      { year: 2075, val: 105, note: '3D-bioprinted replacement organs eliminate donor shortages.' },
      { year: 2100, val: 120, note: 'Cellular repair slows biological aging to extend healthy decades.' }
    ]
  },
  {
    id: 'space',
    name: 'Space Access',
    metricLabel: 'Orbital Launch Cost',
    metricPlain: 'Dollars per kilogram to low orbit',
    unit: '$/kg',
    summary: 'Reusable boosters give way to lunar industrial bases, Mars habitats, and laser-driven sails bound for nearby stars.',
    term: 'Laser Sail',
    plain: 'Ultra-thin craft pushed by light beams',
    milestones: [
      { year: 2026, val: 1500, note: 'Fully reusable heavy rockets lower orbital access costs.' },
      { year: 2045, val: 220, note: 'Permanent lunar research outposts and early Mars crews.' },
      { year: 2075, val: 45, note: 'Orbital manufacturing and beam-powered cislunar transit.' },
      { year: 2100, val: 12, note: 'Space elevator prototypes and interstellar laser-sail fleets.' }
    ]
  }
];

// Tab 4: Quantum Supremacy
export const QUANTUM_APPS = [
  {
    id: 'drug',
    name: 'Drug & Protein Folding',
    plain: 'Simulating exact electron bonds',
    summary: 'Classical computers approximate complex biomolecules; quantum processors model electron orbitals directly to screen new therapies.',
    targetMolecule: 'Complex enzyme active site',
    term: 'VQE',
    termPlain: 'Quantum molecular energy finder',
    energyGain: 'Up to 1000x faster screening'
  },
  {
    id: 'battery',
    name: 'EV Battery Chemistry',
    plain: 'Modeling lithium-air cathodes',
    summary: 'Quantum simulation maps exact charge-transfer reactions inside next-generation solid-state electrolytes without trial-and-error labs.',
    targetMolecule: 'Lithium-sulfur / solid electrolyte',
    term: 'Superposition',
    termPlain: 'Testing many quantum states at once',
    energyGain: '2x-3x higher energy density target'
  },
  {
    id: 'nitrogen',
    name: 'Green Nitrogen Fixation',
    plain: 'Copying bacteria fertilizer chemistry',
    summary: 'Industrial fertilizer uses ~2% of global energy; decoding the FeMoco enzyme on a quantum chip unlocks room-temperature ammonia synthesis.',
    targetMolecule: 'Nitrogenase (FeMoco cluster)',
    term: 'Decoherence',
    termPlain: 'Noise breaking a quantum calculation',
    energyGain: 'Cuts massive industrial carbon load'
  }
];

// Tab 5: Physics of the Impossible (12 Iconic Ideas)
export const IMPOSSIBLE_IDEAS = [
  {
    id: 'force-fields',
    title: 'Force Fields',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 32,
    minK: 'Type I',
    shortLine: 'Superheated plasma windows and magnetic cages can deflect particles and radiation.',
    lawFormula: 'F = q(E + v x B)',
    lawPlain: 'Lorentz force — electric and magnetic fields steer charged particles',
    mechanism: 'While Star Trek barriers cannot stop a laser beam outright, layered plasma windows sealed by strong magnetic fields plus carbon-nanotube armor can deflect debris and plasma.'
  },
  {
    id: 'invisibility',
    title: 'Invisibility',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 28,
    minK: 'Type I',
    shortLine: 'Engineered metamaterials bend light smoothly around an object like water around a rock.',
    lawFormula: 'n1 sin(theta1) = n2 sin(theta2)  (n < 0)',
    lawPlain: 'Snell law with negative index — bends light backward around objects',
    mechanism: 'Lab metamaterials already cloak small objects at microwave and infrared wavelengths; scaling sub-wavelength nanostructures to full visible light is an engineering challenge, not a physics violation.'
  },
  {
    id: 'phasers',
    title: 'Phasers & Directed Energy',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 24,
    minK: 'Type I',
    shortLine: 'High-energy lasers and focused particle beams concentrate coherent photons onto a target.',
    lawFormula: 'E = h * nu',
    lawPlain: 'Planck relation — photon energy scales directly with frequency',
    mechanism: 'Industrial and defense megawatt lasers already exist. Handheld versions await compact, ultra-dense power packs rather than new physics.'
  },
  {
    id: 'teleportation',
    title: 'Quantum Teleportation',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 48,
    minK: 'Type I',
    shortLine: 'Entangled particles transfer exact quantum states across distance without moving matter.',
    lawFormula: '|Psi> = (|01> - |10>) / sqrt(2)',
    lawPlain: 'Quantum entanglement — linked particles share state instantaneously',
    mechanism: 'Photons and single atoms have already been teleported over kilometers. Teleporting living cells requires tracking ~10^28 atoms while respecting the no-cloning theorem (the original state is destroyed).'
  },
  {
    id: 'telepathy',
    title: 'Telepathy',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 36,
    minK: 'Type I',
    shortLine: 'Brain scans and neural implants can decode intended words and transmit them digitally.',
    lawFormula: 'nabla x B = mu0 * J',
    lawPlain: 'Ampere law — neural electric currents generate measurable magnetic fields',
    mechanism: 'Because brain signals weaken rapidly over millimeters, biological telepathy fails, but BCI sensors paired with wireless links enable technology-mediated mind-to-mind messaging.'
  },
  {
    id: 'psychokinesis',
    title: 'Psychokinesis',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 34,
    minK: 'Type I',
    shortLine: 'Thought-controlled room-temperature superconductors and micro-drones move objects on mental command.',
    lawFormula: 'F = nabla(m . B)',
    lawPlain: 'Magnetic dipole force — magnetic gradients lift and steer objects',
    mechanism: 'Direct brain-to-actuator links already let paralyzed patients move robotic arms. Pairing BCIs with magnetic levitation or swarms produces practical psychokinesis.'
  },
  {
    id: 'starships',
    title: 'Interstellar Starships',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 58,
    minK: 'Type I+',
    shortLine: 'Laser-pushed light sails and fusion rockets can cross light-years within a human lifetime.',
    lawFormula: 'delta_v = ve * ln(m0 / mf)',
    lawPlain: 'Rocket equation — top speed depends on exhaust speed and fuel ratio',
    mechanism: 'Chemical rockets are far too slow for nearby stars. High-exhaust fusion ramjets or gram-scale laser sails pushed by gigawatt orbital arrays reach 10-20% of light speed.'
  },
  {
    id: 'antimatter',
    title: 'Antimatter Engines',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 52,
    minK: 'Type I+',
    shortLine: 'Matter-antimatter annihilation converts 100% of rest mass into pure propulsion energy.',
    lawFormula: 'E = m * c^2',
    lawPlain: 'Mass-energy equivalence — tiny mass unlocks enormous energy',
    mechanism: 'Antiprotons are produced today at CERN in nanogram fractions. Scaling magnetic Penning traps and production efficiency is purely an engineering and energy-budget hurdle.'
  },
  {
    id: 'ftl',
    title: 'Faster-Than-Light Travel',
    cls: 'Class II',
    clsCode: 'c2',
    barrier: 84,
    minK: 'Type II-III',
    shortLine: 'Space itself may expand faster than light inside a warped metric bubble without breaking local relativity.',
    lawFormula: 'G_mu_nu = (8*pi*G / c^4) * T_mu_nu',
    lawPlain: 'Einstein field equations — mass and energy curve spacetime',
    mechanism: 'The Alcubierre warp metric and traversable wormholes are mathematically valid solutions of General Relativity, but they demand exotic negative energy at stellar scales.'
  },
  {
    id: 'time-travel',
    title: 'Time Travel',
    cls: 'Class II',
    clsCode: 'c2',
    barrier: 88,
    minK: 'Type III',
    shortLine: 'Forward time travel happens daily via relativity; backward loops require extreme spacetime curvature.',
    lawFormula: 'dt_proper = dt * sqrt(1 - v^2/c^2)',
    lawPlain: 'Time dilation — moving clocks tick slower than stationary ones',
    mechanism: 'Closed timelike curves appear in rotating black hole and wormhole solutions, yet quantum radiation feedback may destabilize any time machine the moment it turns on.'
  },
  {
    id: 'parallel-universes',
    title: 'Parallel Universes',
    cls: 'Class II',
    clsCode: 'c2',
    barrier: 90,
    minK: 'Type III',
    shortLine: 'Quantum branching and eternal cosmic inflation both predict domains beyond our observable horizon.',
    lawFormula: 'i*hbar * dPsi/dt = H * Psi',
    lawPlain: 'Schrodinger equation — quantum waves evolve as superposed realities',
    mechanism: 'Entering another bubble universe or quantum branch is beyond any foreseeable energy budget, though gravitational-wave echoes could one day test cosmological multiverse models.'
  },
  {
    id: 'perpetual-motion',
    title: 'Perpetual Motion Machines',
    cls: 'Class III',
    clsCode: 'c3',
    barrier: 100,
    minK: 'Impossible',
    shortLine: 'No machine can create free energy or run forever without losing usable heat to entropy.',
    lawFormula: 'dU = Q - W   and   dS >= 0',
    lawPlain: 'First & Second Laws of Thermodynamics — energy is conserved, disorder rises',
    mechanism: 'Unlike Class I and II technologies, perpetual motion directly contradicts the conservation of energy and the arrow of entropy. If ever built, modern physics would need to be rewritten.'
  }
];
