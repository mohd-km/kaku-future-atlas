import { useState } from 'react';
import './styles.css';
import './module.css';
import '../kaku/styles.css';
import '../kaku/module.css';
import { ParadigmsSection } from './components/ParadigmsSection';
import { BrainSection } from './components/BrainSection';
import { CosmicSection } from './components/CosmicSection';
import { ChessboardSection } from './components/ChessboardSection';
import QuantumLab from '../kaku/QuantumLab.jsx';

const VIEWS = [
  { id: 'paradigms', label: 'Compute curve & limits' },
  { id: 'brain', label: 'Brain vs silicon' },
  { id: 'probes', label: 'Galaxy probes' },
  { id: 'chessboard', label: '64-square doubling' },
] as const;
type ViewId = (typeof VIEWS)[number]['id'];

export default function SingularityModule() {
  const [view, setView] = useState<ViewId>('paradigms');
  const idx = VIEWS.findIndex((v) => v.id === view);
  const next = VIEWS[idx + 1];
  const go = (id: ViewId) => {
    setView(id);
    const el = document.querySelector('.sh-main');
    if (el && window.scrollY > (el as HTMLElement).offsetTop) window.scrollTo({ top: (el as HTMLElement).offsetTop - 8 });
  };
  return (
    <div className="mod-wrap">
      <nav className="sub-nav" role="tablist" aria-label="Singularity views">
        {VIEWS.map((v, i) => (
          <button key={v.id} type="button" role="tab" aria-selected={v.id === view} className={`seg-btn ${v.id === view ? 'active' : ''}`} onClick={() => go(v.id)}>
            <span className="seg-num">0{i + 1}</span>
            {v.label}
          </button>
        ))}
      </nav>
      {view === 'paradigms' && (
        <div className="section-stack">
          <ParadigmsSection />
          <div className="m-kaku"><QuantumLab /></div>
        </div>
      )}
      {view === 'brain' && <BrainSection />}
      {view === 'probes' && <CosmicSection />}
      {view === 'chessboard' && <ChessboardSection />}
      {next ? (
        <div className="sub-next">
          <button type="button" className="btn" onClick={() => go(next.id)}>Next: {next.label} →</button>
        </div>
      ) : null}
    </div>
  );
}
