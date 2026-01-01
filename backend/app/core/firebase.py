import firebase_admin
from firebase_admin import credentials, storage, firestore
import os
import json

def initialize_firebase():
    """
    Initializes Firebase Admin SDK. 
    Requires 'firebase-service-account.json' in the backend directory.
    """
    try:
        # Check if already initialized
        firebase_admin.get_app()
    except ValueError:
        service_account_path = os.path.join(os.path.dirname(__file__), "firebase-service-account.json")
        if os.path.exists(service_account_path):
            try:
                with open(service_account_path) as f:
                    config = json.load(f)
                
                # Check for placeholders
                if "PASTE_YOUR_PRIVATE_KEY_HERE" in config.get("private_key", ""):
                    print("Warning: Firebase private key placeholder detected. Firebase features will be limited.")
                    return

                cred = credentials.Certificate(service_account_path)
                firebase_admin.initialize_app(cred, {
                    'storageBucket': f"{config.get('project_id')}.appspot.com"
                })
                print("Firebase initialized successfully.")
            except Exception as e:
                print(f"Warning: Failed to initialize Firebase: {e}. Firebase features will be disabled.")
        else:
            print("Warning: Firebase service account file not found. Firebase features will be disabled.")

def get_db():
    return firestore.client()

def get_bucket():
    return storage.bucket()
