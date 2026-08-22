"""Store every image-model bounding box."""
from alembic import op
import sqlalchemy as sa

revision = "20260812_0002"
down_revision = "20260810_0001"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column("images", sa.Column("annotated_path", sa.String(length=500), nullable=True))
    op.create_table(
        "image_detections",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("image_id", sa.Integer(), sa.ForeignKey("images.id", ondelete="CASCADE"), nullable=False),
        sa.Column("species_id", sa.Integer(), sa.ForeignKey("species.id"), nullable=False),
        sa.Column("class_id", sa.Integer(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("bbox", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_image_detections_image_id", "image_detections", ["image_id"])
    op.create_index("ix_image_detections_species_id", "image_detections", ["species_id"])
    op.add_column("population", sa.Column("image_detection_id", sa.Integer(), nullable=True))
    op.create_foreign_key("fk_population_image_detection", "population", "image_detections", ["image_detection_id"], ["id"], ondelete="CASCADE")
    op.create_unique_constraint("uq_population_image_detection_id", "population", ["image_detection_id"])

def downgrade() -> None:
    op.drop_constraint("uq_population_image_detection_id", "population", type_="unique")
    op.drop_constraint("fk_population_image_detection", "population", type_="foreignkey")
    op.drop_column("population", "image_detection_id")
    op.drop_index("ix_image_detections_species_id", table_name="image_detections")
    op.drop_index("ix_image_detections_image_id", table_name="image_detections")
    op.drop_table("image_detections")
    op.drop_column("images", "annotated_path")
