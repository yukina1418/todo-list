import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { setUpSwagger } from './commons/swagger/swagger';
import { Database, Resource } from '@admin-bro/typeorm';
import { json } from 'express';
import AdminBro from 'admin-bro';
import * as adminBroExpress from '@admin-bro/express';
import { AppModule } from './app.module';
import { Task } from './apis/task';
import { User } from './apis/user';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  AdminBro.registerAdapter({ Database, Resource });
  const adminBro = new AdminBro({
    resources: [User, Task],
    rootPath: '/admin',
  });

  const router = adminBroExpress.default.buildAuthenticatedRouter(
    adminBro,
    {
      cookieName: 'adminBro',
      cookiePassword: 'session Key',
      authenticate: async (email, password) => {
        return true;
      },
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
    },
  );
  app.use(adminBro.options.rootPath, router);
  app.use(json());
  app.enableCors({ origin: true, credentials: true });

  setUpSwagger(app);
  await app.listen(3000);
}
bootstrap();
