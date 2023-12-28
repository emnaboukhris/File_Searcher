# app/__init__.py

from flask import Flask
from config.settings import Config
from flask_cors import CORS
from app.controllers.index_controller import index_controller
from app.controllers.search_controller import search_controller

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
app.register_blueprint(index_controller)
app.register_blueprint(search_controller)
