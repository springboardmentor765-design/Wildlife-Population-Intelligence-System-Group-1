import { useEffect, useState } from "react";
import api from "../api/client";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const load = () => api.get("/alerts").then((r) => setAlerts(r.data));
  useEffect(() => {
    load();
  }, []);

  const mark = async (id) => {
    await api.post(`/alerts/${id}/read`);
    load();
  };

  return (
    <div className="page">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Notifications</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Alerts</h1>
      </div>
      <div className="space-y-3">
        {alerts.map((a) => (
          <button
            key={a.alert_id}
            type="button"
            onClick={() => mark(a.alert_id)}
            className={`glass-card w-full rounded-2xl p-4 text-left ${a.is_read ? "opacity-60" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">{a.title}</div>
              <span className="text-xs capitalize text-zinc-500">{a.severity}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{a.message}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
