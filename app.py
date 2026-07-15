import tempfile
import cv2
import streamlit as st
from PIL import Image
from ultralytics import YOLO

# -----------------------------
# Load Model
# -----------------------------
model = YOLO("runs/detect/runs/wildlife_detection/weights/best.pt")

st.set_page_config(page_title="Wildlife Population Intelligence System")

st.title(" Wildlife Population Intelligence System")

option = st.sidebar.selectbox(
    "Choose Input",
    ["Image", "Video", "Live Webcam"]
)

# ------------------------------------
# IMAGE
# ------------------------------------

if option == "Image":

    uploaded = st.file_uploader(
        "Upload Image",
        type=["jpg","jpeg","png"]
    )

    if uploaded:

        image = Image.open(uploaded)

        st.image(image)

        results = model.predict(image, conf=0.25)

        annotated = results[0].plot()

        st.image(annotated)

        st.subheader("Detected Species")

        for box in results[0].boxes:

            cls = int(box.cls)

            conf = float(box.conf)

            st.write(
                model.names[cls],
                f"{conf:.2f}"
            )

        st.success(
            f"Animals Detected : {len(results[0].boxes)}"
        )

# ------------------------------------
# VIDEO
# ------------------------------------

elif option == "Video":

    uploaded_video = st.file_uploader(
        "Upload Video",
        type=["mp4","avi","mov"]
    )

    if uploaded_video:

        tfile = tempfile.NamedTemporaryFile(delete=False)

        tfile.write(uploaded_video.read())

        cap = cv2.VideoCapture(tfile.name)

        frame_window = st.image([])

        while cap.isOpened():

            ret, frame = cap.read()

            if not ret:
                break

            results = model(frame)

            annotated = results[0].plot()

            frame_window.image(
                annotated,
                channels="BGR"
            )

        cap.release()

# ------------------------------------
# LIVE CAMERA
# ------------------------------------

else:

    run = st.checkbox("Start Camera")

    FRAME = st.image([])

    cap = cv2.VideoCapture(0)

    while run:

        ret, frame = cap.read()

        if not ret:
            break

        results = model(frame)

        annotated = results[0].plot()

        FRAME.image(
            annotated,
            channels="BGR"
        )

    cap.release()


# ==========================================================
# Wildlife Population Intelligence System
# Part 1A - Imports, Configuration & Initialization
# ==========================================================

# import os
# import io
# import sqlite3
# import tempfile
# from datetime import datetime

# import cv2
# import numpy as np
# import pandas as pd
# import plotly.express as px
# import plotly.graph_objects as go
# import streamlit as st

# from PIL import Image

# from ultralytics import YOLO

# import folium
# from streamlit_folium import st_folium

# from reportlab.lib import colors
# from reportlab.lib.styles import getSampleStyleSheet
# from reportlab.platypus import (
#     SimpleDocTemplate,
#     Table,
#     TableStyle,
#     Paragraph
# )

# # ----------------------------------------------------------
# # Page Configuration
# # ----------------------------------------------------------

# st.set_page_config(
#     page_title="Wildlife Population Intelligence System",
#     page_icon="🦁",
#     layout="wide",
#     initial_sidebar_state="expanded"
# )

# # ----------------------------------------------------------
# # Application Title
# # ----------------------------------------------------------

# st.title("🦁 Wildlife Population Intelligence System")
# st.caption("YOLO11 + Streamlit + Plotly + GIS + Wildlife Analytics")

# # ----------------------------------------------------------
# # Configuration
# # ----------------------------------------------------------

# MODEL_PATH = "runs/detect/runs/wildlife_detection/weights/best.pt"

# DATABASE = "wildlife.db"

# IMAGE_SIZE = 640

# CONFIDENCE = 0.25

# # ----------------------------------------------------------
# # Load YOLO Model
# # ----------------------------------------------------------

# @st.cache_resource
# def load_model():

#     if not os.path.exists(MODEL_PATH):

#         st.error(
#             f"Model not found:\n{MODEL_PATH}"
#         )

#         st.stop()

#     return YOLO(MODEL_PATH)

# model = load_model()

# # ----------------------------------------------------------
# # Database
# # ----------------------------------------------------------

# conn = sqlite3.connect(
#     DATABASE,
#     check_same_thread=False
# )

# cursor = conn.cursor()

# cursor.execute("""
# CREATE TABLE IF NOT EXISTS detections(

# id INTEGER PRIMARY KEY AUTOINCREMENT,

# datetime TEXT,

# species TEXT,

# confidence REAL,

# source TEXT,

# latitude REAL,

# longitude REAL

# )
# """)

# conn.commit()

# # ----------------------------------------------------------
# # Utility Functions
# # ----------------------------------------------------------

# def save_detection(
#     species,
#     confidence,
#     source,
#     latitude=0,
#     longitude=0
# ):

#     cursor.execute(
#         """
#         INSERT INTO detections
#         (
#         datetime,
#         species,
#         confidence,
#         source,
#         latitude,
#         longitude
#         )
#         VALUES(?,?,?,?,?,?)
#         """,
#         (
#             str(datetime.now()),
#             species,
#             confidence,
#             source,
#             latitude,
#             longitude
#         )
#     )

#     conn.commit()


# def load_history():

#     df = pd.read_sql_query(
#         "SELECT * FROM detections",
#         conn
#     )

