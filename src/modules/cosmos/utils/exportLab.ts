import {
  computeRelativity,
  computeRunningCouplings,
  formatSci,
} from '../data/physics';

export interface LabSnapshot {
  beta: number;
  logMassSolar: number;
  radiusRatioRs: number;
  logEnergyGeV: number;
  useSusy: boolean;
}

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportLabData(snapshot: LabSnapshot, format: 'json' | 'csv' | 'md') {
  const massSolar = Math.pow(10, snapshot.logMassSolar);
  const rel = computeRelativity(snapshot.beta, massSolar, snapshot.radiusRatioRs);
  const couplings = computeRunningCouplings(snapshot.logEnergyGeV, snapshot.useSusy);
  const energyGeV = Math.pow(10, snapshot.logEnergyGeV);
  const timestamp = new Date().toISOString();

  if (format === 'json') {
    const payload = {
      title: 'Civilization & Futures Atlas — Cosmos (future.mohammed-km.in) — Mohammed KM',
      exportedAt: timestamp,
      relativityCalculator: {
        velocityBeta: rel.beta,
        lorentzGamma: rel.gamma,
        srClockRate: rel.srClockRate,
        lengthContractionRatio: rel.lengthContraction,
        blackHoleMassSolar: rel.massSolar,
        schwarzschildRadiusKm: rel.schwarzschildRadiusKm,
        observerRadiusRatioRs: snapshot.radiusRatioRs,
        grClockRate: rel.grClockRate,
        combinedClockRate: rel.combinedClockRate,
        hawkingTempK: rel.hawkingTempK,
        bekensteinEntropyBits: rel.bekensteinEntropyBits,
      },
      fundamentalForces: {
        model: snapshot.useSusy ? 'SUSY (MSSM)' : 'Standard Model',
        energyGeV,
        log10EnergyGeV: snapshot.logEnergyGeV,
        alpha1_EM: couplings.alpha1,
        alpha2_Weak: couplings.alpha2,
        alpha3_Strong: couplings.alpha3,
        alphaG_Gravity: couplings.alphaG,
      },
    };
    triggerDownload(
      'civilization-futures-cosmos.json',
      JSON.stringify(payload, null, 2),
      'application/json;charset=utf-8'
    );
    return;
  }

  if (format === 'csv') {
    const rows: [string, string, string][] = [
      ['Module', 'Metric', 'Value'],
      ['Relativity', 'Velocity (v/c)', rel.beta.toFixed(6)],
      ['Relativity', 'Lorentz Factor (gamma)', rel.gamma.toFixed(6)],
      ['Relativity', 'SR Clock Rate (dtau/dt)', rel.srClockRate.toFixed(6)],
      ['Relativity', 'Black Hole Mass (M_sun)', formatSci(rel.massSolar, 3)],
      ['Relativity', 'Schwarzschild Radius (km)', formatSci(rel.schwarzschildRadiusKm, 3)],
      ['Relativity', 'Observer Distance (r/r_s)', snapshot.radiusRatioRs.toFixed(2)],
      ['Relativity', 'GR Clock Rate (dtau/dt)', rel.grClockRate.toFixed(6)],
      ['Relativity', 'Combined Clock Rate', rel.combinedClockRate.toFixed(6)],
      ['Relativity', 'Hawking Temperature (K)', formatSci(rel.hawkingTempK, 3)],
      ['Relativity', 'Bekenstein-Hawking Entropy (bits)', formatSci(rel.bekensteinEntropyBits, 3)],
      ['Fundamental Forces', 'RG Running Model', snapshot.useSusy ? 'SUSY (MSSM)' : 'Standard Model'],
      ['Fundamental Forces', 'Probe Energy (GeV)', formatSci(energyGeV, 3)],
      ['Fundamental Forces', '1 / alpha_1 (U1 EM)', couplings.inv1.toFixed(3)],
      ['Fundamental Forces', '1 / alpha_2 (SU2 Weak)', couplings.inv2.toFixed(3)],
      ['Fundamental Forces', '1 / alpha_3 (SU3 Strong)', couplings.inv3.toFixed(3)],
      ['Fundamental Forces', 'log10(alpha_G)', couplings.log10AlphaG.toFixed(2)],
    ];

    const csv = rows
      .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    triggerDownload(
      'civilization-futures-cosmos.csv',
      csv,
      'text/csv;charset=utf-8'
    );
    return;
  }

  const md = `# Civilization & Futures Atlas — Cosmos Snapshot

Author: Mohammed KM  
Exported: ${timestamp}

## 1. Special & General Relativity Calculator
- **Relative Velocity:** ${(rel.beta * 100).toFixed(4)}% c
- **Lorentz Factor (gamma):** ${rel.gamma.toFixed(4)}
- **Length Contraction (L/L_0):** ${rel.lengthContraction.toFixed(4)}
- **Black Hole Mass:** ${formatSci(rel.massSolar, 3)} M_sun
- **Schwarzschild Radius (r_s):** ${formatSci(rel.schwarzschildRadiusKm, 3)} km
- **Observer Distance:** ${snapshot.radiusRatioRs.toFixed(2)} r_s
- **SR / GR / Combined Clock Rate:** ${rel.srClockRate.toFixed(4)} / ${rel.grClockRate.toFixed(4)} / ${rel.combinedClockRate.toFixed(4)}
- **Hawking Temperature:** ${formatSci(rel.hawkingTempK, 3)} K
- **Bekenstein-Hawking Entropy:** ${formatSci(rel.bekensteinEntropyBits, 3)} bits

## 2. Fundamental Forces Energy-Scale Comparator
- **Model:** ${snapshot.useSusy ? 'SUSY (MSSM)' : 'Standard Model'}
- **Probe Energy:** ${formatSci(energyGeV, 3)} GeV (10^${snapshot.logEnergyGeV.toFixed(1)} GeV)
- **U(1) EM (1/alpha_1):** ${couplings.inv1.toFixed(2)}
- **SU(2) Weak (1/alpha_2):** ${couplings.inv2.toFixed(2)}
- **SU(3) Strong (1/alpha_3):** ${couplings.inv3.toFixed(2)}
- **Gravity Coupling (alpha_G):** 10^${couplings.log10AlphaG.toFixed(1)}
`;

  triggerDownload(
    'civilization-futures-cosmos.md',
    md,
    'text/markdown;charset=utf-8'
  );
}
