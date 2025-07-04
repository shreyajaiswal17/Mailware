import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Mail, Database, Zap } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLogs: 1247,
    errorLogs: 23,
    alertsSent: 8,
    uptime: '99.8%'
  });

  const logData = [
    { time: '00:00', errors: 2, warnings: 5, info: 45 },
    { time: '04:00', errors: 1, warnings: 3, info: 38 },
    { time: '08:00', errors: 5, warnings: 8, info: 62 },
    { time: '12:00', errors: 3, warnings: 6, info: 55 },
    { time: '16:00', errors: 7, warnings: 12, info: 48 },
    { time: '20:00', errors: 4, warnings: 7, info: 41 }
  ];

  const alertData = [
    { name: 'Critical', value: 3, color: '#ef4444' },
    { name: 'Error', value: 15, color: '#f97316' },
    { name: 'Warning', value: 28, color: '#eab308' },
    { name: 'Info', value: 54, color: '#06b6d4' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300/70 text-sm font-medium">Total Logs</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.totalLogs.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-cyan-500/20 rounded-lg neon-border">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="space-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300/70 text-sm font-medium">Error Logs</p>
              <p className="text-2xl font-bold text-red-400">{stats.errorLogs}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg neon-border">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="space-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300/70 text-sm font-medium">Alerts Sent</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.alertsSent}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg neon-border">
              <Mail className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="space-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300/70 text-sm font-medium">System Uptime</p>
              <p className="text-2xl font-bold text-green-400">{stats.uptime}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg neon-border">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log Trends */}
        <div className="space-card p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 neon-text">Log Trends (24h)</h3>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={logData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
                <XAxis dataKey="time" stroke="#93c5fd" />
                <YAxis stroke="#93c5fd" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Bar dataKey="errors" fill="#ef4444" />
                <Bar dataKey="warnings" fill="#f59e0b" />
                <Bar dataKey="info" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Distribution */}
        <div className="space-card p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 neon-text">Alert Distribution</h3>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {alertData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="space-card p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 neon-text">Recent Alerts</h3>
        <div className="space-y-3">
          {[
            { time: '2025-01-14 17:03:00', level: 'ERROR', message: 'Breach simulation detected', source: 'app.log' },
            { time: '2025-01-14 16:58:00', level: 'ERROR', message: 'Manual breach attempt', source: 'app.log' },
            { time: '2025-01-14 16:52:00', level: 'ERROR', message: 'Breach simulation', source: 'app.log' },
            { time: '2025-01-14 12:25:00', level: 'ERROR', message: 'Firewall breach detected', source: 'app.log' }
          ].map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-blue-500/20 hover:bg-slate-700/40 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${alert.level === 'ERROR' ? 'bg-red-400' : 'bg-yellow-400'}`} style={{
                  boxShadow: alert.level === 'ERROR' ? '0 0 8px #f87171' : '0 0 8px #fbbf24'
                }}></div>
                <div>
                  <p className="text-blue-100 font-medium">{alert.message}</p>
                  <p className="text-blue-300/60 text-sm">{alert.source} • {alert.time}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-medium ${
                alert.level === 'ERROR' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
              }`}>
                {alert.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Notice */}
      <div className="space-card p-4 border-yellow-500/30 bg-yellow-500/10">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <p className="text-yellow-200 text-sm">
            <strong>Note:</strong> Dashboard shows demo data. Recent alerts are from your actual app.log file. 
            Charts will show real data once connected to live Elasticsearch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;