#     return df


# def count_species(df):

#     if len(df) == 0:
#         return pd.DataFrame()

#     return (
#         df.groupby("species")
#         .size()
#         .reset_index(name="Count")
#     )

# # ----------------------------------------------------------
# # Sidebar
# # ----------------------------------------------------------

# st.sidebar.image(
#     "https://img.icons8.com/color/96/panda.png",
#     width=90
# )

# page = st.sidebar.radio(

#     "Navigation",

#     [

#         "🏠 Home",

#         "📊 Dashboard",

#         "📷 Image Detection",

#         "🎥 Video Detection",

#         "📹 Live Webcam",

#         "🚁 Drone Video",

#         "🎙 Bird Sound Detection",

#         "🌍 GPS Wildlife Map",

#         "📈 Population Trends",

#         "🌳 Biodiversity Score",

#         "📄 PDF Report",

#         "📊 Excel Export",

#         "⚙ Settings"

#     ]

# )

# # ----------------------------------------------------------
# # Session State
# # ----------------------------------------------------------

# if "history" not in st.session_state:

#     st.session_state.history = load_history()

# if "detections" not in st.session_state:

#     st.session_state.detections = []

# # ----------------------------------------------------------
# # Home Page
# # ----------------------------------------------------------

# if page == "🏠 Home":

#     st.header("Welcome")

#     st.write("""
# This platform provides:

# - YOLO11 Wildlife Detection
# - Image Detection
# - Video Detection
# - Live Webcam Detection
# - Drone Video Analysis
# - GPS Wildlife Mapping
# - Plotly Dashboard
# - Population Trend Analysis
# - Biodiversity Health Score
# - Bird Sound Recognition
# - PDF Report Generation
# - Excel Export
# """)

#     st.success("System Ready")

# # Remaining pages will be added in Part 1B and later.





# # ==========================================================
# # Dashboard
# # ==========================================================

# elif page == "📊 Dashboard":

#     st.header("📊 Wildlife Analytics Dashboard")

#     df = load_history()

#     # -----------------------------
#     # Empty Database
#     # -----------------------------

#     if df.empty:

#         st.warning("No detections available.")

#         st.stop()

#     # -----------------------------
#     # KPIs
#     # -----------------------------

#     total_detections = len(df)

#     total_species = df["species"].nunique()

#     average_confidence = round(df["confidence"].mean() * 100, 2)

#     today = datetime.now().date()

#     today_detections = len(

#         df[
#             pd.to_datetime(df["datetime"]).dt.date
#             == today
#         ]

#     )

#     c1, c2, c3, c4 = st.columns(4)

#     c1.metric(
#         "📷 Total Detections",
#         total_detections
#     )

#     c2.metric(
#         "🦁 Species",
#         total_species
#     )

#     c3.metric(
#         "🎯 Avg Confidence",
#         f"{average_confidence}%"
#     )

#     c4.metric(
#         "📅 Today",
#         today_detections
#     )

#     st.divider()

#     # -----------------------------
#     # Charts
#     # -----------------------------

#     left, right = st.columns(2)

#     # Species Count

#     with left:

#         species = (

#             df.groupby("species")

#             .size()

#             .reset_index(name="Count")

#             .sort_values(
#                 "Count",
#                 ascending=False
#             )

#         )

#         fig = px.bar(

#             species,

#             x="species",

#             y="Count",

#             title="Species Distribution",

#             text="Count"

#         )

#         fig.update_layout(

#             xaxis_title="Species",

#             yaxis_title="Detections",

#             height=450

#         )

#         st.plotly_chart(

#             fig,

#             use_container_width=True

#         )

#     # Pie Chart

#     with right:

#         pie = px.pie(

#             species,

#             values="Count",

#             names="species",

#             title="Detection Percentage"

#         )

#         pie.update_traces(textposition="inside")

#         st.plotly_chart(

#             pie,

#             use_container_width=True

#         )

#     st.divider()

#     # -----------------------------
#     # Detection Timeline
#     # -----------------------------

#     timeline = df.copy()

#     timeline["datetime"] = pd.to_datetime(

#         timeline["datetime"]

#     )

#     timeline["Date"] = (

#         timeline["datetime"]

#         .dt.date

#     )

#     trend = (

#         timeline.groupby("Date")

#         .size()

#         .reset_index(name="Detections")

#     )

#     trend_chart = px.line(

#         trend,

#         x="Date",

#         y="Detections",

#         markers=True,

#         title="Detection Trend"

#     )

#     trend_chart.update_layout(

#         height=500

#     )

#     st.plotly_chart(

#         trend_chart,

#         use_container_width=True

#     )

#     st.divider()

#     # -----------------------------
#     # Recent Detections
#     # -----------------------------

#     st.subheader("📋 Recent Detections")

#     recent = (

#         df.sort_values(

#             "datetime",

#             ascending=False

#         )

#         .head(20)

#     )

#     st.dataframe(

#         recent,

#         use_container_width=True,

#         hide_index=True

#     )

#     st.divider()

#     # -----------------------------
#     # Download CSV
#     # -----------------------------

#     csv = df.to_csv(

#         index=False

#     ).encode("utf-8")

#     st.download_button(

#         "⬇ Download Detection History",

#         csv,

#         "detection_history.csv",

#         "text/csv"

#     )



    
