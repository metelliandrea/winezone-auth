import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {
  constructor(
    private readonly authService: AuthService, // private readonly config: ConfigService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException(
        'You are not allowed to access the resource',
      );
    }

    return user;
  }
}
