import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Grid, Typography,
  Divider, List, ListItem, ListItemText, Chip, CircularProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CategoryIcon from '@mui/icons-material/Category';
import ImageIcon from '@mui/icons-material/Image';
import { usersAPI, pagesAPI, categoriesAPI, mediaAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ACTIVITY = [
  { action: 'User logged in', detail: 'Session started', time: 'Just now',  status: 'new' },
  { action: 'Page published',  detail: 'Content went live',  time: '1 hr ago', status: 'published' },
  { action: 'Page updated',    detail: 'Content edited',     time: '3 hrs ago', status: 'updated' },
  { action: 'User created',    detail: 'New account added',  time: '5 hrs ago', status: 'new' },
];
const STATUS_COLORS = { updated: 'warning', new: 'success', published: 'info' };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, published: 0, drafts: 0, categories: 0, media: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([usersAPI.getAll(), pagesAPI.getAll(), categoriesAPI.getAll(), mediaAPI.getAll()])
      .then(([users, pages, cats, media]) => {
        setStats({
          users: users.length,
          published: pages.filter((p) => p.status === 'published').length,
          drafts: pages.filter((p) => p.status === 'draft').length,
          categories: cats.length,
          media: media.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const CARDS = [
    { label: 'Users',      value: stats.users,      icon: <PeopleIcon />,       color: '#3b82f6' },
    { label: 'Published',  value: stats.published,  icon: <CheckCircleIcon />,  color: '#10b981' },
    { label: 'Drafts',     value: stats.drafts,     icon: <EditNoteIcon />,     color: '#f59e0b' },
    { label: 'Categories', value: stats.categories, icon: <CategoryIcon />,     color: '#8b5cf6' },
    { label: 'Media',      value: stats.media,      icon: <ImageIcon />,        color: '#ec4899' },
    { label: 'Total Pages',value: stats.published + stats.drafts, icon: <ArticleIcon />, color: '#64748b' },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Welcome back, {user?.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Here's a live snapshot of your CMS.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {CARDS.map(({ label, value, icon, color }) => (
          <Grid item xs={12} sm={6} md={4} key={label}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  {icon}
                </Box>
                <Box>
                  {loading ? <CircularProgress size={20} /> : (
                    <Typography variant="h5" fontWeight={700}>{value}</Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>Recent Activity</Typography>
          <Divider sx={{ mb: 1 }} />
          <List disablePadding>
            {ACTIVITY.map(({ action, detail, time, status }, idx) => (
              <ListItem key={idx} disablePadding
                sx={{ py: 1.2, borderBottom: idx < ACTIVITY.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                <ListItemText
                  primary={action} secondary={detail}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: 12 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                  <Chip label={status} size="small" color={STATUS_COLORS[status]} variant="outlined" />
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 70, textAlign: 'right' }}>{time}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
