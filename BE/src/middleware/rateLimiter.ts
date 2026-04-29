import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const courseCreateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 40,
  message: { error: 'Too many course creation requests, Please try again in 5 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
