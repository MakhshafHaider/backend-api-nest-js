import { Module } from "@nestjs/common";
import { DrugService } from "./drug.service";
import { DrugController } from "./drug.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Drug } from "src/common/utiles/entity/drug.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Drug])],
  controllers: [DrugController],
  providers: [DrugService],
})
export class DrugModule {}
