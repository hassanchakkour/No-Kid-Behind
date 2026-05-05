import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar,
  Menu, MenuItem, Divider, ListItemIcon, Tooltip,
  Drawer, IconButton, List, ListItemButton, ListItemText,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';

interface NavLink {
  label: string;
  path: string;
  description: string;
}

const NAV_DESCRIPTIONS: Record<string, string> = {
  '/courses': 'Browse our full catalog of free educational courses for every grade and subject.',
  '/health': 'Mental health and wellness resources to support student wellbeing.',
  '/special-needs': 'Specialized content and support for students with learning differences.',
  '/kid-to-kid': 'Courses created by students, for students — peer-to-peer learning.',
  '/dashboard': 'Your personal learning dashboard and progress tracker.',
  '/teacher': 'Create and manage your courses for students.',
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerClose = () => setMobileOpen(false);

  const handleLogout = () => {
    handleMenuClose();
    handleDrawerClose();
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/auth';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'professional' || user.role === 'kid_tutor') return '/teacher';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    if (user.role === 'admin') return 'Admin Panel';
    if (user.role === 'professional' || user.role === 'kid_tutor') return 'My Courses';
    return 'Dashboard';
  };

  const canTeach =
    user?.role === 'professional' ||
    user?.role === 'admin' ||
    user?.role === 'kid_tutor' ||
    (user?.role === 'student' && user?.likesToTeach);

  const navLinks: NavLink[] = [
    { label: 'Explore', path: '/courses', description: NAV_DESCRIPTIONS['/courses'] },
    { label: 'Wellbeing', path: '/health', description: NAV_DESCRIPTIONS['/health'] },
    { label: 'Learning Difficulties', path: '/special-needs', description: NAV_DESCRIPTIONS['/special-needs'] },
    { label: 'Kid to Kid', path: '/kid-to-kid', description: NAV_DESCRIPTIONS['/kid-to-kid'] },
    ...(canTeach
      ? [{ label: 'Teaching', path: '/teacher', description: NAV_DESCRIPTIONS['/teacher'] }]
      : [{ label: 'My Learning', path: '/dashboard', description: NAV_DESCRIPTIONS['/dashboard'] }]),
  ];

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
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
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2.5, md: 6 }, minHeight: '60px !important' }}>
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

            {/* Desktop nav links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Box key={link.path} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
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
                    <Tooltip
                      title={link.description}
                      placement="bottom"
                      arrow
                      enterDelay={300}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: 'text.primary',
                            color: 'background.paper',
                            fontSize: '0.75rem',
                            maxWidth: 220,
                            borderRadius: '8px',
                            px: 1.5,
                            py: 1,
                          },
                        },
                        arrow: { sx: { color: 'text.primary' } },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'default',
                          color: 'text.disabled',
                          '&:hover': { color: 'text.secondary' },
                          transition: 'color 0.15s',
                        }}
                      >
                        <HelpOutlineRoundedIcon sx={{ fontSize: '0.875rem' }} />
                      </Box>
                    </Tooltip>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Right side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Desktop auth */}
            {isAuthenticated ? (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
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
                          {user?.role === 'kid_tutor' ? 'Kid Tutor' : user?.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(169,180,185,0.15)' }} />
                  <MenuItem onClick={() => { navigate(getDashboardPath()); handleMenuClose(); }} sx={{ px: 2, py: 1.25, gap: 1.5, '&:hover': { bgcolor: 'rgba(27,107,81,0.05)' } }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}><DashboardRoundedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} /></ListItemIcon>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>{getDashboardLabel()}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/courses'); handleMenuClose(); }} sx={{ px: 2, py: 1.25, gap: 1.5, '&:hover': { bgcolor: 'rgba(27,107,81,0.05)' } }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}><PersonRoundedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} /></ListItemIcon>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>Browse Courses</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }} sx={{ px: 2, py: 1.25, gap: 1.5, '&:hover': { bgcolor: 'rgba(27,107,81,0.05)' } }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}><SettingsRoundedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} /></ListItemIcon>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>Settings</Typography>
                  </MenuItem>
                  <Divider sx={{ borderColor: 'rgba(169,180,185,0.15)' }} />
                  <MenuItem onClick={handleLogout} sx={{ px: 2, py: 1.25, gap: 1.5, mb: 0.5, '&:hover': { bgcolor: 'rgba(159,64,61,0.05)' } }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}><LogoutRoundedIcon sx={{ fontSize: '1rem', color: '#9f403d' }} /></ListItemIcon>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#9f403d' }}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                <Button onClick={() => navigate('/auth?tab=login')} sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.875rem' }}>
                  Sign In
                </Button>
                <Button variant="contained" onClick={() => navigate('/auth?tab=register')} sx={{ px: 3, py: 0.875, fontSize: '0.875rem', borderRadius: '8px' }}>
                  Register
                </Button>
              </Box>
            )}

            {/* Mobile hamburger */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary', p: 1 }}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: '85vw',
            maxWidth: 320,
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Drawer header */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 28, height: 28, bgcolor: 'primary.main', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AutoStoriesRoundedIcon sx={{ fontSize: '0.875rem', color: '#a6f2d1' }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.03em', color: 'text.primary' }}>
              No Kid Behind
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerClose} sx={{ color: 'text.secondary', p: 0.75 }}>
            <CloseRoundedIcon sx={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Box>

        {/* User info (if authenticated) */}
        {isAuthenticated && (
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(27,107,81,0.04)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', color: '#a6f2d1', fontSize: '0.9375rem', fontWeight: 800 }}>
                {initials}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary', lineHeight: 1.2 }}>
                  {user?.name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', textTransform: 'capitalize' }}>
                  {user?.role === 'kid_tutor' ? 'Kid Tutor' : user?.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Nav links */}
        <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5 }}>
          <Typography sx={{ px: 2.5, pb: 1, fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'text.disabled' }}>
            Navigation
          </Typography>
          <List disablePadding>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <ListItemButton
                  key={link.path}
                  onClick={() => { navigate(link.path); handleDrawerClose(); }}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    mx: 1,
                    borderRadius: '10px',
                    mb: 0.5,
                    bgcolor: isActive ? 'rgba(27,107,81,0.08)' : 'transparent',
                    '&:hover': { bgcolor: isActive ? 'rgba(27,107,81,0.12)' : 'rgba(27,107,81,0.04)' },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    secondary={link.description}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.9375rem',
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontFamily: "'Public Sans', sans-serif",
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                      mt: 0.25,
                      fontFamily: "'Public Sans', sans-serif",
                      sx: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
                    }}
                  />
                  {isActive && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', ml: 1, flexShrink: 0 }} />}
                </ListItemButton>
              );
            })}
          </List>

          {/* Authenticated quick actions */}
          {isAuthenticated && (
            <>
              <Divider sx={{ my: 1.5, borderColor: 'divider' }} />
              <Typography sx={{ px: 2.5, pb: 1, fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'text.disabled' }}>
                Account
              </Typography>
              <List disablePadding>
                {[
                  { label: getDashboardLabel(), path: getDashboardPath(), Icon: DashboardRoundedIcon },
                  { label: 'Settings', path: '/settings', Icon: SettingsRoundedIcon },
                ].map(({ label, path, Icon }) => (
                  <ListItemButton
                    key={path}
                    onClick={() => { navigate(path); handleDrawerClose(); }}
                    sx={{ px: 2.5, py: 1.25, mx: 1, borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: 'rgba(27,107,81,0.04)' } }}
                  >
                    <Icon sx={{ fontSize: '1rem', color: 'text.secondary', mr: 1.5 }} />
                    <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.9375rem', fontWeight: 500, color: 'text.primary', fontFamily: "'Public Sans', sans-serif" }} />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}
        </Box>

        {/* Bottom auth actions */}
        <Box sx={{ px: 2, pb: 3, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          {isAuthenticated ? (
            <Button
              fullWidth
              onClick={handleLogout}
              startIcon={<LogoutRoundedIcon />}
              sx={{
                py: 1.25,
                borderRadius: '10px',
                color: '#9f403d',
                bgcolor: 'rgba(159,64,61,0.06)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(159,64,61,0.1)' },
              }}
            >
              Logout
            </Button>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => { navigate('/auth?tab=register'); handleDrawerClose(); }}
                sx={{ py: 1.25, borderRadius: '10px', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'none' }}
              >
                Create Free Account
              </Button>
              <Button
                fullWidth
                onClick={() => { navigate('/auth?tab=login'); handleDrawerClose(); }}
                sx={{ py: 1.25, borderRadius: '10px', fontWeight: 600, fontSize: '0.9375rem', textTransform: 'none', color: 'text.secondary' }}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
