import win32evtlog
server = 'localhost'
log_type = 'System'  

# Flags: read backward in time, sequentially
flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ

# Open the event log
handle = win32evtlog.OpenEventLog(server, log_type)

print(f"📂 Reading from '{log_type}' log...\n")
event_count = 0

while True:
    events = win32evtlog.ReadEventLog(handle, flags, 0)
    if not events:
        break
    for event in events:
        event_id = event.EventID
        category = event.EventCategory
        source = event.SourceName
        timestamp = event.TimeGenerated.Format()

        print(f"{timestamp} - {source} - EventID: {event_id} - Category: {category}")
        event_count += 1

        if event_count >= 20:
            break  # Only show first 20 entries for now
    break  
