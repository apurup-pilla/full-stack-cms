import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, InputBase, Box, IconButton,
  useScrollTrigger, Container,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from 'react-router-dom';

const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'My CMS Site';

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const elevated = useScrollTrigger({ disableHysteresis: true, threshold: 10 });

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <AppBar
      position="sticky"
      elevation={elevated ? 2 : 0}
      sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexGrow: 1 }}
            onClick={() => navigate('/')}
          >
            <ArticleIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {SITE_NAME}
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex', alignItems: 'center',
              bgcolor: 'grey.100', borderRadius: 2, px: 1.5, py: 0.5,
            }}
          >
            <InputBase
              placeholder="Search pages…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ fontSize: 14, width: { xs: 120, sm: 200 } }}
            />
            <IconButton type="submit" size="small">
              <SearchIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
