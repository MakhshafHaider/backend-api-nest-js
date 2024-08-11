import { Module } from "@nestjs/common";
import { WorkExperienceController } from "./work_experience.controller";
import { WorkExperienceService } from "./work_experience.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkExperience } from "src/common/utiles/entity/work_experience.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperience])],
  controllers: [WorkExperienceController],
  providers: [WorkExperienceService],
})
export class WorkExperienceModule {}
