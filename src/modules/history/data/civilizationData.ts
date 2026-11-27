export interface CivilizationPreset {
  id: string;
  name: string;
  era: string;
  energyKcalPerCapita: number;
  popDensityPerKm2: number;
  maxPolityPop: number;
  institutionalOpenness: number; // 0 (closed/static) to 100 (open/dynamic error-correcting)
  resourceShockExposure: number; // 0 to 100
  supplyCouplingFragility: number; // 0 to 100
  complexityOverhead: number; // 0 to 100
  governanceArchetype: string;
  energySource: string;
  primaryCollapseDriver: string;
  historicalAnchor: string;
}

export interface SimulationParams {
  energyKcalPerCapita: number; // 2,500 - 250,000
  institutionalOpenness: number; // 0 - 100
  resourceShock: number; // 0 - 100
  supplyCoupling: number; // 0 - 100
}

export interface SimulationStep {
  generation: number;
  populationIndex: number; // normalized 100 start
  complexityIndex: number;
  surplusIndex: number;
  collapseRisk: number; // 0 - 100
}

export interface SimulationResult {
  steps: SimulationStep[];
  dominantLoop: 'Reinforcing (Exponential Growth)' | 'Equilibrium (Steady State)' | 'Balancing (Decline / Collapse)';
  resilienceScore: number; // 0 - 100
  netSurplusRatio: number;
  estimatedDensity: number;
  estimatedSettlementPop: number;
  collapseDrivers: {
    label: string;
    score: number;
    note: string;
  }[];
}

export const CIVILIZATION_PRESETS: CivilizationPreset[] = [
  {
    id: 'forager',
    name: 'Forager Band',
    era: '300 - 12 kya',
    energyKcalPerCapita: 3_500,
    popDensityPerKm2: 0.4,
    maxPolityPop: 150,
    institutionalOpenness: 62,
    resourceShockExposure: 28,
    supplyCouplingFragility: 12,
    complexityOverhead: 10,
    governanceArchetype: 'Egalitarian immediate-return (Dunbar limit ~150)',
    energySource: 'Somatic + firewood cooking',
    primaryCollapseDriver: 'Local climate shift or megafaunal depletion',
    historicalAnchor: 'High ecological resilience, zero bureaucratic overhead, low carrying capacity (<1 person/km2).',
  },
  {
    id: 'neolithic',
    name: 'Neolithic Village',
    era: '10,000 - 4,000 BCE',
    energyKcalPerCapita: 10_000,
    popDensityPerKm2: 35,
    maxPolityPop: 2_500,
    institutionalOpenness: 44,
    resourceShockExposure: 48,
    supplyCouplingFragility: 24,
    complexityOverhead: 26,
    governanceArchetype: 'Sedentary delayed-return kinship village',
    energySource: 'Monoculture grains + draft animals',
    primaryCollapseDriver: 'Harvest failure & livestock zoonotic epidemics',
    historicalAnchor: '10-100x carrying capacity over foraging, traded against anemia, caries, and endemic disease.',
  },
  {
    id: 'bronze-river',
    name: 'Bronze Age River State',
    era: '3500 - 1200 BCE',
    energyKcalPerCapita: 22_000,
    popDensityPerKm2: 85,
    maxPolityPop: 120_000,
    institutionalOpenness: 30,
    resourceShockExposure: 66,
    supplyCouplingFragility: 78,
    complexityOverhead: 58,
    governanceArchetype: 'Centralized temple/palace bureaucracy (Sumer, Egypt, Harappa)',
    energySource: 'Irrigated grain surplus + long-distance bronze trade',
    primaryCollapseDriver: 'Soil salinization, multi-year drought & tin-copper trade snap',
    historicalAnchor: 'Late Bronze Age Collapse (~1200-1150 BCE) synchronously felled Mycenae, Hittites, and Ugarit.',
  },
  {
    id: 'classical-athens',
    name: 'Classical Open Polis (Athens)',
    era: '508 - 322 BCE',
    energyKcalPerCapita: 31_000,
    popDensityPerKm2: 110,
    maxPolityPop: 300_000,
    institutionalOpenness: 82,
    resourceShockExposure: 44,
    supplyCouplingFragility: 55,
    complexityOverhead: 48,
    governanceArchetype: 'Open dynamic society (direct assembly, sortition, criticism)',
    energySource: 'Agrarian surplus + Mediterranean maritime trade & iron',
    primaryCollapseDriver: 'Imperial overstretch & external siege (Peloponnesian War)',
    historicalAnchor: 'Openness to criticism accelerated philosophy and art compared to static Spartan diarchy.',
  },
  {
    id: 'classical-sparta',
    name: 'Closed Static State (Sparta)',
    era: '650 - 371 BCE',
    energyKcalPerCapita: 24_000,
    popDensityPerKm2: 52,
    maxPolityPop: 65_000,
    institutionalOpenness: 16,
    resourceShockExposure: 40,
    supplyCouplingFragility: 30,
    complexityOverhead: 54,
    governanceArchetype: 'Rigid static diarchy (dissent suppressed, stasis prized)',
    energySource: 'Helot-extracted agrarian surplus + iron discipline',
    primaryCollapseDriver: 'Demographic stagnation & inability to adapt to novelty',
    historicalAnchor: 'Static institutions prioritized stability over error-correction, leading to irreversible decline.',
  },
  {
    id: 'industrial',
    name: 'Industrial Fossil-Fuel State',
    era: '1850 - 1950 CE',
    energyKcalPerCapita: 95_000,
    popDensityPerKm2: 240,
    maxPolityPop: 150_000_000,
    institutionalOpenness: 68,
    resourceShockExposure: 58,
    supplyCouplingFragility: 72,
    complexityOverhead: 70,
    governanceArchetype: 'Mass-bureaucratic nation-state (Weberian + Fordist)',
    energySource: 'Coal, oil, steam turbines, electrical grids',
    primaryCollapseDriver: 'Total war, fossil-fuel lock-in & industrial pollution',
    historicalAnchor: 'Broke organic energy limits via thermodynamics and electromagnetism; reordered globally after 1945.',
  },
  {
    id: 'digital-anthropocene',
    name: 'Digital Anthropocene Frontier',
    era: '1990 - 2026 CE',
    energyKcalPerCapita: 230_000,
    popDensityPerKm2: 420,
    maxPolityPop: 8_100_000_000,
    institutionalOpenness: 74,
    resourceShockExposure: 76,
    supplyCouplingFragility: 86,
    complexityOverhead: 82,
    governanceArchetype: 'Globally networked scientific-algorithmic civilization',
    energySource: 'Fossil + nuclear + renewables + planetary compute',
    primaryCollapseDriver: 'Biosphere climate forcing & hyper-coupled supply cascades',
    historicalAnchor: 'Popper-Deutsch conjecture/criticism yields rapid error-correction, tested against planetary limits.',
  },
];

