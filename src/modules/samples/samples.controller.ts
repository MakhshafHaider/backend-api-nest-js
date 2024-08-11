import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { SamplesService } from "./samples.service";

@Controller("sample")
export class SamplesController {
  constructor(private samplesService: SamplesService) {}

  @Post("fetch_samples")
  FetchSamplesData(@Body() body: any) {
    return this.samplesService.fetchSamplesData(body);
  }

  @Post("cancel_sample")
  @HttpCode(200)
  CancelSample(@Body() body: any) {
    return this.samplesService.UpdateSamplesData(body);
  }

  // Mobile API
  @Post("add_sample")
  @HttpCode(200)
  AddSample(@Body() body: any) {
    return this.samplesService.addSample(body);
  }

  @Post("samples")
  @HttpCode(200)
  GetSamples(@Body() body: any) {
    return this.samplesService.getSamples(body);
  }

  @Post("update_sample")
  @HttpCode(200)
  UpdateSample(@Body() body: any) {
    return this.samplesService.updateSample(body);
  }

  @Post("samples_is_valid_prescriber")
  @HttpCode(200)
  IsValidPrescriber(@Body() body: any) {
    return this.samplesService.isValidPrescriber(body);
  }
}
