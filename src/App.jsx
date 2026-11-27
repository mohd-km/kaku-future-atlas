import React, { useState } from 'react';
import KardashevLab from './components/KardashevLab.jsx';
import MindExplorer from './components/MindExplorer.jsx';
import FutureHorizon from './components/FutureHorizon.jsx';
import QuantumLab from './components/QuantumLab.jsx';
import ImpossibleAtlas from './components/ImpossibleAtlas.jsx';

const TABS = [
  { id: 'kardashev', label: 'Kardashev Scale' },
  { id: 'mind', label: 'Future of the Mind' },
  { id: 'future', label: 'Physics of the Future' },
  { id: 'quantum', label: 'Quantum Supremacy' },
  { id: 'impossible', label: 'Physics of the Impossible' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('kardashev');

  return (
    <div className="app-shell">
      <header className="site-header">
        <p className="header-eyebrow">Interactive Synthesis by Mohammed KM</p>
        <div className="site-title-row">
          <svg
            className="site-monogram"
            viewBox="0 0 44 44"
            width="42"
            height="42"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="1"
              y="1"
              width="42"
              height="42"
              rx="10"
              fill="#ffffff"
              stroke="#111111"
              strokeWidth="1.5"
            />
            <circle cx="22" cy="22" r="13.5" stroke="#111111" strokeWidth="1.25" />
            <ellipse
              cx="22"
              cy="22"
              rx="13.5"
              ry="5.5"
              transform="rotate(-28 22 22)"
              stroke="#111111"
              strokeWidth="1.25"
            />
            <line x1="22" y1="6.5" x2="22" y2="37.5" stroke="#111111" strokeWidth="1.1" />
            <circle cx="22" cy="22" r="2.75" fill="#111111" />
            <circle cx="33.2" cy="15.8" r="1.75" fill="#111111" />
          </svg>
          <h1 className="site-title">Kaku Future Atlas</h1>
        </div>
        <p className="site-subtitle">
          A playable visual guide to civilization energy, minds, quantum machines, and the physics of what comes next—distilled from Michio Kaku&apos;s five future-oriented books.
        </p>
      </header>

      <nav className="tab-nav" role="tablist" aria-label="Atlas pillars">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        <div key={activeTab} className="tab-panel">
          {activeTab === 'kardashev' && <KardashevLab />}
          {activeTab === 'mind' && <MindExplorer />}
          {activeTab === 'future' && <FutureHorizon />}
          {activeTab === 'quantum' && <QuantumLab />}
          {activeTab === 'impossible' && <ImpossibleAtlas />}
        </div>
      </main>

      <footer className="site-footer">
        <span>
          <strong>Kaku Future Atlas</strong> — Authored by Mohammed KM
        </span>
        <span>
          Sources: Physics of the Impossible, Physics of the Future, The Future of the Mind, The Future of Humanity, Quantum Supremacy (100% client-side).
        </span>
      </footer>
    </div>
  );
}
