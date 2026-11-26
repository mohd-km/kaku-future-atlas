import React, { useEffect, useMemo, useRef, useState } from 'react';
import { QUANTUM_APPS } from '../data/kakuData.js';

function formatStateCount(qubits) {
  if (qubits <= 20) {
    return Math.pow(2, qubits).toLocaleString();
  }
  const log10 = qubits * Math.log10(2);
  const exp = Math.floor(log10);
  const mantissa = Math.pow(10, log10 - exp);
  return `${mantissa.toFixed(2)} x 10^${exp}`;
}

function formatClassicalRam(qubits) {
  // 16 bytes per complex amplitude (two 64-bit floats)
  const bytes = Math.pow(2, qubits) * 16;
  if (bytes < 1e6) return `${(bytes / 1e3).toFixed(1)} KB`;
  if (bytes < 1e9) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes < 1e12) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes < 1e15) return `${(bytes / 1e12).toFixed(1)} TB`;
  if (bytes < 1e18) return `${(bytes / 1e15).toFixed(1)} PB`;
  const log10Bytes = qubits * Math.log10(2) + Math.log10(16);
  const exp = Math.floor(log10Bytes);
  const mantissa = Math.pow(10, log10Bytes - exp);
  return `${mantissa.toFixed(1)} x 10^${exp} B`;
}

