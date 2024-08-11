import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { PrescribersService } from "./prescribers.service";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const { SECRET_KEY } = process.env;

@Controller("prescriber")
export class PrescribersController {
  constructor(private prescribersService: PrescribersService) {}

  @Post("fetch_prescribers")
  FetchPrescribersData(@Body() body: any) {
    return this.prescribersService.fetchPrescribersData(body);
  }

  @Post("fetch_training_prescribers")
  FetchTrainingPrescribers(@Body() body: any) {
    return this.prescribersService.fetchTraingPrescribersData(body);
  }

  @Post("fetch_prescriber_details")
  FetchPrescriberData(@Body() body: any) {
    return this.prescribersService.fetchPrescriberData(body);
  }

  @Post("update_prescriber")
  UpdatePrescriber(@Body() body: any) {
    return this.prescribersService.updatePrescriber(body);
  }

  @Post("get_prescriber_flagged_address")
  getFlaggedAddress(@Body() body: any) {
    return this.prescribersService.getPrescribersFlaggedAddresses(body);
  }

  @Post("get_all_prescribers_name")
  GetProductadvocateName(@Body() body: any) {
    return this.prescribersService.getPrescriberName(body);
  }

  @Post("create_prescribers_list")
  @HttpCode(201)
  Create(@Body() body: any) {
    return this.prescribersService.createPrescribersList(body);
  }

  @Post("create_training_prescribers")
  @HttpCode(201)
  CreateTrainingPrescribers(@Body() body: any) {
    return this.prescribersService.createTrainingPrescriber(body);
  }

  @Post("delete_prescriber")
  @HttpCode(201)
  DeletePrescribers(@Body() body: any) {
    return this.prescribersService.deletePrescriber(body);
  }

  @Post("get_prescribers_list")
  @HttpCode(200)
  Read(@Body() body: any) {
    return this.prescribersService.getPrescribersList(body);
  }

  @Get("get_prescribers_list_name")
  @HttpCode(200)
  GetName() {
    return this.prescribersService.getPrescribersListName();
  }

  @Post("delete_prescribers_list")
  @HttpCode(200)
  Delete(@Body() body: any) {
    return this.prescribersService.deletePrescribersList(body);
  }

  // Mobile Apis
  @Post("new_jobs")
  @HttpCode(200)
  GetPrescribers(@Req() request: any, @Body() body: any) {
    const token = request.headers["auth-token"];
    if (token) {
      try {
        let decoded: any = jwt.verify(token, SECRET_KEY);
        return this.prescribersService.getAll(body, decoded.id);
      } catch (error) {
        console.error("Failed to decode JWT", error);
        return this.prescribersService.getAll(body);
      }
    } else {
      // to be removed later on
    }
  }

  @Post("pa_job")
  @HttpCode(200)
  PrescriberJobs(@Body() body: any) {
    return this.prescribersService.getPrescriber(body);
  }

  @Post("prescriber_associated_data")
  @HttpCode(200)
  PrescriberAssociatedData(@Body() body: any) {
    return this.prescribersService.prescriberAssociatedData(body);
  }

  @Post("get_prescriber_feedback")
  GetPrescriberFeedback(@Body() body: any) {
    return this.prescribersService.getPrescriberFeedback(body);
  }

  @Post("email_current_jobs")
  @HttpCode(200)
  EmailCurrentJob(@Body() body: any) {
    return this.prescribersService.emailCurrentPrescriber(body);
  }

  @Post("update_prescriber_flagged_address")
  @HttpCode(200)
  UpdateFlaggedAddress(@Body() body: any) {
    return this.prescribersService.updateFlaggedAddresses(body);
  }

  // to be changed from mobile side to this api
  @Post("update_prescriber_flag_address")
  @HttpCode(200)
  UpdateFlagAddress(@Body() body: any) {
    return this.prescribersService.updateFlaggedAddress(body);
  }
}
