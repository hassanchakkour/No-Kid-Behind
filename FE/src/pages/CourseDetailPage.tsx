import { Box, Typography, CircularProgress, Chip, Button, Divider, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCourse } from '../hooks/useCourses';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading, isError } = useCourse(id!);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 20 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      </Box>
    );
  }

  if (isError || !course) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Box sx={{ textAlign: 'center', py: 20 }}>
          <Typography sx={{ fontSize: '1.25rem', color: 'text.secondary' }}>Course not found.</Typography>
          <Button onClick={() => navigate(-1)} sx={{ mt: 2, color: 'primary.main' }}>Go Back</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 6 }, py: 6 }}>
        {/* Back */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary', fontWeight: 500, mb: 4, pl: 0 }}
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 6, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Video player (left / main) */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9
                borderRadius: '8px',
                overflow: 'hidden',
                bgcolor: '#000',
                boxShadow: '0px 8px 32px 0px rgba(42,52,57,0.06)',
              }}
            >
              <Box
                component="iframe"
                src={`https://www.youtube.com/embed/${course.youtubeVideoId}?rel=0`}
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </Box>

            {/* Title & meta below video */}
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={course.subject.toUpperCase()}
                  size="small"
                  sx={{ bgcolor: 'rgba(27,107,81,0.1)', color: 'primary.main', fontWeight: 700, fontSize: '0.625rem' }}
                />
                {course.grades.map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    size="small"
                    sx={{ bgcolor: '#e8eff3', color: 'text.primary', fontWeight: 700, fontSize: '0.625rem' }}
                  />
                ))}
                {course.school && (
                  <Chip
                    label={course.school}
                    size="small"
                    sx={{ bgcolor: '#f0f4f7', color: 'text.secondary', fontSize: '0.625rem' }}
                  />
                )}
              </Box>

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  letterSpacing: '-0.025em',
                  color: 'text.primary',
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                {course.title}
              </Typography>

              <Divider sx={{ my: 3, borderColor: 'divider' }} />

              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>Instructor</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
                    {course.teacher.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>Views</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
                    {course.clicks.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>Added</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
                    {new Date(course.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Sidebar metadata panel */}
          <Box sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0 }}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid rgba(169,180,185,0.15)',
                borderRadius: '8px',
                p: 3,
                boxShadow: '0px 8px 32px 0px rgba(42,52,57,0.06)',
                position: { lg: 'sticky' },
                top: { lg: 24 },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary', mb: 3 }}>
                Course Details
              </Typography>
              {[
                { label: 'Subject', value: course.subject },
                { label: 'Target Grade', value: course.grades.join(', ') || 'All Levels' },
                { label: 'Institution', value: course.school || 'Open Access' },
                { label: 'Instructor', value: course.teacher.name },
                { label: 'Total Views', value: course.clicks.toLocaleString() },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'text.secondary', mb: 0.5 }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'text.primary' }}>
                    {value}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 3, borderColor: 'divider' }} />

              <Button
                href={`https://www.youtube.com/watch?v=${course.youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  borderRadius: '6px',
                  py: 1.5,
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'rgba(27,107,81,0.05)' },
                }}
              >
                Open on YouTube ↗
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
