import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import CallLogs from "src/common/utiles/entity/calllogs.entity";
import { TelePrescribers } from "src/common/utiles/entity/tele_prescreibers.entity";
import { Repository } from "typeorm";

@Injectable()
export class TelePrescribersService {
  constructor(
    @InjectRepository(TelePrescribers)
    private telePrescribersRepository: Repository<TelePrescribers>,

    @InjectRepository(CallLogs)
    private callLogsRepository: Repository<CallLogs>
  ) {}

  async fetchPrescribersforCallLog(body: any) {
    const { limit, page_num } = body;

    const records = await this.getUnLoggedPrescribers(page_num, limit);
    return {
      statusCode: 200,
      result: { records },
    };
  }

  async getUnLoggedPrescribers(page: number, perPage: number) {
    const queryBuilder = this.telePrescribersRepository
      .createQueryBuilder("tele_prescribers")
      .leftJoin(
        "call_logs",
        "c",
        "tele_prescribers.Id = c.PrescriberId AND c.LoggedDate >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND tele_prescribers.MeetingDate IS NULL AND c.isAvailable = FALSE"
      )
      .where("c.PrescriberId IS NULL")
      .andWhere("tele_prescribers.FlaggedPhoneNumber != true")
      .andWhere("tele_prescribers.Phone != 0")
      .andWhere(
        "tele_prescribers.State <> 'CA' OR (tele_prescribers.State = 'CA' AND HOUR(CONVERT_TZ(NOW(), 'UTC', 'America/New_York')) BETWEEN 12 AND 20)"
      )
      .orderBy("tele_prescribers.Id", "DESC");

    const [prescribers, count] = await queryBuilder
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return { count, prescribers };
  }

  async getPrescribersFlaggedNumber(body: any) {
    const query = this.telePrescribersRepository
      .createQueryBuilder("tele_prescribers")
      .leftJoin("user", "u", "u.id = tele_prescribers.TeleMarkterId")
      .where("FlaggedPhoneNumber = true")
      .select("u.*,tele_prescribers.*")
      .andWhere("IsDeleted != True")
      .orderBy("FlaggedPhoneNumberDate", "DESC");

    const results = await query.getRawMany();
    console.log('results', results);
    return {
      prescribers: results,
      status: HttpStatus.OK,
    };
  }

  async createCallLog(body: any) {
    const {
      telemarketerId,
      prescriberId,
      feedback,
      call_time,
      call_receiver_name,
      call_receiver_position,
      call_disposition,
    } = body;

    const callLog = new CallLogs();
    callLog.TelemarketerId = telemarketerId;
    callLog.PrescriberId = prescriberId;
    callLog.LoggedDate = new Date();
    callLog.CallFeedback = feedback;
    callLog.CallTime = call_time;
    callLog.CallReceiverName = call_receiver_name;
    callLog.CallReceiverPosition = call_receiver_position;
    callLog.CallDisposition = call_disposition;
    console.log('call logs', callLog);
    await this.callLogsRepository.save(callLog);

    return { message: "Feedback Submitted", status: HttpStatus.OK };
  }

  async updateFlaggedPhoneNumber(body: any) {
    let { prescriberId, TeleMarkterId, FlagDisposition } = body;
    const query = this.telePrescribersRepository
      .createQueryBuilder()
      .update(TelePrescribers)
      .set({
        TeleMarkterId: TeleMarkterId,
        FlagDisposition: FlagDisposition,
        FlaggedPhoneNumber: true
      })
      .where("Id = :prescriberId", { prescriberId });

    const result = await query.execute();
    return {
      result: result.affected,
      message: "Phone Number Flagged!",
      status: HttpStatus.OK,
    };
  }

  async updateTelePrescriberCallStatus(body: any) {
    let { prescriberId, flagged } = body;
    const query = this.telePrescribersRepository
      .createQueryBuilder()
      .update(TelePrescribers)
      .set({
        isOnCall: flagged,
      })
      .where("Id = :prescriberId", { prescriberId });

    const result = await query.execute();
    return {
      result: result.affected,
      message: "Status Updated!",
      status: HttpStatus.OK,
    };
  }

  async updateTelePrescriberMeeting(body: any) {
    let { prescriberId, flagged, meetingDate } = body;
    const query = this.telePrescribersRepository
      .createQueryBuilder()
      .update(TelePrescribers)
      .set({
        isOnCall: flagged,
        MeetingDate: meetingDate,
      })
      .where("Id = :prescriberId", { prescriberId });

    const result = await query.execute();
    return {
      result: result.affected,
      message: "Status Updated!",
      status: HttpStatus.OK,
    };
  }

  async fetchTelePrescriber(body: any) {
    const { id } = body;
    const result = await this.getTelePrescriber(id);

    return { result };
  }

  getTelePrescriber(Id: number) {
    return this.telePrescribersRepository.find({
      where: {
        Id: Id,
      },
    });
  }

  async fetchTelePrescribers(body: any) {
    const { limit, page_num } = body;
    const queryBuilder = this.telePrescribersRepository
      .createQueryBuilder("tele_prescribers")
      .orderBy("tele_prescribers.Id", "DESC");

    const [prescribers, count] = await queryBuilder
      .skip((page_num - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { count, prescribers };
  }

  async deleteTelePrescriber(body: any) {
    const { prescriberId, IsDeleted } = body;
    const deletePrescriberQuery = this.telePrescribersRepository
      .createQueryBuilder()
      .update(TelePrescribers)
      .set({
        IsDeleted: IsDeleted,
      })
      .where("Id = :prescriberId", { prescriberId });
    const result = await deletePrescriberQuery.execute();

    return {
      message: "Prescriber Removed",
      status: 200,
    };
  }

  async updateTelePrescriberNumber(body: any) {
    const { prescriberId, phoneNumber } = body;
    const updatePrescriberQuery = this.telePrescribersRepository
      .createQueryBuilder()
      .update(TelePrescribers)
      .set({
        Phone: phoneNumber,
        FlaggedPhoneNumber: false,
      })
      .where("Id = :prescriberId", { prescriberId });
    const result = await updatePrescriberQuery.execute();

    return {
      message: "Number Updated",
      status: 200,
    };
  }
}
