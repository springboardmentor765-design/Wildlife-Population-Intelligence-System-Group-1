                  main.py
                      │
          ┌───────────┴───────────┐
          ↓                       ↓
      YOLO model             Audio model
      best.pt                best_model.keras
          │                       │
          ↓                       ↓
 detection.py              audio.py
          │                       │
    /api/detection/*        /api/audio/*