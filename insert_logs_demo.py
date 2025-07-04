# from elasticsearch import Elasticsearch
# from datetime import datetime

# # Connect to Elasticsearch
# es = Elasticsearch("http://localhost:9200")

# # Sample log entry
# log = {
#     "timestamp": datetime.now().isoformat(),
#     "level": "ERROR",
#     "message": "Unauthorized login attempt detected."
# }

# # Insert log into 'logs' index
# res = es.index(index="logs", document=log)
# print("✅ Log inserted:", res['result'])
