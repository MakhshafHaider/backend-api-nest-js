import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Prescriber } from "src/common/utiles/entity/prescriber.entity";
import { ProductAdvocate } from "src/common/utiles/entity/product_advocate.entity";
import { Sample } from "src/common/utiles/entity/sample.entity";
import { Repository } from "typeorm";

@Injectable()
export class SamplesService {
  constructor(
    @InjectRepository(Sample)
    private samplesRepository: Repository<Sample>,

    @InjectRepository(ProductAdvocate)
    private productAdvocateRepository: Repository<ProductAdvocate>,

    @InjectRepository(Prescriber)
    private prescribersRepository: Repository<Prescriber>
  ) {}

  async fetchSamplesData(body: any) {
    const {
      limit,
      page_num,
      product_advocate,
      prescriber,
      sample_status,
      clientId,
    } = body;
    const delivered_mg_20 = await this.getMG20Count(clientId);
    const delivered_mg_60 = await this.getMG60Count(clientId);
    const record = await this.getAllSamples(
      page_num,
      limit,
      sample_status,
      prescriber,
      product_advocate,
      clientId
    );
    const ProductAdvocates = await this.getProductadvocatesName(clientId);
    if (record) {
      const records = await this.getPrescriberAndProductAdvocate(record);
      return {
        statusCode: 200,
        result: { delivered_mg_20, delivered_mg_60, records },
        ProductAdvocates,
      };
    }

    return {
      statusCode: 200,
      result: [],
    };
  }

