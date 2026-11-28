import { useEffect, useMemo, useRef, useState } from 'react';
import { FERMI_CARDS } from '../data/content';

const MILKY_WAY_DIAMETER_LY = 100_000;
const UNIVERSE_AGE_YEARS = 13_800_000_000;
const AVG_HOP_LY = 5;

interface Star {
  nx: number; // -1..1 normalized galaxy coordinates
  ny: number;
  size: number;
  brightness: number;
  distFromSol: number; // normalized 0..2
}

// Deterministic pseudo-random generator for stable Milky Way starfield
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SOL_NX = 0.42; // ~26,000 ly out along Orion spur
const SOL_NY = 0.14;

function generateMilkyWay(): Star[] {
  const rand = mulberry32(2005);
  const stars: Star[] = [];
  const arms = 4;

  for (let i = 0; i < 1100; i++) {
    const isCore = i < 200;
    let nx = 0;
    let ny = 0;

    if (isCore) {
      const r = Math.pow(rand(), 1.8) * 0.24;
      const angle = rand() * Math.PI * 2;
      nx = Math.cos(angle) * r;
      ny = Math.sin(angle) * r * 0.72;
    } else {
      const arm = i % arms;
      const r = 0.12 + Math.pow(rand(), 0.82) * 0.84;
      const spiralAngle = r * 4.4 + (arm * Math.PI * 2) / arms;
      const scatter = (rand() - 0.5) * (0.38 + r * 0.32);
      const angle = spiralAngle + scatter;
      nx = Math.cos(angle) * r;
      ny = Math.sin(angle) * r * 0.68;
    }

    const dx = nx - SOL_NX;
    const dy = (ny - SOL_NY) / 0.68;
    const distFromSol = Math.sqrt(dx * dx + dy * dy);

    stars.push({
      nx,
      ny,
      size: 0.7 + rand() * 1.4,
      brightness: 0.28 + rand() * 0.62,
      distFromSol,
    });
  }
  return stars;
}

function formatYears(years: number): string {
  if (years >= 1_000_000_000) {
    return `${(years / 1_000_000_000).toFixed(2)}B yrs`;
  }
  if (years >= 1_000_000) {
    return `${(years / 1_000_000).toFixed(2)}M yrs`;
  }
  return `${Math.round(years).toLocaleString()} yrs`;
}

