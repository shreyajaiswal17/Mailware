import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, Database } from 'lucide-react';

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
      case 'ERROR': return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'WARNING': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'INFO': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 space-input"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-3 space-input"
          >
            <option value="ALL">All Levels</option>
            <option value="ERROR">Error</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-3 space-button disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button className="px-4 py-3 space-button">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Table */}
      <div className="space-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Level</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded border ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300/80">
                    {log.source}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
            <p className="text-blue-300/60">No logs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Log Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-card p-4">
          <p className="text-blue-300/70 text-sm font-medium">Total Logs</p>
          <p className="text-xl font-bold text-cyan-400">{filteredLogs.length}</p>
        </div>
        <div className="space-card p-4">
          <p className="text-blue-300/70 text-sm font-medium">Error Logs</p>
          <p className="text-xl font-bold text-red-400">{filteredLogs.filter(log => log.level === 'ERROR').length}</p>
        </div>
        <div className="space-card p-4">
          <p className="text-blue-300/70 text-sm font-medium">Warning Logs</p>
          <p className="text-xl font-bold text-yellow-400">{filteredLogs.filter(log => log.level === 'WARNING').length}</p>
        </div>
      </div>

      {/* Data Source Notice */}
      <div className="space-card p-4 border-cyan-500/30 bg-cyan-500/10">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <p className="text-cyan-200 text-sm">
            <strong>Data Source:</strong> Currently showing logs from your app.log file. 
            Connect to Elasticsearch to view live data from all sources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;