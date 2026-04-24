import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useNavigate } from 'react-router-dom';
import { Course } from '../api/courses.api';

const GRADE_NUMS: Record<string, number> = {
  'Grade 7': 7, 'Grade 8': 8, 'Grade 9': 9, 'Grade 10': 10,
  'Grade 11': 11, 'Grade 12': 12, 'Higher Education': 13, 'Professional': 14, 'All Levels': 0,
};

function formatGrades(grades: string[]): string {
  if (!Array.isArray(grades) || grades.length === 0) return '';
  if (grades.length === 1) return grades[0];
  const numbered = grades.filter((g) => GRADE_NUMS[g] >= 7 && GRADE_NUMS[g] <= 12).sort((a, b) => GRADE_NUMS[a] - GRADE_NUMS[b]);
  if (numbered.length === grades.length && numbered.length > 1) {
    const nums = numbered.map((g) => GRADE_NUMS[g]);
    const isConsecutive = nums.every((n, i) => i === 0 || n === nums[i - 1] + 1);
    if (isConsecutive) return `Grades ${nums[0]}–${nums[nums.length - 1]}`;
  }
  return grades.join(', ');
}

interface CourseCardProps {
  course: Course;
  size?: 'large' | 'normal';
}

export default function CourseCard({ course, size = 'normal' }: CourseCardProps) {
  const navigate = useNavigate();
  const thumbUrl = `https://img.youtube.com/vi/${course.youtubeVideoId}/hqdefault.jpg`;

  return (
    <Card
      onClick={() => navigate(`/courses/${course.id}`)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        border: '1px solid rgba(169,180,185,0.1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0px 16px 40px 0px rgba(27,107,81,0.12)',
        },
        '&:hover .play-overlay': {
          opacity: 1,
        },
      }}
    >
      {/* Thumbnail */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={thumbUrl}
          alt={course.title}
          sx={{
            height: size === 'large' ? 240 : 180,
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.03)' },
          }}
        />
        {/* Play overlay */}
        <Box
          className="play-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(27,107,81,0.6) 0%, rgba(3,93,69,0.4) 100%)',
            opacity: 0,
            transition: 'opacity 0.18s ease',
          }}
        >
          <PlayCircleRoundedIcon
            sx={{ color: 'white', fontSize: size === 'large' ? '4rem' : '3rem', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
          />
        </Box>
        {/* Subject badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            bgcolor: 'rgba(27,107,81,0.9)',
            borderRadius: '6px',
            px: 1.25,
            py: 0.4,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a6f2d1' }}>
            {course.subject}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ flex: 1, p: size === 'large' ? 3.5 : 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Grade badge + views */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            sx={{
              bgcolor: '#f0f4f7',
              borderRadius: '6px',
              px: 1.25,
              py: 0.4,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: '0.5625rem', letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase' }}>
              {formatGrades(course.grades) || 'All Levels'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VisibilityRoundedIcon sx={{ fontSize: '0.75rem', color: 'text.disabled' }} />
            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', fontWeight: 500 }}>
              {course.clicks.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: size === 'large' ? '1.1875rem' : '1rem',
            color: 'text.primary',
            lineHeight: 1.35,
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.title}
        </Typography>

        {/* Teacher + school */}
        <Box sx={{ pt: 0.5, borderTop: '1px solid rgba(169,180,185,0.1)' }}>
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontWeight: 500 }} noWrap>
            {course.teacher.username === 'admin' ? 'System' : course.teacher.name}
          </Typography>
          {course.school && (
            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }} noWrap>
              {course.school}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
