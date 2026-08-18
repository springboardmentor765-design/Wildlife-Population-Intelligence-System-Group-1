import { NavLink, Link, useLocation } from "react-router-dom";
import { Leaf, ChevronDown, X } from "lucide-react";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { ROLE_BLURB, ROLE_LABELS, navFor } from "../auth/access";

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const nav = navFor(user?.role);

  const linkClass = (active) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
      active
        ? "bg-forest-500/20 text-white shadow-[inset_0_0_0_1px_rgba(34,197,94,0.35)]"
        : "text-zinc-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside
      className={`glass-sidebar fixed inset-y-0 left-0 z-40 flex h-full w-[min(280px,86vw)] shrink-0 flex-col px-4 py-5 transition-transform duration-200 lg:static lg:w-[260px] lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-8 flex items-center justify-between gap-3 px-1">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl transition hover:opacity-90"
          aria-label="Go to dashboard"
        >
          <Logo size={42} />
          <div className="leading-tight">
            <div className="text-[17px] font-semibold text-white">Wildlife</div>
            <div className="text-[17px] font-semibold text-forest-500">Intelligence</div>
          </div>
        </Link>
        <button
          type="button"
          className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.18em] text-zinc-500">MAIN</p>
      <nav className="space-y-1">
        {nav.main.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <NavLink key={to} to={to} className={linkClass(active)} onClick={onClose}>
              <Icon size={18} className={active ? "text-forest-400" : ""} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <p className="mb-2 mt-6 px-3 text-[11px] font-semibold tracking-[0.18em] text-zinc-500">INTELLIGENCE</p>
          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
            {nav.intel.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => linkClass(isActive)} onClick={onClose}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

      <div className="mt-auto space-y-4 pt-4">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2 text-forest-400">
            <Leaf size={16} />
            <span className="text-sm font-semibold">Our Mission</span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            Empowering conservation through AI-driven insights and data intelligence.
          </p>
          <p className="mt-2 text-xs text-zinc-500">{ROLE_BLURB[user?.role]}</p>
        </div>

        <NavLink to="/profile" onClick={onClose} className="flex items-center gap-3 rounded-xl px-1 py-2 hover:bg-white/5">
          <Avatar user={user} size={40} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white">{user?.name || "User"}</div>
            <div className="truncate text-xs text-zinc-500">
              {user ? ROLE_LABELS[user.role] || user.role : "Wildlife Researcher"}
            </div>
          </div>
          <ChevronDown size={16} className="text-zinc-500" />
        </NavLink>
      </div>
    </aside>
  );
}
