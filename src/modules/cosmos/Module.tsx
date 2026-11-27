import { useState } from 'react';
import './styles/editorial.css';
import { RelativityLab } from './components/RelativityLab';
import { ForcesUnificationLab } from './components/ForcesUnificationLab';
import { exportLabData } from './utils/exportLab';

export default function CosmosModule() {
  const [beta, setBeta] = useState<number>(0.866025);
  const [logMassSolar, setLogMassSolar] = useState<number>(Math.log10(4.3e6));
  const [radiusRatioRs, setRadiusRatioRs] = useState<number>(3.0);
  const [logEnergyGeV, setLogEnergyGeV] = useState<number>(4.15);
  const [useSusy, setUseSusy] = useState<boolean>(true);
  const exp = (format: 'csv' | 'md' | 'json') =>
    exportLabData({ beta, logMassSolar, radiusRatioRs, logEnergyGeV, useSusy }, format);

  return (
    <div className="mod-wrap">
      <RelativityLab
        beta={beta}
        onBetaChange={setBeta}
        logMassSolar={logMassSolar}
        onLogMassSolarChange={setLogMassSolar}
        radiusRatioRs={radiusRatioRs}
        onRadiusRatioRsChange={setRadiusRatioRs}
      />
      <hr className="mod-divider" />
      <ForcesUnificationLab
        logEnergyGeV={logEnergyGeV}
        onLogEnergyGeVChange={setLogEnergyGeV}
        useSusy={useSusy}
        onUseSusyChange={setUseSusy}
      />
      <div className="mod-exports" aria-label="Export snapshot">
        <span className="lbl">export snapshot</span>
        <button type="button" className="btn" onClick={() => exp('csv')}>CSV</button>
        <button type="button" className="btn" onClick={() => exp('md')}>Markdown</button>
        <button type="button" className="btn" onClick={() => exp('json')}>JSON</button>
      </div>
    </div>
  );
}
