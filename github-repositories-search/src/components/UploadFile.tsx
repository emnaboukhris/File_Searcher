import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const UploadFile = () => {
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
  const [showAddIndex, setshowAddIndex] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [document_id, setDocumentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [metadata, setMetadata] = useState('');

  const handleUpload = async () => {
    try {
      if (!file) {
        console.error('No file selected for upload.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:5000/index/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const uploadedDocumentId = data.document_id;
        console.log('File uploaded and indexed:', data);

        setDocumentId(uploadedDocumentId);
        setshowAddIndex(true);
      } else {
        const errorData = await response.json();
        console.error('Error uploading file:', errorData);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleToggleDescriptionForm = () => {
    setShowDescriptionForm(!showDescriptionForm);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setShowDescriptionForm(false);
    setTitle('');
    setAuthor('');
    setMetadata('');
  };

  const handleSubmitDescription = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/index/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_id,
          title,
          author,
          metadata,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Form data submitted:', data);

        // Close the description form after submission
        setShowDescriptionForm(false);
        setFile(null);
        setShowDescriptionForm(false);
        setTitle('');
        setAuthor('');
        setMetadata('');
        setshowAddIndex(false);
      } else {
        const errorData = await response.json();
        console.error('Error submitting form data:', errorData);
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '70vh',
          marginY: '40px',
          textAlign: 'center',
          border: '2px dotted gray',
          borderRadius: '10px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginY: '20px',
          }}
        >
          <Stack
            direction="column"
            spacing={5}
            sx={{
              alignItems: 'center',
              margin: 'auto',
              textAlign: 'center',
            }}
          >
            <img src={'up.png'} alt="google Logo" width="200" />
          </Stack>
          {!file && (
            <>
              <input
                type="file"
                accept=".pdf, .txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  sx={{ marginTop: '20px' }}
                >
                  Upload
                </Button>
              </label>
            </>
          )}
          {file && (
            <>
              <Stack
                direction="row"
                spacing={3}
                sx={{
                  alignItems: 'center',
                  margin: 'auto',
                  textAlign: 'center',
                  marginTop: '20px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginY: '10px',
                  }}
                >
                  <Typography variant="body2" sx={{ marginRight: '10px' }}>
                    Selected File: {file.name}
                  </Typography>
                  <IconButton
                    color="primary"
                    aria-label="delete file"
                    onClick={handleDeleteFile}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  sx={{ marginY: '10px' }}
                >
                  Save
                </Button>
              </Stack>
              {showAddIndex && (
                <Button onClick={handleToggleDescriptionForm}>
                  Add Manual Index
                </Button>
              )}
            </>
          )}
          {showDescriptionForm && (
            <Dialog
              open={showDescriptionForm}
              onClose={handleToggleDescriptionForm}
            >
              <DialogTitle>Manual Index Form</DialogTitle>
              <DialogContent>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ marginY: '10px' }}
                />
                <TextField
                  label="Author"
                  variant="outlined"
                  fullWidth
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  sx={{ marginY: '10px' }}
                />
                <TextField
                  label="Metadata"
                  variant="outlined"
                  fullWidth
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  sx={{ marginY: '10px' }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleToggleDescriptionForm} color="primary">
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitDescription}
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default UploadFile;
