# 📊 Mailware: Automated Log Monitoring & Email Alerting with Elasticsearch

Mailware is a dual-mode log monitoring tool that automatically:
- Watches real-time Windows Event Logs 🪟
- Monitors custom application logs (e.g., `app.log`) 📝
- Sends critical alerts directly to your email inbox 📬
- Stores logs in Elasticsearch for querying, visualization, or integration 🔍


## 🚀 Features

✅ Real-time log monitoring (System & Application logs)  
✅ Dual log sources: System logs + Custom `app.log`  
✅ Alert email with structured event info (Event ID, Source, Timestamp)  
✅ Integration with Elasticsearch for storage and search  
✅ Easy to extend with Kibana dashboards or log filtering 


## 🛠️ Tech Stack

| Layer         | Tech                         |
|---------------|------------------------------|
| Log Ingestion | Python `win32evtlog`, file I/O |
| Alerting      | `smtplib`, Gmail SMTP         |
| Storage       | Elasticsearch 8.x             |
| Optional      | Kibana  |



---

## ⚙️ Setup Instructions

#### 1. Clone and Set Up Environment

```bash
git clone https://github.com/your-username/mailware.git
cd mailware
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```
#### 2. Start Elasticsearch Locally
Download Elasticsearch from: https://www.elastic.co/downloads/elasticsearch

Start the server:

```bash
.\bin\elasticsearch.bat
Ensure it's running on http://localhost:9200
```

#### 3. Run the Log Watchers
Terminal 1 – Monitor app.log
```bash
python watch_log_file.py
``` 
Terminal 2 – Monitor System Logs
```bash

python watch_windows_logs.py
```
(Run VS Code or terminal as Administrator for permission to access system logs)

#### 4. Run the Alert Script
```bash
python log_alert.py
```

This will:
- Query logs from the last 15 minutes
- Check for important events
- Send formatted email alerts if issues found

### 📬 Email Configuration (Gmail)
Use an App Password if 2FA is enabled

```Set credentials in log_alert.py:
sender = "your_email@gmail.com"
receiver = "alert_receiver@gmail.com"
password = "your_app_password"
```
