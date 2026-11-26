import React, { useEffect, useRef, useState } from 'react';
import { MIND_LEVELS, MIND_PILLARS } from '../data/kakuData.js';

export default function MindExplorer() {
  const [activeId, setActiveId] = useState('l3');
  const [gain, setGain] = useState(78);
  const canvasRef = useRef(null);

  const level = MIND_LEVELS.find((m) => m.id === activeId) || MIND_LEVELS[3];
  const effectiveDecode = Math.min(99, Math.round(level.decode * (0.55 + (gain / 100) * 0.52)));

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

      // Subtle oscilloscope grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw 3 neural wave channels (motor, memory, prediction)
      const channels = [
        { label: 'SENSORY LOOP', yOff: h * 0.28, color: '#93c5fd', mult: 1.0 },
        { label: 'MEMORY INDEX', yOff: h * 0.54, color: '#60a5fa', mult: 1.35 },
        { label: 'FUTURE MODEL', yOff: h * 0.80, color: '#e0f2fe', mult: 0.8 }
      ];

      const noiseScale = (100 - gain) * 0.14;
      const ampBase = 16 + (level.waveFreq * 1.4);

      channels.forEach((ch, idx) => {
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let x = 0; x < w; x += 3) {
          const nx = x / w;
          const wave =
            Math.sin(nx * Math.PI * 2 * level.waveFreq * ch.mult + phase + idx * 1.5) * ampBase * 0.65 +
            Math.sin(nx * Math.PI * 5 * level.waveFreq - phase * 1.4) * ampBase * level.waveChaos +
            (Math.sin(x * 0.7 + phase * 3 + idx) * noiseScale);
          const y = ch.yOff + wave;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = 'rgba(203, 213, 225, 0.8)';
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.fillText(ch.label, 12, ch.yOff - 22);
      });

      ctx.fillStyle = 'rgba(241, 245, 249, 0.92)';
      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.fillText(`${level.level.toUpperCase()}  |  DECODE FIDELITY ${effectiveDecode}%`, 12, 22);

      phase += 0.045;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [level, gain, effectiveDecode]);

  return (
    <section aria-label="Future of the Mind Explorer">
      <div className="section-head">
        <div>
          <h2 className="section-title">Future of the Mind</h2>
          <p className="section-lead">
            Michio Kaku defines consciousness by the number of feedback loops a system uses to model its world in space and time.
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Consciousness Tier</span>
            <span className="metric-plain">Kaku space-time hierarchy</span>
          </div>
          <div className="metric-value">{level.level}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">Time Horizon</span>
            <span className="metric-plain">How far ahead the mind simulates</span>
          </div>
          <div className="metric-value">{level.horizon}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">
            <span className="metric-term">BCI Decode Fidelity</span>
            <span className="metric-plain">Clarity of thought-to-machine readout</span>
          </div>
          <div className="metric-value">{effectiveDecode}%</div>
        </div>
      </div>

      <div className="stage-grid">
        <div className="figure-frame">
          <div className="figure-canvas-wrap">
            <canvas
              ref={canvasRef}
              className="figure-canvas"
              aria-label="Simulated neural feedback loop oscilloscope"
            />
          </div>
          <div className="figure-caption">
            <span>
              <strong>Figure 2.</strong> Multi-channel neural wave &amp; feedback loop readout.
            </span>
            <span>~{level.loops.toLocaleString()} feedback loops</span>
          </div>
        </div>

        <div className="control-card">
          <h3>Space-Time Consciousness Dial</h3>
          <div className="preset-row" role="group" aria-label="Consciousness levels">
            {MIND_LEVELS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`pill-btn ${activeId === m.id ? 'active' : ''}`}
                onClick={() => setActiveId(m.id)}
              >
                {m.level}: {m.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <p style={{ margin: '0 0 18px', color: 'var(--ink-secondary)', fontSize: '0.92rem' }}>
            <strong style={{ color: 'var(--ink)' }}>{level.name}:</strong> {level.summary}
          </p>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="bci-gain-slider" className="slider-label">
                Neural Sensor Clarity
                <span className="slider-sub">Signal-to-noise filter</span>
              </label>
              <span className="slider-readout">{gain}%</span>
            </div>
            <input
              id="bci-gain-slider"
              type="range"
              min="20"
              max="100"
              step="1"
              value={gain}
              onChange={(e) => setGain(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
      </div>

      <div className="card-grid-3">
        {MIND_PILLARS.map((card) => (
          <article key={card.title} className="editorial-card">
            <h4>{card.title}</h4>
            <p>{card.summary}</p>
            <span className="term-pill">
              <code>{card.term}</code> — {card.plain}
            </span>
          </article>
        ))}
      </div>

      <details className="methodology-drawer">
        <summary>Theory &amp; neuroscience notes (The Future of the Mind)</summary>
        <div className="drawer-body">
          <p>
            In <em>The Future of the Mind</em> (2014), Kaku proposes the Space-Time Theory of Consciousness: every unit of consciousness corresponds to a feedback loop tracking temperature, location, social cues, or future plans.
          </p>
          <ul>
            <li><strong>Brain-Machine Interfaces:</strong> Modern decoders map firing patterns in the motor cortex to cursor and robotic movement; non-invasive EEG trades spatial precision for safety.</li>
            <li><strong>Optogenetics (light-controlled neurons):</strong> Inserting light-sensitive proteins into target neurons lets researchers turn specific memory circuits on and off in animal models.</li>
            <li><strong>Hippocampal Prosthetics:</strong> Early clinical devices record neural spike codes during learning and replay them to assist patients with memory loss.</li>
          </ul>
        </div>
      </details>
    </section>
  );
}
