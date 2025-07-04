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
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mailware</h1>
                <p className="text-white/70">Automated Log Monitoring & Email Alerting</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`status-indicator ${systemStatus.elasticsearch === 'online' ? 'status-online' : 'status-offline'}`}></div>
                <span className="text-white/80 text-sm">Elasticsearch</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`status-indicator ${systemStatus.emailService === 'online' ? 'status-online' : 'status-offline'}`}></div>
                <span className="text-white/80 text-sm">Email Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="glass-card p-2 mb-6">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
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
        <div className="glass-card p-6">
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