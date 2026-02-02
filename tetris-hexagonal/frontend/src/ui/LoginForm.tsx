import { useState } from 'react';
import type { JSX } from 'react';
import { AuthStatus } from '../domain/types';
import { useAuthState } from '../adapters/hooks/useAuthState';

/**
 * Login form component. Displays username/password fields and error messages.
 */
export function LoginForm(): JSX.Element {
  const { status, error, login } = useAuthState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '20px', color: '#fff' }}>Tetris Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        {error && <div style={{ color: '#f44336', fontSize: '13px' }}>{error}</div>}
        <button
          type="submit"
          disabled={status === AuthStatus.LOADING}
          style={{
            ...buttonStyle,
            opacity: status === AuthStatus.LOADING ? 0.6 : 1,
            cursor: status === AuthStatus.LOADING ? 'not-allowed' : 'pointer'
          }}
        >
          {status === AuthStatus.LOADING ? 'Loading...' : 'Login'}
        </button>
      </form>
      <div style={{ marginTop: '16px', fontSize: '11px', color: '#888' }}>
        Mock: player1 / pass1
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  padding: '30px',
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  width: '280px',
  textAlign: 'center'
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '14px',
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #555',
  borderRadius: '4px'
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold'
};
