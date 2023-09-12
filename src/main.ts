import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(bodyParser.json({ limit: '10000mb' }));
  app.use(bodyParser.urlencoded({ limit: '9000mb', extended: true }));

  app.use(cookieParser());
  app.use(compression());

  app.enableCors({
    origin: ['https://localhost:4200', 'http://localhost:4200'],
    allowedHeaders: [
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
      'Observe',
      'authorization ',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
