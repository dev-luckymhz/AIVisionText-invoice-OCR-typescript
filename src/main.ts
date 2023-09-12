import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import fs from 'fs';
import path from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const ssl = process.env.SSL === 'true';
  let httpsOptions = null;
  if (ssl) {
    const keyPath = process.env.SSL_KEY_PATH || '';
    const certPath = process.env.SSL_CERT_PATH || '';
    httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, keyPath)),
      cert: fs.readFileSync(path.join(__dirname, certPath)),
    };
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });

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

  const options = new DocumentBuilder()
    .setTitle('PRM- AIVisionText')
    .setDescription('The PRM API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const hostname = process.env.HOSTNAME || 'localhost';
  const port = Number(process.env.PORT) || 3000;

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port, hostname, () => {
    const address =
      'http' + (ssl ? 's' : '') + '://' + hostname + ':' + port + '/';
    Logger.log('Listening at ' + address);
  });
}
bootstrap();
