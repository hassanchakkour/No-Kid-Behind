import { useState, useRef } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar,
  Menu, MenuItem, Divider, ListItemIcon, Tooltip, Popper,
  Paper, ClickAwayListener,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

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
  const [mobileTooltipPath, setMobileTooltipPath] = useState<string | null>(null);
  const tooltipAnchorRefs = useRef<Record<string, HTMLElement | null>>({});

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

  const handleMobileTooltip = (path: string) => {
    setMobileTooltipPath((prev) => (prev === path ? null : path));
  };

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

          {/* Desktop nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Box
                  key={link.path}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
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
                  {/* Desktop: hover tooltip */}
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

        {/* Auth actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Mobile nav — show ? icons that toggle tooltip poppers */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1.5, alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Box key={link.path} sx={{ position: 'relative' }}>
                <Box
                  ref={(el) => { tooltipAnchorRefs.current[link.path] = el as HTMLElement | null; }}
                  onClick={() => handleMobileTooltip(link.path)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    bgcolor: mobileTooltipPath === link.path ? 'rgba(27,107,81,0.1)' : 'transparent',
                    color: mobileTooltipPath === link.path ? 'primary.main' : 'text.secondary',
                    border: '1px solid',
                    borderColor: mobileTooltipPath === link.path ? 'primary.main' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <HelpOutlineRoundedIcon sx={{ fontSize: '0.875rem' }} />
                </Box>
                <Popper
                  open={mobileTooltipPath === link.path}
                  anchorEl={tooltipAnchorRefs.current[link.path]}
                  placement="bottom-start"
                  style={{ zIndex: 200 }}
                >
                  <ClickAwayListener onClickAway={() => setMobileTooltipPath(null)}>
                    <Paper
                      elevation={4}
                      sx={{
                        mt: 1,
                        p: 1.5,
                        maxWidth: 220,
                        borderRadius: '10px',
                        bgcolor: 'text.primary',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          color: 'background.paper',
                          mb: 0.5,
                        }}
                      >
                        {link.label}
                      </Typography>
                      <Typography
                        sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}
                      >
                        {link.description}
                      </Typography>
                      <Box
                        onClick={() => { navigate(link.path); setMobileTooltipPath(null); }}
                        sx={{
                          mt: 1,
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          color: '#a6f2d1',
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Go →
                      </Box>
                    </Paper>
                  </ClickAwayListener>
                </Popper>
              </Box>
            ))}
          </Box>

          {isAuthenticated ? (
            <>
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

                <MenuItem
                  onClick={() => { navigate(getDashboardPath()); handleMenuClose(); }}
                  sx={{ px: 2, py: 1.25, gap: 1.5, '&:hover': { bgcolor: 'rgba(27,107,81,0.05)' } }}
                >
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <DashboardRoundedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                  </ListItemIcon>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>{getDashboardLabel()}</Typography>
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
