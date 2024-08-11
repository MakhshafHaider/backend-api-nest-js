import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { swaggerConfig } from "./config/swagger.config";
import { SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";

dotenv.config();

const { SERVER_PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true,
  logger: ['error', 'warn'] });

  app.enableCors();
  
  //swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  //Pine Logger
  app.useLogger(app.get(Logger));

  //helmet
  app.use(helmet());

  //Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  await app.listen(SERVER_PORT);
}
bootstrap();
