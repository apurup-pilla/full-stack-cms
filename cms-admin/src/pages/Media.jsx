import { useEffect, useState, useRef } from 'react';
import {
  Box, Card, CardMedia, CardActions, Typography, Button,
  Grid, IconButton, Tooltip, Alert, CircularProgress, Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadIcon from '@mui/icons-material/Upload';
import { mediaAPI } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Media() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    mediaAPI.getAll()
      .then(setMedia)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await mediaAPI.upload(formData);
      load();
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async () => {
    try {
      await mediaAPI.remove(toDelete.id);
      setConfirmOpen(false);
      setMedia((prev) => prev.filter((m) => m.id !== toDelete.id));
    } catch (err) {
      setError(err.message);
      setConfirmOpen(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Media Library</Typography>
          <Typography variant="body2" color="text.secondary">{media.length} files uploaded</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
          onClick={() => fileRef.current.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : 'Upload Image'}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleUpload} />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : media.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <UploadIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
          <Typography>No images uploaded yet.</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => fileRef.current.click()}>Upload your first image</Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {media.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height={160}
                  image={item.url}
                  alt={item.originalName}
                  sx={{ objectFit: 'cover', bgcolor: 'grey.100' }}
                />
                <Box sx={{ p: 1.5, flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={500} noWrap title={item.originalName}>
                    {item.originalName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip label={formatBytes(item.size)} size="small" variant="outlined" />
                    <Chip label={item.uploader?.name ?? '—'} size="small" />
                  </Box>
                </Box>
                <CardActions sx={{ pt: 0 }}>
                  <Tooltip title={copied === item.id ? 'Copied!' : 'Copy URL'}>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon fontSize="small" />}
                      onClick={() => copyUrl(item.url, item.id)}
                      color={copied === item.id ? 'success' : 'primary'}
                    >
                      {copied === item.id ? 'Copied' : 'Copy URL'}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" sx={{ ml: 'auto' }}
                      onClick={() => { setToDelete(item); setConfirmOpen(true); }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Image"
        message={`Delete "${toDelete?.originalName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
