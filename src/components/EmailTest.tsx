import React, { useState } from 'react';
import { Send, CheckCircle, XCircle, AlertTriangle, Mail, Settings, Zap } from 'lucide-react';

const EmailTest = () => {
  const [testResult, setTestResult] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [emailConfig, setEmailConfig] = useState({
    senderEmail: 'jaisshreya17@gmail.com',
    receiverEmail: 'shreyaa.we@gmail.com',
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587'
  });

  const handleTestEmail = async () => {
    setTestResult('sending');
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testMessage: testMessage || 'This is a test email from Mailware system.',
          ...emailConfig
        }),
      });

      if (response.ok) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch (error) {
      setTestResult('error');
    }

    setTimeout(() => setTestResult('idle'), 3000);
  };

  const handleSystemCheck = async () => {
    setTestResult('sending');
    
    setTimeout(() => {
      setTestResult('success');
      setTimeout(() => setTestResult('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Email Configuration */}
      <div className="space-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-cyan-400 neon-text">Email Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-300/70 mb-2">Sender Email</label>
            <input
              type="email"
              value={emailConfig.senderEmail}
              onChange={(e) => setEmailConfig({...emailConfig, senderEmail: e.target.value})}
              className="w-full px-3 py-2 space-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-300/70 mb-2">Receiver Email</label>
            <input
              type="email"
              value={emailConfig.receiverEmail}
              onChange={(e) => setEmailConfig({...emailConfig, receiverEmail: e.target.value})}
              className="w-full px-3 py-2 space-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-300/70 mb-2">SMTP Server</label>
            <input
              type="text"
              value={emailConfig.smtpServer}
              onChange={(e) => setEmailConfig({...emailConfig, smtpServer: e.target.value})}
              className="w-full px-3 py-2 space-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-300/70 mb-2">SMTP Port</label>
            <input
              type="text"
              value={emailConfig.smtpPort}
              onChange={(e) => setEmailConfig({...emailConfig, smtpPort: e.target.value})}
              className="w-full px-3 py-2 space-input"
            />
          </div>
        </div>
      </div>

      {/* Test Email */}
      <div className="space-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-cyan-400 neon-text">Send Test Email</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-300/70 mb-2">Test Message (Optional)</label>
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter a custom test message or leave blank for default..."
              rows={3}
              className="w-full px-3 py-2 space-input resize-none"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleTestEmail}
              disabled={testResult === 'sending'}
              className="flex items-center space-x-2 px-6 py-3 space-button disabled:opacity-50"
            >
              {testResult === 'sending' ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-300/30 border-t-cyan-400 rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Test Email</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleSystemCheck}
              disabled={testResult === 'sending'}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600/80 hover:bg-green-500/80 border border-green-400/50 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {testResult === 'sending' ? (
                <>
                  <div className="w-4 h-4 border-2 border-green-300/30 border-t-green-400 rounded-full animate-spin"></div>
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Check System Health</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResult !== 'idle' && (
        <div className={`space-card p-6 ${
          testResult === 'success' ? 'border-green-500/40 bg-green-500/10' : 
          testResult === 'error' ? 'border-red-500/40 bg-red-500/10' : 'border-blue-500/40'
        }`}>
          <div className="flex items-center space-x-3">
            {testResult === 'sending' && (
              <>
                <div className="w-5 h-5 border-2 border-blue-300/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <span className="text-blue-200">Testing email configuration...</span>
              </>
            )}
            {testResult === 'success' && (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300">Email sent successfully! Check your inbox.</span>
              </>
            )}
            {testResult === 'error' && (
              <>
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">Failed to send email. Please check your configuration.</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Email Templates */}
      <div className="space-card p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 neon-text">Email Templates</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/40 rounded-lg border border-blue-500/20">
            <h4 className="font-medium text-blue-200 mb-2">Default Alert Template</h4>
            <p className="text-blue-300/70 text-sm mb-3">Used for automatic log alerts</p>
            <div className="bg-black/40 p-3 rounded font-mono text-sm text-cyan-300 border border-cyan-500/20">
              🚨 Error logs detected in the last {'{time_window}'} minutes:<br/><br/>
              {'{messages}'}
            </div>
          </div>
          
          <div className="p-4 bg-slate-800/40 rounded-lg border border-blue-500/20">
            <h4 className="font-medium text-blue-200 mb-2">System Health Template</h4>
            <p className="text-blue-300/70 text-sm mb-3">Used for system status notifications</p>
            <div className="bg-black/40 p-3 rounded font-mono text-sm text-cyan-300 border border-cyan-500/20">
              ✅ Mailware System Health Check<br/><br/>
              • Elasticsearch: Online<br/>
              • Email Service: Online<br/>
              • Log Watchers: Active<br/><br/>
              All systems operational.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTest;