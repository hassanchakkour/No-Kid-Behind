import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, TextField, MenuItem, InputAdornment,
  CircularProgress, Chip, Avatar, Switch, FormControlLabel, Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ChildCareRoundedIcon from '@mui/icons-material/ChildCareRounded';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';

const GRADES = ['All', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Higher Education', 'Professional'];

export default function StudentDashboard() {
  const { user, updateAuth } = useAuth();
  const navigate = useNavigate();
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');

  const toggleTeachMutation = useMutation({
    mutationFn: authApi.toggleLikesToTeach,
    onSuccess: (data) => {
      updateAuth(data.token, data.user);
      if (data.user.likesToTeach) navigate('/teacher');
    },
  });

  const { data: allCourses, isLoading } = useCourses();
  const { data: recommended } = useCourses(
    user?.grade ? { grade: user.grade } : undefined
  );

  const filtered = allCourses?.filter((c) => {
    const gradeMatch = !grade || c.grades.includes(grade);
    const subjectMatch = !subject || c.subject.toLowerCase().includes(subject.toLowerCase());
    const searchMatch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    return gradeMatch && subjectMatch && searchMatch;
  }) ?? [];

  const recommendedCourses = recommended?.slice(0, 4) ?? [];

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* ── Welcome Banner ── */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1b6b51 0%, #035d45 100%)',
            px: { xs: 4, md: 8 },
            pt: { xs: 3, md: 4 },
            pb: { xs: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* decorative circles */}
          <Box sx={{ position: 'absolute', top: -60, right: 60, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
          <Box sx={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />

          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'rgba(166,242,209,0.2)',
                color: '#a6f2d1',
                fontSize: '1.5rem',
                fontWeight: 800,
                border: '2px solid rgba(166,242,209,0.3)',
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.7)', mb: 0.5 }}>
                Welcome back
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, letterSpacing: '-0.025em', color: '#e0ffee', lineHeight: 1.1 }}>
                {user?.name ?? 'Learner'}
              </Typography>
              {user?.grade && (
                <Chip
                  label={user.grade}
                  size="small"
                  sx={{ mt: 1, bgcolor: 'rgba(166,242,209,0.15)', color: '#a6f2d1', fontWeight: 700, fontSize: '0.6875rem', border: '1px solid rgba(166,242,209,0.2)' }}
                />
              )}
            </Box>

            {/* Quick stats */}
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[
                { icon: AutoStoriesRoundedIcon, value: allCourses?.length ?? '…', label: 'Courses Available' },
                { icon: StarRoundedIcon, value: recommendedCourses.length || '—', label: 'Recommended' },
                { icon: SchoolRoundedIcon, value: user?.grade ?? '—', label: 'Your Grade' },
              ].map(({ icon: Icon, value, label }) => (
                <Box key={label} sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mb: 0.25 }}>
                    <Icon sx={{ color: '#a6f2d1', fontSize: '0.875rem' }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '1.375rem', letterSpacing: '-0.025em', color: '#e0ffee' }}>
                      {value}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.6)' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 4, md: 8 }, py: 4 }}>

          {/* ── Kid to Kid toggle ── */}
          <Box
            sx={{
              mb: 6,
              p: 3,
              borderRadius: '14px',
              background: user?.likesToTeach
                ? 'linear-gradient(135deg, #9a5c0a 0%, #c47a1e 100%)'
                : 'linear-gradient(135deg, #f0f4f7 0%, #e8edf0 100%)',
              border: user?.likesToTeach ? '1px solid rgba(255,220,130,0.3)' : '1px solid rgba(169,180,185,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 3,
              transition: 'all 0.3s',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  bgcolor: user?.likesToTeach ? 'rgba(255,220,130,0.2)' : 'rgba(27,107,81,0.1)',
                  borderRadius: '10px',
                  p: 1.25,
                  display: 'flex',
                }}
              >
                <ChildCareRoundedIcon sx={{ color: user?.likesToTeach ? '#ffd97a' : 'primary.main', fontSize: '1.375rem' }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: user?.likesToTeach ? '#fff8ec' : 'text.primary', lineHeight: 1.3 }}>
                  I like to teach — Kid to Kid
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: user?.likesToTeach ? 'rgba(255,248,236,0.7)' : 'text.secondary', mt: 0.25 }}>
                  {user?.likesToTeach
                    ? 'You can now create courses in the Kid to Kid section!'
                    : 'Toggle this on to share your knowledge and create courses for other students.'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {toggleTeachMutation.isError && (
                <Alert severity="error" sx={{ py: 0.5, borderRadius: '8px' }}>Failed. Try again.</Alert>
              )}
              <FormControlLabel
                control={
                  <Switch
                    checked={!!user?.likesToTeach}
                    onChange={() => toggleTeachMutation.mutate()}
                    disabled={toggleTeachMutation.isPending}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#ffd97a' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'rgba(255,217,122,0.5)' },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: user?.likesToTeach ? '#fff8ec' : 'text.secondary' }}>
                    {toggleTeachMutation.isPending ? 'Saving…' : user?.likesToTeach ? 'Active' : 'Off'}
                  </Typography>
                }
                sx={{ mr: 0 }}
              />
            </Box>
          </Box>

          {/* ── Recommended ── */}
          {recommendedCourses.length > 0 && (
            <Box sx={{ mb: 10 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
                <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 1, display: 'flex' }}>
                  <StarRoundedIcon sx={{ color: 'primary.main', fontSize: '1.1rem' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.375rem', color: 'text.primary', lineHeight: 1.2 }}>
                    Recommended for You
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                    Based on your grade — {user?.grade ?? 'all levels'}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={3}>
                {recommendedCourses.map((course, i) => (
                  <Grid item xs={12} sm={6} md={3} key={course.id}>
                    <CourseCard course={course} size={i === 0 ? 'large' : 'normal'} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* ── All Courses ── */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
              <Box sx={{ bgcolor: 'rgba(27,107,81,0.1)', borderRadius: '8px', p: 1, display: 'flex' }}>
                <AutoStoriesRoundedIcon sx={{ color: 'primary.main', fontSize: '1.1rem' }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.375rem', color: 'text.primary', lineHeight: 1.2 }}>
                  All Courses
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                  {filtered.length} course{filtered.length !== 1 ? 's' : ''} available
                </Typography>
              </Box>
            </Box>

            {/* Filters */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: 5,
                flexWrap: 'wrap',
                bgcolor: '#f0f4f7',
                p: 2,
                borderRadius: '10px',
                border: '1px solid rgba(169,180,185,0.1)',
              }}
            >
              <TextField
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: { bgcolor: 'background.paper', borderRadius: '8px', fontFamily: "'Public Sans', sans-serif" },
                }}
                sx={{ minWidth: 240, flex: 1 }}
              />
              <TextField
                select
                label="Grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value === 'All' ? '' : e.target.value)}
                size="small"
                variant="outlined"
                sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: '8px' } }}
              >
                {GRADES.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </TextField>
              <TextField
                placeholder="Subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                size="small"
                variant="outlined"
                sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: '8px' } }}
              />
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: 'primary.main' }} />
              </Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f0f4f7', borderRadius: '12px', border: '2px dashed rgba(169,180,185,0.3)' }}>
                <AutoStoriesRoundedIcon sx={{ fontSize: '2.5rem', color: 'text.disabled', mb: 1.5 }} />
                <Typography sx={{ color: 'text.secondary', fontSize: '1rem' }}>No courses match your filters.</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filtered.map((course) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                    <CourseCard course={course} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
