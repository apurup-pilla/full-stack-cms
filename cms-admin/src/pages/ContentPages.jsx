import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip,
  Button, CircularProgress, Alert, TextField, MenuItem, InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { pagesAPI } from '../services/api';
import PageFormDrawer from '../components/PageFormDrawer';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUS_COLORS = { published: 'success', draft: 'warning', archived: 'default' };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ContentPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    pagesAPI.getAll({ search: search || undefined, status: statusFilter || undefined })
      .then(setPages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, statusFilter]);

  const openNew  = ()  => { setSelected(null); setDrawerOpen(true); };
  const openEdit = (p) => { setSelected(p);    setDrawerOpen(true); };
  const askDelete = (p) => { setToDelete(p);  setConfirmOpen(true); };

  const handleDelete = async () => {
    try {
      await pagesAPI.remove(toDelete.id);
      setConfirmOpen(false);
      load();
    } catch (err) {
      setError(err.message);
      setConfirmOpen(false);
    }
  };

  const published = pages.filter((p) => p.status === 'published').length;
  const drafts    = pages.filter((p) => p.status === 'draft').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Pages</Typography>
          <Typography variant="body2" color="text.secondary">{published} published · {drafts} drafts</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>New Page</Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search title or slug…"
          size="small" sx={{ width: 300 }}
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        <TextField select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ width: 160 }} label="Status">
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="published">Published</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </TextField>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Updated</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id} hover>
                      <TableCell><Typography variant="body2" fontWeight={500}>{page.title}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{page.slug}</Typography>
                      </TableCell>
                      <TableCell>
                        {page.category
                          ? <Chip label={page.category.name} size="small" variant="outlined" />
                          : <Typography variant="caption" color="text.disabled">—</Typography>
                        }
                      </TableCell>
                      <TableCell><Typography variant="body2">{page.author?.name ?? '—'}</Typography></TableCell>
                      <TableCell>
                        <Chip label={page.status} size="small" color={STATUS_COLORS[page.status] || 'default'} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{formatDate(page.updatedAt)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(page)}><EditIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => askDelete(page)}><DeleteIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No pages found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <PageFormDrawer open={drawerOpen} page={selected} onClose={() => setDrawerOpen(false)} onSaved={load} />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Page"
        message={`Delete "${toDelete?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
