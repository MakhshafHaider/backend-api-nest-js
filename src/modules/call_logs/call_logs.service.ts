import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import CallLogs from "src/common/utiles/entity/calllogs.entity";
import { Repository } from "typeorm";
import {FaxLogs}  from "src/common/utiles/entity/faxlogs.entity";
@Injectable()
export class CallLogsService {
  constructor(
    @InjectRepository(CallLogs)
    private callLogsRepository: Repository<CallLogs>,
    @InjectRepository(FaxLogs) private faxLogsRepository: Repository<FaxLogs>,
  ) {}
  async craeteFaxLogsData(body: any) {
    const {
      faxNumber,
      faxId,
      status,
    } = body;
    const fax = new FaxLogs();
    fax.faxNumber = faxNumber;
    fax.faxId = faxId;
    fax.status = status;

    const createdFaxNumber = await this.faxLogsRepository.save(fax);
    console.log('created', createdFaxNumber)
    // const newJob = [{ ...createdJob, prescriber }];
    return { createdFaxNumber, status: HttpStatus.OK };
  }

  
  async updateFaxLog(body: any) {
    const { faxId, status,faxNumber } = body;
    console.log("check", body);
    const updatefaxLogQuery = this.faxLogsRepository
      .createQueryBuilder()
      .update(FaxLogs)
      .set({
        status: status,
        faxNumber: faxNumber
      })
      .where("faxId = :faxId", { faxId });
    const result = await updatefaxLogQuery.execute();

    return {
      message: "Fax Log Updated",
      status: 200,
    };
  }
  async fetchCallLogsData(body: any) {
    const {
      limit,
      page_num,
      start_date,
      end_date,
      tele_prescreiber,
      tele_marketer,
      call_disposition,
      receiver_position,
    } = body;
    const record = await this.getAllJobs(
      page_num,
      limit,
      tele_prescreiber,
      tele_marketer,
      call_disposition,
      receiver_position,
      start_date,
      end_date
    );
    return {
      statusCode: 200,
      result: record,
    };
  }
  async fetchAllFaxLogs(): Promise<FaxLogs[]> {
    const allFaxLogs = await this.faxLogsRepository.find();
    return allFaxLogs;
  }
  async getAllJobs(
    page: number,
    perPage: number,
    tele_prescreiber: string,
    tele_marketer: string,
    call_disposition: string,
    receiver_position: string,
    start_date: Date,
    end_date: Date
  ) {
    const queryBuilder = this.callLogsRepository
      .createQueryBuilder("call_logs")
      .innerJoin("tele_prescribers", "p", "call_logs.PrescriberId = p.Id")
      .innerJoin("user", "u", "call_logs.TelemarketerId = u.id")
      .where("call_logs.isAvailable != TRUE")
      .orderBy("call_logs.Id", "DESC")
      .select("call_logs.Id as call_logs_Id, call_logs.*")
      .addSelect("p.First_Name,p.Last_Name,p.Phone")
      .addSelect("u.name,u.email");

    if (tele_marketer) {
      queryBuilder.andWhere("u.name LIKE :tele_marketer", {
        tele_marketer: `%${tele_marketer}%`,
      });
    }

    if (call_disposition) {
      const call_disposition_list = call_disposition.split(",");

      const filterStrings = call_disposition_list.map(
        (cd) => `call_logs.CallDisposition = "${cd}"`
      );

      const filterString = filterStrings.join(" OR ");

      const parameters = call_disposition_list.reduce((acc, cd, index) => {
        acc[`cd${index}`] = `${cd}`;
        return acc;
      }, {});

      if (call_disposition_list.length > 0) {
        queryBuilder.andWhere(`(${filterString})`, parameters);
      }
    }

    if (receiver_position) {
      const receiver_position_list = receiver_position.split(",");
      const filterStrings = receiver_position_list.map(
        (rp) => `call_logs.CallReceiverPosition = "${rp}"`
      );

      const filterString = filterStrings.join(" OR ");

      const parameters = receiver_position_list.reduce((acc, rp, index) => {
        acc[`rp${index}`] = `${rp}`;
        return acc;
      }, {});

      if (receiver_position_list.length > 0) {
        queryBuilder.andWhere(`(${filterString})`, parameters);
      }
    }

    if (start_date && end_date) {
      queryBuilder.andWhere(
        "DATE(call_logs.LoggedDate) BETWEEN :start_date AND :end_date",
        {
          start_date,
          end_date,
        }
      );
    }

    if (tele_prescreiber) {
      queryBuilder.andWhere(
        "p.First_Name LIKE :prescriber OR p.Last_Name LIKE :prescriber",
        {
          prescriber: `%${tele_prescreiber}%`,
        }
      );
    }

    const count = await queryBuilder.getCount();
    if (page && perPage) {
      const call_logs = await queryBuilder
        .skip((page - 1) * perPage)
        .take(perPage)
        .getRawAndEntities();

      return { data: call_logs["raw"], count: count };
    } else {
      const call_logs = await queryBuilder.getRawAndEntities();
      return { data: call_logs["raw"], count: count };
    }
  }

  async updateCallLog(body: any) {
    const { logId } = body;
    console.log("check", body);
    const updateCallLogQuery = this.callLogsRepository
      .createQueryBuilder()
      .update(CallLogs)
      .set({
        isAvailable: true,
      })
      .where("Id = :logId", { logId });
    const result = await updateCallLogQuery.execute();

    return {
      message: "Call Log Updated",
      status: 200,
    };
  }
}
