export enum AuthStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  ERROR = 'ERROR'
}

export interface User {
  id: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}