/**
 * First-principles civilizational energy & systems-loop model grounded in:
 * - Energy capture scaling (kcal/day/capita -> carrying density & polity size)
 * - Reinforcing vs Balancing loop dominance
 * - Open/Dynamic error-correction vs Closed/Static fragility (Athens vs Sparta; Popper-Deutsch)
 * - Cascading collapse drivers (Late Bronze Age drought + tin-copper coupling + overhead)
 */
export function runCivilizationSimulation(params: SimulationParams): SimulationResult {
  const { energyKcalPerCapita, institutionalOpenness, resourceShock, supplyCoupling } = params;

  // Log-normalized energy tier: 0 at 2,500 kcal, 1 at 250,000 kcal
  const eNorm = Math.max(
    0,
    Math.min(1, (Math.log10(energyKcalPerCapita) - Math.log10(2500)) / (Math.log10(250000) - Math.log10(2500)))
  );

  // Scaling relations (log-log)
  const estimatedDensity = Math.round(Math.pow(10, -0.35 + eNorm * 3.0) * 10) / 10;
  const estimatedSettlementPop = Math.round(Math.pow(10, 2.15 + eNorm * 7.6));

  // Collapse driver stress indices (0-100)
  const ecologicalStress = Math.min(100, Math.round(resourceShock * 0.72 + eNorm * 28));
  const supplyCascadeStress = Math.min(100, Math.round(supplyCoupling * 0.78 + eNorm * 22));
  const complexityOverhead = Math.min(100, Math.round(14 + eNorm * 68 + supplyCoupling * 0.18));
  const institutionalRigidity = Math.min(100, Math.round(100 - institutionalOpenness));

  // Error-correction buffer (Popper-Deutsch / Athens dynamic society factor)
  const adaptiveCapacity = (institutionalOpenness / 100) * (0.55 + 0.45 * eNorm);

  // Reinforcing growth rate vs Balancing drag per generation
  const rBase = 0.022 + eNorm * 0.045 + adaptiveCapacity * 0.028;
  const bBase =
    (ecologicalStress / 100) * 0.036 +
    (supplyCascadeStress / 100) * 0.028 +
    (complexityOverhead / 100) * 0.022 +
    (institutionalRigidity / 100) * 0.026;

  const steps: SimulationStep[] = [];
  let pop = 100;
  let complexity = 30 + eNorm * 55;
  let surplus = 40 + eNorm * 45;

  for (let g = 0; g <= 50; g++) {
    // Mid-run shock pulse around generations 20-32 (models drought / trade disruption / war)
    const shockWave =
      g >= 18 && g <= 34
        ? Math.sin(((g - 18) / 16) * Math.PI) * (resourceShock / 100) * (0.4 + 0.6 * (supplyCoupling / 100)) * 0.085
        : 0;

    // Diminishing returns as complexity grows without openness
    const overheadDrag = (complexity / 140) * (0.015 + (institutionalRigidity / 100) * 0.022);
    // Open societies self-correct faster after shock
    const recoveryBoost = adaptiveCapacity * (surplus > 15 ? 0.022 : 0.008);

    const netGrowth = rBase + recoveryBoost - bBase - overheadDrag - shockWave;

    const risk = Math.max(
      2,
      Math.min(
        98,
        Math.round(
          (bBase + shockWave + overheadDrag) * 760 - adaptiveCapacity * 28 + (surplus < 25 ? 18 : 0)
        )
      )
    );

    steps.push({
      generation: g,
      populationIndex: Math.round(pop * 10) / 10,
      complexityIndex: Math.round(complexity * 10) / 10,
      surplusIndex: Math.round(surplus * 10) / 10,
      collapseRisk: risk,
    });

    // Advance state
    pop = Math.max(8, Math.min(480, pop * (1 + netGrowth)));
    surplus = Math.max(
      2,
      Math.min(140, surplus + (eNorm * 3.2 + adaptiveCapacity * 2.8 - (bBase + shockWave) * 45 - complexity * 0.025))
    );
    complexity = Math.max(
      10,
      Math.min(130, complexity + (surplus > 30 ? 0.85 : -1.6) - shockWave * 18)
    );
  }

  const startPop = steps[0].populationIndex;
  const endPop = steps[steps.length - 1].populationIndex;
  const ratio = endPop / startPop;

  let dominantLoop: SimulationResult['dominantLoop'];
  if (ratio >= 1.25) {
    dominantLoop = 'Reinforcing (Exponential Growth)';
  } else if (ratio >= 0.78) {
    dominantLoop = 'Equilibrium (Steady State)';
  } else {
    dominantLoop = 'Balancing (Decline / Collapse)';
  }

  const avgRisk = steps.reduce((acc, s) => acc + s.collapseRisk, 0) / steps.length;
  const resilienceScore = Math.max(5, Math.min(98, Math.round(100 - avgRisk * 0.85 + adaptiveCapacity * 14)));
  const netSurplusRatio = Math.round(((100 + steps[steps.length - 1].surplusIndex) / (100 + complexityOverhead * 0.7)) * 100) / 100;

  return {
    steps,
    dominantLoop,
    resilienceScore,
    netSurplusRatio,
    estimatedDensity,
    estimatedSettlementPop,
    collapseDrivers: [
      {
        label: 'Ecological & Climate Shock',
        score: ecologicalStress,
        note: 'Drought, salinization, or planetary climate forcing eroding primary energy surplus.',
      },
      {
        label: 'Supply-Network Coupling',
        score: supplyCascadeStress,
        note: 'Vulnerability to distant bottlenecks (e.g., Bronze Age tin-copper routes or global grids).',
      },
      {
        label: 'Complexity Overhead',
        score: complexityOverhead,
        note: 'Rising administrative, military, and infrastructure energy cost per capita.',
      },
      {
        label: 'Institutional Rigidity',
        score: institutionalRigidity,
        note: 'Suppression of dissent and error-correction (closed static societies vs open inquiry).',
      },
    ],
  };
}
