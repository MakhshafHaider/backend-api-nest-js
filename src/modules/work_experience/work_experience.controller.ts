import { Body, Controller, Post } from "@nestjs/common";
import { WorkExperienceService } from "./work_experience.service";

@Controller("work-experience")
export class WorkExperienceController {
  constructor(private workexpService: WorkExperienceService) {}

  @Post("add_work_experience")
  AddLicense(@Body() body: any) {
    return this.workexpService.addWorkExperience(body);
  }

  @Post("get_work_experience")
  GetLicense(@Body() body: any) {
    return this.workexpService.getWorkExperience(body);
  }

  @Post("update_work_experience")
  UpdateLicense(@Body() body: any) {
    return this.workexpService.updateWorkExperience(body);
  }

  @Post("delete_work_experience")
  DeleteLicense(@Body() body: any) {
    return this.workexpService.deleteWorkExperience(body);
  }
}
