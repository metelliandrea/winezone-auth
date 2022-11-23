import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
// import { RedisService } from 'nestjs-redis';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // private readonly redisService: RedisService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    const token = jwt.sign(
      _.pick(user, ['guid', 'firstname', 'lastname', 'role', 'isPremiumUser']),
      this.configService.get<string>('JWT_SHARED_SECRET'),
      {
        expiresIn: this.configService.get<string>('JWT_EXP_TIME'),
      },
    );

    return {
      user: _.pick(user, ['firstname', 'lastname', 'role', 'isPremiumUser']),
      access_token: token,
    };
  }
}
