// Synthesized data from Michio Kaku's five future-oriented books
// (excluding string theory):
// 1. Physics of the Impossible (2008)
// 2. Physics of the Future (2011)
// 3. The Future of the Mind (2014)
// 4. The Future of Humanity (2018)
// 5. Quantum Supremacy (2023)

export const KARDASHEV_PRESETS = [
  { id: 'today', label: '2023 (0.73)', k: 0.73, solar: 12.1, fission: 11.9, fusion: 0, orbital: 0 },
  { id: 'type1', label: 'Type I (1.00)', k: 1.0, solar: 15.6, fission: 14.2, fusion: 15.7, orbital: 15.2 },
  { id: 'type2', label: 'Type II (2.00)', k: 2.0, solar: 16.0, fission: 14.5, fusion: 17.0, orbital: 26.0 },
  { id: 'type3', label: 'Type III (3.00)', k: 3.0, solar: 16.0, fission: 14.5, fusion: 17.0, orbital: 36.0 }
];

// Compute Sagan-Kardashev number: K = (log10(P) - 6) / 10
export function computeKardashev(watts) {
  if (!watts || watts <= 1e6) return 0.0;
  const k = (Math.log10(watts) - 6) / 10;
  return Math.max(0, Math.min(3.0, k));
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
  if (exp < 12 && exp >= 9) {
    return `${Math.round(watts / 1e9).toLocaleString()} GW`;
  }
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
      plain: 'Still mostly fossil fuels and early renewables',
      frontier: 'Class I emerging'
    };
  }
  if (k < 1.98) {
    return {
      tier: 'Type I (Planetary)',
      plain: 'Uses all the energy reaching its planet',
      frontier: 'Class I within reach'
    };
  }
  if (k < 2.95) {
    return {
      tier: 'Type II (Stellar)',
      plain: 'Uses its whole star, via a Dyson swarm',
      frontier: 'Class II within reach'
    };
  }
  return {
    tier: 'Type III (Galactic)',
    plain: 'Uses the power of a whole galaxy',
    frontier: 'Class II+ cosmic scale'
  };
}

