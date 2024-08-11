import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmailService } from "src/common/utiles/email/email.service";
import { TwilioSmsService } from "src/common/utiles/sms/twilioverify.service";
import { instanceToPlain } from "class-transformer";
import Login from "src/common/utiles/entity/login.entity";
import { User } from "src/common/utiles/entity/user.entity";
import { UserDto } from "src/common/utiles/dto/user.dto";
import { Client } from "src/common/utiles/entity/client.entity";
import { ProductAdvocateService } from "../product_advocate/product_advocate.service";
const bcrypt = require("bcrypt");

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Login)
    private loginRepository: Repository<Login>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    private productAdvocateService: ProductAdvocateService,

    private emailService: EmailService,
    private smsServices: TwilioSmsService
  ) {}

  async getUsers(query: any) {
    const { clientId } = query;
    const usersQuery = this.userRepository
      .createQueryBuilder("users")
      .andWhere("roleId != 4")
      .orderBy("id", "DESC");

    if (clientId > 1) {
      usersQuery.andWhere("clientId = :clientId", {
        clientId,
      });
    }

    const users = await usersQuery.getMany();

    const companyQuery = this.clientRepository.createQueryBuilder();
    const company = await companyQuery.getMany();

    return { users, company };
  }

  async getTeleMarketerUsers(query: any) {
    const { clientId } = query;
    const usersQuery = this.userRepository
      .createQueryBuilder("users")
      .andWhere("roleId = 4")
      .orderBy("id", "DESC");

    if (clientId > 1) {
      usersQuery.andWhere("clientId = :clientId", {
        clientId,
      });
    }

    const users = await usersQuery.getMany();

    const companyQuery = this.clientRepository.createQueryBuilder();
    const company = await companyQuery.getMany();

    return { users, company };
  }

  async disableTelePrescriber(body: any) {
    let { tele_prescriber_id, is_active, is_verified } = body;
    const query = this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        is_active: is_active,
        is_verified: is_verified,
      })
      .where("id = :tele_prescriber_id", { tele_prescriber_id });

    const result = await query.execute();
    return {
      result: result.affected,
      message: "User Status Updated Successfully!",
      status: HttpStatus.OK,
    };
  }

  getManufactureUsers(roleId: number): Promise<User[]> {
    return this.userRepository.find({ where: { roleId } });
  }

  async registerUser(userDto: UserDto) {
    const { mobile, email } = userDto;

    if (email) {
      return this.registerDashboardUser(userDto);
    }
    if (mobile) {
      return this.registerMobileUser(userDto);
    }
  }

  async getUserByEmail(body: any) {
    const { email } = body;
    console.log(body);
    const user = await this.findByEmail(email);
    if (user) {
      if (user.token) {
        return {
          statusCode: 200,
          message: "User is Not Verified",
        };
      } else {
        return {
          statusCode: 404,
          message: "User is Verified",
        };
      }
    }
  }

  async setPassword(body: any) {
    const { email, password, confirmPassword, token } = body;
    const user = await this.findByEmail(email);
    if (!user) {
      return {
        statusCode: 404,
        message: "User Not Found",
      };
    }
    //Check if confirm password matches password
    if (password !== confirmPassword) {
      return {
        statusCode: 400,
        message: "Passwords do not Match!",
      };
    } else {
      const hashedPassword = await bcrypt.hash(password, 8);
      user.token = token;
      user.password = hashedPassword;
      (user.is_verified = true), (user.is_active = true);
      this.UpdateUserbyEmail(email, user);
      return {
        statusCode: 200,
        message: "Password Updated Successfully!",
      };
    }
  }

  async findByUsernameAndPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (user) {
      return user;
    }
    return null;
  }

  async registerMobileUser(userDto: UserDto) {
    const { mobile } = userDto;

    this.smsServices.sendSmsCode(mobile, "sms");
    const existingNum = await this.findByMobile(mobile);
    if (existingNum) {
      return {
        statusCode: 200,
        message: "User Already Exists",
      };
    }

    this.userRepository.save(instanceToPlain(userDto));
    return {
      statusCode: 201,
      message: "User Registered ",
    };
  }

  async inviteDashboardUser(userDto: UserDto) {
    const { name, email, roleId, company_name } = userDto;

    const registerCompany = await this.registerCompany(name, company_name);
    if (roleId == 2) {
      return this.productAdvocateService.registerClient(
        name,
        email,
        registerCompany.Id
      );
    } else {
      userDto.roleId = roleId;
      userDto.name = name;
      userDto.company_name = company_name;
      userDto.clientId = registerCompany.Id;
      userDto.token = this.generateToken();

      const existingEmail = await this.findByEmail(email);
      if (existingEmail) {
        return { status: 400, message: "User Already Exists" };
      }
      const mailSubject = "Welcome to SAMODREI!";
      //
      const content = `
            <p>Hello,</p>
            <p>Please click on the link below to set your Password:</p>
            <p><a href="https://dashboard.samodrei.com/reset-password-form/auth/${email}">Set Password</a></p>
            <br>
          `;

      // //Send email
      await this.emailService.sendEmail(email, mailSubject, content, "");
      await this.userRepository.save(instanceToPlain(userDto));
      return { status: 200, message: "Invitation Sent" };
    }
  }

  async registerCompany(name: string, company_name: string) {
    const company = await this.findCompany(company_name);
    if (!company) {
      return await this.clientRepository.save({
        Name: company_name,
        Primary_Account_Owner: name,
      });
    }
    return company;
  }

  async findCompany(company_name: string) {
    const find = await this.clientRepository.findOne({
      where: { Name: company_name },
    });
    return find;
  }

  async registerDashboardUser(userDto: UserDto) {
    const { name, email, password, confirmPassword, roleId } = userDto;

    userDto.roleId = roleId;
    userDto.name = name;

    const existingEmail = await this.findByEmail(email);
    if (existingEmail) {
      return { status: 404, message: "User Already Exists" };
    }
    if (password !== confirmPassword) {
      return { status: 400, message: "Password Not Matched" };
    } else {
      const hashedPassword = await bcrypt.hash(password, 8);
      userDto.password = hashedPassword;
      (userDto.is_verified = true), (userDto.is_active = true);
    }
    await this.userRepository.save(instanceToPlain(userDto));
    return { status: 201, message: "User Registered" };
  }

  generateToken() {
    const token = Math.floor(100000 + Math.random() * 900000);
    return token.toString();
  }

  findByMobile(mobile: string) {
    return this.userRepository.findOne({ where: { mobile: mobile } });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  findOneByUserId(id: number) {
    return this.loginRepository.findOne({ where: { userId: id } });
  }

  findByUserId(id: number) {
    return this.userRepository.findOne({ where: { id: id } });
  }

  UpdateUserbyMobile(mobile: string, user: any) {
    return this.userRepository.update({ mobile: mobile }, user);
  }
  UpdateUserbyEmail(email: string, user: any) {
    return this.userRepository.update({ email: email }, user);
  }

  UpdateLoginByID(
    token: string,
    timeOut: any,
    isLoggedIn: boolean,
    checkUser: any
  ) {
    return this.loginRepository.update(
      { token, timeOut, isLoggedIn },
      checkUser
    );
  }
}
