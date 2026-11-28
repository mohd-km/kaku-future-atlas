import React, { useMemo, useState } from 'react';
import { IMPOSSIBLE_IDEAS } from './kakuData.js';

// Energy tier each idea needs (from its minK label) mapped onto the Sagan K scale
const TIERS = [
  { id: 'Type I', label: 'Type I', k: 1.0 },
  { id: 'Type I+', label: 'Type I+', k: 1.15 },
  { id: 'Type II-III', label: 'Type II–III', k: 2.0 },
  { id: 'Type III', label: 'Type III', k: 3.0 },
  { id: 'Impossible', label: 'Never', k: Infinity },
];
const CLASSES = ['Class I', 'Class II', 'Class III'];

const FILTERS = [
  { id: 'all', label: 'All 12' },
  { id: 'Class I', label: 'Class I (centuries away)' },
  { id: 'Class II', label: 'Class II (millennia away)' },
  { id: 'Class III', label: 'Class III (breaks physics)' }
];

export default function ImpossibleAtlas({ k = 0.73 }) {
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(IMPOSSIBLE_IDEAS[0].id);

  const visibleIdeas = useMemo(() => {
    if (filter === 'all') return IMPOSSIBLE_IDEAS;
    return IMPOSSIBLE_IDEAS.filter((item) => item.cls === filter);
  }, [filter]);

  const selected =
    visibleIdeas.find((i) => i.id === selectedId) || visibleIdeas[0] || IMPOSSIBLE_IDEAS[0];

  // Visual semicircular gauge math
  const radius = 58;
  const circumference = Math.PI * radius;
  const dashOffset = circumference * (1 - selected.barrier / 100);
  const selTier = TIERS.find((t) => t.id === selected.minK) || TIERS[0];
  const reachable = IMPOSSIBLE_IDEAS.filter((i) => (TIERS.find((t) => t.id === i.minK) || TIERS[0]).k <= k + 1e-9).length;
  const visibleIds = new Set(visibleIdeas.map((i) => i.id));

  return (
    <section aria-label="Twelve future technologies explorer">
      <div className="section-head">
        <div>
          <h2 className="section-title">what could we build? (feasibility matrix)</h2>
          <p className="section-lead">
            Michio Kaku sorts science-fiction ideas into three classes of impossibility. Here are twelve: rows are the class (I, II, III), columns are the energy each one needs. Shaded cells are within reach of your Type {k.toFixed(2)} budget above. Click any idea to see the physics behind it.
          </p>
        </div>
      </div>

      <div className="preset-row" role="group" aria-label="Filter by impossibility class">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`pill-btn ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Class x energy-tier matrix */}
      <div className="fm-meta">
        <span><strong className="fm-num">{reachable}</strong> of 12 energy-feasible at Type {k.toFixed(2)}</span>
      </div>
      <div className="fm-scroll">
        <div className="fm-matrix" role="grid" aria-label="Impossibility class by required energy tier">
          <div className="fm-corner" />
          {TIERS.map((t) => (
            <div key={t.id} className={`fm-colhead ${t.k <= k ? 'reach' : ''}`}>
              {t.label}
              <span>{Number.isFinite(t.k) ? `K ≥ ${t.k.toFixed(2)}` : 'breaks physics'}</span>
            </div>
          ))}
          {CLASSES.map((cls) => (
            <React.Fragment key={cls}>
              <div className="fm-rowhead">{cls}</div>
              {TIERS.map((t) => {
                const items = IMPOSSIBLE_IDEAS.filter((i) => i.cls === cls && i.minK === t.id);
                return (
                  <div key={t.id} className={`fm-cell ${t.k <= k ? 'reach' : ''} ${items.length ? '' : 'empty'}`}>
                    {items.map((idea) => (
                      <button
                        key={idea.id}
                        type="button"
                        className={`fm-item ${idea.id === selected.id ? 'selected' : ''} ${visibleIds.has(idea.id) ? '' : 'dim'}`}
                        onClick={() => { setSelectedId(idea.id); if (!visibleIds.has(idea.id)) setFilter('all'); }}
                      >
                        {idea.title}
                      </button>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Interactive Physics Inspector */}
      <div className="inspector-box" aria-live="polite">
        <div style={{ textAlign: 'center' }}>
          <svg
            viewBox="0 0 150 95"
            width="150"
            height="95"
            role="img"
            aria-label={`Physics barrier score ${selected.barrier} out of 100`}
          >
            <path
              d="M 17 80 A 58 58 0 0 1 133 80"
              fill="none"
              stroke="#e5e5e3"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 17 80 A 58 58 0 0 1 133 80"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
            <text
              x="75"
              y="64"
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="18"
              fontWeight="500"
              fill="#111111"
            >
              {selected.barrier}/100
            </text>
            <text
              x="75"
              y="84"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontSize="11"
              fill="#555555"
            >
              Physics Barrier
            </text>
          </svg>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)', maxWidth: 170, margin: '0 auto' }}>How hard physics makes it: 0 easy, 100 impossible (our estimate)</div>
        </div>

        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: 0 }}>
              {selected.title}
            </h3>
            <span className={`class-badge ${selected.clsCode}`}>{selected.cls}</span>
            <span className="mono-tag">Needs: {selTier.label}{Number.isFinite(selTier.k) ? ` (K ≥ ${selTier.k.toFixed(2)})` : ''}</span>
            <span className={`reach-tag ${selTier.k <= k ? 'ok' : ''}`}>{selTier.k <= k ? 'enough energy now' : Number.isFinite(selTier.k) ? `needs +${(selTier.k - k).toFixed(2)} K` : 'breaks a known law of physics'}</span>
          </div>

          <p style={{ margin: '0 0 10px', color: 'var(--ink-secondary)', fontSize: '0.94rem' }}>
            {selected.shortLine}
          </p>

          <div className="law-callout">
            <span className="law-formula">{selected.lawFormula}</span>
            <span className="law-plain">{selected.lawPlain}</span>
          </div>

          <details className="methodology-drawer" style={{ marginTop: 10 }}>
            <summary>Physical mechanism &amp; caveats</summary>
            <div className="drawer-body">
              <p>{selected.mechanism}</p>
            </div>
          </details>
        </div>
      </div>

      <details className="methodology-drawer">
        <summary>Class I, II, III definitions</summary>
        <div className="drawer-body">
          <ul>
            <li><strong>Class I Impossibilities:</strong> impossible today, but they break no known law of physics. Could arrive within a century or two.</li>
            <li><strong>Class II Impossibilities:</strong> at the edge of what we understand about spacetime and quantum theory. Could take thousands to millions of years.</li>
            <li><strong>Class III Impossibilities:</strong> they break an established law of physics, such as conservation of energy or the rise of entropy.</li>
          </ul>
        </div>
      </details>
    </section>
  );
}
