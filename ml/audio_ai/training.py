import os
import joblib
import librosa
import numpy as np
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical

# =====================================================
# Dataset Path
# =====================================================

BASE_PATH = os.path.join("datasets", "animal_sounds")

# =====================================================
# Feature Extraction
# =====================================================

def extract_features(file):

    try:
        signal, sr = librosa.load(file, sr=22050)

        mfcc = librosa.feature.mfcc(
            y=signal,
            sr=sr,
            n_mfcc=40
        )

        return np.mean(mfcc.T, axis=0)

    except Exception as e:
        print(file)
        print(e)
        return None

# =====================================================
# Load Dataset
# =====================================================

features = []
labels = []

print("Loading Dataset...\n")

for animal in sorted(os.listdir(BASE_PATH)):

    animal_path = os.path.join(BASE_PATH, animal)

    if not os.path.isdir(animal_path):
        continue

    print(f"Loading {animal}")

    for audio in os.listdir(animal_path):

        if audio.lower().endswith(".wav"):

            path = os.path.join(animal_path, audio)

            feature = extract_features(path)

            if feature is not None:
                features.append(feature)
                labels.append(animal)

X = np.array(features)
y = np.array(labels)

print("\nDataset Loaded Successfully")
print("Samples :", len(X))
print("Classes :", len(np.unique(y)))

# =====================================================
# Label Encoding
# =====================================================

encoder = LabelEncoder()

y = encoder.fit_transform(y)

joblib.dump(encoder, "label_encoder.pkl")

y = to_categorical(y)

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
    y,
    test_size=0.2,
    random_state=42,
    stratify=np.argmax(y, axis=1)
)

# =====================================================
# Neural Network
# =====================================================

model = Sequential()

model.add(Dense(512, activation="relu", input_shape=(40,)))
model.add(BatchNormalization())
model.add(Dropout(0.4))

model.add(Dense(256, activation="relu"))
model.add(BatchNormalization())
model.add(Dropout(0.3))

model.add(Dense(128, activation="relu"))
model.add(BatchNormalization())
model.add(Dropout(0.3))

model.add(Dense(y.shape[1], activation="softmax"))

# =====================================================
# Compile
# =====================================================

model.compile(
    optimizer=Adam(0.001),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# =====================================================
# Callbacks
# =====================================================

callbacks = [

    EarlyStopping(
        monitor="val_loss",
        patience=15,
        restore_best_weights=True
    ),

    ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=5,
        verbose=1
    ),

    ModelCheckpoint(
        "best_model.keras",
        monitor="val_accuracy",
        save_best_only=True,
        verbose=1
    )
]

# =====================================================
# Training
# =====================================================

history = model.fit(

    X_train,
    y_train,

    validation_data=(X_test, y_test),

    epochs=100,

    batch_size=32,

    callbacks=callbacks,

    verbose=1
)

# =====================================================
# Evaluation
# =====================================================

loss, accuracy = model.evaluate(X_test, y_test)

print("\nTest Accuracy :", round(accuracy*100,2),"%")

# =====================================================
# Save Model
# =====================================================

model.save("animal_sound_model.keras")
model.save("animal_sound_model.h5")

print("\nModel Saved Successfully.")

# =====================================================
# Accuracy Plot
# =====================================================

plt.figure(figsize=(8,5))

plt.plot(history.history["accuracy"], label="Training")
plt.plot(history.history["val_accuracy"], label="Validation")

plt.title("Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.legend()

plt.savefig("accuracy.png")

# =====================================================
# Loss Plot
# =====================================================

plt.figure(figsize=(8,5))

plt.plot(history.history["loss"], label="Training")
plt.plot(history.history["val_loss"], label="Validation")

plt.title("Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.legend()

plt.savefig("loss.png")

plt.show()

print("\nTraining Finished Successfully.")