  async getProductadvocatesName(clientId: number) {
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

  async getProductAdvocateById(Id: number) {
    return await this.productAdvocateRepository.find({
      where: {
        Id: Id,
      },
    });
  }

  getPrescriberData(Id: number) {
    return this.prescribersRepository.find({
      where: {
        Id: Id,
      },
    });
  }

  async getPrescriberAndProductAdvocate(records: any) {
    const filteredJobs = [];
    for (let i = 0; i < records.samples.length; i++) {
      const sample = records.samples[i];

      const productAdvocateSamples = await this.getProductAdvocateById(
        sample.Product_Advocate_Id
      );

      const prescribersJobs = await this.getPrescriberData(
        sample.Prescriber_Id
      );

      for (let j = 0; j < productAdvocateSamples.length; j++) {
        const productAdvocate = productAdvocateSamples[j];
        const prescriberJob = prescribersJobs[j];

        filteredJobs.push({
          ...sample,
          product_advocate: productAdvocate,
          prescriber: prescriberJob,
        });
      }
    }
    records.samples = filteredJobs;
    return records;
  }

  async UpdateSamplesData(body: any) {
    const { Id } = body;
    const sample = await this.findSample(Id);
    if (!sample) {
      return {
        statusCode: 404,
        message: "Sample Not Found",
      };
    }
    sample.Status = "cancelled";
    await this.samplesRepository.save(sample);
    return {
      statusCode: 200,
      message: "Job Cancelled",
    };
  }

  async getSamplesCount(): Promise<number> {
    return this.samplesRepository.count();
  }

  async getMG20Count(clientId?: number) {
    const deliveredSamples = await this.samplesRepository
      .createQueryBuilder("sample")
      .select("SUM(sample.Quantity_20)", "totalMG20Count")
      .innerJoin(
        "client_pa",
        "cpa",
        "sample.Product_Advocate_Id = cpa.Product_Advocate_Id"
      )
      .where("sample.Status = 'delivered' ");
    if (clientId > 1) {
      deliveredSamples.andWhere("cpa.Client_Id = :clientId", {
        clientId,
      });
    }

    const totalMG20Count = await deliveredSamples.getRawMany();

    return Number(totalMG20Count[0].totalMG20Count);
  }

  async getMG60Count(clientId?: number) {
    const deliveredSamples = await this.samplesRepository
      .createQueryBuilder("sample")
      .select("SUM(sample.Quantity_60)", "totalMG60Count")
      .innerJoin(
        "client_pa",
        "cpa",
        "sample.Product_Advocate_Id = cpa.Product_Advocate_Id"
      )
      .where("sample.Status = 'delivered' ");

    if (clientId > 1) {
      deliveredSamples.andWhere("cpa.Client_Id = :clientId", {
        clientId,
      });
    }

    const totalMG60Count = await deliveredSamples.getRawMany();

    return Number(totalMG60Count[0].totalMG60Count);
  }

  async getAllSamples(
    page: number,
    perPage: number,
    status?: string,
    prescriber?: string,
    product_advocate?: string,
    clientId?: number
  ) {
    console.log(clientId);

    const queryBuilder = this.samplesRepository
      .createQueryBuilder("sample")
      .innerJoin("product_advocate", "pa", "sample.Product_Advocate_Id = pa.Id")
      .innerJoin(
        "client_pa",
        "cpa",
        "sample.Product_Advocate_Id = cpa.Product_Advocate_Id"
      )

      .orderBy("sample.CreatedDate", "DESC");

    if (clientId > 1) {
      queryBuilder.andWhere("cpa.Client_Id = :clientId", {
        clientId,
      });
    }
    if (status) {
      queryBuilder.andWhere("sample.status = :status", { status });
    }

    if (prescriber) {
      queryBuilder.andWhere("sample.prescriber_name LIKE :prescriber", {
        prescriber: `%${prescriber}%`,
      });
    }

    if (product_advocate) {
      queryBuilder.andWhere("pa.Name LIKE :product_advocate", {
        product_advocate: `%${product_advocate}%`,
      });
    }

    const [samples, count] = await queryBuilder
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return { count, samples };
  }

  async findSample(SalesforceId: number) {
    return this.samplesRepository.findOne({
      where: { Id: SalesforceId },
    });
  }

  async getSamplesDistributed(id: number) {
    const query = this.samplesRepository
      .createQueryBuilder("sample")
      .where("Product_Advocate_Id = :id", { id })
      .andWhere("Status ='delivered'");

    const result = await query.getRawMany();
    return {
      result,
    };
  }

  async getSamples(body: any) {
    const { id } = body;

    const query = this.samplesRepository
      .createQueryBuilder("sample")
      .where("Product_Advocate_Id = :id ", { id })
      .andWhere("Status = 'requested' ");

    const [result] = await query.getManyAndCount();

    if (result) {
      return { result, status: HttpStatus.OK };
    }
  }

  async addSample(body: any) {
    const {
      name,
      speciality,
      city,
      state,
      zip,
      phone,
      email,
      npi,
      quantity_20,
      quantity_60,
      base64PicPre,
      prescriber_id,
      product_advocate_id,
      pre_sign_lng,
      pre_sign_lat,
    } = body;

    const newSample = this.samplesRepository.create({
      CreatedDate: new Date(),
      Prescriber_Name: name,
      Prescriber_Speciality: speciality,
      Prescriber_City: city,
      Prescriber_State: state,
      Prescriber_Zip: zip,
      Prescriber_Phone: phone,
      Prescriber_Email: email,
      Prescriber_Npi: npi,
      Quantity_20: quantity_20,
      Quantity_60: quantity_60,
      Pre_Sign: base64PicPre,
      Prescriber_Id: prescriber_id,
      Product_Advocate_Id: product_advocate_id,
      Pre_Sign_Location__Latitude__s: pre_sign_lat,
      Pre_Sign_Location__Longitude__s: pre_sign_lng,
      Pre_Sign_Date: new Date().toISOString(),
      Status: "requested",
    });
    const result = await this.samplesRepository.save(newSample);
    if (result) {
      return { result, status: HttpStatus.OK };
    }
  }

  async updateSample(body: any) {
    const { id, base64PicPost, post_sign_lat, post_sign_lng } = body;
    const updateSample = await this.samplesRepository
      .createQueryBuilder()
      .update("sample")
      .set({
        Post_Sign: base64PicPost,
        Post_Sign_Date: new Date().toISOString(),
        Post_Sign_Location__Latitude__s: post_sign_lat,
        Post_Sign_Location__Longitude__s: post_sign_lng,
        Status: "delivered",
      })
      .where("Id = :id", { id })
      .execute();

    if (updateSample) {
      return { message: "Updated", status: HttpStatus.OK };
    }
  }

  async isValidPrescriber(body: any) {
    const { prescriber_id } = body;

    const query = this.samplesRepository
      .createQueryBuilder()
      .select("Id")
      .where("Pre_Sign_Date >= DATE_SUB(NOW(), INTERVAL 30 DAY)")
      .andWhere("Status != :status", { status: "cancelled" })
      .andWhere("Prescriber_Id = :prescriber_id", {
        prescriber_id,
      });

    const [sample, count] = await query.getManyAndCount();
    return { count, status: HttpStatus.OK };
  }
}
