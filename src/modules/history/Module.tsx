import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import './styles/editorial.css';
import { LogTimelineZoom } from './components/LogTimelineZoom';
import { CivilizationComparator } from './components/CivilizationComparator';
import { CIVILIZATION_PRESETS, runCivilizationSimulation, type SimulationParams } from './data/civilizationData';
import { exportAtlasCSV, exportAtlasJSON, exportAtlasMarkdown } from './utils/exportData';

export default function HistoryModule() {
  const [simParams, setSimParams] = useState<SimulationParams>({
    energyKcalPerCapita: CIVILIZATION_PRESETS[2].energyKcalPerCapita,
    institutionalOpenness: CIVILIZATION_PRESETS[2].institutionalOpenness,
    resourceShock: CIVILIZATION_PRESETS[2].resourceShockExposure,
    supplyCoupling: CIVILIZATION_PRESETS[2].supplyCouplingFragility,
  });
  const simulation = useMemo(() => runCivilizationSimulation(simParams), [simParams]);

  return (
    <div className="mod-wrap">
      <LogTimelineZoom />
      <hr className="mod-divider" />
      <div className="mod-head">
        <h2>energy capture & resilience</h2>
        <p>Energy per person sets how dense and large a society can grow; openness and shocks decide whether it lasts.</p>
      </div>
      <CivilizationComparator params={simParams} onChangeParams={setSimParams} simulation={simulation} />
      <div className="mod-exports" aria-label="Export data">
        <span className="lbl">export</span>
        <button type="button" className="btn" onClick={() => exportAtlasCSV(simParams, simulation)}><Download size={15} /> CSV</button>
        <button type="button" className="btn" onClick={() => exportAtlasJSON(simParams, simulation)}><Download size={15} /> JSON</button>
        <button type="button" className="btn btn-accent" onClick={() => exportAtlasMarkdown(simParams, simulation)}><Download size={15} /> Report (.md)</button>
      </div>
    </div>
  );
}
