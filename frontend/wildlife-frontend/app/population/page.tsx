'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Activity, Map as MapIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PopulationAnalytics() {
  const [trends, setTrends] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendsRes, forecastRes, anomaliesRes] = await Promise.all([
          fetch('http://localhost:8000/api/population/trends'),
          fetch('http://localhost:8000/api/population/forecast'),
          fetch('http://localhost:8000/api/population/anomalies')
        ]);

        const trendsData = await trendsRes.json();
        const forecastData = await forecastRes.json();
        const anomaliesData = await anomaliesRes.json();

        // Convert the backend format to Recharts format
        if (trendsData && trendsData.labels && trendsData.datasets) {
          const formattedTrends = trendsData.labels.map((label: string, index: number) => {
            const point: any = { name: label };
            trendsData.datasets.forEach((dataset: any) => {
              point[dataset.label] = dataset.data[index];
            });
            return point;
          });
          setTrends({ data: formattedTrends, colors: trendsData.datasets.map((d: any) => ({ key: d.label, color: d.borderColor })) });
        }

        if (forecastData && forecastData.labels && forecastData.datasets) {
          const formattedForecast = forecastData.labels.map((label: string, index: number) => {
            const point: any = { name: label };
            forecastData.datasets.forEach((dataset: any) => {
              point[dataset.label] = dataset.data[index];
            });
            return point;
          });
          setForecast({ data: formattedForecast, colors: forecastData.datasets.map((d: any) => ({ key: d.label, color: d.borderColor })) });
        }

        setAnomalies(anomaliesData.anomalies || []);
      } catch (error) {
        console.error("Failed to fetch population data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-white">
        <Activity className="w-12 h-12 text-green-500 animate-pulse mb-4" />
        <p className="text-zinc-400">Loading Intelligence Models...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-8 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent leading-tight"
          >
            Population Intelligence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg max-w-3xl"
          >
            AI-driven population forecasting, anomaly detection, and historical trend analysis across monitored species.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Charts Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#121214]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-bold">Historical Population Trends</h2>
              </div>
              <div className="h-72 w-full">
                {trends && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                      <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#121214', borderColor: '#3f3f46', borderRadius: '8px' }} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      {trends.colors.map((c: any) => (
                        <Line key={c.key} type="monotone" dataKey={c.key} stroke={c.color} strokeWidth={3} dot={{ r: 4, fill: '#121214', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#121214]/60 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Activity className="w-32 h-32 text-blue-500" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Activity className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold">AI Forecasting Engine (Next 12 Months)</h2>
              </div>
              <div className="h-72 w-full relative z-10">
                {forecast && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecast.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                      <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#121214', borderColor: '#3f3f46', borderRadius: '8px' }} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      {forecast.colors.map((c: any) => (
                        <Line key={c.key} type="monotone" dataKey={c.key} stroke={c.color} strokeWidth={3} strokeDasharray="5 5" dot={false} activeDot={{ r: 6 }} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Anomalies */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h2 className="text-xl font-bold text-red-100">Critical Anomalies</h2>
                </div>
                <span className="bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full">
                  {anomalies.length} Detected
                </span>
              </div>

              <div className="space-y-4">
                {anomalies.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No critical anomalies detected recently.</p>
                ) : (
                  anomalies.map((anomaly, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="bg-[#1a1a1c] border border-white/5 rounded-xl p-4 cursor-pointer hover:border-red-500/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold text-red-400">{anomaly.type}</span>
                        <span className="text-xs text-zinc-500">{anomaly.date}</span>
                      </div>
                      <div className="font-semibold text-white mb-1">{anomaly.species}</div>
                      <p className="text-xs text-zinc-400 mb-3">{anomaly.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`px-2 py-1 rounded-md ${anomaly.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          Severity: {anomaly.severity}
                        </span>
                        <span className="text-zinc-500">{anomaly.status}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#121214]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-green-500/50 transition-colors cursor-pointer group"
            >
               <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-1 group-hover:text-green-400 transition-colors">Species Distribution Map</h2>
                  <p className="text-xs text-zinc-400">View real-time heatmaps</p>
                </div>
                <div className="bg-white/5 p-3 rounded-full group-hover:bg-green-500/20 transition-colors">
                  <MapIcon className="w-5 h-5 text-zinc-400 group-hover:text-green-500" />
                </div>
               </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
