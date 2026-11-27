import React, { useEffect, useRef } from 'react';
import { computeRelativity, formatSci } from '../data/physics';

interface Props {
  beta: number;
  onBetaChange: (val: number) => void;
  logMassSolar: number;
  onLogMassSolarChange: (val: number) => void;
  radiusRatioRs: number;
  onRadiusRatioRsChange: (val: number) => void;
}

const VELOCITY_PRESETS = [
  { label: '0c (Rest)', beta: 0 },
  { label: 'GPS Sat', beta: 0.0000129 },
  { label: '0.50c', beta: 0.5 },
  { label: '0.866c (2x)', beta: 0.866025 },
  { label: '0.995c (Muon)', beta: 0.995 },
];

const MASS_PRESETS = [
  { label: '10 M_sun', logM: 1 },
  { label: 'Cygnus X-1 (21.2)', logM: Math.log10(21.2) },
  { label: 'Sgr A* (4.3M)', logM: Math.log10(4.3e6) },
  { label: 'M87* (6.5B)', logM: Math.log10(6.5e9) },
];

export const RelativityLab: React.FC<Props> = ({
  beta,
  onBetaChange,
  logMassSolar,
  onLogMassSolarChange,
  radiusRatioRs,
  onRadiusRatioRsChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const massSolar = Math.pow(10, logMassSolar);
  const res = computeRelativity(beta, massSolar, radiusRatioRs);
  // Kinetic energy of a 1,000 kg craft vs 2023 world primary energy (~620 EJ, Energy Institute 2024)
  const keJ = res.kineticEnergyPerMc2 * 1000 * 299792458 * 299792458;
  const keWorldYears = keJ / 6.2e20;

  // Live Schwarzschild geometry + dual relativistic clocks canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const startTs = performance.now();

    const drawClock = (
      cx: number,
      cy: number,
      r: number,
      angleRad: number,
      title: string,
      rateLabel: string,
      accentStroke: string
    ) => {
      ctx.fillStyle = '#0b1120';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = accentStroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 12 ticks
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (r - 5), cy + Math.sin(a) * (r - 5));
        ctx.lineTo(cx + Math.cos(a) * (r - 1.5), cy + Math.sin(a) * (r - 1.5));
        ctx.stroke();
      }

      // Hand
      ctx.strokeStyle = accentStroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(angleRad - Math.PI / 2) * (r - 7),
        cy + Math.sin(angleRad - Math.PI / 2) * (r - 7)
      );
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(title, cx, cy + r + 15);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(rateLabel, cx, cy + r + 29);
      ctx.textAlign = 'left';
    };

    const render = (now: number) => {
      const elapsed = (now - startTs) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.44;
      const cy = h * 0.5;

      // Visual radii in px: map r_s dynamically to readable scale (26..52 px)
      const rsPx = 28 + (logMassSolar / 10) * 22;
      const photonPx = rsPx * 1.5;
      const iscoPx = rsPx * 3.0;
      const maxOrbitPx = Math.min(w * 0.36, h * 0.44);
      const orbitPx = Math.min(
        maxOrbitPx,
        rsPx + ((radiusRatioRs - 1.05) / (25 - 1.05)) * (maxOrbitPx - rsPx)
      );

      // Curved spacetime grid lines deflected toward black hole
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
      ctx.lineWidth = 1;
      for (let gx = 20; gx < w - 150; gx += 28) {
        ctx.beginPath();
        for (let gy = 0; gy <= h; gy += 8) {
          const dx = gx - cx;
          const dy = gy - cy;
          const dist = Math.hypot(dx, dy) + 1;
          const pull = Math.min(24, (rsPx * rsPx * 0.55) / dist);
          const px = gx - (dx / dist) * pull;
          const py = gy - (dy / dist) * pull;
          if (gy === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      for (let gy = 20; gy < h; gy += 28) {
        ctx.beginPath();
        for (let gx = 0; gx <= w - 150; gx += 8) {
          const dx = gx - cx;
          const dy = gy - cy;
          const dist = Math.hypot(dx, dy) + 1;
          const pull = Math.min(24, (rsPx * rsPx * 0.55) / dist);
          const px = gx - (dx / dist) * pull;
          const py = gy - (dy / dist) * pull;
          if (gx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // ISCO ring (3 r_s)
      if (iscoPx < h * 0.48) {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, iscoPx, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Photon sphere ring (1.5 r_s)
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, photonPx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Observer orbit circle
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, orbitPx, 0, Math.PI * 2);
      ctx.stroke();

      // Accretion glow halo around horizon
      const halo = ctx.createRadialGradient(cx, cy, rsPx * 0.9, cx, cy, rsPx * 1.9);
      halo.addColorStop(0, 'rgba(96, 165, 250, 0.45)');
      halo.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, rsPx * 1.9, 0, Math.PI * 2);
      ctx.fill();

      // Event Horizon (r_s)
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(cx, cy, rsPx, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Moving observer probe on orbit
      const orbitOmega = 0.4 + res.beta * 2.2;
      const probeAngle = elapsed * orbitOmega;
      const probeX = cx + Math.cos(probeAngle) * orbitPx;
      const probeY = cy + Math.sin(probeAngle) * orbitPx;

      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(probeX, probeY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Compact legend top-left
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('r_s (Event Horizon)', 14, 22);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('1.5 r_s (Photon Sphere)', 14, 38);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('3.0 r_s (ISCO)', 14, 54);
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`Probe: ${radiusRatioRs.toFixed(2)} r_s`, 14, 70);

      // Right sidebar inside dark figure: Dual Relativistic Clocks
      const clockX = w - 82;
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(w - 154, 0, 154, h);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.beginPath();
      ctx.moveTo(w - 154, 0);
      ctx.lineTo(w - 154, h);
      ctx.stroke();

      const distantAngle = elapsed * 1.8;
      const localAngle = elapsed * 1.8 * res.combinedClockRate;

      drawClock(clockX, h * 0.27, 34, distantAngle, 'DISTANT CLOCK', '1.000x rate', '#e2e8f0');
      drawClock(
        clockX,
        h * 0.72,
        34,
        localAngle,
        'LOCAL CLOCK',
        `${res.combinedClockRate.toFixed(3)}x rate`,
        '#60a5fa'
      );

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [logMassSolar, radiusRatioRs, res.beta, res.combinedClockRate]);

  const formatRadius = (km: number) => {
    if (km >= 1.496e8) {
      return `${(km / 1.496e8).toFixed(2)} AU`;
    }
    if (km >= 1e6) {
      return `${formatSci(km, 2)} km`;
    }
    return `${km.toFixed(2)} km`;
  };

  return (
    <section aria-label="Special and General Relativity Calculator">
      <div className="section-header">
        <h2 className="section-title">special &amp; general relativity</h2>
        <p className="section-lead">
          Set a velocity, a black-hole mass and your distance from it; every number is computed from textbook equations with CODATA constants.
        </p>
      </div>

      <div className="grid-2">
        {/* Left: Embedded Dark Physics Figure */}
        <div className="figure-box">
          <div className="figure-header">
            <span>FIG 2.1 — SCHWARZSCHILD METRIC &amp; DUAL CLOCKS</span>
            <span>r_s = {formatRadius(res.schwarzschildRadiusKm)}</span>
          </div>
          <div className="figure-canvas-wrap">
            <canvas
              ref={canvasRef}
              width={680}
              height={370}
              className="figure-canvas"
              aria-label="Schwarzschild black hole curvature and dual relativistic clock simulation"
            />
          </div>
          <div className="figure-caption">
            <span>v/c = {res.beta.toFixed(4)} | gamma = {res.gamma < 1000 ? res.gamma.toFixed(3) : formatSci(res.gamma, 2)}</span>
            <span>Combined Clock: {(res.combinedClockRate * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Right: Interactive Sliders */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Velocity slider */}
          <div className="control-group">
            <div className="control-header">
              <label htmlFor="sr-velocity" className="control-label">
                Relative Velocity (v / c)
              </label>
              <span className="control-readout">
                {(res.beta * 100).toFixed(3)}% c
              </span>
            </div>
            <input
              id="sr-velocity"
              type="range"
              min={0}
              max={0.999}
              step={0.001}
              value={Math.min(beta, 0.999)}
              onChange={(e) => onBetaChange(Number(e.target.value))}
            />
            <div className="preset-row">
              {VELOCITY_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className={`btn-chip ${Math.abs(beta - p.beta) < 0.0005 ? 'active' : ''}`}
                  onClick={() => onBetaChange(p.beta)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Black Hole Mass slider */}
          <div className="control-group">
            <div className="control-header">
              <label htmlFor="gr-mass" className="control-label">
                Black Hole Mass (Solar Masses)
              </label>
              <span className="control-readout">{formatSci(massSolar, 2)} M_sun</span>
            </div>
            <input
              id="gr-mass"
              type="range"
              min={0}
              max={10}
              step={0.05}
              value={logMassSolar}
              onChange={(e) => onLogMassSolarChange(Number(e.target.value))}
            />
            <div className="preset-row">
              {MASS_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className={`btn-chip ${Math.abs(logMassSolar - p.logM) < 0.08 ? 'active' : ''}`}
                  onClick={() => onLogMassSolarChange(p.logM)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Observer Distance Ratio */}
          <div className="control-group">
            <div className="control-header">
              <label htmlFor="gr-radius" className="control-label">
                Observer Distance (r / r_s)
              </label>
              <span className="control-readout">
                {radiusRatioRs.toFixed(2)} r_s ({formatRadius(res.observerRadiusKm)})
              </span>
            </div>
            <input
              id="gr-radius"
              type="range"
              min={1.05}
              max={25}
              step={0.05}
              value={radiusRatioRs}
              onChange={(e) => onRadiusRatioRsChange(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Live Computed Metrics Grid */}
      <div className="grid-metrics grid-metrics-4" style={{ marginTop: '16px' }}>
        <div className="metric-tile">
          <span className="metric-label">Lorentz Factor (gamma)</span>
          <span className="metric-value accent">
            {res.gamma < 1000 ? res.gamma.toFixed(4) : formatSci(res.gamma, 2)}
          </span>
          <span className="metric-sub">Length L/L_0 = {res.lengthContraction.toFixed(4)}</span>
        </div>

        <div className="metric-tile">
          <span className="metric-label">SR vs GR Clock Rate</span>
          <span className="metric-value">
            {res.srClockRate.toFixed(3)} / {res.grClockRate.toFixed(3)}
          </span>
          <span className="metric-sub">
            Combined: {res.combinedClockRate.toFixed(4)} s per distant s
          </span>
        </div>

        <div className="metric-tile">
          <span className="metric-label">Schwarzschild Radius</span>
          <span className="metric-value">{formatRadius(res.schwarzschildRadiusKm)}</span>
          <span className="metric-sub">
            Escape v at r: {(res.escapeVelocityBeta * 100).toFixed(1)}% c
          </span>
        </div>

        <div className="metric-tile">
          <span className="metric-label">Hawking Temperature</span>
          <span className="metric-value">{formatSci(res.hawkingTempK, 2)} K</span>
          <span className="metric-sub">
            Entropy: {formatSci(res.bekensteinEntropyBits, 2)} bits
          </span>
        </div>
      </div>

      <div className="ke-bridge">
        <span className="metric-label">Energy bill for a 1-tonne starship at {(res.beta * 100).toFixed(res.beta < 0.01 ? 4 : 1)}% c</span>
        <span className="mono">
          (gamma − 1) m c² = {formatSci(keJ, 2)} J ≈ {keWorldYears >= 0.01 ? keWorldYears.toFixed(2) : formatSci(keWorldYears, 2)} × world primary energy in 2023
        </span>
      </div>

      {/* Collapsible Theory Drawers */}
      <details className="theory-drawer">
        <summary>Equations: Lorentz Factor, Einstein Field Equations &amp; Black-Hole Thermodynamics</summary>
        <div className="drawer-body">
          <div className="equation-block">
            SR: gamma = 1 / sqrt(1 - v^2/c^2) | dtau/dt = 1 / gamma | E_k = (gamma - 1) m c^2
          </div>
          <div className="equation-block">
            GR: G_munu + Lambda g_munu = (8 pi G / c^4) T_munu | r_s = 2 G M / c^2 | dtau/dt = sqrt(1 - r_s / r)
          </div>
          <div className="equation-block">
            Black-Hole Thermodynamics: T_H = hbar c^3 / (8 pi G M k_B) (~6.17 x 10^-8 K for 1 M_sun) | S_BH = k_B A / (4 l_P^2)
          </div>
        </div>
      </details>

    </section>
  );
};
