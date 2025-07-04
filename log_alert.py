from elasticsearch import Elasticsearch
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
import time
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve credentials from environment variables
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Validate environment variables
if not all([SENDER_EMAIL, RECEIVER_EMAIL, EMAIL_PASSWORD]):
    raise ValueError("Missing required environment variables: SENDER_EMAIL, RECEIVER_EMAIL, or EMAIL_PASSWORD")

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

# Set to track seen logs to avoid duplicate alerts
seen_logs = set()

def send_alert(log_messages):
    """Send email alert with the provided log messages."""
    msg = MIMEText(f"🚨 Error logs detected in the last 15 minutes:\n\n{log_messages}")
    msg['Subject'] = "Elastic Log Alert"
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECEIVER_EMAIL

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
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
        # Time range: last 15 minutes
        time_filter = {
            "range": {
                "timestamp": {
                    "gte": (datetime.now() - timedelta(minutes=15)).isoformat(),
                    "lte": datetime.now().isoformat()
                }
            }
        }

        # Query: find logs with level ERROR
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"level": "ERROR"}},
                        time_filter
                    ]
                }
            }
        }

        # Run the query
        try:
            res = es.search(index="logs", body=query)
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
        time.sleep(60)  # Check every 60 seconds

if __name__ == "__main__":
    monitor_logs()