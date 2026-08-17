import { useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { useAuth, ROLE_LABELS } from "../context/AuthContext";
import api from "../api/client";
import Avatar from "../components/Avatar";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const saveAvatar = async (file) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/auth/me/avatar", form);
      updateUser(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update photo");
    } finally {
      setBusy(false);
    }
  };

  const removeAvatar = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.delete("/auth/me/avatar");
      updateUser(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not remove photo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Account</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Profile</h1>
      </div>
      <div className="glass-card max-w-lg rounded-2xl p-6">
        <div className="mb-5 flex items-center gap-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="group relative"
            title="Change profile photo"
          >
            <Avatar user={user} size={88} className="ring-2 ring-white/10" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition group-hover:opacity-100">
              <Camera size={20} className="text-white" />
            </span>
          </button>
          <div>
            <p className="text-sm font-medium text-white">Profile photo</p>
            <p className="mt-0.5 text-xs text-zinc-500">JPEG, PNG, WEBP or GIF · up to 5MB</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="rounded-full bg-forest-500/20 px-3 py-1.5 text-xs text-forest-300 hover:bg-forest-500/30 disabled:opacity-50"
              >
                {busy ? "Saving…" : user?.avatar_url ? "Change photo" : "Add photo"}
              </button>
              {user?.avatar_url && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  disabled={busy}
                  className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-xs text-zinc-400 hover:text-red-300"
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            saveAvatar(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {error && <p className="mb-3 text-sm text-red-300">{error}</p>}
        <dl className="space-y-3 text-sm">
          <Row label="Name" value={user?.name} />
          <Row label="Email" value={user?.email} />
          <Row label="Role" value={ROLE_LABELS[user?.role] || user?.role} />
          <Row label="Joined" value={user?.created_at ? new Date(user.created_at).toLocaleString() : "—"} />
        </dl>
        <button onClick={logout} className="mt-6 rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-300">
          Sign out
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-2">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-white">{value}</dd>
    </div>
  );
}
