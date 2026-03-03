const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
export const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD) || 8;
export const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT) || 10;

export async function fetchQuestions() {
  const url = `${GAS_URL}?action=getQuestions&count=${QUESTION_COUNT}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch questions');
  const data = await res.json();
  return data.questions;
}

export async function submitAnswers(userId, answers) {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'submitAnswers',
      userId,
      answers,
      passThreshold: PASS_THRESHOLD,
    }),
  });
  if (!res.ok) throw new Error('Failed to submit answers');
  return await res.json();
}
