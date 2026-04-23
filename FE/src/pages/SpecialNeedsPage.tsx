import { useState } from 'react';
import { Box, Typography, Grid, TextField, InputAdornment, CircularProgress, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import { useCourses } from '../hooks/useCourses';

export default function SpecialNeedsPage() {
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');

  const { data: allVideos, isLoading } = useCourses({ isSpecialNeeds: true });

  const filtered = allVideos?.filter((v) => {
    const subjectMatch = !subject || v.subject.toLowerCase().includes(subject.toLowerCase());
    const searchMatch =
      !search ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.subject.toLowerCase().includes(search.toLowerCase());
    return subjectMatch && searchMatch;
  }) ?? [];

  const activeFilters = [subject, search].filter(Boolean).length;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Header Banner ── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6b3e8e 0%, #4a2765 100%)',
          px: { xs: 4, md: 8 },
          pt: 5,
          pb: 5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -40, right: 80, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, right: -30, width: 240, height: 240, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />

        <Box sx={{ maxWidth: 1280, mx: 'auto', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccessibilityNewRoundedIcon sx={{ color: 'rgba(220,180,255,0.7)', fontSize: '0.875rem' }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(220,180,255,0.7)' }}>
                  Inclusive Education
                </Typography>
              </Box>
              <Typography
                component="h1"
                sx={{ fontWeight: 800, fontSize: { xs: '2.25rem', md: '3rem' }, letterSpacing: '-0.035em', color: '#f3e8ff', lineHeight: 1.05, mb: 1.5 }}
              >
                Special Needs Resources
              </Typography>
              <Typography sx={{ fontSize: '1rem', color: 'rgba(243,232,255,0.7)', maxWidth: 480, lineHeight: 1.6 }}>
                Specially curated content designed to support students with diverse learning needs.
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(220,180,255,0.2)',
                borderRadius: '12px',
                px: 4,
                py: 3,
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
                minWidth: 140,
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.05em', color: '#f3e8ff', lineHeight: 1 }}>
                {isLoading ? '…' : allVideos?.length ?? 0}
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(220,180,255,0.6)', mt: 0.5 }}>
                Videos Available
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Filters ── */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(169,180,185,0.1)', px: { xs: 4, md: 8 }, py: 3, position: 'sticky', top: 64, zIndex: 50 }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', flexShrink: 0 }}>
            <AccessibilityNewRoundedIcon sx={{ fontSize: '1rem' }} />
            <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>Filter</Typography>
            {activeFilters > 0 && (
              <Chip
                label={activeFilters}
                size="small"
                sx={{ bgcolor: '#6b3e8e', color: '#f3e8ff', fontWeight: 700, fontSize: '0.625rem', height: 18, ml: 0.5 }}
              />
            )}
          </Box>

          <TextField
            placeholder="Search by title or topic…"
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
              sx: { bgcolor: '#f7f9fb', borderRadius: '8px', fontFamily: "'Public Sans', sans-serif" },
            }}
            sx={{ minWidth: 260, flex: 2 }}
          />
          <TextField
            placeholder="Topic…"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            size="small"
            variant="outlined"
            sx={{ minWidth: 180, flex: 1, '& .MuiOutlinedInput-root': { bgcolor: '#f7f9fb', borderRadius: '8px' } }}
          />
        </Box>
      </Box>

      {/* ── Results ── */}
      <Box sx={{ px: { xs: 4, md: 8 }, py: 8, maxWidth: 1280, mx: 'auto' }}>
        {!isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: 'text.primary' }}>
              {filtered.length} {filtered.length === 1 ? 'video' : 'videos'} found
            </Typography>
            {activeFilters > 0 && (
              <Typography
                onClick={() => { setSubject(''); setSearch(''); }}
                sx={{ fontSize: '0.8125rem', color: '#6b3e8e', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear filters
              </Typography>
            )}
          </Box>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 14 }}>
            <CircularProgress sx={{ color: '#6b3e8e' }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 14,
              bgcolor: '#f0f4f7',
              borderRadius: '12px',
              border: '2px dashed rgba(169,180,185,0.3)',
            }}
          >
            <AccessibilityNewRoundedIcon sx={{ fontSize: '3rem', color: 'text.disabled', mb: 2 }} />
            <Typography sx={{ color: 'text.secondary', fontSize: '1.0625rem', mb: 1 }}>
              No special needs videos found.
            </Typography>
            <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
              {activeFilters > 0 ? 'Try adjusting your filters.' : 'Content is being added. Check back soon.'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                <CourseCard course={video} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
