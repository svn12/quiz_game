import { useState, useEffect, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import LoadingScreen from './components/LoadingScreen';
import { fetchQuestions, submitAnswers, QUESTION_COUNT } from './services/api';
import { preloadAvatars } from './services/avatars';

// STATES: 'home' | 'loading-questions' | 'game' | 'submitting' | 'result' | 'error'

export default function App() {
  const [screen, setScreen] = useState('home');
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Preload avatars on mount
  useEffect(() => {
    preloadAvatars().catch(() => {});
  }, []);

  const handleStart = useCallback(async (id) => {
    setUserId(id);
    setScreen('loading-questions');
    setErrorMsg('');
    try {
      const qs = await fetchQuestions();
      if (!qs || qs.length === 0) throw new Error('No questions returned');
      setQuestions(qs);
      setScreen('game');
    } catch (err) {
      setErrorMsg(`載入題目失敗：${err.message}`);
      setScreen('error');
    }
  }, []);

  const handleFinish = useCallback(
    async (answers) => {
      setScreen('submitting');
      try {
        const res = await submitAnswers(userId, answers);
        setResult({
          score: res.score,
          total: answers.length,
          passed: res.passed,
        });
        setScreen('result');
      } catch (err) {
        // Even on submit failure, show result locally
        const score = answers.filter((a) => a.correct).length;
        setResult({
          score,
          total: answers.length,
          passed: score >= parseInt(import.meta.env.VITE_PASS_THRESHOLD || 8),
          submitError: true,
        });
        setScreen('result');
      }
    },
    [userId]
  );

  const handleRestart = useCallback(
    (changeId = false) => {
      setResult(null);
      setQuestions([]);
      if (changeId) {
        setUserId('');
        setScreen('home');
      } else {
        handleStart(userId);
      }
    },
    [userId, handleStart]
  );

  if (screen === 'loading-questions') {
    return <LoadingScreen message="LOADING QUESTIONS..." />;
  }
  if (screen === 'submitting') {
    return <LoadingScreen message="SAVING SCORE..." />;
  }
  if (screen === 'error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        <div style={{ fontSize: '13px', color: 'var(--fail)', textAlign: 'center' }}>
          ✘ ERROR
        </div>
        <div
          style={{
            fontSize: '9px',
            color: 'var(--text-dim)',
            textAlign: 'center',
            maxWidth: '360px',
          }}
        >
          {errorMsg}
        </div>
        <button
          className="pixel-btn secondary"
          onClick={() => setScreen('home')}
        >
          ↺ BACK
        </button>
      </div>
    );
  }
  if (screen === 'game') {
    return <GameScreen questions={questions} onFinish={handleFinish} />;
  }
  if (screen === 'result') {
    return (
      <ResultScreen result={result} userId={userId} onRestart={handleRestart} />
    );
  }
  return <HomeScreen onStart={handleStart} />;
}
