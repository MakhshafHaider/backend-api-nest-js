import { Module } from "@nestjs/common";
import { TelePrescribersController } from "./tele-prescribers.controller";
import { TelePrescribersService } from "./tele-prescribers.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import CallLogs from "src/common/utiles/entity/calllogs.entity";
import { TelePrescribers } from "src/common/utiles/entity/tele_prescreibers.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TelePrescribers, CallLogs])],
  controllers: [TelePrescribersController],
  providers: [TelePrescribersService],
})
export class TelePrescribersModule {}
