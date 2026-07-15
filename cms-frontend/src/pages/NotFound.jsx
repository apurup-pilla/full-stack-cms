import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Navbar />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <Typography variant="h1" fontWeight={800} color="primary.main" sx={{ fontSize: '6rem', lineHeight: 1 }}>
            404
          </Typography>
          <Typography variant="h5" fontWeight={600} gutterBottom>Page not found</Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            The page you're looking for doesn't exist or hasn't been published yet.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
