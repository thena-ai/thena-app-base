import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Use Pino Logger
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle("NestJS Backend Scaffold")
    .setDescription("API Documentation for NestJS Backend Scaffold")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Enable CORS
  app.enableCors();

  // Graceful shutdown
  const signals = ["SIGTERM", "SIGINT"];

  for (const signal of signals) {
    process.on(signal, async () => {
      logger.log(`Received ${signal} signal. Starting graceful shutdown...`);

      try {
        await app.close();
        logger.log("Application successfully closed");
        process.exit(0);
      } catch (error) {
        logger.error("Error during application shutdown", error);
        process.exit(1);
      }
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on port: ${port}`);
  logger.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}

bootstrap();
