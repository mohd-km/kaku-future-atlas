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
  { id: 'paradigms', label: 'Compute curve & limits', lead: '' },
  { id: 'brain', label: 'Brain vs silicon', lead: 'Try this: press "Simulate Skill Copy" to see a learned skill copied to every chip core at once, something a brain can only pass on by years of teaching.' },
  { id: 'probes', label: 'Galaxy probes', lead: 'Try this: slide the probe speed from 0.10c to 0.50c. Crossing time only drops from about 3 million to 2.2 million years, because building copies at each star takes most of the time.' },
  { id: 'chessboard', label: '64-square doubling', lead: 'Try this: press "Jump to Sq 33". That one square holds over 4 billion grains, more than all 32 squares before it put together.' },
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
      {VIEWS[idx].lead ? (
        <p className="sub-lead" style={{ margin: '0 0 14px', fontSize: '14px', color: 'var(--ink-secondary, #555)', maxWidth: '100%', overflowWrap: 'anywhere' }}>{VIEWS[idx].lead}</p>
      ) : null}
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
