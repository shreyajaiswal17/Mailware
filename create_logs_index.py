from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")

# Step 1: Delete old index if exists
es.indices.delete(index="logs", ignore=[400, 404])
print("🗑️ Index deleted (if it existed).")

# Step 2: Create index with mapping
mapping = {
    "mappings": {
        "properties": {
            "timestamp": {"type": "date"},
            "level": {"type": "keyword"},
            "message": {"type": "text"}
        }
    }
}

es.indices.create(index="logs", body=mapping)
print("✅ Index created with mapping.")
