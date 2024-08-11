// roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";

import * as dotenv from "dotenv";
import { UserService } from "src/modules/user/user.service";

dotenv.config();
const { SECRET_KEY } = process.env;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid token");
    }

    const token = authHeader.split(" ")[1];
    console.log('token',token);
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as {
        id: number;
      };

      const user = await this.userService.findOneByUserId(decoded.id);

      if (!user) {
        throw new UnauthorizedException("Invalid token");
      }

      if (!user.isLoggedIn) {
        throw new UnauthorizedException("User is not logged in");
      }

      if (new Date(user.timeOut) < new Date()) {
        throw new UnauthorizedException("Token has expired");
      }

      req.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Missing or invalid token");
    }
  }
}
