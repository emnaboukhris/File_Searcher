import { Box, Stack, CircularProgress, Typography } from '@mui/material';

// The LoaderComponent is used to display a loading indicator.
const LoaderComponent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        marginY: '40px',
        textAlign: 'center',
      }}
    >
      <Stack direction="row" spacing={2}>
        <CircularProgress color="inherit" />
        <Typography variant="h5">Loading...</Typography>
      </Stack>
    </Box>
  );
};

export default LoaderComponent;
