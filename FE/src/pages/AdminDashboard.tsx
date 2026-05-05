import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Tabs, Tab, Chip, Avatar, TextField, Alert, Tooltip,
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';
import ChildCareRoundedIcon from '@mui/icons-material/ChildCareRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import { useAdminStats, useUsers, useAdminCourses, useDeleteUser, useAdminDeleteCourse, useToggleLikesToTeach, usePendingKidTutors, useApproveKidTutor } from '../hooks/useAdminStats';
import { useCreateCourse, useDeleteCourse, useCourses } from '../hooks/useCourses';

const SIDEBAR_LINKS = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Courses', path: '/admin/courses' },
  { label: 'Wellbeing', path: '/admin/health' },
  { label: 'Learning Difficulties', path: '/admin/special-needs' },
  { label: 'Kid to Kid', path: '/admin/kid-to-kid' },
  { label: 'Pending Approvals', path: '/admin/pending' },
  { label: 'Analytics', path: '/admin/analytics' },
];

function getTabFromPath(pathname: string): number {
  if (pathname.startsWith('/admin/courses')) return 1;
  if (pathname.startsWith('/admin/health')) return 2;
  if (pathname.startsWith('/admin/special-needs')) return 3;
  if (pathname.startsWith('/admin/kid-to-kid')) return 4;
  if (pathname.startsWith('/admin/pending')) return 5;
  if (pathname.startsWith('/admin/analytics')) return 6;
  return 0;
}