export const KARDASHEV_UNLOCKS = [
  {
    id: 'fusion-grid',
    name: 'Commercial Fusion Grid',
    minK: 0.78,
    classTag: 'Class I',
    summary: 'Magnetic and laser fusion plants take over the steady baseload that fossil fuels supply today.',
    law: 'Nuclear binding energy (E = mc^2)'
  },
  {
    id: 'weather-control',
    name: 'Planetary Weather Steering',
    minK: 0.95,
    classTag: 'Class I',
    summary: 'Mirrors in orbit and ocean heat arrays soften hurricanes and droughts.',
    law: 'Atmospheric thermodynamics'
  },
  {
    id: 'space-elevator',
    name: 'Carbon-Nanotube Space Elevator',
    minK: 1.0,
    classTag: 'Class I',
    summary: 'A ribbon tethered to the ground carries cargo up to orbit for a fraction of rocket cost.',
    law: 'Centrifugal & gravitational balance'
  },
  {
    id: 'laser-sails',
    name: 'Laser-Pushed Starships',
    minK: 1.15,
    classTag: 'Class I',
    summary: 'Gigawatt laser arrays on the ground push gram-scale probes to 20% of light speed.',
    law: 'Radiation pressure (p = E/c)'
  },
  {
    id: 'dyson-swarm',
    name: 'Stellar Dyson Swarm',
    minK: 1.95,
    classTag: 'Class II',
    summary: 'Millions of solar collectors in orbit catch the full output of a star.',
    law: 'Stefan-Boltzmann radiation law'
  },
  {
    id: 'warp-metric',
    name: 'Spacetime Warp Bubble',
    minK: 2.35,
    classTag: 'Class II',
    summary: 'Space is squeezed in front of a craft and stretched behind it, which needs huge amounts of negative energy.',
    law: 'Einstein field equations (Alcubierre metric)'
  },
  {
    id: 'wormhole-net',
    name: 'Galactic Wormhole Transit',
    minK: 2.9,
    classTag: 'Class II',
    summary: 'Energy at the Planck scale holds open shortcuts between the spiral arms of a galaxy.',
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
    summary: 'Builds a live 3D map of position in space to hunt, flee and find its way across terrain.'
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
    summary: 'Classical computers approximate complex biomolecules, while quantum processors model electron orbitals directly to screen new therapies.',
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
    summary: 'Industrial fertilizer uses about 2% of global energy, and decoding the FeMoco enzyme on a quantum chip could lead to room-temperature ammonia synthesis.',
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
    shortLine: 'Hot plasma windows and magnetic cages can push away particles and radiation.',
    lawFormula: 'F = q(E + v x B)',
    lawPlain: 'Lorentz force: electric and magnetic fields steer charged particles',
    mechanism: 'A Star Trek shield that stops a laser beam is out of reach this way. Layered plasma windows held by strong magnetic fields, backed by carbon-nanotube armour, can still deflect debris and plasma.'
  },
  {
    id: 'invisibility',
    title: 'Invisibility',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 28,
    minK: 'Type I',
    shortLine: 'Metamaterials (structures smaller than a light wave) bend light around an object, like water around a rock.',
    lawFormula: 'n1 sin(theta1) = n2 sin(theta2)  (n < 0)',
    lawPlain: 'Snell\'s law with a negative index: light bends backwards around the object',
    mechanism: 'Lab metamaterials already hide small objects at microwave and infrared wavelengths. Visible light needs nanostructures smaller than its wavelength. That is hard engineering, but it breaks no law of physics.'
  },
  {
    id: 'phasers',
    title: 'Phasers & Directed Energy',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 24,
    minK: 'Type I',
    shortLine: 'High-energy lasers and particle beams pour concentrated energy onto one spot.',
    lawFormula: 'E = h * nu',
    lawPlain: 'Planck relation: a photon\'s energy rises in step with its frequency',
    mechanism: 'Megawatt lasers already exist in industry and defence. A handheld version needs a small, very dense power pack. The physics is already known.'
  },
  {
    id: 'teleportation',
    title: 'Quantum Teleportation',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 48,
    minK: 'Type I',
    shortLine: 'Entangled particles pass an exact quantum state across a distance without moving any matter.',
    lawFormula: '|Psi> = (|01> - |10>) / sqrt(2)',
    lawPlain: 'Quantum entanglement: two linked particles share one state, however far apart',
    mechanism: 'Photons and single atoms have already been teleported over kilometres. A person would mean tracking about 10^28 atoms, and the no-cloning theorem says the original state is destroyed on the way.'
  },
  {
    id: 'telepathy',
    title: 'Telepathy',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 36,
    minK: 'Type I',
    shortLine: 'Brain scans and implants can decode the words you intend and send them digitally.',
    lawFormula: 'nabla x B = mu0 * J',
    lawPlain: 'Ampère\'s law: electric currents in neurons create magnetic fields you can measure',
    mechanism: 'Brain signals fade within millimetres, so natural telepathy does not work. Brain-computer interface (BCI) sensors joined by a wireless link can still carry a message from one mind to another.'
  },
  {
    id: 'psychokinesis',
    title: 'Psychokinesis',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 34,
    minK: 'Type I',
    shortLine: 'Room-temperature superconductors and micro-drones, steered by thought, move objects on command.',
    lawFormula: 'F = nabla(m . B)',
    lawPlain: 'Magnetic dipole force: an uneven magnetic field can lift and steer objects',
    mechanism: 'Paralysed patients already move robotic arms through direct brain links. Pair a BCI with magnetic levitation or a drone swarm and you get a working version of psychokinesis.'
  },
  {
    id: 'starships',
    title: 'Interstellar Starships',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 58,
    minK: 'Type I+',
    shortLine: 'Light sails pushed by lasers, or fusion rockets, could cross light-years within a human lifetime.',
    lawFormula: 'delta_v = ve * ln(m0 / mf)',
    lawPlain: 'Rocket equation: top speed depends on exhaust speed and fuel ratio',
    mechanism: 'Chemical rockets are far too slow for the nearest stars. Fusion ramjets with fast exhaust, or gram-scale sails pushed by gigawatt lasers in orbit, could reach 10 to 20% of light speed.'
  },
  {
    id: 'antimatter',
    title: 'Antimatter Engines',
    cls: 'Class I',
    clsCode: 'c1',
    barrier: 52,
    minK: 'Type I+',
    shortLine: 'When matter meets antimatter, 100% of the rest mass turns into energy for thrust.',
    lawFormula: 'E = m * c^2',
    lawPlain: 'Mass-energy equivalence: a tiny mass holds an enormous amount of energy',
    mechanism: 'CERN makes antiprotons today, in fractions of a nanogram. Scaling up magnetic Penning traps and production is an engineering and energy-budget problem.'
  },
  {
    id: 'ftl',
    title: 'Faster-Than-Light Travel',
    cls: 'Class II',
    clsCode: 'c2',
    barrier: 84,
    minK: 'Type II-III',
    shortLine: 'Space itself may stretch faster than light inside a warp bubble, without breaking relativity locally.',
    lawFormula: 'G_mu_nu = (8*pi*G / c^4) * T_mu_nu',
    lawPlain: 'Einstein field equations: mass and energy curve spacetime',
    mechanism: 'The Alcubierre warp bubble and traversable wormholes are valid solutions of general relativity. Both need exotic negative energy on the scale of a star.'
  },
  {
    id: 'time-travel',
    title: 'Time Travel',
    cls: 'Class II',
    clsCode: 'c2',
    barrier: 88,
    minK: 'Type III',
    shortLine: 'Forward time travel happens every day through relativity. Going backwards needs extreme curvature of spacetime.',
    lawFormula: 'dt_proper = dt * sqrt(1 - v^2/c^2)',
    lawPlain: 'Time dilation: a moving clock ticks slower than one at rest',
    mechanism: 'Closed timelike curves (paths that loop back to their own start in time) show up in solutions for spinning black holes and wormholes. Quantum radiation feedback may destroy any time machine the moment it switches on.'
  },
  {
    id: 'parallel-universes',
    title: 'Parallel Universes',
    cls: 'Class II',
    clsCode: 'c2',
    barrier: 90,
    minK: 'Type III',
    shortLine: 'Quantum branching and eternal cosmic inflation both predict regions beyond the part of the universe we can see.',
    lawFormula: 'i*hbar * dPsi/dt = H * Psi',
    lawPlain: 'Schrodinger equation: a quantum wave evolves as a mix of possible states',
    mechanism: 'Reaching another bubble universe or quantum branch is far beyond any energy budget we can foresee. Gravitational-wave echoes could one day test some multiverse models.'
  },
  {
    id: 'perpetual-motion',
    title: 'Perpetual Motion Machines',
    cls: 'Class III',
    clsCode: 'c3',
    barrier: 100,
    minK: 'Impossible',
    shortLine: 'No machine can make free energy or run forever, because some usable energy is always lost as heat.',
    lawFormula: 'dU = Q - W   and   dS >= 0',
    lawPlain: 'First and second laws of thermodynamics: energy is conserved, and disorder (entropy) rises',
    mechanism: 'Class I and II ideas need better engineering or more energy. Perpetual motion breaks conservation of energy and the arrow of entropy, so building one would mean rewriting physics.'
  }
];
