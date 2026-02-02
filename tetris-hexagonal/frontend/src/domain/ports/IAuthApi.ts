import type { User } from '../types';

/**
 * Port defining authentication API operations.
 * Implemented by a mock adapter now, replaced by a real backend later.
 */
export interface IAuthApi {
  login(username: string, password: string): Promise<User>;
  logout(): Promise<void>;
}
