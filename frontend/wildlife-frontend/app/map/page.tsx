'use client';
import { useEffect, useState } from 'react';
import { getMapMarkers } from '../../services/api';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Leaflet requires window, so we must dynamically import it with ssr: false
const MapWithNoSSR = dynamic(() => import('../../components/LeafletMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function MapPage() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [mode, setMode] = useState<'markers' | 'heatmap'>('markers');

  useEffect(() => {
    getMapMarkers().then((res) => setMarkers(res.markers)).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-[#eaeaea] p-4 sm:p-8 font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold m-0 text-white">Wildlife Map</h1>
        <nav className="flex gap-4 items-center">
          <a href="/dashboard" className="text-[#4CAF50] hover:text-[#4CAF50]/80 no-underline font-medium text-sm transition-colors">Dashboard</a>
          <a href="/detection" className="text-[#4CAF50] hover:text-[#4CAF50]/80 no-underline font-medium text-sm transition-colors">Detection</a>
        </nav>
      </header>

      <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-stretch sm:items-center mb-4 gap-3">
        <button 
          onClick={() => setMode('markers')}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors cursor-pointer border-none text-white ${mode === 'markers' ? 'bg-[#4CAF50]' : 'bg-zinc-800 hover:bg-zinc-700'}`}
        >
          Pin View
        </button>
        <button 
          onClick={() => setMode('heatmap')}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors cursor-pointer border-none text-white ${mode === 'heatmap' ? 'bg-red-500' : 'bg-zinc-800 hover:bg-zinc-700'}`}
        >
          Heat Map View
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-[#1a1a1a] rounded-xl h-[50vh] md:h-[75vh] overflow-hidden flex items-center justify-center border border-white/10 shadow-lg"
      >
        <MapWithNoSSR markers={markers} mode={mode} />
      </motion.div>
    </div>
  );
}
