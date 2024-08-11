import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Headers,
  HttpCode,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async Login(
    @Body() body: { email: string; password: string }
  ): Promise<{ accessToken: string }> {
    return this.authService.newLogin(body);
  }

  @Post("find-product-advocate")
  async Find(@Body() body: any) {
    return this.authService.findProductAdvocate(body);
  }

  @Get("me")
  async GetMe(@Headers("authorization") token: string) {
    try {
      const userData = await this.authService.getUserData(token);
      return { userData };
    } catch (error) {
      throw error;
    }
  }

  //MOBILE API
  @Post("register")
  @HttpCode(200)
  async Register(@Body() body: any) {
    return this.authService.registerMobileUser(body);
  }

  @Post("otp_verification")
  @HttpCode(200)
  async OTPVerification(@Body() body: any) {
    return this.authService.verifyOTP(body);
  }
}
