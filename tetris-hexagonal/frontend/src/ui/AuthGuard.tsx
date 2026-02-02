import type { JSX, ReactNode } from 'react';
import { AuthStatus } from '../domain/types';
import { useAuthState } from '../adapters/hooks/useAuthState';
import { LoginForm } from './LoginForm';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Conditional wrapper: shows the game if authenticated, login form otherwise.
 */
export function AuthGuard({ children }: AuthGuardProps): JSX.Element {
  const { status } = useAuthState();

  if (status !== AuthStatus.AUTHENTICATED) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a'
      }}>
        <LoginForm />
      </div>
    );
  }

  return <>{children}</>;
}
