from elasticsearch import Elasticsearch
from datetime import datetime


es = Elasticsearch("http://localhost:9200")

# Log content
log = {
    "timestamp": datetime.now().isoformat(),
    "level": "ERROR",
    "message": "🚨 Manual Alert Trigger: Simulated system failure for testing email pipeline."
}

# Insert into 'logs' index
es.index(index="logs", document=log)

