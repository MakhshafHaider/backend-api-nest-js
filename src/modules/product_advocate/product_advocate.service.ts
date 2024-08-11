import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductAdvocate } from "src/common/utiles/entity/product_advocate.entity";
import { Repository } from "typeorm";
import { Job } from "src/common/utiles/entity/job.entity";
import { SamplesService } from "../samples/samples.service";
import { Client_PA } from "src/common/utiles/entity/client_pa.entity";
import { PrescribersList } from "src/common/utiles/entity/prescriber_list.entity";

@Injectable()
export class ProductAdvocateService {
  constructor(
    @InjectRepository(ProductAdvocate)
    private productAdvocateRepository: Repository<ProductAdvocate>,

    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,

    private sampleService: SamplesService,

    @InjectRepository(Client_PA)
    private ClientPARepository: Repository<Client_PA>,

    @InjectRepository(PrescribersList)
    private prescribersListRepository: Repository<PrescribersList>
  ) {}

  async fetchProductAdvocatesData(body: any) {
    const { limit, page_num, status, name_email, clientId } = body;
    const records = await this.getAllProductAdvocates(
      page_num,
      limit,
      status,
      name_email,
      clientId
    );
    return {
      statusCode: 200,
      result: { records },
    };
  }

  async checkIfCustomListIsAttached(
    product_advocate_id: number
  ): Promise<number | null> {
    try {
      const queryBuilder = this.productAdvocateRepository
        .createQueryBuilder("product_advocate")
        .where("product_advocate.Id = :product_advocate_id", {
          product_advocate_id,
        })
        .andWhere("product_advocate.Preview = 'CUSTOM'");

      const product_advocate = await queryBuilder.getOne();

      return product_advocate?.CustomList || null;
    } catch (error) {
      console.error("Error while checking if custom list is attached:", error);
      throw error;
    }
  }

  async fetchProductAdvocateData(body: any) {
    const { id } = body;
    const result = await this.getProductAdvocate(id);
    const data = await this.getJobs(id);
    const samplesDistributed = await this.sampleService.getSamplesDistributed(
      id
    );
    return { result, jobs: data, samplesDistributed };
  }

  async getAllProductAdvocates(
    page: number,
    perPage: number,
    Active: string,
    name_email: string,
    clientId: number
  ) {
    const queryBuilder = this.productAdvocateRepository
      .createQueryBuilder("product_advocate")
      .innerJoin(
        "client_pa",
        "pa",
        "product_advocate.Id = pa.Product_Advocate_Id"
      )
      .where("pa.IsEnabled = 1")
      .orderBy("product_advocate.Id", "DESC");

    if (clientId > 1) {
      queryBuilder.andWhere("pa.Client_Id = :clientId", {
        clientId,
      });
    }

    if (Active) {
      queryBuilder.andWhere("product_advocate.Active = :Active", {
        Active,
      });
    }
    if (name_email) {
      queryBuilder.andWhere(
        "product_advocate.Name LIKE :name_email OR product_advocate.Email LIKE :name_email AND pa.IsEnabled = 1 AND pa.Client_Id = :clientId AND product_advocate.Active = :Active",
        {
          name_email: `%${name_email}%`,
          clientId,
          Active,
        }
      );
    }

    const [productAdvocates, count] = await queryBuilder
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return { count, productAdvocates };
  }

  async updateProductAdvocate(body: any) {
    const {
      product_advocate_id,
      Name,
      Phone,
      Location,
      Region,
      License,
      Preview,
      SubView,
      CustomList,
      Active,
      Stock_20,
      Stock_60,
    } = body;
    const productAdvocate = await this.getProductAdvocate(product_advocate_id);
    if (productAdvocate) {
      const query = this.productAdvocateRepository
        .createQueryBuilder()
        .update(ProductAdvocate)
        .set({
          Active: Active,
          Stock_20,
          Stock_60,
          Name,
          Phone,
          Location,
          Region,
          License,
          Preview,
          SubView,
          CustomList,
        })
        .where("Id = :product_advocate_id", { product_advocate_id });
      const result = await query.execute();
      const updatedProductAdvocate = await this.getProductAdvocateById(
        product_advocate_id
      );
      if (result) {
        return { updatedProductAdvocate, status: HttpStatus.OK };
      }
    }
  }

