import { FormControl, FormLabel, Select, MenuItem, FormHelperText, Box } from '@mui/material';
import { useField } from 'formik';

interface SelectFieldProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function SelectField({ name, label, options, placeholder }: SelectFieldProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <FormControl fullWidth error={hasError} variant="standard">
      <Box sx={{ mb: 0.5 }}>
        <FormLabel
          sx={{
            fontWeight: 700,
            fontSize: '0.625rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'text.secondary',
          }}
        >
          {label}
        </FormLabel>
      </Box>
      <Select
        {...field}
        displayEmpty
        disableUnderline={false}
        sx={{
          fontFamily: "'Public Sans', sans-serif",
          fontSize: '1rem',
          color: 'text.primary',
          pb: 1.25,
          pt: 1,
          px: 1.5,
          '&:before': { borderBottomColor: 'rgba(169,180,185,0.15)', borderBottomWidth: 2 },
          '&:hover:not(.Mui-disabled):before': { borderBottomColor: 'primary.main' },
          '&.Mui-focused:after': { borderBottomColor: 'primary.main' },
        }}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <span style={{ color: '#a9b4b9' }}>{placeholder}</span>
          </MenuItem>
        )}
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
}
