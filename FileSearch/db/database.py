from pymongo import MongoClient
from flask import g, current_app


def get_db():
    if 'db' not in g:
        mongodb_uri = current_app.config.get('MONGODB_URI')
        mongodb_database = current_app.config.get('MONGODB_DATABASE')

        if mongodb_uri and mongodb_database:
            client = MongoClient(mongodb_uri)
            g.db = client[mongodb_database]
        else:
            raise RuntimeError(
                "MONGODB_URI and MONGODB_DATABASE not configured.")

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.client.close()
