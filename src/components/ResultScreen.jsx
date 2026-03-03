import PropTypes from 'prop-types';
import { PASS_THRESHOLD } from '../services/api';

function getStars(score, total) {
  const ratio = score / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.5) return 1;
  return 0;
}

function getRank(score, total) {
  const ratio = score / total;
  if (ratio >= 0.9) return { label: 'S', color: '#f0c040' };
  if (ratio >= 0.7) return { label: 'A', color: '#30c0e8' };
  if (ratio >= 0.5) return { label: 'B', color: '#30c830' };
  if (ratio >= 0.3) return { label: 'C', color: '#e8a020' };
  return { label: 'F', color: '#e83030' };
}

export default function ResultScreen({ result, userId, onRestart }) {
  const { score, total, passed } = result;
  const stars = getStars(score, total);
  const rank = getRank(score, total);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        gap: '32px',
      }}
    >
      {/* Title */}
      <div className="text-center flex-col gap-8">
        {passed ? (
          <div
            style={{
              fontSize: '22px',
              color: 'var(--success)',
              textShadow: '3px 3px 0 #000',
              letterSpacing: '3px',
            }}
          >
            ★ STAGE CLEAR ★
          </div>
        ) : (
          <div
            style={{
              fontSize: '22px',
              color: 'var(--fail)',
              textShadow: '3px 3px 0 #000',
              letterSpacing: '3px',
            }}
          >
            ✘ GAME OVER ✘
          </div>
        )}
        <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
          PLAYER: {userId}
        </div>
      </div>

      {/* Score Panel */}
      <div
        className="pixel-panel"
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <div className="flex-col gap-24">
          {/* Rank */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '8px', color: 'var(--text-dim)', marginBottom: '8px' }}>
              RANK
            </div>
            <div
              style={{
                fontSize: '64px',
                color: rank.color,
                textShadow: `4px 4px 0 #000`,
                lineHeight: 1,
              }}
            >
              {rank.label}
            </div>
          </div>

          {/* Stars */}
          <div className="stars">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`star ${s <= stars ? 'lit' : ''}`}>
                ★
              </span>
            ))}
          </div>

          {/* Score */}
          <div className="flex-col gap-8">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
              <span className="color-dim">正確題數</span>
              <span className="color-gold">
                {score} / {total}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
              <span className="color-dim">通關門檻</span>
              <span className={score >= PASS_THRESHOLD ? 'color-success' : 'color-fail'}>
                {PASS_THRESHOLD} 題
              </span>
            </div>
            <div
              style={{
                borderTop: '2px solid var(--border)',
                paddingTop: '12px',
                textAlign: 'center',
              }}
            >
              <div className="score-display">
                {String(score).padStart(2, '0')} PT
              </div>
            </div>
          </div>

          {/* Result message */}
          <div
            style={{
              fontSize: '9px',
              textAlign: 'center',
              color: passed ? 'var(--success)' : 'var(--fail)',
              letterSpacing: '1px',
            }}
          >
            {passed
              ? `✔ 恭喜！成績已記錄到排行榜`
              : `再繼續努力！差 ${PASS_THRESHOLD - score} 題就過關了`}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button id="restart-btn" className="pixel-btn" onClick={onRestart}>
          ↺ RETRY
        </button>
        <button
          id="change-id-btn"
          className="pixel-btn secondary"
          onClick={() => onRestart(true)}
        >
          ⇄ CHANGE ID
        </button>
      </div>

      <div style={{ fontSize: '8px', color: 'var(--text-dim)' }}>
        成績已送出 · 感謝遊玩
      </div>
    </div>
  );
}

ResultScreen.propTypes = {
  result: PropTypes.shape({
    score: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    passed: PropTypes.bool.isRequired,
  }).isRequired,
  userId: PropTypes.string.isRequired,
  onRestart: PropTypes.func.isRequired,
};
