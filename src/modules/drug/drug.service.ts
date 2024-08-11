import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Drug } from "src/common/utiles/entity/drug.entity";
import { Repository } from "typeorm";

@Injectable()
export class DrugService {
  constructor(
    @InjectRepository(Drug)
    private drugRepository: Repository<Drug>
  ) {}

  async getDrugDetails(body: any) {
    const { job_id } = body;
    const drugQuery = this.drugRepository
      .createQueryBuilder("drug")
      .where("Id = :job_id", { job_id });

    const result = await drugQuery.getOne();

    if (result) {
      return result;
    } else {
      return { error: "NO_RECORD_FOUND" };
    }
  }

  async getDrugs() {
    const result = await this.drugRepository.find();
    if (result) {
      return result;
    }
  }
}
