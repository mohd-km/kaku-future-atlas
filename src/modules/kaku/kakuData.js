// Kardashev energy-scale data: Sagan's continuous Kardashev formula and
// a few energy-gated technologies drawn from Mohammed's own notes
// (planetary_energy_kardashev_and_landauer.md, string_theory_qft_and_cosmology.md).

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
      frontier: 'Fusion not yet in reach'
    };
  }
  if (k < 1.98) {
    return {
      tier: 'Type I (Planetary)',
      plain: 'Uses all the energy reaching its planet',
      frontier: 'Fusion grid in reach'
    };
  }
  if (k < 2.95) {
    return {
      tier: 'Type II (Stellar)',
      plain: 'Uses its whole star, via a Dyson swarm',
      frontier: 'Dyson swarm in reach'
    };
  }
  return {
    tier: 'Type III (Galactic)',
    plain: 'Uses the power of a whole galaxy',
    frontier: 'Galaxy-scale energy'
  };
}

export const KARDASHEV_UNLOCKS = [
  {
    id: 'fusion-grid',
    name: 'Commercial Fusion Grid',
    minK: 0.78,
    summary: 'Clean magnetic and laser fusion plants replace fossil baseload power.',
    law: 'Nuclear binding energy (E = mc^2)'
  },
  {
    id: 'dyson-swarm',
    name: 'Stellar Dyson Swarm',
    minK: 1.95,
    summary: 'Millions of orbiting solar collectors capture the entire output of a host star.',
    law: "A star's full light output (about 4 x 10^26 W for the Sun)"
  },
  {
    id: 'wormhole-net',
    name: 'Galactic Wormhole Transit',
    minK: 2.9,
    summary: 'Shortcuts through spacetime would need exotic negative energy on enormous scales to hold their throats open; speculative.',
    law: 'General relativity'
  }
];
