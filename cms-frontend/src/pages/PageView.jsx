import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Chip, CircularProgress,
  Alert, Button, Divider, Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { publicAPI } from '../services/api';
import Navbar from '../components/Navbar';
import '../content.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function PageView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    publicAPI.getPage(slug)
      .then(setPage)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to all pages
        </Button>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error">
            {error === 'Page not found' ? 'This page does not exist or is not published.' : error}
          </Alert>
        )}

        {page && (
          <Box sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
            {/* Page header */}
            <Box sx={{ px: { xs: 3, md: 5 }, pt: { xs: 4, md: 6 }, pb: 3 }}>
              {page.category && (
                <Chip
                  label={page.category.name}
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              )}

              <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.2, mb: 2 }}>
                {page.title}
              </Typography>

              <Divider sx={{ mb: 2.5 }} />

              <Stack direction="row" spacing={3}>
                {page.author?.name && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <PersonIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    <Typography variant="body2" color="text.secondary">
                      {page.author.name}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CalendarTodayIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(page.updatedAt)}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Page content */}
            <Box sx={{ px: { xs: 3, md: 5 }, pb: { xs: 4, md: 6 } }}>
              {page.content ? (
                <div
                  className="cms-content"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  This page has no content yet.
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
