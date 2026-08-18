import os
import joblib
import librosa
import numpy as np
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau
)
from tensorflow.keras.utils import to_categorical


# =====================================================
# Dataset Path
# =====================================================

BASE_PATH = r"Dataset\Animals"


# =====================================================
# Feature Extraction
# =====================================================

def extract_features(file_path):

    try:
        audio, sample_rate = librosa.load(file_path, sr=22050)

        mfccs = librosa.feature.mfcc(
            y=audio,
            sr=sample_rate,
            n_mfcc=40
        )

        mfccs_scaled = np.mean(mfccs.T, axis=0)

        return mfccs_scaled

    except Exception as e:
        print(f"Error processing {file_path}")
        print(e)
        return None


# =====================================================
# Load Dataset
# =====================================================

def load_dataset(dataset_path):

    features = []
    labels = []

    for animal in os.listdir(dataset_path):

        animal_folder = os.path.join(dataset_path, animal)

        if not os.path.isdir(animal_folder):
            continue

        print(f"Loading {animal}...")

        for file in os.listdir(animal_folder):

            if file.endswith(".wav"):

                path = os.path.join(animal_folder, file)

                feature = extract_features(path)

                if feature is not None:
                    features.append(feature)
                    labels.append(animal)

    return np.array(features), np.array(labels)


print("Loading dataset...")

X, y = load_dataset(BASE_PATH)

print("Dataset Loaded")
print("Samples :", len(X))


# =====================================================
# Label Encoding
# =====================================================

label_encoder = LabelEncoder()

y_encoded = label_encoder.fit_transform(y)

y_categorical = to_categorical(y_encoded)

joblib.dump(label_encoder, "label_encoder.pkl")


# =====================================================
# Feature Scaling
# =====================================================

scaler = StandardScaler()

X = scaler.fit_transform(X)

joblib.dump(scaler, "scaler.pkl")


# =====================================================
# Train Test Split
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_categorical,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)


# =====================================================
# Build Model
# =====================================================

model = Sequential()

model.add(Dense(512, activation="relu", input_shape=(X_train.shape[1],)))
model.add(BatchNormalization())
model.add(Dropout(0.4))

model.add(Dense(256, activation="relu"))
model.add(BatchNormalization())
model.add(Dropout(0.3))

model.add(Dense(128, activation="relu"))
model.add(BatchNormalization())
model.add(Dropout(0.3))

model.add(Dense(len(label_encoder.classes_), activation="softmax"))


model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()


# =====================================================
# Callbacks
# =====================================================

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=15,
    restore_best_weights=True
)

checkpoint = ModelCheckpoint(
    "animal_sound_recognition_model.keras",
    monitor="val_accuracy",
    save_best_only=True,
    verbose=1
)

reduce_lr = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.5,
    patience=5,
    verbose=1
)


# =====================================================
# Train
# =====================================================

history = model.fit(

    X_train,
    y_train,

    validation_data=(X_test, y_test),

    epochs=200,

    batch_size=32,

    callbacks=[
        early_stop,
        checkpoint,
        reduce_lr
    ],

    verbose=1
)


# =====================================================
# Evaluate
# =====================================================

loss, accuracy = model.evaluate(X_test, y_test)

print("\nTest Accuracy :", accuracy)
print("Test Loss :", loss)


# =====================================================
# Save Model
# =====================================================

model.save("animal_sound_recognition_model.keras")
model.save("animal_sound_recognition_model.h5")

print("\nModel Saved Successfully.")


# =====================================================
# Plot Accuracy
# =====================================================

plt.figure(figsize=(10,5))

plt.plot(history.history["accuracy"], label="Training Accuracy")
plt.plot(history.history["val_accuracy"], label="Validation Accuracy")

plt.title("Accuracy")

plt.xlabel("Epoch")

plt.ylabel("Accuracy")

plt.legend()

plt.grid()

plt.savefig("accuracy.png")

plt.show()


# =====================================================
# Plot Loss
# =====================================================

plt.figure(figsize=(10,5))

plt.plot(history.history["loss"], label="Training Loss")
plt.plot(history.history["val_loss"], label="Validation Loss")

plt.title("Loss")

plt.xlabel("Epoch")

plt.ylabel("Loss")

plt.legend()

plt.grid()

plt.savefig("loss.png")

plt.show()

print("\nTraining Completed Successfully.")