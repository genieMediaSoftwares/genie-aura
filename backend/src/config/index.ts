import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'genieaura-secret-jwt-key-vizag-agency-os-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'genieaura-refresh-secret-jwt-key-vizag-2026',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:5173'],
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  defaultOrg: {
    name: 'Genie Media & Studio',
    slug: 'genie-media',
    location: 'Yendada, Visakhapatnam, India',
  },
};
