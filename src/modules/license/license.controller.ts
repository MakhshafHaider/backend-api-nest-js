import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { LicenseService } from "./license.service";

@Controller("license")
export class LicenseController {
  constructor(private licenseService: LicenseService) {}

  @Post("add_license")
  @HttpCode(201)
  AddLicense(@Body() body: any) {
    return this.licenseService.addLicense(body);
  }

  @Post("get_license")
  GetLicense(@Body() body: any) {
    return this.licenseService.getLicense();
  }

  @Post("update_license")
  UpdateLicense(@Body() body: any) {
    return this.licenseService.updateLicense(body);
  }

  @Post("delete_license")
  DeleteLicense(@Body() body: any) {
    return this.licenseService.deleteLicense(body);
  }
}
