#sends alerts from Elasticsearch

from elasticsearch import Elasticsearch
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

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
res = es.search(index="logs", body=query)
hits = res["hits"]["hits"]

if hits:
    # Format the log messages
    log_messages = "\n".join([hit['_source']['message'] for hit in hits])

    # Email configuration
    sender = "jaisshreya17@gmail.com"
    receiver = "shreyaa.we@gmail.com"
    password = "eqru wfpq fsrq swja"

    # Use Gmail App Password if 2FA is enabled

    msg = MIMEText(f"🚨 Error logs detected in the last 15 minutes:\n\n{log_messages}")
    msg['Subject'] = "Elastic Log Alert"
    msg['From'] = sender
    msg['To'] = receiver

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender, password)
            server.send_message(msg)
        print("📧 Alert sent!")
    except Exception as e:
        print("❌ Failed to send email:", e)
else:
    print("✅ No error logs found in the last 15 minutes.")
