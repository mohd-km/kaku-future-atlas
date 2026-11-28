export interface EpochItem {
  id: number;
  name: string;
  shortName: string;
  era: string;
  medium: string;
  pace: string;
  summary: string;
  transition: string;
  orderIndex: number; // 1..6 visual scale
}

export const EPOCHS: EpochItem[] = [
  {
    id: 1,
    name: 'Physics & Chemistry',
    shortName: 'Physics',
    era: 'Started ~13.8 billion years ago',
    medium: 'Atomic structures and chemical bonds',
    pace: 'Billions of years per major leap',
    summary:
      'Matter cools into stable atoms, stars forge heavier elements, and carbon chemistry creates molecules capable of holding durable structure.',
    transition:
      'Once self-copying polymers appeared, information no longer waited on random collisions alone.',
    orderIndex: 1,
  },
  {
    id: 2,
    name: 'Biology & DNA',
    shortName: 'Biology',
    era: 'Started ~3.8 billion years ago',
    medium: 'Digital genetic code (A, C, G, T base pairs)',
    pace: 'Millions to hundreds of millions of years',
    summary:
      'Life encodes successful molecular designs in DNA. Natural selection preserves working patterns and discards failures, building local order while exporting heat.',
    transition:
      'Genetic evolution was still slow. It took generations to record a single adaptation. Nervous systems broke that bottleneck.',
    orderIndex: 2,
  },
  {
    id: 3,
    name: 'Brains',
    shortName: 'Brains',
    era: 'Started ~500 million years ago',
    medium: 'Neural networks and synaptic weights',
    pace: 'Thousands of years, then a single lifetime',
    summary:
      'Organisms store patterns inside neural circuits instead of waiting for DNA mutations. Humans add language and abstract reasoning, letting ideas pass directly between minds.',
    transition:
      'Biological brains are limited by skull volume, metabolic heat (~20 W), and slow chemical signaling (~200 Hz).',
    orderIndex: 3,
  },
  {
    id: 4,
    name: 'Technology',
    shortName: 'Technology',
    era: 'Started tens of thousands of years ago; computing in the 20th century',
    medium: 'External tools, writing, and engineered hardware/software',
    pace: 'Decades, then years',
    summary:
      'Human intelligence builds external substrates (printing, electronics and digital computers) that remember accurately and compute millions of times faster than neurons.',
    transition:
      'Each generation of computers helps design the next, turning technological progress into a compounding feedback loop.',
    orderIndex: 4,
  },
  {
    id: 5,
    name: 'Human-Machine Merger',
    shortName: 'Merger',
    era: 'Projected mid-21st century (Kurzweil)',
    medium: 'Biological cognition linked with non-biological computation',
    pace: 'Years to months',
    summary:
      'Human pattern recognition combines with the speed, memory, and shareability of engineered compute. The boundary between biological and machine thinking blurs.',
    transition:
      'Non-biological intelligence is not bound to biological metabolism and can scale across 3D molecular hardware.',
    orderIndex: 5,
  },
  {
    id: 6,
    name: 'The Universe Wakes Up',
    shortName: 'Cosmos',
    era: 'Long-term horizon',
    medium: 'Matter and energy organized for computation at cosmic scale',
    pace: 'Bounded by the speed of light and thermodynamics',
    summary:
      'Kurzweil’s boldest hypothesis: intelligence eventually reorganizes ordinary matter into dense computational substrates, spreading outward as far as physics allows.',
    transition:
      'Even here, progress is bounded by thermodynamics, quantum mechanics, and the speed of light.',
    orderIndex: 6,
  },
];

export interface ParadigmItem {
  id: number;
  name: string;
  shortName: string;
  years: string;
  startYear: number;
  endYear: number;
  peakLogCpsPer1000: number; // log10(calculations per second per $1,000, approx Kurzweil 2005 curve)
  example: string;
  mechanism: string;
  wall: string;
  successor: string;
}

