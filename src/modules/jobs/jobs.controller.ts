import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { JobsService } from "./jobs.service";

@Controller("jobs")
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post("fetch_jobs")
  FetchJobsData(@Body() body: any) {
    return this.jobsService.fetchJobsData(body);
  }

  @Post("job_details")
  JobDetails(@Body() body: any) {
    return this.jobsService.jobDetails(body);
  }

  @Post("get_job")
  GetJob(@Body() body: any) {
    return this.jobsService.jobData(body);
  }

  @Post("job_report_prob")
  JobFeedback(@Body() body: any) {
    return this.jobsService.reportProblem(body);
  }

  @Post("update_job_feedback")
  UpdateJobFeedback(@Body() body: any) {
    return this.jobsService.getJobFeedback(body);
  }

  @Post("get_job_feedback")
  GetJobFeedback(@Body() body: any) {
    return this.jobsService.updateJobFeedback(body);
  }

  @Post("prescriber_associated_jobs")
  @HttpCode(200)
  GetPrescriberJobs(@Body() body: any) {
    return this.jobsService.getPrescriberJobs(body);
  }

  //Mobile API
  @Post("all_jobs")
  @HttpCode(200)
  JobsDoneByProductAdvocateCopy(@Body() body: any) {
    return this.jobsService.jobsDoneByProductAdvocate(body);
  }

  @Post("update_time_spent_at_doc")
  @HttpCode(200)
  UpdateTimeSpent(@Body() body: any) {
    return this.jobsService.updateTimeSpent(body);
  }

  @Post("cancel_job")
  @HttpCode(200)
  CancelJobsData(@Body() body: any) {
    return this.jobsService.cancelJob(body);
  }

  @Post("job_create")
  @HttpCode(200)
  CreateJob(@Body() body: any) {
    return this.jobsService.createJob(body);
  }

  @Post("submit_feedback")
  @HttpCode(200)
  SubmitFeedback(@Body() body: any) {
    return this.jobsService.submitFeedback(body);
  }
}
