const axios = require('axios');
const env = require('../config/env');
const { mockSessionResponse } = require('./mockResponder');

async function callLLM({ message, contextString, patient }) {
  const provider = (env.LLM_PROVIDER || 'mock').toLowerCase();
  const anyKey = env.LLM_API_KEY || env.OPENAI_API_KEY || env.GEMINI_API_KEY || env.ANTHROPIC_API_KEY;
  if (!anyKey || provider === 'mock') return mockSessionResponse({ message, contextString, patient });

  if (provider === 'openai') {
    const apiKey = env.OPENAI_API_KEY || env.LLM_API_KEY;
    try {
      const { data } = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: contextString },
          { role: 'user', content: message }
        ],
        temperature: 0.2
      }, { headers: { Authorization: `Bearer ${apiKey}` } });
      return data.choices?.[0]?.message?.content || mockSessionResponse({ message, contextString, patient });
    } catch (error) {
      return `${mockSessionResponse({ message, contextString, patient })}\n\n[LLM fallback used because provider call failed: ${error.message}]`;
    }
  }

  return mockSessionResponse({ message, contextString, patient });
}

module.exports = { callLLM };
