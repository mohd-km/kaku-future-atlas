import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FUTURE_DOMAINS } from '../data/kakuData.js';

function interpolateDomain(domain, year) {
  const pts = domain.milestones;
  if (year <= pts[0].year) return { val: pts[0].val, note: pts[0].note };
  if (year >= pts[pts.length - 1].year) {
    const last = pts[pts.length - 1];
    return { val: last.val, note: last.note };
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (year >= a.year && year <= b.year) {
      const f = (year - a.year) / (b.year - a.year);
      const val = a.val + (b.val - a.val) * f;
      return { val, note: f < 0.5 ? a.note : b.note };
    }
  }
  return { val: pts[0].val, note: pts[0].note };
}

export default function FutureHorizon() {
  const [domainId, setDomainId] = useState('fusion');
  const [year, setYear] = useState(2050);
  const canvasRef = useRef(null);

  const domain = FUTURE_DOMAINS.find((d) => d.id === domainId) || FUTURE_DOMAINS[0];
  const current = useMemo(() => interpolateDomain(domain, year), [domain, year]);

  const eraLabel = year < 2040 ? 'Near-Term' : year < 2075 ? 'Mid-Century' : 'Far-Century';

  const formattedVal =
    domain.id === 'fusion'
      ? `Q = ${current.val.toFixed(1)}`
      : domain.id === 'space'
      ? `$${Math.round(current.val)}/kg`
      : domain.id === 'longevity'
      ? `${Math.round(current.val)} yrs`
      : `${Math.round(current.val)} /cm`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let tick = 0;

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(300, Math.floor(rect.width));
      const h = Math.max(220, Math.floor(rect.height));
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const progress = (year - 2026) / (2100 - 2026);
      const padL = 44;
      const padR = 24;
      const padT = 38;
      const padB = 34;
      const plotW = w - padL - padR;
      const plotH = h - padT - padB;

      // Axes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, h - padB);
      ctx.lineTo(w - padR, h - padB);
      ctx.stroke();

      // Plot curve from domain milestones
      const pts = domain.milestones;
      const maxVal = Math.max(...pts.map((p) => p.val));
      const minVal = Math.min(...pts.map((p) => p.val));
      const span = Math.max(1, maxVal - minVal);

      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let y = 2026; y <= 2100; y += 2) {
        const interp = interpolateDomain(domain, y);
        const x = padL + ((y - 2026) / 74) * plotW;
        const norm = (interp.val - minVal) / span;
        const py = h - padB - norm * plotH;
        if (y === 2026) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();

      // Active year vertical guide & animated pulse dot
      const activeX = padL + progress * plotW;
      const activeNorm = (current.val - minVal) / span;
      const activeY = h - padB - activeNorm * plotH;

      ctx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(activeX, padT);
      ctx.lineTo(activeX, h - padB);
      ctx.stroke();
      ctx.setLineDash([]);

      const pulseR = 6 + Math.sin(tick * 0.08) * 2.5;
      ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
      ctx.beginPath();
      ctx.arc(activeX, activeY, pulseR * 1.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(activeX, activeY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Year labels on x-axis
      ctx.fillStyle = 'rgba(203, 213, 225, 0.78)';
      ctx.font = '500 11px "JetBrains Mono", monospace';
      [2026, 2050, 2075, 2100].forEach((yr) => {
        const lx = padL + ((yr - 2026) / 74) * plotW;
        ctx.fillText(String(yr), lx - 14, h - 12);
      });

      // Top HUD label
      ctx.fillStyle = 'rgba(241, 245, 249, 0.94)';
      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.fillText(`${domain.name.toUpperCase()}  |  ${year}  |  ${formattedVal}`, 14, 22);

      tick += 1;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [domain, year, current, formattedVal]);

  return (
    <section aria-label="Physics of the Future 2026 to 2100 Explorer">
      <div className="section-head">
        <div>
          <h2 className="section-title">Physics of the Future (2026–2100)</h2>
          <p className="section-lead">
            Drag the century timeline to see how fusion, programmable matter, longevity, and low-cost spaceflight reshape daily life.
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Selected Year</span>
            <span className="metric-plain">{eraLabel} projection</span>
          </div>
          <div className="metric-value">{year}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">{domain.metricLabel}</span>
            <span className="metric-plain">{domain.metricPlain}</span>
          </div>
          <div className="metric-value">{formattedVal}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Key Concept</span>
            <span className="metric-plain">{domain.plain}</span>
          </div>
          <div className="metric-value">{domain.term}</div>
        </div>
      </div>

      <div className="stage-grid">
        <div className="figure-frame">
          <div className="figure-canvas-wrap">
            <canvas
              ref={canvasRef}
              className="figure-canvas"
              aria-label="2026 to 2100 technology trajectory chart"
            />
          </div>
          <div className="figure-caption">
            <span>
              <strong>Figure 3.</strong> Projected trajectory for {domain.name.toLowerCase()} across the 21st century.
            </span>
            <span>{eraLabel}</span>
          </div>
        </div>

        <div className="control-card">
          <h3>Domain &amp; Century Scrubber</h3>
          <div className="preset-row" role="group" aria-label="Future technology domains">
            {FUTURE_DOMAINS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`pill-btn ${domainId === d.id ? 'active' : ''}`}
                onClick={() => setDomainId(d.id)}
              >
                {d.name}
              </button>
            ))}
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="year-slider" className="slider-label">
                Timeline Year
                <span className="slider-sub">2026 to 2100</span>
              </label>
              <span className="slider-readout">{year}</span>
            </div>
            <input
              id="year-slider"
              type="range"
              min="2026"
              max="2100"
              step="1"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
            />
          </div>

          <p style={{ margin: '14px 0 10px', color: 'var(--ink)', fontSize: '0.94rem', fontWeight: 500 }}>
            Around {year}: {current.note}
          </p>
          <p style={{ margin: 0, color: 'var(--ink-secondary)', fontSize: '0.9rem' }}>
            {domain.summary}
          </p>
        </div>
      </div>

      <details className="methodology-drawer">
        <summary>Full 2030 / 2050 / 2100 milestone breakdown (Physics of the Future)</summary>
        <div className="drawer-body">
          <p>
            Kaku interviewed over 300 leading physicists and engineers to map technologies already working in prototype labs onto near-term, mid-century, and far-century horizons:
          </p>
          <ul>
            <li><strong>Fusion:</strong> Magnetic confinement (ITER and compact high-temperature superconductor tokamaks) aims for sustained <code>Q &gt; 10</code> commercial plants by mid-century.</li>
            <li><strong>Smart Matter (Claytronics):</strong> Electrostatic micro-robots (&quot;catoms&quot;) could rearrange dynamically like 3D pixels to build adaptive tools.</li>
            <li><strong>Longevity:</strong> Targeting cellular aging pathways—telomere maintenance, senescent cell clearance, and bioprinted organs—extends healthy years rather than fragile years.</li>
            <li><strong>Space Access:</strong> Reusable rockets slash launch costs today, paving the way for lunar bases, Mars settlements, and laser-pushed starships by 2100.</li>
          </ul>
        </div>
      </details>
    </section>
  );
}
