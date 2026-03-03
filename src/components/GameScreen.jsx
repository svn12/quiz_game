import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getAvatarForQuestion } from '../services/avatars';
import { PASS_THRESHOLD } from '../services/api';

const OPTIONS = ['A', 'B', 'C', 'D'];

export default function GameScreen({ questions, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [flashClass, setFlashClass] = useState('');

  const question = questions[current];
  const avatarUrl = getAvatarForQuestion(current);
  const progress = ((current) / questions.length) * 100;
  const hpRatio = (PASS_THRESHOLD - answers.filter((a) => !a.correct).length) / PASS_THRESHOLD;

  const handleSelect = useCallback((option) => {
    if (selected !== null) return;
    setSelected(option);
  }, [selected]);

  const handleConfirm = useCallback(() => {
    if (selected === null) return;
    const correct = selected === question.answer;
    const newAnswers = [
      ...answers,
      { questionId: question.id, selected, correct },
    ];
    setAnswers(newAnswers);
    setFeedback(correct ? 'correct' : 'wrong');
    setFlashClass(correct ? 'flash-correct' : 'flash-wrong');

    setTimeout(() => {
      setFlashClass('');
      setFeedback(null);
      setSelected(null);
      if (current + 1 >= questions.length) {
        onFinish(newAnswers);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 900);
  }, [selected, question, answers, current, questions.length, onFinish]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toUpperCase();
      if (OPTIONS.includes(key) && selected === null) {
        handleSelect(key);
      }
      if (e.key === 'Enter' && selected !== null && feedback === null) {
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSelect, handleConfirm, selected, feedback]);

  const wrongCount = answers.filter((a) => !a.correct).length;
  const hpPercent = Math.max(0, Math.round(hpRatio * 100));

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        gap: '20px',
      }}
    >
      {/* Header: Progress */}
      <div style={{ width: '100%', maxWidth: '640px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}
        >
          <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
            STAGE {current + 1} / {questions.length}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--border)' }}>
            SCORE: {answers.filter((a) => a.correct).length} PT
          </span>
        </div>
        <div className="pixel-progress">
          <div
            className="pixel-progress-fill"
            style={{ width: `${progress + (1 / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div
        className={`pixel-panel ${flashClass}`}
        style={{
          width: '100%',
          maxWidth: '640px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Boss row */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div className="avatar-container" style={{ flexShrink: 0 }}>
            <img
              src={avatarUrl}
              alt={`Boss ${current + 1}`}
              className="avatar-img"
            />
            <span className="avatar-title">
              BOSS<br />#{String(current + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Boss HP + Question */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="hp-bar">
              <span>HP</span>
              <div className="hp-bar-track">
                <div
                  className={`hp-bar-fill ${hpPercent <= 30 ? 'low' : ''}`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              <span>{hpPercent}%</span>
            </div>

            {/* Question */}
            <div
              style={{
                fontSize: '11px',
                lineHeight: '1.9',
                color: 'var(--text)',
                paddingTop: '8px',
              }}
            >
              {question.question}
            </div>
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {OPTIONS.map((opt) => {
            let cls = 'option-btn';
            if (feedback !== null) {
              if (opt === question.answer) cls += ' correct';
              else if (opt === selected && !feedback) cls += ' wrong';
              else if (opt === selected && feedback === 'wrong') cls += ' wrong';
            } else if (opt === selected) {
              cls += ' selected';
            }

            return (
              <button
                key={opt}
                id={`option-${opt}`}
                className={cls}
                onClick={() => handleSelect(opt)}
                disabled={feedback !== null}
              >
                <span className="option-key">{opt}</span>
                <span>{question[opt]}</span>
              </button>
            );
          })}
        </div>

        {/* Confirm */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
          {feedback === 'correct' && (
            <span style={{ fontSize: '10px', color: 'var(--success)' }}>✔ CORRECT！</span>
          )}
          {feedback === 'wrong' && (
            <span style={{ fontSize: '10px', color: 'var(--fail)' }}>✘ WRONG！</span>
          )}
          <button
            id="confirm-btn"
            className="pixel-btn"
            onClick={handleConfirm}
            disabled={selected === null || feedback !== null}
            style={{ opacity: selected === null || feedback !== null ? 0.5 : 1 }}
          >
            確認 ▶
          </button>
        </div>
      </div>

      {/* Keyboard hint */}
      <div style={{ fontSize: '8px', color: 'var(--text-dim)', textAlign: 'center' }}>
        按 [A/B/C/D] 選擇 · 按 [ENTER] 確認
      </div>
    </div>
  );
}

GameScreen.propTypes = {
  questions: PropTypes.array.isRequired,
  onFinish: PropTypes.func.isRequired,
};
