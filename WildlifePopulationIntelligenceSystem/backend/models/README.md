# Model files

Place the trained model artifacts here (recommended):

- `best.pt` for image detection.
- `audio_model_v2_77.keras` for audio detection.
- `label_encoder_v2.pkl` for audio class labels.

`backend/app/models/` contains Python database-table definitions, such as
`image.py` and `audio.py`; those are not trained AI weights. The loader reads
trained artefacts only from this `backend/models/` folder.

If the artefacts are absent, the API returns an explanatory error and does not
create a detection or metric in the database.
