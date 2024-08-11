import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "src/common/utiles/entity/job.entity";
import { Prescriber } from "src/common/utiles/entity/prescriber.entity";
import { ProductAdvocate } from "src/common/utiles/entity/product_advocate.entity";
import { Sample } from "src/common/utiles/entity/sample.entity";
import { Repository } from "typeorm";
import { JobsService } from "../jobs/jobs.service";
import { ProductAdvocateService } from "../product_advocate/product_advocate.service";
import { SamplesService } from "../samples/samples.service";

@Injectable()
export class DashboardService {
  constructor(
    private jobsService: JobsService,
    private productAdvocateService: ProductAdvocateService,
    private sampleService: SamplesService
  ) {}

  async fetchDashboardData(body: any) {
    const { clientId } = body;
    const totalVisits = await this.jobsService.getTotalVisitCount(clientId);
    const visited = await this.jobsService.getVisitedCount(clientId);
    const revisited = await this.jobsService.getRevisitedCount(clientId);
    const lunch_meetings = await this.jobsService.getLunchMeetingCount(
      clientId
    );
    const best = await this.jobsService.getBestProductAdvocate(clientId);
    var productAdvocate = [];
    if (best.product_advocate_id !== null) {
      productAdvocate = await this.productAdvocateService.getProductAdvocate(
        best.product_advocate_id
      );
    }
    const mG60Count = await this.sampleService.getMG60Count(clientId);
    const mG20Count = await this.sampleService.getMG20Count(clientId);
    const prescribersVisitedPerMonth =
      await this.jobsService.getPrescribersVisitedPerMonth(clientId);

    return {
      totalVisits,
      visited,
      revisited,
      lunch_meetings,
      bestProductAdvocate: {
        productAdvocate: productAdvocate || [],
        count: best.count,
      },
      samplesDistributed: mG20Count + mG60Count,
      prescribersVisitedPerMonth,
    };
  }
}
