import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Chip, Avatar,
  Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ChildCareRoundedIcon from '@mui/icons-material/ChildCareRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useSchoolUsers, useSchoolPendingKidTutors, useSchoolApproveKidTutor } from '../hooks/useAdminStats';

const SIDEBAR_LINKS = [
  { label: 'Pending Approvals', path: '/school-admin' },
  { label: 'School Users', path: '/school-admin/users' },
];

function getTabFromPath(pathname: string): number {
  if (pathname.startsWith('/school-admin/users')) return 1;
  return 0;
}

export default function SchoolAdminDashboard() {
  const { user } = useAuth();
  const school = user?.school ?? 'Your School';
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState(() => getTabFromPath(location.pathname));
  const [approveTarget, setApproveTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    setTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (_: unknown, newValue: number) => {
    navigate(newValue === 1 ? '/school-admin/users' : '/school-admin');
  };

  const { data: pendingTutors, isLoading: pendingLoading } = useSchoolPendingKidTutors();
  const { data: schoolUsers, isLoading: usersLoading } = useSchoolUsers();
  const approveKidTutor = useSchoolApproveKidTutor();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar title="School Panel" subtitle={school} links={SIDEBAR_LINKS} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Navbar compact />

        {/* Mobile section nav — visible when sidebar is hidden (below md) OR nav is collapsed (below xl with compact) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, overflowX: 'auto', px: 3, py: 1.5, gap: 1, borderBottom: '1px solid rgba(169,180,185,0.1)', bgcolor: 'background.paper', '&::-webkit-scrollbar': { display: 'none' } }}>
          {[
            { label: 'Pending Approvals', path: '/school-admin' },
            { label: 'School Users', path: '/school-admin/users' },
          ].map(({ label, path }) => (
            <Button
              key={path}
              onClick={() => navigate(path)}
              size="small"
              sx={{ flexShrink: 0, bgcolor: location.pathname === path || (path === '/school-admin' && !location.pathname.startsWith('/school-admin/')) ? 'rgba(27,107,81,0.1)' : '#f0f4f7', color: location.pathname === path || (path === '/school-admin' && !location.pathname.startsWith('/school-admin/')) ? 'primary.main' : 'text.secondary', fontWeight: 600, fontSize: '0.75rem', borderRadius: '20px', px: 2, py: 0.75, '&:hover': { bgcolor: 'rgba(27,107,81,0.08)', color: 'primary.main' } }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1b6b51 0%, #035d45 100%)',
            px: { xs: 3, md: 6 },
            pt: { xs: 4, md: 5 },
            pb: { xs: 4, md: 5 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', top: -60, right: 80, width: 280, height: 280, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ bgcolor: 'rgba(166,242,209,0.15)', borderRadius: '8px', p: 0.875, display: 'flex' }}>
              <SchoolRoundedIcon sx={{ color: '#a6f2d1', fontSize: '1.125rem' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.7)' }}>
              School Panel
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.625rem' }, letterSpacing: '-0.035em', color: '#e0ffee', lineHeight: 1.05, mb: 0.75 }}>
            {school}
          </Typography>
          <Typography sx={{ fontSize: { xs: '0.875rem', md: '0.9375rem' }, color: 'rgba(224,255,238,0.6)' }}>
            Approve kid tutors and manage users at your school.
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, mt: 3 }}>
            {[
              { value: pendingTutors?.length ?? '—', label: 'Pending Approvals', color: pendingTutors?.length ? '#fbbf24' : '#a6f2d1' },
              { value: schoolUsers?.length ?? '—', label: 'School Users', color: '#a6f2d1' },
            ].map(({ value, label, color }) => (
              <Box key={label} sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '12px', px: { xs: 2.5, md: 3 }, py: 2, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, letterSpacing: '-0.04em', color, lineHeight: 1 }}>{value}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.6)', mt: 0.5 }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, px: { xs: 2.5, md: 5 }, py: { xs: 3, md: 4 } }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{
              mb: 4,
              borderBottom: '1px solid rgba(169,180,185,0.15)',
              '& .MuiTabs-indicator': { backgroundColor: 'primary.main', height: 2, borderRadius: '1px' },
              '& .MuiTab-root': { fontFamily: "'Public Sans', sans-serif", fontWeight: 600, textTransform: 'none', color: 'text.secondary', fontSize: '0.9375rem', mr: 4, minWidth: 'auto', px: 0 },
              '& .Mui-selected': { color: 'primary.main !important' },
            }}
          >
            <Tab label={`Pending Approvals${pendingTutors?.length ? ` (${pendingTutors.length})` : ''}`} />
            <Tab label="School Users" />
          </Tabs>

          {/* Pending Approvals */}
          {tab === 0 && (
            pendingLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{ bgcolor: 'rgba(196,122,30,0.1)', borderRadius: '8px', p: 0.875, display: 'flex' }}>
                    <ChildCareRoundedIcon sx={{ color: '#c47a1e', fontSize: '1rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>
                    Pending Kid Tutor Approvals
                  </Typography>
                  {pendingTutors && (
                    <Chip label={pendingTutors.length} size="small" sx={{ bgcolor: 'rgba(196,122,30,0.12)', color: '#c47a1e', fontWeight: 700 }} />
                  )}
                </Box>

                <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: '0px 2px 12px 0px rgba(42,52,57,0.06)', border: '1px solid rgba(169,180,185,0.12)', overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f7f9fb' }}>
                        <TableCell>Student</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Registered</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingTutors && pendingTutors.length > 0 ? pendingTutors.map((u) => (
                        <TableRow key={u.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 30, height: 30, bgcolor: 'rgba(196,122,30,0.1)', color: '#c47a1e', fontSize: '0.75rem', fontWeight: 700 }}>
                                {u.name?.[0]?.toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary', lineHeight: 1.3 }}>{u.name}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>@{u.username}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{u.grade || '—'}</TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell align="right">
                            <Button
                              onClick={() => setApproveTarget({ id: u.id, name: u.name })}
                              size="small"
                              sx={{ bgcolor: 'rgba(27,107,81,0.08)', color: 'primary.main', fontWeight: 700, fontSize: '0.8125rem', borderRadius: '6px', px: 2, '&:hover': { bgcolor: 'rgba(27,107,81,0.15)' } }}
                            >
                              Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                            No pending approvals at the moment.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )
          )}

          {/* School Users */}
          {tab === 1 && (
            usersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 0.875, display: 'flex' }}>
                    <PeopleRoundedIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>
                    Users at {school}
                  </Typography>
                  {schoolUsers && (
                    <Chip label={schoolUsers.length} size="small" sx={{ bgcolor: 'rgba(27,107,81,0.1)', color: 'primary.main', fontWeight: 700 }} />
                  )}
                </Box>

                <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: '0px 2px 12px 0px rgba(42,52,57,0.06)', border: '1px solid rgba(169,180,185,0.12)', overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f7f9fb' }}>
                        <TableCell>User</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell>Kid Tutor Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schoolUsers && schoolUsers.length > 0 ? schoolUsers.map((u) => (
                        <TableRow key={u.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 30, height: 30, bgcolor: 'rgba(27,107,81,0.1)', color: 'primary.main', fontSize: '0.75rem', fontWeight: 700 }}>
                                {u.name?.[0]?.toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary', lineHeight: 1.3 }}>{u.name}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>@{u.username}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={u.role === 'kid_tutor' ? 'Kid Tutor' : u.role}
                              size="small"
                              sx={{
                                bgcolor: u.role === 'kid_tutor' ? 'rgba(196,122,30,0.12)' : '#f0f4f7',
                                color: u.role === 'kid_tutor' ? '#c47a1e' : 'text.secondary',
                                fontWeight: 700,
                                fontSize: '0.625rem',
                                textTransform: 'capitalize',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{u.grade || '—'}</TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {u.role === 'kid_tutor' ? (
                              <Chip
                                label={u.kidTutorApproved ? 'Approved' : 'Pending'}
                                size="small"
                                sx={{
                                  bgcolor: u.kidTutorApproved ? 'rgba(27,107,81,0.1)' : 'rgba(196,122,30,0.1)',
                                  color: u.kidTutorApproved ? 'primary.main' : '#c47a1e',
                                  fontWeight: 700,
                                  fontSize: '0.625rem',
                                }}
                              />
                            ) : (
                              <Typography sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>—</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                            No users registered from {school} yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )
          )}
        </Box>
      </Box>

      {/* Approve confirm dialog */}
      <Dialog open={!!approveTarget} onClose={() => setApproveTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.125rem' }}>Approve Kid Tutor</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Approve <strong>{approveTarget?.name}</strong> as a kid tutor? They will be able to upload videos.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setApproveTarget(null)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button
            disabled={approveKidTutor.isPending}
            onClick={() => approveTarget && approveKidTutor.mutate(approveTarget.id, { onSuccess: () => setApproveTarget(null) })}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: '#155a42' }, borderRadius: '6px', px: 3, fontWeight: 700 }}
          >
            {approveKidTutor.isPending ? 'Approving…' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
