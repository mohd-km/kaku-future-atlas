// Physical constants (CODATA 2018 / SI 2019) and textbook models for the cosmos tab.

export const CONSTANTS = {
  c: 299792458, // m/s (exact)
  G: 6.6743e-11, // m^3 kg^-1 s^-2
  hbar: 1.054571817e-34, // J s
  kB: 1.380649e-23, // J/K (exact SI 2019)
  M_sun: 1.98847e30, // kg
  M_earth: 5.9722e24, // kg
  R_sun: 6.957e8, // m
  AU: 1.495978707e11, // m
  wienB: 2.897771955e-3, // m K
  lPlanck: 1.616255e-35, // m
  ePlanckGeV: 1.22089e19, // GeV
  tPlanckK: 1.416784e32, // K
  cmbTempK: 2.725, // K
};

export interface CosmicEpoch {
  id: string;
  name: string;
  shortLabel: string;
  timeLabel: string;
  log10TimeSec: number; // log10(t in seconds)
  tempLabel: string;
  log10TempK: number; // approximate log10(T in K)
  scaleLabel: string;
  densityLabel: string;
  dominantRegime: string;
  summary: string;
  forcesActive: string;
  wavelengthLabel: string;
  expansionFactor: number; // 0..1 normalized visual scale
  photonColorHex: string;
  energyBudget: {
    radiation: number;
    matter: number;
    darkEnergy: number;
  };
}

