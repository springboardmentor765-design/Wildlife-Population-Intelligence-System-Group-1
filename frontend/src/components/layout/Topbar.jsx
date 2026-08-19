import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../utils/constants';
import { initials } from '../../utils/format';

export function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);
  const [query, setQuery] = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', onClick);

    return () => {
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();

    if (query.trim()) {
      navigate(`/species?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur border-b border-sand-200 flex items-center gap-3 px-4 sm:px-6">

      <button
        onClick={onMenu}
        className="p-2 -ml-2 rounded-lg text-ink-700 hover:bg-sand-100 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <form
        onSubmit={submitSearch}
        className="relative flex-1 max-w-md"
      >
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search species, sites or survey IDs"
          className="w-full rounded-lg border border-sand-200 bg-sand-50 py-2 pl-9 pr-3 text-sm placeholder:text-ink-500/70 focus:border-moss-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-moss-100"
        />
      </form>

      <div
        ref={wrapRef}
        className="ml-auto flex items-center gap-1.5"
      >

        {/* User menu */}
        <div className="relative">

          <button
            onClick={() =>
              setOpenMenu((m) =>
                m === 'user' ? null : 'user'
              )
            }
            className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2.5 hover:bg-sand-100"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-moss-500 text-[13px] font-semibold text-white">
              {initials(user?.name)}
            </span>

            <span className="hidden text-left sm:block">
              <span className="block text-[13px] font-medium leading-tight text-ink-900">
                {user?.name}
              </span>

              <span className="block text-[11px] text-ink-500">
                {ROLE_LABELS[user?.role]}
              </span>
            </span>
          </button>

          {openMenu === 'user' && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-sand-200 bg-white shadow-lift animate-fade-up overflow-hidden">

              <Link
                to="/profile"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-700 hover:bg-sand-50"
              >
                <User size={16} />
                Your profile
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex w-full items-center gap-2.5 border-t border-sand-100 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Sign out
              </button>

            </div>
          )}

        </div>
      </div>
    </header>
  );
}