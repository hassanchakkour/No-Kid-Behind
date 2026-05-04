import { useState, useMemo } from 'react';
import { Box, Typography, Grid, TextField, MenuItem, InputAdornment, CircularProgress, Chip, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import { useCourses } from '../hooks/useCourses';
import client from '../api/client';
import schoolData from '../data/public_schools_lebanon.json';

type SchoolEntry = { Caza: string; Area: string; 'School Name': string };
const SCHOOL_DATA = schoolData as SchoolEntry[];

const PRIVATE_SCHOOLS = ['IC', 'ACS', 'College'];

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
  const [madristiSchool, setMadristiSchool] = useState('');
  const [pubCaza, setPubCaza] = useState('');
  const [pubArea, setPubArea] = useState('');
  const [pubSchool, setPubSchool] = useState('');

  const cazas = useMemo(() => [...new Set(SCHOOL_DATA.map((s) => s.Caza))].sort(), []);
  const areas = useMemo(() => pubCaza ? [...new Set(SCHOOL_DATA.filter((s) => s.Caza === pubCaza).map((s) => s.Area))].sort() : [], [pubCaza]);
  const publicSchools = useMemo(() => pubArea ? SCHOOL_DATA.filter((s) => s.Caza === pubCaza && s.Area === pubArea).map((s) => s['School Name']).sort() : [], [pubCaza, pubArea]);

  const analyticsSchool = madristiSchool === 'Public School' ? (pubSchool || 'Public School') : madristiSchool;
  const canVisit = madristiSchool === 'Public School' ? !!pubSchool : !!madristiSchool;

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

      {/* ── Ministry Section ── */}
      <Box sx={{ px: { xs: 4, md: 8 }, pt: 5, pb: 0, maxWidth: 1280, mx: 'auto' }}>
        {/* School picker cards */}
        <Box sx={{ mb: madristiSchool === 'Public School' ? 2 : 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'text.secondary', mb: 2 }}>
            Access Madristi — select your school
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[...PRIVATE_SCHOOLS, 'Public School'].map((s) => {
              const active = madristiSchool === s;
              const isPublic = s === 'Public School';
              return (
                <Box
                  key={s}
                  onClick={() => {
                    if (active) { setMadristiSchool(''); setPubCaza(''); setPubArea(''); setPubSchool(''); }
                    else { setMadristiSchool(s); setPubCaza(''); setPubArea(''); setPubSchool(''); }
                  }}
                  sx={{
                    flex: '1 1 120px',
                    minWidth: 120,
                    maxWidth: 220,
                    py: 2.5,
                    px: 3,
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: active ? 'primary.main' : 'rgba(169,180,185,0.25)',
                    bgcolor: active ? 'rgba(27,107,81,0.06)' : 'background.paper',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                    boxShadow: active ? '0px 4px 16px rgba(27,107,81,0.15)' : '0px 2px 8px rgba(0,0,0,0.04)',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(27,107,81,0.04)' },
                  }}
                >
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: active ? 'primary.main' : 'rgba(169,180,185,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1, transition: 'all 0.15s' }}>
                    {isPublic
                      ? <PublicRoundedIcon sx={{ fontSize: '1.1rem', color: active ? '#a6f2d1' : 'text.secondary' }} />
                      : <SchoolOutlinedIcon sx={{ fontSize: '1.1rem', color: active ? '#a6f2d1' : 'text.secondary' }} />}
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: active ? 'primary.main' : 'text.primary' }}>{s}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Public school cascade */}
        {madristiSchool === 'Public School' && (
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              select label="Caza" value={pubCaza}
              onChange={(e) => { setPubCaza(e.target.value); setPubArea(''); setPubSchool(''); }}
              size="small" sx={{ minWidth: 160, flex: 1, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: '8px' } }}
            >
              <MenuItem value="" disabled><em style={{ color: '#a9b4b9' }}>Select caza</em></MenuItem>
              {cazas.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField
              select label="Area" value={pubArea}
              onChange={(e) => { setPubArea(e.target.value); setPubSchool(''); }}
              size="small" disabled={!pubCaza}
              sx={{ minWidth: 160, flex: 1, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: '8px' } }}
            >
              <MenuItem value="" disabled><em style={{ color: '#a9b4b9' }}>Select area</em></MenuItem>
              {areas.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
            </TextField>
            <TextField
              select label="School" value={pubSchool}
              onChange={(e) => setPubSchool(e.target.value)}
              size="small" disabled={!pubArea}
              sx={{ minWidth: 200, flex: 2, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: '8px' } }}
            >
              <MenuItem value="" disabled><em style={{ color: '#a9b4b9' }}>Select school</em></MenuItem>
              {publicSchools.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Box>
        )}

        {/* Banner */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 3,
            px: { xs: 3, md: 5 },
            py: 3,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #023d2e 0%, #1b6b51 100%)',
            border: '1px solid rgba(166,242,209,0.18)',
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
                {canVisit ? `Visiting as: ${analyticsSchool}` : 'Select your school above to continue'}
              </Typography>
            </Box>
          </Box>
          <Box
            onClick={() => {
              if (!canVisit) return;
              client.post('/analytics/madristi-click', { school: analyticsSchool }).catch(() => {});
              window.open('https://madristi.mehe.gov.lb', '_blank', 'noopener,noreferrer');
            }}
            sx={{
              bgcolor: canVisit ? '#a6f2d1' : 'rgba(166,242,209,0.2)',
              color: canVisit ? '#023d2e' : 'rgba(166,242,209,0.4)',
              px: 3, py: 1.25, borderRadius: '8px',
              fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
              fontFamily: "'Public Sans', sans-serif",
              cursor: canVisit ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: canVisit ? '#8de8be' : 'rgba(166,242,209,0.2)' },
            }}
          >
            Visit Madristi →
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
