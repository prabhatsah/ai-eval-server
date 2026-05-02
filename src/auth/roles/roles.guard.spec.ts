import { RolesGuard } from './roles.guard';
import { ExecutionContext } from '@nestjs/common';
import 'reflect-metadata';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    guard = new RolesGuard();
  });

  it('should allow matching role', () => {
    const handler = () => {};

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'MANAGER' },
        }),
      }),
      getHandler: () => handler,
    } as unknown as ExecutionContext;

    Reflect.defineMetadata('roles', ['MANAGER'], context.getHandler());

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny non-matching role', () => {
    const handler = () => {};

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'EMPLOYEE' },
        }),
      }),
      getHandler: () => handler,
    } as unknown as ExecutionContext;

    Reflect.defineMetadata('roles', ['MANAGER'], context.getHandler());

    expect(() => guard.canActivate(context)).toThrow();
  });
});
