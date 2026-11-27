import { useEffect, useState } from 'react';

function getGrainAnalogy(square: number): string {
  if (square <= 5) return 'A pinch of rice in the palm of your hand.';
  if (square <= 12) return 'Roughly a bowl of rice (hundreds to a few thousand grains).';
  if (square <= 20) return 'Several kitchen sacks (~10 kg at square 20).';
  if (square <= 26) return 'A full shipping truck of grain.';
  if (square <= 32)
    return 'Entire first half: ~4 billion grains (~100 metric tons)—large, yet still ordinary.';
  if (square === 33)
    return 'Square 33 begins the second half: more than all 32 previous squares combined.';
  if (square <= 40) return 'Millions of metric tons—matching a major country’s harvest.';
  if (square <= 48) return 'Exceeds annual global grain production many times over.';
  if (square <= 56) return 'A pile of grain larger than Mount Everest.';
  return 'Roughly 9.2 quintillion grains on square 64 alone—thousands of years of global harvests.';
}

function formatBigIntGrains(square: number): string {
  const grains = 1n << BigInt(square - 1);
  if (square <= 40) {
    return grains.toLocaleString('en-US');
  }
  const str = grains.toString();
  const exp = str.length - 1;
  const lead = `${str[0]}.${str.slice(1, 3)}`;
  return `${lead} × 10^${exp}`;
}

export function ChessboardSection() {
  const [square, setSquare] = useState<number>(33);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [doublingYears, setDoublingYears] = useState<number>(1.5);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setSquare((sq) => {
        if (sq >= 64) {
          setIsPlaying(false);
          return 64;
        }
        return sq + 1;
      });
    }, 110);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!isPlaying && square >= 64) {
      setSquare(1);
    }
    setIsPlaying((p) => !p);
  };

  const isSecondHalf = square >= 33;
  const squareYear = Math.round(1958 + (square - 1) * doublingYears);
  const secondHalfYear = Math.round(1958 + 32 * doublingYears);
  const linearExpectation = square * 1000;
  // Log10 comparison bars (max 19.0 for 2^63)
  const expLog = (square - 1) * Math.log10(2);
  const linLog = Math.log10(linearExpectation);
  const expPct = Math.max(3, Math.min(100, (expLog / 19) * 100));
  const linPct = Math.max(3, Math.min(100, (linLog / 19) * 100));

  return (
    <div className="section-stack">
      <section className="panel" aria-label="Playable 64-square chessboard explorer">
        <div className="panel-header">
          <div className="panel-header-text">
            <h2>The Second Half of the Chessboard</h2>
            <p className="panel-lead">
              Double 1 grain of rice on each square. Click any square or press Play to feel why
              square 33 breaks linear intuition.
            </p>
          </div>
          <div className="panel-actions">
            <button type="button" className="btn btn-primary" onClick={togglePlay}>
              {isPlaying ? 'Pause' : square >= 64 ? 'Replay 1–64' : 'Play Doubling'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setIsPlaying(false);
                setSquare(33);
              }}
            >
              Jump to Sq 33
            </button>
          </div>
        </div>

        <div className="chess-layout">
          <div>
            <div className="chess-grid" role="grid" aria-label="64-square chessboard">
              {Array.from({ length: 64 }, (_, idx) => {
                const sq = idx + 1;
                const row = Math.floor(idx / 8);
                const col = idx % 8;
                const isDark = (row + col) % 2 === 1;
                const isCurrent = sq === square;
                const isFilled = sq < square;
                const classes = [
                  'chess-cell',
                  isDark ? 'dark' : '',
                  isFilled ? (sq >= 33 ? 'filled-second' : 'filled-first') : '',
                  isCurrent ? 'current' : '',
                  isCurrent && isSecondHalf ? 'second-half' : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <button
                    key={sq}
                    type="button"
                    className={classes}
                    aria-label={`Square ${sq}`}
                    onClick={() => {
                      setIsPlaying(false);
                      setSquare(sq);
                    }}
                  >
                    {isCurrent ? sq : ''}
                  </button>
                );
              })}
            </div>
            <p className="footnote" style={{ marginTop: 8 }}>
              Light blue: squares 1–32. Deep blue / ink: squares 33–64 (second half).
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
            <div className="slider-group">
              <div className="slider-header">
                <label htmlFor="chess-slider" className="slider-label">
                  Selected square
                </label>
                <span className="slider-value">
                  Square {square} / 64 {isSecondHalf ? '· Second half' : '· First half'}
                </span>
              </div>
              <input
                id="chess-slider"
                type="range"
                min={1}
                max={64}
                step={1}
                value={square}
                onChange={(e) => {
                  setIsPlaying(false);
                  setSquare(Number(e.target.value));
                }}
              />
            </div>

            <div className="metric-strip">
              <div className="metric-box highlight">
                <span className="detail-item-label">Exponential (2^{square - 1})</span>
                <span className="metric-big">{formatBigIntGrains(square)}</span>
              </div>
              <div className="metric-box">
                <span className="detail-item-label">Linear (1,000 / step)</span>
                <span className="metric-big">{linearExpectation.toLocaleString()}</span>
              </div>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label htmlFor="chess-doubling" className="slider-label">
                  Map squares to years: doubling every
                </label>
                <span className="slider-value">
                  {doublingYears.toFixed(1)} yrs from 1958 → square {square} ≈ {squareYear}
                </span>
              </div>
              <input
                id="chess-doubling"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={doublingYears}
                onChange={(e) => setDoublingYears(Number(e.target.value))}
              />
              <span className="footnote">
                Starting at the first integrated circuit (1958), square 33 lands in {secondHalfYear}.
              </span>
            </div>

            {/* Live log-scale divergence bar */}
            <div className="panel-subtle" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="scale-row-top">
                <span className="detail-item-label">Exponential vs. Linear (log10 scale)</span>
                <span className="mono-label">10^{expLog.toFixed(1)} vs 10^{linLog.toFixed(1)}</span>
              </div>
              <div className="scale-track" aria-hidden="true">
                <div className="scale-fill" style={{ width: `${expPct}%` }} />
              </div>
              <div className="scale-track" aria-hidden="true">
                <div className="scale-fill muted" style={{ width: `${linPct}%` }} />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-secondary)', marginTop: 2 }}>
                {getGrainAnalogy(square)}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
