import { useEffect, useState } from 'react';
import { EMULATION_LEVELS } from '../data/content';

type WorkloadMode = 'pattern' | 'math' | 'transfer';

interface BioNode {
  x: number;
  y: number;
  phase: number;
}

const BIO_NODES: BioNode[] = [
  { x: 42, y: 34, phase: 0.0 },
  { x: 96, y: 26, phase: 0.5 },
  { x: 152, y: 34, phase: 1.1 },
  { x: 208, y: 28, phase: 1.7 },
  { x: 264, y: 36, phase: 2.2 },
  { x: 64, y: 74, phase: 0.8 },
  { x: 122, y: 70, phase: 1.4 },
  { x: 180, y: 74, phase: 2.0 },
  { x: 238, y: 70, phase: 2.6 },
  { x: 44, y: 112, phase: 1.3 },
  { x: 102, y: 114, phase: 1.9 },
  { x: 160, y: 110, phase: 2.5 },
  { x: 218, y: 114, phase: 3.1 },
  { x: 268, y: 110, phase: 3.7 },
];

const BIO_EDGES: Array<[number, number]> = [
  [0, 5], [1, 5], [1, 6], [2, 6], [2, 7], [3, 7], [3, 8], [4, 8],
  [5, 9], [5, 10], [6, 10], [6, 11], [7, 11], [7, 12], [8, 12], [8, 13],
  [0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8],
];

