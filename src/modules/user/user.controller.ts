import { Body, Controller, Get, Post, Query, HttpCode } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}
  @Get("users")
  getUser(@Query() query: any) {
    return this.userService.getUsers(query);
  }

  @Get("tele-marketer-users")
  getTeleMarketerUser(@Query() query: any) {
    return this.userService.getTeleMarketerUsers(query);
  }

  @Post("disable-tele-marketer-user")
  disableTeleMarketerUser(@Body() body: any) {
    return this.userService.disableTelePrescriber(body);
  }

  @Post("register")
  store(@Body() body: any) {
    return this.userService.registerUser(body);
  }

  @Post("get-user")
  GetUser(@Body() body: any) {
    return this.userService.getUserByEmail(body);
  }

  @Post("invite")
  invite(@Body() body: any) {
    return this.userService.inviteDashboardUser(body);
  }

  @Post("set-password")
  @HttpCode(200)
  SetPassword(@Body() body: JSON) {
    return this.userService.setPassword(body);
  }
}
