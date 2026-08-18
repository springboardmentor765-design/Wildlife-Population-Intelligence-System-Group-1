import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import api from "../api/client";

function mediaUrl(path) {
  return `/static/${(path || "").replace(/^uploads\//, "")}`;
}

export default function ImageAnalysis() {
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [ml, setMl] = useState(null);
  const [drag, setDrag] = useState(false);

  const load = () => api.get("/images").then((r) => setImages(r.data));
  useEffect(() => {
    load();
    api.get("/ml/status").then((r) => setMl(r.data.image)).catch(() => {});
  }, []);

  const analyzeFile = async (file) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const uploaded = await api.post("/images/upload", form);
      const analyzed = await api.post(`/images/${uploaded.data.image_id}/analyze`);
      setResult({ ...analyzed.data, image_path: uploaded.data.image_path });
      load();
      api.get("/ml/status").then((r) => setMl(r.data.image)).catch(() => {});
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const removeImage = async (imageId) => {
    try {
      await api.delete(`/images/${imageId}`);
      setImages((prev) => prev.filter((img) => img.image_id !== imageId));
      setResult((prev) => (prev?.image_id === imageId ? null : prev));
    } catch (err) {
      setError(err.response?.data?.detail || "Could not delete image");
    }
  };

  return (
    <div className="page">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Computer vision</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Image Analysis</h1>
          <p className="text-sm text-zinc-400">
          YOLOv8 reads species from the photo itself — no labels file. Upload a camera-trap still for ID and counts.
        </p>
        </div>
        <ModelBadge ml={ml} kind="image" />
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
          drag ? "border-forest-400 bg-forest-500/10" : "border-forest-500/30"
        }`}
      >
        <Upload className="mb-3 text-forest-400" />
        <span className="text-sm font-medium text-white">
          {busy ? "Analyzing..." : "Drop or click to upload an image"}
        </span>
        <span className="mt-1 text-xs text-zinc-500">JPEG, PNG, WEBP · max 15MB</span>
        <input
          type="file"
          accept="image/*"
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
        <div className="glass-card grid gap-5 rounded-2xl p-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl bg-black/40">
            <img src={mediaUrl(result.image_path)} alt="" className="h-72 w-full object-contain" />
            {(result.detections || []).map((d) => (
              <div
                key={d.id}
                className="pointer-events-none absolute border-2 border-forest-400"
                style={{
                  left: `${(d.box?.x || 0) * 100}%`,
                  top: `${(d.box?.y || 0) * 100}%`,
                  width: `${(d.box?.w || 0) * 100}%`,
                  height: `${(d.box?.h || 0) * 100}%`,
                }}
              >
                <span className="absolute -top-5 left-0 bg-forest-500 px-1.5 py-0.5 text-[10px] text-white">
                  {d.label} {Math.round((d.confidence || 0) * 100)}%
                </span>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Latest inference</h2>
            <p className="mt-2 text-lg text-forest-400">{result.species_common_name}</p>
            <p className="text-sm italic text-zinc-400">{result.scientific_name}</p>
            <div className="mt-3 space-y-1 text-sm text-zinc-300">
              <div>Count: {result.animal_count}</div>
              <div>Confidence: {(result.confidence * 100).toFixed(1)}%</div>
              <div>IUCN: {result.iucn_status || "—"}</div>
              <div className="text-xs text-zinc-500">Model: {result.model || "demo"}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {images.map((img) => (
          <div key={img.image_id} className="glass-card overflow-hidden rounded-2xl">
            <img
              src={mediaUrl(img.image_path)}
              alt=""
              className="h-40 w-full bg-black/30 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex items-start justify-between gap-2 p-4 text-sm">
              <div>
                <div className="text-white">{img.species?.common_name || "Pending analysis"}</div>
                <div className="text-xs text-zinc-500">
                  {img.animal_count != null ? `${img.animal_count} animals · ` : ""}
                  {img.confidence != null ? `${(img.confidence * 100).toFixed(0)}%` : "not analyzed"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeImage(img.image_id)}
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

function ModelBadge({ ml, kind }) {
  const ready = ml?.loaded;
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-right text-xs">
      <div className={ready ? "text-forest-400" : "text-amber-300"}>
        {ready ? "Trained model loaded" : "Demo inference"}
      </div>
      <div className="max-w-[220px] text-zinc-500">
        {ready ? ml.backend : ml?.error || `Put weights in backend/ml_models/${kind}/`}
      </div>
    </div>
  );
}
