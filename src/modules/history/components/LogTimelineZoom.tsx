import React, { useMemo, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Compass, FlaskConical } from 'lucide-react';
import {
  EPOCHS,
  TIMELINE_EVENTS,
  SCIENCE_MILESTONES,
  type EpochId,
  type ScienceTrackKind,
  type TimelineEvent,
  type ScienceMilestone,
} from '../data/timelineData';

const MAX_LOG = Math.log10(13_800_000_000); // ~10.1399
const MIN_LOG = 0; // 1 year ago (Present)

function formatYearsAgo(ya: number): string {
  if (ya >= 1_000_000_000) return `${(ya / 1_000_000_000).toFixed(2)} Gya`;
  if (ya >= 1_000_000) return `${(ya / 1_000_000).toFixed(1)} Mya`;
  if (ya >= 10_000) return `${Math.round(ya / 1_000)} kya`;
  if (ya >= 2_100) return `${Math.round(ya - 2026)} BCE`;
  const year = Math.round(2026 - ya);
  return year <= 0 ? `${Math.abs(year - 1)} BCE` : `${year} CE`;
}

export const LogTimelineZoom: React.FC = () => {
  // View window in log10(yearsAgo). Higher log = further back in time (left side of axis).
  const [logLeft, setLogLeft] = useState<number>(MAX_LOG);
  const [logRight, setLogRight] = useState<number>(MIN_LOG);
  const [activeEpoch, setActiveEpoch] = useState<EpochId | 'all'>('all');
  const [scienceFilter, setScienceFilter] = useState<ScienceTrackKind | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent>(TIMELINE_EVENTS[10]); // Homo erectus default
  const [selectedScience, setSelectedScience] = useState<ScienceMilestone | null>(SCIENCE_MILESTONES[7]); // Newton default

  const span = Math.max(0.6, logLeft - logRight);

  const zoomToEpoch = (epochId: EpochId | 'all') => {
    setActiveEpoch(epochId);
    if (epochId === 'all') {
      setLogLeft(MAX_LOG);
      setLogRight(MIN_LOG);
      return;
    }
    const ep = EPOCHS.find((e) => e.id === epochId);
    if (!ep) return;
    const pad = Math.max(0.18, (ep.logMax - ep.logMin) * 0.12);
    setLogLeft(Math.min(MAX_LOG, ep.logMax + pad));
    setLogRight(Math.max(MIN_LOG, ep.logMin - pad));
    const firstInEpoch = TIMELINE_EVENTS.find((ev) => ev.epoch === epochId);
    if (firstInEpoch) setSelectedEvent(firstInEpoch);
  };

  const handleZoom = (factor: number) => {
    const center = (logLeft + logRight) / 2;
    const nextHalf = Math.min((MAX_LOG - MIN_LOG) / 2, Math.max(0.35, (span / 2) * factor));
    let nextLeft = center + nextHalf;
    let nextRight = center - nextHalf;
    if (nextLeft > MAX_LOG) {
      nextRight = Math.max(MIN_LOG, nextRight - (nextLeft - MAX_LOG));
      nextLeft = MAX_LOG;
    }
    if (nextRight < MIN_LOG) {
      nextLeft = Math.min(MAX_LOG, nextLeft + (MIN_LOG - nextRight));
      nextRight = MIN_LOG;
    }
    setLogLeft(nextLeft);
    setLogRight(nextRight);
    setActiveEpoch('all');
  };

  const handlePanSlider = (centerVal: number) => {
    const half = span / 2;
    const clampedCenter = Math.min(MAX_LOG - half, Math.max(MIN_LOG + half, centerVal));
    setLogLeft(clampedCenter + half);
    setLogRight(clampedCenter - half);
    setActiveEpoch('all');
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (Math.abs(e.deltaY) < 4) return;
    e.preventDefault();
    handleZoom(e.deltaY > 0 ? 1.18 : 0.84);
  };

  const visibleEvents = useMemo(() => {
    return TIMELINE_EVENTS.filter((ev) => {
      const l = Math.log10(Math.max(1, ev.yearsAgo));
      return l <= logLeft + 0.05 && l >= logRight - 0.05;
    });
  }, [logLeft, logRight]);

  const visibleScience = useMemo(() => {
    return SCIENCE_MILESTONES.filter((sc) => {
      if (scienceFilter !== 'all' && sc.kind !== scienceFilter) return false;
      const l = Math.log10(Math.max(1, sc.yearsAgo));
      return l <= logLeft + 0.05 && l >= logRight - 0.05;
    });
  }, [logLeft, logRight, scienceFilter]);

  // SVG coordinate projection: left = older (logLeft), right = newer (logRight)
  const SVG_W = 1000;
  const SVG_H = 290;
  const PAD_X = 44;
  const PLOT_W = SVG_W - PAD_X * 2;

  const logToX = (logVal: number) => {
    const frac = (logLeft - logVal) / Math.max(0.0001, logLeft - logRight);
    return PAD_X + frac * PLOT_W;
  };

  // Decade ticks (10^10 down to 10^0)
  const decadeTicks = useMemo(() => {
    const ticks: { exp: number; label: string; x: number }[] = [];
    for (let exp = 10; exp >= 0; exp--) {
      if (exp <= logLeft + 0.05 && exp >= logRight - 0.05) {
        ticks.push({
          exp,
          label: exp >= 9 ? `10^${exp}y` : exp >= 6 ? `10^${exp}y` : exp === 0 ? 'Present' : `10^${exp}y`,
          x: logToX(exp),
        });
      }
    }
    return ticks;
  }, [logLeft, logRight]);

  const zoomRatio = ((MAX_LOG - MIN_LOG) / span).toFixed(1);

  return (
    <section className="section-stack" aria-label="13.8-Billion-Year Logarithmic Timeline Zoom">
      {/* Control Strip */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '14px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '21px' }}>13.8-Billion-Year Logarithmic Zoom</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--ink-secondary)', fontSize: '14px' }}>
              Jump across six deep-time eras or zoom into the parallel scientific-breakthrough track.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button type="button" className="btn" onClick={() => handleZoom(0.68)} aria-label="Zoom in">
              <ZoomIn size={16} /> Zoom In
            </button>
            <button type="button" className="btn" onClick={() => handleZoom(1.45)} aria-label="Zoom out">
              <ZoomOut size={16} /> Zoom Out
            </button>
            <button type="button" className="btn" onClick={() => zoomToEpoch('all')} aria-label="Reset zoom">
              <RotateCcw size={16} /> 13.8 Gya
            </button>
          </div>
        </div>

        {/* Epoch Jump Chips */}
        <div className="chip-row" style={{ marginBottom: '14px' }}>
          <button
            type="button"
            className={`chip ${activeEpoch === 'all' ? 'active' : ''}`}
            onClick={() => zoomToEpoch('all')}
          >
            All Eras (10^10 - 10^0 y)
          </button>
          {EPOCHS.map((ep) => (
            <button
              key={ep.id}
              type="button"
              className={`chip ${activeEpoch === ep.id ? 'active' : ''}`}
              onClick={() => zoomToEpoch(ep.id)}
            >
              {ep.shortLabel}
            </button>
          ))}
        </div>

        {/* Embedded Dark Figure Plate: Logarithmic Deep-Time & Scientific Track */}
        <div className="dark-figure-plate">
          <div className="figure-caption-bar">
            <span className="mono">
              WINDOW: {formatYearsAgo(Math.pow(10, logLeft))} &rarr; {formatYearsAgo(Math.pow(10, logRight))}
            </span>
            <span className="mono">
              LOG SPAN: {span.toFixed(2)} decades ({zoomRatio}x zoom)
            </span>
          </div>

          <div className="tl-scroll">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'pan-y' }}
            onWheel={handleWheel}
            role="img"
            aria-label="Logarithmic timeline from 13.8 billion years ago to present with scientific milestones"
          >
            {/* Epoch background strata */}
            {EPOCHS.map((ep, idx) => {
              const x1 = Math.max(PAD_X, Math.min(SVG_W - PAD_X, logToX(ep.logMax)));
              const x2 = Math.max(PAD_X, Math.min(SVG_W - PAD_X, logToX(ep.logMin)));
              const w = Math.max(0, x2 - x1);
              if (w <= 1) return null;
              const fill = idx % 2 === 0 ? 'rgba(148, 163, 184, 0.08)' : 'rgba(59, 130, 246, 0.07)';
              return (
                <g key={ep.id}>
                  <rect x={x1} y={24} width={w} height={224} fill={fill} />
                  {w > 54 && (
                    <text
                      x={x1 + w / 2}
                      y={42}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {ep.shortLabel.toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Decade grid lines */}
            {decadeTicks.map((t) => (
              <g key={t.exp}>
                <line
                  x1={t.x}
                  y1={24}
                  x2={t.x}
                  y2={252}
                  stroke="rgba(148, 163, 184, 0.22)"
                  strokeDasharray="3 4"
                />
                <text
                  x={t.x}
                  y={272}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {t.label}
                </text>
              </g>
            ))}

            {/* Track A: Big History Chronology */}
            <text x={PAD_X} y={76} fill="#e2e8f0" fontSize="11" fontFamily="JetBrains Mono, monospace">
              TRACK A: COSMIC TO DIGITAL CHRONOLOGY ({visibleEvents.length} visible)
            </text>
            <line x1={PAD_X} y1={112} x2={SVG_W - PAD_X} y2={112} stroke="#475569" strokeWidth="2" />

            {visibleEvents.map((ev, i) => {
              const cx = logToX(Math.log10(Math.max(1, ev.yearsAgo)));
              const isSelected = selectedEvent.id === ev.id;
              const staggerY = i % 2 === 0 ? 96 : 132;
              return (
                <g
                  key={ev.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedEvent(ev)}
                >
                  <line
                    x1={cx}
                    y1={112}
                    x2={cx}
                    y2={staggerY}
                    stroke={isSelected ? '#60a5fa' : '#64748b'}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <circle
                    cx={cx}
                    cy={112}
                    r={isSelected ? 8 : 5.5}
                    fill={isSelected ? '#2563eb' : '#f8fafc'}
                    stroke={isSelected ? '#bfdbfe' : '#0f172a'}
                    strokeWidth={2}
                  />
                  {(isSelected || visibleEvents.length <= 10) && (
                    <text
                      x={cx}
                      y={staggerY + (i % 2 === 0 ? -6 : 13)}
                      textAnchor="middle"
                      fill={isSelected ? '#93c5fd' : '#cbd5e1'}
                      fontSize="10.5"
                      fontFamily="Inter, sans-serif"
                      fontWeight={isSelected ? 600 : 400}
                    >
                      {ev.displayDate}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Track B: Scientific-Breakthrough Milestones */}
            <text x={PAD_X} y={176} fill="#93c5fd" fontSize="11" fontFamily="JetBrains Mono, monospace">
              TRACK B: SCIENTIFIC BREAKTHROUGHS — EPISTEME &amp; TECHNE ({visibleScience.length} visible)
            </text>
            <line x1={PAD_X} y1={208} x2={SVG_W - PAD_X} y2={208} stroke="#334155" strokeWidth="2" />

            {visibleScience.map((sc) => {
              const cx = logToX(Math.log10(Math.max(1, sc.yearsAgo)));
              const isSelected = selectedScience?.id === sc.id;
              const color =
                sc.kind === 'episteme' ? '#38bdf8' : sc.kind === 'techne' ? '#fbbf24' : '#a7f3d0';
              return (
                <g
                  key={sc.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedScience(sc)}
                >
                  <rect
                    x={cx - (isSelected ? 6 : 4)}
                    y={208 - (isSelected ? 6 : 4)}
                    width={isSelected ? 12 : 8}
                    height={isSelected ? 12 : 8}
                    transform={`rotate(45 ${cx} 208)`}
                    fill={color}
                    stroke={isSelected ? '#ffffff' : '#0f172a'}
                    strokeWidth={1.5}
                  />
                  {isSelected && (
                    <text
                      x={Math.min(SVG_W - 110, Math.max(110, cx))}
                      y={236}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontFamily="Inter, sans-serif"
                      fontWeight={600}
                    >
                      {sc.figure} ({sc.yearLabel})
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          </div>

          {/* Pan Scrubber */}
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="mono" style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
              Pan Horizon
            </span>
            <input
              type="range"
              min={MIN_LOG + span / 2}
              max={MAX_LOG - span / 2}
              step={0.02}
              value={Math.min(MAX_LOG - span / 2, Math.max(MIN_LOG + span / 2, (logLeft + logRight) / 2))}
              onChange={(e) => handlePanSlider(Number(e.target.value))}
              disabled={span >= MAX_LOG - MIN_LOG - 0.05}
              aria-label="Pan logarithmic timeline window"
              style={{ direction: 'rtl' }}
            />
          </div>
        </div>
      </div>

      {/* Dual Inspector Grid: Selected Big History Milestone + Scientific Breakthrough Track */}
      <div className="grid-2">
        {/* Track A Inspector */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-accent">
              <Compass size={13} style={{ marginRight: '5px' }} />
              {selectedEvent.displayDate} &middot; {selectedEvent.domain}
            </span>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
              log10(t) = {Math.log10(Math.max(1, selectedEvent.yearsAgo)).toFixed(2)}
            </span>
          </div>

          <h3 style={{ fontSize: '21px', marginTop: '10px' }}>{selectedEvent.title}</h3>
          <p style={{ margin: '8px 0 14px', color: 'var(--ink-secondary)' }}>{selectedEvent.oneLiner}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            {selectedEvent.metrics.map((m) => (
              <div key={m.label} className="metric-box">
                <span className="metric-label">{m.label}</span>
                <span className="metric-value" style={{ fontSize: '15px' }}>{m.value}</span>
              </div>
            ))}
          </div>

          <details className="editorial-drawer">
            <summary>Mechanism</summary>
            <div className="drawer-body">
              <p style={{ margin: 0 }}>{selectedEvent.deepNote}</p>
            </div>
          </details>

          <div style={{ marginTop: '16px' }}>
            <span className="metric-label" style={{ marginBottom: '8px', fontWeight: 600 }}>
              Milestones in Current Window ({visibleEvents.length})
            </span>
            <div className="event-strip">
              {visibleEvents.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  className={`event-row-btn ${selectedEvent.id === ev.id ? 'active' : ''}`}
                  onClick={() => setSelectedEvent(ev)}
                >
                  <span style={{ fontWeight: 500, fontSize: '13.5px' }}>{ev.title}</span>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                    {ev.displayDate}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Track B: Scientific Breakthroughs & Episteme vs Techne */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '19px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FlaskConical size={18} color="var(--accent)" /> Scientific-Breakthrough Track
            </h3>
            <button
              type="button"
              className="btn"
              style={{ minHeight: '36px', fontSize: '12px' }}
              onClick={() => {
                setLogLeft(3.6);
                setLogRight(0);
                setActiveEpoch('all');
              }}
            >
              Zoom to 585 BCE - Present
            </button>
          </div>
          <p style={{ margin: '6px 0 12px', color: 'var(--ink-secondary)', fontSize: '14px' }}>
            Filter by theory (episteme), instruments/practice (techne), or unifying synthesis.
          </p>

          <div className="chip-row" style={{ marginBottom: '12px' }}>
            {(['all', 'episteme', 'techne', 'synthesis'] as const).map((k) => (
              <button
                key={k}
                type="button"
                className={`chip ${scienceFilter === k ? 'active' : ''}`}
                onClick={() => setScienceFilter(k)}
              >
                {k === 'all' ? 'All' : k.charAt(0).toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>

          {selectedScience && (
            <div className="card-white" style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-accent">{selectedScience.yearLabel}</span>
                <span className="badge">{selectedScience.kind.toUpperCase()}</span>
              </div>
              <h4 style={{ fontSize: '17px', marginTop: '8px' }}>{selectedScience.figure}</h4>
              <p style={{ margin: '4px 0 6px', fontWeight: 500, fontSize: '14px' }}>
                {selectedScience.breakthrough}
              </p>
              <p style={{ margin: 0, color: 'var(--ink-secondary)', fontSize: '13.5px' }}>
                {selectedScience.paradigmNote}
              </p>
            </div>
          )}

          <div className="event-strip" style={{ maxHeight: '220px' }}>
            {SCIENCE_MILESTONES.filter((s) => scienceFilter === 'all' || s.kind === scienceFilter).map((sc) => (
              <button
                key={sc.id}
                type="button"
                className={`event-row-btn ${selectedScience?.id === sc.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedScience(sc);
                  const l = Math.log10(Math.max(1, sc.yearsAgo));
                  if (l > logLeft || l < logRight) {
                    setLogLeft(Math.min(MAX_LOG, l + 1.2));
                    setLogRight(Math.max(MIN_LOG, l - 1.2));
                  }
                }}
              >
                <span style={{ fontSize: '13px' }}>
                  <strong>{sc.figure}</strong> &mdash; {sc.breakthrough}
                </span>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--ink-secondary)', whiteSpace: 'nowrap' }}>
                  {sc.yearLabel}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};
