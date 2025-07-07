
from elasticsearch import Elasticsearch
from datetime import datetime

es = Elasticsearch("http://localhost:9200")
log = {
    "timestamp": datetime.now().isoformat(),  # Current timestamp
    "level": "ERROR",
    "message": "🚨 Manual test:Checking the sys"
}
res = es.index(index="logs", document=log)
print("✅ Log inserted:", res['result'])
