import type { IAuthApi } from '../../domain/ports/IAuthApi';
import type { User } from '../../domain/types';

const MOCK_USERS = [
  { id: '1', username: 'player1', password: 'pass1' },
  { id: '2', username: 'player2', password: 'pass2' }
];

/**
 * Mock adapter for authentication.
 * Simulates a backend API. Replace with a real HttpAuthApiAdapter later.
 */
export class MockAuthApiAdapter implements IAuthApi {
  async login(username: string, password: string): Promise<User> {
    const found = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );

    if (!found) {
      throw new Error('Invalid username or password');
    }

    return { id: found.id, username: found.username };
  }

  async logout(): Promise<void> {
    // Nothing to clean up in mock mode
  }
}
