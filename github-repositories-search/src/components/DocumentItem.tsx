import React, { useState } from 'react';
import { ListItem, Typography, Box, Link, Stack, Chip } from '@mui/material';
import {
  FiberManualRecord,
  InsertDriveFile,
  PictureAsPdf,
} from '@mui/icons-material';
import { Document } from '../models/models';

// Props for the DocumentItem component
export interface DocumentItemProps {
  document: Document; // Assuming you have a Document interface or type
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document }) => {
  // State to manage whether the document is starred or not
  const [value, setValue] = useState<boolean>(false);

  const openDocument = async () => {
    try {
      console.log(document);
      // Make a POST request to the Flask backend's open PDF endpoint
      const response = await fetch('http://127.0.0.1:5000/index/open_pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: document?.file_path }),
      });

      if (response.ok) {
        // Handle success if needed
        console.log('PDF opened successfully');
      } else {
        // Handle error if needed
        console.error('Error opening PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
    }
  };

  // Function to get the file icon based on the document type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <PictureAsPdf />;
      // Add more cases for other file types if needed
      default:
        return <InsertDriveFile />;
    }
  };

  return (
    <>
      <ListItem
        alignItems="flex-start"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 2,
        }}
      >
        <Box
          sx={{
            flex: '0 0 calc(90% - 16px)',
            maxWidth: 'calc(90% - 16px)',
          }}
        >
          {/* File Icon */}

          <Stack direction="row" spacing={1}>
            {/* Document Title and Link */}

            {/* {getFileIcon('pdf')} */}

            <Typography variant="h5" color="text.secondary">
              <Link href="#" onClick={openDocument} underline="hover">
                {document?.title}
              </Link>

              <Chip
                label={document?.score}
                sx={{
                  margin: 2,
                  color: 'grey',
                }}
                size="small"
                variant="outlined"
              />
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              maxWidth: '100%', // Allow it to take the full width
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {document?.content}
          </Typography>

          {document?.author && (
            <Typography variant="body2" color="text.secondary">
              author: {document.author}
            </Typography>
          )}

          {document?.metadata && (
            <Typography variant="body2" color="text.secondary">
              metadata: {document.metadata}
            </Typography>
          )}

          {document?.upload_date && (
            <Typography variant="body2" color="text.secondary">
              Created on:{' '}
              {new Date(document.upload_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            flex: '0 0 calc(30% - 16px)',
            width: '100px',
            alignContent: 'center',
          }}
        ></Box>
      </ListItem>
    </>
  );
};

export default DocumentItem;
