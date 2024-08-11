import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import Platform from "src/common/utiles/entity/platform.entity";
import { User } from "src/common/utiles/entity/user.entity";
import { Roles } from "src/common/utiles/entity/roles.entity";
import Login from "src/common/utiles/entity/login.entity";
import { Appointment } from "src/common/utiles/entity/appointment.entity";
import { Client } from "src/common/utiles/entity/client.entity";
import { Drug } from "src/common/utiles/entity/drug.entity";
import { Job } from "src/common/utiles/entity/job.entity";
import { License } from "src/common/utiles/entity/license.entity";
import { PrescriberAcademicDetails } from "src/common/utiles/entity/prescribers_details.entity";
import { Prescriber } from "src/common/utiles/entity/prescriber.entity";
import { PrescriberPracticeLocation } from "src/common/utiles/entity/prescriber_practice_location.entity";
import { PrescribersAffiliatedWithHospitals } from "src/common/utiles/entity/prescribers_affiliated_with_hospitals.entity";
import { ProductAdvocate } from "src/common/utiles/entity/product_advocate.entity";
import { Sample } from "src/common/utiles/entity/sample.entity";
import { WorkExperience } from "src/common/utiles/entity/work_experience.entity";
import { PrescriberPanelledInsurance } from "src/common/utiles/entity/prescriber_panelled_insurance.entity";
import { PrescriberClinicalTrails } from "src/common/utiles/entity/prescriber_clinical_trails.entity";
import { PrescriberPublications } from "src/common/utiles/entity/prescriber_publications.entity";
import { PAHistory } from "src/common/utiles/entity/history.entity";
import { Client_PA } from "src/common/utiles/entity/client_pa.entity";
import { Client_Prescriber } from "src/common/utiles/entity/client_prescribers.entity";
import { PrescribersList } from "src/common/utiles/entity/prescriber_list.entity";
import { PrescribersListItem } from "src/common/utiles/entity/prescribers_list_item.entity";
import { CallLogs } from "src/common/utiles/entity/calllogs.entity";
import { TelePrescribers } from "src/common/utiles/entity/tele_prescreibers.entity";
import { FaxLogs } from "src/common/utiles/entity/faxlogs.entity";
dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

export const databaseConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  connectTimeout: 60000,
  entities: [
    User,
    Roles,
    Platform,
    Login,
    Appointment,
    Client,
    Drug,
    Job,
    License,
    PrescriberAcademicDetails,
    Prescriber,
    PrescriberPracticeLocation,
    PrescribersAffiliatedWithHospitals,
    ProductAdvocate,
    Sample,
    WorkExperience,
    PrescriberPanelledInsurance,
    PrescriberClinicalTrails,
    PrescriberPublications,
    PAHistory,
    Client_PA,
    Client_Prescriber,
    PrescribersList,
    PrescribersListItem,
    CallLogs,
    FaxLogs,
    TelePrescribers,
  ],
  logging: false,
  synchronize: true,
};
