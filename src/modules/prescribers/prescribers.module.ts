import { Module } from "@nestjs/common";
import { PrescribersController } from "./prescribers.controller";
import { PrescribersService } from "./prescribers.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Prescriber } from "src/common/utiles/entity/prescriber.entity";
import { Job } from "src/common/utiles/entity/job.entity";
import { SamplesModule } from "../samples/samples.module";
import { ProductAdvocateModule } from "../product_advocate/product_advocate.module";
import { PrescriberAcademicDetails } from "src/common/utiles/entity/prescribers_details.entity";
import { PrescribersAffiliatedWithHospitals } from "src/common/utiles/entity/prescribers_affiliated_with_hospitals.entity";
import { PrescriberPanelledInsurance } from "src/common/utiles/entity/prescriber_panelled_insurance.entity";
import { PrescriberClinicalTrails } from "src/common/utiles/entity/prescriber_clinical_trails.entity";
import { PrescriberPracticeLocation } from "src/common/utiles/entity/prescriber_practice_location.entity";
import { PrescriberPublications } from "src/common/utiles/entity/prescriber_publications.entity";
import { PAHistory } from "src/common/utiles/entity/history.entity";
import { EmailService } from "src/common/utiles/email/email.service";
import { PrescribersList } from "src/common/utiles/entity/prescriber_list.entity";
import { PrescribersListItem } from "src/common/utiles/entity/prescribers_list_item.entity";
import { Client_Prescriber } from "src/common/utiles/entity/client_prescribers.entity";
import CallLogs from "src/common/utiles/entity/calllogs.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prescriber,
      Job,
      PrescriberAcademicDetails,
      PrescribersAffiliatedWithHospitals,
      PrescriberPanelledInsurance,
      PrescriberClinicalTrails,
      PrescriberPracticeLocation,
      PrescriberPublications,
      PAHistory,
      PrescribersList,
      PrescribersListItem,
      Client_Prescriber,
      CallLogs,
    ]),
    SamplesModule,
    ProductAdvocateModule,
  ],
  exports: [PrescribersService],
  controllers: [PrescribersController],
  providers: [PrescribersService, EmailService],
})
export class PrescribersModule {}
