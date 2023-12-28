import logging
from flask import Flask
from app.controllers.index_controller import index_controller
from app.controllers.search_controller import search_controller

from config.settings import Config

logging.basicConfig(level=logging.DEBUG)  # Set logging level to DEBUG


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Register blueprints
    app.register_blueprint(index_controller)
    app.register_blueprint(search_controller)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