export default function QuantumLab() {
  const [qubits, setQubits] = useState(28);
  const [appId, setAppId] = useState('drug');
  const canvasRef = useRef(null);

  const activeApp = QUANTUM_APPS.find((a) => a.id === appId) || QUANTUM_APPS[0];
  const stateCount = useMemo(() => formatStateCount(qubits), [qubits]);
  const classicalRam = useMemo(() => formatClassicalRam(qubits), [qubits]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let phase = 0;

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

      const midX = w * 0.48;

      // Divider
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(midX, 34);
      ctx.lineTo(midX, h - 16);
      ctx.stroke();

      // Left side: Classical sequential bits
      ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.fillText('CLASSICAL (ONE PATH AT A TIME)', 14, 24);

      const cols = 6;
      const rows = 4;
      const cellW = (midX - 36) / cols;
      const cellH = (h - 70) / rows;
      const activeIdx = Math.floor(phase * 3) % (cols * rows);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const bx = 18 + c * cellW;
          const by = 46 + r * cellH;
          const isLit = idx === activeIdx;
          ctx.fillStyle = isLit ? '#60a5fa' : 'rgba(51, 65, 85, 0.7)';
          ctx.fillRect(bx + 3, by + 3, cellW - 8, cellH - 8);
          ctx.fillStyle = isLit ? '#0f172a' : 'rgba(148, 163, 184, 0.7)';
          ctx.font = '500 11px "JetBrains Mono", monospace';
          ctx.fillText((idx + qubits) % 2 === 0 ? '0' : '1', bx + cellW / 2 - 4, by + cellH / 2 + 4);
        }
      }

      // Right side: Quantum superposition interference waves
      ctx.fillStyle = 'rgba(224, 242, 254, 0.92)';
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.fillText(`QUANTUM (${qubits} QUBITS IN PARALLEL)`, midX + 14, 24);

      const waveCount = Math.min(14, Math.max(3, Math.floor(qubits / 3.5)));
      const qLeft = midX + 16;
      const qWidth = w - qLeft - 16;
      const centerY = h * 0.54;

      for (let i = 0; i < waveCount; i++) {
        const frac = i / waveCount;
        ctx.strokeStyle = `rgba(96, 165, 250, ${(0.22 + (1 - frac) * 0.55).toFixed(2)})`;
        ctx.lineWidth = i === 0 ? 2.2 : 1.1;
        ctx.beginPath();
        for (let x = 0; x <= qWidth; x += 3) {
          const tNorm = x / qWidth;
          const envelope = Math.sin(tNorm * Math.PI);
          const y =
            centerY +
            Math.sin(tNorm * Math.PI * (3 + i * 0.8) + phase * (1.2 + i * 0.15)) *
              (h * 0.28) *
              envelope *
              (1 - frac * 0.45);
          if (x === 0) ctx.moveTo(qLeft + x, y);
          else ctx.lineTo(qLeft + x, y);
        }
        ctx.stroke();
      }

      // Lowest-energy molecular solution node
      const solX = qLeft + qWidth * 0.5;
      const solY = centerY + Math.sin(phase * 1.4) * 8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(solX, solY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      phase += 0.035;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [qubits]);

  return (
    <section aria-label="Quantum Supremacy Explorer">
      <div className="section-head">
        <div>
          <h2 className="section-title">Quantum Supremacy</h2>
          <p className="section-lead">
            Nature computes with quantum waves, not binary switches—so every extra qubit doubles the molecular states a quantum chip can hold at once.
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Logical Qubits</span>
            <span className="metric-plain">Quantum information units</span>
          </div>
          <div className="metric-value">{qubits}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Parallel States (2^N)</span>
            <span className="metric-plain">Simultaneous quantum amplitudes</span>
          </div>
          <div className="metric-value">{stateCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Classical RAM Needed</span>
            <span className="metric-plain">Memory for a normal computer to mimic</span>
          </div>
          <div className="metric-value">{classicalRam}</div>
        </div>
      </div>

      <div className="stage-grid">
        <div className="figure-frame">
          <div className="figure-canvas-wrap">
            <canvas
              ref={canvasRef}
              className="figure-canvas"
              aria-label="Classical sequential bits versus quantum superposition waves"
            />
          </div>
          <div className="figure-caption">
            <span>
              <strong>Figure 4.</strong> Sequential classical search versus parallel quantum wave interference.
            </span>
            <span>Target: {activeApp.targetMolecule}</span>
          </div>
        </div>

        <div className="control-card">
          <h3>Qubit Scale &amp; Real-World Chemistry</h3>
          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="qubit-slider" className="slider-label">
                Qubit Count (N)
                <span className="slider-sub">Doubles state space per step</span>
              </label>
              <span className="slider-readout">{qubits} qubits</span>
            </div>
            <input
              id="qubit-slider"
              type="range"
              min="2"
              max="50"
              step="1"
              value={qubits}
              onChange={(e) => setQubits(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="preset-row" role="group" aria-label="Quantum application domains" style={{ marginTop: 14 }}>
            {QUANTUM_APPS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`pill-btn ${appId === a.id ? 'active' : ''}`}
                onClick={() => setAppId(a.id)}
              >
                {a.name}
              </button>
            ))}
          </div>

          <p style={{ margin: '0 0 10px', color: 'var(--ink-secondary)', fontSize: '0.9rem' }}>
            <strong style={{ color: 'var(--ink)' }}>{activeApp.name}:</strong> {activeApp.summary}
          </p>
          <span className="term-pill">
            <code>{activeApp.term}</code> — {activeApp.termPlain}
          </span>
        </div>
      </div>

      <details className="methodology-drawer">
        <summary>Why nature is quantum &amp; simulation math (Quantum Supremacy)</summary>
        <div className="drawer-body">
          <p>
            In <em>Quantum Supremacy</em> (2023), Kaku highlights Richard Feynman&apos;s insight: because atoms obey quantum mechanics, simulating a complex molecule on a classical silicon computer requires exponentially growing memory (<code>16 * 2^N</code> bytes for <code>N</code> qubits).
          </p>
          <ul>
            <li><strong>50 Qubits (~18 Petabytes):</strong> Already surpasses the RAM of the world&apos;s largest supercomputers.</li>
            <li><strong>Drug Discovery &amp; Batteries:</strong> Algorithms like VQE (Variational Quantum Eigensolver) find lowest-energy electron configurations directly.</li>
            <li><strong>The Engineering Hurdle (Decoherence):</strong> Stray heat and vibration disturb qubits; scaling requires fault-tolerant error correction where many physical qubits protect each logical qubit.</li>
          </ul>
        </div>
      </details>
    </section>
  );
}
