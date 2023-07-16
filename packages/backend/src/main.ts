import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeWorkDir } from './utils/initialize';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await initializeWorkDir();

  await app.listen(3000);
}
bootstrap();
