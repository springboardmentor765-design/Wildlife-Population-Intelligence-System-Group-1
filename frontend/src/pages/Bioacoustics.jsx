import { useEffect, useState } from 'react';
import {
  Upload,
  Loader2,
  Music,
  Volume2,
  CheckCircle2,
  Clock3,
} from 'lucide-react';

import api from '../services/api';
import { audioService } from '../services/audioService';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AUDIO_RESULTS_KEY = 'wpis_audio_detection_results';

export default function Bioacoustics() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const [recordings, setRecordings] = useState([]);
  const [storedResults, setStoredResults] = useState({});

  /* -------------------------------------------------------
     LOAD SAVED MODEL RESULTS FROM BROWSER STORAGE
  ------------------------------------------------------- */

  const loadSavedResults = () => {
    try {
      const saved = localStorage.getItem(AUDIO_RESULTS_KEY);

      if (!saved) {
        setStoredResults({});
        return;
      }

      const parsed = JSON.parse(saved);

      if (parsed && typeof parsed === 'object') {
        setStoredResults(parsed);
      } else {
        setStoredResults({});
      }
    } catch (err) {
      console.error('Could not load saved audio results:', err);
      setStoredResults({});
    }
  };

  /* -------------------------------------------------------
     SAVE ONE MODEL RESULT
  ------------------------------------------------------- */

  const saveResult = (filename, modelResult) => {
    if (!filename || !modelResult) return;

    try {
      const existing =
        JSON.parse(
          localStorage.getItem(AUDIO_RESULTS_KEY) || '{}'
        ) || {};

      existing[filename] = {
        ...modelResult,
        filename,
        analysedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        AUDIO_RESULTS_KEY,
        JSON.stringify(existing)
      );

      setStoredResults(existing);
    } catch (err) {
      console.error('Could not save audio detection result:', err);
    }
  };

  /* -------------------------------------------------------
     LOAD STORED AUDIO RECORDINGS
  ------------------------------------------------------- */

  const loadRecordings = async () => {
    try {
      const response = await api.get('/audio');

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const formatted = data.map((recording) => {
        let audioUrl = recording.url || '';

        if (audioUrl.startsWith('/')) {
          audioUrl = `${API_URL}${audioUrl}`;
        } else if (!audioUrl.startsWith('http')) {
          audioUrl = `${API_URL}/${audioUrl}`;
        }

        return {
          ...recording,
          audioUrl,
        };
      });

      setRecordings(formatted);
    } catch (err) {
      console.error('Could not load stored recordings:', err);
      setRecordings([]);
    }
  };

  /* -------------------------------------------------------
     INITIAL LOAD
  ------------------------------------------------------- */

  useEffect(() => {
    loadSavedResults();
    loadRecordings();
  }, []);

  /* -------------------------------------------------------
     FILE SELECT
  ------------------------------------------------------- */

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    setFile(selected);
    setResult(null);
    setError('');
  };

  /* -------------------------------------------------------
     RUN AUDIO MODEL
  ------------------------------------------------------- */

  const runAudioModel = async () => {
    if (!file) {
      setError('Please select an audio file.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError('');
    setResult(null);

    try {
      const data = await audioService.upload(file, {
        onProgress: setProgress,
      });

      console.log('AUDIO MODEL RESULT:', data);

      setResult(data);

      /* -----------------------------------------------
         SAVE MODEL OUTPUT AGAINST THIS FILE
      ------------------------------------------------ */

      saveResult(
        data.filename || file.name,
        data
      );

      /* -----------------------------------------------
         REFRESH STORED RECORDINGS
      ------------------------------------------------ */

      await loadRecordings();

    } catch (err) {
      console.error('AUDIO MODEL ERROR:', err);

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Audio classification failed.'
      );
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  /* -------------------------------------------------------
     GET PREDICTION
  ------------------------------------------------------- */

  const getPrediction = (filename) => {
    if (!filename) return null;

    return storedResults[filename] || null;
  };

  /* -------------------------------------------------------
     FORMAT CONFIDENCE
  ------------------------------------------------------- */

  const getConfidence = (prediction) => {
    if (!prediction) return 0;

    const confidence =
      prediction.prediction?.confidence ??
      prediction.confidence ??
      0;

    const value = Number(confidence);

    if (value <= 1) {
      return Math.round(value * 100);
    }

    return Math.round(value);
  };

  /* -------------------------------------------------------
     GET ANIMAL NAME
  ------------------------------------------------------- */

  const getAnimal = (prediction) => {
    if (!prediction) return 'Unknown';

    return (
      prediction.prediction?.animal ||
      prediction.prediction?.class_name ||
      prediction.prediction?.label ||
      prediction.animal ||
      prediction.class_name ||
      prediction.label ||
      'Unknown'
    );
  };

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <p className="text-sm font-medium text-blue-600">
          AI Bioacoustic Analysis
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Wildlife Audio Detection
        </h1>

        <p className="mt-2 text-gray-500">
          Upload an animal recording and run the audio
          classification model.
        </p>
      </div>


      {/* =====================================================
          UPLOAD
      ===================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-gray-900">
          Upload Audio
        </h2>

        <label
          htmlFor="wildlife-audio"
          className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-10 hover:bg-gray-50"
        >

          <Music
            size={42}
            className="text-gray-400"
          />

          <p className="mt-3 font-medium text-gray-700">
            Choose an animal recording
          </p>

          <p className="mt-1 text-sm text-gray-400">
            WAV, MP3 or other supported audio format
          </p>

          <input
            id="wildlife-audio"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />

        </label>


        {/* SELECTED FILE */}

        {file && (
          <div className="mt-5 rounded-xl bg-gray-50 p-5">

            <div className="flex items-center gap-3">

              <Volume2
                size={22}
                className="text-blue-600"
              />

              <div>

                <p className="font-medium text-gray-900">
                  {file.name}
                </p>

                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            </div>


            <audio
              controls
              src={URL.createObjectURL(file)}
              className="mt-4 w-full"
            />

          </div>
        )}


        {/* RUN MODEL BUTTON */}

        <button
          onClick={runAudioModel}
          disabled={!file || uploading}
          className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {uploading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Analysing... {progress}%
            </>
          ) : (
            <>
              <Upload size={18} />

              Run Audio Detection
            </>
          )}

        </button>


        {/* ERROR */}

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

      </div>


      {/* =====================================================
          CURRENT DETECTION RESULT
      ===================================================== */}

      {result && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="flex items-center gap-2">

            <CheckCircle2
              size={24}
              className="text-green-600"
            />

            <h2 className="text-xl font-semibold text-gray-900">
              Audio Detection Result
            </h2>

          </div>


          <div className="mt-5 grid gap-5 md:grid-cols-2">

            {/* ANIMAL */}

            <div className="rounded-xl bg-blue-50 p-6">

              <p className="text-sm text-blue-600">
                Detected animal
              </p>

              <p className="mt-2 text-4xl font-bold text-blue-900">
                {getAnimal(result)}
              </p>

            </div>


            {/* CONFIDENCE */}

            <div className="rounded-xl bg-green-50 p-6">

              <p className="text-sm text-green-600">
                Confidence
              </p>

              <p className="mt-2 text-4xl font-bold text-green-900">
                {getConfidence(result)}%
              </p>

            </div>

          </div>


          {/* FILE */}

          <div className="mt-5 rounded-xl bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
              Analysed file
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {result.filename || file?.name}
            </p>

          </div>

        </div>
      )}


      {/* =====================================================
          STORED AUDIO RECORDINGS
      ===================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3">

            <Volume2
              size={28}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2 className="text-2xl font-semibold text-gray-900">
              Stored Audio Recordings
            </h2>

            <p className="text-gray-500">
              Previously uploaded wildlife recordings
            </p>

          </div>

        </div>


        {recordings.length === 0 ? (

          <p className="mt-6 rounded-xl bg-gray-50 p-5 text-gray-500">
            No stored recordings yet.
          </p>

        ) : (

          <div className="mt-6 space-y-5">

            {recordings.map((recording, index) => {

              const filename =
                recording.filename ||
                recording.name ||
                `Recording ${index + 1}`;

              const savedResult =
                getPrediction(filename);

              const animal =
                getAnimal(savedResult);

              const confidence =
                getConfidence(savedResult);

              const wasAnalysed =
                !!savedResult;

              return (

                <div
                  key={`${filename}-${index}`}
                  className="rounded-2xl border bg-gray-50 p-5"
                >

                  {/* RECORDING HEADER */}

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="rounded-xl bg-white p-3 shadow-sm">

                        <Music
                          size={24}
                          className="text-blue-600"
                        />

                      </div>

                      <div>

                        <p className="text-lg font-semibold text-gray-900">
                          {filename}
                        </p>

                        <p className="text-sm text-gray-500">
                          {Math.round(
                            (recording.size || 0) / 1024
                          )}{' '}
                          KB
                        </p>

                      </div>

                    </div>


                    {/* ANALYSIS STATUS */}

                    {wasAnalysed ? (

                      <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                        <CheckCircle2 size={17} />

                        Analysed

                      </div>

                    ) : (

                      <div className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">

                        <Clock3 size={17} />

                        Not analysed

                      </div>

                    )}

                  </div>


                  {/* AUDIO PLAYER */}

                  <audio
                    controls
                    src={recording.audioUrl}
                    className="mt-5 w-full"
                  />


                  {/* MODEL OUTPUT */}

                  {wasAnalysed ? (

                    <div className="mt-5 grid gap-4 md:grid-cols-2">

                      {/* DETECTED ANIMAL */}

                      <div className="rounded-xl bg-blue-50 p-5">

                        <p className="text-sm font-medium text-blue-600">
                          Detected animal
                        </p>

                        <p className="mt-2 text-3xl font-bold text-blue-900">
                          {animal}
                        </p>

                      </div>


                      {/* CONFIDENCE */}

                      <div className="rounded-xl bg-green-50 p-5">

                        <p className="text-sm font-medium text-green-600">
                          Model confidence
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-900">
                          {confidence}%
                        </p>

                      </div>

                    </div>

                  ) : (

                    <div className="mt-5 rounded-xl bg-white p-4">

                      <p className="text-sm text-gray-500">
                        Model output
                      </p>

                      <p className="mt-1 text-gray-700">
                        This recording has not been analysed yet.
                      </p>

                    </div>

                  )}

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}