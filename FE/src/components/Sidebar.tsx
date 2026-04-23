import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';

const ICON_MAP: Record<string, React.ElementType> = {
  Dashboard: DashboardRoundedIcon,
  Courses: MenuBookRoundedIcon,
  'My Courses': MenuBookRoundedIcon,
  Students: GroupRoundedIcon,
  Analytics: BarChartRoundedIcon,
  Settings: SettingsRoundedIcon,
  Users: PeopleRoundedIcon,
  Admin: AdminPanelSettingsRoundedIcon,
};

interface SidebarLink {
  label: string;
  path: string;
}

interface SidebarProps {
  title: string;
  subtitle?: string;
  links: SidebarLink[];
  actionLabel?: string;
  onAction?: () => void;
}

export default function Sidebar({ title, subtitle, links, actionLabel, onAction }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin' || path === '/teacher') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        width: 230,
        minWidth: 230,
        background: 'linear-gradient(180deg, #f0f4f7 0%, #eaf0f4 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(169,180,185,0.12)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Brand header */}
      <Box
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          borderBottom: '1px solid rgba(169,180,185,0.12)',
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'primary.main',
            borderRadius: '8px',
            px: 1.5,
            py: 0.75,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              bgcolor: '#a6f2d1',
              borderRadius: '50%',
            }}
          />
          <Typography sx={{ fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a6f2d1' }}>
            NKB Platform
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: 'text.primary', lineHeight: 1.3 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontWeight: 500, fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Nav links */}
      <Box sx={{ px: 1.5, pt: 1, flex: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary', px: 1.5, mb: 1 }}>
          Navigation
        </Typography>
        <List disablePadding>
          {links.map((link) => {
            const active = isActive(link.path);
            const Icon = ICON_MAP[link.label];
            return (
              <ListItemButton
                key={link.path}
                onClick={() => navigate(link.path)}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  px: 1.5,
                  py: 1.25,
                  bgcolor: active ? 'background.paper' : 'transparent',
                  boxShadow: active ? '0px 1px 4px 0px rgba(0,0,0,0.06)' : 'none',
                  border: active ? '1px solid rgba(169,180,185,0.1)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: active ? 'background.paper' : 'rgba(27,107,81,0.04)',
                    border: '1px solid rgba(27,107,81,0.08)',
                  },
                }}
              >
                {Icon && (
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Icon
                      sx={{
                        fontSize: '1.1rem',
                        color: active ? 'primary.main' : 'text.secondary',
                        transition: 'color 0.15s',
                      }}
                    />
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.875rem',
                    color: active ? 'primary.main' : 'text.primary',
                    fontFamily: "'Public Sans', sans-serif",
                  }}
                />
                {active && (
                  <Box sx={{ width: 4, height: 4, bgcolor: 'primary.main', borderRadius: '50%', ml: 1 }} />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom section */}
      <Box sx={{ px: 1.5, pb: 2 }}>
        <Divider sx={{ borderColor: 'rgba(169,180,185,0.15)', mb: 1.5 }} />
        {actionLabel && onAction && (
          <Button
            variant="contained"
            fullWidth
            onClick={onAction}
            sx={{
              mb: 1,
              borderRadius: '8px',
              py: 1.25,
              fontWeight: 700,
              fontSize: '0.875rem',
              boxShadow: '0px 4px 12px 0px rgba(27,107,81,0.2)',
            }}
          >
            {actionLabel}
          </Button>
        )}
        <ListItemButton
          onClick={() => { logout(); navigate('/'); }}
          sx={{
            borderRadius: '8px',
            px: 1.5,
            py: 1,
            '&:hover': { bgcolor: 'rgba(159,64,61,0.06)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <LogoutRoundedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.875rem',
              color: 'text.secondary',
              fontFamily: "'Public Sans', sans-serif",
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}
