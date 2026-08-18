"""Bioacoustic Analysis Service — CNN / YAMNet / Keras / demo fallback."""
from __future__ import annotations

import hashlib
import random
import struct
import wave
from pathlib import Path
from typing import Sequence

from app import models
from app.config import AUDIO_MODEL_DIR
from app.ml.loader import audio_weight_path, load_label_map, resolve_label
from app.ml.species_map import match_species, match_species_by_filename

_loaded = False
_backend: str | None = None
_model = None
_extractor = None
_weight: Path | None = None
_labels: dict[str, str] = {}
_id2label: dict[int, str] = {}
_error: str | None = None


def _rng_from(seed_text: str) -> random.Random:
    digest = hashlib.sha256(seed_text.encode("utf-8")).hexdigest()
    return random.Random(int(digest[:16], 16))


def model_status() -> dict:
    _ensure_loaded()
    return {
        "loaded": _backend not in (None, "demo"),
        "backend": _backend or "demo",
        "weight": str(_weight) if _weight else None,
        "error": _error,
        "place_file_in": str(AUDIO_MODEL_DIR),
    }


def _remap_ast_state_dict(state: dict) -> dict:
    """Map classic HuggingFace AST keys onto Transformers 5 module names."""
    replacements = (
        (".encoder.layer.", ".layers."),
        (".attention.attention.query.", ".attention.q_proj."),
        (".attention.attention.key.", ".attention.k_proj."),
        (".attention.attention.value.", ".attention.v_proj."),
        (".attention.output.dense.", ".attention.o_proj."),
        (".intermediate.dense.", ".mlp.fc1."),
        (".output.dense.", ".mlp.fc2."),
    )
    remapped = {}
    for key, value in state.items():
        new_key = key
        for old, new in replacements:
            new_key = new_key.replace(old, new)
        remapped[new_key] = value
    return remapped


def _ensure_loaded() -> None:
    global _loaded, _backend, _model, _extractor, _weight, _labels, _id2label, _error
    if _loaded and _backend == "ast" and _model is not None:
        return
    _labels = load_label_map(AUDIO_MODEL_DIR)
    _id2label = {int(k): v for k, v in _labels.items() if str(k).isdigit()}
    _weight = audio_weight_path()
    if not _weight:
        _backend = "demo"
        _loaded = True
        _error = f"No audio weight file in {AUDIO_MODEL_DIR}"
        return

    suffix = _weight.suffix.lower()
    try:
        if suffix in {".pt", ".pth"}:
            import torch
            from transformers import ASTConfig, ASTFeatureExtractor, ASTForAudioClassification

            state = torch.load(str(_weight), map_location="cpu", weights_only=False)
            if not (isinstance(state, dict) and any(str(k).startswith("audio_spectrogram_transformer") for k in state)):
                raise RuntimeError("Audio weights are not an AST state dict")
            num_labels = max(_id2label) + 1 if _id2label else int(state["classifier.dense.weight"].shape[0])
            config = ASTConfig(
                num_labels=num_labels,
                id2label={str(i): _id2label.get(i, str(i)) for i in range(num_labels)},
                label2id={v: i for i, v in _id2label.items()},
            )
            config._attn_implementation = "eager"
            model = ASTForAudioClassification(config)
            mapped = _remap_ast_state_dict(state)
            missing, unexpected = model.load_state_dict(mapped, strict=False)
            if missing:
                raise RuntimeError(f"AST weights did not match the model ({len(missing)} missing keys): {missing[:8]}")
            model.eval()
            _model = model
            _extractor = ASTFeatureExtractor(
                feature_size=1,
                sampling_rate=16000,
                num_mel_bins=128,
                max_length=1024,
                padding_value=0.0,
                do_normalize=True,
                mean=-4.2677393,
                std=4.5689974,
                return_attention_mask=False,
            )
            _backend = "ast"
            _error = None
            _loaded = True
            return
        _error = f"Unsupported audio weight type: {suffix}"
    except Exception as exc:
        _error = str(exc)
        _model = None
        _backend = "demo"
    _loaded = True


