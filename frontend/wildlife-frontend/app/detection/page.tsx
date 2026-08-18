'use client';
import { useState, useCallback } from 'react';
import { uploadImageForDetection } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileImage, FileAudio, FileText, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function Detection() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceType, setSourceType] = useState<string>('Camera Trap Image');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    accept: sourceType === 'Audio Recording' 
      ? { 'audio/*': [] } 
      : (sourceType === 'GPS Device Data' || sourceType === 'Environmental Sensor' 
        ? { 'text/csv': ['.csv'], 'application/json': ['.json'], 'text/plain': ['.txt'] } 
        : { 'image/*': [] })
  });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await uploadImageForDetection(file, sourceType);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert('Failed to process data through the pipeline.');
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = () => {
    if (sourceType === 'Audio Recording') return <FileAudio className="w-12 h-12 text-zinc-600 mb-4" />;
    if (sourceType === 'GPS Device Data' || sourceType === 'Environmental Sensor') return <FileText className="w-12 h-12 text-zinc-600 mb-4" />;
    return <FileImage className="w-12 h-12 text-zinc-600 mb-4" />;
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8 mt-4 md:mt-6">
        
        <header className="flex flex-col space-y-2 pb-6 border-b border-white/10">
          <h1 className="text-3xl font-bold tracking-tight">AI Inference Pipeline</h1>
          <p className="text-zinc-400">Upload sensory data to run real-time YOLOv11 and acoustic classifications.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-white/10 bg-[#121214] p-6 shadow-sm flex flex-col h-full"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-500" /> Data Ingestion
            </h2>
            
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Data Source</label>
                <select 
                  value={sourceType}
                  onChange={(e) => {
                    setSourceType(e.target.value);
                    setFile(null); // Reset file when changing type
                  }}
                  className="w-full bg-[#1a1a1c] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Camera Trap Image">Camera Trap Image</option>
                  <option value="Drone Image">Drone Image</option>
                  <option value="Satellite Image">Satellite Image</option>
                  <option value="Audio Recording">Audio Recording</option>
                  <option value="GPS Device Data">GPS Device Data</option>
                  <option value="Environmental Sensor">Environmental Sensor</option>
                </select>
              </div>
              
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[200px] sm:min-h-[250px]
                  ${isDragActive ? 'border-green-500 bg-green-500/5' : 'border-zinc-700 hover:border-zinc-500 bg-[#1a1a1c]'}`}
              >
                <input {...getInputProps()} />
                {getSourceIcon()}
                {isDragActive ? (
                  <p className="text-green-500 font-medium">Drop the file here ...</p>
                ) : (
                  <div>
                    <p className="text-zinc-300 font-medium mb-1">Drag & drop your file here</p>
                    <p className="text-xs text-zinc-500">or click to browse from computer</p>
                  </div>
                )}
                
                {file && (
                  <div className="mt-4 p-2 bg-green-500/20 text-green-400 rounded-md text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {file.name}
                  </div>
                )}
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: file && !loading ? 1.02 : 1 }}
              whileTap={{ scale: file && !loading ? 0.98 : 1 }}
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full mt-8 p-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors
                ${loading || !file ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]'}`}
            >
              {loading ? (
                <>
                  <Activity className="w-5 h-5 animate-pulse" /> Processing Pipeline...
                </>
              ) : (
                <>
                  Run Intelligence Engine
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Results Section */}
          <div className="h-full">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-white/5 bg-[#121214]/50 p-6 h-full flex flex-col items-center justify-center text-center border-dashed"
                >
                  <Activity className="w-12 h-12 text-zinc-800 mb-4" />
                  <p className="text-zinc-500 font-medium">Awaiting Data Ingestion</p>
                  <p className="text-sm text-zinc-600 mt-2 max-w-[250px]">Upload a file on the left to run it through the YOLOv11 and heuristic engines.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl border border-green-500/30 bg-[#121214] p-6 h-full flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(22,163,74,0.1)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-zinc-800 border-t-green-500 rounded-full animate-spin mb-6"></div>
                    <h3 className="text-lg font-semibold text-white mb-2">Analyzing Data Streams</h3>
                    <p className="text-sm text-zinc-400">Extracting bounding boxes, classifying behaviors, and checking conservation status...</p>
                  </div>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl border border-white/10 bg-[#121214] p-6 shadow-sm h-full flex flex-col"
                >
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-500" /> Engine Output
                  </h2>
                  <p className="text-sm text-zinc-400 pb-6 border-b border-white/10">Processed 1 file via {sourceType}</p>
                  
                  <div className="py-6 flex-1">
                    <div className="flex items-end justify-between mb-6">
                      <p className="text-zinc-400 font-medium">Total Detections</p>
                      <p className="text-4xl font-bold text-white">{result.total_detections}</p>
                    </div>

                    {result.total_detections === 0 ? (
                      <div className="p-4 bg-zinc-900/50 rounded-lg text-center border border-zinc-800">
                        <p className="text-zinc-500">No wildlife detected in this sample.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[250px] sm:max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {result.detections?.map((d: any, i: number) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#1a1a1c] p-4 rounded-lg border border-white/5 flex flex-col gap-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <strong className="text-green-400 text-lg capitalize block leading-tight">{d.species}</strong>
                                {d.iucn_status && (
                                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                                    d.iucn_status.includes('Endangered') || d.iucn_status.includes('Vulnerable') 
                                      ? 'bg-red-500/20 text-red-400 border border-red-500/20' 
                                      : 'bg-zinc-800 text-zinc-400'
                                  }`}>
                                    {d.iucn_status}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="text-white font-mono font-medium">{Math.round(d.confidence * 100)}%</span>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Confidence</p>
                              </div>
                            </div>

                            {d.behavior && (
                              <div className="mt-2 pt-2 border-t border-white/5">
                                <p className="text-xs text-zinc-400"><span className="text-zinc-500">Inferred Behavior:</span> {d.behavior}</p>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
