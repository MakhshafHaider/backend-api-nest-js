import { Module } from "@nestjs/common";
import { LicenseController } from "./license.controller";
import { LicenseService } from "./license.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { License } from "src/common/utiles/entity/license.entity";

@Module({
  imports: [TypeOrmModule.forFeature([License])],
  controllers: [LicenseController],
  providers: [LicenseService],
})
export class LicenseModule {}
