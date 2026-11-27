import React from 'react';
import {
  CONSTANTS,
  ENERGY_BENCHMARKS,
  computeRunningCouplings,
  formatSci,
} from '../data/physics';

interface Props {
  logEnergyGeV: number;
  onLogEnergyGeVChange: (val: number) => void;
  useSusy: boolean;
  onUseSusyChange: (val: boolean) => void;
}

const CHART_W = 680;
const CHART_H = 310;
const PAD = { top: 24, right: 24, bottom: 44, left: 56 };
const X_MIN = 0; // 1 GeV
const X_MAX = 19.5; // ~3 x 10^19 GeV
const Y_MIN = 0;
const Y_MAX = 65; // inverse coupling alpha^-1

function mapX(logE: number): number {
  const clamped = Math.max(X_MIN, Math.min(X_MAX, logE));
  return PAD.left + ((clamped - X_MIN) / (X_MAX - X_MIN)) * (CHART_W - PAD.left - PAD.right);
}

function mapY(invAlpha: number): number {
  const clamped = Math.max(Y_MIN, Math.min(Y_MAX, invAlpha));
  return CHART_H - PAD.bottom - ((clamped - Y_MIN) / (Y_MAX - Y_MIN)) * (CHART_H - PAD.top - PAD.bottom);
}

