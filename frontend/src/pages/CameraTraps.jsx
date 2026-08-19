import { useEffect, useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

import { imageService } from '../services/imageService';

const DETECTION_STORAGE_KEY = 'wpis_image_detection_results';

export default function CameraTraps() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  /*
   * ---------------------------------------------------------
   * LOAD SAVED DETECTION RESULTS
   * ---------------------------------------------------------
   */

  const getSavedResults = () => {
    try {
      const saved = localStorage.getItem(DETECTION_STORAGE_KEY);

      if (!saved) {
        return {};
      }

      return JSON.parse(saved);
    } catch (error) {
      console.error('Could not read saved detection results:', error);
      return {};
    }
  };

  const saveDetectionResult = (data) => {
    try {
      const saved = getSavedResults();

      const key =
        data?.filename ||
        data?.image?.filename ||
        `result-${Date.now()}`;

      saved[key] = {
        ...data,
        savedAt: new Date().toISOString(),
        analyzed: true,
      };

      localStorage.setItem(
        DETECTION_STORAGE_KEY,
        JSON.stringify(saved)
      );
    } catch (error) {
      console.error('Could not save detection result:', error);
    }
  };

  /*
   * ---------------------------------------------------------
   * LOAD IMAGES
   * ---------------------------------------------------------
   */

  const loadImages = async () => {
    try {
      const data = await imageService.list();

      const savedResults = getSavedResults();

      const formatted = (Array.isArray(data) ? data : []).map((image) => {
        const savedResult = savedResults[image.filename];

        return {
          ...image,

          imageUrl: imageService.imageUrl(image.filename),

          /*
           * If this image was previously analyzed,
           * attach its saved AI result.
           */
          detectionResult: savedResult || null,

          analyzed: Boolean(savedResult),
        };
      });

      setImages(formatted);
    } catch (err) {
      console.error('Could not load images:', err);
      setImages([]);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  /*
   * ---------------------------------------------------------
   * FILE SELECTION
   * ---------------------------------------------------------
   */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setError('');

    /*
     * Create preview of selected image.
     */
    const previewUrl = URL.createObjectURL(file);
    setSelectedPreview(previewUrl);
  };

  /*
   * ---------------------------------------------------------
   * UPLOAD + AI DETECTION
   * ---------------------------------------------------------
   */

  const uploadImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError('');
    setResult(null);

    try {
      const results = await imageService.upload(
        [selectedFile],
        {
          onProgress: setProgress,
        }
      );

      /*
       * Backend returns an array.
       */
      const data = results?.[0];

      if (!data) {
        throw new Error(
          'The server did not return an image detection result.'
        );
      }

      /*
       * Mark this as an analyzed result.
       */
      const detectionResult = {
        ...data,
        analyzed: true,
        analyzedAt: new Date().toISOString(),
      };

      /*
       * Show immediately on the page.
       */
      setResult(detectionResult);

      /*
       * IMPORTANT:
       * Save the AI result in browser storage so it
       * remains associated with the uploaded image
       * even after refreshing the webpage.
       */
      saveDetectionResult(detectionResult);

      /*
       * Reload uploaded images and merge saved results.
       */
      await loadImages();

      /*
       * Clear selected file.
       */
      setSelectedFile(null);

      if (selectedPreview) {
        URL.revokeObjectURL(selectedPreview);
        setSelectedPreview('');
      }

    } catch (err) {
      console.error('IMAGE MODEL ERROR:', err);

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Image detection failed.'
      );
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  /*
   * ---------------------------------------------------------
   * GET DETECTION COUNT
   * ---------------------------------------------------------
   */

  const getDetectionCount = (detectionResult) => {
    if (!detectionResult) {
      return 0;
    }

    if (typeof detectionResult.total_animals === 'number') {
      return detectionResult.total_animals;
    }

    if (Array.isArray(detectionResult.detections)) {
      return detectionResult.detections.length;
    }

    return 0;
  };

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <p className="text-sm font-medium text-green-600">
          AI Wildlife Detection
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Camera Trap Image Detection
        </h1>

        <p className="mt-2 text-gray-500">
          Upload an image and run the YOLO wildlife detection model.
        </p>
      </div>


      {/* =====================================================
          UPLOAD SECTION
      ===================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-gray-900">
          Upload Image
        </h2>

        <div className="mt-5">

          <label
            htmlFor="wildlife-image"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-10 hover:bg-gray-50"
          >

            <ImageIcon
              size={40}
              className="text-gray-400"
            />

            <p className="mt-3 font-medium text-gray-700">
              Choose wildlife image
            </p>

            <p className="mt-1 text-sm text-gray-400">
              JPG, JPEG or PNG
            </p>

            <input
              id="wildlife-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

          </label>

        </div>


        {/* ===================================================
            SELECTED IMAGE
        =================================================== */}

        {selectedFile && (

          <div className="mt-5 rounded-xl bg-gray-50 p-4">

            <p className="font-medium">
              Selected file
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {selectedFile.name}
            </p>

            {selectedPreview && (
              <img
                src={selectedPreview}
                alt="Selected wildlife"
                className="mt-4 max-h-96 w-full rounded-xl object-contain"
              />
            )}

          </div>

        )}


        {/* ===================================================
            RUN DETECTION BUTTON
        =================================================== */}

        <button
          onClick={uploadImage}
          disabled={!selectedFile || uploading}
          className="mt-5 flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {uploading ? (

            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Detecting... {progress}%
            </>

          ) : (

            <>
              <Upload size={18} />

              Run Image Detection
            </>

          )}

        </button>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>

        )}

      </div>


      {/* =====================================================
          DETECTION RESULT
      ===================================================== */}

      {result && (

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold text-gray-900">
              Detection Result
            </h2>

            <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

              <CheckCircle2 size={17} />

              AI Analyzed

            </div>

          </div>


          <div className="mt-5 grid gap-6 lg:grid-cols-2">


            {/* =================================================
                ANNOTATED IMAGE
            ================================================= */}

            <div>

              <div className="overflow-hidden rounded-xl border bg-gray-50">

                <img
                  src={result.imageUrl}
                  alt={result.filename || 'Detected wildlife'}
                  className="w-full object-contain"
                />

              </div>

              <p className="mt-2 text-sm text-gray-500">
                This image shows the AI detection result.
                Bounding boxes are generated by the wildlife detection model.
              </p>

            </div>


            {/* =================================================
                RESULT DETAILS
            ================================================= */}

            <div>

              {/* TOTAL ANIMALS */}

              <div className="rounded-xl bg-green-50 p-5">

                <p className="text-sm text-green-700">
                  Animals detected
                </p>

                <p className="mt-1 text-4xl font-bold text-green-800">
                  {getDetectionCount(result)}
                </p>

              </div>


              {/* DETECTIONS */}

              <div className="mt-5">

                <h3 className="font-semibold text-gray-900">
                  Detection Details
                </h3>


                {(result.detections ?? []).length === 0 ? (

                  <p className="mt-3 rounded-xl bg-gray-50 p-4 text-gray-500">
                    No animals detected.
                  </p>

                ) : (

                  <div className="mt-3 space-y-3">

                    {(result.detections ?? []).map(
                      (detection, index) => (

                        <div
                          key={`${detection.class_id ?? 'animal'}-${index}`}
                          className="rounded-xl border p-4"
                        >

                          <div className="flex items-center justify-between">

                            <span className="text-lg font-semibold">
                              {detection.animal || 'Unknown animal'}
                            </span>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                              {Math.round(
                                (detection.confidence ?? 0) * 100
                              )}

                              %

                            </span>

                          </div>


                          {detection.bbox && (

                            <p className="mt-2 text-sm text-gray-500">

                              Bounding box:{' '}

                              {Math.round(
                                detection.bbox.x1 ?? 0
                              )},{' '}

                              {Math.round(
                                detection.bbox.y1 ?? 0
                              )}

                              {' → '}

                              {Math.round(
                                detection.bbox.x2 ?? 0
                              )},{' '}

                              {Math.round(
                                detection.bbox.y2 ?? 0
                              )}

                            </p>

                          )}

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          UPLOADED IMAGES
      ===================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold">
              Uploaded Images
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Images marked as AI Analyzed have a saved detection result.
            </p>

          </div>

        </div>


        {images.length === 0 ? (

          <p className="mt-5 text-gray-500">
            No uploaded images yet.
          </p>

        ) : (

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {images.map((image) => {

              const detectionResult = image.detectionResult;

              const detectionCount =
                getDetectionCount(detectionResult);

              return (

                <div
                  key={image.filename}
                  className="overflow-hidden rounded-xl border bg-white"
                >


                  {/* IMAGE */}

                  <div className="relative">

                    <img
                      src={image.imageUrl}
                      alt={image.filename}
                      className="h-56 w-full object-cover"
                      onError={(event) => {

                        console.error(
                          'IMAGE FAILED:',
                          image.imageUrl
                        );

                        event.currentTarget.style.display =
                          'none';

                      }}
                    />


                    {/* AI ANALYZED BADGE */}

                    {image.analyzed && (

                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow">

                        <CheckCircle2 size={13} />

                        AI Analyzed

                      </div>

                    )}

                  </div>


                  {/* IMAGE INFORMATION */}

                  <div className="p-4">

                    <p className="truncate font-medium">
                      {image.filename}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">

                      {Math.round(
                        (image.size || 0) / 1024
                      )}

                      {' '}KB

                    </p>


                    {/* =========================================
                        SAVED DETECTION RESULT
                    ========================================= */}

                    {image.analyzed && detectionResult ? (

                      <div className="mt-4 rounded-xl bg-green-50 p-3">

                        <div className="flex items-center gap-2">

                          <CheckCircle2
                            size={16}
                            className="text-green-600"
                          />

                          <span className="text-sm font-semibold text-green-800">
                            Detection Result Saved
                          </span>

                        </div>


                        <p className="mt-2 text-sm text-green-700">

                          {detectionCount}{' '}

                          {detectionCount === 1
                            ? 'animal'
                            : 'animals'}{' '}

                          detected

                        </p>


                        {/* ANIMAL NAMES */}

                        {Array.isArray(
                          detectionResult.detections
                        ) &&
                          detectionResult.detections.length > 0 && (

                            <div className="mt-2 space-y-1">

                              {detectionResult.detections.map(
                                (detection, index) => (

                                  <div
                                    key={`${image.filename}-${detection.class_id ?? 'animal'}-${index}`}
                                    className="flex items-center justify-between text-xs"
                                  >

                                    <span className="font-medium text-gray-700">
                                      {detection.animal ||
                                        'Unknown animal'}
                                    </span>

                                    <span className="text-green-700">

                                      {Math.round(
                                        (detection.confidence ?? 0) *
                                          100
                                      )}

                                      %

                                    </span>

                                  </div>

                                )
                              )}

                            </div>

                          )}

                      </div>

                    ) : (

                      <div className="mt-4 rounded-xl bg-gray-50 p-3">

                        <p className="text-xs text-gray-500">
                          Uploaded image — not analyzed yet.
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>
  );
}