import { Module } from "@nestjs/common";
import { CallLogsController } from "./call_logs.controller";
import { CallLogsService } from "./call_logs.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import CallLogs from "src/common/utiles/entity/calllogs.entity";
import { FaxLogs } from "src/common/utiles/entity/faxlogs.entity";
@Module({
  imports: [TypeOrmModule.forFeature([CallLogs, FaxLogs])],
  controllers: [CallLogsController],
  providers: [CallLogsService],
})
export class CallLogsModule {}
