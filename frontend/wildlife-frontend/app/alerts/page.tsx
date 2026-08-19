'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Send, Phone, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

export default function AlertsPage() {
  const [alertType, setAlertType] = useState<'SMS' | 'Email' | 'Telegram' | 'Discord'>('SMS');
  const [recipient, setRecipient] = useState('+91 7879957988');
  const [severity, setSeverity] = useState('Critical');
  const [message, setMessage] = useState('URGENT: Poacher activity detected in Sector 4. Immediate response required.');
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchAlerts = async () => {
    try {
      const data = await apiClient('/api/alerts/');
      setAlerts(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleTypeChange = (type: 'SMS' | 'Email' | 'Telegram' | 'Discord') => {
    setAlertType(type);
    if (type === 'SMS') {
      setRecipient('+91 7879957988');
    } else if (type === 'Email') {
      setRecipient('ashwinchauhan99408@gmail.com');
    } else if (type === 'Telegram') {
      setRecipient('Default (Telegram Bot)');
    } else if (type === 'Discord') {
      setRecipient('Default (Discord Webhook)');
    }
  };

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient('/api/alerts/send', {
        method: 'POST',
        body: JSON.stringify({
          alert_type: alertType,
          recipient: recipient,
          message: message,
          severity: severity
        })
      });
      alert('Alert Dispatched Successfully!');
      fetchAlerts();
    } catch (error) {
      console.error(error);
      alert('Error sending alert.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-8 pt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Send Alert Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-[#121214]/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl h-fit shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold">Dispatch Alert</h2>
          </div>

          <form onSubmit={handleSendAlert} className="space-y-6">
            {/* Alert Type Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-[#1a1a1c] p-1 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => handleTypeChange('SMS')}
                className={`flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all ${alertType === 'SMS' ? 'bg-green-500/20 text-green-400' : 'text-zinc-500 hover:text-white'}`}
              >
                <Phone className="w-4 h-4" /> SMS
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('Email')}
                className={`flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all ${alertType === 'Email' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500 hover:text-white'}`}
              >
                <Mail className="w-4 h-4" /> Email
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('Telegram')}
                className={`flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all ${alertType === 'Telegram' ? 'bg-sky-500/20 text-sky-400' : 'text-zinc-500 hover:text-white'}`}
              >
                <Send className="w-4 h-4" /> Telegram
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('Discord')}
                className={`flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all ${alertType === 'Discord' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-white'}`}
              >
                <ShieldAlert className="w-4 h-4" /> Discord
              </button>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Recipient</label>
              <input 
                type="text" 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-[#1a1a1c] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Severity</label>
              <select 
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-[#1a1a1c] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-green-500"
              >
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-[#1a1a1c] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Dispatching...' : 'Send Alert Now'}
            </button>
          </form>
        </motion.div>

        {/* Alert History Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-[#121214]/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Clock className="w-6 h-6 text-zinc-400" /> Alert History
            </h2>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">No alerts dispatched yet.</td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-zinc-300 text-sm">{new Date(alert.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.alert_type.toUpperCase() === 'SMS' ? 'bg-green-500/20 text-green-400' : 
                          alert.alert_type.toUpperCase() === 'EMAIL' ? 'bg-blue-500/20 text-blue-400' :
                          alert.alert_type.toUpperCase() === 'TELEGRAM' ? 'bg-sky-500/20 text-sky-400' :
                          'bg-indigo-500/20 text-indigo-400'
                        }`}>
                          {alert.alert_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-300">{alert.recipient}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 
                          alert.severity === 'Warning' ? 'bg-orange-500/20 text-orange-400' : 
                          'bg-zinc-500/20 text-zinc-400'
                        }`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {['Sent', 'Delivered'].includes(alert.status) ? (
                          <span className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" /> {alert.status}
                          </span>
                        ) : ['Opened', 'Clicked'].includes(alert.status) ? (
                          <span className="flex items-center gap-1 text-sky-400 text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" /> {alert.status}
                          </span>
                        ) : ['Bounced', 'Blocked', 'Failed', 'Spam Reported'].includes(alert.status) ? (
                          <span className="flex items-center gap-1 text-red-400 text-sm font-semibold">
                            <XCircle className="w-4 h-4" /> {alert.status}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-zinc-400 text-sm font-semibold">
                            <Clock className="w-4 h-4" /> {alert.status}
                          </span>
                        )}
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
