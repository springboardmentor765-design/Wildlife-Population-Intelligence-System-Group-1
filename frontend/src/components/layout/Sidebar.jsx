import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Camera, AudioLines, Bird, TrendingUp, Leaf,
Lightbulb, FileText, Users, X,
} from 'lucide-react';
import { clsx } from '../../utils/cn';
import { ROLES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { section: 'Overview', items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }] },
  {
    section: 'Field data',
    items: [
      { to: '/camera-traps', label: 'Camera trap images', icon: Camera },
      { to: '/bioacoustics', label: 'Bioacoustics', icon: AudioLines },
      { to: '/species', label: 'Species explorer', icon: Bird },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { to: '/population', label: 'Population analytics', icon: TrendingUp },
      { to: '/recommendations', label: 'Recommendations', icon: Lightbulb, roles: [ROLES.CONSERVATION, ROLES.FOREST, ROLES.ADMIN, ROLES.RESEARCHER] },
    ],
  },
  {
    section: 'Operations',
    items: [
      { to: '/reports', label: 'Reports', icon: FileText },
      { to: '/admin', label: 'Administration', icon: Users, roles: [ROLES.ADMIN] },
    ],
  },
];

export function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  const visible = NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.roles || i.roles.includes(user?.role)),
  })).filter((g) => g.items.length);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-canopy-950/50 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-[264px] bg-canopy-900 text-sand-100 flex flex-col',
          'transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-moss-500">
              <Leaf size={18} className="text-white" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[15px] leading-tight text-white truncate">Wildlife Intelligence</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-moss-300">WPIS v1.0</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-sand-300 hover:bg-white/10 lg:hidden" aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {visible.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sand-300/50">
                {group.section}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                          isActive
                            ? 'bg-moss-500/90 text-white font-medium'
                            : 'text-sand-200/80 hover:bg-white/10 hover:text-white'
                        )
                      }
                    >
                      <item.icon size={17} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-[11px] leading-relaxed text-sand-300/60">
            Detections are model estimates. Confirm rare and endangered records before publication.
          </p>
        </div>
      </aside>
    </>
  );
}