export const PARADIGMS: ParadigmItem[] = [
  {
    id: 1,
    name: 'Electromechanical',
    shortName: 'Electromech.',
    years: '1900–1940',
    startYear: 1900,
    endYear: 1940,
    peakLogCpsPer1000: -4,
    example: 'Hollerith Tabulator, IBM calculators',
    mechanism: 'Punched cards, rotating shafts, and mechanical gears.',
    wall: 'Physical inertia and friction capped switching to a few operations per second.',
    successor: 'Electromagnetic relays removed heavy mechanical linkages.',
  },
  {
    id: 2,
    name: 'Relays',
    shortName: 'Relays',
    years: '1940–1946',
    startYear: 1940,
    endYear: 1946,
    peakLogCpsPer1000: -2,
    example: 'Zuse Z3, Harvard Mark I',
    mechanism: 'Electromagnetic coils opening and closing tiny metal contacts.',
    wall: 'Moving metal contacts wore out and could not switch faster than milliseconds.',
    successor: 'Vacuum tubes removed moving parts completely.',
  },
  {
    id: 3,
    name: 'Vacuum Tubes',
    shortName: 'Vacuum Tubes',
    years: '1946–1958',
    startYear: 1946,
    endYear: 1958,
    peakLogCpsPer1000: 1,
    example: 'ENIAC, UNIVAC I',
    mechanism: 'Electron flow controlled inside heated glass bulbs.',
    wall: 'Tubes were bulky, hot and power-hungry, and they burned out often.',
    successor: 'Solid-state transistors switched electrons inside tiny silicon crystals.',
  },
  {
    id: 4,
    name: 'Discrete Transistors',
    shortName: 'Transistors',
    years: '1958–1965',
    startYear: 1958,
    endYear: 1965,
    peakLogCpsPer1000: 3,
    example: 'IBM 7090, PDP-1',
    mechanism: 'Individual semiconductor switches wired onto circuit boards.',
    wall: 'Hand-wiring thousands of separate components hit the "tyranny of numbers."',
    successor: 'Integrated circuits printed millions of transistors onto a single wafer.',
  },
  {
    id: 5,
    name: 'Integrated Circuits',
    shortName: 'ICs / GPUs',
    years: '1965–2025+',
    startYear: 1965,
    endYear: 2028,
    peakLogCpsPer1000: 13.5,
    example: 'Microprocessors, modern GPUs & AI accelerators',
    mechanism: 'Photolithography packing billions of nanoscale transistors on flat silicon.',
    wall: 'Flat silicon features are nearing the size of atoms, where electrons leak through barriers (quantum tunnelling) and heat builds up.',
    successor: '3D stacking, light-based links between chips, molecular logic and specialised hardware.',
  },
  {
    id: 6,
    name: '3D Molecular, Photonic, Reversible & Quantum',
    shortName: '3D / Beyond',
    years: '2025–2050+',
    startYear: 2025,
    endYear: 2050,
    peakLogCpsPer1000: 18,
    example: '3D chiplets, optical interconnects, reversible & quantum systems',
    mechanism: 'Computing in three dimensions using light, molecular switches, or reversible states to cut heat.',
    wall: 'Eventually bounded by thermodynamics (Landauer limit) and quantum energy limits.',
    successor: 'Gets close to the ceiling on how much computing matter can do.',
  },
];

export interface ComputeScaleItem {
  id: string;
  label: string;
  logMin: number;
  logMax: number;
  displayRange: string;
  category: 'bio' | 'current' | 'theoretical';
  categoryLabel: string;
  explanation: string;
}

