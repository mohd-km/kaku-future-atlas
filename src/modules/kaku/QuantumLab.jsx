import React, { useEffect, useMemo, useRef, useState } from 'react';

// Classical memory budgets for brute-force state-vector simulation (16 bytes per complex amplitude)
const MACHINES = [
  { id: 'laptop', label: 'Laptop · 16 GB', bytes: 16e9 },
  { id: 'server', label: 'Server · 2 TB', bytes: 2e12 },
  { id: 'exa', label: 'Exascale · ~10 PB', bytes: 1e16 },
];

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
  const [machineId, setMachineId] = useState('server');
  const canvasRef = useRef(null);

  const machine = MACHINES.find((m) => m.id === machineId) || MACHINES[1];
  const maxQubits = Math.floor(Math.log2(machine.bytes / 16));
  const fits = qubits <= maxQubits;
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
    <section aria-label="Qubits versus classical memory explorer">
      <div className="section-head">
        <div>
          <h2 className="section-title">the qubit wall: why quantum computers are hard to copy</h2>
          <p className="section-lead">
            A qubit (quantum bit) can hold a mix of 0 and 1 at once. To imitate N qubits, a normal computer must store 2^N numbers, 16 bytes each, so memory doubles with every qubit added: 50 qubits already need about 18 petabytes.
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Qubits (N)</span>
            <span className="metric-plain">Error-corrected quantum bits</span>
          </div>
          <div className="metric-value">{qubits}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Possibilities held at once (2^N)</span>
            <span className="metric-plain">Numbers a normal computer must track</span>
          </div>
          <div className="metric-value">{stateCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Normal-computer memory needed (RAM)</span>
            <span className="metric-plain">{fits ? `fits on ${machine.label.split(' ·')[0].toLowerCase()}` : `exceeds ${machine.label.split(' ·')[0].toLowerCase()} (max ${maxQubits} qubits)`}</span>
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
            <span>Classical bits vs quantum amplitudes</span>
            <span>{fits ? 'classically simulable' : 'beyond brute-force simulation'}</span>
          </div>
        </div>

        <div className="control-card">
          <h3>Qubits vs classical memory</h3>
          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="qubit-slider" className="slider-label">
                Qubit Count (N)
                <span className="slider-sub">Each step doubles the state space</span>
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

          <div className="preset-row" role="group" aria-label="Classical machine" style={{ marginTop: 14 }}>
            {MACHINES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`pill-btn ${machineId === m.id ? 'active' : ''}`}
                onClick={() => setMachineId(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className={`qubit-verdict ${fits ? 'ok' : 'no'}`}>
            {fits
              ? `${qubits} qubits fit: ${classicalRam} of ${machine.label.split('· ')[1]}.`
              : `${qubits} qubits need ${classicalRam}, but ${machine.label.split(' ·')[0]} tops out at ${maxQubits}.`}
          </div>
        </div>
      </div>


    </section>
  );
}
