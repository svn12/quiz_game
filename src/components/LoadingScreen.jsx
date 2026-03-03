import PropTypes from 'prop-types';

export default function LoadingScreen({ message = 'LOADING...' }) {
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
      <div
        style={{
          fontSize: '14px',
          color: 'var(--border)',
          letterSpacing: '4px',
        }}
        className="blink"
      >
        {message}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: '12px',
              height: '12px',
              background: 'var(--border)',
              animation: `blink 1s step-start ${i * 0.25}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

LoadingScreen.propTypes = {
  message: PropTypes.string,
};