export const COSMIC_EPOCHS: CosmicEpoch[] = [
  {
    id: 'planck',
    name: 'Planck Era',
    shortLabel: 'Planck',
    timeLabel: '10^-43 s',
    log10TimeSec: -43,
    tempLabel: '1.4 x 10^32 K',
    log10TempK: 32.15,
    scaleLabel: '10^-35 m (Planck length)',
    densityLabel: '5 x 10^93 g/cm^3',
    dominantRegime: 'Quantum Gravity',
    summary: 'All four forces unified in a quantum-gravity regime; gravity separates as spacetime cools below the Planck scale.',
    forcesActive: '1 Unified Superforce',
    wavelengthLabel: '10^-35 m (Planck-scale quanta)',
    expansionFactor: 0.04,
    photonColorHex: '#f8fafc',
    energyBudget: { radiation: 100, matter: 0, darkEnergy: 0 },
  },
  {
    id: 'gut',
    name: 'Grand Unification (GUT) Era',
    shortLabel: 'GUT',
    timeLabel: '10^-43 to 10^-36 s',
    log10TimeSec: -36,
    tempLabel: '10^28 K',
    log10TempK: 28,
    scaleLabel: 'Marble-scale observable patch',
    densityLabel: '10^75 - 10^77 g/cm^3',
    dominantRegime: 'False Vacuum / GUT',
    summary: 'Gravity is distinct while strong, weak, and electromagnetic interactions remain unified until symmetry breaking at 10^-36 s.',
    forcesActive: '2 Forces (Gravity + GUT)',
    wavelengthLabel: '10^-31 m (Extreme gamma)',
    expansionFactor: 0.12,
    photonColorHex: '#e0e7ff',
    energyBudget: { radiation: 95, matter: 0, darkEnergy: 5 },
  },
  {
    id: 'inflation',
    name: 'Cosmic Inflation & Reheating',
    shortLabel: 'Inflation',
    timeLabel: '10^-36 to 10^-32 s',
    log10TimeSec: -32,
    tempLabel: 'Supercools -> 10^27 K',
    log10TempK: 27,
    scaleLabel: 'Golf-ball to metres (exponential)',
    densityLabel: 'Constant vacuum energy',
    dominantRegime: 'Inflaton Vacuum Energy',
    summary: 'Inflaton vacuum energy drives exponential expansion, flattening spacetime before decaying into a hot quark-gluon plasma.',
    forcesActive: '3 Forces (Gravity, Strong, Electroweak)',
    wavelengthLabel: '10^-30 m (Reheated plasma)',
    expansionFactor: 0.28,
    photonColorHex: '#c7d2fe',
    energyBudget: { radiation: 20, matter: 0, darkEnergy: 80 },
  },
  {
    id: 'electroweak',
    name: 'Electroweak Symmetry Breaking',
    shortLabel: 'Electroweak',
    timeLabel: '10^-12 s',
    log10TimeSec: -12,
    tempLabel: '10^15 K (246 GeV)',
    log10TempK: 15,
    scaleLabel: 'Solar-system scale',
    densityLabel: '10^26 g/cm^3',
    dominantRegime: 'Radiation Dominated',
    summary: 'Higgs field acquires its 246 GeV vacuum value; W and Z bosons and elementary fermions gain mass as EM separates from Weak.',
    forcesActive: '4 Distinct Forces',
    wavelengthLabel: '10^-18 m (Electroweak gamma)',
    expansionFactor: 0.38,
    photonColorHex: '#93c5fd',
    energyBudget: { radiation: 99, matter: 1, darkEnergy: 0 },
  },
  {
    id: 'quark-hadron',
    name: 'Quark-Hadron Transition',
    shortLabel: 'Hadrons',
    timeLabel: '10^-6 s',
    log10TimeSec: -6,
    tempLabel: '10^12 K (~200 MeV)',
    log10TempK: 12,
    scaleLabel: 'Interstellar patch',
    densityLabel: '10^15 g/cm^3',
    dominantRegime: 'QCD Confinement',
    summary: 'Strong force confines free quarks and gluons into protons and neutrons, matching peak temperatures probed at the LHC (5.5 x 10^12 K).',
    forcesActive: '4 Forces (QCD Confined)',
    wavelengthLabel: '10^-15 m (Nuclear gamma)',
    expansionFactor: 0.46,
    photonColorHex: '#60a5fa',
    energyBudget: { radiation: 97, matter: 3, darkEnergy: 0 },
  },
  {
    id: 'nucleosynthesis',
    name: 'Neutrino Decoupling & BBN',
    shortLabel: 'BBN',
    timeLabel: '1 s to 20 min',
    log10TimeSec: 2.3,
    tempLabel: '10^10 to 10^9 K',
    log10TempK: 9.5,
    scaleLabel: '20 - 25 light-years across',
    densityLabel: '10^5 g/cm^3 (at 1 s)',
    dominantRegime: 'Radiation Dominated',
    summary: 'Neutrinos decouple and primordial nuclear fusion locks in ~75% hydrogen and ~25% helium nuclei across the cosmos.',
    forcesActive: '4 Forces',
    wavelengthLabel: '10^-12 m (Hard X-ray / gamma)',
    expansionFactor: 0.55,
    photonColorHex: '#fde047',
    energyBudget: { radiation: 92, matter: 8, darkEnergy: 0 },
  },
  {
    id: 'cmb',
    name: 'Recombination & CMB Release',
    shortLabel: 'CMB',
    timeLabel: '380,000 yr',
    log10TimeSec: 13.08,
    tempLabel: '3,000 K (now 2.725 K)',
    log10TempK: 3.48,
    scaleLabel: '84 million ly (z = 1100)',
    densityLabel: '10^-21 g/cm^3',
    dominantRegime: 'Matter Dominated',
    summary: 'Electrons bind to nuclei, making space transparent. Photons stream freely as a near-perfect blackbody now redshifted to 1.06 mm.',
    forcesActive: '4 Forces (Gravity shapes seeds)',
    wavelengthLabel: '966 nm -> 1.06 mm today',
    expansionFactor: 0.67,
    photonColorHex: '#fb923c',
    energyBudget: { radiation: 25, matter: 75, darkEnergy: 0 },
  },
  {
    id: 'stars',
    name: 'First Stars & Galaxy Assembly',
    shortLabel: 'Stars',
    timeLabel: '200 Myr - 2 Gyr',
    log10TimeSec: 16.2,
    tempLabel: '60 K -> 10 K',
    log10TempK: 1.5,
    scaleLabel: 'Billions of ly',
    densityLabel: '10^-27 g/cm^3',
    dominantRegime: 'Dark Matter Halos',
    summary: 'Dark matter halos seed gravitational collapse, igniting proton-proton fusion in the first stars and building spiral galaxies.',
    forcesActive: '4 Forces',
    wavelengthLabel: '0.05 mm (Far infrared)',
    expansionFactor: 0.78,
    photonColorHex: '#f87171',
    energyBudget: { radiation: 0.2, matter: 98.8, darkEnergy: 1 },
  },
  {
    id: 'present',
    name: 'Dark Energy Era (Present)',
    shortLabel: 'Today',
    timeLabel: '13.82 Gyr',
    log10TimeSec: 17.64,
    tempLabel: '2.725 K (CMB)',
    log10TempK: 0.435,
    scaleLabel: '93 billion ly (8.8 x 10^26 m)',
    densityLabel: '9.9 x 10^-30 g/cm^3',
    dominantRegime: 'Dark Energy (68.3%)',
    summary: 'Accelerated expansion driven by dark energy (68.3%), with dark matter (26.8%) binding galaxies and ordinary matter at just 4.9%.',
    forcesActive: '4 Forces (Lambda dominates)',
    wavelengthLabel: '1.06 mm (Microwave)',
    expansionFactor: 0.89,
    photonColorHex: '#ef4444',
    energyBudget: { radiation: 0.01, matter: 31.7, darkEnergy: 68.3 },
  },
  {
    id: 'heat-death',
    name: 'Black Hole & Heat Death Era',
    shortLabel: 'Heat Death',
    timeLabel: '10^14 to 10^100+ yr',
    log10TimeSec: 107.5,
    tempLabel: '< 10^-8 K -> 0 K',
    log10TempK: -12,
    scaleLabel: 'Event-horizon isolated patches',
    densityLabel: '-> Vacuum floor',
    dominantRegime: 'Maximum Entropy',
    summary: 'Stars burn out and black holes slowly evaporate via Hawking radiation until thermodynamic equilibrium approaches the Landauer floor.',
    forcesActive: '4 Forces (Asymptotically isolated)',
    wavelengthLabel: '> 10^9 m (Ultra-long radio)',
    expansionFactor: 1.0,
    photonColorHex: '#64748b',
    energyBudget: { radiation: 0, matter: 0.01, darkEnergy: 99.99 },
  },
];