export const COMPUTE_SCALES: ComputeScaleItem[] = [
  {
    id: 'single-brain',
    label: 'Single human brain (functional estimate)',
    logMin: 14,
    logMax: 16,
    displayRange: '10^14 to 10^16 cps',
    category: 'bio',
    categoryLabel: 'Biological',
    explanation:
      'Kurzweil and several neuroscientists estimate that reproducing the functional output of ~86 billion neurons and ~100 trillion synapses requires roughly 10^14 to 10^16 operations per second.',
  },
  {
    id: 'global-current',
    label: 'All human brains and data centres today',
    logMin: 22,
    logMax: 26,
    displayRange: '10^22 to 10^26 cps',
    category: 'current',
    categoryLabel: 'Present Earth',
    explanation:
      'AI data centres add up to about 10^22 to 10^23 operations a second of active silicon. About 8 billion human brains add roughly 10^24 to 10^26 cps. Together that is a tiny fraction of what Earth’s matter could compute.',
  },
  {
    id: 'ultimate-laptop',
    label: '1 kg "ultimate laptop": the Seth Lloyd limit',
    logMin: 50,
    logMax: 50,
    displayRange: '~10^50 ops/sec',
    category: 'theoretical',
    categoryLabel: 'Theoretical physics upper bound',
    explanation:
      'MIT physicist Seth Lloyd worked out the quantum ceiling for 1 kilogram of matter packed into 1 litre (E = mc^2 fed into a quantum speed limit on how fast any system can change state). It is a hard upper bound from physics, and nobody has a design that comes close.',
  },
  {
    id: 'earth-computronium',
    label: 'All of Earth turned into a perfect computer (computronium)',
    logMin: 75,
    logMax: 75,
    displayRange: '~10^75 ops/sec',
    category: 'theoretical',
    categoryLabel: 'Theoretical physics upper bound',
    explanation:
      'Scaling Lloyd’s bound up to the mass of Earth (about 6 x 10^24 kg) gives about 10^75 operations per second. Even cooled molecular hardware far below this ceiling would beat today’s civilisation by tens of powers of ten.',
  },
];

export interface EmulationLevel {
  id: string;
  name: string;
  cps: string;
  memory: string;
  focus: string;
  bottleneck: string;
  summary: string;
}

export const EMULATION_LEVELS: EmulationLevel[] = [
  {
    id: 'functional',
    name: 'Functional Emulation',
    cps: '10^14 to 10^16 cps',
    memory: '~100 TB to 1 PB',
    focus: 'Copying what cortical columns and brain regions do with their inputs and outputs.',
    bottleneck: 'Working out the brain’s learning rules. Transistor count is the easier part.',
    summary:
      'Aeroplanes fly without flapping feathers. In the same way, a functional copy takes the neocortex’s information-processing rules and skips the biochemistry.',
  },
  {
    id: 'kurzweil',
    name: "Kurzweil's 2005 Benchmark",
    cps: '~10^16 cps',
    memory: '~10^13 to 10^16 bytes',
    focus: 'Full functional simulation of ~100 trillion synaptic connections at ~200 Hz firing rates.',
    bottleneck: 'High-resolution connectome scanning and software architecture.',
    summary:
      'Kurzweil estimated 10^16 calculations per second for functional human-brain simulation (10^14 synapses x ~100–200 Hz), predicting hardware would cross this threshold in the 2020s.',
  },
  {
    id: 'molecular',
    name: 'Detailed Molecular Simulation',
    cps: '10^19 to 10^22+ cps',
    memory: 'Exabytes+',
    focus: 'Modelling individual ion channels, neurotransmitter diffusion and the chemistry inside each cell.',
    bottleneck: 'Huge compute and energy cost to simulate physics that may not change how the brain thinks.',
    summary:
      'Simulating every synapse down to its molecules takes thousands to millions of times more compute. It is only needed if that low-level chemistry turns out to do real computing.',
  },
];

export interface FermiCard {
  id: string;
  title: string;
  headline: string;
  body: string;
}

