import { Module } from "@nestjs/common";
import { ProductAdvocateController } from "./product_advocate.controller";
import { ProductAdvocateService } from "./product_advocate.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductAdvocate } from "src/common/utiles/entity/product_advocate.entity";
import { Job } from "src/common/utiles/entity/job.entity";
import { SamplesModule } from "../samples/samples.module";
import { Client_PA } from "src/common/utiles/entity/client_pa.entity";
import { PrescribersList } from "src/common/utiles/entity/prescriber_list.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductAdvocate,
      Job,
      Client_PA,
      PrescribersList,
    ]),
    SamplesModule,
  ],
  exports: [ProductAdvocateService],
  controllers: [ProductAdvocateController],
  providers: [ProductAdvocateService],
})
export class ProductAdvocateModule {}