export interface RelativityResult {
  beta: number; // v/c
  gamma: number;
  srClockRate: number; // dtau/dt = 1/gamma
  lengthContraction: number; // L/L0 = 1/gamma
  kineticEnergyPerMc2: number; // gamma - 1
  massKg: number;
  massSolar: number;
  schwarzschildRadiusM: number;
  schwarzschildRadiusKm: number;
  photonSphereKm: number;
  iscoKm: number;
  observerRadiusKm: number;
  grClockRate: number; // sqrt(1 - r_s/r)
  combinedClockRate: number; // sqrt(1 - r_s/r - beta^2) or product for clarity
  escapeVelocityBeta: number; // sqrt(r_s/r)
  hawkingTempK: number;
  bekensteinEntropyBits: number; // S_BH / (k_B ln 2)
  evaporationYears: number;
}

export function computeRelativity(
  beta: number,
  massSolar: number,
  radiusRatioRs: number
): RelativityResult {
  const safeBeta = Math.min(Math.max(beta, 0), 0.99999999);
  const gamma = 1 / Math.sqrt(1 - safeBeta * safeBeta);
  const srClockRate = 1 / gamma;
  const lengthContraction = srClockRate;
  const kineticEnergyPerMc2 = gamma - 1;

  const massKg = massSolar * CONSTANTS.M_sun;
  const schwarzschildRadiusM = (2 * CONSTANTS.G * massKg) / (CONSTANTS.c * CONSTANTS.c);
  const schwarzschildRadiusKm = schwarzschildRadiusM / 1000;
  const photonSphereKm = 1.5 * schwarzschildRadiusKm;
  const iscoKm = 3 * schwarzschildRadiusKm;

  const safeRatio = Math.max(radiusRatioRs, 1.01);
  const observerRadiusKm = safeRatio * schwarzschildRadiusKm;
  const grClockRate = Math.sqrt(1 - 1 / safeRatio);
  const combinedClockRate = srClockRate * grClockRate;
  const escapeVelocityBeta = Math.sqrt(1 / safeRatio);

  // Hawking temperature: T_H = hbar * c^3 / (8 * pi * G * M * k_B)
  const hawkingTempK =
    (CONSTANTS.hbar * Math.pow(CONSTANTS.c, 3)) /
    (8 * Math.PI * CONSTANTS.G * massKg * CONSTANTS.kB);

  // Bekenstein-Hawking entropy in bits: A / (4 * l_P^2 * ln(2))
  const horizonAreaM2 = 4 * Math.PI * schwarzschildRadiusM * schwarzschildRadiusM;
  const bekensteinEntropyBits =
    horizonAreaM2 / (4 * CONSTANTS.lPlanck * CONSTANTS.lPlanck * Math.LN2);

  // Hawking evaporation time: t_evap = 5120 * pi * G^2 * M^3 / (hbar * c^4)
  const evapSeconds =
    (5120 * Math.PI * CONSTANTS.G * CONSTANTS.G * Math.pow(massKg, 3)) /
    (CONSTANTS.hbar * Math.pow(CONSTANTS.c, 4));
  const evaporationYears = evapSeconds / (365.25 * 86400);

  return {
    beta: safeBeta,
    gamma,
    srClockRate,
    lengthContraction,
    kineticEnergyPerMc2,
    massKg,
    massSolar,
    schwarzschildRadiusM,
    schwarzschildRadiusKm,
    photonSphereKm,
    iscoKm,
    observerRadiusKm,
    grClockRate,
    combinedClockRate,
    escapeVelocityBeta,
    hawkingTempK,
    bekensteinEntropyBits,
    evaporationYears,
  };
}

