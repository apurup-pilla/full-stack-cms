import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import ImageIcon from '@mui/icons-material/Image';
import { NavLink, useLocation } from 'react-router-dom';

export const SIDEBAR_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard',  icon: <DashboardIcon />, path: '/' },
  { label: 'Users',      icon: <PeopleIcon />,    path: '/users' },
  { label: 'Pages',      icon: <ArticleIcon />,   path: '/content' },
  { label: 'Categories', icon: <CategoryIcon />,  path: '/categories' },
  { label: 'Media',      icon: <ImageIcon />,     path: '/media' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH, flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH, boxSizing: 'border-box',
          bgcolor: '#1e293b', color: '#e2e8f0', borderRight: 'none',
        },
      }}
    >
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="h6" fontWeight={700} color="#f8fafc" letterSpacing={0.5}>CMS Admin</Typography>
        <Typography variant="caption" color="#94a3b8">Content Management</Typography>
      </Box>

      <Divider sx={{ borderColor: '#334155' }} />

      <List sx={{ px: 1, pt: 1 }}>
        {NAV_ITEMS.map(({ label, icon, path }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink} to={path}
                sx={{
                  borderRadius: 1.5,
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  bgcolor: isActive ? '#334155' : 'transparent',
                  '&:hover': { bgcolor: '#27374d', color: '#f8fafc' },
                  '& .MuiListItemIcon-root': { color: isActive ? '#3b82f6' : '#64748b', minWidth: 36 },
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
