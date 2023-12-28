import { useEffect, useState } from 'react';
import {
  AppBar,
  CssBaseline,
  Switch,
  ThemeProvider,
  Typography,
  createTheme,
  TextField,
  Box,
  Tabs,
  Tab,
  Grid,
  Divider,
  Container,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { Search, Upload } from '@mui/icons-material';
import UploadFile from '../components/UploadFile';
import { Document } from '../models/models';
import BookIcon from '@mui/icons-material/Book';
import DocumentList from '../components/DocumentList';

const MainPage: React.FC = () => {
  // State variables
  const [darkMode, setDarkMode] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [initialSearchPerformed, setInitialSearchPerformed] = useState(false);

  // Create a function to execute the search query
  const handleSearch = async () => {
    try {
      setLoading(true);

      // Make a POST request to the Flask backend's search endpoint
      const response = await fetch('http://127.0.0.1:5000/index/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        const searchResults: Document[] = data.results;

        // Handle the search results as needed
        console.log('Search results:', searchResults);
        setFilteredDocuments(searchResults);

        // Set the flag to true after the first search
        setInitialSearchPerformed(true);

        setLoading(false);
        setError(false);
      } else {
        const errorData = await response.json();
        console.error('Error searching:', errorData);

        setLoading(false);
        setError(true);
      }
    } catch (error) {
      console.error('Error searching:', error);

      setLoading(false);
      setError(true);
    }
  };

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 700,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  // Toggle dark mode
  const darkModeChangeHandler = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: '#121212' }}>
        <Toolbar>
          {/* Conditionally render the logo based on selected tab */}
          <img src={'google.png'} alt="google Logo" width="100" />
          <Box sx={{ flexGrow: 1 }} />

          {/* Control theme mode */}
          <Switch checked={darkMode} onChange={darkModeChangeHandler} />
        </Toolbar>
      </AppBar>
      <>
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            marginTop: '10px',
            zIndex: 3,
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="Tabs"
              sx={{ paddingLeft: '20px' }}
            >
              <Tab icon={<Upload />} iconPosition="start" label=" Upload" />
              <Tab label="Documents" icon={<BookIcon />} iconPosition="start" />
            </Tabs>
          </Box>
          <Divider />
        </Box>

        {selectedTab === 0 ? (
          <Container>
            <Grid container>
              <Grid item md={12} xs={12}>
                <Box>
                  <UploadFile />
                </Box>
              </Grid>
            </Grid>
          </Container>
        ) : (
          <>
            <Container>
              <Grid container>
                <Grid item md={12} xs={12}>
                  <Box sx={{ flexGrow: 1, paddingY: 3 }} />

                  <Stack
                    direction={initialSearchPerformed ? 'row' : 'column'}
                    spacing={3}
                    sx={{
                      alignItems: 'center',
                      margin: 'auto',
                      textAlign: 'center',
                    }}
                  >
                    <img
                      src={'google.png'}
                      alt="google Logo"
                      width={initialSearchPerformed ? '100' : '400'}
                    />
                    <TextField
                      sx={{
                        width: '40vw',
                      }}
                      placeholder="Search for documents..."
                      size="small"
                      id="fullWidth"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleSearch}>
                              <Search />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>

                  {initialSearchPerformed ? (
                    <>
                      {filteredDocuments.length === 0 ? (
                        <Box
                          sx={{
                            width: '40vw',
                            paddingTop: '3vw',
                            margin: 'auto',
                            textAlign: 'start',
                          }}
                        >
                          <Typography variant="h1">
                            No documents match the search criteria.
                          </Typography>
                        </Box>
                      ) : (
                        <DocumentList documents={filteredDocuments} />
                      )}{' '}
                    </>
                  ) : (
                    <></>
                  )}
                </Grid>
              </Grid>
            </Container>
          </>
        )}
      </>{' '}
      {/* Closing parenthesis for the fragment */}
    </ThemeProvider>
  );
};

export default MainPage;
