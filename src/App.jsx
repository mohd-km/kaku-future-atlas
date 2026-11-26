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
        <h1 className="site-title">Kaku Future Atlas</h1>
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
        {activeTab === 'kardashev' && <KardashevLab />}
        {activeTab === 'mind' && <MindExplorer />}
        {activeTab === 'future' && <FutureHorizon />}
        {activeTab === 'quantum' && <QuantumLab />}
        {activeTab === 'impossible' && <ImpossibleAtlas />}
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
