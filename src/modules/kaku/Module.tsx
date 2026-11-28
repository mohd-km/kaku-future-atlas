import { useState } from 'react';
import './styles.css';
import './module.css';
import KardashevLab from './KardashevLab.jsx';
import ImpossibleAtlas from './ImpossibleAtlas.jsx';

export default function KardashevModule() {
  const [k, setK] = useState(0.73);
  return (
    <div className="mod-wrap">
      <div className="mod-head">
        <h2 className="section-title">planetary energy budget builder</h2>
        <p className="section-lead">Start from the world's real 2023 energy mix, cut fossil fuels or grow clean sources, and watch the Kardashev rating move.</p>
      </div>
      <KardashevLab onKChange={setK} />
      <hr className="mod-divider" />
      <ImpossibleAtlas k={k} />
    </div>
  );
}