export function BrainSection() {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [workload, setWorkload] = useState<WorkloadMode>('pattern');
  const [tick, setTick] = useState<number>(0);
  const [copyFlash, setCopyFlash] = useState<number>(0);
  const [levelIdx, setLevelIdx] = useState<number>(1);

  const currentLevel = EMULATION_LEVELS[levelIdx] ?? EMULATION_LEVELS[1];

  useEffect(() => {
    if (!isRunning) return;
    let rafId = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setTick((t) => t + dt);
      setCopyFlash((f) => (f > 0 ? Math.max(0, f - dt * 1.4) : 0));
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isRunning]);

  const triggerSkillCopy = () => {
    setWorkload('transfer');
    setCopyFlash(1);
    if (!isRunning) setIsRunning(true);
  };

  // Build live high-frequency clock waveform for electronic panel
  const elecWavePoints = Array.from({ length: 48 }, (_, i) => {
    const x = 16 + i * 5.8;
    const speedMult = workload === 'math' ? 28 : 18;
    const square = Math.sin(tick * speedMult + i * 0.85) >= 0 ? -16 : 16;
    const y = 34 + square * (copyFlash > 0 ? 1.15 : 1);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="section-stack">
      <section className="panel" aria-label="Live biological versus electronic pulse comparator">
        <div className="panel-header">
          <div className="panel-header-text">
            <h2>Brain vs chip: about 200 pulses a second vs about a billion (200 Hz vs 1 GHz)</h2>
            <p className="panel-lead">
              Brain cells fire slowly but all at once, on about 20 W (a dim light bulb). Chips switch
              millions of times faster and can copy a learned skill to another chip instantly. Hz means
              times per second.
            </p>
          </div>
          <div className="panel-actions">
            <button type="button" className="btn" onClick={() => setIsRunning((r) => !r)}>
              {isRunning ? 'Pause Pulses' : 'Resume Pulses'}
            </button>
            <button type="button" className="btn btn-primary" onClick={triggerSkillCopy}>
              Simulate Skill Copy
            </button>
          </div>
        </div>

        <div className="segmented" style={{ marginBottom: 16 }} role="tablist" aria-label="Workload mode">
          <button
            type="button"
            role="tab"
            aria-selected={workload === 'pattern'}
            className={`seg-btn ${workload === 'pattern' ? 'active' : ''}`}
            onClick={() => setWorkload('pattern')}
          >
            Pattern Recognition
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={workload === 'math'}
            className={`seg-btn ${workload === 'math' ? 'active' : ''}`}
            onClick={() => setWorkload('math')}
          >
            Exact Arithmetic
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={workload === 'transfer'}
            className={`seg-btn ${workload === 'transfer' ? 'active' : ''}`}
            onClick={() => setWorkload('transfer')}
          >
            Skill Transfer
          </button>
        </div>

        <div className="grid-2">
          {/* Biological Brain Live Panel */}
          <div className="comparator-card ink-top">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <h3 style={{ fontSize: '1.18rem' }}>Biological Neocortex</h3>
              <span className="mono-label">~200 Hz · 20 W</span>
            </div>

            <div className="figure-box" style={{ background: '#ffffff' }}>
              <svg
                viewBox="0 0 310 144"
                role="img"
                aria-label="Animated parallel firing of biological neural mesh at slow 200 Hz cadence"
              >
                {BIO_EDGES.map(([a, b], idx) => {
                  const na = BIO_NODES[a];
                  const nb = BIO_NODES[b];
                  const pulse =
                    0.5 + 0.5 * Math.sin(tick * (workload === 'pattern' ? 2.8 : 1.6) - na.phase);
                  return (
                    <line
                      key={idx}
                      x1={na.x}
                      y1={na.y}
                      x2={nb.x}
                      y2={nb.y}
                      stroke="#111111"
                      strokeOpacity={0.14 + pulse * 0.45}
                      strokeWidth={1 + pulse * 1.4}
                    />
                  );
                })}
                {BIO_NODES.map((node, idx) => {
                  const wave =
                    0.5 + 0.5 * Math.sin(tick * (workload === 'pattern' ? 2.8 : 1.6) - node.phase);
                  return (
                    <g key={idx}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={5 + wave * 4}
                        fill="#111111"
                        fillOpacity={0.12 + wave * 0.2}
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={4.2}
                        fill={wave > 0.72 ? '#111111' : '#ffffff'}
                        stroke="#111111"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
                <text
                  x="12"
                  y="136"
                  fontSize="12"
                  fontFamily="JetBrains Mono, monospace"
                  fill="#555555"
                >
                  {workload === 'transfer'
                    ? 'Transfer: years of language & practice'
                    : workload === 'math'
                      ? 'Serial arithmetic: slow, error-prone'
                      : 'Massive 3D parallel wave (~10^14 synapses)'}
                </text>
              </svg>
            </div>

            <div className="kv-list">
              <div className="kv-row">
                <span className="kv-key">Scale</span>
                <span className="kv-val">86B neurons · 100T synapses</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Reset speed</span>
                <span className="kv-val">~200 Hz (chemical)</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Power budget</span>
                <span className="kv-val">~20 W total</span>
              </div>
            </div>
          </div>

          {/* Electronic Silicon Live Panel */}
          <div className="comparator-card accent-top">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <h3 style={{ fontSize: '1.18rem' }}>Electronic Compute</h3>
              <span className="mono-label" style={{ color: 'var(--accent)' }}>
                ~10^9 Hz · 5,000,000× clock
              </span>
            </div>

            <div className="figure-box" style={{ background: '#ffffff' }}>
              <svg
                viewBox="0 0 310 144"
                role="img"
                aria-label="Animated gigahertz electronic clock pulse and synchronous core cluster"
              >
                {/* High-speed clock rail */}
                <polyline
                  points={elecWavePoints}
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* 16 synchronous cores */}
                {Array.from({ length: 16 }, (_, idx) => {
                  const col = idx % 8;
                  const row = Math.floor(idx / 8);
                  const x = 22 + col * 34;
                  const y = 68 + row * 28;
                  const active =
                    copyFlash > 0.1 || Math.sin(tick * 22 + idx * 1.3) > 0.15;
                  return (
                    <rect
                      key={idx}
                      x={x}
                      y={y}
                      width="24"
                      height="18"
                      rx="3"
                      fill={copyFlash > 0.1 ? '#1e40af' : active ? '#dbeafe' : '#fafaf9'}
                      stroke={active ? '#1e40af' : '#cfcfc9'}
                      strokeWidth="1.4"
                    />
                  );
                })}

                <text
                  x="12"
                  y="136"
                  fontSize="12"
                  fontFamily="JetBrains Mono, monospace"
                  fill="#1e40af"
                >
                  {copyFlash > 0.05
                    ? 'Weights cloned to all cores in < 1 ms'
                    : workload === 'transfer'
                      ? 'Transfer: instant lossless weight copy'
                      : workload === 'math'
                        ? 'Exact floating-point at GHz speed'
                        : 'Gigahertz switching · lossless memory'}
                </text>
              </svg>
            </div>

            <div className="kv-list">
              <div className="kv-row">
                <span className="kv-key">Scale</span>
                <span className="kv-val">Billions of transistors / 3D clusters</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Clock speed</span>
                <span className="kv-val">10^9+ Hz (electronic)</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Skill sharing</span>
                <span className="kv-val">Instant lossless copy</span>
              </div>
            </div>
          </div>
        </div>

        <details className="drawer">
          <summary>Read more: brain vs chip, strengths and limits</summary>
          <div className="drawer-body">
            <div className="grid-2">
              <div>
                <strong>Biological Brain strengths &amp; limits:</strong> Hierarchical pattern
                recognition across the neocortex learns from sparse data on ~20 W, but is bounded by
                fixed skull size, noisy recall, and years of slow language-based skill transfer.
              </div>
              <div>
                <strong>Electronic Compute strengths &amp; limits:</strong> Exact lossless memory,
                precise maths and continuous operation without fatigue. Currently draws much more
                power per task, though specialised chips are closing that gap quickly.
              </div>
            </div>
          </div>
        </details>
      </section>

      {/* Brain Emulation Fidelity Explorer */}
      <section className="panel" aria-label="Brain emulation fidelity explorer">
        <div className="panel-header">
          <div className="panel-header-text">
            <h3>How detailed must a brain copy be? (emulation fidelity)</h3>
            <p className="panel-lead">
              Copying what the brain does needs far less computing than copying every molecule: the
              gap is over a million times (6+ powers of ten).
            </p>
          </div>
        </div>

        <div className="segmented" role="tablist" aria-label="Emulation depth">
          {EMULATION_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              role="tab"
              aria-selected={idx === levelIdx}
              className={`seg-btn ${idx === levelIdx ? 'active' : ''}`}
              onClick={() => setLevelIdx(idx)}
            >
              {lvl.name}
            </button>
          ))}
        </div>

        <div className="slider-group" style={{ marginTop: 14 }}>
          <div className="slider-header">
            <label htmlFor="emulation-slider" className="slider-label">
              Simulation detail depth
            </label>
            <span className="slider-value">{currentLevel.cps}</span>
          </div>
          <input
            id="emulation-slider"
            type="range"
            min={0}
            max={EMULATION_LEVELS.length - 1}
            step={1}
            value={levelIdx}
            onChange={(e) => setLevelIdx(Number(e.target.value))}
          />
        </div>

        <div className="metric-strip" style={{ marginTop: 14 }}>
          <div className="metric-box highlight">
            <span className="detail-item-label">Estimated Compute</span>
            <span className="metric-big">{currentLevel.cps}</span>
          </div>
          <div className="metric-box">
            <span className="detail-item-label">Working Memory</span>
            <span className="metric-big">{currentLevel.memory}</span>
          </div>
        </div>

        <details className="drawer">
          <summary>Read more: {currentLevel.name}: scope &amp; bottleneck</summary>
          <div className="drawer-body">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-item-label">What is modelled</span>
                <span>{currentLevel.focus}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item-label">Primary bottleneck</span>
                <span>{currentLevel.bottleneck}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item-label">Takeaway</span>
                <span>{currentLevel.summary}</span>
              </div>
            </div>
          </div>
        </details>
      </section>
    </div>
  );
}
