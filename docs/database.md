                    Frontend
                  Next.js / React
                       │
                       ↓
                 FastAPI Backend
                       │
          ┌────────────┴────────────┐
          │                         │
       YOLO11                  Audio Model
       best.pt                best_model.keras
          │                         │
          └────────────┬────────────┘
                       ↓
                  SQLAlchemy
                       ↓
               PostgreSQL / Neon
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
    Detection      Population      Analytics
      Data          Trends          Forecast