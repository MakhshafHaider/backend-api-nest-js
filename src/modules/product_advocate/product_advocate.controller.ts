import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ProductAdvocateService } from "./product_advocate.service";

@Controller("product_advocate")
export class ProductAdvocateController {
  constructor(private productAdvocateService: ProductAdvocateService) {}

  @Post("fetch_product_advocates")
  FetchProductAdvocatesData(@Body() body: any) {
    return this.productAdvocateService.fetchProductAdvocatesData(body);
  }

  @Post("fetch_product_advocate_details")
  FetchProductAdvocateData(@Body() body: any) {
    return this.productAdvocateService.fetchProductAdvocateData(body);
  }

  @Post("get_product_advocate")
  @HttpCode(200)
  GetProductAdvocate(@Body() body: any) {
    return this.productAdvocateService.productAdvocateByEmail(body);
  }

  @Post("get_prod_adv_performance")
  GetProductadvocatePerformance(@Body() body: any) {
    return this.productAdvocateService.getProductadvocatePerformance(body);
  }

  @Post("get_all_product_adv_name")
  GetProductadvocateName(@Body() body: any) {
    return this.productAdvocateService.getProductadvocateName(body);
  }

  @Post("get_prod_adv_analytics")
  GetProductadvocateAnalytics(@Body() body: any) {
    return this.productAdvocateService.getProductadvocateAnalytics(body);
  }

  @Post("delete_product_advocate")
  DeleteProductAdvocate(@Body() body: any) {
    return this.productAdvocateService.deleteProductAdvocate(body);
  }

  //Mobile APIs

  @Post("add_profile_picture_prod_adv")
  @HttpCode(200)
  AddProfilePicture(@Body() body: any) {
    const { product_advocate_id, profile_picture_url } = body;
    return this.productAdvocateService.addProfilePicture(
      product_advocate_id,
      profile_picture_url
    );
  }

  @Post("delete_profile_picture_prod_adv")
  @HttpCode(200)
  DeleteProfilePicture(@Body() body: any) {
    return this.productAdvocateService.deleteProfilePicture(body);
  }

  @Post("update_product_advocate")
  @HttpCode(200)
  UpdateProductAdvocatesData(@Body() body: any) {
    return this.productAdvocateService.updateProductAdvocate(body);
  }
}
