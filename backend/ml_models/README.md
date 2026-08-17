# Trained model files — put them here

This folder is the AI / ML inference layer from the architecture diagram.
The FastAPI gateway loads weights at startup (and again on each process start).

```
backend/ml_models/
  image/     ← Wildlife Image Analysis Service (YOLOv8 / Faster R-CNN / classifier)
  audio/     ← Bioacoustic Analysis Service (CNN / YAMNet / your voice model)
```

## Image model

Copy your trained vision weights into:

`backend/ml_models/image/`

Any of these filenames are picked up automatically (first match wins):

- `best.pt` / `last.pt` — Ultralytics YOLOv8 (recommended)
- `wildlife_image.pt` / `wildlife_yolo.pt` / `yolov8.pt` / `model.pt`
- `model.onnx` / `best.onnx`
- `model.keras` / `model.h5` — Keras / TensorFlow classifier

Then edit `backend/ml_models/image/labels.json` so class indexes (or class names)
match the `Species.common_name` values in the database.

Example:

```json
{ "0": "Bengal Tiger", "1": "Asian Elephant" }
```

## Voice / audio model

Copy your trained bioacoustic weights into:

`backend/ml_models/audio/`

Accepted filenames:

- `best.pt` / `wildlife_audio.pt` / `wildlife_voice.pt` / `voice_model.pt`
- `model.keras` / `model.h5` / `yamnet.tflite`
- `model.onnx`

Edit `backend/ml_models/audio/labels.json` the same way.

## Optional env overrides

In `backend/.env`:

```
IMAGE_MODEL_PATH=ml_models/image/best.pt
AUDIO_MODEL_PATH=ml_models/audio/wildlife_voice.pt
```

## Dependencies

The API runs without PyTorch / Ultralytics. After you drop the files in, install:

```bash
pip install -r requirements-ml.txt
```

If no weight file is present, inference falls back to a filename-aware demo so the
rest of the app still works.
