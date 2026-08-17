import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../api/client";

const COLORS = ["#22c55e", "#38bdf8", "#f59e0b", "#a78bfa", "#f43f5e", "#14b8a6"];

export default function Population() {
  const [trends, setTrends] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/population/trends").then((r) => setTrends(r.data.series));
    api.get("/population").then((r) => setRows(r.data.slice(0, 20)));
  }, []);

  const chart = buildMultiSeries(trends.slice(0, 5));

  return (
    <div className="page">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Estimation</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Population intelligence</h1>
        <p className="text-sm text-zinc-400">
          Daily totals from camera-trap images and audio analysis — not generated sample counts.
        </p>
      </div>
      <div className="glass-card rounded-2xl p-5">
        {trends.length === 0 ? (
          <p className="py-20 text-center text-sm text-zinc-500">
            Analyze a camera-trap image or audio clip to see live field counts.
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0f1a14", border: "1px solid #1f2a22" }} />
                <Legend />
                {trends.slice(0, 5).map((s, i) => (
                  <Line key={s.species} type="monotone" dataKey={s.species} stroke={COLORS[i]} dot={false} strokeWidth={2} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {trends.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {trends.map((t) => (
            <div key={t.species} className="glass-card flex items-center justify-between rounded-xl px-4 py-3">
              <div>
                <div className="text-sm text-white">{t.species}</div>
                <div className="text-xs capitalize text-zinc-500">{t.trend}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-white">{t.latest}</div>
                <div className={`text-xs ${t.percent_change < 0 ? "text-red-400" : "text-forest-400"}`}>
                  {t.percent_change > 0 ? "+" : ""}
                  {t.percent_change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-white/[0.03] text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Species</th>
              <th className="px-4 py-3 font-medium">Count</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.population_id} className="border-t border-white/5">
                <td className="px-4 py-3">{r.species?.common_name}</td>
                <td className="px-4 py-3">{r.population_count}</td>
                <td className="px-4 py-3 text-zinc-400">{r.observation_date}</td>
                <td className="px-4 py-3 text-zinc-500">{r.image_id ? "Image" : r.audio_id ? "Audio" : "Manual"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  No field counts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function buildMultiSeries(series) {
  const dates = new Set();
  series.forEach((s) => s.points.forEach((p) => dates.add(p.date)));
  return [...dates].sort().map((date) => {
    const row = { date: date.slice(5) };
    series.forEach((s) => {
      const pt = s.points.find((p) => p.date === date);
      row[s.species] = pt ? pt.count : null;
    });
    return row;
  });
}
