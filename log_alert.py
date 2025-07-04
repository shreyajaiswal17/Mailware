# #sends alerts from Elasticsearch

# from elasticsearch import Elasticsearch
# from datetime import datetime, timedelta
# import smtplib
# from email.mime.text import MIMEText

# # Connect to Elasticsearch
# es = Elasticsearch("http://localhost:9200")

# # Time range: last 15 minutes
# time_filter = {
#     "range": {
#         "timestamp": {
#             "gte": (datetime.now() - timedelta(minutes=15)).isoformat(),
#             "lte": datetime.now().isoformat()
#         }
#     }
# }

# # Query: find logs with level ERROR
# query = {
#     "query": {
#         "bool": {
#             "must": [
#                 {"match": {"level": "ERROR"}},
#                 time_filter
#             ]
#         }
#     }
# }

# # Run the query
# res = es.search(index="logs", body=query)
# hits = res["hits"]["hits"]

# if hits:
#     # Format the log messages
#     log_messages = "\n".join([hit['_source']['message'] for hit in hits])

#     # Email configuration
#     sender = "jaisshreya17@gmail.com"
#     receiver = "shreyaa.we@gmail.com"
#     password = "eqru wfpq fsrq swja"

#     # Use Gmail App Password if 2FA is enabled

#     msg = MIMEText(f"🚨 Error logs detected in the last 15 minutes:\n\n{log_messages}")
#     msg['Subject'] = "Elastic Log Alert"
#     msg['From'] = sender
#     msg['To'] = receiver

#     try:
#         with smtplib.SMTP("smtp.gmail.com", 587) as server:
#             server.starttls()
#             server.login(sender, password)
#             server.send_message(msg)
#         print("📧 Alert sent!")
#     except Exception as e:
#         print("❌ Failed to send email:", e)
# else:
#     print("✅ No error logs found in the last 15 minutes.")



from elasticsearch import Elasticsearch
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
import time

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

# Set to track seen logs to avoid duplicate alerts
seen_logs = set()

def send_alert(log_messages):
    """Send email alert with the provided log messages."""
    sender = "jaisshreya17@gmail.com"
    receiver = "shreyaa.we@gmail.com"
    password = "eqru wfpq fsrq swja"  # Gmail App Password

    msg = MIMEText(f"🚨 Error logs detected in the last 15 minutes:\n\n{log_messages}")
    msg['Subject'] = "Elastic Log Alert"
    msg['From'] = sender
    msg['To'] = receiver

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender, password)
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