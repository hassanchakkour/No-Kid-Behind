import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar,
  Menu, MenuItem, Divider, ListItemIcon,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

interface NavLink {
  label: string;
  path: string;
}

const baseLinks: NavLink[] = [
  { label: 'Explore', path: '/courses' },
  { label: 'My Learning', path: '/dashboard' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/auth';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'teacher') return '/teacher';
    return '/dashboard';
  };

  const navLinks = [
    { label: 'Explore', path: '/courses' },
    { label: 'Health', path: '/health' },
    { label: 'Special Needs', path: '/special-needs' },
    { label: 'Kid to Kid', path: '/kid-to-kid' },
    ...(user?.role === 'teacher' || user?.role === 'admin' || (user?.role === 'student' && user?.likesToTeach)
      ? [{ label: 'Teaching', path: '/teacher' }]
      : [{ label: 'My Learning', path: '/dashboard' }]),
  ];

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: 100,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 3, md: 6 }, minHeight: '60px !important' }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Typography
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 800,
              fontSize: '1.125rem',
              letterSpacing: '-0.04em',
              color: 'text.primary',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            No Kid Behind
          </Typography>

          {/* Nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Box
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  sx={{
                    cursor: 'pointer',
                    pb: isActive ? '6px' : 0,
                    borderBottom: isActive ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.875rem',
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {link.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Auth actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              {/* Avatar → opens dropdown */}
              <Avatar
                onClick={handleAvatarClick}
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: 'primary.main',
                  color: '#a6f2d1',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '-0.02em',
                  border: '2px solid transparent',
                  transition: 'border-color 0.15s',
                  '&:hover': { borderColor: 'rgba(27,107,81,0.3)' },
                }}
              >
                {initials}
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: '10px',
                    boxShadow: '0px 8px 32px 0px rgba(42,52,57,0.12)',
                    border: '1px solid rgba(169,180,185,0.12)',
                    overflow: 'visible',
                  },
                }}
              >
                {/* User info header */}
                <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', color: '#a6f2d1', fontSize: '0.8125rem', fontWeight: 800 }}>
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'text.primary', lineHeight: 1.3 }}>
                        {user?.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', textTransform: 'capitalize' }}>
                        {user?.role}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(169,180,185,0.15)' }} />

                <MenuItem
                  onClick={() => { navigate(getDashboardPath()); handleMenuClose(); }}
                  sx={{ px: 2, py: 1.25, gap: 1.5, '&:hover': { bgcolor: 'rgba(27,107,81,0.05)' } }}
                >
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <DashboardRoundedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                  </ListItemIcon>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>Dashboard</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => { navigate('/courses'); handleMenuClose(); }}
                  sx={{ px: 2, py: 1.25, gap: 1.5, '&:hover': { bgcolor: 'rgba(27,107,81,0.05)' } }}
                >
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <PersonRoundedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                  </ListItemIcon>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>Browse Courses</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => { navigate('/settings'); handleMenuClose(); }}
                  sx={{ px: 2, py: 1.25, gap: 1.5, '&:hover': { bgcolor: 'rgba(27,107,81,0.05)' } }}
                >
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <SettingsRoundedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                  </ListItemIcon>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>Settings</Typography>
                </MenuItem>

                <Divider sx={{ borderColor: 'rgba(169,180,185,0.15)' }} />

                <MenuItem
                  onClick={handleLogout}
                  sx={{ px: 2, py: 1.25, gap: 1.5, mb: 0.5, '&:hover': { bgcolor: 'rgba(159,64,61,0.05)' } }}
                >
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <LogoutRoundedIcon sx={{ fontSize: '1rem', color: '#9f403d' }} />
                  </ListItemIcon>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#9f403d' }}>Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate('/auth?tab=login')}
                sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.875rem' }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/auth?tab=register')}
                sx={{ px: 3, py: 0.875, fontSize: '0.875rem', borderRadius: '8px' }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
