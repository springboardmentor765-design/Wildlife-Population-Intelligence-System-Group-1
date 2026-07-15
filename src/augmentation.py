# import os
# import cv2
# from tqdm import tqdm
# import albumentations as A

# # =====================================================
# # Configuration
# # =====================================================

# INPUT_DIR = "data/processed"
# OUTPUT_DIR = "data/augmented"

# IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")

# AUGMENTATIONS_PER_IMAGE = 3

# # =====================================================
# # Create Output Folder
# # =====================================================

# os.makedirs(OUTPUT_DIR, exist_ok=True)

# # =====================================================
# # Albumentations Pipeline
# # =====================================================

# transform = A.Compose([
#     A.HorizontalFlip(p=0.5),
#     A.VerticalFlip(p=0.2),
#     A.RandomRotate90(p=0.3),

#     A.RandomBrightnessContrast(
#         brightness_limit=0.2,
#         contrast_limit=0.2,
#         p=0.5
#     ),

#     A.HueSaturationValue(
#         hue_shift_limit=10,
#         sat_shift_limit=20,
#         val_shift_limit=10,
#         p=0.5
#     ),

#     A.GaussianBlur(
#         blur_limit=(3,5),
#         p=0.2
#     ),

#     A.GaussNoise(
#         std_range=(0.02, 0.08),
#         p=0.2
#     ),

#     A.CLAHE(
#         clip_limit=2.0,
#         p=0.3
#     ),

#     A.RandomGamma(
#         gamma_limit=(80,120),
#         p=0.3
#     ),

#     A.Resize(640,640)
# ])

# # =====================================================
# # Process Dataset
# # =====================================================

# total = 0
# saved = 0

# for root, dirs, files in os.walk(INPUT_DIR):

#     relative = os.path.relpath(root, INPUT_DIR)

#     output_folder = os.path.join(
#         OUTPUT_DIR,
#         relative
#     )

#     os.makedirs(output_folder, exist_ok=True)

#     for file in tqdm(files, desc=relative):

#         if not file.lower().endswith(IMAGE_EXTENSIONS):
#             continue

#         image_path = os.path.join(root, file)

#         image = cv2.imread(image_path)

#         if image is None:
#             continue

#         image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

#         filename = os.path.splitext(file)[0]

#         # Save Original
#         cv2.imwrite(
#             os.path.join(output_folder, file),
#             cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
#         )

#         saved += 1

#         # Generate Augmented Images
#         for i in range(AUGMENTATIONS_PER_IMAGE):

#             augmented = transform(image=image)

#             aug_img = augmented["image"]

#             save_name = f"{filename}_aug_{i}.jpg"

#             cv2.imwrite(
#                 os.path.join(output_folder, save_name),
#                 cv2.cvtColor(aug_img, cv2.COLOR_RGB2BGR)
#             )

#             saved += 1

#         total += 1

# print("="*60)
# print("Augmentation Completed")
# print("="*60)
# print(f"Original Images : {total}")
# print(f"Saved Images    : {saved}")
# print(f"Output Folder   : {OUTPUT_DIR}")
# print("="*60)



# YOLO with Ultralytics   There is no need to used Aguementation.py file because we can use the augmentation parameters in 
# train.py file.b 