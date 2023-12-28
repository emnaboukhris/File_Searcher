# app/models/document.py

class Document:
    def __init__(self, title, content, upload_date, file_path, author='', metadata=''):
        self.title = title
        self.content = content
        self.file_path = file_path
        # You can set the upload date based on your requirements
        self.upload_date = upload_date
        self.author = author
        self.metadata = metadata

    # You may include other methods or properties as needed
