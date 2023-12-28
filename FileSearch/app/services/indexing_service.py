from datetime import datetime
from collections import defaultdict
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from db.database import get_db
from app.models.document import Document
import nltk
import os
from werkzeug.utils import secure_filename
import fitz
from bson import ObjectId

nltk.download("punkt")
nltk.download("stopwords")


class IndexingService:
    def __init__(self):
        self.db = get_db()
        self.stop_words = set(stopwords.words("english"))
        self.stemmer = PorterStemmer()
        self.upload_folder = './uploads'

    def index_document_auto(self, title, content, file_path):
        # Create a Document instance
        upload_date = datetime.utcnow()
        document = Document(title, content, upload_date, file_path)

        # Index the document in MongoDB with automatic indexing based on date and time
        collection = self.db.get_collection("documents_auto")
        result = collection.insert_one({
            "title": document.title,
            "content": document.content,
            "file_path": document.file_path,
            "upload_date": document.upload_date
        })

        # Get the inserted document's ID
        document_id = str(result.inserted_id)

        # update the inverted index for the document's content
        inverted_index = self.create_inverted_index(
            document.content, document_id)

        return document_id

    def index_document_manual(self, document_id, title, author, metadata):
        print(document_id)
        # Check if the document already exists based on the document_id
        object_id = ObjectId(document_id)
        existing_document = self.db.get_collection(
            "documents_auto").find_one({"_id": object_id})
        print("existing_document")
        print(existing_document)

        if existing_document:
            # If the document exists, update its title, author, and metadata
            self.db.get_collection("documents_auto").update_one({"_id": object_id}, {
                "$set": {"title": title, "author": author, "metadata": metadata}})
        else:
            print("the document does not exist")

        return document_id

    def create_inverted_index(self, content, document_id):
        # Tokenize, remove stop words, and apply stemming for the content
        terms = self.tokenize_and_clean(content)

        # Retrieve the existing inverted index from MongoDB
        inverted_index_collection = self.db.get_collection(
            "inverted_index_global")
        inverted_index_document = inverted_index_collection.find_one()

        # If the document doesn't exist, initialize an empty inverted index
        inverted_index = defaultdict(
            lambda: {"document_frequencies": defaultdict(int)})

        # Increment the total documents count
        if inverted_index_document:
            total_documents = inverted_index_document.get(
                "total_documents", 0) + 1
        else:
            # Handle the case when inverted_index_document is None
            total_documents = 1

        if inverted_index_document:
            # If the document exists, update its inverted index
            existing_index = inverted_index_document.get("inverted_index", {})
            for term, data in existing_index.items():
                data["document_frequencies"] = defaultdict(
                    int, data.get("document_frequencies", {}))
                inverted_index[term] = data

        for term in terms:
            # If the term is new, add it to the inverted index
            if term not in inverted_index:
                inverted_index[term] = {
                    "document_frequencies": defaultdict(int)}

            # Increment the frequency for the current document
            inverted_index[term]["document_frequencies"][document_id] += 1

        # Update or insert the inverted index in MongoDB
        inverted_index_collection.update_one({}, {
            "$set": {"inverted_index": inverted_index, "total_documents": total_documents}
        }, upsert=True)

        return inverted_index

    def tokenize_and_clean(self, content):
        # Tokenize, remove stop words, and apply stemming
        terms = word_tokenize(content.lower())
        terms = [self.stemmer.stem(
            term) for term in terms if term.isalnum() and term not in self.stop_words]
        return terms

    def save_file(self, uploaded_file, category):
        # Adjust the save logic based on your requirements (this is just an example)
        category_folder = os.path.join(self.upload_folder, category)

        # Create the category folder if it doesn't exist
        if not os.path.exists(category_folder):
            os.makedirs(category_folder)

        file_path = os.path.join(
            category_folder, secure_filename(uploaded_file.filename))
        uploaded_file.save(file_path)
        return file_path

    def pdf_reader(self, file_path):
        text = ""
        with fitz.open(file_path) as pdf_document:
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                text += page.get_text()
        return text
