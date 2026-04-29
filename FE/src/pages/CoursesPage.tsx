import { useState } from 'react';
import { Box, Typography, Grid, TextField, MenuItem, InputAdornment, CircularProgress, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import { useCourses } from '../hooks/useCourses';

const GRADES = [
  'All', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12', 'Higher Education', 'Professional', 'All Levels',
];

export default function CoursesPage() {
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');
  const [school, setSchool] = useState('');

  const { data: rawCourses, isLoading } = useCourses();

  const allCourses = (Array.isArray(rawCourses) ? rawCourses : []).filter(
    (c) => !c.isKidToKid && !c.isHealthContent && !c.isSpecialNeeds
  );

  const filtered = allCourses.filter((c) => {
    const gradeMatch = !grade || c.grades.includes(grade);
    const subjectMatch = !subject || c.subject.toLowerCase().includes(subject.toLowerCase());
    const schoolMatch = !school || (c.school && c.school.toLowerCase().includes(school.toLowerCase()));
    const searchMatch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    return gradeMatch && subjectMatch && schoolMatch && searchMatch;
  });

  const activeFilters = [grade, subject, school, search].filter(Boolean).length;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Header Banner ── */}
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
        {/* decorative shapes */}
        <Box sx={{ position: 'absolute', top: -40, right: 80, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, right: -30, width: 240, height: 240, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />

        <Box sx={{ maxWidth: 1280, mx: 'auto', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.7)', mb: 1 }}>
                Full Catalog
              </Typography>
              <Typography
                component="h1"
                sx={{ fontWeight: 800, fontSize: { xs: '2.25rem', md: '3rem' }, letterSpacing: '-0.035em', color: '#e0ffee', lineHeight: 1.05, mb: 1.5 }}
              >
                Explore Courses
              </Typography>
              <Typography sx={{ fontSize: '1rem', color: 'rgba(224,255,238,0.7)', maxWidth: 480, lineHeight: 1.6 }}>
                Browse our full catalog of free, high-quality educational resources for every grade and subject.
              </Typography>
            </Box>

            {/* Live count */}
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(166,242,209,0.2)',
                borderRadius: '12px',
                px: 4,
                py: 3,
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
                minWidth: 140,
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.05em', color: '#e0ffee', lineHeight: 1 }}>
                {isLoading ? '…' : allCourses?.length ?? 0}
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,242,209,0.6)', mt: 0.5 }}>
                Courses Available
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Ministry Banner ── */}
      <Box sx={{ px: { xs: 4, md: 8 }, py: 3, bgcolor: 'background.default' }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          <Box
            component="a"
            href="https://madristi.mehe.gov.lb"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              px: { xs: 3, md: 4 },
              py: 2.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #023d2e 0%, #1b6b51 100%)',
              border: '1px solid rgba(166,242,209,0.18)',
              textDecoration: 'none',
              transition: 'box-shadow 0.2s, transform 0.2s',
              '&:hover': { boxShadow: '0px 8px 32px rgba(27,107,81,0.2)', transform: 'translateY(-1px)' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ bgcolor: 'rgba(166,242,209,0.12)', border: '1px solid rgba(166,242,209,0.2)', borderRadius: '8px', px: 1.5, py: 0.75, flexShrink: 0 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a6f2d1' }}>
                  Official
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#e0ffee', lineHeight: 1.3 }}>
                  Lebanese Ministry of Education — Madristi Platform
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(224,255,238,0.6)', mt: 0.25 }}>
                  Official learning resources from the Ministry of Education
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: '#a6f2d1',
                color: '#023d2e',
                px: 2.5,
                py: 1,
                borderRadius: '7px',
                fontWeight: 700,
                fontSize: '0.8125rem',
                flexShrink: 0,
                fontFamily: "'Public Sans', sans-serif",
              }}
            >
              Visit Madristi →
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Filters ── */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(169,180,185,0.1)', px: { xs: 4, md: 8 }, py: 3, position: 'sticky', top: 64, zIndex: 50 }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', flexShrink: 0 }}>
            <TuneRoundedIcon sx={{ fontSize: '1rem' }} />
            <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>Filters</Typography>
            {activeFilters > 0 && (
              <Chip
                label={activeFilters}
                size="small"
                sx={{ bgcolor: 'primary.main', color: '#e0ffee', fontWeight: 700, fontSize: '0.625rem', height: 18, ml: 0.5 }}
              />
            )}
          </Box>

          <TextField
            placeholder="Search by title or subject…"
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
            select
            label="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value === 'All' ? '' : e.target.value)}
            size="small"
            variant="outlined"
            sx={{ minWidth: 150, flex: 1, '& .MuiOutlinedInput-root': { bgcolor: '#f7f9fb', borderRadius: '8px' } }}
          >
            {GRADES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
          </TextField>
          <TextField
            placeholder="Subject…"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            size="small"
            variant="outlined"
            sx={{ minWidth: 140, flex: 1, '& .MuiOutlinedInput-root': { bgcolor: '#f7f9fb', borderRadius: '8px' } }}
          />
          <TextField
            placeholder="School…"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            size="small"
            variant="outlined"
            sx={{ minWidth: 140, flex: 1, '& .MuiOutlinedInput-root': { bgcolor: '#f7f9fb', borderRadius: '8px' } }}
          />
        </Box>
      </Box>

      {/* ── Results ── */}
      <Box sx={{ px: { xs: 4, md: 8 }, py: 8, maxWidth: 1280, mx: 'auto' }}>
        {/* Result count */}
        {!isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: 'text.primary' }}>
              {filtered.length} {filtered.length === 1 ? 'course' : 'courses'} found
            </Typography>
            {activeFilters > 0 && (
              <Typography
                onClick={() => { setGrade(''); setSubject(''); setSchool(''); setSearch(''); }}
                sx={{ fontSize: '0.8125rem', color: 'primary.main', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear filters
              </Typography>
            )}
          </Box>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 14 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
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
            <AutoStoriesRoundedIcon sx={{ fontSize: '3rem', color: 'text.disabled', mb: 2 }} />
            <Typography sx={{ color: 'text.secondary', fontSize: '1.0625rem', mb: 1 }}>
              No courses match your search.
            </Typography>
            <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
              Try adjusting your filters or search term.
            </Typography>
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
  );
}
