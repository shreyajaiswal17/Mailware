import React, { useState, useEffect } from 'react';
import { Server, Database, Mail, Eye, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

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
        return 'border-green-500/30 bg-green-500/10';
      case 'offline':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
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
          <h2 className="text-xl font-semibold text-white">System Status</h2>
          <p className="text-white/70">Monitor the health of all Mailware components</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Status */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Overall System Health</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">All Systems Operational</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">99.8%</p>
            <p className="text-white/70 text-sm">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">3/3</p>
            <p className="text-white/70 text-sm">Services Online</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-white/70 text-sm">Critical Issues</p>
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
              className={`bg-white/10 backdrop-blur-md border rounded-xl p-6 ${getStatusColor(service.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{service.name}</h4>
                    <p className="text-white/60 text-sm">{service.description}</p>
                  </div>
                </div>
                {getStatusIcon(service.status)}
              </div>
              
              <div className="space-y-2">
                {Object.entries(service.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                  service.status === 'online' ? 'bg-green-500/20 text-green-300' :
                  service.status === 'offline' ? 'bg-red-500/20 text-red-300' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {service.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Logs */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Activity Log</h3>
        <div className="space-y-3">
          {[
            { time: lastUpdated.toLocaleTimeString(), event: 'System status refreshed', type: 'info' },
            { time: '17:03:00', event: 'Email alert sent successfully', type: 'success' },
            { time: '16:58:00', event: 'Log watcher detected new error logs', type: 'warning' },
            { time: '16:52:00', event: 'Elasticsearch index updated', type: 'info' },
            { time: '16:45:00', event: 'Email service connection verified', type: 'success' }
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  log.type === 'success' ? 'bg-green-400' :
                  log.type === 'warning' ? 'bg-yellow-400' :
                  'bg-blue-400'
                }`}></div>
                <span className="text-white">{log.event}</span>
              </div>
              <span className="text-white/60 text-sm">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;