import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { DrugService } from "./drug.service";

@Controller("drug")
export class DrugController {
  constructor(private drugService: DrugService) {}

  @Post("get_drug_details")
  GetDrugDetails(@Body() body: any) {
    return this.drugService.getDrugDetails(body);
  }

  @Post("drugs")
  @HttpCode(200)
  GetAllDrugs() {
    return this.drugService.getDrugs();
  }
}
