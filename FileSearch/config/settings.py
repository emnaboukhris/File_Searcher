# config/settings.py

class Config:
    DEBUG = True  # Set to False in production
    MONGODB_URI = "mongodb://localhost:27017/document_management_system"
    MONGODB_DATABASE = "document_management_system"