export function CosmicSection() {
  const [speedC, setSpeedC] = useState<number>(0.1); // 0.01c to 0.50c
  const [replicationYears, setReplicationYears] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [fermiMode, setFermiMode] = useState<boolean>(false);
  const [activeFermiIdx, setActiveFermiIdx] = useState<number>(1);
  const [simProgress, setSimProgress] = useState<number>(0.35); // 0..1 of full crossing

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stars = useMemo(() => generateMilkyWay(), []);

  // Physics calculations
  const hopsAcross = MILKY_WAY_DIAMETER_LY / AVG_HOP_LY;
  const travelYears = MILKY_WAY_DIAMETER_LY / speedC;
  const replicationOverhead = hopsAcross * replicationYears;
  const totalSaturationYears = travelYears + replicationOverhead;
  const pctOfUniverseAge = (totalSaturationYears / UNIVERSE_AGE_YEARS) * 100;
  const elapsedYears = simProgress * totalSaturationYears;

  // Animation loop advancing simProgress smoothly
  useEffect(() => {
    if (!isPlaying) return;
    let rafId = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Faster probe speeds visibly sweep the galaxy faster
      const rate = 0.055 + (speedC / 0.5) * 0.14;
      setSimProgress((p) => {
        const next = p + dt * rate;
        return next > 1 ? 0 : next;
      });
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, speedC]);

  // Draw HTML5 Canvas Milky Way
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(300, Math.round(rect.width));
    const height = Math.max(200, Math.round(rect.height));

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Deep slate scientific figure background (#0f172a)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.52;
    const rx = width * 0.43;
    const ry = height * 0.43;

    // Subtle galactic core glow
    const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rx * 0.45);
    coreGrad.addColorStop(0, 'rgba(226, 232, 240, 0.22)');
    coreGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.07)');
    coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.9, ry * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Scale grid rings
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.96, ry * 0.68, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    const solX = cx + SOL_NX * rx;
    const solY = cy + SOL_NY * ry;
    // Max distance from Sol to far rim in normalized units is ~1.48
    const waveNorm = simProgress * 1.48;

    // Draw stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const sx = cx + s.nx * rx;
      const sy = cy + s.ny * ry;
      const colonized = s.distFromSol <= waveNorm;

      if (colonized) {
        if (fermiMode) {
          // Fermi silence lens: optimal computation minimizes waste heat -> dark/quiet
          ctx.fillStyle = `rgba(100, 116, 139, ${0.22 + s.brightness * 0.2})`;
        } else {
          ctx.fillStyle = `rgba(96, 165, 250, ${0.55 + s.brightness * 0.45})`;
        }
      } else {
        ctx.fillStyle = `rgba(226, 232, 240, ${s.brightness * 0.55})`;
      }

      ctx.beginPath();
      ctx.arc(sx, sy, colonized && !fermiMode ? s.size * 1.2 : s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Expanding von Neumann wavefront ellipse from Sol
    if (waveNorm > 0.01) {
      const waveRx = waveNorm * rx;
      const waveRy = waveNorm * ry * 0.68;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(solX, solY, waveRx, waveRy, 0, 0, Math.PI * 2);
      ctx.fillStyle = fermiMode
        ? 'rgba(15, 23, 42, 0.25)'
        : 'rgba(59, 130, 246, 0.10)';
      ctx.fill();
      ctx.strokeStyle = fermiMode
        ? 'rgba(148, 163, 184, 0.5)'
        : 'rgba(96, 165, 250, 0.85)';
      ctx.lineWidth = fermiMode ? 1.2 : 2;
      if (fermiMode) ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();

      // Active probe vectors along the frontier (in Expansion mode)
      if (!fermiMode) {
        const probeCount = 12;
        for (let p = 0; p < probeCount; p++) {
          const theta = (p / probeCount) * Math.PI * 2 + simProgress * 0.7;
          const px = solX + Math.cos(theta) * waveRx;
          const py = solY + Math.sin(theta) * waveRy;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Origin marker (Sol)
    ctx.fillStyle = fermiMode ? '#cbd5e1' : '#ffffff';
    ctx.beginPath();
    ctx.arc(solX, solY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Minimal crisp HUD inside canvas
    ctx.font = '500 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(
      fermiMode
        ? 'FERMI LENS: QUIET / LOW-EMISSION COMPUTE'
        : `EXPANSION: ${(speedC * 100).toFixed(0)}% c · ${Math.round(simProgress * 100)}% DISK`,
      14,
      22
    );

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('SOL', solX + 8, solY + 4);
    ctx.fillText('100,000 LY DIAMETER', 14, height - 14);

    ctx.restore();
  }, [stars, simProgress, speedC, fermiMode]);

  const activeFermi = FERMI_CARDS[activeFermiIdx] ?? FERMI_CARDS[0];

  return (
    <div className="section-stack">
      <section className="panel" aria-label="Interactive Milky Way von Neumann probe simulator">
        <div className="panel-header">
          <div className="panel-header-text">
            <h2>Self-copying probes crossing the Milky Way (von Neumann probes)</h2>
            <p className="panel-lead">
              A von Neumann probe flies to a star, builds copies of itself from local material and
              sends them onward. Set its speed (1% to 50% of light speed, c) and how long each copy
              takes, and watch the wave cross a galaxy 100,000 light-years wide.
            </p>
          </div>
          <div className="panel-actions">
            <button
              type="button"
              className="btn"
              onClick={() => setIsPlaying((p) => !p)}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setSimProgress(0);
                setIsPlaying(true);
              }}
            >
              Reset
            </button>
            <button
              type="button"
              className={`btn ${fermiMode ? 'btn-active' : ''}`}
              aria-pressed={fermiMode}
              onClick={() => setFermiMode((f) => !f)}
            >
              {fermiMode ? 'Fermi paradox view: on' : 'So where is everyone? (Fermi paradox)'}
            </button>
          </div>
        </div>

        <div className="metric-strip cols-4" style={{ marginBottom: 16 }}>
          <div className="metric-box highlight">
            <span className="detail-item-label">Time to cross the galaxy</span>
            <span className="metric-big">{formatYears(totalSaturationYears)}</span>
          </div>
          <div className="metric-box">
            <span className="detail-item-label">Time elapsed so far</span>
            <span className="metric-big">{formatYears(elapsedYears)}</span>
          </div>
          <div className="metric-box">
            <span className="detail-item-label">Galaxy covered</span>
            <span className="metric-big">{Math.round(simProgress * 100)}%</span>
          </div>
          <div className="metric-box">
            <span className="detail-item-label">Share of the universe’s age</span>
            <span className="metric-big">
              {pctOfUniverseAge < 0.01
                ? `${pctOfUniverseAge.toFixed(4)}%`
                : `${pctOfUniverseAge.toFixed(2)}%`}
            </span>
          </div>
        </div>

        {/* Framed dark scientific figure canvas */}
        <div className="figure-box-dark">
          <canvas
            ref={canvasRef}
            className="canvas-frame"
            aria-label="Interactive Milky Way galaxy canvas showing light-speed bounded von Neumann probe expansion from Sol"
          />
        </div>
        <div className="figure-caption">
          <span>FIG. 3 · MILKY WAY DISK (~100,000 LY · 20,000 HOPS AT 5 LY/HOP)</span>
          <span>HARD LIMIT: LIGHT SPEED, SO 100,000 YRS AT LEAST</span>
        </div>

        <div className="grid-2" style={{ marginTop: 18 }}>
          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="speed-slider" className="slider-label">
                Probe cruise speed (share of light speed, c)
              </label>
              <span className="slider-value">{speedC.toFixed(2)}c</span>
            </div>
            <input
              id="speed-slider"
              type="range"
              min={0.01}
              max={0.5}
              step={0.01}
              value={speedC}
              onChange={(e) => setSpeedC(Number(e.target.value))}
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="rep-slider" className="slider-label">
                Years to build copies at each star (replication time)
              </label>
              <span className="slider-value">{replicationYears} years</span>
            </div>
            <input
              id="rep-slider"
              type="range"
              min={10}
              max={1000}
              step={10}
              value={replicationYears}
              onChange={(e) => setReplicationYears(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Compact Fermi Paradox switcher + drawer */}
        <div style={{ marginTop: 18 }}>
          <div className="segmented" role="tablist" aria-label="Fermi paradox explanations">
            {FERMI_CARDS.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                role="tab"
                aria-selected={idx === activeFermiIdx}
                className={`seg-btn ${idx === activeFermiIdx ? 'active' : ''}`}
                onClick={() => {
                  setActiveFermiIdx(idx);
                  setFermiMode(true);
                }}
              >
                {card.title}
              </button>
            ))}
          </div>

          <div className="panel-subtle" style={{ marginTop: 10 }}>
            <strong style={{ fontSize: '0.94rem' }}>{activeFermi.headline}</strong>
          </div>

          <details className="drawer">
            <summary>Read more: why a busy galaxy could still look empty</summary>
            <div className="drawer-body">
              <div className="grid-3">
                {FERMI_CARDS.map((card) => (
                  <div key={card.id} className="detail-item">
                    <span className="detail-item-label">{card.title}</span>
                    <span>{card.body}</span>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
