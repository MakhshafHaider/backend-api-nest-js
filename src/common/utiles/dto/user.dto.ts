import { IsNumberString, MinLength } from "class-validator";

export class UserDto {
  name: string;

  @IsNumberString()
  @MinLength(10)
  mobile: string;

  email: string;
  password: string;
  confirmPassword: string;
  is_active: Boolean;
  is_verified: Boolean;
  roleId: number;
  clientId: number;
  company_name: string;
  token: string;
}
