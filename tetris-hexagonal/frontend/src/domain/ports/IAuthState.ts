import type { AuthStatus, User } from '../types';

/**
 * Port defining auth state access for the UI layer.
 * Implemented by an adapter hook in /adapters/hooks/.
 */
export interface IAuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  login(username: string, password: string): void;
  logout(): void;
}
