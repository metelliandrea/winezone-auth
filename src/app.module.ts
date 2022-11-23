import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { v4 } from 'uuid';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './config/database/database.config';
import { UsersModule } from './users/users.module';
import { JwtGuard } from './guards/jwt.guard';
// import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          name: 'winezone-products',
          level: config.get<string>('LOGGER_LEVEL'),
          redact: ['req.headers.authorization'],
          genReqId: (req, res) => {
            if (req.id) return req.id;

            const id = req.headers['x-correlation-id'];
            if (id) return id;

            const corrId = v4();
            res.setHeader('X-Correlation-Id', corrId);
            return corrId;
          },
          transport:
            config.get<string>('NODE_ENV') === 'development'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: true,
                  },
                }
              : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useClass: JwtGuard }],
})
export class AppModule {}
