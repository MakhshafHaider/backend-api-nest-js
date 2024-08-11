import { Controller, Post, Body, Get} from "@nestjs/common";
import { CallLogsService } from "./call_logs.service";

@Controller("call-logs")
export class CallLogsController {
  constructor(private callLogsService: CallLogsService) {}

  @Post("fetch-call-logs")
  FetchCallLogData(@Body() body: any) {
    return this.callLogsService.fetchCallLogsData(body);
  }
  
  
  @Get("fetch-all-fax-logs")
  async FetchAllFaxLogs() {
    const allFaxLogs = await this.callLogsService.fetchAllFaxLogs();
    return allFaxLogs;
  }

  @Post("create-fax-logs")
  CreateFaxLogData(@Body() body: any) {
    console.log('body', body)
    return this.callLogsService.craeteFaxLogsData(body);
  }
  @Post("update-fax-logs")
  UpdateFaxLogData(@Body() body: any) {
    return this.callLogsService.updateFaxLog(body);
  }

  @Post("update-call-logs")
  UpdateCallLogData(@Body() body: any) {
    return this.callLogsService.updateCallLog(body);
  }
}
