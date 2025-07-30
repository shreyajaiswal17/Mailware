📊 Mailware: Automated Log Monitoring & Email Alerting with Elasticsearch
Mailware is a dual-mode log monitoring tool that automatically:

🪟 Monitors real-time Windows Event Logs

📝 Tracks custom application logs (like app.log)

📬 Sends critical alerts directly to your email inbox

🔍 Stores logs in Elasticsearch for querying, visualization, and integration

🚀 Features
✅ Real-time log monitoring (System & Application logs)
✅ Dual log sources: Windows Event Logs + app.log
✅ Structured alert emails (Event ID, Source, Timestamp)
✅ Elasticsearch integration for log storage & querying
✅ Optional integration with Kibana for dashboards

🛠️ Tech Stack
Layer	Tech
Log Ingestion	Python win32evtlog, file I/O
Alerting	smtplib with Gmail SMTP
Storage	Elasticsearch 8.x
Optional UI	Kibana (for log dashboards)

⚙️ Setup Instructions
1. Clone & Set Up Environment
bash
Copy
Edit
git clone https://github.com/your-username/mailware.git
cd mailware
python -m venv venv
venv\Scripts\activate  # For Windows
pip install -r requirements.txt
2. Start Elasticsearch Locally
📦 Download Elasticsearch

Then start it:

bash
Copy
Edit
.\bin\elasticsearch.bat
📍 Ensure it’s accessible at: http://localhost:9200

3. Start the Log Watchers
Terminal 1 – Monitor Custom Log File
bash
Copy
Edit
python watch_log_file.py
Terminal 2 – Monitor Windows Event Logs
bash
Copy
Edit
python watch_windows_logs.py
⚠️ Run terminal/VS Code as Administrator to access system logs.

4. Run the Email Alert Script
bash
Copy
Edit
python log_alert.py
🔎 This will:

Query recent logs (e.g., from the last 15 minutes)

Identify critical events

Send alert emails if any are detected

📬 Email Configuration (Gmail)
To enable alerts:

Generate a Gmail App Password (if 2FA is enabled)

Configure credentials in log_alert.py:

python
Copy
Edit
sender = "your_email@gmail.com"
receiver = "alert_receiver@gmail.com"
password = "your_app_password"
🔐 Do not hardcode sensitive credentials in production. Use .env or a secret manager instead.

📈 Optional: Kibana for Visualization
📦 Download Kibana

Start it:

bash
Copy
Edit
.\bin\kibana.bat
Open http://localhost:5601 to visualize Elasticsearch data.

🧩 Extensibility
Mailware can be extended to support:

📂 Multiple log file paths

🔎 Custom event filters

📉 Threshold-based alerting

📊 Kibana dashboards or Grafana integration