def estimate_audio_duration(file_size: int, path: Path | None = None) -> float:
    if path and path.suffix.lower() == ".wav" and path.exists():
        try:
            with wave.open(str(path), "rb") as handle:
                frames = handle.getnframes()
                rate = handle.getframerate() or 1
                return round(frames / float(rate), 2)
        except Exception:
            pass
    seconds = file_size / 44000
    return round(min(max(seconds, 2.5), 180.0), 2)


def _wav_samples(path: Path) -> list[float]:
    with wave.open(str(path), "rb") as handle:
        n = handle.getnframes()
        width = handle.getsampwidth()
        channels = handle.getnchannels()
        raw = handle.readframes(n)
    if width == 2:
        count = len(raw) // 2
        values = struct.unpack("<" + "h" * count, raw[: count * 2])
        samples = [v / 32768.0 for v in values]
    else:
        samples = [((b - 128) / 128.0) for b in raw]
    if channels > 1:
        samples = samples[::channels]
    return samples


def _peaks_from_samples(samples: list[float], bins: int = 24) -> list[float]:
    if not samples:
        return [0.2] * bins
    step = max(1, len(samples) // bins)
    peaks = []
    for i in range(bins):
        chunk = samples[i * step : (i + 1) * step]
        if not chunk:
            peaks.append(0.1)
        else:
            peaks.append(round(min(1.0, sum(abs(x) for x in chunk) / len(chunk) * 8), 3))
    return peaks


def _demo(filename: str, file_size: int, species_pool: Sequence[models.Species], duration: float, peaks: list[float]) -> dict:
    rng = _rng_from(f"{filename}:{file_size}:audio")
    matched = match_species_by_filename(filename, species_pool)
    birds = [s for s in species_pool if (s.species_group or "").lower() == "bird"]
    pool = birds or list(species_pool)
    species = matched or rng.choice(pool)
    confidence = round(rng.uniform(0.84, 0.97) if matched else rng.uniform(0.68, 0.91), 3)
    if not peaks:
        peaks = [round(rng.uniform(0.2, 1.0), 3) for _ in range(24)]
    return {
        "species": species,
        "confidence": confidence,
        "duration": duration,
        "spectrogram_peaks": peaks,
        "model": "demo-fallback",
        "backend": "demo",
    }


def _keras_predict(samples: list[float], species_pool: Sequence[models.Species], duration: float, peaks: list[float]) -> dict | None:
    import numpy as np

    vector = np.asarray(samples[: 16000 * 5] or [0.0], dtype="float32")
    shape = getattr(_model, "input_shape", None)
    if shape and len(shape) >= 2 and shape[1]:
        target = int(shape[1])
        if vector.size < target:
            vector = np.pad(vector, (0, target - vector.size))
        else:
            vector = vector[:target]
        arr = vector.reshape((1,) + tuple(d if d else 1 for d in shape[1:]))
    else:
        arr = vector.reshape(1, -1)
    preds = _model.predict(arr, verbose=0)
    out = preds[0]
    idx = int(np.argmax(out))
    conf = float(out[idx])
    label = resolve_label(str(idx), _labels)
    species = match_species(label, species_pool) or species_pool[0]
    return {
        "species": species,
        "confidence": round(conf, 3),
        "duration": duration,
        "spectrogram_peaks": peaks,
        "model": f"Keras:{_weight.name}",
        "backend": "keras",
    }


def _resample_mono(audio, sr: int, target: int = 16000):
    import numpy as np

    audio = np.asarray(audio, dtype="float32").reshape(-1)
    sr = int(sr or target)
    if sr == target or audio.size == 0:
        return audio
    try:
        import torch
        import torchaudio

        wav = torch.from_numpy(audio).unsqueeze(0)
        out = torchaudio.functional.resample(wav, sr, target)
        return out.squeeze(0).numpy().astype("float32")
    except Exception:
        n = max(1, int(round(audio.size * target / max(sr, 1))))
        old_x = np.linspace(0.0, 1.0, num=audio.size, endpoint=False)
        new_x = np.linspace(0.0, 1.0, num=n, endpoint=False)
        return np.interp(new_x, old_x, audio).astype("float32")


def _call_windows(audio, sr: int, win_s: float = 4.0, hop_s: float = 0.5, max_windows: int = 4):
    """Keep high-energy call regions so AST is not dominated by silence + zero-padding."""
    import numpy as np

    audio = np.asarray(audio, dtype="float32").reshape(-1)
    win = int(win_s * sr)
    hop = max(1, int(hop_s * sr))
    if audio.size == 0:
        return [audio]
    if audio.size <= win:
        return [audio]
    starts = list(range(0, audio.size - win + 1, hop))
    if starts[-1] != audio.size - win:
        starts.append(audio.size - win)
    rms = np.array(
        [float(np.sqrt(np.mean(np.square(audio[s : s + win]))) + 1e-12) for s in starts],
        dtype="float32",
    )
    thresh = 0.35 * float(rms.max())
    ranked = [i for i in np.argsort(rms)[::-1].tolist() if rms[i] >= thresh]
    picked: list[int] = []
    for i in ranked:
        start = starts[i]
        if any(abs(start - p) < win * 0.4 for p in picked):
            continue
        picked.append(start)
        if len(picked) >= max_windows:
            break
    if not picked:
        picked = [starts[int(np.argmax(rms))]]
    return [audio[s : s + win] for s in picked]


def _load_waveform(path: Path):
    """Decode wav/mp3/ogg on Windows without relying on torchaudio's ffmpeg backend."""
    import numpy as np

    errors = []

    try:
        import torchaudio

        waveform, sr = torchaudio.load(str(path))
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)
        if int(sr) != 16000:
            waveform = torchaudio.functional.resample(waveform, int(sr), 16000)
            sr = 16000
        audio = waveform.squeeze(0).numpy().astype("float32")
        return audio, 16000
    except Exception as exc:
        errors.append(f"torchaudio: {exc}")

    try:
        import miniaudio

        decoded = miniaudio.decode_file(str(path))
        samples = np.asarray(decoded.samples, dtype="float32")
        if decoded.nchannels > 1:
            samples = samples.reshape(-1, decoded.nchannels).mean(axis=1)
        peak = np.max(np.abs(samples)) if samples.size else 1.0
        if peak > 1.5:
            samples = samples / 32768.0
        return _resample_mono(samples, int(decoded.sample_rate)), 16000
    except Exception as exc:
        errors.append(f"miniaudio: {exc}")

    try:
        from pydub import AudioSegment

        clip = AudioSegment.from_file(str(path))
        clip = clip.set_channels(1)
        samples = np.array(clip.get_array_of_samples()).astype("float32")
        samples /= float(1 << (8 * clip.sample_width - 1))
        return _resample_mono(samples, int(clip.frame_rate)), 16000
    except Exception as exc:
        errors.append(f"pydub: {exc}")

    if path.suffix.lower() == ".wav":
        samples = np.asarray(_wav_samples(path), dtype="float32")
        try:
            with wave.open(str(path), "rb") as handle:
                native_sr = int(handle.getframerate() or 16000)
        except Exception:
            native_sr = 16000
        return _resample_mono(samples, native_sr), 16000

    raise RuntimeError(
        f"Could not decode {path.suffix} audio. Install miniaudio or ffmpeg. Details: {'; '.join(errors)}"
    )


