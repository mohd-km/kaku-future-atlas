import React, { useMemo, useState } from 'react';
import { Activity, ShieldAlert, Sliders, ArrowLeftRight } from 'lucide-react';
import {
  CIVILIZATION_PRESETS,
  type CivilizationPreset,
  type SimulationParams,
  type SimulationResult,
} from '../data/civilizationData';

interface Props {
  params: SimulationParams;
  onChangeParams: (next: SimulationParams) => void;
  simulation: SimulationResult;
}

const LOG_E_MIN = Math.log10(2500);
const LOG_E_MAX = Math.log10(250000);

function formatPower(w: number): string {
  if (w >= 1e12) return `${(w / 1e12).toFixed(1)} TW`;
  return `${(w / 1e9).toFixed(0)} GW`;
}

function formatCompactPop(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export const CivilizationComparator: React.FC<Props> = ({
  params,
  onChangeParams,
  simulation,
}) => {
  const [activePresetId, setActivePresetId] = useState<string>('bronze-river');
  const [compareA, setCompareA] = useState<string>('classical-athens');
  const [compareB, setCompareB] = useState<string>('classical-sparta');

  const applyPreset = (p: CivilizationPreset) => {
    setActivePresetId(p.id);
    onChangeParams({
      energyKcalPerCapita: p.energyKcalPerCapita,
      institutionalOpenness: p.institutionalOpenness,
      resourceShock: p.resourceShockExposure,
      supplyCoupling: p.supplyCouplingFragility,
    });
  };

  const presetA = useMemo(
    () => CIVILIZATION_PRESETS.find((c) => c.id === compareA) ?? CIVILIZATION_PRESETS[3],
    [compareA]
  );
  const presetB = useMemo(
    () => CIVILIZATION_PRESETS.find((c) => c.id === compareB) ?? CIVILIZATION_PRESETS[4],
    [compareB]
  );

  // SVG 1: Log-Log Energy Capture vs Density
  const SCAT_W = 540;
  const SCAT_H = 260;
  const PAD = { left: 56, right: 24, top: 20, bottom: 42 };
  const plotW = SCAT_W - PAD.left - PAD.right;
  const plotH = SCAT_H - PAD.top - PAD.bottom;

  const xEnergy = (kcal: number) => {
    const l = Math.log10(Math.max(2000, kcal));
    return PAD.left + ((l - Math.log10(2000)) / (Math.log10(320000) - Math.log10(2000))) * plotW;
  };
  const yDensity = (d: number) => {
    const l = Math.log10(Math.max(0.2, d));
    const frac = (l - Math.log10(0.2)) / (Math.log10(800) - Math.log10(0.2));
    return PAD.top + plotH - frac * plotH;
  };

  // SVG 2: 50-Generation Systems-Loop Trajectory
  const TRAJ_W = 540;
  const TRAJ_H = 260;
  const maxPop = Math.max(180, ...simulation.steps.map((s) => s.populationIndex));
  const xGen = (g: number) => PAD.left + (g / 50) * plotW;
  const yVal = (v: number, ceiling: number) => PAD.top + plotH - (Math.min(ceiling, v) / ceiling) * plotH;

  const popPath = simulation.steps
    .map((s, i) => `${i === 0 ? 'M' : 'L'} ${xGen(s.generation).toFixed(1)} ${yVal(s.populationIndex, maxPop).toFixed(1)}`)
    .join(' ');
  const surplusPath = simulation.steps
    .map((s, i) => `${i === 0 ? 'M' : 'L'} ${xGen(s.generation).toFixed(1)} ${yVal(s.surplusIndex, 145).toFixed(1)}`)
    .join(' ');
  const complexityPath = simulation.steps
    .map((s, i) => `${i === 0 ? 'M' : 'L'} ${xGen(s.generation).toFixed(1)} ${yVal(s.complexityIndex, 145).toFixed(1)}`)
    .join(' ');

  // kcal/day per person -> continuous watts; scaled to today's world population -> Sagan K
  const perCapitaW = (params.energyKcalPerCapita * 4184) / 86400;
  const worldW = perCapitaW * 8.1e9;
  const worldK = (Math.log10(worldW) - 6) / 10;

  const logEnergyValue = Math.log10(Math.max(2500, Math.min(250000, params.energyKcalPerCapita)));

  return (
    <section className="section-stack" aria-label="Civilizational Energy Capture and Resilience Comparator">
      {/* Top KPI Summary Bar */}
      <div className="grid-metrics">
        <div className="metric-box">
          <span className="metric-label">Energy per person (capture)</span>
          <span className="metric-value accent">
            {params.energyKcalPerCapita.toLocaleString()} kcal/d
          </span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Resilience (0 to 100, higher is sturdier)</span>
          <span className="metric-value">{simulation.resilienceScore} / 100</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Main feedback loop</span>
          <span className="metric-value" style={{ fontSize: '14px' }}>
            {simulation.dominantLoop.split(' ')[0]}
          </span>
        </div>
        <div className="metric-box">
          <span className="metric-label">People per km² · biggest settlement</span>
          <span className="metric-value" style={{ fontSize: '15px' }}>
            {simulation.estimatedDensity}/km2 &middot; {formatCompactPop(simulation.estimatedSettlementPop)}
          </span>
        </div>
      </div>

      {/* Interactive Simulator Controls + Presets */}
      <div className="grid-2">
        <div className="card">
          <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent)" /> Society stress test
          </h2>
          <p style={{ margin: '4px 0 12px', color: 'var(--ink-secondary)', fontSize: '14px' }}>
            Pick a society from history or set the sliders. Energy per person follows published historical estimates; openness, shocks and resilience are scores from this model, not measurements.
          </p>

          <div className="chip-row" style={{ marginBottom: '14px' }}>
            {CIVILIZATION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`chip ${activePresetId === preset.id ? 'active' : ''}`}
                onClick={() => applyPreset(preset)}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="energy-slider" className="slider-label">
                Energy per person per day (log scale: each notch multiplies)
              </label>
              <span className="slider-readout">
                {params.energyKcalPerCapita.toLocaleString()} kcal/day
              </span>
            </div>
            <input
              id="energy-slider"
              type="range"
              min={LOG_E_MIN}
              max={LOG_E_MAX}
              step={0.01}
              value={logEnergyValue}
              onChange={(e) => {
                setActivePresetId('custom');
                onChangeParams({
                  ...params,
                  energyKcalPerCapita: Math.round(Math.pow(10, Number(e.target.value)) / 100) * 100,
                });
              }}
            />
          </div>

          <div className="kard-bridge">
            <span className="metric-label">What this means on the Kardashev scale</span>
            <span className="mono">
              {perCapitaW.toLocaleString(undefined, { maximumFractionDigits: 0 })} W/person × 8.1 B people ={' '}
              {formatPower(worldW)} → Type {worldK.toFixed(2)}
            </span>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="openness-slider" className="slider-label">
                Openness to new ideas and outsiders (closed Sparta 0% to open Athens 100%)
              </label>
              <span className="slider-readout">{params.institutionalOpenness}%</span>
            </div>
            <input
              id="openness-slider"
              type="range"
              min={0}
              max={100}
              step={1}
              value={params.institutionalOpenness}
              onChange={(e) => {
                setActivePresetId('custom');
                onChangeParams({ ...params, institutionalOpenness: Number(e.target.value) });
              }}
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="shock-slider" className="slider-label">
                Size of climate and ecological shocks
              </label>
              <span className="slider-readout">{params.resourceShock}%</span>
            </div>
            <input
              id="shock-slider"
              type="range"
              min={0}
              max={100}
              step={1}
              value={params.resourceShock}
              onChange={(e) => {
                setActivePresetId('custom');
                onChangeParams({ ...params, resourceShock: Number(e.target.value) });
              }}
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="coupling-slider" className="slider-label">
                How tightly supply chains are linked (local 0% to fragile global web 100%)
              </label>
              <span className="slider-readout">{params.supplyCoupling}%</span>
            </div>
            <input
              id="coupling-slider"
              type="range"
              min={0}
              max={100}
              step={1}
              value={params.supplyCoupling}
              onChange={(e) => {
                setActivePresetId('custom');
                onChangeParams({ ...params, supplyCoupling: Number(e.target.value) });
              }}
            />
          </div>
        </div>

        {/* Collapse Drivers Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '19px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="var(--accent)" /> What could make it collapse
          </h3>
          <p style={{ margin: '4px 0 14px', color: 'var(--ink-secondary)', fontSize: '14px' }}>
            Verdict: <strong style={{ color: 'var(--ink-primary)' }}>{simulation.dominantLoop}</strong> &middot; Energy surplus
            (net surplus ratio) <span className="mono">{simulation.netSurplusRatio}x</span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {simulation.collapseDrivers.map((d) => (
              <div key={d.label} className="metric-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <strong>{d.label}</strong>
                  <span className="mono" style={{ color: d.score >= 70 ? 'var(--accent)' : 'var(--ink-primary)' }}>
                    {d.score} / 100
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    background: 'var(--bg-subtle)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-hairline)',
                  }}
                >
                  <div
                    style={{
                      width: `${d.score}%`,
                      height: '100%',
                      background: d.score >= 70 ? 'var(--accent)' : '#57534e',
                      transition: 'width 0.2s ease',
                    }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '5px' }}>{d.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Visual Plates: Log-Log Scaling + 50-Generation Systems-Loop Trajectory */}
      <div className="grid-equal-2">
        {/* Visual 1: Log-Log Energy vs Density */}
        <div className="card-white">
          <h3 style={{ fontSize: '18px' }}>Energy per person vs people per km² (both axes log scale)</h3>
          <p style={{ margin: '4px 0 12px', color: 'var(--ink-secondary)', fontSize: '13.5px' }}>
            Click a historical dot to load it; the blue ring is your live scenario.
          </p>

          <svg
            viewBox={`0 0 ${SCAT_W} ${SCAT_H}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            role="img"
            aria-label="Log-log plot of energy capture per capita versus population density"
          >
            {/* Gridlines */}
            {[3000, 10000, 30000, 100000, 250000].map((eTick) => {
              const x = xEnergy(eTick);
              return (
                <g key={eTick}>
                  <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + plotH} stroke="#e5e5e3" strokeDasharray="3 3" />
                  <text x={x} y={SCAT_H - 16} textAnchor="middle" fill="#555555" fontSize="11" fontFamily="JetBrains Mono, monospace">
                    {eTick >= 1000 ? `${eTick / 1000}k` : eTick}
                  </text>
                </g>
              );
            })}
            {[1, 10, 100, 500].map((dTick) => {
              const y = yDensity(dTick);
              return (
                <g key={dTick}>
                  <line x1={PAD.left} y1={y} x2={PAD.left + plotW} y2={y} stroke="#e5e5e3" strokeDasharray="3 3" />
                  <text x={PAD.left - 8} y={y + 4} textAnchor="end" fill="#555555" fontSize="11" fontFamily="JetBrains Mono, monospace">
                    {dTick}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#111111" strokeWidth="1" />
            <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#111111" strokeWidth="1" />

            <text x={PAD.left + plotW / 2} y={SCAT_H - 2} textAnchor="middle" fill="#555555" fontSize="11" fontFamily="Inter, sans-serif">
              Energy Capture (kcal / day / capita)
            </text>
            <text
              x={14}
              y={PAD.top + plotH / 2}
              textAnchor="middle"
              fill="#555555"
              fontSize="11"
              fontFamily="Inter, sans-serif"
              transform={`rotate(-90 14 ${PAD.top + plotH / 2})`}
            >
              People / km2
            </text>

            {/* Historical Regimes */}
            {CIVILIZATION_PRESETS.map((p) => {
              const cx = xEnergy(p.energyKcalPerCapita);
              const cy = yDensity(p.popDensityPerKm2);
              const isSelected = activePresetId === p.id;
              return (
                <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => applyPreset(p)}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 7 : 5}
                    fill={isSelected ? '#1d4ed8' : '#44403c'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={cx + (p.id === 'digital-anthropocene' ? -10 : 8)}
                    y={cy + (p.id === 'classical-sparta' ? 14 : -6)}
                    textAnchor={p.id === 'digital-anthropocene' ? 'end' : 'start'}
                    fill="#111111"
                    fontSize="10.5"
                    fontFamily="Inter, sans-serif"
                  >
                    {p.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Live Simulated Civilization Marker */}
            <circle
              cx={xEnergy(params.energyKcalPerCapita)}
              cy={yDensity(simulation.estimatedDensity)}
              r={10}
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="2.5"
              strokeDasharray="3 2"
            />
          </svg>
        </div>

        {/* Visual 2: 50-Generation Systems-Loop Trajectory */}
        <div className="card-white">
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={17} color="var(--accent)" /> Reinforcing vs. Balancing Loop Trajectory
          </h3>
          <p style={{ margin: '4px 0 12px', color: 'var(--ink-secondary)', fontSize: '13.5px' }}>
            50 generations with a shock pulse at gen 18–34; solid blue is population.
          </p>

          <svg
            viewBox={`0 0 ${TRAJ_W} ${TRAJ_H}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            role="img"
            aria-label="50-generation trajectory of population, surplus energy, and institutional complexity"
          >
            {/* Shock Window Band */}
            <rect
              x={xGen(18)}
              y={PAD.top}
              width={xGen(34) - xGen(18)}
              height={plotH}
              fill="#eff6ff"
              stroke="#bfdbfe"
              strokeDasharray="3 3"
            />
            <text
              x={(xGen(18) + xGen(34)) / 2}
              y={PAD.top + 14}
              textAnchor="middle"
              fill="#1d4ed8"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
            >
              SHOCK WINDOW
            </text>

            {/* Axes */}
            <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#111111" strokeWidth="1" />
            <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#111111" strokeWidth="1" />

            {[0, 10, 20, 30, 40, 50].map((g) => (
              <text
                key={g}
                x={xGen(g)}
                y={TRAJ_H - 16}
                textAnchor="middle"
                fill="#555555"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
              >
                G{g}
              </text>
            ))}

            {/* Curves */}
            <path d={complexityPath} fill="none" stroke="#78716c" strokeWidth="1.6" strokeDasharray="4 3" />
            <path d={surplusPath} fill="none" stroke="#111111" strokeWidth="1.6" />
            <path d={popPath} fill="none" stroke="#1d4ed8" strokeWidth="2.6" />

            {/* Legend */}
            <g transform={`translate(${PAD.left + 8}, ${PAD.top + plotH + 34})`}>
              <line x1="0" y1="0" x2="18" y2="0" stroke="#1d4ed8" strokeWidth="2.6" />
              <text x="24" y="4" fill="#111111" fontSize="11" fontFamily="Inter, sans-serif">Population</text>

              <line x1="108" y1="0" x2="126" y2="0" stroke="#111111" strokeWidth="1.6" />
              <text x="132" y="4" fill="#111111" fontSize="11" fontFamily="Inter, sans-serif">Net Surplus</text>

              <line x1="224" y1="0" x2="242" y2="0" stroke="#78716c" strokeWidth="1.6" strokeDasharray="4 3" />
              <text x="248" y="4" fill="#111111" fontSize="11" fontFamily="Inter, sans-serif">Complexity</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Head-to-Head Regime Comparator (Athens vs Sparta, Sumer vs Digital, etc.) */}
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
            <h3 style={{ fontSize: '19px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeftRight size={17} color="var(--accent)" /> Side-by-Side Regime Comparator
            </h3>
            <p style={{ margin: '4px 0 0', color: 'var(--ink-secondary)', fontSize: '14px' }}>
              Contrast energy capture, openness, and collapse drivers across any two historical civilizations.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <select
              aria-label="Select Regime A"
              value={compareA}
              onChange={(e) => setCompareA(e.target.value)}
              className="btn"
            >
              {CIVILIZATION_PRESETS.map((c) => (
                <option key={c.id} value={c.id}>
                  A: {c.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Select Regime B"
              value={compareB}
              onChange={(e) => setCompareB(e.target.value)}
              className="btn"
            >
              {CIVILIZATION_PRESETS.map((c) => (
                <option key={c.id} value={c.id}>
                  B: {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table className="editorial-table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>{presetA.name}</th>
                <th>{presetB.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Era</strong></td>
                <td className="mono">{presetA.era}</td>
                <td className="mono">{presetB.era}</td>
              </tr>
              <tr>
                <td><strong>Energy Capture</strong></td>
                <td className="mono">{presetA.energyKcalPerCapita.toLocaleString()} kcal/day/cap</td>
                <td className="mono">{presetB.energyKcalPerCapita.toLocaleString()} kcal/day/cap</td>
              </tr>
              <tr>
                <td><strong>Population Density</strong></td>
                <td className="mono">{presetA.popDensityPerKm2} people/km2</td>
                <td className="mono">{presetB.popDensityPerKm2} people/km2</td>
              </tr>
              <tr>
                <td><strong>Institutional Openness</strong></td>
                <td className="mono">{presetA.institutionalOpenness}%</td>
                <td className="mono">{presetB.institutionalOpenness}%</td>
              </tr>
              <tr>
                <td><strong>Governance &amp; Culture</strong></td>
                <td>{presetA.governanceArchetype}</td>
                <td>{presetB.governanceArchetype}</td>
              </tr>
              <tr>
                <td><strong>Primary Collapse Driver</strong></td>
                <td>{presetA.primaryCollapseDriver}</td>
                <td>{presetB.primaryCollapseDriver}</td>
              </tr>
              <tr>
                <td><strong>Historical Benchmark</strong></td>
                <td>{presetA.historicalAnchor}</td>
                <td>{presetB.historicalAnchor}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <details className="editorial-drawer">
          <summary>How the model works: feedback loops, open societies and collapse</summary>
          <div className="drawer-body">
            <div className="equation-block">
              dP/dt = P * [ R(E, Openness) - B(ClimateShock, SupplyCoupling, ComplexityOverhead, Rigidity) ]
              {'\n'}
              Loop Dominance: R &gt; B =&gt; Exponential Growth | R ~ B =&gt; Steady State | B &gt; R =&gt; Decline / Collapse
            </div>
            <p style={{ margin: 0 }}>
              Reinforcing loops amplify population and surplus; balancing loops impose resource, coupling and complexity ceilings.
              Openness raises adaptive recovery after shocks. Indices are modelled, not measured.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
};
