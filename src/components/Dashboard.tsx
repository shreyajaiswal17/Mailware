import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Mail } from 'lucide-react';

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
    { name: 'Info', value: 54, color: '#22c55e' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Logs</p>
              <p className="text-2xl font-bold text-white">{stats.totalLogs.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Error Logs</p>
              <p className="text-2xl font-bold text-white">{stats.errorLogs}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Alerts Sent</p>
              <p className="text-2xl font-bold text-white">{stats.alertsSent}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Mail className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">System Uptime</p>
              <p className="text-2xl font-bold text-white">{stats.uptime}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log Trends */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Log Trends (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={logData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="errors" fill="#ef4444" />
              <Bar dataKey="warnings" fill="#f97316" />
              <Bar dataKey="info" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alert Distribution */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Alert Distribution</h3>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {[
            { time: '2025-01-14 17:03:00', level: 'ERROR', message: 'Breach simulation detected', source: 'app.log' },
            { time: '2025-01-14 16:58:00', level: 'ERROR', message: 'Manual breach attempt', source: 'app.log' },
            { time: '2025-01-14 16:52:00', level: 'ERROR', message: 'Breach simulation', source: 'app.log' },
            { time: '2025-01-14 12:25:00', level: 'ERROR', message: 'Firewall breach detected', source: 'app.log' }
          ].map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${alert.level === 'ERROR' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                <div>
                  <p className="text-white font-medium">{alert.message}</p>
                  <p className="text-white/60 text-sm">{alert.source} • {alert.time}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                alert.level === 'ERROR' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {alert.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;