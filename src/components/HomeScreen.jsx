import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function HomeScreen({ onStart }) {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleStart = () => {
    const trimmed = userId.trim();
    if (!trimmed) {
      setError('請輸入你的 ID！');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setError('');
    onStart(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleStart();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        gap: '40px',
      }}
    >
      {/* Title */}
      <div className="flex-col gap-12 text-center">
        <div style={{ fontSize: '8px', color: 'var(--border)', letterSpacing: '4px' }}>
          ── STAGE CLEAR QUIZ ──
        </div>
        <h1 className="title-ticker" style={{ fontSize: 'clamp(18px, 4vw, 28px)' }}>
          ⚔ 闖關問答 ⚔
        </h1>
        <div className="subtitle">INSERT COIN TO PLAY</div>
        <div className="blink subtitle" style={{ color: 'var(--border)', marginTop: '4px' }}>
          ★ ★ ★
        </div>
      </div>

      {/* Panel */}
      <div
        className="pixel-panel"
        style={{ width: '100%', maxWidth: '480px' }}
      >
        <div className="flex-col gap-24">
          <div className="flex-col gap-12">
            <label
              htmlFor="userId"
              style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1px' }}
            >
              PLAYER ID
            </label>
            <input
              id="userId"
              ref={inputRef}
              className="pixel-input"
              style={shake ? { animation: 'flash-wrong 0.15s 3' } : {}}
              type="text"
              placeholder="輸入你的 ID..."
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              maxLength={30}
            />
            {error && (
              <span style={{ fontSize: '9px', color: 'var(--fail)' }}>{error}</span>
            )}
          </div>

          <button
            id="start-btn"
            className="pixel-btn"
            style={{ width: '100%', textAlign: 'center' }}
            onClick={handleStart}
          >
            ▶ PRESS START
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontSize: '8px', color: 'var(--text-dim)', textAlign: 'center', letterSpacing: '1px' }}>
        © 2000 QUIZ ARCADE CO. LTD.
      </div>
    </div>
  );
}

HomeScreen.propTypes = {
  onStart: PropTypes.func.isRequired,
};
