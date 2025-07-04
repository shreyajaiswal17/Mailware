from elasticsearch import Elasticsearch
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
import time
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve configuration from environment variables
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
ES_HOST = os.getenv("ES_HOST", "http://localhost:9200")
ES_INDEX = os.getenv("ES_INDEX", "logs")
ALERT_LEVELS = os.getenv("ALERT_LEVELS", "ERROR").split(",")
TIME_WINDOW_MINUTES = int(os.getenv("TIME_WINDOW_MINUTES", "15"))
POLLING_INTERVAL_SECONDS = int(os.getenv("POLLING_INTERVAL_SECONDS", "60"))
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
EMAIL_SUBJECT = os.getenv("EMAIL_SUBJECT", "Elastic Log Alert")
EMAIL_BODY_TEMPLATE = os.getenv("EMAIL_BODY_TEMPLATE", "🚨 Error logs detected in the last {time_window} minutes:\n\n{messages}")

# Validate required environment variables
required_vars = ["SENDER_EMAIL", "RECEIVER_EMAIL", "EMAIL_PASSWORD"]
missing_vars = [var for var in required_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Connect to Elasticsearch
es = Elasticsearch(ES_HOST)

# Set to track seen logs to avoid duplicate alerts
seen_logs = set()

def send_alert(log_messages):
    """Send email alert with the provided log messages."""
    msg = MIMEText(EMAIL_BODY_TEMPLATE.format(time_window=TIME_WINDOW_MINUTES, messages=log_messages))
    msg['Subject'] = EMAIL_SUBJECT
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECEIVER_EMAIL

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, EMAIL_PASSWORD)
            server.send_message(msg)
        print(f"📧 Alert sent at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    except Exception as e:
        print(f"❌ Failed to send email at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}: {e}")

def monitor_logs():
    """Continuously monitor Elasticsearch for new error logs."""
    print("🔍 Starting real-time log monitoring...")
    while True:
        # Time range: last N minutes
        time_filter = {
            "range": {
                "timestamp": {
                    "gte": (datetime.now() - timedelta(minutes=TIME_WINDOW_MINUTES)).isoformat(),
                    "lte": datetime.now().isoformat()
                }
            }
        }

        # Query: find logs with specified alert levels
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"terms": {"level": ALERT_LEVELS}},  # Support multiple levels
                        time_filter
                    ]
                }
            }
        }

        # Run the query
        try:
            res = es.search(index=ES_INDEX, body=query)
            hits = res["hits"]["hits"]

            if hits:
                # Process new logs only
                new_logs = []
                for hit in hits:
                    log_key = (hit['_source']['timestamp'], hit['_source']['message'])
                    if log_key not in seen_logs:
                        new_logs.append(hit['_source']['message'])
                        seen_logs.add(log_key)

                if new_logs:
                    log_messages = "\n".join(new_logs)
                    send_alert(log_messages)
                else:
                    print(f"✅ No new error logs found at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            else:
                print(f"✅ No error logs found at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        except Exception as e:
            print(f"❌ Elasticsearch query failed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}: {e}")

        # Wait before the next check
        time.sleep(POLLING_INTERVAL_SECONDS)

if __name__ == "__main__":
    monitor_logs()