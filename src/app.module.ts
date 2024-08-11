import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./config/database.config";
import { loggerConfig } from "./config/logger.config";
import { JobsModule } from "./modules/jobs/jobs.module";
import { SamplesModule } from "./modules/samples/samples.module";
import { ProductAdvocateModule } from "./modules/product_advocate/product_advocate.module";
import { PrescribersModule } from "./modules/prescribers/prescribers.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { DrugModule } from "./modules/drug/drug.module";
import { LicenseModule } from "./modules/license/license.module";
import { WorkExperienceModule } from "./modules/work_experience/work_experience.module";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./all-exceptions.filter";
import { TelePrescribersModule } from "./modules/tele-prescribers/tele-prescribers.module";
import { CallGateway } from "./modules/call/call.gateway";
import { CallLogsModule } from './modules/call_logs/call_logs.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(databaseConfig),
    loggerConfig,
    AuthModule,
    DashboardModule,
    JobsModule,
    SamplesModule,
    PrescribersModule,
    ProductAdvocateModule,
    DrugModule,
    LicenseModule,
    WorkExperienceModule,
    TelePrescribersModule,
    CallLogsModule,
  ],

  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // }
    CallGateway,
  ],
})
export class AppModule {}
