import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { alertService } from '../../services/alertService';
import { ROLE_LABELS } from '../../utils/constants';
import { initials, timeAgo } from '../../utils/format';
import { clsx } from '../../utils/cn';

export function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [openMenu, setOpenMenu] = useState(null); // 'bell' | 'user' | null
  const [query, setQuery] = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    alertService.list({ unreadOnly: true }).then(setAlerts).catch(() => setAlerts([]));
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/species?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur border-b border-sand-200 flex items-center gap-3 px-4 sm:px-6">
      <button onClick={onMenu} className="p-2 -ml-2 rounded-lg text-ink-700 hover:bg-sand-100 lg:hidden" aria-label="Open navigation">
        <Menu size={20} />
      </button>

      <form onSubmit={submitSearch} className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search species, sites or survey IDs"
          className="w-full rounded-lg border border-sand-200 bg-sand-50 py-2 pl-9 pr-3 text-sm placeholder:text-ink-500/70 focus:border-moss-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-moss-100"
        />
      </form>

      <div ref={wrapRef} className="ml-auto flex items-center gap-1.5">
        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === 'bell' ? null : 'bell'))}
            className="relative p-2.5 rounded-lg text-ink-700 hover:bg-sand-100"
            aria-label={`Alerts, ${alerts.length} unread`}
          >
            <Bell size={19} />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-clay-500 px-1 text-[10px] font-bold text-white">
                {alerts.length}
              </span>
            )}
          </button>

          {openMenu === 'bell' && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-sand-200 bg-white shadow-lift animate-fade-up overflow-hidden">
              <div className="px-4 py-3 border-b border-sand-200">
                <p className="font-display text-[15px]">Unread alerts</p>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {alerts.length === 0 && (
                  <li className="px-4 py-6 text-sm text-ink-500 text-center">Nothing needs your attention.</li>
                )}
                {alerts.map((a) => (
                  <li key={a.id} className="border-b border-sand-100 last:border-0">
                    <Link to="/alerts" onClick={() => setOpenMenu(null)} className="block px-4 py-3 hover:bg-sand-50">
                      <div className="flex items-start gap-2">
                        <span
                          className={clsx(
                            'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                            a.severity === 'critical' ? 'bg-red-500' : a.severity === 'high' ? 'bg-clay-500' : 'bg-moss-400'
                          )}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink-900 leading-snug">{a.title}</p>
                          <p className="text-xs text-ink-500 mt-0.5">{a.site} · {timeAgo(a.at)}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/alerts" onClick={() => setOpenMenu(null)} className="block px-4 py-3 text-center text-sm font-medium text-moss-600 bg-sand-50 hover:bg-sand-100">
                View all alerts
              </Link>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === 'user' ? null : 'user'))}
            className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2.5 hover:bg-sand-100"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-moss-500 text-[13px] font-semibold text-white">
              {initials(user?.name)}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[13px] font-medium leading-tight text-ink-900">{user?.name}</span>
              <span className="block text-[11px] text-ink-500">{ROLE_LABELS[user?.role]}</span>
            </span>
          </button>

          {openMenu === 'user' && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-sand-200 bg-white shadow-lift animate-fade-up overflow-hidden">
              <Link to="/profile" onClick={() => setOpenMenu(null)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-700 hover:bg-sand-50">
                <User size={16} /> Your profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex w-full items-center gap-2.5 border-t border-sand-100 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
