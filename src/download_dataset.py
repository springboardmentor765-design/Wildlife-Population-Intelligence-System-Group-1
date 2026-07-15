from kaggle.api.kaggle_api_extended import KaggleApi

api = KaggleApi()
api.authenticate()

api.dataset_download_files(
    "banuprasadb/wildlife-dataset",
    path="data/raw",
    unzip=True
)