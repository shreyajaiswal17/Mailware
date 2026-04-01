# Mailware: Automated Log Monitoring & Email Alerting with Elasticsearch

Mailware is a log monitoring and alerting system that:

- 📥 **Ingests Windows Event Logs** into Elasticsearch using custom Python scripts
- 🔍 **Monitors Elasticsearch** for ERROR/CRITICAL level logs in real-time
- 📧 **Sends Email Alerts** automatically when critical events are detected
- 💾 **Stores logs persistently** in Elasticsearch for analysis and querying
- ⚡ **Prevents duplicate alerts** using intelligent log tracking

##  Features

**Windows Event Log Integration** - Reads System/Application logs via `pywin32`  
**Real-time Log Monitoring** - Polls Elasticsearch every 10 seconds for new errors  
**Smart Email Alerting** - Gmail SMTP integration with duplicate prevention  
**Configurable Alert Levels** - Monitor ERROR, CRITICAL, or custom log levels   **Persistent State Management** - Tracks processed logs to avoid re-processing  
 **Environment-based Configuration** - All settings via `.env` file 

## Tech Stack

| Layer         | Tech                           |
|---------------|--------------------------------|
| Log Ingestion | Python `win32evtlog`, file I/O |
| Alerting      | `smtplib`, Gmail SMTP          |
| Storage       | Elasticsearch 8.x              |
| UI            | Kibana                         |

---

##  Setup Instructions

### 1. Clone and Set Up Environment

```powershell
git clone https://github.com/shreyajaiswal17/mailware.git
cd mailware
python -m venv venv
venv\Scripts\activate  # For Windows PowerShell
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
SENDER_EMAIL=your_email@gmail.com
RECEIVER_EMAIL=alert_receiver@gmail.com
EMAIL_PASSWORD=your_app_password
ES_HOST=http://localhost:9200
ES_INDEX=logs
ALERT_LEVELS=ERROR,CRITICAL
TIME_WINDOW_MINUTES=15
POLLING_INTERVAL_SECONDS=10
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

### 3. Start Elasticsearch Locally

 Download and extract Elasticsearch, then start it:

```powershell
.\bin\elasticsearch.bat
```

📍 Ensure it's accessible at: http://localhost:9200

### 4. Set Up Elasticsearch Index

Create the logs index with proper mapping:

```powershell
python create_logs_index.py
```

### 5. Start Log Monitoring

**Option 1: Monitor Windows Event Logs**
```powershell
python read_windows_logs.py
```

**Option 2: Insert Demo Logs for Testing**
```powershell
python insert_logs_demo.py
```

### 6. Start Real-time Alert Monitoring

```powershell
python log_alert.py
```

⚠️ **Important**: Run PowerShell/VS Code as **Administrator** to access Windows Event Logs.

---

##  Email Configuration (Gmail)

To enable alerts:

1. Generate a Gmail App Password (if 2FA is enabled)
2. Configure credentials in your `.env` file:

```env
SENDER_EMAIL=your_email@gmail.com
RECEIVER_EMAIL=alert_receiver@gmail.com
EMAIL_PASSWORD=your_app_password
```

🔐 **Security Note**: Never hardcode credentials in your Python files. Always use `.env` file or environment variables.

---

## Optional: Kibana for Visualization

📦 Download Kibana

Start it:

```powershell
.\bin\kibana.bat
```

Open http://localhost:5601 to visualize Elasticsearch data.

---

##  Extensibility

Mailware can be extended to support:

- 📂 Multiple log file paths
- 🔎 Custom event filters
- 📉 Threshold-based alerting
- 📊 Different notification channels (Slack, Teams, etc.)
- 🔄 Log rotation and archival strategies

---

## Project Structure

```
Mailware/
├── create_logs_index.py    # Sets up Elasticsearch index with proper mapping
├── read_windows_logs.py    # Reads Windows Event Logs and pushes to Elasticsearch  
├── insert_logs_demo.py     # Inserts demo ERROR logs for testing
├── log_alert.py           # Main alerting script - monitors ES and sends emails
├── last_record.json       # Tracks last processed Windows log record
├── .env                   # Environment configuration (not in repo)
├── requirements.txt       # Python dependencies
└── README.md             # This file
```
## How It Works

1. **Log Ingestion**: `read_windows_logs.py` continuously reads Windows Event Logs and indexes them in Elasticsearch
2. **Real-time Monitoring**: `log_alert.py` polls Elasticsearch every 10 seconds for new ERROR/CRITICAL logs
3. **Smart Alerting**: Sends email alerts only for new logs, preventing duplicate notifications
4. **State Management**: Uses `last_record.json` to track processed logs and avoid re-ingestion

