import { Box, Typography } from '@mui/material';

interface MetricCardProps {
  value: string | number;
  label: string;
}

export default function MetricCard({ value, label }: MetricCardProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: '2.25rem',
          letterSpacing: '-0.05em',
          lineHeight: 1.111,
          color: 'primary.main',
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '0.625rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'text.secondary',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
