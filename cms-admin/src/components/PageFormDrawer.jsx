import { useState, useEffect } from 'react';
import {
  Drawer, Box, AppBar, Toolbar, Typography,
  TextField, MenuItem, Button, Alert, Grid, CircularProgress,
} from '@mui/material';
import RichTextEditor from './RichTextEditor';
import { pagesAPI, categoriesAPI } from '../services/api';

const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const EMPTY = { title: '', slug: '', content: '', status: 'draft', categoryId: '' };

export default function PageFormDrawer({ open, page, onClose, onSaved }) {
  const isEdit = Boolean(page);
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoriesAPI.getAll().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (open) {
      setError('');
      setForm(page
        ? { title: page.title, slug: page.slug, content: page.content || '', status: page.status, categoryId: page.categoryId ?? '' }
        : EMPTY
      );
    }
  }, [open, page]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      ...(isEdit ? {} : { slug: toSlug(title) }),
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.slug) { setError('Title and slug are required.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        status: form.status,
        categoryId: form.categoryId || undefined,
      };
      if (isEdit) await pagesAPI.update(page.id, data);
      else await pagesAPI.create(data);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', md: 760 }, display: 'flex', flexDirection: 'column' } }}
    >
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
            {isEdit ? 'Edit Page' : 'New Page'}
          </Typography>
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={loading}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? 'Saving…' : 'Save'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Title"
            value={form.title}
            onChange={handleTitleChange}
            required fullWidth
            autoFocus
          />
          <TextField
            label="Slug"
            value={form.slug}
            onChange={set('slug')}
            required fullWidth
            helperText="URL identifier — auto-generated from title"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField select label="Status" value={form.status} onChange={set('status')} fullWidth size="small">
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select label="Category" value={form.categoryId} onChange={set('categoryId')} fullWidth size="small">
                <MenuItem value="">None</MenuItem>
                {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Content</Typography>
            <RichTextEditor
              value={form.content}
              onChange={(content) => setForm((prev) => ({ ...prev, content }))}
            />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
