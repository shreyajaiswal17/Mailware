import React, { useState, useEffect } from 'react';
import { Shield, Mail, Activity, AlertTriangle, CheckCircle, XCircle, Settings, Send, RefreshCw } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LogViewer from './components/LogViewer';
import EmailTest from './components/EmailTest';
import SystemStatus from './components/SystemStatus';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemStatus, setSystemStatus] = useState({
    elasticsearch: 'online',
    emailService: 'online',
    logWatcher: 'online'
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'logs', label: 'Log Viewer', icon: Shield },
    { id: 'email', label: 'Email Test', icon: Mail },
    { id: 'status', label: 'System Status', icon: Settings }
  ];

  return (
    <div className="min-h-screen space-bg">
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="space-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600/30 rounded-lg neon-border">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-cyan-400 neon-text">Mailware</h1>
                <p className="text-blue-200/80">Automated Log Monitoring & Email Alerting</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`status-indicator ${systemStatus.elasticsearch === 'online' ? 'status-online' : 'status-offline'}`}></div>
                <span className="text-blue-200 text-sm font-medium">Elasticsearch</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`status-indicator ${systemStatus.emailService === 'online' ? 'status-online' : 'status-offline'}`}></div>
                <span className="text-blue-200 text-sm font-medium">Email Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-card p-2 mb-6">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600/40 text-cyan-400 shadow-lg neon-border'
                      : 'text-blue-200/70 hover:bg-blue-800/30 hover:text-cyan-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="space-card p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'logs' && <LogViewer />}
          {activeTab === 'email' && <EmailTest />}
          {activeTab === 'status' && <SystemStatus systemStatus={systemStatus} />}
        </div>
      </div>
    </div>
  );
}

export default App;