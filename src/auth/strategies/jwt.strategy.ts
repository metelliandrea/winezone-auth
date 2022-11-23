import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SHARED_SECRET'),
    });
  }

  // If valid JWT has been provided you can find the decoded payload
  validate(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...rest } = payload;

    // Passport will set the req.user with the returned object
    return rest;
  }
}
