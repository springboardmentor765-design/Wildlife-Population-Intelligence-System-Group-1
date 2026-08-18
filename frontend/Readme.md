                    ┌─────────────────────────┐
                    │   Next.js Frontend      │
                    │ Dashboard / Upload UI   │
                    └────────────┬────────────┘
                                 │
                              REST API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      FastAPI App        │
                    │        main.py          │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        API Routers          Services          Authentication
        /detection           AI Processing      JWT / Users
        /dashboard           Business Logic
        /reports
        /audio
        /map
              │                  │
              └──────────┬───────┘
                         ▼
                  ┌───────────────┐
                  │    Models     │
                  │  SQLAlchemy   │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │    SQLite     │
                  │  wildlife.db  │
                  └───────────────┘

       Uploaded Media ──► AI Processing ──► Results
                               │
                               ▼
                          Reports / Analytics