'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/api';
import { motion } from 'framer-motion';
import SpeciesDistribution3D from '../../components/SpeciesDistribution3D';
import { Activity, Camera, PawPrint, BarChart3, Plane, Satellite, Mic, MapPin, ThermometerSun, Download, Bell } from 'lucide-react';
import { API_BASE_URL } from '../../lib/apiClient';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<string>('Administrator');

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center text-white">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          Loading analytical data...
        </motion.div>
      </div>
    );
  }

  // Derived metrics
  const topSpecies = stats.species_counts && stats.species_counts.length > 0
    ? stats.species_counts.reduce((prev: any, current: any) => (prev.count > current.count) ? prev : current)
    : { species: 'None', count: 0 };

  const chartData = stats.species_counts || [];

  return (
    <div className="min-h-screen bg-transparent text-white p-8 font-sans selection:bg-green-500/30 relative">
      {/* DASHBOARD BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: -2,
          opacity: 0.15
        }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-world-map-composed-of-binary-codes-4022-large.mp4" type="video/mp4" />
      </video>
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground text-zinc-400 mt-1">Overview of wildlife intelligence and tracking metrics.</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500">View as:</span>
              <select
                className="bg-[#1a1a1c] border border-white/10 text-white text-sm rounded-md px-3 py-1.5 outline-none focus:border-green-500"
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
              >
                <option>Administrator</option>
                <option>Conservation Officer</option>
                <option>Wildlife Researcher</option>
                <option>Forest Department Officer</option>
              </select>
            </div>
            <nav className="flex flex-wrap gap-3 md:gap-4 items-center w-full md:w-auto">
              <a href="/detection" className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors">Detection Mode</a>
              <a href="/map" className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors">Global Map</a>
              <a
                href={`${API_BASE_URL}/api/reports/export/excel`}
                target="_blank"
                className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export Report
              </a>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-6">

          {/* Phase 4: Notification & Alerts System (Visible to Admin, Conservation Officer, Forest Dept) */}
          {(activeRole === 'Administrator' || activeRole === 'Conservation Officer' || activeRole === 'Forest Department Officer') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-950/30 border border-red-500/50 rounded-xl p-4 flex items-start gap-4 shadow-sm"
            >
              <div className="mt-0.5 bg-red-500/20 p-2 rounded-full">
                <Bell className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-red-400 font-semibold text-sm uppercase tracking-wider mb-1">Critical Alerts</h3>
                <div className="space-y-1">
                  <p className="text-zinc-200 text-sm">⚠️ <span className="font-medium text-white">Endangered Species Detected:</span> Rhinoceros detected in Sector 4. Anti-poaching teams notified.</p>
                  <p className="text-zinc-200 text-sm">⚠️ <span className="font-medium text-white">Habitat Degradation:</span> Forest density dropped by 12% in Sector 7 over the last 30 days.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Ecosystem Health Score Banner */}
          {stats.intelligence && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl border border-white/10 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between text-left ${stats.intelligence.conservation_status === 'Excellent' ? 'bg-green-900/40 border-green-500/50' :
                  stats.intelligence.conservation_status === 'Healthy' ? 'bg-emerald-900/40 border-emerald-500/50' :
                    stats.intelligence.conservation_status === 'Moderate Concern' ? 'bg-yellow-900/40 border-yellow-500/50' :
                      stats.intelligence.conservation_status === 'Vulnerable' ? 'bg-orange-900/40 border-orange-500/50' :
                        'bg-red-900/40 border-red-500/50'
                }`}
            >
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Ecosystem Health Score</h2>
                <p className="text-zinc-300">Current Status: <span className="font-bold">{stats.intelligence.conservation_status}</span></p>
              </div>
              <div className="mt-4 md:mt-0 grid grid-cols-2 lg:flex lg:flex-row lg:items-center gap-4 sm:gap-6 w-full md:w-auto justify-between sm:justify-start">
                <div className="text-center bg-black/20 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                  <p className="text-sm text-zinc-400">Diversity</p>
                  <p className="text-lg font-bold text-white">{stats.intelligence.species_diversity_score}%</p>
                </div>
                <div className="text-center bg-black/20 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                  <p className="text-sm text-zinc-400">Habitat</p>
                  <p className="text-lg font-bold text-white">{stats.intelligence.habitat_quality_score}%</p>
                </div>
                <div className="text-center bg-black/20 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                  <p className="text-sm text-zinc-400">Endangered</p>
                  <p className="text-lg font-bold text-white">{stats.intelligence.endangered_score}%</p>
                </div>
                <div className="text-center bg-black/20 sm:bg-transparent p-3 sm:p-0 rounded-lg col-span-2 lg:col-span-1 lg:ml-4 lg:pl-6 lg:border-l border-white/20">
                  <p className="text-sm text-zinc-300 uppercase tracking-wider">Overall Score</p>
                  <p className="text-4xl font-extrabold text-white">{stats.intelligence.ecosystem_health_score}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card delay={0.1}>
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-zinc-400">Total Detections</h3>
                <Activity className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.total_detections}</div>
              <p className="text-xs text-zinc-500 mt-1">+12% from last month</p>
            </Card>

            <Card delay={0.2}>
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-zinc-400">Top Species</h3>
                <PawPrint className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-white capitalize">{topSpecies.species}</div>
              <p className="text-xs text-zinc-500 mt-1">{topSpecies.count} total sightings</p>
            </Card>

            <Card delay={0.3}>
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-zinc-400">Active Sensors</h3>
                <Camera className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-white">24</div>
              <p className="text-xs text-zinc-500 mt-1">Across 3 national parks</p>
            </Card>

            <Card delay={0.4}>
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-zinc-400">Model Accuracy</h3>
                <BarChart3 className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-white">94.2%</div>
              <p className="text-xs text-zinc-500 mt-1">Average YOLO confidence</p>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

            {/* Chart Section (Visible to Admin, Researcher, Conservation Officer) */}
            {(activeRole === 'Administrator' || activeRole === 'Wildlife Researcher' || activeRole === 'Conservation Officer') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`rounded-xl border border-white/10 bg-[#121214] p-6 shadow-sm ${activeRole === 'Wildlife Researcher' ? 'lg:col-span-3' : 'lg:col-span-2'}`}
              >
                <div className="flex flex-col space-y-1.5 pb-6">
                  <h3 className="font-semibold leading-none tracking-tight">Species Distribution</h3>
                  <p className="text-sm text-zinc-400">Sightings grouped by identified species</p>
                </div>

                <div className="h-[400px] w-full rounded-lg overflow-hidden border border-zinc-800/50 relative group bg-[#09090b]">
                  <SpeciesDistribution3D data={chartData} />
                  <div className="absolute bottom-3 right-3 text-[11px] text-zinc-400 bg-black/80 px-2.5 py-1.5 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md border border-white/5">
                    Drag to rotate • Scroll to zoom
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recent Activity Feed (Visible to Admin, Researcher, Forest Dept) */}
            {(activeRole === 'Administrator' || activeRole === 'Wildlife Researcher' || activeRole === 'Forest Department Officer') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className={`rounded-xl border border-white/10 bg-[#121214] p-6 shadow-sm ${activeRole === 'Forest Department Officer' ? 'lg:col-span-3' : 'lg:col-span-1'}`}
              >
                <div className="flex flex-col space-y-1.5 pb-6">
                  <h3 className="font-semibold leading-none tracking-tight">Recent Detections</h3>
                  <p className="text-sm text-zinc-400">Latest sensor activities</p>
                </div>

                <div className="space-y-6">
                  {stats.recent_activity.length > 0 ? stats.recent_activity.map((act: any, i: number) => {
                    let SourceIcon = Camera;
                    if (act.source_type === 'Drone Image') SourceIcon = Plane;
                    if (act.source_type === 'Satellite Image') SourceIcon = Satellite;
                    if (act.source_type === 'Audio Recording') SourceIcon = Mic;
                    if (act.source_type === 'GPS Device Data') SourceIcon = MapPin;
                    if (act.source_type === 'Environmental Sensor') SourceIcon = ThermometerSun;
                    if (act.source_type === 'Camera Trap Image') SourceIcon = Camera;

                    return (
                      <div key={act.id} className="flex items-center">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                          <SourceIcon className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-4 space-y-1 flex-1 min-w-0">
                          <p className="text-sm font-medium leading-none text-white capitalize truncate">{act.species_name}</p>
                          <p className="text-xs text-zinc-400">
                            Confidence: {Math.round(act.confidence * 100)}%
                          </p>
                        </div>
                        <div className="text-xs text-zinc-500">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  }) : (
                    <p className="text-sm text-zinc-500">No recent activity found.</p>
                  )}
                </div>
              </motion.div>
            )}

          </div>

          {/* Environmental Context Section */}
          {stats.environmental_metrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 rounded-xl border border-white/10 bg-[#121214] p-6 shadow-sm"
            >
              <div className="flex flex-col space-y-1.5 pb-6">
                <h3 className="font-semibold leading-none tracking-tight">Environmental Context</h3>
                <p className="text-sm text-zinc-400">Average telemetry data from environmental sensors</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                <div>
                  <p className="text-sm font-medium text-zinc-400 mb-2">Vegetation Cover</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{stats.environmental_metrics.vegetation_cover}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 mt-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${stats.environmental_metrics.vegetation_cover}%` }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-zinc-400 mb-2">Water Availability</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{stats.environmental_metrics.water_availability}</span>
                    <span className="text-sm text-zinc-500 pb-1">Index</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 mt-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${Math.min(stats.environmental_metrics.water_availability, 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-zinc-400 mb-2">Temperature</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{stats.environmental_metrics.temperature}°C</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 mt-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full" style={{ width: `${Math.min((stats.environmental_metrics.temperature / 50) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-zinc-400 mb-2">Forest Density</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{stats.environmental_metrics.forest_density}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 mt-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: `${stats.environmental_metrics.forest_density}%` }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-zinc-400 mb-2">Land Use</p>
                  <div className="flex items-end gap-2 h-full pb-3">
                    <span className={`text-lg font-bold ${stats.environmental_metrics.land_use_changes === 'Deforestation' ? 'text-red-400' : 'text-green-400'}`}>
                      {stats.environmental_metrics.land_use_changes}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Recommendations Panel (Visible to Admin, Forest Dept, Conservation Officer) */}
          {(activeRole === 'Administrator' || activeRole === 'Forest Department Officer' || activeRole === 'Conservation Officer') && stats.intelligence && stats.intelligence.recommendations && stats.intelligence.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 rounded-xl border border-white/10 bg-[#121214] p-6 shadow-sm"
            >
              <div className="flex flex-col space-y-1.5 pb-4">
                <h3 className="font-semibold leading-none tracking-tight">Conservation Recommendations</h3>
                <p className="text-sm text-zinc-400">AI-generated strategies based on current ecosystem scores</p>
              </div>
              <ul className="space-y-3">
                {stats.intelligence.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start bg-blue-900/20 p-3 rounded-lg border border-blue-500/20">
                    <span className="text-blue-400 mr-3 mt-0.5">•</span>
                    <span className="text-sm text-zinc-200">{rec}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}

// Reusable Shadcn-style Card Component
function Card({ children, delay }: { children: React.ReactNode, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl border border-white/10 bg-[#121214] p-6 shadow-sm flex flex-col"
    >
      {children}
    </motion.div>
  );
}
