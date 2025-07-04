import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

const LogViewer = () => {
  const [logs, setLogs] = useState([
    { id: 1, timestamp: '2025-01-14 17:03:00', level: 'ERROR', source: 'app.log', message: 'Breach simulation detected' },
    { id: 2, timestamp: '2025-01-14 16:58:00', level: 'ERROR', source: 'app.log', message: 'Manual breach attempt' },
    { id: 3, timestamp: '2025-01-14 16:52:00', level: 'ERROR', source: 'app.log', message: 'Breach simulation' },
    { id: 4, timestamp: '2025-01-14 12:25:00', level: 'ERROR', source: 'app.log', message: 'Firewall breach detected' },
    { id: 5, timestamp: '2025-01-14 11:00:00', level: 'ERROR', source: 'app.log', message: 'Admin login failed' },
    { id: 6, timestamp: '2025-01-14 10:13:22', level: 'WARNING', source: 'app.log', message: 'Slow response' },
    { id: 7, timestamp: '2025-01-14 10:12:05', level: 'ERROR', source: 'app.log', message: 'Unauthorized login attempt' },
    { id: 8, timestamp: '2025-01-14 10:10:00', level: 'INFO', source: 'app.log', message: 'Application started' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'WARNING': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'INFO': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="ALL">All Levels</option>
            <option value="ERROR">Error</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 font-mono">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                    {log.source}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">No logs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Log Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <p className="text-white/70 text-sm">Total Logs</p>
          <p className="text-xl font-bold text-white">{filteredLogs.length}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <p className="text-white/70 text-sm">Error Logs</p>
          <p className="text-xl font-bold text-red-400">{filteredLogs.filter(log => log.level === 'ERROR').length}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <p className="text-white/70 text-sm">Warning Logs</p>
          <p className="text-xl font-bold text-yellow-400">{filteredLogs.filter(log => log.level === 'WARNING').length}</p>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;