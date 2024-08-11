import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "src/common/utiles/entity/job.entity";
import { Repository } from "typeorm";
import { ProductAdvocateService } from "../product_advocate/product_advocate.service";
import { PrescribersService } from "../prescribers/prescribers.service";
import { Appointment } from "src/common/utiles/entity/appointment.entity";
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private productAdvocateService: ProductAdvocateService,
    private prescriberService: PrescribersService,

    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>
  ) {}

  async fetchJobsData(body: any) {
    const {
      limit,
      page_num,
      status,
      start_date,
      end_date,
      meet_with,
      prescriber,
      product_advocate,
      lunch_meeting,
      radius,
      clientId,
    } = body;
    const lunch_sum = await this.getQuestionL2Sum();
    const record = await this.getAllJobs(
      page_num,
      limit,
      status,
      start_date,
      end_date,
      meet_with,
      prescriber,
      product_advocate,
      lunch_meeting,
      radius,
      clientId
    );
    if (record) {
      const records = await this.getPrescriberAndProductAdvocate(record);

      return {
        statusCode: 200,
        result: { lunch_sum, records },
      };
    } else {
      return null;
    }
  }

  async getPrescriberAndProductAdvocate(records: any) {
    const filteredJobs = [];
    for (let i = 0; i < records.jobs.length; i++) {
      const job = records.jobs[i];
      const productAdvocateJobs =
        await this.productAdvocateService.getProductAdvocate(
          job.Product_Advocate_Id
        );

      const prescribersJobs = await this.prescriberService.getPrescriberData(
        job.Prescriber_Id
      );

      for (let j = 0; j < productAdvocateJobs.length; j++) {
        const productAdvocateJob = productAdvocateJobs[j];
        const prescriberJob = prescribersJobs[j];
        filteredJobs.push({
          ...job,
          product_advocate: productAdvocateJob,
          prescriber: prescriberJob,
        });
      }
    }
    console.log('filteredJobs', filteredJobs);
    records.jobs = filteredJobs;
    return records;
  }

  async getAllJobs(
    page: number,
    perPage: number,
    status: string,
    start_date: Date,
    end_date: Date,
    meet_with: string,
    prescriber: string,
    product_advocate: string,
    lunch_meeting: string,
    radius: string,
    clientId: number
  ) {
    const queryBuilder = this.jobsRepository
      .createQueryBuilder("job")
      .innerJoin("prescriber", "p", "job.Prescriber_Id = p.Id")
      .innerJoin("product_advocate", "pa", "job.Product_Advocate_Id = pa.Id")
      .innerJoin(
        "client_pa",
        "cpa",
        "job.Product_Advocate_Id = cpa.Product_Advocate_Id"
      )
      .orderBy("job.LastModifiedDate", "DESC");

    if (clientId > 1) {
      queryBuilder.andWhere("cpa.Client_Id = :clientId", { clientId });
    }

    if (status) {
      queryBuilder.andWhere("Status = :status", { status });
    }

    if (start_date && end_date) {
      queryBuilder.andWhere(
        "DATE(job.CreatedDate) BETWEEN :start_date AND :end_date",
        {
          start_date,
          end_date,
        }
      );
    }

    if (meet_with) {
      const meet_with_list = meet_with.split(",");
      const filterStrings = meet_with_list.map(
        (mw) => `question_2 LIKE "%${mw}%"`
      );
      const filterString = filterStrings.join(" OR ");

      const parameters = meet_with_list.reduce((acc, mw, index) => {
        acc[`mw${index}`] = `%${mw}%`;
        return acc;
      }, {});

      if (meet_with_list.length > 0) {
        queryBuilder.andWhere(`(${filterString})`, parameters);
      }
    }

    if (lunch_meeting != "null") {
      queryBuilder.andWhere("question_1 = :lunch_meeting", { lunch_meeting });
    }

    if (radius == "within") {
      queryBuilder.andWhere("difference_location_doctor <= '0.1'");
    }
    if (radius == "outside") {
      queryBuilder.andWhere("difference_location_doctor > '0.1'");
    }
    if (prescriber) {
      queryBuilder.andWhere("p.Name LIKE :prescriber", {
        prescriber: `%${prescriber}%`,
      });
    }

    if (product_advocate) {
      queryBuilder.andWhere("pa.Name LIKE :product_advocate", {
        product_advocate: `%${product_advocate}%`,
      });
    }

    if (page && perPage) {
      const [jobs, count] = await queryBuilder
        .skip((page - 1) * perPage)
        .take(perPage)
        .getManyAndCount();
      return { count, jobs };
    } else {
      const [jobs, count] = await queryBuilder.getManyAndCount();
      return { count, jobs };
    }
  }

  async getQuestionL2Sum(): Promise<number> {
    const result = await this.jobsRepository
      .createQueryBuilder("job")
      .select("SUM(job.question_l_2)", "sum")
      .getRawOne();
    return result.sum;
  }

  async getTotalVisitCount(clientId: any) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .innerJoin(
        "client_prescriber",
        "p",
        "job.Prescriber_Id = p.Prescriber_Id"
      )
      .select("job.question_2", "question_2")
      .addSelect("COUNT(job.Id)", "count")
      .groupBy("job.question_2");

    if (clientId > 1) {
      query.andWhere("p.Client_Id = :clientId", {
        clientId,
      });
    }

    const results = await query.getRawMany();
    return results;
  }

  async getTotalVisitCountByProductAdvocae(id: number) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .select("job.question_2", "question_2")
      .addSelect("COUNT(job.Id)", "count")
      .where("job.Product_Advocate_Id = :id ", { id })
      .groupBy("job.question_2");

    const results = await query.getRawMany();
    return results;
  }

  async getVisitedCount(clientId: any) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .innerJoin(
        "client_prescriber",
        "p",
        "job.Prescriber_Id = p.Prescriber_Id"
      )
      .select("COUNT(DISTINCT job.prescriber)", "count");

    if (clientId > 1) {
      query.andWhere("p.Client_Id = :clientId", {
        clientId,
      });
    }

    const visited = await query.getRawOne();
    return visited;
  }

  async getRevisitedCount(clientId: any) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .innerJoin(
        "client_prescriber",
        "p",
        "job.Prescriber_Id = p.Prescriber_Id"
      )
      .select(["COUNT(job.Id)", "prescriber"])
      .groupBy("job.prescriber")
      .having("COUNT(job.Id) > 1");

    if (clientId > 1) {
      query.andWhere("p.Client_Id = :clientId", {
        clientId,
      });
    }

    const results = await query.getRawMany();
    return results.length;
  }

  async getLunchMeetingCount(clientId: any) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .innerJoin(
        "client_prescriber",
        "p",
        "job.Prescriber_Id = p.Prescriber_Id"
      )
      .select("COUNT(job.Id)", "count")
      .where("question_1 = true");

    if (clientId > 1) {
      query.andWhere("p.Client_Id = :clientId", {
        clientId,
      });
    }

    const results = await query.getRawOne();
    return results.count;
  }

  async getBestProductAdvocate(clientId: any) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .innerJoin(
        "client_pa",
        "p",
        "job.Product_Advocate_Id = p.Product_Advocate_Id"
      )
      .select("job.Product_Advocate_Id, COUNT(job.Id)")
      .where(" job.CreatedDate >= DATE_SUB(DATE(NOW()), INTERVAL 1 WEEK)")
      .groupBy("job.Product_Advocate_Id")
      .orderBy("COUNT(job.Id)", "DESC")
      .limit(1);

    if (clientId > 1) {
      query.andWhere("p.Client_Id = :clientId", {
        clientId,
      });
    }
    const result = await query.getRawOne();
    if (result) {
      return {
        product_advocate_id: result.Product_Advocate_Id,
        count: result["COUNT(`job`.`Id`)"],
      };
    } else
      return {
        product_advocate_id: null,
        count: 0,
      };
  }

  async getPrescribersVisitedPerMonth(clientId: any) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const query = this.jobsRepository
      .createQueryBuilder("job")
      .innerJoin(
        "client_prescriber",
        "p",
        "job.Prescriber_Id = p.Prescriber_Id"
      )
      .select(
        "YEAR(feedback_submitted_at) AS year, MONTH(feedback_submitted_at) AS month, COUNT(job.Id) AS totalCount"
      )
      .where(
        "YEAR(feedback_submitted_at) = :year AND MONTH(feedback_submitted_at) >= :startMonth",
        {
          year: currentYear,
          startMonth: currentMonth - 5,
        }
      )
      .groupBy("YEAR(feedback_submitted_at), MONTH(feedback_submitted_at)")
      .orderBy("YEAR(feedback_submitted_at), MONTH(feedback_submitted_at)");

    if (clientId > 1) {
      query.andWhere("p.Client_Id = :clientId", {
        clientId,
      });
    }

    const result = await query.getRawMany();
    return {
      result,
    };
  }

  async cancelJob(body: any): Promise<any> {
    const { job_id } = body;
    const result = await this.jobsRepository
      .createQueryBuilder()
      .update(Job)
      .set({
        Status: "Job cancelled",
        LastModifiedDate: new Date().toISOString(),
      })
      .where("Id = :job_id", { job_id })
      .execute();

    if (result) {
      return { result: result.affected, status: HttpStatus.OK };
    }
  }

  async jobsDoneByProductAdvocate(body: any) {
    const { product_advocate_id } = body;
    const result = await this.getJobsDoneBasedOnProductAdvocate(
      product_advocate_id
    );
    if (result) {
      return { result, status: HttpStatus.OK };
    }
    return { message: "Record Not Found", status: HttpStatus.NOT_FOUND };
  }

  async getJobsDoneBasedOnPrescriberId(id: string) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .where("Prescriber = :id", { id });
    const result = await query.getRawMany();
    return {
      result,
    };
  }

  async getJobsDoneBasedOnProductAdvocateId(id: string) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .where("job.Product_Advocate = :id", { id })
      .andWhere("job.Status != 'Job cancelled'")
      .orderBy("job.Id", "DESC");

    const [result] = await query.getManyAndCount();
    return result;
  }

  async getJobsDoneBasedOnProductAdvocate(key: string) {
    const result = await this.jobsRepository.query(
      "CALL get_product_Advocate_jobs(?)",
      [key]
    );
    return result[0];
  }

  async createJob(body: any) {
    const {
      prescriber_id,
      product_advocate_id,
      distance_to_doctor,
      selected_far_doctor,
    } = body;
    const job = new Job();
    job.CreatedDate = new Date();
    job.LastModifiedDate = new Date();
    job.Prescriber_Id = prescriber_id;
    job.Product_Advocate_Id = product_advocate_id;
    job.Drug_Id = 3;
    job.Distance_To_Doctor = distance_to_doctor;
    job.selected_far_doctor = selected_far_doctor;
    job.Status = "Assigned";

    const prescriber = await this.prescriberService.getPrescriberData(
      prescriber_id
    );

    const createdJob = await this.jobsRepository.save(job);
    const newJob = [{ ...createdJob, prescriber }];
    return { newJob, status: HttpStatus.OK };
  }

  async jobDetails(body: any) {
    const { job_id } = body;
    const jobDetails = await this.getJobDetailsById(job_id);

    const appointment_data = await this.getAppointmentDetailsById(job_id);

    return {
      data: {
        jobDetails,
        appointment_data,
      },
    };
  }

  async jobData(body: any) {
    const { job_id } = body;
    const job = await this.fetchJobData(job_id);
    if (job) {
      return job;
    }
  }

  async fetchJobData(id: number) {
    const jobquery = this.jobsRepository
      .createQueryBuilder("job")
      .innerJoin("prescriber", "p", "job.Prescriber_Id = p.Id")
      .innerJoin("product_advocate", "pa", "job.Product_Advocate_Id = pa.Id")
      .select("job.*")
      .addSelect("p.Name")
      .addSelect("p.Id")
      .addSelect("pa.Name")
      .addSelect("pa.Id")
      .where("job.Id = :id", { id });

    const [job] = await jobquery.getRawMany();
    return job;
  }

  async getJobDetailsById(id: string) {
    const jobquery = this.jobsRepository
      .createQueryBuilder("job")
      .where("SalesforceId = :id", { id });

    const jobDetails = await jobquery.getOne();
    return jobDetails;
  }

  async getJobDetails(id: number) {
    const jobquery = this.jobsRepository
      .createQueryBuilder("job")
      .where("Id = :id", { id });

    const jobDetails = await jobquery.getOne();
    return jobDetails;
  }

  async getAppointmentDetailsById(id: number) {
    const jobquery = this.appointmentRepository
      .createQueryBuilder("appointment")
      .where("Id = :id", { id });

    const appointment = await jobquery.getOne();
    return appointment;
  }

  async getAppointmentDetailsByJobId(id: number) {
    const jobquery = this.jobsRepository
      .createQueryBuilder("job")
      .where("Id = :id", { id });

    const jobDetails = await jobquery.getRawMany();
    return jobDetails;
  }

  async reportProblem(body: any) {
    const { job_id, current_stage, issue } = body;
    const problemQuery = this.jobsRepository
      .createQueryBuilder("job")
      .select("job.Id")
      .where("job.Id = :job_id", { job_id })
      .andWhere("job.Status = :current_stage", { current_stage });

    const jobObject = await problemQuery.getOne();

    if (jobObject) {
      jobObject.Problem_Occurred = issue;
      return this.jobsRepository.save(jobObject);
    } else {
      return { error: "NO_RECORD_FOUND" };
    }
  }

  async updateJobFeedback(body: any) {
    const { email, job_id } = body;
    if (!email) {
      const today = new Date();
      const date_details = {
        appointment_date: today.toISOString().split("T")[0],
        appointment_time: today.toTimeString().split(" ")[0],
      };
      const job = await this.getJobDetailsById(job_id);
      return job;
    } else {
    }
  }

  async getPrescriberJobs(body: any) {
    const { prescriber_id } = body;
    const jobFeedbackQuery = this.jobsRepository
      .createQueryBuilder("job")
      .where("job.Prescriber_Id = :prescriber_id", { prescriber_id });
    const jobs = await jobFeedbackQuery.getMany();

    if (jobs) {
      return { jobs, status: 200 };
    } else {
      return { message: "NO_RECORD_FOUND", status: 404 };
    }
  }

  async getJobFeedback(body: any) {
    const { job_id } = body;
    const jobFeedbackQuery = this.jobsRepository
      .createQueryBuilder("job")
      .where("job.Id = :job_id", { job_id });
    const jobObject = await jobFeedbackQuery.getOne();

    if (jobObject) {
      return jobObject;
    } else {
      return { error: "NO_RECORD_FOUND" };
    }
  }

  async submitFeedback(updateDetails: any): Promise<any> {
    const {
      prescriber_latitude,
      prescriber_longitude,
      latitude,
      longitude,
      submittedDate,
      question_1,
      question_2,
      question_3,
      question_4,
      question_5,
      question_6,
      question_7,
      question_7A,
      question_8,
      question_9,
      question_10,
      question_11,
      question_12,
      question_12A,
      question_12B,
      question_12C,
      question_13,
      question_13A,
      question_14,
      question_l_0,
      question_l_1A,
      question_l_1B,
      question_l_1C,
      question_l_1D,
      question_l_2,
      question_l_4,
      job_id,
    } = updateDetails;
    const job = await this.getJobDetails(job_id);

    const distance = this.getDistanceBetweenTwoCoordinates(
      prescriber_latitude,
      prescriber_longitude,
      latitude,
      longitude
    );
    if (job) {
      job.Status = "Feedback completed";
      job.Location__Latitude = latitude;
      job.Location__Longitude = longitude;
      job.feedback_submitted_at = submittedDate;
      job.difference_location_doctor = distance;
      job.question_1 = question_1;
      job.question_2 = question_2 || "Front Desk Staff";
      job.question_3 = question_3;
      job.question_4 = question_4;
      job.question_5 = question_5;
      job.question_6 = question_6;
      job.question_7 = question_7;
      job.question_7A = question_7A;
      job.question_8 = question_8;
      job.question_9 = question_9;
      job.question_10 = question_10;
      job.question_11 = question_11;
      job.question_12 = question_12;
      job.question_12A = question_12A;
      job.question_12B = question_12B;
      job.question_12C = question_12C;
      job.question_13 = question_13;
      job.question_13A = question_13A;
      job.question_14 = question_14;
      job.question_l_0 = question_l_0;
      job.question_l_1A = question_l_1A;
      job.question_l_1B = question_l_1B;
      job.question_l_1C = question_l_1C;
      job.question_l_1D = question_l_1D;
      job.question_l_2 = question_l_2;
      job.question_l_4 = question_l_4;
      job.LastModifiedDate = new Date();

      const updatePrescriberVisitCount =
        await this.prescriberService.updatePrescriberVisitCount(
          job.Prescriber_Id
        );

      const update = await this.jobsRepository.save(job);
      if (update) {
        return { message: "updated", status: HttpStatus.OK };
      }
    } else {
      return {
        message: "NO_RECORD_FOUND",
        status: HttpStatus.NOT_FOUND,
      };
    }
  }
  getDistanceBetweenTwoCoordinates(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) {
    try {
      const R = 6371.0;

      const latRad1 = this.toRadians(lat1);
      const lngRad1 = this.toRadians(lng1);
      const latRad2 = this.toRadians(lat2);
      const lngRad2 = this.toRadians(lng2);

      const dLng = lngRad2 - lngRad1;
      const dLat = latRad2 - latRad1;

      const a =
        Math.pow(Math.sin(dLat / 2), 2) +
        Math.cos(latRad1) * Math.cos(latRad2) * Math.pow(Math.sin(dLng / 2), 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c * 0.621371;
      return distance.toFixed(3).toString();
    } catch (e) {
      return "unknown";
    }
  }

  toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  async updateTimeSpent(body: any): Promise<any> {
    const { job_id, time_spent_at_doc } = body;
    const result = await this.jobsRepository
      .createQueryBuilder()
      .update(Job)
      .set({
        Time_Spent_At_Job: time_spent_at_doc,
        LastModifiedDate: new Date().toISOString(),
      })
      .where("Id = :job_id", { job_id })
      .execute();

    if (result) {
      return { result: result.affected, status: HttpStatus.OK };
    }
  }
}
