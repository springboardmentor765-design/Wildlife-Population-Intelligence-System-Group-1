import { healthBand } from '../../utils/format';

/**
 * Weighted ecosystem health dial. The ring is a 270° sweep opening at the
 * bottom; the four ticks mark the band thresholds (40 / 55 / 70 / 85) so the
 * reading is legible without a separate key.
 */
export function HealthGauge({ score = 0, size = 260, thickness = 18 }) {
  const band = healthBand(score);
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const SWEEP = 0.75; // 270 of 360 degrees
  const track = circumference * SWEEP;
  const filled = track * (Math.max(0, Math.min(100, score)) / 100);
  const cx = size / 2;

  const tick = (t) => {
    const rad = ((-225 + (t / 100) * 270) * Math.PI) / 180;
    const inner = r - thickness / 2 + 3;
    const outer = r + thickness / 2 - 3;
    return {
      x1: cx + Math.cos(rad) * inner, y1: cx + Math.sin(rad) * inner,
      x2: cx + Math.cos(rad) * outer, y2: cx + Math.sin(rad) * outer,
    };
  };

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img" aria-label={`Ecosystem health score ${score} out of 100, ${band.label}`}>
        <g transform={`rotate(135 ${cx} ${cx})`}>
          <circle
            cx={cx} cy={cx} r={r} fill="none" stroke="#E7E1D5"
            strokeWidth={thickness} strokeLinecap="round"
            strokeDasharray={`${track} ${circumference}`}
          />
          <circle
            cx={cx} cy={cx} r={r} fill="none" stroke={band.color}
            strokeWidth={thickness} strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            style={{ transition: 'stroke-dasharray 900ms cubic-bezier(0.16,1,0.3,1)' }}
          />
        </g>
        {[40, 55, 70, 85].map((t) => {
          const l = tick(t);
          return (
            <line
              key={t} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke="#FBFAF7" strokeWidth="2" strokeLinecap="round" opacity="0.9"
            />
          );
        })}
      </svg>

      <div className="absolute text-center">
        <p className="eyebrow">Ecosystem health</p>
        <p className="font-display text-6xl leading-none text-ink-900 tabular-nums mt-1">{score}</p>
        <p className="text-xs text-ink-500 mt-1">out of 100</p>
        <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ring-inset ${band.chip}`}>
          {band.label}
        </span>
      </div>
    </div>
  );
}
