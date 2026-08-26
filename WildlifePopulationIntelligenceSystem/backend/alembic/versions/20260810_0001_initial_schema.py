"""initial wildlife population intelligence schema

Revision ID: 20260810_0001
Revises:
Create Date: 2026-08-10
"""
from alembic import op
import sqlalchemy as sa

revision = "20260810_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("users", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("name", sa.String(160), nullable=False), sa.Column("email", sa.String(255), nullable=False), sa.Column("password_hash", sa.String(255), nullable=False), sa.Column("role", sa.String(32), nullable=False), sa.Column("is_active", sa.Boolean(), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_users_email", "users", ["email"], unique=True); op.create_index("ix_users_role", "users", ["role"])
    op.create_table("species", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("common_name", sa.String(160), nullable=False), sa.Column("scientific_name", sa.String(200), nullable=False, unique=True), sa.Column("species_group", sa.String(80), nullable=False), sa.Column("iucn_status", sa.String(80), nullable=False), sa.Column("description", sa.String(2000)), sa.Column("habitat", sa.String(1000)), sa.Column("diet", sa.String(1000)), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_species_common_name", "species", ["common_name"]); op.create_index("ix_species_species_group", "species", ["species_group"]); op.create_index("ix_species_iucn_status", "species", ["iucn_status"])
    op.create_table("images", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False), sa.Column("species_id", sa.Integer(), sa.ForeignKey("species.id")), sa.Column("file_name", sa.String(255), nullable=False), sa.Column("file_path", sa.String(500), nullable=False), sa.Column("animal_count", sa.Integer()), sa.Column("confidence", sa.Float()), sa.Column("location", sa.String(255)), sa.Column("latitude", sa.Float()), sa.Column("longitude", sa.Float()), sa.Column("status", sa.String(32), nullable=False), sa.Column("observed_at", sa.DateTime(timezone=True)), sa.Column("processed_at", sa.DateTime(timezone=True)), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False)); op.create_index("ix_images_user_id", "images", ["user_id"])
    op.create_table("audio", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False), sa.Column("species_id", sa.Integer(), sa.ForeignKey("species.id")), sa.Column("file_name", sa.String(255), nullable=False), sa.Column("file_path", sa.String(500), nullable=False), sa.Column("duration", sa.Float()), sa.Column("confidence", sa.Float()), sa.Column("location", sa.String(255)), sa.Column("latitude", sa.Float()), sa.Column("longitude", sa.Float()), sa.Column("status", sa.String(32), nullable=False), sa.Column("observed_at", sa.DateTime(timezone=True)), sa.Column("processed_at", sa.DateTime(timezone=True)), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False)); op.create_index("ix_audio_user_id", "audio", ["user_id"])
    op.create_table("population", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("species_id", sa.Integer(), sa.ForeignKey("species.id"), nullable=False), sa.Column("location", sa.String(255), nullable=False), sa.Column("latitude", sa.Float()), sa.Column("longitude", sa.Float()), sa.Column("population_count", sa.Integer(), nullable=False), sa.Column("confidence", sa.Float()), sa.Column("observation_date", sa.Date(), nullable=False), sa.Column("source", sa.String(32), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False)); op.create_index("ix_population_species_id", "population", ["species_id"]); op.create_index("ix_population_location", "population", ["location"]); op.create_index("ix_population_observation_date", "population", ["observation_date"])
    op.create_table("reports", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("name", sa.String(255), nullable=False), sa.Column("report_type", sa.String(80), nullable=False), sa.Column("created_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=False), sa.Column("status", sa.String(40), nullable=False), sa.Column("file_path", sa.String(500)), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.Column("generated_at", sa.DateTime(timezone=True))); op.create_index("ix_reports_created_by", "reports", ["created_by"]); op.create_index("ix_reports_status", "reports", ["status"])


def downgrade() -> None:
    op.drop_table("reports"); op.drop_table("population"); op.drop_table("audio"); op.drop_table("images"); op.drop_table("species"); op.drop_table("users")
