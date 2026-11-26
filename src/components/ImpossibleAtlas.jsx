import React, { useMemo, useState } from 'react';
import { IMPOSSIBLE_IDEAS } from '../data/kakuData.js';

const FILTERS = [
  { id: 'all', label: 'All (12)' },
  { id: 'Class I', label: 'Class I (Centuries)' },
  { id: 'Class II', label: 'Class II (Millennia)' },
  { id: 'Class III', label: 'Class III (Breaks Law)' }
];

export default function ImpossibleAtlas() {
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

  return (
    <section aria-label="Physics of the Impossible 12 Ideas Explorer">
      <div className="section-head">
        <div>
          <h2 className="section-title">Physics of the Impossible</h2>
          <p className="section-lead">
            Tap any of Michio Kaku&apos;s 12 iconic sci-fi technologies to inspect its impossibility class and the exact physical law governing it.
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
        </div>

        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: 0 }}>
              {selected.title}
            </h3>
            <span className={`class-badge ${selected.clsCode}`}>{selected.cls}</span>
            <span className="mono-tag">Scale: {selected.minK}</span>
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

      {/* 12-Idea Visual Grid */}
      <div className="impossible-grid">
        {visibleIdeas.map((idea) => {
          const isSelected = idea.id === selected.id;
          return (
            <button
              key={idea.id}
              type="button"
              className={`impossible-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedId(idea.id)}
            >
              <div className="impossible-card-top">
                <span className="impossible-card-title">{idea.title}</span>
                <span className={`class-badge ${idea.clsCode}`}>{idea.cls}</span>
              </div>
              <p className="impossible-card-line">{idea.shortLine}</p>
            </button>
          );
        })}
      </div>

      <details className="methodology-drawer">
        <summary>How Kaku classifies Class I, II, and III impossibilities</summary>
        <div className="drawer-body">
          <ul>
            <li><strong>Class I Impossibilities:</strong> Technologies impossible today that violate no known laws of physics; plausible within one or two centuries.</li>
            <li><strong>Class II Impossibilities:</strong> Technologies sitting at the edge of our understanding of spacetime and quantum theory; may take millennia to millions of years.</li>
            <li><strong>Class III Impossibilities:</strong> Technologies that violate established laws of physics (such as conservation of energy and entropy).</li>
          </ul>
        </div>
      </details>
    </section>
  );
}
