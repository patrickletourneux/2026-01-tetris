import { configureStore } from '@reduxjs/toolkit';
import reducer, { setAuthApi, loginThunk, logoutThunk } from './authSlice';
import { AuthStatus } from '../types';
import type { IAuthApi } from '../ports/IAuthApi';
import type { User } from '../types';

const mockUser: User = { id: '1', username: 'player1' };

function createMockAuthApi(overrides: Partial<IAuthApi> = {}): IAuthApi {
  return {
    login: jest.fn().mockResolvedValue(mockUser),
    logout: jest.fn().mockResolvedValue(undefined),
    ...overrides
  };
}

function createTestStore() {
  return configureStore({ reducer: { auth: reducer } });
}

describe('authSlice initial state', () => {
  it('should have IDLE status with no user', () => {
    const state = reducer(undefined, { type: '@@INIT' });

    expect(state.user).toBeNull();
    expect(state.status).toBe(AuthStatus.IDLE);
    expect(state.error).toBeNull();
  });
});

describe('loginThunk', () => {
  it('should set LOADING status while pending', () => {
    const state = reducer(undefined, loginThunk.pending('', { username: '', password: '' }));

    expect(state.status).toBe(AuthStatus.LOADING);
    expect(state.error).toBeNull();
  });

  it('should set AUTHENTICATED status and user on success', () => {
    const state = reducer(
      undefined,
      loginThunk.fulfilled(mockUser, '', { username: 'player1', password: 'pass1' })
    );

    expect(state.status).toBe(AuthStatus.AUTHENTICATED);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  it('should set ERROR status and error message on failure', () => {
    const state = reducer(
      undefined,
      loginThunk.rejected(new Error('Invalid username or password'), '', { username: 'x', password: 'y' })
    );

    expect(state.status).toBe(AuthStatus.ERROR);
    expect(state.error).toBe('Invalid username or password');
    expect(state.user).toBeNull();
  });

  it('should clear previous error when retrying login', () => {
    const errorState = reducer(
      undefined,
      loginThunk.rejected(new Error('fail'), '', { username: '', password: '' })
    );
    const retrying = reducer(errorState, loginThunk.pending('', { username: '', password: '' }));

    expect(retrying.status).toBe(AuthStatus.LOADING);
    expect(retrying.error).toBeNull();
  });

  it('should use default error message when error has no message', () => {
    const state = reducer(
      undefined,
      loginThunk.rejected(
        { name: 'Error', message: '' } as Error,
        '',
        { username: '', password: '' }
      )
    );

    expect(state.status).toBe(AuthStatus.ERROR);
  });
});

describe('logoutThunk', () => {
  it('should reset to IDLE with no user on logout', () => {
    const authenticated = reducer(
      undefined,
      loginThunk.fulfilled(mockUser, '', { username: 'player1', password: 'pass1' })
    );

    expect(authenticated.status).toBe(AuthStatus.AUTHENTICATED);

    const state = reducer(authenticated, logoutThunk.fulfilled(undefined, ''));

    expect(state.user).toBeNull();
    expect(state.status).toBe(AuthStatus.IDLE);
    expect(state.error).toBeNull();
  });
});

describe('loginThunk integration with mock API', () => {
  it('should dispatch fulfilled when login succeeds', async () => {
    const mockApi = createMockAuthApi();
    setAuthApi(mockApi);
    const store = createTestStore();

    await store.dispatch(loginThunk({ username: 'player1', password: 'pass1' }));

    const state = store.getState().auth;
    expect(state.status).toBe(AuthStatus.AUTHENTICATED);
    expect(state.user).toEqual(mockUser);
    expect(mockApi.login).toHaveBeenCalledWith('player1', 'pass1');
  });

  it('should dispatch rejected when login fails', async () => {
    const mockApi = createMockAuthApi({
      login: jest.fn().mockRejectedValue(new Error('Invalid username or password'))
    });
    setAuthApi(mockApi);
    const store = createTestStore();

    await store.dispatch(loginThunk({ username: 'wrong', password: 'wrong' }));

    const state = store.getState().auth;
    expect(state.status).toBe(AuthStatus.ERROR);
    expect(state.error).toBe('Invalid username or password');
    expect(state.user).toBeNull();
  });

  it('should dispatch fulfilled when logout succeeds', async () => {
    const mockApi = createMockAuthApi();
    setAuthApi(mockApi);
    const store = createTestStore();

    await store.dispatch(loginThunk({ username: 'player1', password: 'pass1' }));
    await store.dispatch(logoutThunk());

    const state = store.getState().auth;
    expect(state.status).toBe(AuthStatus.IDLE);
    expect(state.user).toBeNull();
    expect(mockApi.logout).toHaveBeenCalled();
  });
});
