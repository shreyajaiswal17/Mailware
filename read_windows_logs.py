# import win32evtlog
# server = 'localhost'
# log_type = 'System'  

# # Flags: read backward in time, sequentially
# flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ

# # Open the event log
# handle = win32evtlog.OpenEventLog(server, log_type)

# print(f"📂 Reading from '{log_type}' log...\n")
# event_count = 0

# while True:
#     events = win32evtlog.ReadEventLog(handle, flags, 0)
#     if not events:
#         break
#     for event in events:
#         event_id = event.EventID
#         category = event.EventCategory
#         source = event.SourceName
#         timestamp = event.TimeGenerated.Format()

#         print(f"{timestamp} - {source} - EventID: {event_id} - Category: {category}")
#         event_count += 1

#         if event_count >= 20:
#             break  # Only show first 20 entries for now
#     break  


# from elasticsearch import Elasticsearch
# import win32evtlog
# import json
# import os
# from datetime import datetime, timezone

# INDEX_NAME = "windows_logs"
# STATE_FILE = "last_record.json"

# # -----------------------------
# # Load last processed record
# # -----------------------------
# def load_last_record():
#     if not os.path.exists(STATE_FILE):
#         return 0
#     with open(STATE_FILE, "r") as f:
#         return json.load(f).get("last_record", 0)


# # -----------------------------
# # Save last processed record
# # -----------------------------
# def save_last_record(record_number):
#     with open(STATE_FILE, "w") as f:
#         json.dump({"last_record": record_number}, f)


# # -----------------------------
# # Normalize timestamp
# # -----------------------------
# def convert_timestamp(ts):
#     return ts.replace(tzinfo=timezone.utc).isoformat()


# # -----------------------------
# # MAIN
# # -----------------------------
# def main():
#     es = Elasticsearch("http://localhost:9200")

#     server = "localhost"
#     log_type = "System"

#     handle = win32evtlog.OpenEventLog(server, log_type)

#     flags = win32evtlog.EVENTLOG_SEQUENTIAL_READ | win32evtlog.EVENTLOG_BACKWARDS_READ

#     last_record = load_last_record()
#     print(f"[INFO] Last processed record: {last_record}")

#     new_last_record = last_record

#     events = True
#     count = 0

#     while events:
#         events = win32evtlog.ReadEventLog(handle, flags, 0)
#         if not events:
#             break

#         for event in reversed(events):  # reverse so we process oldest first
#             if event.RecordNumber <= last_record:
#                 continue  # skip already processed logs

#             # Update last_record pointer
#             new_last_record = max(new_last_record, event.RecordNumber)

#             logdoc = {
#                 "timestamp": convert_timestamp(event.TimeGenerated),
#                 "event_id": event.EventID,
#                 "level": event.EventType,
#                 "source": event.SourceName,
#                 "message": f"{event.SourceName} - EventID {event.EventID}",
#                 "record_number": event.RecordNumber,
#             }

#             es.index(index=INDEX_NAME, document=logdoc)
#             count += 1
#             print("Indexed:", logdoc)

#     save_last_record(new_last_record)
#     print(f"[INFO] Stored latest record number: {new_last_record}")
#     print(f"[INFO] Indexed {count} new logs.")


# if __name__ == "__main__":
#     main()


# Your script is manually replacing Winlogbeat.
# It collects Windows Event Logs → filters → converts → sends to Elasticsearch → remembers progress.

from elasticsearch import Elasticsearch
import win32evtlog
from datetime import datetime, timezone
import json
import os

# Elasticsearch Setup

ES_URL = "http://localhost:9200"
INDEX_NAME = "windows_logs"

es = Elasticsearch(ES_URL)
print("Connected to Elasticsearch:", es.ping())

# Filtering (to avoid flooding)


IMPORTANT_SOURCES = {
    "Microsoft-Windows-Security-Auditing",
    "Service Control Manager",
    "Windows Defender",
    "Application Error",
    "Microsoft-Windows-Winlogon",
    "Microsoft-Windows-Sysmon",
}

IMPORTANT_EVENT_IDS = {
    4624, 4625, 4634, 4672, 4688, 4720,  # Login / user / process creation
    7036, 7040, 7045,                   # Service changes
    1000, 1001,                         # Application crash
}


STATE_FILE = "last_record.json"

if os.path.exists(STATE_FILE):
    with open(STATE_FILE, "r") as f:
        last_record_number = json.load(f).get("last_record", 0)
else:
    last_record_number = 0


# Read Windows Event Logs

server = "localhost"
log_type = "System"   # Change to "Security" or "Application" if needed

handle = win32evtlog.OpenEventLog(server, log_type)

flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ

events = win32evtlog.ReadEventLog(handle, flags, 0)

new_last_record = last_record_number

for event in events:
    rec_num = event.RecordNumber

    # Skip already processed logs
    if rec_num <= last_record_number:
        continue

    # Update last record
    new_last_record = max(new_last_record, rec_num)

   
    if (
        event.SourceName not in IMPORTANT_SOURCES
        and event.EventID not in IMPORTANT_EVENT_IDS
    ):
        continue

    # --------------------------
    # Build Document
    # --------------------------
    timestamp_utc = event.TimeGenerated.replace(tzinfo=timezone.utc).isoformat()

    logdoc = {
        "timestamp": timestamp_utc,
        "event_id": event.EventID,
        "level": event.EventType,
        "source": event.SourceName,
        "message": f"{event.SourceName} - EventID {event.EventID}",
        "record_number": rec_num,
    }

    # --------------------------
    # Index Document
    # --------------------------
    es.index(index=INDEX_NAME, document=logdoc)
    print("Indexed:", logdoc)


# Save state so we don't re-ingest logs

with open(STATE_FILE, "w") as f:
    json.dump({"last_record": new_last_record}, f)

print(f"\nSaved last_record: {new_last_record}")
print("Done.")






# 📌 TL;DR

# Your script:

# Reads Windows event logs

# Skips old logs (thanks to last_record.json)

# Filters only security-important events

# Parses & converts each event into JSON

# Pushes them into Elasticsearch

# Stores the new offset

# Prevents log flooding

# This is basically a mini custom Winlogbeat/SIEM agent you wrote.
