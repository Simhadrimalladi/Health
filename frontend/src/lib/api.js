const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
  return data.data ?? data;
}

export const api = {
  users: () => request('/users'),
  patients: () => request('/patients'),
  relevantQuestions: userId => request(`/questions/relevant/${userId}`),
  answer: payload => request('/answers', { method: 'POST', body: JSON.stringify(payload) }),
  nodes: params => request(`/nodes${params ? `?${new URLSearchParams(params)}` : ''}`),
  candidates: params => request(`/nodes/context-candidates?${new URLSearchParams(params)}`),
  session: payload => request('/session', { method: 'POST', body: JSON.stringify(payload) }),
  comparison: payload => request('/comparison', { method: 'POST', body: JSON.stringify(payload) }),
  health: userId => request(`/health-score?userId=${userId}`),
  addQuestion: payload => request('/admin/questions', { method: 'POST', body: JSON.stringify(payload) }),
  answerAdminQuestion: (questionId, payload) => request(`/admin/questions/${questionId}/answer`, { method: 'POST', body: JSON.stringify(payload) }),
  simulateMonth12: () => request('/admin/simulate-month12', { method: 'POST' })
};
