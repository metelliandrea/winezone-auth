import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UNPROTECTED } from '../decorators/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const ip = context.switchToHttp().getRequest().socket.remoteAddress;

    const unprotected: boolean = this.reflector.get<boolean>(
      UNPROTECTED,
      context.getHandler(),
    );

    if (unprotected) return true;
    return super.canActivate(context);
  }
}
