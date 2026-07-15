import os
import cv2
import pandas as pd
import matplotlib.pyplot as plt
from collections import Counter
from tqdm import tqdm

# =====================================================
# Configuration
# =====================================================

DATASET_PATH = "data/raw"
OUTPUT_PATH = "outputs/eda"

os.makedirs(OUTPUT_PATH, exist_ok=True)

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")

# =====================================================
# Variables
# =====================================================

class_counter = Counter()

image_widths = []
image_heights = []

corrupt_images = []
total_images = 0

# =====================================================
# Scan Dataset
# =====================================================

print("=" * 60)
print("Scanning Dataset...")
print("=" * 60)

for class_name in sorted(os.listdir(DATASET_PATH)):

    class_folder = os.path.join(DATASET_PATH, class_name)

    if not os.path.isdir(class_folder):
        continue

    files = [
        f for f in os.listdir(class_folder)
        if f.lower().endswith(IMAGE_EXTENSIONS)
    ]

    class_counter[class_name] = len(files)

    for image_name in tqdm(files, desc=class_name):

        image_path = os.path.join(class_folder, image_name)

        image = cv2.imread(image_path)

        if image is None:
            corrupt_images.append(image_path)
            continue

        h, w = image.shape[:2]

        image_widths.append(w)
        image_heights.append(h)

        total_images += 1

# =====================================================
# Summary
# =====================================================

print("\nDataset Summary")
print("=" * 60)

print("Total Classes :", len(class_counter))
print("Total Images  :", total_images)
print("Corrupt Images:", len(corrupt_images))

# =====================================================
# Save Class Distribution CSV
# =====================================================

df = pd.DataFrame(
    class_counter.items(),
    columns=["Class", "Images"]
)

df = df.sort_values(
    by="Images",
    ascending=False
)

csv_path = os.path.join(
    OUTPUT_PATH,
    "class_distribution.csv"
)

df.to_csv(csv_path, index=False)

print("\nCSV Saved:", csv_path)

# =====================================================
# Plot Class Distribution
# =====================================================

plt.figure(figsize=(14,6))

plt.bar(df["Class"], df["Images"])

plt.xticks(rotation=90)

plt.xlabel("Class")

plt.ylabel("Number of Images")

plt.title("Wildlife Dataset Class Distribution")

plt.tight_layout()

plot1 = os.path.join(
    OUTPUT_PATH,
    "class_distribution.png"
)

plt.savefig(plot1)

plt.close()

# =====================================================
# Image Width Histogram
# =====================================================

plt.figure(figsize=(8,5))

plt.hist(
    image_widths,
    bins=25
)

plt.xlabel("Width")

plt.ylabel("Images")

plt.title("Image Width Distribution")

plot2 = os.path.join(
    OUTPUT_PATH,
    "image_width_distribution.png"
)

plt.savefig(plot2)

plt.close()

# =====================================================
# Image Height Histogram
# =====================================================

plt.figure(figsize=(8,5))

plt.hist(
    image_heights,
    bins=25
)

plt.xlabel("Height")

plt.ylabel("Images")

plt.title("Image Height Distribution")

plot3 = os.path.join(
    OUTPUT_PATH,
    "image_height_distribution.png"
)

plt.savefig(plot3)

plt.close()

# =====================================================
# Corrupt Images Report
# =====================================================

if len(corrupt_images):

    with open(
        os.path.join(
            OUTPUT_PATH,
            "corrupt_images.txt"
        ),
        "w"
    ) as f:

        for img in corrupt_images:
            f.write(img + "\n")

# =====================================================
# Dataset Statistics
# =====================================================

print("\nStatistics")
print("=" * 60)

print(df)

print("\nAverage Width :", round(sum(image_widths)/len(image_widths),2))
print("Average Height:", round(sum(image_heights)/len(image_heights),2))

print("\nEDA Completed Successfully")
print("=" * 60)