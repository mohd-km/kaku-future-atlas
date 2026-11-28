import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  KARDASHEV_PRESETS,
  KARDASHEV_UNLOCKS,
  computeKardashev,
  describeCivilizationTier,
  formatWatts
} from './kakuData.js';

function expToWatts(expVal) {
  if (expVal <= 0) return 0;
  return Math.pow(10, expVal);
}

// World primary energy 2023 (Energy Institute Statistical Review 2024, substitution method):
// total ~620 EJ/yr = 19.6 TW. Fossil ~504 EJ (16.0 TW), hydro ~40 EJ (1.28 TW),
// wind + solar + other renewables ~51 EJ (1.6 TW), nuclear ~25 EJ (0.79 TW).
const SEC_PER_YEAR = 365.25 * 86400;
const ejToWatts = (ej) => (ej * 1e18) / SEC_PER_YEAR;
const FOSSIL_2023_W = ejToWatts(504);
const HYDRO_2023_W = ejToWatts(40.4);
const RENEW_2023_EXP = Math.log10(ejToWatts(50.6));
const NUCLEAR_2023_EXP = Math.log10(ejToWatts(24.8));
const roundExp = (x) => Math.round(x * 100) / 100;

export default function KardashevLab({ onKChange }) {
  // Logarithmic exponents (0 means off/negligible)
  const [fossilPct, setFossilPct] = useState(100); // % of 2023 fossil use
  const [solarExp, setSolarExp] = useState(roundExp(RENEW_2023_EXP)); // ~1.6 TW
  const [fissionExp, setFissionExp] = useState(roundExp(NUCLEAR_2023_EXP)); // ~0.79 TW
  const [fusionExp, setFusionExp] = useState(0); // off initially
  const [orbitalExp, setOrbitalExp] = useState(0); // off initially
  const [selectedTechId, setSelectedTechId] = useState('fusion-grid');
  const canvasRef = useRef(null);

  const baselineWatts = HYDRO_2023_W + (FOSSIL_2023_W * fossilPct) / 100;

  const powerBreakdown = useMemo(() => {
    const pSolar = expToWatts(solarExp);
    const pFission = expToWatts(fissionExp);
    const pFusion = expToWatts(fusionExp);
    const pOrbital = expToWatts(orbitalExp);
    const total = baselineWatts + pSolar + pFission + pFusion + pOrbital;
    const k = computeKardashev(total);
    const pFossil = (FOSSIL_2023_W * fossilPct) / 100;
    const cleanShare = (total - pFossil) / total;
    return { pSolar, pFission, pFusion, pOrbital, pFossil, total, k, cleanShare };
  }, [solarExp, fissionExp, fusionExp, orbitalExp, fossilPct, baselineWatts]);

  useEffect(() => {
    if (onKChange) onKChange(powerBreakdown.k);
  }, [powerBreakdown.k, onKChange]);

  const tierInfo = useMemo(
    () => describeCivilizationTier(powerBreakdown.k),
    [powerBreakdown.k]
  );

  const unlockedTechs = useMemo(
    () => KARDASHEV_UNLOCKS.filter((t) => powerBreakdown.k >= t.minK),
    [powerBreakdown.k]
  );

  const selectedTech =
    KARDASHEV_UNLOCKS.find((t) => t.id === selectedTechId) || KARDASHEV_UNLOCKS[0];

  // Sync master K slider to realistic 4-source allocation
  function handleMasterKChange(targetK) {
    const kVal = parseFloat(targetK);
    if (kVal <= 0.735) {
      const target = Math.pow(10, 10 * kVal + 6);
      const rest = target - HYDRO_2023_W - Math.pow(10, roundExp(RENEW_2023_EXP)) - Math.pow(10, roundExp(NUCLEAR_2023_EXP));
      setFossilPct(Math.max(0, Math.min(100, Math.round((rest / FOSSIL_2023_W) * 100))));
      setSolarExp(roundExp(RENEW_2023_EXP));
      setFissionExp(roundExp(NUCLEAR_2023_EXP));
      setFusionExp(0);
      setOrbitalExp(0);
      return;
    }
    // Allocate the target power exactly: fossil kept at 2023 level, clean sources fill the rest
    const target = Math.pow(10, 10 * kVal + 6);
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const solar = clamp(target * 0.3, Math.pow(10, RENEW_2023_EXP), 1e16);
    const fission = clamp(target * 0.05, Math.pow(10, NUCLEAR_2023_EXP), Math.pow(10, 14.5));
    const rem = target - HYDRO_2023_W - FOSSIL_2023_W - solar - fission;
    let fusion = 0;
    let orbital = 0;
    if (rem > 0) {
      if (kVal <= 1.05) {
        orbital = kVal > 0.9 ? rem * 0.3 : 0;
        fusion = rem - orbital;
      } else {
        fusion = Math.min(1e17, rem * 0.5);
        orbital = rem - fusion;
      }
    }
    setFossilPct(100);
    setSolarExp(Math.log10(solar));
    setFissionExp(Math.log10(fission));
    setFusionExp(fusion > 1 ? Math.log10(fusion) : 0);
    setOrbitalExp(orbital > 1 ? Math.log10(orbital) : 0);
  }

  function applyPreset(preset) {
    if (preset.id === 'today') {
      setFossilPct(100);
      setSolarExp(roundExp(RENEW_2023_EXP));
      setFissionExp(roundExp(NUCLEAR_2023_EXP));
      setFusionExp(0);
      setOrbitalExp(0);
      return;
    }
    setSolarExp(preset.solar);
    setFissionExp(preset.fission);
    setFusionExp(preset.fusion);
    setOrbitalExp(preset.orbital);
  }

  function downloadSummary() {
    const unlockedList = unlockedTechs
      .map(
        (t) =>
          `<li><strong>${t.name}</strong> (${t.classTag}, K >= ${t.minK.toFixed(
            2
          )}): ${t.summary} [${t.law}]</li>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Exponential Futures Atlas: Energy Summary</title>
<style>
  body { font-family: Georgia, serif; color: #111; background: #fff; max-width: 760px; margin: 36px auto; padding: 0 20px; line-height: 1.5; }
  h1 { font-size: 28px; margin: 0 0 6px; }
  .meta { font-family: system-ui, sans-serif; font-size: 13px; color: #555; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 12px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 18px 0; font-family: system-ui, sans-serif; }
  .box { border: 1px solid #ddd; background: #fafaf9; padding: 12px; border-radius: 6px; }
  .val { font-family: monospace; font-size: 20px; color: #1d4ed8; font-weight: 600; }
  .lbl { font-size: 12px; color: #555; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-family: system-ui, sans-serif; font-size: 14px; }
  th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e5e3; }
  ul { font-family: system-ui, sans-serif; font-size: 14px; padding-left: 20px; }
  li { margin-bottom: 6px; }
  .foot { margin-top: 24px; font-family: system-ui, sans-serif; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
</style>
</head>
<body>
  <h1>Exponential Futures Atlas: Energy Summary</h1>
  <div class="meta">Generated at future.mohammed-km.in by Mohammed KM | Sagan-Kardashev formula: K = (log10(P) - 6) / 10</div>
  <div class="grid">
    <div class="box"><div class="lbl">Kardashev Index</div><div class="val">Type ${powerBreakdown.k.toFixed(2)}</div></div>
    <div class="box"><div class="lbl">Total Power Output</div><div class="val">${formatWatts(powerBreakdown.total)}</div></div>
    <div class="box"><div class="lbl">Civilisation Type</div><div class="val">${tierInfo.tier}</div></div>
  </div>
  <h2>Allocated Power Sources</h2>
  <table>
    <tr><th>Source</th><th>Allocated Power</th></tr>
    <tr><td>Fossil fuels (${fossilPct}% of 2023)</td><td>${formatWatts(powerBreakdown.pFossil)}</td></tr>
    <tr><td>Hydropower (2023)</td><td>${formatWatts(HYDRO_2023_W)}</td></tr>
    <tr><td>Wind, solar &amp; other renewables</td><td>${formatWatts(powerBreakdown.pSolar)}</td></tr>
    <tr><td>Nuclear Fission Reactors</td><td>${formatWatts(powerBreakdown.pFission)}</td></tr>
    <tr><td>Nuclear Fusion Plants</td><td>${formatWatts(powerBreakdown.pFusion)}</td></tr>
    <tr><td>Orbital &amp; Stellar Arrays</td><td>${formatWatts(powerBreakdown.pOrbital)}</td></tr>
  </table>
  <h2>Technologies Within Reach (${unlockedTechs.length} of ${KARDASHEV_UNLOCKS.length})</h2>
  <ul>${unlockedList || '<li>Raise your energy budget above Type 0.78 to bring the first post-fossil technologies within reach.</li>'}</ul>
  <div class="foot">Baseline: world primary energy 2023 (~620 EJ/yr, Energy Institute Statistical Review 2024). Technology thresholds are illustrative, framed after Kardashev (1964) and Sagan (1973).</div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kardashev-type-${powerBreakdown.k.toFixed(2)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Live animated cosmic scale Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

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

      // Deep slate figure background (#0f172a)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const k = powerBreakdown.k;

      // Subtle background stars
      for (let i = 0; i < 42; i++) {
        const sx = ((i * 97.3) % w);
        const sy = ((i * 53.7) % h);
        const alpha = 0.2 + 0.25 * Math.sin(t * 0.02 + i);
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha.toFixed(2)})`;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      if (k < 1.35) {
        // Planetary Type 0 -> Type I view
        const progress = Math.max(0, Math.min(1, (k - 0.73) / 0.27));
        const r = Math.min(w, h) * 0.23;

        // Atmospheric glow
        const grad = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 1.65);
        grad.addColorStop(0, `rgba(59, 130, 246, ${0.15 + progress * 0.35})`);
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.65, 0, Math.PI * 2);
        ctx.fill();

        // Planet core
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Latitude grid lines
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
        ctx.lineWidth = 1;
        for (let a = -0.6; a <= 0.6; a += 0.3) {
          ctx.beginPath();
          ctx.ellipse(cx, cy + a * r, r * Math.cos(a * 1.2), r * 0.18, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Orbital solar/fusion collector rings activating as K -> 1.0
        const ringCount = 2 + Math.floor(progress * 4);
        for (let i = 0; i < ringCount; i++) {
          const rx = r * (1.3 + i * 0.22);
          const ry = rx * 0.36;
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.22 + progress * 0.45})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, (i * 0.35) - 0.3, 0, Math.PI * 2);
          ctx.stroke();

          // Orbiting collector node
          const angle = t * (0.014 + i * 0.004) + i * 2.1;
          const rot = (i * 0.35) - 0.3;
          const ox = Math.cos(angle) * rx;
          const oy = Math.sin(angle) * ry;
          const px = cx + ox * Math.cos(rot) - oy * Math.sin(rot);
          const py = cy + ox * Math.sin(rot) + oy * Math.cos(rot);
          ctx.fillStyle = '#e0f2fe';
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (k < 2.45) {
        // Stellar Type II Dyson Swarm view
        const progress = Math.max(0, Math.min(1, (k - 1.35) / 0.85));
        const r = Math.min(w, h) * 0.16;

        // Star corona
        const starGrad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 2.2);
        starGrad.addColorStop(0, '#fef3c7');
        starGrad.addColorStop(0.35, '#f59e0b');
        starGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = starGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Dyson Swarm collector arcs
        const shells = 4 + Math.floor(progress * 8);
        for (let i = 0; i < shells; i++) {
          const rx = r * (1.55 + (i % 4) * 0.32);
          const ry = rx * 0.44;
          const tilt = (i * Math.PI) / shells;
          ctx.strokeStyle = `rgba(147, 197, 253, ${0.25 + progress * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, tilt, 0, Math.PI * 2);
          ctx.stroke();

          for (let n = 0; n < 3; n++) {
            const ang = t * (0.012 + (i % 3) * 0.004) + n * 2.09 + i;
            const ox = Math.cos(ang) * rx;
            const oy = Math.sin(ang) * ry;
            const px = cx + ox * Math.cos(tilt) - oy * Math.sin(tilt);
            const py = cy + ox * Math.sin(tilt) + oy * Math.cos(tilt);
            ctx.fillStyle = '#93c5fd';
            ctx.fillRect(px - 2.5, py - 2.5, 5, 5);
          }
        }
      } else {
        // Galactic Type III Spiral Network view
        const progress = Math.max(0, Math.min(1, (k - 2.45) / 0.55));
        const maxR = Math.min(w, h) * 0.42;

        // Galactic core glow
        const coreGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, maxR * 0.6);
        coreGrad.addColorStop(0, 'rgba(224, 242, 254, 0.95)');
        coreGrad.addColorStop(0.35, 'rgba(96, 165, 250, 0.35)');
        coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 4 spiral arms with linked star nodes
        const arms = 4;
        const ptsPerArm = 18;
        for (let a = 0; a < arms; a++) {
          let prevX = cx;
          let prevY = cy;
          for (let p = 1; p <= ptsPerArm; p++) {
            const frac = p / ptsPerArm;
            const rad = frac * maxR;
            const theta = (a * Math.PI * 2) / arms + frac * 3.1 + t * 0.006;
            const px = cx + Math.cos(theta) * rad;
            const py = cy + Math.sin(theta) * rad * 0.68;

            if (p > 1 && frac <= 0.35 + progress * 0.65) {
              ctx.strokeStyle = `rgba(96, 165, 250, ${0.28 + progress * 0.32})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(prevX, prevY);
              ctx.lineTo(px, py);
              ctx.stroke();
            }

            ctx.fillStyle = frac <= 0.35 + progress * 0.65 ? '#e0f2fe' : 'rgba(148, 163, 184, 0.45)';
            ctx.beginPath();
            ctx.arc(px, py, frac <= 0.35 + progress * 0.65 ? 2.5 : 1.5, 0, Math.PI * 2);
            ctx.fill();

            prevX = px;
            prevY = py;
          }
        }
      }

      // Clean HUD scale label inside canvas
      ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.fillText(`TYPE ${k.toFixed(2)}  |  ${formatWatts(powerBreakdown.total)}`, 14, 24);

      t += 1;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [powerBreakdown]);

  return (
    <section aria-label="Kardashev Scale and Planetary Energy-Budget Builder">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Kardashev rating (K)</span>
            <span className="metric-plain">Power on a 0 to 3 scale: K = (log10 P − 6) / 10</span>
          </div>
          <div className="metric-value">Type {powerBreakdown.k.toFixed(2)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Total power used</span>
            <span className="metric-plain">Clean share {(powerBreakdown.cleanShare * 100).toFixed(0)}%</span>
          </div>
          <div className="metric-value">{formatWatts(powerBreakdown.total)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Civilisation type</span>
            <span className="metric-plain">{tierInfo.plain}</span>
          </div>
          <div className="metric-value">{tierInfo.tier}</div>
        </div>
      </div>

      <div className="stage-grid">
        <div className="figure-frame">
          <div className="figure-canvas-wrap">
            <canvas
              ref={canvasRef}
              className="figure-canvas"
              aria-label="Animated civilisation energy scale visualisation"
            />
          </div>
          <div className="figure-caption">
            <span>Planetary rings → Dyson swarm → galactic web</span>
            <span>{tierInfo.frontier}</span>
          </div>
        </div>

        <div className="control-card">
          <h3>Energy-budget builder</h3>
          <div className="preset-row" role="group" aria-label="Kardashev presets">
            {KARDASHEV_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pill-btn ${Math.abs(powerBreakdown.k - p.k) < 0.04 ? 'active' : ''}`}
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="master-k-slider" className="slider-label">
                Kardashev rating
                <span className="slider-sub">Quick sweep: sets every source for you</span>
              </label>
              <span className="slider-readout">Type {powerBreakdown.k.toFixed(2)}</span>
            </div>
            <input
              id="master-k-slider"
              type="range"
              min="0.6"
              max="3.0"
              step="0.01"
              value={powerBreakdown.k.toFixed(2)}
              onChange={(e) => handleMasterKChange(e.target.value)}
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="fossil-slider" className="slider-label">
                Fossil fuels
                <span className="slider-sub">% of 2023 use (hydro power stays at 1.3 TW)</span>
              </label>
              <span className="slider-readout">{formatWatts(powerBreakdown.pFossil)}</span>
            </div>
            <input
              id="fossil-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value={fossilPct}
              onChange={(e) => setFossilPct(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="solar-slider" className="slider-label">
                Wind &amp; solar
                <span className="slider-sub">Each notch multiplies the power · 1.6 TW in 2023</span>
              </label>
              <span className="slider-readout">{formatWatts(powerBreakdown.pSolar)}</span>
            </div>
            <input
              id="solar-slider"
              type="range"
              min="0"
              max="16"
              step="0.1"
              value={solarExp}
              onChange={(e) => setSolarExp(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="fission-slider" className="slider-label">
                Nuclear fission (splitting atoms)
                <span className="slider-sub">Each notch multiplies the power · 0.79 TW in 2023</span>
              </label>
              <span className="slider-readout">{formatWatts(powerBreakdown.pFission)}</span>
            </div>
            <input
              id="fission-slider"
              type="range"
              min="0"
              max="15"
              step="0.1"
              value={fissionExp}
              onChange={(e) => setFissionExp(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="fusion-slider" className="slider-label">
                Nuclear fusion (joining atoms, like the Sun)
                <span className="slider-sub">Reactors fuelled by hydrogen from seawater</span>
              </label>
              <span className="slider-readout">{formatWatts(powerBreakdown.pFusion)}</span>
            </div>
            <input
              id="fusion-slider"
              type="range"
              min="0"
              max="17"
              step="0.1"
              value={fusionExp}
              onChange={(e) => setFusionExp(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="orbital-slider" className="slider-label">
                Solar collectors in space
                <span className="slider-sub">From orbiting panels up to a Dyson swarm around a star</span>
              </label>
              <span className="slider-readout">{formatWatts(powerBreakdown.pOrbital)}</span>
            </div>
            <input
              id="orbital-slider"
              type="range"
              min="0"
              max="36"
              step="0.2"
              value={orbitalExp}
              onChange={(e) => setOrbitalExp(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="unlock-section">
        <div className="unlock-header">
          <h3>
            Technologies within reach ({unlockedTechs.length} of {KARDASHEV_UNLOCKS.length})
          </h3>
          <button type="button" className="action-btn" onClick={downloadSummary}>
            Download summary
          </button>
        </div>

        <div className="chip-grid" role="list">
          {KARDASHEV_UNLOCKS.map((tech) => {
            const isUnlocked = powerBreakdown.k >= tech.minK;
            const isSelected = selectedTech.id === tech.id;
            return (
              <button
                key={tech.id}
                type="button"
                className={`tech-chip ${isUnlocked ? 'unlocked' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedTechId(tech.id)}
              >
                <span className="tech-chip-dot" aria-hidden="true" />
                <span>{tech.name}</span>
              </button>
            );
          })}
        </div>

        <div className="tech-detail-bar">
          <div>
            <strong>{selectedTech.name}</strong>: {selectedTech.summary}
          </div>
          <span className="mono-tag">
            {selectedTech.classTag} | Requires Type {selectedTech.minK.toFixed(2)} | {selectedTech.law}
          </span>
        </div>
      </div>

      <details className="methodology-drawer">
        <summary>Formula &amp; data</summary>
        <div className="drawer-body">
          <p>
            Sagan's version of the Kardashev rating, which allows decimals: <code>K = (log10(P) - 6) / 10</code>, P in watts. Type I = 10^16 W (a planet), Type II = 10^26 W (a star), Type III = 10^36 W (a galaxy). Each whole step is 10 billion times more power.
          </p>
          <p>
            Today's baseline: world primary energy 2023 ≈ 620 EJ/yr ≈ 19.6 TW (Energy Institute Statistical Review 2024), giving K ≈ 0.73. The energy level at which each technology appears is illustrative.
          </p>
        </div>
      </details>
    </section>
  );
}
