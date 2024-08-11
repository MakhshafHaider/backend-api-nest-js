import { Module } from "@nestjs/common";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./jobs.service";
import { Job } from "src/common/utiles/entity/job.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductAdvocateModule } from "../product_advocate/product_advocate.module";
import { PrescribersModule } from "../prescribers/prescribers.module";
import { Appointment } from "src/common/utiles/entity/appointment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Appointment]),
    ProductAdvocateModule,
    PrescribersModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
