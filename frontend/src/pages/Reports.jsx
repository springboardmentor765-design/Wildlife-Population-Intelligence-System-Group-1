import { useEffect, useState } from "react";
import api from "../api/client";

export default function Reports() {
  const [report, setReport] = useState(null);
  useEffect(() => {
    api.get("/reports/summary").then((r) => setReport(r.data));
  }, []);
  if (!report) return null;

  const printReport = () => window.print();

  return (
    <div className="page">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Export</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">{report.title}</h1>
        </div>
        <button onClick={printReport} className="rounded-full bg-forest-500 px-4 py-2 text-sm font-semibold text-white">
          Print / PDF
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card label="Species" value={report.stats.species} />
        <Card label="Observations" value={report.stats.total_observations} />
        <Card label="Health score" value={report.health.overall} />
      </div>
      <div className="glass-card rounded-2xl p-5">
        <h2 className="mb-3 text-sm font-semibold text-white">Priority actions</h2>
        <ul className="space-y-2 text-sm text-zinc-300">
          {report.conservation.slice(0, 6).map((c) => (
            <li key={c.species}>• {c.species}: {c.recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="text-3xl font-semibold text-white">{value}</div>
      <div className="text-sm text-zinc-400">{label}</div>
    </div>
  );
}
