from flask import Blueprint, request, jsonify, current_app
import app
from app.services.indexing_service import IndexingService
from app.services.classification_service import ClassificationService
import os
from werkzeug.utils import secure_filename

index_controller = Blueprint('index_controller', __name__)


@index_controller.before_request
def before_request():
    # Create an instance of IndexingService within the Flask app context
    current_app.indexing_service = IndexingService()
    current_app.classification_service = ClassificationService()


@index_controller.route('/index/upload', methods=['POST'])
def upload_file():
    try:
        uploaded_file = request.files['file']
        category = current_app.classification_service.classify_document(
            uploaded_file.filename)

        file_path = current_app.indexing_service.save_file(
            uploaded_file, category)

        # Extract title and content from the file based on file type
        if file_path.lower().endswith('.pdf'):
            content = current_app.indexing_service.pdf_reader(file_path)
        else:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:

                content = file.read()
        print("category")
        print(category)

        # Extract title and content from the file (this might depend on the file type)
        title = uploaded_file.filename
        # Index the document
        document_id = current_app.indexing_service.index_document_auto(
            title, content, file_path)

        return jsonify({"message": "File uploaded and indexed successfully.", "document_id": document_id})

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@index_controller.route('/index/auto', methods=['POST'])
def index_document_auto():
    try:
        data = request.get_json()

        title = data.get('title')
        content = data.get('content')
        print(content)

        if not title or not content:
            return jsonify({"error": "Title and content are required"}), 400

        document_id = current_app.indexing_service.index_document_auto(
            title, content)

        return jsonify({"document_id": document_id})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@index_controller.route('/index/manual', methods=['POST'])
def index_document_manual():
    try:
        data = request.get_json()
        title = data.get('title')
        author = data.get('author')
        metadata = data.get('metadata')
        document_id = data.get('document_id')
        document_id = current_app.indexing_service.index_document_manual(
            document_id, title, author, metadata)

        return jsonify({"document_id": document_id})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
