import * as _ from 'lodash';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUIRED_ROLES, Roles } from '../decorators/role.decorator';

@Injectable()
export class CheckUserRoles implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<Roles[]>(
      REQUIRED_ROLES,
      context.getHandler(),
    );

    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    // const { value } = user.roles.find(
    //   ({ key }) => key === App[this.configService.get<string>('APP_CONTEXT')],
    // );
    const value = user.roles;

    const hasRoles = () =>
      value
        .map((v) => requiredRoles.some((r) => _.isEqual(v, r)))
        .some((truthy) => truthy);

    return user && hasRoles();
  }
}
