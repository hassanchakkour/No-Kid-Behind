import { TextField, FormControl, FormLabel, FormHelperText, Box } from '@mui/material';
import { useField } from 'formik';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  optional?: boolean;
  multiline?: boolean;
  rows?: number;
}

export default function InputField({ name, label, type = 'text', placeholder, optional, multiline, rows }: InputFieldProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <FormControl fullWidth error={hasError}>
      <Box sx={{ mb: 0.5 }}>
        <FormLabel
          sx={{
            fontWeight: 700,
            fontSize: '0.625rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            display: 'flex',
            gap: 0.5,
            alignItems: 'baseline',
          }}
        >
          {label}
          {optional && (
            <Box component="span" sx={{ fontSize: '0.5rem', opacity: 0.6, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              (Optional)
            </Box>
          )}
        </FormLabel>
      </Box>
      <TextField
        {...field}
        type={type}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        variant="standard"
        error={hasError}
        InputProps={{
          sx: {
            fontFamily: "'Public Sans', sans-serif",
            fontSize: '1rem',
            color: 'text.primary',
            pb: 1.5,
            pt: 1.25,
            px: 1.5,
            '&:before': { borderBottomColor: '#6b7280' },
            '&:hover:not(.Mui-disabled):before': { borderBottomColor: 'primary.main' },
            '&.Mui-focused:after': { borderBottomColor: 'primary.main' },
          },
        }}
      />
      {hasError && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
}
