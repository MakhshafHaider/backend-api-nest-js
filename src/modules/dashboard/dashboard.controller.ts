import { Body, Controller, Post } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Post("fetch_dashboard_data")
  FetchDashboardData(@Body() body: any) {
    return this.dashboardService.fetchDashboardData(body);
  }
}
