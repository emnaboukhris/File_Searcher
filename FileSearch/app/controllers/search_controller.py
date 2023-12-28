from flask import Blueprint, request, jsonify, current_app
from app.services import search_service
from app.services.search_service import SearchService
from flask import Flask, send_file
import os

search_controller = Blueprint("search_controller", __name__)


@search_controller.before_request
def before_request():
    # Create an instance of SearchService within the Flask app context
    current_app.search_service = SearchService()


@search_controller.route('/index/open_pdf', methods=['POST'])
def open_pdf():
    data = request.get_json()
    file_path = data.get("file_path")
    print("file_path")
    print(file_path)

    pdf_path = os.path.abspath(file_path)

    print(f"Absolute path to PDF: {pdf_path}")

    return send_file(pdf_path, as_attachment=False)


@search_controller.route("/index/search", methods=["POST"])
def search():
    data = request.get_json()
    query = data.get("query")  # Use the key directly
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400

    # Perform the search
    results = current_app.search_service.search(query)

    print("the controller")
    print(results)

    # Fetch detailed information about the matching documents
    detailed_results = []
    for doc_id, score in results:
        print(doc_id, score)
        detailed_doc = current_app.search_service.get_detailed_document_info(
            doc_id, score)
        if detailed_doc:
            detailed_results.append(detailed_doc)
    print("these are the results")
    print(detailed_results)
    return jsonify({"results": detailed_results})
