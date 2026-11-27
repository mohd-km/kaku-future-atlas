import React from 'react';
import ReactDOM from 'react-dom/client';
import './shell/shell.css';
import { Shell, type ShellConfig } from './shell/Shell';
import DefaultTab from './modules/kaku/Module';

const config: ShellConfig = {
  pillar: 'worldview & physics',
  title: 'Civilization & Futures Atlas',
  subtitle:
    'From the physics of the cosmos to the energy curve of civilization, and where computing takes it next.',
  footer: 'Civilization & Futures Atlas · runs entirely in your browser · Mohammed KM',
  tabs: [
    {
      id: 'kardashev', label: 'Kardashev energy', sub: 'Type 0.73 → III · feasibility matrix', scope: 'kaku',
      provenance: [
        { kind: 'real', label: '2023 world primary energy' },
        { kind: 'real', label: "Sagan's K formula" },
        { kind: 'model', label: 'unlock thresholds & feasibility scores' },
      ],
      component: DefaultTab,
      load: () => import('./modules/kaku/Module'),
    },
    {
      id: 'singularity', label: 'Singularity', sub: 'compute curve · brain · probes · 2ⁿ', scope: 'singularity',
      provenance: [
        { kind: 'real', label: 'historical compute price-performance' },
        { kind: 'real', label: 'Lloyd limit · 16·2ⁿ bytes' },
        { kind: 'model', label: 'post-2025 extrapolation' },
      ],
      load: () => import('./modules/singularity/Module'),
    },
    {
      id: 'history', label: 'Big history', sub: '13.8 Gyr log zoom · energy capture', scope: 'history',
      provenance: [
        { kind: 'real', label: 'published dates & Morris energy capture' },
        { kind: 'model', label: 'resilience simulation' },
      ],
      load: () => import('./modules/history/Module'),
    },
    {
      id: 'cosmos', label: 'Relativity & forces', sub: 'time dilation · horizons · unification', scope: 'cosmos',
      provenance: [{ kind: 'model', label: 'textbook equations · CODATA constants' }],
      load: () => import('./modules/cosmos/Module'),
    },
  ],
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Shell config={config} />
  </React.StrictMode>,
);
