from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportCreate, ReportResponse
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["reports"]); service = ReportService()
@router.get("", response_model=list[ReportResponse])
def list_reports(db: Session = Depends(get_db), _: User = Depends(get_current_user)): return list(db.scalars(select(Report).order_by(Report.created_at.desc())))
@router.post("", response_model=ReportResponse, status_code=201)
def create_report(data: ReportCreate, db: Session = Depends(get_db), user: User = Depends(require_roles("admin", "researcher", "forest_officer"))):
    item = Report(name=data.name, report_type=data.report_type, created_by=user.id, status="Draft"); db.add(item); db.commit(); db.refresh(item); return item
@router.get("/{item_id}", response_model=ReportResponse)
def get_report(item_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.get(db, item_id)
@router.post("/{item_id}/generate", response_model=ReportResponse)
def generate_report(item_id: int, db: Session = Depends(get_db), _: User = Depends(require_roles("admin", "researcher", "forest_officer"))): return service.generate_csv(db, service.get(db, item_id))
@router.get("/{item_id}/download")
def download_report(item_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    report = service.get(db, item_id)
    if not report.file_path or not Path(report.file_path).is_file(): raise HTTPException(404, "Generated file not found")
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen.canvas import Canvas
    except ImportError as error:
        raise HTTPException(503, "PDF export requires reportlab. Install backend requirements and restart the API.") from error
    pdf_path = Path(report.file_path).with_suffix(".pdf")
    canvas = Canvas(str(pdf_path), pagesize=A4)
    width, height = A4
    canvas.setTitle(report.name)
    canvas.setFont("Helvetica-Bold", 16)
    canvas.drawString(42, height - 48, report.name)
    canvas.setFont("Helvetica", 9)
    canvas.drawString(42, height - 65, f"Wildlife Population Intelligence System · {report.report_type.title()} report")
    y = height - 95
    with Path(report.file_path).open(encoding="utf-8") as stream:
        for line in stream:
            canvas.drawString(42, y, "  ".join(line.strip().split(","))[:125])
            y -= 14
            if y < 42:
                canvas.showPage(); canvas.setFont("Helvetica", 8); y = height - 42
    canvas.save()
    return FileResponse(pdf_path, filename=f"{report.name}.pdf", media_type="application/pdf")
@router.delete("/{item_id}", status_code=204)
def delete_report(item_id: int, db: Session = Depends(get_db), _: User = Depends(require_roles("admin", "researcher", "forest_officer"))): db.delete(service.get(db, item_id)); db.commit(); return Response(status_code=204)
