import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailService } from "src/common/utiles/email/email.service";
import Login from "src/common/utiles/entity/login.entity";
import { TwilioSmsService } from "src/common/utiles/sms/twilioverify.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "src/common/utiles/entity/user.entity";
import { Client } from "src/common/utiles/entity/client.entity";
import { ProductAdvocateModule } from "../product_advocate/product_advocate.module";

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService, TwilioSmsService],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Login, Client]),
    ProductAdvocateModule,
  ],
})
export class UserModule {}
