import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LicenseDto } from "src/common/utiles/dto/lisence.dto";
import { License } from "src/common/utiles/entity/license.entity";
import { Repository } from "typeorm";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>
  ) {}

  async addLicense(licenseDto: LicenseDto) {
    const { name, license_number, license_type, state } = licenseDto;
    const newUser = this.licenseRepository.create({
      Name: name,
      License_Number: license_number,
      License_Type: license_type,
      State: state,
    });
    await this.licenseRepository.save(newUser);
    return {
      statusCode: 201,
      message: "License Created",
    };
  }

  async getLicense(): Promise<License[]> {
    return this.licenseRepository.find();
  }

  async updateLicense(body: any) {
    const { license_id, name, license_number, license_type, state } = body;
    const query = this.licenseRepository
      .createQueryBuilder()
      .update(License)
      .set({
        Name: name,
        License_Number: license_number,
        License_Type: license_type,
        State: state,
      })
      .where("Id = :license_id", { license_id });

    const result = await query.execute();
    return result;
  }

  async deleteLicense(body: any) {
    const { license_id } = body;
    const deleteResult = await this.licenseRepository
      .createQueryBuilder()
      .delete()
      .from(License)
      .where("Id = :license_id", { license_id })
      .execute();

    return deleteResult.affected;
  }
}
