import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkExperience } from "src/common/utiles/entity/work_experience.entity";
import { Repository } from "typeorm";

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(WorkExperience)
    private workExpRepository: Repository<WorkExperience>
  ) {}

  async getWorkExperience(body: any) {
    const { product_advocate_id } = body;
    const work_experience = await this.getWorkExperienceById(
      product_advocate_id
    );
    if (work_experience) {
      return { work_experience };
    } else {
      return { statusCode: HttpStatus.NOT_FOUND };
    }
  }

  async getWorkExperienceById(id: string) {
    const query = this.workExpRepository
      .createQueryBuilder("work_experience")
      .where("Product_Advocate_Id = :id", { id });

    const work_experience = await query.getOne();
    return work_experience;
  }

  async addWorkExperience(body: any) {
    const { name, experience_details, year, product_advocate_id } = body;

    const newWork = this.workExpRepository.create({
      Name: name,
      Experience_Details: experience_details,
      Year: year,
      Product_Advocate_Id: product_advocate_id,
    });
    await this.workExpRepository.save(newWork);
    return {
      statusCode: 201,
      message: "Work Experience Added",
    };
  }

  async updateWorkExperience(body: any) {
    const {
      work_experience_id,
      name,
      experience_details,
      year,
      product_advocate_id,
    } = body;

    const query = this.workExpRepository
      .createQueryBuilder()
      .update(WorkExperience)
      .set({
        Name: name,
        Experience_Details: experience_details,
        Year: year,
        Product_Advocate_Id: product_advocate_id,
      })
      .where("Id = :work_experience_id", { work_experience_id });

    const result = await query.execute();
    if (result) {
      return {
        statusCode: 200,
        message: "Work Experience Updated",
      };
    } else {
      return null;
    }
  }

  async deleteWorkExperience(body: any) {
    const { work_experience_id } = body;
    const deleteResult = await this.workExpRepository
      .createQueryBuilder()
      .delete()
      .from(WorkExperience)
      .where("Id = :work_experience_id", { work_experience_id })
      .execute();
    return {
      statusCode: 200,
      message: "Work Experience Deleted",
    };
  }
}
