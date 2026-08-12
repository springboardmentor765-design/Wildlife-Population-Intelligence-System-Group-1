import { clsx } from '../../utils/cn';

/**
 * Amplitude envelope with detection regions overlaid. Doubles as the seek bar:
 * clicking anywhere scrubs the player to that position.
 */
export function Waveform({ data = [], duration, position = 0, detections = [], onSeek, activeId }) {
  const playedIdx = Math.floor((position / (duration || 1)) * data.length);

  return (
    <div className="relative">
      <div
        className="relative flex h-32 items-center gap-[2px] rounded-xl bg-canopy-900 px-3 cursor-pointer overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onSeek?.(((e.clientX - rect.left) / rect.width) * duration);
        }}
        role="slider"
        tabIndex={0}
        aria-label="Seek recording"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
      >
        {/* Detection regions sit behind the bars */}
        {detections.map((d) => (
          <span
            key={d.id}
            className={clsx(
              'absolute inset-y-0 border-x transition-colors',
              d.id === activeId ? 'bg-moss-400/30 border-moss-300' : 'bg-moss-400/12 border-moss-400/30'
            )}
            style={{
              left: `${(d.start / duration) * 100}%`,
              width: `${((d.end - d.start) / duration) * 100}%`,
            }}
          />
        ))}

        {data.map((v, i) => (
          <span
            key={i}
            className={clsx('relative flex-1 rounded-full', i <= playedIdx ? 'bg-moss-300' : 'bg-moss-400/35')}
            style={{ height: `${Math.max(4, v * 96)}%` }}
          />
        ))}

        <span
          className="absolute inset-y-0 w-px bg-clay-300"
          style={{ left: `${(position / (duration || 1)) * 100}%` }}
        />
      </div>

      {/* Frequency-band strip standing in for the spectrogram */}
      <div className="mt-2 grid grid-cols-1 gap-1">
        <div className="flex h-16 gap-[2px] rounded-xl bg-canopy-950 p-1.5 overflow-hidden">
          {data.map((v, i) => (
            <span key={i} className="flex flex-1 flex-col-reverse gap-[1px]">
              {[0.9, 0.65, 0.4, 0.2].map((band, b) => (
                <span
                  key={b}
                  className="flex-1 rounded-[1px]"
                  style={{
                    backgroundColor: '#4E9E7A',
                    opacity: Math.max(0.06, Math.min(0.95, v * band * (1 + Math.sin(i / 4 + b)) * 0.7)),
                  }}
                />
              ))}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-ink-500">
          Spectrogram preview · 0–12 kHz · rendered from the analysed envelope
        </p>
      </div>
    </div>
  );
}
