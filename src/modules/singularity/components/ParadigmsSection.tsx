import { useEffect, useState } from 'react';
import { COMPUTE_SCALES, PARADIGMS } from '../data/content';

const CHART_W = 760;
const CHART_H = 300;
const PAD_L = 62;
const PAD_R = 26;
const PAD_T = 26;
const PAD_B = 44;

const MIN_YEAR = 1900;
const MAX_YEAR = 2050;
const MIN_LOG = -6;
const MAX_LOG = 21;
const ANCHOR_YEAR_2025 = 2025;
const ANCHOR_LOG_2025 = 14.0; // ~$1,000 consumer GPU baseline (~10^14 cps)

function yearToX(year: number): number {
  const clamped = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
  return PAD_L + ((clamped - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * (CHART_W - PAD_L - PAD_R);
}

function logToY(logVal: number): number {
  const clamped = Math.max(MIN_LOG, Math.min(MAX_LOG, logVal));
  return CHART_H - PAD_B - ((clamped - MIN_LOG) / (MAX_LOG - MIN_LOG)) * (CHART_H - PAD_T - PAD_B);
}

function buildSCurvePath(
  startYear: number,
  endYear: number,
  yStartLog: number,
  yEndLog: number
): string {
  const x0 = yearToX(startYear);
  const x1 = yearToX(endYear);
  const y0 = logToY(yStartLog);
  const y1 = logToY(yEndLog);
  const dx = x1 - x0;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} C ${(x0 + dx * 0.45).toFixed(1)} ${y0.toFixed(1)}, ${(x0 + dx * 0.55).toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

const PARADIGM_STARTS = [-5.5, -4, -2, 1, 3, 13.5];

export function ParadigmsSection() {
  const [selectedParadigmId, setSelectedParadigmId] = useState<number>(5);
  const [selectedScaleId, setSelectedScaleId] = useState<string>('ultimate-laptop');
  const [brainLog, setBrainLog] = useState<number>(16.0); // 10^14 to 10^20 cps
  const [doublingYears, setDoublingYears] = useState<number>(1.5); // 1.0 to 4.0 years
  const [playheadYear, setPlayheadYear] = useState<number>(2050);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [animRunId, setAnimRunId] = useState<number>(1);

  useEffect(() => {
    if (!isAnimating) return;
    let rafId = 0;
    const durationMs = 2400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setPlayheadYear(MIN_YEAR + eased * (MAX_YEAR - MIN_YEAR));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setIsAnimating(false);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [animRunId, isAnimating]);

  const replayAnimation = () => {
    setPlayheadYear(MIN_YEAR);
    setIsAnimating(true);
    setAnimRunId((n) => n + 1);
  };

  const paradigm = PARADIGMS.find((p) => p.id === selectedParadigmId) ?? PARADIGMS[4];
  const scale = COMPUTE_SCALES.find((s) => s.id === selectedScaleId) ?? COMPUTE_SCALES[2];

  // Dynamic post-2025 projection based on hardware doubling time
  const log2 = Math.log10(2);
  const projected2050Log = Math.min(
    MAX_LOG,
    ANCHOR_LOG_2025 + ((MAX_YEAR - ANCHOR_YEAR_2025) / doublingYears) * log2
  );
  const yearsFrom2025 = ((brainLog - ANCHOR_LOG_2025) / log2) * doublingYears;
  const rawCrossoverYear = ANCHOR_YEAR_2025 + yearsFrom2025;
  const crossoverYearRounded = Math.round(rawCrossoverYear);
  const crossoverInChart = rawCrossoverYear >= ANCHOR_YEAR_2025 && rawCrossoverYear <= MAX_YEAR;

  const presentMidLog = 24;
  const selectedMidLog = (scale.logMin + scale.logMax) / 2;
  const diffLog = selectedMidLog - presentMidLog;

  const yTicks = [-5, 0, 5, 10, 15, 20];
  const xTicks = [1900, 1930, 1960, 1990, 2020, 2050];

  const clipWidth = Math.max(0, yearToX(playheadYear) - PAD_L + 4);

  return (
    <div className="section-stack">
      <section className="panel" aria-label="Animated six-paradigm compute curve">
        <div className="panel-header">
          <div className="panel-header-text">
            <h2>Six generations of computers, and when $1,000 matches a brain (1900 to 2050)</h2>
            <p className="panel-lead">
              Each hardware generation (paradigm) improves along an S-shaped curve, hits a physical
              wall, then hands over to the next. Set how much computing a brain needs and how fast
              hardware improves to see when $1,000 of hardware catches up with a brain.
            </p>
          </div>
          <div className="panel-actions">
            <button type="button" className="btn" onClick={replayAnimation}>
              {isAnimating ? 'Animating…' : 'Replay 1900–2050'}
            </button>
          </div>
        </div>

        <div className="metric-strip cols-4" style={{ marginBottom: 16 }}>
          <div className="metric-box highlight">
            <span className="detail-item-label">Year $1,000 matches a brain</span>
            <span className="metric-big">
              {crossoverYearRounded <= 2025
                ? '~2025 (Now)'
                : crossoverYearRounded > 2099
                  ? '2100+'
                  : `~${crossoverYearRounded}`}
            </span>
          </div>
          <div className="metric-box">
            <span className="detail-item-label">Computing a brain needs</span>
            <span className="metric-big">10^{brainLog.toFixed(1)} cps</span>
          </div>
          <div className="metric-box">
            <span className="detail-item-label">Doubling time</span>
            <span className="metric-big">{doublingYears.toFixed(1)} yrs</span>
          </div>
          <div className="metric-box">
            <span className="detail-item-label">Selected generation</span>
            <span className="metric-big">P{paradigm.id} · {paradigm.shortName}</span>
          </div>
        </div>

        <div className="figure-box">
          <div className="chart-wrap">
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              role="img"
              aria-label="Animated logarithmic chart of six computing paradigms from 1900 to 2050 with live brain parity threshold"
            >
              <defs>
                <clipPath id="curve-reveal-clip">
                  <rect x={PAD_L - 4} y={0} width={clipWidth + 12} height={CHART_H} />
                </clipPath>
              </defs>

              {/* Horizontal grid lines */}
              {yTicks.map((tick) => {
                const y = logToY(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={PAD_L}
                      y1={y}
                      x2={CHART_W - PAD_R}
                      y2={y}
                      stroke="#e5e5e3"
                      strokeWidth="1"
                    />
                    <text
                      x={PAD_L - 10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="12"
                      fontFamily="JetBrains Mono, monospace"
                      fill="#666666"
                    >
                      10^{tick}
                    </text>
                  </g>
                );
              })}

              {/* X axis ticks */}
              {xTicks.map((yr) => {
                const x = yearToX(yr);
                return (
                  <g key={yr}>
                    <line
                      x1={x}
                      y1={CHART_H - PAD_B}
                      x2={x}
                      y2={CHART_H - PAD_B + 5}
                      stroke="#cfcfc9"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={CHART_H - PAD_B + 21}
                      textAnchor="middle"
                      fontSize="12"
                      fontFamily="JetBrains Mono, monospace"
                      fill="#666666"
                    >
                      {yr}
                    </text>
                  </g>
                );
              })}

              {/* Brain fidelity horizontal threshold */}
              <line
                x1={PAD_L}
                y1={logToY(brainLog)}
                x2={CHART_W - PAD_R}
                y2={logToY(brainLog)}
                stroke="#111111"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x={PAD_L + 8}
                y={logToY(brainLog) - 6}
                fontSize="12"
                fontFamily="JetBrains Mono, monospace"
                fill="#111111"
              >
                Brain target: 10^{brainLog.toFixed(1)} cps
              </text>

              {/* Animated curve reveal group */}
              <g clipPath="url(#curve-reveal-clip)">
                {/* 6 clickable S-curves (P6 responds to doubling slider) */}
                {PARADIGMS.map((p, idx) => {
                  const isSelected = p.id === paradigm.id;
                  const startLog = PARADIGM_STARTS[idx];
                  const endLog = p.id === 6 ? projected2050Log : p.peakLogCpsPer1000;
                  const pathD = buildSCurvePath(p.startYear, p.endYear, startLog, endLog);
                  const midX = yearToX((p.startYear + p.endYear) / 2);
                  const midY = logToY((startLog + endLog) / 2);
                  return (
                    <g
                      key={p.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedParadigmId(p.id)}
                    >
                      <path d={pathD} fill="none" stroke="transparent" strokeWidth="18" />
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isSelected ? '#1e40af' : '#64748b'}
                        strokeOpacity={isSelected ? 1 : 0.65}
                        strokeWidth={isSelected ? 3.8 : 2.2}
                        strokeLinecap="round"
                      />
                      <circle
                        cx={midX}
                        cy={midY}
                        r={isSelected ? 6.5 : 4.5}
                        fill={isSelected ? '#1e40af' : '#ffffff'}
                        stroke={isSelected ? '#1e40af' : '#64748b'}
                        strokeWidth="2"
                      />
                      <text
                        x={midX}
                        y={midY - 11}
                        textAnchor="middle"
                        fontSize="12"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight={isSelected ? '600' : '400'}
                        fill={isSelected ? '#1e40af' : '#555555'}
                      >
                        P{p.id}
                      </text>
                    </g>
                  );
                })}

                {/* Dynamic crossover intersection marker */}
                {crossoverInChart && (
                  <g>
                    <line
                      x1={yearToX(rawCrossoverYear)}
                      y1={logToY(brainLog)}
                      x2={yearToX(rawCrossoverYear)}
                      y2={CHART_H - PAD_B}
                      stroke="#1e40af"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={yearToX(rawCrossoverYear)}
                      cy={logToY(brainLog)}
                      r="7"
                      fill="#1e40af"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                    <text
                      x={Math.min(CHART_W - PAD_R - 44, yearToX(rawCrossoverYear) + 10)}
                      y={Math.max(PAD_T + 14, logToY(brainLog) + 18)}
                      fontSize="12"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="600"
                      fill="#1e40af"
                    >
                      ~{crossoverYearRounded}
                    </text>
                  </g>
                )}
              </g>

              {/* Playhead sweep line while animating */}
              {isAnimating && (
                <line
                  x1={yearToX(playheadYear)}
                  y1={PAD_T}
                  x2={yearToX(playheadYear)}
                  y2={CHART_H - PAD_B}
                  stroke="#1e40af"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                />
              )}

              <text
                x={PAD_L}
                y={15}
                fontSize="12"
                fontFamily="Inter, sans-serif"
                fill="#555555"
              >
                Calculations per second per $1,000 (each grid line is 10x the one below)
              </text>
            </svg>
          </div>
          <div className="figure-caption">
            <span>FIG. 1: SIX COMPUTING GENERATIONS (KURZWEIL CURVE)</span>
            <span>
              {crossoverInChart
                ? `CROSSOVER: ~${crossoverYearRounded}`
                : `CROSSOVER: ~${crossoverYearRounded} (BEYOND 2050 AXIS)`}
            </span>
          </div>
        </div>

        {/* Live sliders */}
        <div className="grid-2" style={{ marginTop: 18 }}>
          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="brain-fidelity-slider" className="slider-label">
                Computing a brain needs (cps: calculations per second)
              </label>
              <span className="slider-value">10^{brainLog.toFixed(1)} cps</span>
            </div>
            <input
              id="brain-fidelity-slider"
              type="range"
              min={14}
              max={20}
              step={0.25}
              value={brainLog}
              onChange={(e) => setBrainLog(Number(e.target.value))}
            />
            <div className="segmented">
              <button
                type="button"
                className={`seg-btn ${brainLog === 15 ? 'active' : ''}`}
                onClick={() => setBrainLog(15)}
              >
                Functional (10^15)
              </button>
              <button
                type="button"
                className={`seg-btn ${brainLog === 16 ? 'active' : ''}`}
                onClick={() => setBrainLog(16)}
              >
                Kurzweil (10^16)
              </button>
              <button
                type="button"
                className={`seg-btn ${brainLog === 19 ? 'active' : ''}`}
                onClick={() => setBrainLog(19)}
              >
                Molecular (10^19)
              </button>
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="doubling-slider" className="slider-label">
                Hardware price-performance doubling time (years for $1 to buy twice the computing)
              </label>
              <span className="slider-value">{doublingYears.toFixed(1)} years</span>
            </div>
            <input
              id="doubling-slider"
              type="range"
              min={1.0}
              max={4.0}
              step={0.1}
              value={doublingYears}
              onChange={(e) => setDoublingYears(Number(e.target.value))}
            />
            <span className="footnote">
              Anchored at 2025 consumer hardware (~10^14 cps per $1,000). Faster doubling bends the
              newest curve (P6) sharply upward.
            </span>
          </div>
        </div>

        {/* Paradigm selector strip */}
        <div className="grid-6" style={{ marginTop: 16 }}>
          {PARADIGMS.map((p) => {
            const isActive = p.id === paradigm.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`choice-card ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedParadigmId(p.id)}
              >
                <span className="mono-label">
                  P{p.id} · {p.years}
                </span>
                <strong style={{ fontSize: '0.86rem', lineHeight: 1.2 }}>{p.shortName}</strong>
              </button>
            );
          })}
        </div>

        <details className="drawer">
          <summary>
            Read more: P{paradigm.id} {paradigm.name}: how it worked, its wall, what came next
          </summary>
          <div className="drawer-body">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-item-label">Hardware ({paradigm.example})</span>
                <span>{paradigm.mechanism}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item-label">Physical ceiling</span>
                <span>{paradigm.wall}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item-label">Next paradigm</span>
                <span>{paradigm.successor}</span>
              </div>
            </div>
          </div>
        </details>
      </section>

      {/* World Compute vs Seth Lloyd Ultimate Limit */}
      <section className="panel" aria-label="World compute versus Seth Lloyd ultimate limit">
        <div className="panel-header">
          <div className="panel-header-text">
            <h3>All of today’s computing vs the physical ceiling (Seth Lloyd limit)</h3>
            <p className="panel-lead">
              The Seth Lloyd limit is the most computing any lump of matter could ever do, set by
              quantum physics and E = mc². On this log scale one brain does about 10^14 calculations a
              second, the whole planet today about 10^24, and Earth turned into a perfect computer
              about 10^75: that is 51 more powers of ten of headroom.
            </p>
          </div>
          <span className="mono-label">
            {diffLog === 0
              ? 'Reference: Present Earth (~10^24 cps)'
              : diffLog > 0
                ? `~10^${Math.round(diffLog)}x above present Earth`
                : `~10^${Math.round(Math.abs(diffLog))}x below present Earth`}
          </span>
        </div>

        <div className="scale-list">
          {COMPUTE_SCALES.map((item) => {
            const isSelected = item.id === scale.id;
            const widthPct = Math.max(8, Math.min(100, (item.logMax / 75) * 100));
            return (
              <button
                key={item.id}
                type="button"
                className={`scale-row ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedScaleId(item.id)}
              >
                <div className="scale-row-top">
                  <span className="scale-row-title">{item.label}</span>
                  <span className="scale-row-val">{item.displayRange}</span>
                </div>
                <div className="scale-track" aria-hidden="true">
                  <div
                    className={`scale-fill ${item.category === 'theoretical' ? 'dark' : item.category === 'bio' ? 'muted' : ''}`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <details className="drawer">
          <summary>Read more: {scale.label} ({scale.categoryLabel})</summary>
          <div className="drawer-body">
            <p>{scale.explanation}</p>
            <p className="footnote">
              Formula note: Seth Lloyd (Nature, 2000) applies the Margolus–Levitin theorem (ops/sec
              ≤ 2E / πℏ) with E = mc² for 1 kg of matter in 1 liter, yielding ~5.4 × 10^50 ops/sec.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
