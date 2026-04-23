import { useState } from 'react';
import {
  Box, Typography, TextField, Button, Alert, Divider, Avatar, InputAdornment, IconButton,
} from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';

export default function SettingsPage() {
  const { user, updateAuth } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.['email' as keyof typeof user] as string ?? '');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const updateMutation = useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (data) => {
      updateAuth(data.token, data.user);
    },
  });

  const handleProfileSave = async () => {
    setProfileError('');
    setProfileSuccess(false);
    if (!name.trim()) { setProfileError('Name cannot be empty.'); return; }
    try {
      await updateMutation.mutateAsync({ name: name.trim(), email: email.trim() || undefined });
      setProfileSuccess(true);
    } catch (err: any) {
      setProfileError(err?.response?.data?.error || 'Failed to update profile.');
    }
  };

  const handlePasswordSave = async () => {
    setPasswordError('');
    setPasswordSuccess(false);
    if (!currentPassword) { setPasswordError('Enter your current password.'); return; }
    if (newPassword.length < 6) { setPasswordError('New password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
    try {
      await updateMutation.mutateAsync({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err?.response?.data?.error || 'Failed to update password.');
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1b6b51 0%, #035d45 100%)',
          px: { xs: 4, md: 8 },
          pt: 5,
          pb: 5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -40, right: 80, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ maxWidth: 1280, mx: 'auto', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <SettingsRoundedIcon sx={{ color: 'rgba(166,242,209,0.7)', fontSize: '0.875rem' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.7)' }}>
              Account
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.75rem' }, letterSpacing: '-0.035em', color: '#e0ffee', lineHeight: 1.05 }}>
            Settings
          </Typography>
          <Typography sx={{ fontSize: '1rem', color: 'rgba(224,255,238,0.65)', mt: 1 }}>
            Update your profile information and password.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 700, mx: 'auto', px: { xs: 3, md: 4 }, py: 6 }}>

        {/* Avatar + role */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 5 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              color: '#a6f2d1',
              fontSize: '1.5rem',
              fontWeight: 800,
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: 'text.primary' }}>{user?.name}</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textTransform: 'capitalize' }}>
              @{user?.username} · {user?.role}
            </Typography>
          </Box>
        </Box>

        {/* ── Profile section ── */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '14px',
            border: '1px solid rgba(169,180,185,0.12)',
            boxShadow: '0px 2px 12px rgba(42,52,57,0.06)',
            p: { xs: 3, md: 4 },
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 0.875, display: 'flex' }}>
              <PersonRoundedIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }}>Profile Information</Typography>
          </Box>

          {profileSuccess && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>Profile updated successfully.</Alert>
          )}
          {profileError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{profileError}</Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => { setName(e.target.value); setProfileSuccess(false); }}
              fullWidth
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f7f9fb', borderRadius: '8px' } }}
            />
            <TextField
              label="Email (optional)"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setProfileSuccess(false); }}
              fullWidth
              size="small"
              placeholder="your@email.com"
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f7f9fb', borderRadius: '8px' } }}
            />
            <TextField
              label="Username"
              value={user?.username ?? ''}
              disabled
              fullWidth
              size="small"
              helperText="Username cannot be changed."
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f7f9fb', borderRadius: '8px' } }}
            />
          </Box>

          <Button
            onClick={handleProfileSave}
            disabled={updateMutation.isPending}
            variant="contained"
            sx={{ mt: 3, px: 4, py: 1.25, borderRadius: '8px', fontWeight: 700 }}
          >
            {updateMutation.isPending ? 'Saving…' : 'Save Profile'}
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* ── Password section ── */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '14px',
            border: '1px solid rgba(169,180,185,0.12)',
            boxShadow: '0px 2px 12px rgba(42,52,57,0.06)',
            p: { xs: 3, md: 4 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 0.875, display: 'flex' }}>
              <LockRoundedIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }}>Change Password</Typography>
          </Box>

          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>Password updated successfully.</Alert>
          )}
          {passwordError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{passwordError}</Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Current Password"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setPasswordSuccess(false); }}
              fullWidth
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f7f9fb', borderRadius: '8px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrent((s) => !s)} edge="end" size="small">
                      {showCurrent ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setPasswordSuccess(false); }}
              fullWidth
              size="small"
              helperText="Minimum 6 characters."
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f7f9fb', borderRadius: '8px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNew((s) => !s)} edge="end" size="small">
                      {showNew ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordSuccess(false); }}
              fullWidth
              size="small"
              error={!!confirmPassword && confirmPassword !== newPassword}
              helperText={confirmPassword && confirmPassword !== newPassword ? 'Passwords do not match' : ''}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f7f9fb', borderRadius: '8px' } }}
            />
          </Box>

          <Button
            onClick={handlePasswordSave}
            disabled={updateMutation.isPending}
            variant="contained"
            sx={{ mt: 3, px: 4, py: 1.25, borderRadius: '8px', fontWeight: 700 }}
          >
            {updateMutation.isPending ? 'Saving…' : 'Update Password'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
