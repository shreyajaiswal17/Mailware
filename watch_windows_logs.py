# watches real Windows logs

import win32evtlog
import time
from elasticsearch import Elasticsearch

# Elasticsearch connection
es = Elasticsearch("http://localhost:9200")

# Which log type to monitor
LOG_TYPE = "System"  # or "Application", "Security"

# Keywords or EventIDs to trigger alerts
ALERT_EVENT_IDS = [41, 1000, 6008, 1102]  # Customize based on use-case
ALERT_SOURCES = ["Service Control Manager", "Application Error"]

def send_log_to_elastic(log_entry):
    res = es.index(index="windows-logs", document=log_entry)
    print("📤 Sent to Elasticsearch:", res['result'])

def fetch_recent_logs():
    server = 'localhost'
    handle = win32evtlog.OpenEventLog(server, LOG_TYPE)
    flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ

    print(f"👀 Watching Windows '{LOG_TYPE}' log for events...")

    seen = set()  # Avoid duplicates

    while True:
        events = win32evtlog.ReadEventLog(handle, flags, 0)
        for event in events:
            event_id = event.EventID
            source = event.SourceName
            time_gen = event.TimeGenerated.Format()  # Nice datetime string

            key = (event_id, time_gen, source)
            if key in seen:
                continue  # Already seen
            seen.add(key)

            if (event_id in ALERT_EVENT_IDS) or (source in ALERT_SOURCES):
                log_entry = {
                    "timestamp": time_gen,
                    "source": source,
                    "event_id": event_id,
                    "category": event.EventCategory,
                    "message": str(event.StringInserts),
                    "log_type": LOG_TYPE
                }
                send_log_to_elastic(log_entry)

        time.sleep(10)  # Wait before next check

fetch_recent_logs()
