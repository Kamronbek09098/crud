import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from './config';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';

export class App {
  static async main() {
    const app = await NestFactory.create(AppModule);
    const PORT = env.PORT;
    const url = '/api/v1';

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.useGlobalFilters(new AllExceptionsFilter());

    app.use(helmet());

    app.use(cookieParser());

    app.enableCors({ origin: '*' });

    app.setGlobalPrefix(url);

    const config = new DocumentBuilder()
      .setTitle('N29 marketplace demo project')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${url}/docs`, app, documentFactory);

    await app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`),
    );
  }
}
