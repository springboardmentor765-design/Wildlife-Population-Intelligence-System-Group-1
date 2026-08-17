import { useEffect, useState } from "react";
import api from "../api/client";
import { ROLE_LABELS } from "../auth/access";

const ROLES = Object.keys(ROLE_LABELS);

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () =>
    api
      .get("/admin/overview")
      .then((r) => setRows(r.data.accounts || []))
      .catch((err) => setError(err.response?.data?.detail || "Could not load users"));

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (userId, role) => {
    setBusyId(userId);
    setError("");
    try {
      await api.patch(`/users/${userId}`, { role });
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update role");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="page">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Administration</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Users</h1>
        <p className="text-sm text-zinc-400">Monitor every account and assign researcher, officer, forest, or admin access.</p>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/[0.03] text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Sign-in</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Images</th>
              <th className="px-4 py-3 font-medium">Audio</th>
              <th className="px-4 py-3 font-medium">Surveys</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.user_id} className="border-t border-white/5 text-zinc-200">
                <td className="px-4 py-3">
                  <div className="text-white">{u.name}</div>
                  <div className="text-xs text-zinc-500">{u.email}</div>
                </td>
                <td className="px-4 py-3 capitalize text-zinc-400">{u.auth_provider || "local"}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    disabled={busyId === u.user_id}
                    onChange={(e) => changeRole(u.user_id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-sm text-white outline-none"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role} className="bg-[#101a14]">
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">{u.image_count}</td>
                <td className="px-4 py-3">{u.audio_count}</td>
                <td className="px-4 py-3">{u.survey_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