function buildCurvePath(
  susy: boolean,
  pick: 'inv1' | 'inv2' | 'inv3'
): string {
  const pts: string[] = [];
  for (let logE = X_MIN; logE <= X_MAX; logE += 0.25) {
    const c = computeRunningCouplings(logE, susy);
    const x = mapX(logE);
    const y = mapY(c[pick]);
    pts.push(`${pts.length === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

export const ForcesUnificationLab: React.FC<Props> = ({
  logEnergyGeV,
  onLogEnergyGeVChange,
  useSusy,
  onUseSusyChange,
}) => {
  const couplings = computeRunningCouplings(logEnergyGeV, useSusy);
  const energyGeV = Math.pow(10, logEnergyGeV);
  const gapToPlanck = CONSTANTS.ePlanckGeV / energyGeV;

  const isElectroweakUnified = logEnergyGeV >= 2.39;
  const isGutUnified = logEnergyGeV >= 16.0;
  const isPlanckUnified = logEnergyGeV >= 18.8;

  const path1 = buildCurvePath(useSusy, 'inv1');
  const path2 = buildCurvePath(useSusy, 'inv2');
  const path3 = buildCurvePath(useSusy, 'inv3');

  const cursorX = mapX(Math.max(X_MIN, logEnergyGeV));

  // Normalize relative log-strength bars (0..100%) across -40..0 log10(alpha)
  const barPct = (alpha: number) => {
    const logA = Math.log10(Math.max(alpha, 1e-45));
    return Math.max(4, Math.min(100, ((logA + 42) / 42) * 100));
  };

  const forceCards = [
    {
      name: 'Strong Nuclear (QCD)',
      group: 'SU(3) Non-Abelian',
      carrier: '8 Gluons (Spin-1, coloured)',
      stringType: 'Open String (N=1)',
      renorm: 'Renormalizable (Asymptotic freedom)',
      alpha: couplings.alpha3,
      alphaLabel: `alpha_3 = ${couplings.alpha3.toFixed(4)} (1/${couplings.inv3.toFixed(1)})`,
      unified: isGutUnified,
      status: isPlanckUnified
        ? 'Unified (Planck)'
        : isGutUnified
        ? 'Unified (GUT)'
        : logEnergyGeV < -0.3
        ? 'Confined (10^-15 m)'
        : 'Weakening with E',
    },
    {
      name: 'Weak Nuclear',
      group: 'SU(2) Gauge',
      carrier: 'W (80 GeV), Z (91 GeV), Spin-1',
      stringType: 'Open String (N=1)',
      renorm: 'Renormalizable (Higgs VEV 246 GeV)',
      alpha: couplings.alpha2,
      alphaLabel: `alpha_2 = ${couplings.alpha2.toFixed(4)} (1/${couplings.inv2.toFixed(1)})`,
      unified: isElectroweakUnified,
      status: isPlanckUnified
        ? 'Unified (Planck)'
        : isGutUnified
        ? 'Unified (GUT)'
        : isElectroweakUnified
        ? 'Electroweak Unified'
        : 'Broken (< 246 GeV)',
    },
    {
      name: 'Electromagnetism (QED)',
      group: 'U(1) Abelian',
      carrier: 'Photon (Spin-1, Rank-1 J_mu)',
      stringType: 'Open String (N=1)',
      renorm: 'Renormalizable (ln Lambda)',
      alpha: couplings.alpha1,
      alphaLabel:
        logEnergyGeV < 1
          ? 'alpha_EM ~ 1/137.0 (long-range)'
          : `alpha_1 = ${couplings.alpha1.toFixed(4)} (1/${couplings.inv1.toFixed(1)})`,
      unified: isElectroweakUnified,
      status: isPlanckUnified
        ? 'Unified (Planck)'
        : isGutUnified
        ? 'Unified (GUT)'
        : isElectroweakUnified
        ? 'Electroweak Unified'
        : 'Screened Vacuum',
    },
    {
      name: 'Gravity (GR / Quantum)',
      group: 'Metric g_munu (Rank-2 T_munu)',
      carrier: 'Graviton (Spin-2, self-couples)',
      stringType: 'Closed Loop (N=1)',
      renorm: 'Non-renormalizable (G ~ 1/M_P^2)',
      alpha: couplings.alphaG,
      alphaLabel: `alpha_G ~ 10^${couplings.log10AlphaG.toFixed(1)}`,
      unified: isPlanckUnified,
      status: isPlanckUnified
        ? 'Order-1 Quantum Gravity'
        : 'Suppressed by (E/E_P)^2',
    },
  ];

  return (
    <section aria-label="Fundamental Forces Energy-Scale Unification Comparator">
      <div className="section-header">
        <h2 className="section-title">fundamental forces unification</h2>
        <p className="section-lead">
          Sweep energy from atomic scales to the Planck scale and watch the three gauge couplings run (1-loop renormalization group), with or without supersymmetry.
        </p>
      </div>

      {/* Controls & Chart */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div className="control-group" style={{ flex: '1 1 320px' }}>
            <div className="control-header">
              <label htmlFor="energy-scale-slider" className="control-label">
                Probe Energy Scale (log10 GeV)
              </label>
              <span className="control-readout">
                {formatSci(energyGeV, 2)} GeV (10^{logEnergyGeV.toFixed(1)})
              </span>
            </div>
            <input
              id="energy-scale-slider"
              type="range"
              min={-6}
              max={19.1}
              step={0.1}
              value={logEnergyGeV}
              onChange={(e) => onLogEnergyGeVChange(Number(e.target.value))}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className={`btn ${!useSusy ? 'btn-primary' : ''}`}
              onClick={() => onUseSusyChange(false)}
            >
              Standard Model
            </button>
            <button
              type="button"
              className={`btn ${useSusy ? 'btn-primary' : ''}`}
              onClick={() => onUseSusyChange(true)}
            >
              SUSY (MSSM)
            </button>
          </div>
        </div>

        <div className="preset-row" role="group" aria-label="Energy scale benchmarks">
          {ENERGY_BENCHMARKS.map((bm) => (
            <button
              key={bm.id}
              type="button"
              className={`btn-chip ${Math.abs(logEnergyGeV - bm.log10GeV) < 0.35 ? 'active' : ''}`}
              onClick={() => onLogEnergyGeVChange(bm.log10GeV)}
              title={bm.note}
            >
              {bm.label} ({bm.energyText.split(' ')[0]})
            </button>
          ))}
        </div>

        {/* Clean White Editorial SVG Running Couplings Plot */}
        <div className="card-white" style={{ padding: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '8px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--ink-secondary)',
            }}
          >
            <span>FIG 3.1 — INVERSE GAUGE COUPLINGS (1 / alpha_i) VS LOG10(E / GeV)</span>
            <span>
              Gap to Planck: {gapToPlanck > 1.2 ? `${formatSci(gapToPlanck, 1)}x` : 'At Planck Scale'}
            </span>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              style={{ width: '100%', height: 'auto', display: 'block', minWidth: '320px', maxWidth: '980px', margin: '0 auto' }}
              role="img"
              aria-label="Running inverse coupling constants from 1 GeV to Planck Energy"
            >
              {/* Horizontal gridlines */}
              {[0, 15, 30, 45, 60].map((yVal) => {
                const y = mapY(yVal);
                return (
                  <g key={yVal}>
                    <line
                      x1={PAD.left}
                      y1={y}
                      x2={CHART_W - PAD.right}
                      y2={y}
                      stroke="#e5e5e3"
                      strokeWidth="1"
                    />
                    <text
                      x={PAD.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                      fill="#555555"
                    >
                      {yVal}
                    </text>
                  </g>
                );
              })}

              {/* Vertical benchmark markers */}
              {[
                { logE: 2.39, label: 'EW' },
                { logE: 4.15, label: 'LHC' },
                { logE: 16.3, label: 'GUT' },
                { logE: 19.09, label: 'Planck' },
              ].map((m) => {
                const x = mapX(m.logE);
                return (
                  <g key={m.label}>
                    <line
                      x1={x}
                      y1={PAD.top}
                      x2={x}
                      y2={CHART_H - PAD.bottom}
                      stroke="#d4d4d0"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={PAD.top - 7}
                      textAnchor="middle"
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                      fill="#555555"
                    >
                      {m.label}
                    </text>
                  </g>
                );
              })}

              {/* X-axis ticks */}
              {[0, 4, 8, 12, 16, 19].map((xVal) => {
                const x = mapX(xVal);
                return (
                  <text
                    key={xVal}
                    x={x}
                    y={CHART_H - PAD.bottom + 18}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fill="#555555"
                  >
                    10^{xVal}
                  </text>
                );
              })}

              {/* Axis labels */}
              <text
                x={(PAD.left + CHART_W - PAD.right) / 2}
                y={CHART_H - 6}
                textAnchor="middle"
                fontSize="11"
                fontFamily="Inter, sans-serif"
                fill="#555555"
              >
                Interaction Energy E (GeV)
              </text>
              <text
                x={16}
                y={(PAD.top + CHART_H - PAD.bottom) / 2}
                textAnchor="middle"
                fontSize="11"
                fontFamily="Inter, sans-serif"
                fill="#555555"
                transform={`rotate(-90 16 ${(PAD.top + CHART_H - PAD.bottom) / 2})`}
              >
                Inverse Coupling (1 / alpha)
              </text>

              {/* Running curves */}
              <path d={path1} fill="none" stroke="#1e40af" strokeWidth="2.2" />
              <path d={path2} fill="none" stroke="#52525b" strokeWidth="2.2" strokeDasharray="6 3" />
              <path d={path3} fill="none" stroke="#111111" strokeWidth="2.2" />

              {/* Gravity onset indicator near Planck scale */}
              <line
                x1={mapX(19.09)}
                y1={mapY(1)}
                x2={mapX(19.09)}
                y2={mapY(32)}
                stroke="#1e40af"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* Active vertical cursor */}
              <line
                x1={cursorX}
                y1={PAD.top}
                x2={cursorX}
                y2={CHART_H - PAD.bottom}
                stroke="#1e40af"
                strokeWidth="1.5"
              />
              <circle cx={cursorX} cy={mapY(couplings.inv1)} r="4" fill="#1e40af" />
              <circle cx={cursorX} cy={mapY(couplings.inv2)} r="4" fill="#52525b" />
              <circle cx={cursorX} cy={mapY(couplings.inv3)} r="4" fill="#111111" />
            </svg>
          </div>

          <div className="budget-legend" style={{ marginTop: '6px' }}>
            <span>
              <span className="legend-dot" style={{ background: '#1e40af' }} />
              U(1) Electromagnetism (1/alpha_1)
            </span>
            <span>
              <span className="legend-dot" style={{ background: '#52525b' }} />
              SU(2) Weak (1/alpha_2)
            </span>
            <span>
              <span className="legend-dot" style={{ background: '#111111' }} />
              SU(3) Strong (1/alpha_3)
            </span>
          </div>
        </div>

        {/* Four Force Comparator Cards */}
        <div className="force-grid">
          {forceCards.map((fc) => (
            <div
              key={fc.name}
              className={`force-card ${fc.unified ? 'unified' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                <span className="force-tag">{fc.status}</span>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                  {fc.group.split(' ')[0]}
                </span>
              </div>
              <h3 style={{ fontSize: '17px' }}>{fc.name}</h3>
              <div className="mono" style={{ fontSize: '12px', color: 'var(--ink-primary)' }}>
                {fc.alphaLabel}
              </div>
              <div className="strength-bar-track" aria-hidden="true">
                <div
                  className="strength-bar-fill"
                  style={{ width: `${barPct(fc.alpha)}%` }}
                />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                <div><strong>Carrier:</strong> {fc.carrier}</div>
                <div><strong>String:</strong> {fc.stringType}</div>
                <div><strong>QFT:</strong> {fc.renorm}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Deep Theory Drawers */}
      <details className="theory-drawer">
        <summary>Why QED Renormalizes &amp; Gravity Explodes (Loop Divergences &amp; String Cutoff)</summary>
        <div className="drawer-body">
          <div className="equation-block">
            Path Integral: Z = integral D[phi] exp(i S[phi] / hbar) | Polyakov Action: S_P = -(T/2) integral d^2 sigma sqrt(-h) h^ab d_a X^mu d_b X_mu
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>QED (Electromagnetism)</th>
                  <th>Point-Particle Gravity (GR)</th>
                  <th>Superstring Theory</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Coupling Dimension</td>
                  <td>Dimensionless (e)</td>
                  <td>1 / M_Planck^2 (G)</td>
                  <td>String length cutoff l_s</td>
                </tr>
                <tr>
                  <td>Self-Interaction</td>
                  <td>No (photons are chargeless)</td>
                  <td>Yes (energy gravitates)</td>
                  <td>Smeared 2D worldsheet tube</td>
                </tr>
                <tr>
                  <td>UV Divergence</td>
                  <td>Tame ln(Lambda); finite counterterms</td>
                  <td>Wild Lambda^2, Lambda^4...; infinite counterterms</td>
                  <td>UV finite (no r = 0 vertex)</td>
                </tr>
                <tr>
                  <td>Critical Dimensions</td>
                  <td>4D spacetime</td>
                  <td>4D spacetime</td>
                  <td>10D superstrings / 11D M-theory</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </details>

      <details className="theory-drawer">
        <summary>Experimental Bounds &amp; Verification Status (Nov 2026)</summary>
        <div className="drawer-body">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Experiment</th>
                  <th>Target</th>
                  <th>Current Status (Nov 2026)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LHC Collisions (14 TeV)</td>
                  <td>Supersymmetric partners (sparticles)</td>
                  <td>None detected; gluino mass limits exceed ~2+ TeV</td>
                </tr>
                <tr>
                  <td>Eot-Wash Torsion Balance</td>
                  <td>Short-range 1/r^2 gravity deviations</td>
                  <td>Inverse-square law holds down to ~50 micrometres</td>
                </tr>
                <tr>
                  <td>BICEP / Keck CMB Polarization</td>
                  <td>Primordial gravitational waves (B-modes)</td>
                  <td>Not detected; tensor-to-scalar ratio r &lt; 0.036</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </section>
  );
};
