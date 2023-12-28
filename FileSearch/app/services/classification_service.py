class ClassificationService:
    def __init__(self):
        # Define categories with associated keywords
        self.document_types = {
            "pdf": [".pdf"],
            "image": [".jpg", ".jpeg", ".png", ".gif"],
            "text": [".txt", ".doc", ".docx"],
        }

        self.categories = {
            "Technology": ["programming", "software", "coding", "AI", "machine learning"],
            "Science": ["research", "experiment", "discovery", "biology", "physics"],
            "Sports": ["football", "basketball", "tennis", "athletics", "golf"],
            "Business": ["finance", "economics", "market", "startup", "entrepreneurship"],
            "Health": ["medicine", "nutrition", "fitness", "wellness", "healthcare"],
            "Art": ["painting", "sculpture", "music", "literature", "film"],
            "Travel": ["adventure", "exploration", "tourism", "destination", "culture"],
            "History": ["ancient", "medieval", "modern", "war", "archaeology"],
            "Environment": ["sustainability", "climate", "conservation", "ecology", "green"],
            "Default Category": []  # Default category if no keywords match
        }

    def classify_document(self, filename):
        filename_lower = filename.lower()

        for doc_type, extensions in self.document_types.items():
            if any(filename_lower.endswith(ext) for ext in extensions):
                return doc_type

        return "default"

    def classify_pdf(self, pdf_content):
        pdf_content = "Content from PDF file"

        # Iterate through categories and check for matching keywords
        for category, keywords in self.categories.items():
            for keyword in keywords:
                if keyword.lower() in pdf_content.lower():
                    return category

        # If no matches found, assign the document to the default category
        return "Default Category"
