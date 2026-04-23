import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, InputAdornment, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

const SITE_USERNAME = 'nokidbehind';
const SITE_PASSWORD = 'NKB@2025';
const STORAGE_KEY = 'site_unlocked';

function isUnlocked(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === '1';
}

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === SITE_USERNAME && password === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setUnlocked(true);
    } else {
      setError('Incorrect username or password.');
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #023d2e 0%, #0d5c40 40%, #1b6b51 100%)',
        px: 3,
      }}
    >
      {/* Dot grid texture */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(166,242,209,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(166,242,209,0.18)',
          borderRadius: '20px',
          p: { xs: 4, sm: 6 },
          width: '100%',
          maxWidth: 420,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Lock icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              bgcolor: 'rgba(166,242,209,0.12)',
              border: '1px solid rgba(166,242,209,0.2)',
              borderRadius: '14px',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockOutlinedIcon sx={{ color: '#a6f2d1', fontSize: '1.5rem' }} />
          </Box>
        </Box>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.625rem',
            letterSpacing: '-0.04em',
            color: '#e0ffee',
            textAlign: 'center',
            mb: 0.75,
          }}
        >
          No Kid Behind
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: 'rgba(224,255,238,0.55)',
            textAlign: 'center',
            mb: 4,
            lineHeight: 1.5,
          }}
        >
          This platform is currently in private access. Enter your credentials to continue.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: '10px', bgcolor: 'rgba(159,64,61,0.15)', color: '#fca5a5', border: '1px solid rgba(159,64,61,0.3)', '& .MuiAlert-icon': { color: '#fca5a5' } }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            fullWidth
            autoComplete="username"
            InputLabelProps={{ sx: { color: 'rgba(224,255,238,0.5)' } }}
            InputProps={{
              sx: {
                bgcolor: 'rgba(255,255,255,0.06)',
                color: '#e0ffee',
                borderRadius: '10px',
                '& fieldset': { borderColor: 'rgba(166,242,209,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(166,242,209,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#a6f2d1' },
              },
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            fullWidth
            autoComplete="current-password"
            InputLabelProps={{ sx: { color: 'rgba(224,255,238,0.5)' } }}
            InputProps={{
              sx: {
                bgcolor: 'rgba(255,255,255,0.06)',
                color: '#e0ffee',
                borderRadius: '10px',
                '& fieldset': { borderColor: 'rgba(166,242,209,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(166,242,209,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#a6f2d1' },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" sx={{ color: 'rgba(166,242,209,0.5)' }}>
                    {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 0.5,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '10px',
              bgcolor: '#a6f2d1',
              color: '#023d2e',
              boxShadow: '0px 8px 24px rgba(166,242,209,0.2)',
              '&:hover': { bgcolor: '#bff7db' },
            }}
          >
            Enter Platform
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
