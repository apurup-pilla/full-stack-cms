import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Button, Alert, MenuItem, CircularProgress,
} from '@mui/material';
import { usersAPI } from '../services/api';

const ROLES = ['Administrator', 'Editor', 'Viewer'];

export default function UserFormDialog({ open, user, onClose, onSaved }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Viewer', status: 'active' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setForm(user
        ? { name: user.name, email: user.email, password: '', role: user.role, status: user.status }
        : { name: '', email: '', password: '', role: 'Viewer', status: 'active' }
      );
    }
  }, [open, user]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = { name: form.name, email: form.email, role: form.role };
      if (!isEdit || form.password) data.password = form.password;
      if (isEdit) data.status = form.status;

      if (isEdit) await usersAPI.update(user.id, data);
      else await usersAPI.create(data);

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
        <Box
          id="user-form"
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField label="Name" value={form.name} onChange={set('name')} required fullWidth size="small" autoFocus />
          <TextField label="Email" type="email" value={form.email} onChange={set('email')} required fullWidth size="small" />
          <TextField
            label={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
            type="password"
            value={form.password}
            onChange={set('password')}
            required={!isEdit}
            fullWidth
            size="small"
          />
          <TextField select label="Role" value={form.role} onChange={set('role')} fullWidth size="small">
            {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
          {isEdit && (
            <TextField select label="Status" value={form.status} onChange={set('status')} fullWidth size="small">
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          form="user-form"
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
