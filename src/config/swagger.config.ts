import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Samodrei APIs")
  .setDescription("The Samodrei API description")
  .setVersion("1.0")
  .addTag("Samodrei")
  .build();