def _ast_predict(audio_path: Path, species_pool: Sequence[models.Species], duration: float, peaks: list[float]) -> dict:
    import numpy as np
    import torch

    audio, sr = _load_waveform(audio_path)
    if audio is None or getattr(audio, "size", 0) == 0:
        raise RuntimeError(f"Could not decode audio file: {audio_path.name}")

    # Kaldi fbank (used by AST) expects 16-bit integer scale, not -1..1 floats.
    # Transformers 5.x commented out this multiply inside ASTFeatureExtractor.
    def _scale(chunk: np.ndarray) -> np.ndarray:
        peak = float(np.max(np.abs(chunk))) if chunk.size else 0.0
        if peak > 0 and peak <= 1.5:
            return (chunk * (2**15)).astype("float32")
        return chunk.astype("float32")

    duration = round(float(audio.size) / float(sr or 16000), 2)
    windows = _call_windows(audio, sr or 16000)
    weighted = None
    weight_sum = 0.0
    with torch.no_grad():
        for chunk in windows:
            inputs = _extractor(
                _scale(chunk),
                sampling_rate=sr or 16000,
                padding="max_length",
                return_tensors="pt",
            )
            logits = _model(**inputs).logits
            if logits.ndim > 1:
                logits = logits.squeeze(0)
            energy = float(np.sqrt(np.mean(np.square(chunk))) + 1e-6)
            probs = torch.softmax(logits, dim=-1) * energy
            weighted = probs if weighted is None else weighted + probs
            weight_sum += energy
        probs = weighted / max(weight_sum, 1e-6)
        topk = torch.topk(probs, k=min(5, probs.numel()))
        idx = int(topk.indices[0])
        conf = float(topk.values[0])

    label = _id2label.get(idx) or resolve_label(str(idx), _labels)
    species = match_species(label, species_pool)
    top_predictions = []
    for score, class_idx in zip(topk.values.tolist(), topk.indices.tolist()):
        raw = _id2label.get(int(class_idx)) or str(int(class_idx))
        matched = match_species(raw, species_pool)
        top_predictions.append(
            {
                "label": matched.common_name if matched else raw,
                "scientific_name": matched.scientific_name if matched else raw,
                "confidence": round(float(score), 3),
            }
        )
    step = max(1, len(audio) // 24)
    auto_peaks = np.abs(audio[::step][:24]).tolist()
    return {
        "species": species,
        "detected_label": label,
        "confidence": round(conf, 3),
        "duration": duration,
        "spectrogram_peaks": peaks or [round(float(v), 3) for v in auto_peaks],
        "top_predictions": top_predictions,
        "model": f"AST:{_weight.name}",
        "backend": "ast",
    }


def _torch_predict(samples: list[float], species_pool: Sequence[models.Species], duration: float, peaks: list[float]) -> dict | None:
    import torch

    tensor = torch.tensor(samples[: 16000 * 3] or [0.0], dtype=torch.float32).unsqueeze(0)
    if tensor.ndim == 2:
        tensor = tensor.unsqueeze(0)
    with torch.no_grad():
        out = _model(tensor) if callable(_model) else None
    if out is None:
        return None
    if hasattr(out, "logits"):
        out = out.logits
    probs = torch.softmax(out.squeeze(), dim=0)
    idx = int(torch.argmax(probs))
    conf = float(probs[idx])
    label = resolve_label(str(idx), _labels)
    species = match_species(label, species_pool)
    return {
        "species": species,
        "detected_label": label,
        "confidence": round(conf, 3),
        "duration": duration,
        "spectrogram_peaks": peaks,
        "model": f"Torch:{_weight.name}",
        "backend": "torch",
    }


def predict_from_audio(
    filename: str,
    file_size: int,
    species_pool: Sequence[models.Species],
    audio_path: Path | None = None,
) -> dict:
    _ensure_loaded()
    if not species_pool:
        raise ValueError("Species catalog is empty")

    duration = estimate_audio_duration(file_size, audio_path)
    peaks: list[float] = []
    samples: list[float] = []
    if audio_path and audio_path.exists() and audio_path.suffix.lower() == ".wav":
        try:
            samples = _wav_samples(audio_path)
            peaks = _peaks_from_samples(samples)
        except Exception:
            samples = []

    if _backend == "ast":
        if not audio_path or not audio_path.exists():
            raise RuntimeError(f"Audio file missing on disk: {audio_path}")
        return _ast_predict(audio_path, species_pool, duration, peaks)

    if _weight is not None:
        raise RuntimeError(_error or "Audio model is present but failed to load. Restart the API.")

    return _demo(filename, file_size, species_pool, duration, peaks)
