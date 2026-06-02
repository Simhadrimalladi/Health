const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/brahmo',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  LLM_PROVIDER: process.env.LLM_PROVIDER || 'mock',
  LLM_API_KEY: process.env.LLM_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  TOKEN_BUDGET: Number(process.env.TOKEN_BUDGET || 4000),
  DERIVABILITY_THRESHOLD: Number(process.env.DERIVABILITY_THRESHOLD || 0.7)
};

module.exports = env;
