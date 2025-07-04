import React, { useState, useEffect } from 'react';
import { Server, Database, Mail, Eye, RefreshCw, CheckCircle, XCircle, AlertTriangle, Zap } from 'lucide-react';

interface SystemStatusProps {
  systemStatus: {
    elasticsearch: string;
    emailService: string;
    logWatcher: string;
  };
}

const SystemStatus: React.FC<SystemStatusProps> = ({ systemStatus }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'border-green-500/40 bg-green-500/10';
      case 'offline':
        return 'border-red-500/40 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/40 bg-yellow-500/10';
      default:
        return 'border-gray-500/40 bg-gray-500/10';
    }
  };

  const services = [
    {
      name: 'Elasticsearch',
      description: 'Log storage and search engine',
      status: systemStatus.elasticsearch,
      icon: Database,
      details: {
        host: 'http://localhost:9200',
        index: 'logs',
        documents: '1,247'
      }
    },
    {
      name: 'Email Service',
      description: 'SMTP email alerting system',
      status: systemStatus.emailService,
      icon: Mail,
      details: {
        server: 'smtp.gmail.com',
        port: '587',
        lastAlert: '2 hours ago'
      }
    },
    {
      name: 'Log Watcher',
      description: 'Real-time log monitoring',
      status: systemStatus.logWatcher,
      icon: Eye,
      details: {
        sources: 'app.log, Windows Events',
        interval: '10 seconds',
        lastCheck: 'Just now'
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-cyan-400 neon-text">System Status</h2>
          <p className="text-blue-300/70">Monitor the health of all Mailware components</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 space-button disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Status */}
      <div className="space-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-cyan-400 neon-text">Overall System Health</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{boxShadow: '0 0 10px #22c55e'}}></div>
            <span className="text-green-400 font-medium">All Systems Operational</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">99.8%</p>
            <p className="text-blue-300/70 text-sm">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">3/3</p>
            <p className="text-blue-300/70 text-sm">Services Online</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">0</p>
            <p className="text-blue-300/70 text-sm">Critical Issues</p>
          </div>
        </div>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.name}
              className={`space-card p-6 ${getStatusColor(service.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600/30 rounded-lg neon-border">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-200">{service.name}</h4>
                    <p className="text-blue-300/60 text-sm">{service.description}</p>
                  </div>
                </div>
                {getStatusIcon(service.status)}
              </div>
              
              <div className="space-y-2">
                {Object.entries(service.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-blue-300/70 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-blue-200 font-medium">{value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-500/20">
                <span className={`px-3 py-1 text-xs font-medium rounded capitalize border ${
                  service.status === 'online' ? 'bg-green-500/20 text-green-300 border-green-500/40' :
                  service.status === 'offline' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                  'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                }`}>
                  {service.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Logs */}
      <div className="space-card p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 neon-text">System Activity Log</h3>
        <div className="space-y-3">
          {[
            { time: lastUpdated.toLocaleTimeString(), event: 'System status refreshed', type: 'info' },
            { time: '17:03:00', event: 'Email alert sent successfully', type: 'success' },
            { time: '16:58:00', event: 'Log watcher detected new error logs', type: 'warning' },
            { time: '16:52:00', event: 'Elasticsearch index updated', type: 'info' },
            { time: '16:45:00', event: 'Email service connection verified', type: 'success' }
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-blue-500/20">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  log.type === 'success' ? 'bg-green-400' :
                  log.type === 'warning' ? 'bg-yellow-400' :
                  'bg-cyan-400'
                }`} style={{
                  boxShadow: log.type === 'success' ? '0 0 8px #22c55e' :
                           log.type === 'warning' ? '0 0 8px #fbbf24' :
                           '0 0 8px #06b6d4'
                }}></div>
                <span className="text-blue-200">{log.event}</span>
              </div>
              <span className="text-blue-300/60 text-sm">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;