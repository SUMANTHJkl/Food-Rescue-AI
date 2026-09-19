import os
import json
from datetime import datetime
from typing import Dict, Any, List

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/food_rescue")
LOCAL_LOG_FILE = os.path.join(os.path.dirname(__file__), "../data/processed/mongo_documents.json")


def log_audit_document(collection_name: str, document: Dict[str, Any]) -> bool:
    """
    Logs document to MongoDB if available, or appends to local JSON document store.
    """
    document["created_at"] = datetime.utcnow().isoformat()

    try:
        from pymongo import MongoClient
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        db = client.get_database()
        db[collection_name].insert_one(document.copy())
        return True
    except Exception:
        # Fallback to file-backed JSON document store
        try:
            os.makedirs(os.path.dirname(LOCAL_LOG_FILE), exist_ok=True)
            logs = []
            if os.path.exists(LOCAL_LOG_FILE):
                with open(LOCAL_LOG_FILE, "r", encoding="utf-8") as f:
                    logs = json.load(f)
            document["collection"] = collection_name
            logs.append(document)
            with open(LOCAL_LOG_FILE, "w", encoding="utf-8") as f:
                json.dump(logs, f, indent=2)
            return True
        except Exception:
            return False


def get_audit_documents(collection_name: str, limit: int = 50) -> List[Dict[str, Any]]:
    """
    Retrieves audit documents from MongoDB or JSON fallback.
    """
    try:
        from pymongo import MongoClient
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        db = client.get_database()
        docs = list(db[collection_name].find({}, {"_id": 0}).limit(limit))
        if docs:
            return docs
    except Exception:
        pass

    if os.path.exists(LOCAL_LOG_FILE):
        try:
            with open(LOCAL_LOG_FILE, "r", encoding="utf-8") as f:
                logs = json.load(f)
            return [l for l in logs if l.get("collection") == collection_name][:limit]
        except Exception:
            pass
    return []
