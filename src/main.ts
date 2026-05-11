import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('AI Evaluation API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Save JSON
  writeFileSync(
    join(process.cwd(), 'api.json'),
    JSON.stringify(document, null, 2),
  );

  SwaggerModule.setup('api-docs', app, document); // http://localhost:8080/api

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 8080;

  await app.listen(port, '0.0.0.0');

  console.log(`Server running on port ${port}`);
}
bootstrap();
