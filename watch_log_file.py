# watches a log file app.log (fake) and sends them to Elasticsearch

import time
import os
from elasticsearch import Elasticsearch
from datetime import datetime

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

# Path to the log file
LOG_FILE = "app.log"

# Keywords to match
ALERT_LEVELS = ["ERROR", "FAILED", "CRITICAL"]

# Function to parse and send log
def send_log_to_elastic(line):
    log = {
        "timestamp": datetime.now().isoformat(),
        "level": "ERROR",  # You can parse this from line if needed
        "message": line.strip()
    }
    res = es.index(index="logs", document=log)
    print("📤 Sent to Elasticsearch:", res['result'])

# Tail-like function
def follow_log_file():
    with open(LOG_FILE, "r") as file:
        file.seek(0, os.SEEK_END)  # Go to the end of file
        while True:
            line = file.readline()
            if not line:
                time.sleep(1)
                continue
            if any(keyword in line for keyword in ALERT_LEVELS):
                send_log_to_elastic(line)

# Start watching
print(f"🔍 Watching {LOG_FILE} for ERROR-level logs...")
follow_log_file()
