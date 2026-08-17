import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import api from "../api/client";

export default function AudioAnalysis() {
  const [clips, setClips] = useState([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [ml, setMl] = useState(null);
  const [drag, setDrag] = useState(false);

  const load = () => api.get("/audio").then((r) => setClips(r.data));
  useEffect(() => {
    load();
    api.get("/ml/status").then((r) => setMl(r.data.audio)).catch(() => {});
  }, []);

  const analyzeFile = async (file) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const uploaded = await api.post("/audio/upload", form);
      const analyzed = await api.post(`/audio/${uploaded.data.audio_id}/analyze`);
      setResult(analyzed.data);
      load();
      api.get("/ml/status").then((r) => setMl(r.data.audio)).catch(() => {});
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const removeClip = async (audioId) => {
    try {
      await api.delete(`/audio/${audioId}`);
      setClips((prev) => prev.filter((c) => c.audio_id !== audioId));
      setResult((prev) => (prev?.audio_id === audioId ? null : prev));
    } catch (err) {
      setError(err.response?.data?.detail || "Could not delete recording");
    }
  };

  const wave = (result?.spectrogram_peaks || []).map((v, i) => ({ i, v }));

  return (
    <div className="page">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Bioacoustics</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Audio Analysis</h1>
          <p className="text-sm text-zinc-400">
            AST voice model uses <code className="text-zinc-300">ml_models/audio/labels.json</code> (your 35 classes).
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-right text-xs">
          <div className={ml?.loaded ? "text-forest-400" : "text-amber-300"}>
            {ml?.loaded ? "Trained model loaded" : "Demo inference"}
          </div>
          <div className="max-w-[220px] text-zinc-500">
            {ml?.loaded ? ml.backend : ml?.error || "Put weights in backend/ml_models/audio/"}
          </div>
        </div>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          analyzeFile(e.dataTransfer.files?.[0]);
        }}
        className={`glass-card flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed py-12 ${
          drag ? "border-forest-400 bg-forest-500/10" : "border-white/10"
        }`}
      >
        <Upload className="mb-3 text-forest-400" />
        <span className="text-sm font-medium text-white">
          {busy ? "Analyzing..." : "Upload a field recording"}
        </span>
        <span className="mt-1 text-xs text-zinc-500">WAV, MP3, OGG · max 30MB</span>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            analyzeFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}

      {result && (
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white">Call identified</h2>
          <p className="mt-2 text-lg text-forest-400">{result.species_common_name}</p>
          <p className="text-sm italic text-zinc-400">{result.scientific_name}</p>
          <p className="mt-2 text-sm text-zinc-300">
            {(result.confidence * 100).toFixed(1)}% · {result.duration}s · {result.model || "demo"}
          </p>
          {result.top_predictions?.length > 1 && (
            <ul className="mt-3 space-y-1 text-xs text-zinc-400">
              {result.top_predictions.map((p) => (
                <li key={p.scientific_name} className="flex justify-between gap-3">
                  <span>{p.label}</span>
                  <span className="text-forest-400">{(p.confidence * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wave}>
                <Area type="monotone" dataKey="v" stroke="#22c55e" fill="#22c55e33" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {clips.map((c) => (
          <div key={c.audio_id} className="glass-card flex items-center justify-between rounded-xl px-4 py-3 text-sm">
            <div>
              <div className="text-white">{c.species?.common_name || "Pending analysis"}</div>
              <div className="text-xs text-zinc-500">
                {c.duration ? `${c.duration}s` : "—"} · {new Date(c.uploaded_at).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-forest-400">{c.confidence != null ? `${(c.confidence * 100).toFixed(0)}%` : ""}</span>
              <button
                type="button"
                onClick={() => removeClip(c.audio_id)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/15 hover:text-red-300"
                title="Remove this prediction"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