export const FERMI_CARDS: FermiCard[] = [
  {
    id: 'early',
    title: '1. We Are Early (or First)',
    headline: 'Someone has to be near the front of the curve.',
    body: 'Complex multicellular life took over three billion years to appear on Earth. If the jump from chemistry to technological intelligence is even slightly rarer than we guess, we may be among the first civilisations in our galaxy.',
  },
  {
    id: 'quiet',
    title: '2. Efficient Computing Looks Quiet',
    headline: 'Wasted energy is a sign of primitive engineering.',
    body: 'Our early transmitters leaked radio waves in every direction. A well-optimised computer wastes very little heat or stray radiation, so an advanced one could look as dark and cold as ordinary matter.',
  },
  {
    id: 'inward',
    title: '3. Civilisations Go Inward',
    headline: 'Dense micro-scale compute beats light-year delays.',
    body: 'Light takes years to cross between stars, so a conversation across the galaxy is painfully slow. An advanced intelligence may prefer very dense, tiny hardware where signals travel in nanoseconds, and never spread loudly across empty space.',
  },
];

export interface PredictionItem {
  prediction: string;
  targetYear: string;
  status: 'Hit' | 'Early' | 'Pending';
  note: string;
}

export const PREDICTIONS: PredictionItem[] = [
  {
    prediction: 'Supercomputer reaches ~10^16 cps (functional brain-scale hardware)',
    targetYear: '2010s–2020s',
    status: 'Hit',
    note: 'Exascale supercomputers (Frontier, El Capitan) surpassed 10^18 FLOPS in 2022–2024.',
  },
  {
    prediction: 'Real-time speech recognition and fluent language translation',
    targetYear: '2010s–2020s',
    status: 'Hit',
    note: 'Everyday neural speech and translation models now run on phones and laptops.',
  },
  {
    prediction: 'Autonomous vehicles operating on public roads',
    targetYear: '2020s',
    status: 'Hit',
    note: 'Commercial driverless fleets operate in multiple cities, though full global rollout is ongoing.',
  },
  {
    prediction: '$1,000 personal computer matching ~10^16 cps',
    targetYear: '~2023–2025',
    status: 'Early',
    note: 'Consumer GPUs reach ~10^14 to 10^15 low-precision ops/sec; full 10^16 cps at $1,000 is close but still ahead.',
  },
  {
    prediction: 'Human-level AI passing a rigorous Turing test',
    targetYear: '2029',
    status: 'Pending',
    note: 'Large language models excel at many benchmarks, but reliable general autonomy and reasoning remain active work.',
  },
  {
    prediction: 'Medical nanobots patrolling the bloodstream for cellular repair',
    targetYear: '2030s',
    status: 'Pending',
    note: 'Targeted lipid nanoparticles and programmable mRNA exist, but autonomous mechanical nanobots do not yet exist.',
  },
];

export interface GnrItem {
  id: 'G' | 'N' | 'R';
  title: string;
  subtitle: string;
  summary: string;
  today: string;
}

export const GNR_ITEMS: GnrItem[] = [
  {
    id: 'G',
    title: 'Genetics (Biotechnology)',
    subtitle: 'Reprogramming biology as software',
    summary:
      'Viewing DNA and RNA as editable information rather than fixed destiny, so medicine can target root mechanisms of disease and aging.',
    today: 'CRISPR gene editing, mRNA therapeutics, and AI-predicted protein structures (AlphaFold).',
  },
  {
    id: 'N',
    title: 'Nanotechnology',
    subtitle: 'Building matter with atomic precision',
    summary:
      'Manipulating structures at the molecular scale to create ultra-dense 3D computing circuits, efficient energy capture, and targeted medical delivery.',
    today: '2-nanometer semiconductor lithography, 3D chip stacking, and nanoscale drug carriers.',
  },
  {
    id: 'R',
    title: 'Robotics (Strong AI)',
    subtitle: 'Non-biological intelligence at scale',
    summary:
      'Kurzweil considered AI the most decisive of the three: once machines match and extend human engineering, they accelerate both genetics and nanotechnology.',
    today: 'Foundation models for language, code, science, and emerging general-purpose robots.',
  },
];
