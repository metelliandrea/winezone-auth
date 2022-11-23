import { AppModule } from './app.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { Logger } from 'nestjs-pino';
import { HttpExceptionsFilter } from './filters/httpException.filter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') || 3000;

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(
    new HttpExceptionsFilter(app.get(HttpAdapterHost), config),
  );

  // app.connectMicroservice<MicroserviceOptions>(
  //   {
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: [
  //         {
  //           protocol: 'amqp',
  //           hostname: config.get<string>('RABBITMQ_HOSTNAME') || 'localhost',
  //           port: config.get<number>('RABBITMQ_PORT') || 5672,
  //           username: config.get<string>('RABBITMQ_USERNAME') || 'root',
  //           password: config.get<string>('RABBITMQ_PASSWORD') || 'root',
  //           vhost: '/',
  //         },
  //       ],
  //       prefetchCount: 1,
  //       queue: config.get<string>('RABBITMQ_CART_QUEUE_NAME') || 'cart_queue',
  //       queueOptions: { durable: true },
  //     },
  //   },
  //   { inheritAppConfig: true },
  // );

  app.disable('x-powered-by');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  // await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