// ── Overview page shown at /admin ──────────────────────────────────────────
function OverviewSection() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: courses, isLoading: coursesLoading } = useAdminCourses();

  const metricsData = stats
    ? [
        { value: stats.totalUsers, label: 'Total Users', icon: PeopleRoundedIcon },
        { value: stats.totalProfessionals, label: 'Professionals', icon: SchoolRoundedIcon },
        { value: stats.totalCourses, label: 'Courses', icon: BarChartRoundedIcon },
        { value: stats.totalVisitors, label: 'Visitors', icon: PeopleRoundedIcon },
        { value: stats.totalCourseClicks, label: 'Course Views', icon: BarChartRoundedIcon },
      ]
    : [];

  const recentUsers = users?.slice().reverse().slice(0, 6) ?? [];
  const topCourses = courses ? [...courses].sort((a, b) => b.clicks - a.clicks).slice(0, 5) : [];

  return (
    <Box>
      {/* ── Gradient hero header ────────────────────────────────── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1b6b51 0%, #035d45 100%)',
          px: { xs: 4, md: 6 },
          pt: 5,
          pb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -60, right: 80, width: 280, height: 280, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', bottom: -30, right: 260, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />

        <Typography sx={{ fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.7)', mb: 1 }}>
          Platform Management
        </Typography>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.625rem' }, letterSpacing: '-0.035em', color: '#e0ffee', lineHeight: 1.05, mb: 0.75 }}>
          Overview
        </Typography>
        <Typography sx={{ fontSize: '0.9375rem', color: 'rgba(224,255,238,0.6)', mb: 4 }}>
          Monitor activity and manage your educational ecosystem.
        </Typography>

        {/* Metric chips inside header */}
        {statsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress sx={{ color: 'rgba(255,255,255,0.6)' }} />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {metricsData.map(({ value, label, icon: Icon }) => (
              <Grid item xs={6} sm={4} md={12 / 5} key={label}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.09)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.14)',
                    p: { xs: 2, md: 2.5 },
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.13)' },
                  }}
                >
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.12)', borderRadius: '8px', p: 0.875, display: 'flex', width: 'fit-content', mb: 1.75 }}>
                    <Icon sx={{ color: '#a6f2d1', fontSize: '1.125rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.625rem', md: '2rem' }, letterSpacing: '-0.045em', color: '#e0ffee', lineHeight: 1 }}>
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.65)', mt: 0.5 }}>
                    {label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* ── Mobile section nav (xs only) ───────────────────────── */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, overflowX: 'auto', px: 3, py: 1.5, gap: 1, borderBottom: '1px solid rgba(169,180,185,0.1)', bgcolor: 'background.paper', '&::-webkit-scrollbar': { display: 'none' } }}>
        {[
          { label: 'Users', path: '/admin/users' },
          { label: 'Courses', path: '/admin/courses' },
          { label: 'Wellbeing', path: '/admin/health' },
          { label: 'Difficulties', path: '/admin/special-needs' },
          { label: 'Kid to Kid', path: '/admin/kid-to-kid' },
          { label: 'Pending', path: '/admin/pending' },
          { label: 'Analytics', path: '/admin/analytics' },
        ].map(({ label, path }) => (
          <Button
            key={path}
            onClick={() => navigate(path)}
            size="small"
            sx={{ flexShrink: 0, bgcolor: '#f0f4f7', color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', borderRadius: '20px', px: 2, py: 0.75, '&:hover': { bgcolor: 'rgba(27,107,81,0.08)', color: 'primary.main' } }}
          >
            {label}
          </Button>
        ))}
      </Box>

      {/* ── Content area ───────────────────────────────────────── */}
      <Box sx={{ px: { xs: 3, md: 6 }, py: 4 }}>
        <Grid container spacing={3}>

          {/* Recent Users */}
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: '14px', border: '1px solid rgba(169,180,185,0.12)', boxShadow: '0px 2px 12px 0px rgba(42,52,57,0.05)', overflow: 'hidden', height: '100%' }}>
              <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(169,180,185,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 0.875, display: 'flex' }}>
                    <PeopleRoundedIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>Recent Users</Typography>
                </Box>
                <Button
                  endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '0.875rem !important' }} />}
                  onClick={() => navigate('/admin/users')}
                  size="small"
                  sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.8125rem', px: 1 }}
                >
                  View All
                </Button>
              </Box>
              {usersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={24} /></Box>
              ) : (
                <Box>
                  {recentUsers.map((u, i) => (
                    <Box
                      key={u.id}
                      sx={{
                        px: 3,
                        py: 1.75,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderBottom: i < recentUsers.length - 1 ? '1px solid rgba(169,180,185,0.07)' : 'none',
                        transition: 'background 0.15s',
                        '&:hover': { bgcolor: 'rgba(27,107,81,0.03)' },
                      }}
                    >
                      <Avatar sx={{ width: 34, height: 34, bgcolor: 'rgba(27,107,81,0.1)', color: 'primary.main', fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary', lineHeight: 1.3 }} noWrap>{u.name}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }} noWrap>@{u.username}</Typography>
                      </Box>
                      <Chip
                        label={u.role}
                        size="small"
                        sx={{
                          bgcolor: u.role === 'admin' ? 'rgba(27,107,81,0.1)' : u.role === 'teacher' ? '#e8eff3' : '#f0f4f7',
                          color: u.role === 'admin' ? 'primary.main' : 'text.secondary',
                          fontWeight: 700,
                          fontSize: '0.5625rem',
                          textTransform: 'uppercase',
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                  ))}
                  {recentUsers.length === 0 && (
                    <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 6, fontSize: '0.875rem' }}>No users yet.</Typography>
                  )}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Top Courses */}
          <Grid item xs={12} md={7}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: '14px', border: '1px solid rgba(169,180,185,0.12)', boxShadow: '0px 2px 12px 0px rgba(42,52,57,0.05)', overflow: 'hidden', height: '100%' }}>
              <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(169,180,185,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 0.875, display: 'flex' }}>
                    <SchoolRoundedIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>Top Courses by Views</Typography>
                </Box>
                <Button
                  endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '0.875rem !important' }} />}
                  onClick={() => navigate('/admin/courses')}
                  size="small"
                  sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.8125rem', px: 1 }}
                >
                  View All
                </Button>
              </Box>
              {coursesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={24} /></Box>
              ) : (
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {topCourses.map((c, i) => {
                    const maxClicks = topCourses[0]?.clicks || 1;
                    const pct = Math.max(4, Math.round((c.clicks / maxClicks) * 100));
                    return (
                      <Box key={c.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                            <Box
                              sx={{
                                width: 24, height: 24, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                bgcolor: i === 0 ? 'rgba(27,107,81,0.12)' : '#f0f4f7',
                              }}
                            >
                              <Typography sx={{ fontWeight: 800, fontSize: '0.6875rem', color: i === 0 ? 'primary.main' : 'text.disabled' }}>
                                {i + 1}
                              </Typography>
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }} noWrap>
                                {c.title}
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }} noWrap>
                                {c.subject} · {c.teacher.name}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={`${c.clicks.toLocaleString()} views`}
                            size="small"
                            sx={{ bgcolor: i === 0 ? 'rgba(27,107,81,0.1)' : '#f0f4f7', color: i === 0 ? 'primary.main' : 'text.secondary', fontWeight: 700, fontSize: '0.6875rem', flexShrink: 0, ml: 2 }}
                          />
                        </Box>
                        <Box sx={{ height: 4, bgcolor: '#f0f4f7', borderRadius: '3px', overflow: 'hidden' }}>
                          <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: 'primary.main', borderRadius: '3px', opacity: i === 0 ? 1 : 0.35 + (0.65 / (i + 1)) }} />
                        </Box>
                      </Box>
                    );
                  })}
                  {topCourses.length === 0 && (
                    <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 4, fontSize: '0.875rem' }}>No courses yet.</Typography>
                  )}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Platform Health banner */}
          {stats && (
            <Grid item xs={12}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #1b6b51 0%, #035d45 100%)',
                  borderRadius: '14px',
                  p: { xs: 3, md: 4 },
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ position: 'absolute', top: -30, right: 40, width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.6)', mb: 3 }}>
                  Platform Health
                </Typography>
                <Grid container spacing={3}>
                  {[
                    {
                      label: 'Engagement Rate',
                      value: stats.totalVisitors > 0 ? `${Math.round((stats.totalCourseClicks / stats.totalVisitors) * 100)}%` : '—',
                    },
                    {
                      label: 'Avg. Views / Course',
                      value: stats.totalCourses > 0 ? Math.round(stats.totalCourseClicks / stats.totalCourses).toLocaleString() : '0',
                    },
                    {
                      label: 'Professional : Student',
                      value: stats.totalProfessionals > 0 ? `1:${Math.round((stats.totalUsers - stats.totalProfessionals) / stats.totalProfessionals)}` : '—',
                    },
                    {
                      label: 'Total Activity',
                      value: (stats.totalCourseClicks + stats.totalVisitors).toLocaleString(),
                    },
                  ].map(({ label, value }) => (
                    <Grid item xs={6} md={3} key={label}>
                      <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.875rem', md: '2.5rem' }, letterSpacing: '-0.05em', color: '#e0ffee', lineHeight: 1 }}>
                        {value}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.6)', mt: 0.75 }}>
                        {label}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

// ── Shared video table section (Health / Special Needs) ────────────────────
interface VideoSectionProps {
  label: string;
  icon: React.ElementType;
  color: string;
  filter: { isHealthContent?: boolean; isSpecialNeeds?: boolean };
  dialogTitle: string;
  dialogDesc: string;
}

function VideoSection({ label, icon: Icon, color, filter, dialogTitle, dialogDesc }: VideoSectionProps) {
  const { data: videos, isLoading } = useCourses(filter);
  const createVideo = useCreateCourse();
  const deleteVideoMutation = useDeleteCourse();
  const [form, setForm] = useState({ title: '', subject: '', youtubeUrl: '' });
  const [formError, setFormError] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleAdd = async () => {
    setFormError('');
    if (!form.title.trim() || !form.subject.trim() || !form.youtubeUrl.trim()) {
      setFormError('All fields are required.');
      return;
    }
    try {
      await createVideo.mutateAsync({ title: form.title.trim(), subject: form.subject.trim(), youtubeUrl: form.youtubeUrl.trim(), ...filter });
      setForm({ title: '', subject: '', youtubeUrl: '' });
      setAddOpen(false);
    } catch (err: any) {
      setFormError(err?.response?.data?.error || 'Failed to add video.');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ bgcolor: `${color}18`, borderRadius: '8px', p: 0.875, display: 'flex' }}>
            <Icon sx={{ color, fontSize: '1rem' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>{label}</Typography>
          {videos && <Chip label={videos.length} size="small" sx={{ bgcolor: `${color}18`, color, fontWeight: 700 }} />}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => { setAddOpen(true); setFormError(''); }}
          sx={{ bgcolor: color, '&:hover': { filter: 'brightness(0.85)' }, borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', px: 2.5 }}
        >
          Add Video
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color }} /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: '0px 2px 12px 0px rgba(42,52,57,0.06)', border: '1px solid rgba(169,180,185,0.12)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f7f9fb' }}>
                <TableCell>Title</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Views</TableCell>
                <TableCell>Added by</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {videos && videos.length > 0 ? videos.map((v) => (
                <TableRow key={v.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{v.title}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{v.subject}</TableCell>
                  <TableCell>
                    <Chip label={v.clicks.toLocaleString()} size="small" sx={{ bgcolor: `${color}14`, color, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{v.teacher.name}</TableCell>
                  <TableCell align="right">
                    <Button
                      startIcon={<DeleteRoundedIcon sx={{ fontSize: '0.875rem !important' }} />}
                      onClick={() => setDeleteTarget({ id: v.id, name: v.title })}
                      size="small"
                      sx={{ color: '#9f403d', fontWeight: 600, fontSize: '0.8125rem', '&:hover': { bgcolor: '#fdf0ef' } }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                    No videos yet. Click "Add Video" to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.125rem', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Icon sx={{ color }} />
            {dialogTitle}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 3 }}>{dialogDesc}</Typography>
          {formError && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{formError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} fullWidth size="small" />
            <TextField label="Topic" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} fullWidth size="small" />
            <TextField label="YouTube URL" value={form.youtubeUrl} onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))} fullWidth size="small" placeholder="https://www.youtube.com/watch?v=..." />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button
            onClick={handleAdd}
            disabled={createVideo.isPending}
            sx={{ bgcolor: color, color: 'white', '&:hover': { filter: 'brightness(0.85)' }, borderRadius: '6px', px: 3, fontWeight: 700 }}
          >
            {createVideo.isPending ? 'Adding…' : 'Add Video'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button
            onClick={() => deleteTarget && deleteVideoMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
            sx={{ bgcolor: '#9f403d', color: 'white', '&:hover': { bgcolor: '#7d312f' }, borderRadius: '6px', px: 3, fontWeight: 700 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ── Tabbed management section ──────────────────────────────────────────────
function ManagementSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(() => getTabFromPath(location.pathname));
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'user' | 'course'; name: string } | null>(null);

  useEffect(() => {
    setTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: courses, isLoading: coursesLoading } = useAdminCourses();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: kidCourses, isLoading: kidLoading } = useCourses({ isKidToKid: true });
  const { data: pendingKidTutors, isLoading: pendingLoading } = usePendingKidTutors();
  const deleteUser = useDeleteUser();
  const deleteCourse = useAdminDeleteCourse();
  const toggleTeach = useToggleLikesToTeach();
  const approveKidTutor = useApproveKidTutor();

  const handleTabChange = (_: unknown, newValue: number) => {
    navigate(['/admin/users', '/admin/courses', '/admin/health', '/admin/special-needs', '/admin/kid-to-kid', '/admin/pending', '/admin/analytics'][newValue]);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'user') await deleteUser.mutateAsync(deleteTarget.id);
    else await deleteCourse.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const topCourses = courses ? [...courses].sort((a, b) => b.clicks - a.clicks).slice(0, 5) : [];
  const usersByRole = users
    ? {
        admin: users.filter((u) => u.role === 'admin').length,
        professional: users.filter((u) => u.role === 'professional').length,
        student: users.filter((u) => u.role === 'student').length,
        kid_tutor: users.filter((u) => u.role === 'kid_tutor').length,
      }
    : null;

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 4,
          borderBottom: '1px solid rgba(169,180,185,0.15)',
          '& .MuiTabs-indicator': { backgroundColor: 'primary.main', height: 2, borderRadius: '1px' },
          '& .MuiTab-root': { fontFamily: "'Public Sans', sans-serif", fontWeight: 600, textTransform: 'none', color: 'text.secondary', fontSize: { xs: '0.8125rem', md: '0.9375rem' }, px: { xs: 1.5, md: 0 }, mr: { xs: 0, md: 4 }, minWidth: 'auto' },
          '& .Mui-selected': { color: 'primary.main !important' },
        }}
      >
        <Tab label="Users" />
        <Tab label="Courses" />
        <Tab label="Wellbeing" />
        <Tab label="Difficulties" />
        <Tab label="Kid to Kid" />
        <Tab label={`Pending${pendingKidTutors?.length ? ` (${pendingKidTutors.length})` : ''}`} />
        <Tab label="Analytics" />
      </Tabs>

      {/* Users */}
      {tab === 0 && (
        usersLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: '0px 2px 12px 0px rgba(42,52,57,0.06)', border: '1px solid rgba(169,180,185,0.12)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f7f9fb' }}>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Grade / School</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="center">Teaching Flag</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((u) => (
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
                          bgcolor: u.role === 'admin' ? 'rgba(27,107,81,0.1)' : u.role === 'professional' ? '#e1e9ee' : u.role === 'kid_tutor' ? 'rgba(196,122,30,0.12)' : '#f0f4f7',
                          color: u.role === 'admin' ? 'primary.main' : u.role === 'kid_tutor' ? '#c47a1e' : 'text.primary',
                          fontWeight: 700,
                          fontSize: '0.625rem',
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{u.grade || u.school || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      {u.role === 'student' ? (
                        <Tooltip title={u.likesToTeach ? 'Remove student teacher flag' : 'Enable student teacher'}>
                          <Button
                            onClick={() => toggleTeach.mutate(u.id)}
                            size="small"
                            sx={{
                              minWidth: 'auto',
                              p: 0.75,
                              color: u.likesToTeach ? '#c47a1e' : 'text.disabled',
                              '&:hover': { bgcolor: 'rgba(196,122,30,0.08)' },
                            }}
                          >
                            {u.likesToTeach
                              ? <StarRoundedIcon sx={{ fontSize: '1.25rem' }} />
                              : <StarBorderRoundedIcon sx={{ fontSize: '1.25rem' }} />
                            }
                          </Button>
                        </Tooltip>
                      ) : (
                        <Typography sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {u.role !== 'admin' && (
                        <Button
                          startIcon={<DeleteRoundedIcon sx={{ fontSize: '0.875rem !important' }} />}
                          onClick={() => setDeleteTarget({ id: u.id, type: 'user', name: u.username })}
                          size="small"
                          sx={{ color: '#9f403d', fontWeight: 600, fontSize: '0.8125rem', '&:hover': { bgcolor: '#fdf0ef' } }}
                        >
                          Remove
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {/* Courses */}
      {tab === 1 && (
        coursesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: '0px 2px 12px 0px rgba(42,52,57,0.06)', border: '1px solid rgba(169,180,185,0.12)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f7f9fb' }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses?.map((c) => (
                  <TableRow key={c.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{c.title}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{c.subject}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{c.grades.join(', ') || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{c.teacher.name}</TableCell>
                    <TableCell>
                      <Chip label={c.clicks.toLocaleString()} size="small" sx={{ bgcolor: 'rgba(27,107,81,0.08)', color: 'primary.main', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        startIcon={<DeleteRoundedIcon sx={{ fontSize: '0.875rem !important' }} />}
                        onClick={() => setDeleteTarget({ id: c.id, type: 'course', name: c.title })}
                        size="small"
                        sx={{ color: '#9f403d', fontWeight: 600, fontSize: '0.8125rem', '&:hover': { bgcolor: '#fdf0ef' } }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {/* Health Videos */}
      {tab === 2 && (
        <VideoSection
          label="Mental Health Videos"
          icon={FavoriteBorderRoundedIcon}
          color="#2e5d8e"
          filter={{ isHealthContent: true }}
          dialogTitle="Add Health Video"
          dialogDesc="Add a YouTube video focused on mental health, emotional wellbeing, or resilience."
        />
      )}

      {/* Special Needs */}
      {tab === 3 && (
        <VideoSection
          label="Special Needs Videos"
          icon={AccessibilityNewRoundedIcon}
          color="#6b3e8e"
          filter={{ isSpecialNeeds: true }}
          dialogTitle="Add Special Needs Video"
          dialogDesc="Add a YouTube video tailored for students with special learning needs."
        />
      )}

      {/* Kid to Kid */}
      {tab === 4 && (
        kidLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ bgcolor: 'rgba(196,122,30,0.1)', borderRadius: '8px', p: 0.875, display: 'flex' }}>
                <ChildCareRoundedIcon sx={{ color: '#c47a1e', fontSize: '1rem' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>Kid to Kid Courses</Typography>
              {kidCourses && <Chip label={kidCourses.length} size="small" sx={{ bgcolor: 'rgba(196,122,30,0.1)', color: '#c47a1e', fontWeight: 700 }} />}
            </Box>
            <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: '0px 2px 12px 0px rgba(42,52,57,0.06)', border: '1px solid rgba(169,180,185,0.12)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f7f9fb' }}>
                    <TableCell>Title</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Student Teacher</TableCell>
                    <TableCell>Views</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kidCourses && kidCourses.length > 0 ? kidCourses.map((c) => (
                    <TableRow key={c.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{c.title}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{c.subject}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{c.grades.join(', ') || '—'}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{c.teacher.name}</TableCell>
                      <TableCell>
                        <Chip label={c.clicks.toLocaleString()} size="small" sx={{ bgcolor: 'rgba(196,122,30,0.1)', color: '#c47a1e', fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          startIcon={<DeleteRoundedIcon sx={{ fontSize: '0.875rem !important' }} />}
                          onClick={() => setDeleteTarget({ id: c.id, type: 'course', name: c.title })}
                          size="small"
                          sx={{ color: '#9f403d', fontWeight: 600, fontSize: '0.8125rem', '&:hover': { bgcolor: '#fdf0ef' } }}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                        No kid-to-kid courses yet. Flag a student as a student teacher to let them start adding courses.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )
      )}

      {/* Pending Approvals — Kid Tutors */}
      {tab === 5 && (
        pendingLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ bgcolor: 'rgba(196,122,30,0.1)', borderRadius: '8px', p: 0.875, display: 'flex' }}>
                <ChildCareRoundedIcon sx={{ color: '#c47a1e', fontSize: '1rem' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>Pending Kid Tutor Approvals</Typography>
              {pendingKidTutors && <Chip label={pendingKidTutors.length} size="small" sx={{ bgcolor: 'rgba(196,122,30,0.12)', color: '#c47a1e', fontWeight: 700 }} />}
            </Box>
            <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: '0px 2px 12px 0px rgba(42,52,57,0.06)', border: '1px solid rgba(169,180,185,0.12)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f7f9fb' }}>
                    <TableCell>Student</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>School</TableCell>
                    <TableCell>Registered</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingKidTutors && pendingKidTutors.length > 0 ? pendingKidTutors.map((u) => (
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
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{u.school || '—'}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => approveKidTutor.mutate(u.id)}
                          disabled={approveKidTutor.isPending}
                          size="small"
                          sx={{ bgcolor: 'rgba(27,107,81,0.08)', color: 'primary.main', fontWeight: 700, fontSize: '0.8125rem', borderRadius: '6px', px: 2, '&:hover': { bgcolor: 'rgba(27,107,81,0.15)' } }}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
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

      {/* Analytics */}
      {tab === 6 && (
        <Box>
          <Grid container spacing={3}>
            {/* User Breakdown */}
            <Grid item xs={12} md={4}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: '12px', p: 4, border: '1px solid rgba(169,180,185,0.12)', boxShadow: '0px 2px 8px 0px rgba(42,52,57,0.04)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 1, display: 'flex' }}>
                    <PeopleRoundedIcon sx={{ color: 'primary.main', fontSize: '1.125rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>User Breakdown</Typography>
                </Box>
                {usersByRole ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {[
                      { label: 'Students', count: usersByRole.student, color: '#1b6b51' },
                      { label: 'Kid Tutors', count: usersByRole.kid_tutor, color: '#c47a1e' },
                      { label: 'Professionals', count: usersByRole.professional, color: '#475569' },
                      { label: 'Admins', count: usersByRole.admin, color: '#9f403d' },
                    ].map(({ label, count, color }) => {
                      const total = usersByRole.student + usersByRole.kid_tutor + usersByRole.professional + usersByRole.admin || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <Box key={label}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>{label}</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color }}>{count}</Typography>
                              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>({pct}%)</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ height: 6, bgcolor: '#f0f4f7', borderRadius: '3px', overflow: 'hidden' }}>
                            <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: color, borderRadius: '3px' }} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>
                )}
              </Box>
            </Grid>

            {/* Top Courses */}
            <Grid item xs={12} md={8}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: '12px', p: 4, border: '1px solid rgba(169,180,185,0.12)', boxShadow: '0px 2px 8px 0px rgba(42,52,57,0.04)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 1, display: 'flex' }}>
                    <SchoolRoundedIcon sx={{ color: 'primary.main', fontSize: '1.125rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>Top Courses by Views</Typography>
                </Box>
                {coursesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>
                ) : topCourses.length === 0 ? (
                  <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>No courses yet.</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {topCourses.map((course, index) => {
                      const maxClicks = topCourses[0]?.clicks || 1;
                      const pct = Math.round((course.clicks / maxClicks) * 100);
                      return (
                        <Box key={course.id}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: index === 0 ? 'primary.main' : 'text.secondary', minWidth: 20 }}>#{index + 1}</Typography>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }} noWrap>{course.title}</Typography>
                            </Box>
                            <Chip label={`${course.clicks.toLocaleString()} views`} size="small" sx={{ bgcolor: 'rgba(27,107,81,0.08)', color: 'primary.main', fontWeight: 700, flexShrink: 0, ml: 2 }} />
                          </Box>
                          <Box sx={{ height: 4, bgcolor: '#f0f4f7', borderRadius: '2px', overflow: 'hidden' }}>
                            <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: 'primary.main', borderRadius: '2px', opacity: index === 0 ? 1 : 0.5 + (0.5 / (index + 1)) }} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Private School Analytics */}
            {stats && stats.privateSchoolStats && (
              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: 'background.paper', borderRadius: '12px', p: 4, border: '1px solid rgba(169,180,185,0.12)', boxShadow: '0px 2px 8px 0px rgba(42,52,57,0.04)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 1, display: 'flex' }}>
                      <SchoolRoundedIcon sx={{ color: 'primary.main', fontSize: '1.125rem' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>Private School Breakdown</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {stats.privateSchoolStats.map(({ school, students, kidTutors }) => (
                      <Box key={school} sx={{ p: 2.5, borderRadius: '10px', bgcolor: '#f7f9fb', border: '1px solid rgba(169,180,185,0.12)' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary', mb: 1.5 }}>{school}</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ flex: 1, textAlign: 'center', p: 1.5, bgcolor: 'rgba(27,107,81,0.06)', borderRadius: '8px' }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: 'primary.main', lineHeight: 1 }}>{students}</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.secondary', mt: 0.5 }}>Students</Typography>
                          </Box>
                          <Box sx={{ flex: 1, textAlign: 'center', p: 1.5, bgcolor: 'rgba(196,122,30,0.08)', borderRadius: '8px' }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#c47a1e', lineHeight: 1 }}>{kidTutors}</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.secondary', mt: 0.5 }}>Kid Tutors</Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Madristi Click Analytics */}
            {stats && stats.madristiClicks && (
              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: 'background.paper', borderRadius: '12px', p: 4, border: '1px solid rgba(169,180,185,0.12)', boxShadow: '0px 2px 8px 0px rgba(42,52,57,0.04)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 1, display: 'flex' }}>
                      <BarChartRoundedIcon sx={{ color: 'primary.main', fontSize: '1.125rem' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>Madristi Clicks by School</Typography>
                  </Box>
                  {stats.madristiClicks.length === 0 ? (
                    <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4, fontSize: '0.875rem' }}>No Madristi clicks recorded yet.</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      {stats.madristiClicks.map(({ school, clicks }, index) => {
                        const maxClicks = stats.madristiClicks[0]?.clicks || 1;
                        const pct = Math.max(4, Math.round((clicks / maxClicks) * 100));
                        return (
                          <Box key={school}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>{school}</Typography>
                              <Chip label={`${clicks.toLocaleString()} clicks`} size="small" sx={{ bgcolor: 'rgba(27,107,81,0.08)', color: 'primary.main', fontWeight: 700 }} />
                            </Box>
                            <Box sx={{ height: 6, bgcolor: '#f0f4f7', borderRadius: '3px', overflow: 'hidden' }}>
                              <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: 'primary.main', borderRadius: '3px', opacity: index === 0 ? 1 : 0.45 + (0.55 / (index + 1)) }} />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Grid>
            )}

            {/* Platform Summary */}
            {stats && (
              <Grid item xs={12}>
                <Box sx={{ background: 'linear-gradient(135deg, #1b6b51 0%, #035d45 100%)', borderRadius: '12px', p: { xs: 3, md: 4 } }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.6)', mb: 3 }}>
                    Platform Summary
                  </Typography>
                  <Grid container spacing={4}>
                    {[
                      { label: 'Engagement Rate', value: stats.totalVisitors > 0 ? `${Math.round((stats.totalCourseClicks / stats.totalVisitors) * 100)}%` : '—' },
                      { label: 'Avg. Views / Course', value: stats.totalCourses > 0 ? Math.round(stats.totalCourseClicks / stats.totalCourses).toLocaleString() : '0' },
                      { label: 'Professional : Student', value: stats.totalProfessionals > 0 ? `1:${Math.round((stats.totalUsers - stats.totalProfessionals) / stats.totalProfessionals)}` : '—' },
                      { label: 'Total Activity', value: (stats.totalCourseClicks + stats.totalVisitors).toLocaleString() },
                    ].map(({ label, value }) => (
                      <Grid item xs={6} md={3} key={label}>
                        <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, letterSpacing: '-0.05em', color: '#e0ffee', lineHeight: 1 }}>{value}</Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.6)', mt: 0.75 }}>{label}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.125rem' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleDelete} sx={{ bgcolor: '#9f403d', color: 'white', '&:hover': { bgcolor: '#7d312f' }, borderRadius: '6px', px: 3, fontWeight: 700 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ── Root component ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const location = useLocation();
  const isOverview = location.pathname === '/admin';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar title="Admin Console" subtitle="Platform Control" links={SIDEBAR_LINKS} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Navbar />

        {isOverview ? (
          <OverviewSection />
        ) : (
          <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, py: 4, width: '100%' }}>
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'primary.main', mb: 0.75 }}>
                Admin Console
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, letterSpacing: '-0.025em', color: 'text.primary', lineHeight: 1.1 }}>
                Manage Platform
              </Typography>
            </Box>
            <ManagementSection />
          </Box>
        )}
      </Box>
    </Box>
  );
}
