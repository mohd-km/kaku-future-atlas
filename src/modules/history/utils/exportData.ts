import { TIMELINE_EVENTS, SCIENCE_MILESTONES } from '../data/timelineData';
import {
  CIVILIZATION_PRESETS,
  type SimulationParams,
  type SimulationResult,
} from '../data/civilizationData';

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAtlasCSV(params: SimulationParams, sim: SimulationResult) {
  const headers = [
    'type',
    'id',
    'title_or_name',
    'epoch_or_era',
    'years_ago_or_kcal',
    'domain_or_archetype',
    'summary',
  ];
  const rows: string[][] = [];

  for (const ev of TIMELINE_EVENTS) {
    rows.push([
      'timeline_event',
      ev.id,
      ev.title,
      ev.epoch,
      String(ev.yearsAgo),
      ev.domain,
      ev.oneLiner,
    ]);
  }
  for (const sc of SCIENCE_MILESTONES) {
    rows.push([
      'science_milestone',
      sc.id,
      `${sc.figure}: ${sc.breakthrough}`,
      sc.yearLabel,
      String(sc.yearsAgo),
      sc.kind,
      sc.paradigmNote,
    ]);
  }
  for (const civ of CIVILIZATION_PRESETS) {
    rows.push([
      'civilization_preset',
      civ.id,
      civ.name,
      civ.era,
      `${civ.energyKcalPerCapita} kcal/day`,
      civ.governanceArchetype,
      civ.primaryCollapseDriver,
    ]);
  }
  rows.push([
    'custom_simulation',
    'user_scenario',
    sim.dominantLoop,
    `Resilience ${sim.resilienceScore}/100`,
    `${params.energyKcalPerCapita} kcal/day`,
    `Openness ${params.institutionalOpenness}%`,
    `Shock ${params.resourceShock}%, Coupling ${params.supplyCoupling}%, Density ${sim.estimatedDensity}/km2`,
  ]);

  const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const csv = [headers.join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
  triggerDownload('civilization-futures-history.csv', csv, 'text/csv;charset=utf-8;');
}

export function exportAtlasJSON(params: SimulationParams, sim: SimulationResult) {
  const payload = {
    atlas: 'Civilization & Futures Atlas (future.mohammed-km.in)',
    author: 'Mohammed KM',
    exportedAt: new Date().toISOString(),
    simulationParameters: params,
    simulationOutcome: {
      dominantLoop: sim.dominantLoop,
      resilienceScore: sim.resilienceScore,
      netSurplusRatio: sim.netSurplusRatio,
      estimatedDensityPerKm2: sim.estimatedDensity,
      estimatedMaxPolityPop: sim.estimatedSettlementPop,
      collapseDrivers: sim.collapseDrivers,
    },
    civilizationPresets: CIVILIZATION_PRESETS,
    timelineEvents: TIMELINE_EVENTS,
    scienceMilestones: SCIENCE_MILESTONES,
  };
  triggerDownload(
    'civilization-futures-history.json',
    JSON.stringify(payload, null, 2),
    'application/json;charset=utf-8;'
  );
}

export function exportAtlasMarkdown(params: SimulationParams, sim: SimulationResult) {
  const lines: string[] = [
    '# Civilization & Futures Atlas — History Snapshot',
    '',
    'Author: Mohammed KM',
    `Exported: ${new Date().toISOString()}`,
    '',
    '## 1. Simulated Civilization Profile',
    '',
    `- **Energy Capture:** ${params.energyKcalPerCapita.toLocaleString()} kcal/day per capita`,
    `- **Institutional Openness:** ${params.institutionalOpenness}%`,
    `- **Resource / Climate Shock:** ${params.resourceShock}%`,
    `- **Supply-Network Coupling:** ${params.supplyCoupling}%`,
    `- **Dominant System Loop:** ${sim.dominantLoop}`,
    `- **Resilience Score:** ${sim.resilienceScore} / 100`,
    `- **Estimated Population Density:** ${sim.estimatedDensity} people/km2`,
    `- **Estimated Polity Scale:** ${sim.estimatedSettlementPop.toLocaleString()} people`,
    '',
    '### Collapse Driver Breakdown',
    '',
    '| Driver | Stress (0-100) | Mechanism |',
    '|---|---:|---|',
    ...sim.collapseDrivers.map((d) => `| ${d.label} | ${d.score} | ${d.note} |`),
    '',
    '## 2. Historical Civilizational Regimes',
    '',
    '| Regime | Era | Energy (kcal/day) | Density (/km2) | Openness | Primary Collapse Driver |',
    '|---|---|---:|---:|---:|---|',
    ...CIVILIZATION_PRESETS.map(
      (c) =>
        `| ${c.name} | ${c.era} | ${c.energyKcalPerCapita.toLocaleString()} | ${c.popDensityPerKm2} | ${c.institutionalOpenness}% | ${c.primaryCollapseDriver} |`
    ),
    '',
    '## 3. Master Logarithmic Chronology (13.8 Gya - Present)',
    '',
    '| Horizon | Event | Domain | Summary |',
    '|---|---|---|---|',
    ...TIMELINE_EVENTS.map((e) => `| ${e.displayDate} | ${e.title} | ${e.domain} | ${e.oneLiner} |`),
  ];

  triggerDownload(
    'civilization-futures-history-report.md',
    lines.join('\n'),
    'text/markdown;charset=utf-8;'
  );
}
