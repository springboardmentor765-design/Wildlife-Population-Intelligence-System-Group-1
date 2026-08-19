'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileAudio, Play, Pause, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface AudioDetection {
  species: string;
  confidence: number;
  source_type: string;
  behavior: string;
  endangered_status: string;
}

export default function SoundsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AudioDetection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setError(null);
    if (!selectedFile.type.startsWith('audio/')) {
      setError("Please select a valid audio file.");
      return;
    }
    setFile(selectedFile);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate slight delay for UI polish
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch('http://localhost:8000/api/audio/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process audio.");
      }

      const data = await response.json();
      if (data.success && data.detections && data.detections.length > 0) {
        setResult(data.detections[0]);
      } else {
        throw new Error("No detections found.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-8 pt-16 md:pt-24">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 bg-gradient from-green-400 to-green-600 bg-clip-text text-transparent leading-tight"
          >
            Audio Intelligence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg"
          >
            Upload ecosystem audio recordings to automatically detect wildlife species, analyze behaviors, and assess biodiversity health.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div 
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                isDragging ? 'border-green-500 bg-green-500/10' : 'border-white/20 bg-[#121214]/60 hover:border-green-500/50'
              } backdrop-blur-md cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="audio/*" 
                className="hidden" 
              />
              
              <div className="bg-[#1a1a1c] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/5">
                <Upload className="w-10 h-10 text-green-500" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">Upload Audio File</h3>
              <p className="text-zinc-400 mb-6">Drag and drop your audio file here, or click to browse</p>
              
              <div className="text-xs text-zinc-500 font-mono">
                SUPPORTED FORMATS: WAV, MP3, FLAC
              </div>
            </div>

            {file && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-[#121214]/80 border border-white/10 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-3 bg-green-500/20 rounded-lg shrink-0">
                    <FileAudio className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="truncate">
                    <div className="font-medium text-white truncate">{file.name}</div>
                    <div className="text-xs text-zinc-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                  </div>
                </div>
                
                <button 
                  onClick={handleAnalyze}
                  disabled={isProcessing}
                  className="ml-4 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Activity className="w-4 h-4 animate-pulse" /> Analyzing
                    </>
                  ) : (
                    "Analyze"
                  )}
                </button>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col h-full"
          >
            {isProcessing ? (
              <div className="flex-1 bg-[#121214]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                <div className="flex items-end gap-1 mb-6 h-12">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["20%", "100%", "20%"] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="w-3 bg-green-500 rounded-full"
                    />
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Analyzing Soundscape</h3>
                <p className="text-zinc-400 text-center text-sm">Processing frequencies and isolating bioacoustic signatures...</p>
              </div>
            ) : result ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 bg-[#121214]/60 backdrop-blur-md border border-green-500/30 rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <h3 className="text-2xl font-bold text-white">Detection Complete</h3>
                </div>

                <div className="space-y-6">
                  <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Identified Species</div>
                    <div className="text-2xl font-bold text-green-400">{result.species}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Confidence</div>
                      <div className="text-xl font-semibold text-white">{(result.confidence * 100).toFixed(1)}%</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Behavior</div>
                      <div className="text-xl font-semibold text-white">{result.behavior}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Status</div>
                      <div className="text-lg font-semibold text-white">{result.endangered_status}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${result.endangered_status === 'Endangered' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                      IUCN
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 bg-[#121214]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] text-zinc-500">
                <Activity className="w-16 h-16 mb-4 opacity-20" />
                <p>Awaiting audio file for analysis...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
