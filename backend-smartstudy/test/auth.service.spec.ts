import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  it('exposes the expected public contract', () => {
    expect(AuthService.prototype.register).toBeDefined();
    expect(AuthService.prototype.login).toBeDefined();
  });
});
