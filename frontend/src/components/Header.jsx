import { useState } from "react";
import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function Header({ onMenu }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white lg:hidden"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>
      <div className="hidden min-w-0 flex-1 lg:block" />

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-black/20 py-1 pl-1 pr-2 text-white backdrop-blur sm:pr-3"
        >
          <span className="overflow-hidden rounded-full">
            <Avatar user={user} size={32} />
          </span>
          <span className="hidden max-w-[9rem] truncate text-sm font-medium sm:inline">
            {user?.name?.split(" ")[0] || "User"}
          </span>
          <ChevronDown size={14} className="hidden text-zinc-300 sm:block" />
        </button>
        {open && user && (
          <div className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#101a14] py-1 shadow-xl">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
            >
              <UserRound size={15} /> Profile
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-300 hover:bg-white/5"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
