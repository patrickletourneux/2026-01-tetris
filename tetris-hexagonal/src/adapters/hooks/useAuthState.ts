import { useAppDispatch, useAppSelector } from './hooks';
import type { IAuthState } from '../../domain/ports/IAuthState';
import { loginThunk, logoutThunk } from '../../domain/store/authSlice';

/**
 * Adapter hook implementing IAuthState.
 * Single access point to auth state for UI components.
 */
export const useAuthState = (): IAuthState => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  return {
    user: authState.user,
    status: authState.status,
    error: authState.error,
    login: (username: string, password: string) => {
      dispatch(loginThunk({ username, password }));
    },
    logout: () => {
      dispatch(logoutThunk());
    }
  };
};
