const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

if (!GAS_URL) {
  console.error('⚠️ VITE_GOOGLE_APP_SCRIPT_URL 未設定！請檢查 .env 或 GitHub Secrets。');
}

export const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD) || 8;
export const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT) || 10;

export async function fetchQuestions() {
  if (!GAS_URL || GAS_URL === 'undefined') {
    throw new Error('環境變數 VITE_GOOGLE_APP_SCRIPT_URL 未設定或無效');
  }
  const url = `${GAS_URL}?action=getQuestions&count=${QUESTION_COUNT}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('GAS 返回了 HTML 而非 JSON (可能是權限設定錯誤或 URL 錯誤)');
    }
    
    const data = await res.json();
    return data.questions;
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
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
