'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, FileSpreadsheet, Eye, Plus } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/reports');
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleExportExcel = () => {
    window.location.href = 'http://localhost:8000/api/reports/export/excel';
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-8 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent leading-tight"
            >
              Intelligence Reports
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg max-w-2xl"
            >
              Automated biodiversity reports, survey summaries, and raw data exports for stakeholders.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row w-full md:w-auto gap-3"
          >
            <button
              onClick={handleExportExcel}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-xl font-medium transition-colors w-full sm:w-auto"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Export to Excel
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#1a1a1c] border border-white/10 hover:border-white/30 text-white px-5 py-3 rounded-xl font-medium transition-colors w-full sm:w-auto">
              <Plus className="w-5 h-5" />
              New Report
            </button>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#121214]/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              Recent Reports
            </h2>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 font-semibold text-zinc-300">ID</th>
                  <th className="p-4 font-semibold text-zinc-300">Title</th>
                  <th className="p-4 font-semibold text-zinc-300">Content Snippet</th>
                  <th className="p-4 font-semibold text-zinc-300">Date Generated</th>
                  <th className="p-4 font-semibold text-zinc-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      Loading reports...
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      No reports generated yet.
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-zinc-400">#{report.id}</td>
                      <td className="p-4 font-medium text-white">{report.title}</td>
                      <td className="p-4 text-zinc-400 max-w-xs truncate">{report.content}</td>
                      <td className="p-4 text-zinc-400">{new Date(report.created_at).toLocaleDateString()}</td>
                      <td className="p-4 flex justify-end gap-2">
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
