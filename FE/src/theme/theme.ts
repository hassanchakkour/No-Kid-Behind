import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    textMuted: Palette['primary'];
  }
  interface PaletteOptions {
    textMuted?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1b6b51',
      light: '#a6f2d1',
      dark: '#035d45',
      contrastText: '#e0ffee',
    },
    secondary: {
      main: '#e1e9ee',
      dark: '#d9e4ea',
      contrastText: '#2a3439',
    },
    error: {
      main: '#9f403d',
    },
    background: {
      default: '#f7f9fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#2a3439',
      secondary: '#566166',
      disabled: '#a9b4b9',
    },
    divider: 'rgba(169, 180, 185, 0.15)',
  },

  typography: {
    fontFamily: "'Public Sans', sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: '4.5rem',
      letterSpacing: '-0.05em',
      lineHeight: 1,
    },
    h2: {
      fontWeight: 800,
      fontSize: '3rem',
      letterSpacing: '-0.025em',
      lineHeight: 1,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.333,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.555,
    },
    h6: {
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.625,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.571,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.025em',
    },
    subtitle2: {
      fontWeight: 700,
      fontSize: '0.625rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      color: '#566166',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0',
    },
  },

  shape: {
    borderRadius: 8,
  },

  shadows: [
    'none',
    '0px 1px 2px 0px rgba(0,0,0,0.05)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 10px 15px -3px rgba(27,107,81,0.1), 0px 4px 6px -4px rgba(27,107,81,0.1)',
    '0px 8px 32px 0px rgba(42,52,57,0.04)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
    '0px 8px 32px 0px rgba(42,52,57,0.06)',
  ],

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontFamily: "'Public Sans', sans-serif",
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          backgroundColor: '#1b6b51',
          color: '#e0ffee',
          '&:hover': { backgroundColor: '#145440' },
        },
        containedSecondary: {
          backgroundColor: '#e1e9ee',
          color: '#2a3439',
          '&:hover': { backgroundColor: '#d1dce3' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'standard' },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "'Public Sans', sans-serif",
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 8px 32px 0px rgba(42,52,57,0.06)',
          border: '1px solid rgba(169, 180, 185, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontFamily: "'Public Sans', sans-serif",
          fontWeight: 700,
          fontSize: '0.625rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.625rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#566166',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f7f9fb',
          fontFamily: "'Public Sans', sans-serif",
        },
      },
    },
  },
});

export default theme;
