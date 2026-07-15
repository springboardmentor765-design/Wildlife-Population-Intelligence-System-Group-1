import os
import cv2
from pathlib import Path
from tqdm import tqdm

# ==============================
# Configuration
# ==============================

INPUT_DIR = "data/raw"
OUTPUT_DIR = "data/processed"

IMAGE_SIZE = (640, 640)

# ==============================
# Create Output Folder
# ==============================

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ==============================
# Supported Extensions
# ==============================

EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")


def preprocess_image(img_path, save_path):
    """
    Read, clean and save an image.
    """

    image = cv2.imread(str(img_path))

    if image is None:
        return False

    # Resize
    image = cv2.resize(image, IMAGE_SIZE)

    # Denoise
    image = cv2.fastNlMeansDenoisingColored(
        image,
        None,
        10,
        10,
        7,
        21,
    )

    # Contrast Enhancement (CLAHE)
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)

    l, a, b = cv2.split(lab)

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    l = clahe.apply(l)

    lab = cv2.merge((l, a, b))

    image = cv2.cvtColor(
        lab,
        cv2.COLOR_LAB2BGR
    )

    # Save
    cv2.imwrite(str(save_path), image)

    return True


# ==============================
# Process Dataset
# ==============================

total = 0
processed = 0
failed = 0

for root, dirs, files in os.walk(INPUT_DIR):

    relative = os.path.relpath(root, INPUT_DIR)

    output_folder = os.path.join(
        OUTPUT_DIR,
        relative
    )

    os.makedirs(output_folder, exist_ok=True)

    for file in tqdm(files, leave=False):

        if not file.lower().endswith(EXTENSIONS):
            continue

        total += 1

        img_path = Path(root) / file

        save_path = Path(output_folder) / file

        success = preprocess_image(
            img_path,
            save_path
        )

        if success:
            processed += 1
        else:
            failed += 1


print("=" * 60)
print("Preprocessing Completed")
print("=" * 60)
print(f"Total Images     : {total}")
print(f"Processed Images : {processed}")
print(f"Failed Images    : {failed}")
print(f"Saved To         : {OUTPUT_DIR}")
print("=" * 60)