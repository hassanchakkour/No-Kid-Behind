import { useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PRIVACY_SECTIONS = [
  {
    title: '1. Data Collection & Minors',
    body: 'We collect only the minimum information needed to provide our services, such as a name, username and email address. We comply with COPPA and GDPR-K standards. We do not track precise geolocation or collect phone numbers from users.',
  },
  {
    title: '2. No Sale of Data',
    body: 'We do not sell user data to third parties or advertisers. We do not use behavioral tracking or targeted marketing for children on this platform.',
  },
  {
    title: '3. Parental Control',
    body: 'Parents and guardians have the right to review, edit, or request the deletion of their child\'s data at any time. If you wish to have your data or your child\'s data removed, please contact our support team for immediate processing.',
  },
  {
    title: '4. Safety in Videos',
    body: 'Users are prohibited from sharing "Personally Identifiable Information" (PII) - such as home addresses and phone numbers - within video content. We reserve the right to blur or remove any videos that compromise a minor\'s privacy or safety.',
  },
  {
    title: '5. Data Retention',
    body: 'If an account is closed or registration is revoked, we will delete all associated personal data from our active systems, except where we are legally required to retain specific records for safety audits or compliance.',
  },
];

const TERMS_SECTIONS = [
  {
    title: '1. Our Full Authority',
    body: 'By using this site, you grant us complete authority over all content. We reserve the absolute right to screen, edit, modify, or permanently delete any video, comment, or user-generated content at any time, for any reason, without prior notice.',
  },
  {
    title: '2. Revocation of Registration',
    body: 'We reserve the right to suspend, deactivate, or cancel your account and access to the platform at our sole discretion. This includes, but is not limited to, violations of community rules, safety guidelines, or platform integrity.',
  },
  {
    title: '3. No Responsibility (Limitation of Liability)',
    bullets: [
      'Service "As-Is": We provide this platform for educational purposes on an "as-is" basis. We make no guarantees regarding the accuracy or completeness of the videos posted.',
      'User Actions: We are not responsible for the actions of users, the content of their videos, or any technical issues arising from use.',
      'No Compensation: You agree that we are not liable for any loss of content or data. You are not entitled to compensation or damages if we choose to delete your account or videos.',
    ],
  },
  {
    title: '4. Creator Rules',
    bullets: [
      'License: You (or your professional organization) retain ownership of your videos. However, by posting, you grant us a free, worldwide license to host and display this content to our learners.',
      'Originality: You must only post content you created or have the legal right to use. No copyrighted music, movies, or images are allowed.',
      'Conduct: Bullying, harassment, or inappropriate content will result in an immediate and permanent ban.',
    ],
  },
  {
    title: '5. Agreement',
    body: 'Users under the age of 18 must have a parent or guardian review these terms. By creating an account, you agree to abide by these rules and respect our authority to manage the community.',
  },
  {
    title: '6. Indemnification',
    bullets: [
      'Your Responsibility: You agree to indemnify, defend, and hold harmless this platform, its owners, and its affiliates from any and all claims, damages, or legal fees (including attorney\'s fees) arising from your use of the site.',
      'Scope of Liability: This responsibility applies to any legal issues caused by content or videos you or your child posts, your violation of these Terms of Service or Privacy Policy, or your violation of any third-party rights including copyright, trademark, or privacy rights.',
      'Defense of Claims: In the event of a legal claim, you agree to cooperate fully in our defense. We reserve the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which case you will still be responsible for all legal costs and expenses.',
    ],
  },
];

export default function LegalPage() {
  const { hash } = useLocation();

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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
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
            Legal
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
            Privacy Policy & Terms of Service
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', lineHeight: 1.65 }}>
            Last updated: May 2026. Please read these documents carefully before using the platform.
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
              Privacy Policy
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {PRIVACY_SECTIONS.map((section) => (
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
              Terms of Service
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TERMS_SECTIONS.map((section) => (
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

        {/* Contact note */}
        <Box
          sx={{
            mt: 10,
            p: 4,
            borderRadius: '12px',
            bgcolor: 'rgba(27,107,81,0.05)',
            border: '1px solid rgba(27,107,81,0.12)',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary', mb: 0.75 }}>
            Questions or concerns?
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.65 }}>
            If you have any questions about this Privacy Policy or Terms of Service, please reach out to our support team. We are committed to keeping this platform safe for every child.
          </Typography>
        </Box>

      </Box>
    </Box>
  );
}
