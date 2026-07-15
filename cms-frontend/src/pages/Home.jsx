import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  CardActionArea, Chip, CircularProgress, Alert, Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';
import Navbar from '../components/Navbar';

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').slice(0, 160).trim();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function PageCard({ page }) {
  const navigate = useNavigate();
  const excerpt = stripHtml(page.content);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
      <CardActionArea sx={{ flexGrow: 1 }} onClick={() => navigate(`/${page.slug}`)}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
            {page.category && (
              <Chip label={page.category.name} size="small" color="primary" variant="outlined" />
            )}
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ lineHeight: 1.3 }}>
            {page.title}
          </Typography>
          {excerpt && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              {excerpt}{excerpt.length === 160 ? '…' : ''}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Typography variant="caption" color="text.disabled">
              By {page.author?.name ?? 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {formatDate(page.updatedAt)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Home() {
  const [pages, setPages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');

  const load = (params = {}) => {
    setLoading(true);
    publicAPI.getPages(params)
      .then((data) => setPages(data.pages ?? data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    publicAPI.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleCategory = (slug) => {
    const next = activeCategory === slug ? '' : slug;
    setActiveCategory(next);
    load({ category: next || undefined, search: search || undefined });
  };

  const handleSearch = (q) => {
    setSearch(q);
    load({ search: q || undefined, category: activeCategory || undefined });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Navbar onSearch={handleSearch} />

      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 5, md: 8 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            {import.meta.env.VITE_SITE_NAME || 'My CMS Site'}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85 }}>
            Browse the latest published content
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>

        {/* Category filter */}
        {categories.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="All"
              onClick={() => handleCategory('')}
              color={activeCategory === '' ? 'primary' : 'default'}
              variant={activeCategory === '' ? 'filled' : 'outlined'}
            />
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                onClick={() => handleCategory(cat.slug)}
                color={activeCategory === cat.slug ? 'primary' : 'default'}
                variant={activeCategory === cat.slug ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        )}

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : pages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
            <Typography variant="h6">No published pages yet.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Pages set to <strong>published</strong> in the CMS will appear here.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {pages.length} page{pages.length !== 1 ? 's' : ''}
            </Typography>
            <Grid container spacing={3}>
              {pages.map((page) => (
                <Grid item xs={12} sm={6} md={4} key={page.id}>
                  <PageCard page={page} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}
