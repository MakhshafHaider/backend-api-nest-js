import { Module } from "@nestjs/common";
import { SamplesController } from "./samples.controller";
import { SamplesService } from "./samples.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sample } from "src/common/utiles/entity/sample.entity";
import { ProductAdvocate } from "src/common/utiles/entity/product_advocate.entity";
import { Prescriber } from "src/common/utiles/entity/prescriber.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Sample, ProductAdvocate, Prescriber])],
  controllers: [SamplesController],
  providers: [SamplesService],
  exports: [SamplesService],
})
export class SamplesModule {}
