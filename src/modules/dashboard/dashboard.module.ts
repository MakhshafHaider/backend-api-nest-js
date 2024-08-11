import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Job } from "src/common/utiles/entity/job.entity";
import { Prescriber } from "src/common/utiles/entity/prescriber.entity";
import { ProductAdvocate } from "src/common/utiles/entity/product_advocate.entity";
import { Sample } from "src/common/utiles/entity/sample.entity";
import { JobsModule } from "../jobs/jobs.module";
import { ProductAdvocateModule } from "../product_advocate/product_advocate.module";
import { SamplesModule } from "../samples/samples.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Prescriber, ProductAdvocate, Sample]),
    JobsModule,
    ProductAdvocateModule,
    SamplesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
