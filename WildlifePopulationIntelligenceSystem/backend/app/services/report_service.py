import csv
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.population import Population
from app.models.report import Report

ROOT = Path(__file__).resolve().parents[2] / "uploads" / "reports"


class ReportService:
    def get(self, db: Session, report_id: int) -> Report:
        report = db.get(Report, report_id)
        if not report:
            raise HTTPException(404, "Report not found")
        return report

    def generate_csv(self, db: Session, report: Report) -> Report:
        ROOT.mkdir(parents=True, exist_ok=True)
        path = ROOT / f"{uuid4().hex}.csv"
        rows = db.scalars(select(Population).order_by(Population.observation_date.desc()))
        with path.open("w", newline="", encoding="utf-8") as stream:
            writer = csv.writer(stream)
            writer.writerow(["id", "species_id", "location", "population_count", "confidence", "observation_date", "source"])
            for row in rows:
                writer.writerow([row.id, row.species_id, row.location, row.population_count, row.confidence, row.observation_date, row.source])
        report.file_path = str(path)
        report.status = "Generated"
        report.generated_at = datetime.now(UTC)
        db.commit()
        db.refresh(report)
        return report
