import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { TelePrescribersService } from "./tele-prescribers.service";

@Controller("tele-prescribers")
export class TelePrescribersController {
  constructor(private telePrescribersService: TelePrescribersService) {}

  @Post("fetch_prescribers_for_Logs")
  FetchPrescribersForLog(@Body() body: any) {
    return this.telePrescribersService.fetchPrescribersforCallLog(body);
  }

  @Post("fetch-tele-prescribers")
  FetchTelePrescribers(@Body() body: any) {
    return this.telePrescribersService.fetchTelePrescribers(body);
  }

  @Post("get_prescriber_flagged_number")
  getFlaggedNumber(@Body() body: any) {
    return this.telePrescribersService.getPrescribersFlaggedNumber(body);
  }

  @Post("add_call_logs")
  @HttpCode(200)
  AddCallLogs(@Body() body: any) {
    return this.telePrescribersService.createCallLog(body);
  }

  @Post("fetch_tele_prescriber_details")
  FetchTelePrescriberData(@Body() body: any) {
    return this.telePrescribersService.fetchTelePrescriber(body);
  }

  @Post("update_tele_prescriber_flag_number")
  @HttpCode(200)
  UpdateFlagPhoneNumber(@Body() body: any) {
    console.log('body', body);
    return this.telePrescribersService.updateFlaggedPhoneNumber(body);
  }

  @Post("update_tele_prescriber_call_status")
  @HttpCode(200)
  UpdateCallStatus(@Body() body: any) {
    return this.telePrescribersService.updateTelePrescriberCallStatus(body);
  }

  @Post("update_tele_prescriber_meeting")
  @HttpCode(200)
  UpdateMeetingDate(@Body() body: any) {
    return this.telePrescribersService.updateTelePrescriberMeeting(body);
  }

  @Post("delete-tele-prescriber")
  @HttpCode(200)
  DeleteTelePrescriber(@Body() body: any) {
    return this.telePrescribersService.deleteTelePrescriber(body);
  }

  @Post("update-tele-prescriber-number")
  @HttpCode(200)
  UpdateTelePrescriber(@Body() body: any) {
    return this.telePrescribersService.updateTelePrescriberNumber(body);
  }
}
