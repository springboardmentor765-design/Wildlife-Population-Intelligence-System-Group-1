import { Leaf } from 'lucide-react';

/**
 * Split auth layout. The left panel carries a field-notebook species list —
 * the platform's actual subject matter, rather than stock marketing copy.
 */
const LEDGER = [
  { t: '05:45', s: 'Buceros bicornis', c: '0.96', m: 'acoustic' },
  { t: '17:40', s: 'Bos gaurus', c: '0.95', m: 'camera' },
  { t: '19:05', s: 'Elephas maximus', c: '0.98', m: 'camera' },
  { t: '21:14', s: 'Panthera tigris', c: '0.97', m: 'camera' },
  { t: '23:11', s: 'Nasikabatrachus sahyadrensis', c: '0.79', m: 'acoustic' },
];

export function AuthShell({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden flex-col justify-between bg-canopy-900 p-10 text-sand-100 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-moss-500">
            <Leaf size={18} className="text-white" />
          </span>
          <span className="font-display text-lg text-white">Wildlife Population Intelligence</span>
        </div>

        <div className="max-w-lg">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-300">
            Nilgiri–Anamalai landscape · last 24 hours
          </p>
          <h2 className="mt-4 font-display text-[38px] leading-[1.15] text-white">
            Every call, every capture, counted.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-sand-200/75">
            Camera traps, acoustic sensors and drone surveys feed one record of what lives here — and
            what is quietly disappearing.
          </p>

          <ul className="mt-8 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
            {LEDGER.map((r) => (
              <li key={r.s} className="flex items-center gap-4 px-4 py-3 font-mono text-[12px]">
                <span className="text-sand-300/60">{r.t}</span>
                <span className="binomial flex-1 truncate text-[13px] not-italic text-sand-100">
                  <em className="italic">{r.s}</em>
                </span>
                <span className="text-moss-300">{r.c}</span>
                <span className="text-sand-300/50">{r.m}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-[11px] text-sand-300/40">
          Demo environment · detections are model estimates
        </p>
      </div>

      <div className="flex items-center justify-center bg-sand-50 px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
