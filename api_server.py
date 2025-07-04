from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
import os
from dotenv import load_dotenv
from elasticsearch import Elasticsearch

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Elasticsearch
es = Elasticsearch("http://localhost:9200")

@app.route('/api/test-email', methods=['POST'])
def test_email():
    """API endpoint to test email configuration"""
    
    try:
        data = request.get_json()
        
        # Get email configuration
        sender_email = os.getenv("SENDER_EMAIL")
        receiver_email = os.getenv("RECEIVER_EMAIL") 
        email_password = os.getenv("EMAIL_PASSWORD")
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        
        # Use custom message if provided
        test_message = data.get('testMessage', 'This is a test email from Mailware system.')
        
        # Create email
        msg = MIMEText(f"""
🧪 Mailware Test Email

{test_message}

Sent at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

✅ Email system is working correctly!

---
Mailware Log Monitoring System
        """)
        
        msg['Subject'] = f"🧪 Mailware Test - {datetime.now().strftime('%H:%M:%S')}"
        msg['From'] = sender_email
        msg['To'] = receiver_email
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, email_password)
            server.send_message(msg)
        
        return jsonify({
            'success': True,
            'message': 'Test email sent successfully!',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to send email: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/system-status', methods=['GET'])
def system_status():
    """API endpoint to check system health"""
    
    status = {
        'elasticsearch': 'offline',
        'emailService': 'offline',
        'logWatcher': 'online'  # Assume online for demo
    }
    
    # Check Elasticsearch
    try:
        if es.ping():
            status['elasticsearch'] = 'online'
    except:
        pass
    
    # Check email service
    try:
        sender_email = os.getenv("SENDER_EMAIL")
        email_password = os.getenv("EMAIL_PASSWORD")
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        
        if all([sender_email, email_password]):
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(sender_email, email_password)
            status['emailService'] = 'online'
    except:
        pass
    
    return jsonify(status)

@app.route('/api/logs', methods=['GET'])
def get_logs():
    """API endpoint to fetch logs from Elasticsearch"""
    
    try:
        # Query recent logs
        query = {
            "query": {"match_all": {}},
            "sort": [{"timestamp": {"order": "desc"}}],
            "size": 100
        }
        
        result = es.search(index="logs", body=query)
        
        logs = []
        for hit in result['hits']['hits']:
            source = hit['_source']
            logs.append({
                'id': hit['_id'],
                'timestamp': source.get('timestamp'),
                'level': source.get('level', 'INFO'),
                'message': source.get('message'),
                'source': 'elasticsearch'
            })
        
        return jsonify({
            'success': True,
            'logs': logs,
            'total': result['hits']['total']['value']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to fetch logs: {str(e)}',
            'logs': []
        }), 500

if __name__ == '__main__':
    print("🚀 Starting Mailware API Server...")
    print("📡 Server will run on http://localhost:8000")
    print("🔗 Frontend proxy configured for /api routes")
    app.run(debug=True, port=8000)