export interface ForceBenchmark {
  id: string;
  label: string;
  log10GeV: number;
  energyText: string;
  note: string;
}

export const ENERGY_BENCHMARKS: ForceBenchmark[] = [
  {
    id: 'atomic',
    label: 'Atomic / QED',
    log10GeV: -6,
    energyText: '1 keV (10^-6 GeV)',
    note: 'Long-range QED screening: alpha = 1/137.036.',
  },
  {
    id: 'qcd',
    label: 'QCD Scale',
    log10GeV: -0.7,
    energyText: '0.2 GeV',
    note: 'Strong confinement at 10^-15 m binds quarks into protons.',
  },
  {
    id: 'ew',
    label: 'Electroweak',
    log10GeV: 2.39,
    energyText: '246 GeV (Higgs VEV)',
    note: 'W (80 GeV), Z (91 GeV), Higgs (125 GeV); alpha_EM rises to 1/128.',
  },
  {
    id: 'lhc',
    label: 'LHC Peak',
    log10GeV: 4.15,
    energyText: '14,000 GeV (14 TeV)',
    note: 'Highest human collider energy; gluino limits > 2 TeV.',
  },
  {
    id: 'gut',
    label: 'GUT Scale',
    log10GeV: 16.3,
    energyText: '2 x 10^16 GeV',
    note: 'Strong, Weak, and EM running couplings converge (exact in SUSY).',
  },
  {
    id: 'planck',
    label: 'Planck Scale',
    log10GeV: 19.09,
    energyText: '1.22 x 10^19 GeV',
    note: '10^15x above LHC; gravity reaches order-1 strength alongside quantum forces.',
  },
];

// 1-loop RG running of inverse gauge couplings alpha_i^-1(mu)
// Reference at M_Z = 91.1876 GeV (log10(M_Z) = 1.96):
// GUT-normalized: alpha_1^-1(M_Z) = 59.0, alpha_2^-1(M_Z) = 29.6, alpha_3^-1(M_Z) = 8.5
// Standard Model 1-loop beta coefficients b_i = (41/10, -19/6, -7)
// MSSM (SUSY above 1 TeV, log10=3) b_i = (33/5, 1, -3)
export function computeRunningCouplings(log10GeV: number, susy: boolean) {
  const logMZ = Math.log10(91.1876);
  const logSUSY = 3.0; // 1 TeV threshold
  const ln10 = Math.LN10;

  const invA1_MZ = 59.0;
  const invA2_MZ = 29.6;
  const invA3_MZ = 8.47;

  const bSM = [41 / 10, -19 / 6, -7];
  const bSUSY = [33 / 5, 1, -3];

  function evolve(invAtMZ: number, idx: number, logE: number): number {
    const clampedLogE = Math.max(logE, -0.5); // perturbative cutoff near Lambda_QCD for alpha_3
    if (!susy || clampedLogE <= logSUSY) {
      const dt = (clampedLogE - logMZ) * ln10;
      return invAtMZ - (bSM[idx] / (2 * Math.PI)) * dt;
    }
    const dt1 = (logSUSY - logMZ) * ln10;
    const atSusy = invAtMZ - (bSM[idx] / (2 * Math.PI)) * dt1;
    const dt2 = (clampedLogE - logSUSY) * ln10;
    return atSusy - (bSUSY[idx] / (2 * Math.PI)) * dt2;
  }

  const inv1 = Math.max(evolve(invA1_MZ, 0, Math.max(log10GeV, -6)), 1);
  const inv2 = Math.max(evolve(invA2_MZ, 1, Math.max(log10GeV, 1.9)), 1);
  const inv3 =
    log10GeV < -0.3
      ? 1.0 // non-perturbative confinement floor
      : Math.max(evolve(invA3_MZ, 2, log10GeV), 1);

  // Dimensionless gravitational coupling alpha_G(E) = (E / E_Planck)^2
  const log10AlphaG = 2 * (log10GeV - Math.log10(CONSTANTS.ePlanckGeV));
  const alphaG = Math.pow(10, Math.min(log10AlphaG, 0.2));

  return {
    alpha1: 1 / inv1,
    alpha2: 1 / inv2,
    alpha3: 1 / inv3,
    alphaG,
    inv1,
    inv2,
    inv3,
    log10AlphaG,
  };
}

export function formatSci(val: number, digits = 2): string {
  if (!Number.isFinite(val)) return 'Inf';
  if (val === 0) return '0';
  const abs = Math.abs(val);
  if (abs >= 0.01 && abs < 10000) {
    return val.toFixed(digits);
  }
  const exp = Math.floor(Math.log10(abs));
  const mant = val / Math.pow(10, exp);
  return `${mant.toFixed(digits)} x 10^${exp}`;
}
