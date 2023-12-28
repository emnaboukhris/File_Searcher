import math
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
from db.database import get_db
from datetime import datetime
from bson import ObjectId


class SearchService:
    def __init__(self):
        self.db = get_db()
        self.stemmer = PorterStemmer()

    def search(self, query):
        # Search in Inverted Index
        inverted_index_results = self.search_in_inverted_index(query)

        # Search in Document Index
        document_index_results = self.search_in_document_index(query)

        # Evaluate and sort results based on certain criteria (e.g., relevance)
        sorted_results = self.evaluate_and_sort_results(
            inverted_index_results, document_index_results)
        return sorted_results

    def search_in_inverted_index(self, query):
        terms = self.tokenize_and_clean(query)

        # Perform search in the inverted index
        inverted_index_collection = self.db.get_collection(
            "inverted_index_global")
        inverted_index_document = inverted_index_collection.find_one()

        if inverted_index_document:
            inverted_index = inverted_index_document["inverted_index"]
            document_frequencies = {}  # Dictionary to store TF-IDF scores per document ID

            # Total number of documents in the collection
            total_documents = inverted_index_document.get("total_documents", 1)

            for term in terms:
                if term in inverted_index:
                    term_info = inverted_index[term]
                    # Access the nested "document_frequencies" dictionary
                    frequencies_per_doc = term_info.get(
                        "document_frequencies", {})
                    # Calculate the inverse document frequency (IDF)
                    idf = math.log(total_documents /
                                   (len(frequencies_per_doc) + 1))

                    for doc_id, frequency in frequencies_per_doc.items():
                        # Calculate the term frequency (TF)
                        tf = frequency / len(frequencies_per_doc)
                        # Calculate the TF-IDF score
                        tf_idf = tf * idf
                        document_frequencies[doc_id] = document_frequencies.get(
                            doc_id, 0) + tf_idf
            return document_frequencies

        else:
            return {}

    def search_in_document_index(self, query):
        # Perform search in the document index
        collection = self.db.get_collection("documents_auto")
        matching_documents = []

        # Search by title, author, metadata, content, or other criteria
        title_matches = collection.find(
            {"title": {"$regex": query, "$options": "i"}})
        author_matches = collection.find(
            {"author": {"$regex": query, "$options": "i"}})
        metadata_matches = collection.find(
            {"metadata": {"$regex": query, "$options": "i"}})
        content_matches = collection.find(
            {"content": {"$regex": query, "$options": "i"}})

        for doc in title_matches:
            score = self.calculate_score(doc, query)
            matching_documents.append({str(doc["_id"]): score})

        for doc in author_matches:
            score = self.calculate_score(doc, query)
            matching_documents.append({str(doc["_id"]): score})

        for doc in metadata_matches:
            score = self.calculate_score(doc, query)
            matching_documents.append({str(doc["_id"]): score})

        for doc in content_matches:
            score = self.calculate_score(doc, query)
            matching_documents.append({str(doc["_id"]): score})

        return matching_documents

    def calculate_score(self, document, query):
        # Customize the scoring logic based on your requirements
        # In this example, I'm using a simple scoring system based on the number of matching terms
        title = document.get("title", "").lower()
        author = document.get("author", "").lower()
        metadata = document.get("metadata", "").lower()
        content = document.get("content", "").lower()
        query_terms = self.tokenize_and_clean(query.lower())

        # Count the number of matching terms in title, author, metadata, and content
        title_match_count = sum(term in title for term in query_terms)
        author_match_count = sum(term in author for term in query_terms)
        metadata_match_count = sum(term in metadata for term in query_terms)
        content_match_count = sum(term in content for term in query_terms)

        score = title_match_count + author_match_count + \
            metadata_match_count + content_match_count
        return score

    def evaluate_and_sort_results(self, inverted_index_results, document_index_results):
        combined_results = {}

        # Add scores from inverted_index_results
        for doc_id, score in inverted_index_results.items():
            combined_results[doc_id] = combined_results.get(doc_id, 0) + score

        # Add scores from document_index_results
        if isinstance(document_index_results, list):

            for doc_dict in document_index_results:
                # Extract the document ID from the dictionary
                doc_id = next(iter(doc_dict))
                combined_results[doc_id] = combined_results.get(
                    doc_id, 0) + 1
        elif isinstance(document_index_results, dict):
            # Handle the case where document_index_results is a dictionary
            for doc_id, score in document_index_results.items():
                combined_results[doc_id] = combined_results.get(
                    doc_id, 0) + score

        # Example: Sort by the combined score
        sorted_results = sorted(combined_results.items(),
                                key=lambda item: item[1], reverse=True)
        return sorted_results

    def get_document_upload_date(self, document_id):
        # Fetch the document from the document index and retrieve its upload date
        collection = self.db.get_collection("documents_auto")
        doc = collection.find_one({"_id": document_id})

        if doc:
            return doc.get("upload_date", datetime.min)
        else:
            return datetime.min

    def tokenize_and_clean(self, content):
        # Tokenize, remove stop words, and apply stemming
        terms = word_tokenize(content.lower())
        terms = [self.stemmer.stem(term) for term in terms if term.isalnum()]
        return terms

    def get_detailed_document_info(self, document_id, score):
        # Fetch detailed information about the document from the document index
        object_id = ObjectId(document_id)

        # Fetch detailed information about the document from the document index

        doc = self.db.get_collection(
            "documents_auto").find_one({"_id": object_id})

        if doc:
            # Customize the response based on your needs
            detailed_info = {
                "document_id": str(doc["_id"]),
                "title": doc.get("title", ""),
                "author": doc.get("author", ""),
                "content": doc.get("content", ""),
                "metadata": doc.get("metadata", ""),
                "upload_date": doc.get("upload_date", ""),
                "file_path": doc.get("file_path", ""),
                "score": round(score, 2)
            }
            return detailed_info
        else:
            return None