  async updateCustomlist(List_Id: number) {
    const query = this.productAdvocateRepository
      .createQueryBuilder()
      .update(ProductAdvocate)
      .set({
        CustomList: null,
        Preview: "",
      })
      .where("CustomList = :List_Id", { List_Id });
    const result = await query.execute();

    if (result) {
      return { status: HttpStatus.OK };
    }
  }

  async registerClient(name: string, email: string, clientId: number) {
    const product_advocate = await this.getProductAdvocateByEmail(email);
    if (product_advocate.length > 0) {
      return product_advocate[0];
    }

    const newProductAdvocate = this.productAdvocateRepository.create({
      Name: name,
      Email: email,
      Active: "0",
    });

    const result = await this.productAdvocateRepository.save(
      newProductAdvocate
    );

    const clientPA = await this.ClientPARepository.save({
      IsEnabled: true,
      Product_Advocate_Id: result.Id,
      Client_Id: clientId,
    });

    if (result) {
      return { status: 200, message: "User Registered" };
    }
  }

  async getJobsDoneBasedOnProductAdvocateId(id: string) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .where("Product_Advocate = :id", { id });
    const result = await query.getManyAndCount();
    return {
      result,
    };
  }

  async getJobs(key: number) {
    const result = await this.jobsRepository.query(
      "CALL get_product_advocate_jobs_by_id(?)",
      [key]
    );
    return result[0];
  }

  async productAdvocateByEmail(body: any) {
    const { email } = body;

    const product_advocate = await this.getProductAdvocateByEmail(email);
    if (product_advocate.length > 0) {
      return product_advocate[0];
    }

    const newProductAdvocate = this.productAdvocateRepository.create({
      Email: email,
      Active: "0",
    });

    const result = await this.productAdvocateRepository.save(
      newProductAdvocate
    );

    const clientPA = await this.ClientPARepository.save({
      IsEnabled: true,
      Product_Advocate_Id: result.Id,
      Client_Id: 1,
    });

    if (result) {
      return result;
    } else {
      return {
        statusCode: 404,
        message: "Error",
      };
    }
  }

  async getProductAdvocateById(SalesforceId: string) {
    return await this.productAdvocateRepository.find({
      where: {
        SalesforceId: SalesforceId,
      },
    });
  }

  async getProductAdvocate(Id: number) {
    return await this.productAdvocateRepository.find({
      where: {
        Id: Id,
      },
    });
  }

  async getProductAdvocateByEmail(email: string) {
    return await this.productAdvocateRepository.find({
      where: {
        Email: email,
      },
    });
  }

  async addProfilePicture(
    product_advocate_id: number,
    profile_picture_url: string
  ): Promise<any> {
    // const base64Image = Buffer.from(
    //   profile_picture_url.split(",")[1],
    //   "base64"
    // );
    // const resizedImage = await sharp(base64Image)
    //   .resize(150, 120, {
    //     fit: "contain",
    //     background: { r: 255, g: 255, b: 255, alpha: 1 },
    //   })
    //   .toBuffer();

    const response = await this.addProfilePictureProductAdvocate(
      product_advocate_id,
      profile_picture_url
    );
    if (response) {
      return { message: "Profile Picture Updated", status: HttpStatus.OK };
    }
  }

  async addProfilePictureProductAdvocate(
    product_advocate_id: number,
    profile_picture_url: string
  ) {
    const query = this.productAdvocateRepository
      .createQueryBuilder()
      .update(ProductAdvocate)
      .set({
        Profile_Picture: profile_picture_url,
      })
      .where("Id = :product_advocate_id", {
        product_advocate_id,
      });
    const result = await query.execute();
    return result;
  }

  async deleteProfilePicture(body: any) {
    const { product_advocate_id } = body;
    const query = this.productAdvocateRepository
      .createQueryBuilder()
      .update(ProductAdvocate)
      .set({
        Profile_Picture: "",
      })
      .where("Id = :product_advocate_id", {
        product_advocate_id,
      });
    const result = await query.execute();
    if (result) {
      return { message: "Profile Picture Deleted", status: HttpStatus.OK };
    }
  }

  async getProductadvocatePerformance(body: any) {}

  async deleteProductAdvocate(body: any) {
    const { product_advocate_id } = body;
    const query = this.productAdvocateRepository
      .createQueryBuilder()
      .update(ProductAdvocate)
      .set({
        Active: "0",
      })
      .where("Id = :product_advocate_id", {
        product_advocate_id,
      });
    const result = await query.execute();
    return result;
  }

  async getProductadvocateName(body: any) {
    const { clientId } = body;
    const queryBuilder = this.productAdvocateRepository
      .createQueryBuilder("product_advocate")
      .innerJoin(
        "client_pa",
        "pa",
        "product_advocate.Id = pa.Product_Advocate_Id"
      )
      .select("product_advocate.Id")
      .addSelect("product_advocate.Name")
      .where("pa.IsEnabled = 1 AND product_advocate.Name IS NOT NULL");

    if (clientId > 1) {
      queryBuilder.andWhere("pa.Client_Id = :clientId", {
        clientId,
      });
    }

    const [result] = await queryBuilder.getManyAndCount();
    return result;
  }

  async getProductadvocateAnalytics(body: any) {
    const { id, start_date, end_date } = body;
    const totalVisits = await this.getTotalVisitCountByProductAdvocae(
      id,
      start_date,
      end_date
    );

    const timespent = await this.getTotalTimeSpentByProductAdvocate(
      id,
      start_date,
      end_date
    );

    const visits = await this.getTotalVistesByProductAdvocate(
      id,
      start_date,
      end_date
    );

    const hourspent = await this.getTotalHoursSpentByProductAdvocate(
      id,
      start_date,
      end_date
    );

    return { totalVisits, timespent, visits, hourspent };
  }

  async getTotalVisitCountByProductAdvocae(
    id: number,
    start_date: Date,
    end_date: Date
  ) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .select("job.question_2", "question_2")
      .addSelect("COUNT(job.Id)", "count")
      .where("job.Product_Advocate_Id = :id ", { id })
      .groupBy("job.question_2");

    if (start_date && end_date) {
      query.andWhere(
        "DATE(job.CreatedDate) BETWEEN :start_date AND :end_date",
        {
          start_date,
          end_date,
        }
      );
    }

    const results = await query.getRawMany();
    return results;
  }

  async getTotalTimeSpentByProductAdvocate(
    id: number,
    start_date: Date,
    end_date: Date
  ) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .select("SUM(job.Time_Spent_At_Job)", "totalTimeSpent")
      .where("job.Product_Advocate_Id = :id ", { id });

    if (start_date && end_date) {
      query.andWhere(
        "DATE(job.CreatedDate) BETWEEN :start_date AND :end_date",
        {
          start_date,
          end_date,
        }
      );
    }

    const results = await query.getRawMany();
    return results[0].totalTimeSpent;
  }

  async getTotalVistesByProductAdvocate(
    id: number,
    start_date: Date,
    end_date: Date
  ) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .select("COUNT(job.id)", "totalVisits")
      .where("job.Product_Advocate_Id = :id", { id });

    if (start_date && end_date) {
      query.andWhere(
        "DATE(job.CreatedDate) BETWEEN :start_date AND :end_date",
        {
          start_date,
          end_date,
        }
      );
    }

    const results = await query.getRawMany();
    return results[0].totalVisits;
  }

  async getTotalHoursSpentByProductAdvocate(
    id: number,
    start_date: Date,
    end_date: Date
  ) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .select("DATE(job.feedback_submitted_at)", "date")
      .addSelect(
        "TIMESTAMPDIFF(MINUTE, MIN(feedback_submitted_at), MAX(feedback_submitted_at))",
        "timeSpent"
      )
      .where("job.Product_Advocate_Id = :id ", { id })
      .groupBy("DATE(job.feedback_submitted_at)")
      .orderBy("date", "ASC");

    if (start_date && end_date) {
      query.andWhere(
        "DATE(job.feedback_submitted_at) BETWEEN :start_date AND :end_date",
        {
          start_date,
          end_date,
        }
      );
    }
    const results = await query.getRawMany();
    return results;
  }
}
