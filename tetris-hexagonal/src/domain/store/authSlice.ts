import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthStatus } from '../types';
import type { AuthState } from '../types';
import type { IAuthApi } from '../ports/IAuthApi';

let authApi: IAuthApi;

/**
 * Injects the auth API adapter. Called once at bootstrap.
 */
export function setAuthApi(api: IAuthApi): void {
  authApi = api;
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    return authApi.login(username, password);
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    await authApi.logout();
  }
);

const initialState: AuthState = {
  user: null,
  status: AuthStatus.IDLE,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = AuthStatus.AUTHENTICATED;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = AuthStatus.ERROR;
        state.error = action.error.message ?? 'Login failed';
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.status = AuthStatus.IDLE;
        state.error = null;
      });
  }
});

export default authSlice.reducer;
