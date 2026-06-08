import { useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

export default function LegalPage() {
  const { hash } = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang].legal;
  const isRtl = lang === 'ar';

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />

      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 12 } }}>

        {/* Page header */}
        <Box sx={{ mb: 10 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'primary.main',
              mb: 1.5,
            }}
          >
            {t.pageLabel}
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.75rem' },
              letterSpacing: '-0.035em',
              color: 'text.primary',
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            {t.pageTitle}
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', lineHeight: 1.65 }}>
            {t.lastUpdated}
          </Typography>
        </Box>

        {/* Privacy Policy */}
        <Box id="privacy" sx={{ mb: 10 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: 'rgba(27,107,81,0.08)',
              borderRadius: '8px',
              px: 2,
              py: 0.75,
              mb: 4,
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'primary.main',
              }}
            >
              {t.privacyLabel}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {t.privacySections.map((section) => (
              <Box key={section.title}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    color: 'text.secondary',
                    lineHeight: 1.75,
                  }}
                >
                  {section.body}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 10, borderColor: 'rgba(169,180,185,0.2)' }} />

        {/* Terms of Service */}
        <Box id="terms">
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: 'rgba(27,107,81,0.08)',
              borderRadius: '8px',
              px: 2,
              py: 0.75,
              mb: 4,
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'primary.main',
              }}
            >
              {t.termsLabel}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {t.termsSections.map((section) => (
              <Box key={section.title}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {section.title}
                </Typography>
                {'body' in section && section.body && (
                  <Typography
                    sx={{
                      fontSize: '0.9375rem',
                      color: 'text.secondary',
                      lineHeight: 1.75,
                    }}
                  >
                    {section.body}
                  </Typography>
                )}
                {'bullets' in section && section.bullets && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: 0 }}>
                    {section.bullets.map((bullet, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                        <Box
                          sx={{
                            mt: '7px',
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '0.9375rem',
                            color: 'text.secondary',
                            lineHeight: 1.75,
                          }}
                        >
                          {bullet}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>


</Box>
    </Box>
  );
}
