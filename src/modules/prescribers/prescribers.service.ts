import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Query,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Prescriber } from "src/common/utiles/entity/prescriber.entity";
import { Repository } from "typeorm";
import { Job } from "src/common/utiles/entity/job.entity";
import { ProductAdvocateService } from "../product_advocate/product_advocate.service";
import { PrescriberAcademicDetails } from "src/common/utiles/entity/prescribers_details.entity";
import { PrescribersAffiliatedWithHospitals } from "src/common/utiles/entity/prescribers_affiliated_with_hospitals.entity";
import { PrescriberPanelledInsurance } from "src/common/utiles/entity/prescriber_panelled_insurance.entity";
import { PrescriberClinicalTrails } from "src/common/utiles/entity/prescriber_clinical_trails.entity";
import { PrescriberPracticeLocation } from "src/common/utiles/entity/prescriber_practice_location.entity";
import { PrescriberPublications } from "src/common/utiles/entity/prescriber_publications.entity";
import { PAHistory } from "src/common/utiles/entity/history.entity";
const XlsxPopulate = require("xlsx-populate");
import * as fs from "fs";
import { EmailService } from "src/common/utiles/email/email.service";
import { PrescribersList } from "src/common/utiles/entity/prescriber_list.entity";
import { PrescribersListItem } from "src/common/utiles/entity/prescribers_list_item.entity";
import { Client_Prescriber } from "src/common/utiles/entity/client_prescribers.entity";
import CallLogs from "src/common/utiles/entity/calllogs.entity";

@Injectable()
export class PrescribersService {
  constructor(
    @InjectRepository(Prescriber)
    private prescribersRepository: Repository<Prescriber>,

    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,

    @InjectRepository(PrescriberAcademicDetails)
    private prescriberAcademicDetailsRepository: Repository<PrescriberAcademicDetails>,

    @InjectRepository(PrescribersAffiliatedWithHospitals)
    private prescribersAffiliatedWithHospitalsRepository: Repository<PrescribersAffiliatedWithHospitals>,

    @InjectRepository(PrescriberClinicalTrails)
    private prescriberClinicalTrailsRepository: Repository<PrescriberClinicalTrails>,

    @InjectRepository(PrescriberPracticeLocation)
    private prescriberPracticeLocationRepository: Repository<PrescriberPracticeLocation>,

    @InjectRepository(PrescriberPanelledInsurance)
    private prescriberPanelledInsuranceRepository: Repository<PrescriberPanelledInsurance>,

    @InjectRepository(PrescriberPublications)
    private prescriberPublicationsRepository: Repository<PrescriberPublications>,

    @InjectRepository(CallLogs)
    private callLogsRepository: Repository<CallLogs>,

    @InjectRepository(PrescribersList)
    private prescribersListRepository: Repository<PrescribersList>,

    @InjectRepository(PrescribersListItem)
    private prescribersListItemRepository: Repository<PrescribersListItem>,

    @InjectRepository(PAHistory)
    private historyRepository: Repository<PAHistory>,

    @InjectRepository(Client_Prescriber)
    private clientPrescriberRepository: Repository<Client_Prescriber>,

    private productAdvocateService: ProductAdvocateService,

    private emailService: EmailService
  ) {}

  async fetchPrescribersData(body: any) {
    const { limit, page_num, state, name, is_soaanz_prescriber, clientId } =
      body;

    const records = await this.getAllPrescribers(
      page_num,
      limit,
      state,
      name,
      is_soaanz_prescriber,
      clientId
    );
    const states = await this.getStates();
    return {
      statusCode: 200,
      result: { records, states },
    };
  }

  async fetchTraingPrescribersData(body: any) {
    const { page_num, page_limit, clientId } = body;
    const prescribers = await this.getTrainingPrescribers(
      page_num,
      page_limit,
      clientId
    );
    return {
      statusCode: 200,
      prescribers,
    };
  }

  async getTrainingPrescribers(
    page: number,
    perPage: number,
    clientId: number
  ) {
    const getTraningPrescribersQuery = this.prescribersRepository
      .createQueryBuilder("prescriber")
      .innerJoin("client_prescriber", "p", "prescriber.Id = p.Prescriber_Id")
      .where("prescriber.IsTrainingDoc = 1 AND prescriber.IsDeleted = 0")
      .orderBy("prescriber.Id", "DESC");

    if (clientId > 1) {
      getTraningPrescribersQuery.andWhere("p.Client_Id = :clientId", {
        clientId,
      });
    }

    const [prescribers, count] = await getTraningPrescribersQuery
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return prescribers;
  }

  async fetchPrescriberData(body: any) {
    const { id } = body;
    const result = await this.getPrescriberData(id);
    const data = await this.getJobs(id);
    // const samplesDistributed = await this.getSamplesDistributed();
    // const updatedData = await this.getPrescriberAndProductAdvocate(data);

    return { result, jobs: data };
  }

  async getJobs(key: number) {
    const result = await this.jobsRepository.query(
      "CALL get_prescriber_jobs_by_id(?)",
      [key]
    );
    return result[0];
  }

  async getPrescriberAndProductAdvocate(records: any) {
    const filteredJobs = [];
    for (let i = 0; i < records.length; i++) {
      const job = records[i];
      const productAdvocateJobs =
        await this.productAdvocateService.getProductAdvocate(
          job.Product_Advocate_Id
        );

      const prescribersJobs = await this.getPrescriberData(job.Prescriber_Id);

      for (let j = 0; j < productAdvocateJobs.length; j++) {
        const productAdvocateJob = productAdvocateJobs[j];
        const prescriberJob = prescribersJobs[j];
        filteredJobs.push({
          ...job,
          product_advocate: productAdvocateJob,
          prescriber: prescriberJob,
        });
      }
    }

    return filteredJobs;
  }

  async getStates() {
    const queryBuilder =
      this.prescribersRepository.createQueryBuilder("prescriber");
    queryBuilder
      .select("DISTINCT(prescriber.State)", "state")
      .orderBy("prescriber.State", "ASC");
    const result = await queryBuilder.getRawMany();
    return result.map((row) => row.state);
  }

  async getCities() {
    const queryBuilder =
      this.prescribersRepository.createQueryBuilder("prescriber");
    queryBuilder
      .select("DISTINCT(prescriber.City)", "city")
      .orderBy("prescriber.City", "ASC");
    const result = await queryBuilder.getRawMany();
    return result.map((row) => row.city);
  }

  async getSpeciality() {
    const queryBuilder =
      this.prescribersRepository.createQueryBuilder("prescriber");
    queryBuilder
      .select("DISTINCT(prescriber.Speciality)", "speciality")
      .orderBy("prescriber.Speciality", "ASC");
    const result = await queryBuilder.getRawMany();
    return result.map((row) => row.speciality);
  }

  async getAllPrescribers(
    page: number,
    perPage: number,
    state: string,
    name: string,
    is_soaanz_prescriber: number,
    clientId: number
  ) {
    const queryBuilder = this.prescribersRepository
      .createQueryBuilder("prescriber")
      .innerJoin("client_prescriber", "p", "prescriber.Id = p.Prescriber_Id")
      .where("prescriber.IsTrainingDoc = 0 AND prescriber.FlaggedAddresses = 0")
      .orderBy("prescriber.Id", "DESC");

    if (clientId > 1) {
      queryBuilder.andWhere("p.Client_Id = :clientId", {
        clientId,
      });
    }

    if (state) {
      queryBuilder.andWhere("prescriber.State = :state", {
        state,
      });
    }

    if (name) {
      queryBuilder.andWhere("prescriber.Name LIKE :name", {
        name: `%${name}%`,
      });
    }

    if (is_soaanz_prescriber) {
      queryBuilder.andWhere(
        "prescriber.is_soaanz_prescriber = :is_soaanz_prescriber",
        {
          is_soaanz_prescriber,
        }
      );
    }
    const [prescribers, count] = await queryBuilder
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return { count, prescribers };
  }

  async getPrescriberName(body: any) {
    const { clientId, name } = body;
    const queryBuilder = this.prescribersRepository
      .createQueryBuilder("prescriber")
      .innerJoin("client_prescriber", "pa", "prescriber.Id = pa.Prescriber_Id")
      .orderBy("prescriber.Name", "ASC")
      .limit(20);

    if (clientId > 1) {
      queryBuilder.andWhere("pa.Client_Id = :clientId", {
        clientId,
      });
    }

    if (name) {
      queryBuilder.andWhere("prescriber.Name LIKE :name", {
        name: `%${name}%`,
      });
    }

    const states = await this.getStates();
    const cities = await this.getCities();
    const speciality = await this.getSpeciality();

    const [result] = await queryBuilder.getManyAndCount();
    return { result, states, cities, speciality };
  }

  async createPrescribersList(body: any) {
    try {
      const { name, prescriber, createdBy, city, state, speciality } = body;
      let prescribersList = [];
      const createListName = await this.createListName(name);

      if (createdBy) {
        prescribersList = prescriber;
      } else {
        const createList = await this.createListByFilters(
          city,
          state,
          speciality
        );
        prescribersList = createList;
      }
      prescribersList.map((prescriber: any) => {
        const createListItem = this.createPrescribersListItem(
          createListName.Id,
          prescriber.Id
        );
      });
      return { message: "List Created", status: 201 };
    } catch (error) {
      console.error(error);
      return { message: "List Name must be unique", status: 500 };
    }
  }

  async createTrainingPrescriber(body: any) {
    const {
      Age,
      City,
      Email,
      Experience,
      First_Name,
      Gender,
      Hospital,
      Last_Name,
      NPI,
      Phone,
      Speciality,
      State,
      Street_Address,
      Zip,
      Location__Latitude,
      Location__Longitude,
      Market_Decile,
      Professional_Concentration,
      Reverse,
      Reject,
      Dispense,
      clientId,
    } = body;

    const prescriber = new Prescriber();
    prescriber.Name = `${First_Name} ${Last_Name}`;
    prescriber.CreatedDate = new Date();
    prescriber.Age = Age;
    prescriber.City = City;
    prescriber.Email = Email;
    prescriber.Experience = Experience;
    prescriber.First_Name = First_Name;
    prescriber.Gender = Gender;
    prescriber.Hospital = Hospital;
    prescriber.Is_Active = true;
    prescriber.Last_Name = Last_Name;
    prescriber.NPI = NPI;
    prescriber.Phone = Phone;
    prescriber.Speciality = Speciality;
    prescriber.State = State;
    prescriber.Street_Address = Street_Address;
    prescriber.Zip = Zip;
    prescriber.Created_Date = new Date();
    prescriber.Location__Latitude = Location__Latitude;
    prescriber.Location__Longitude = Location__Longitude;
    prescriber.Market_Decile = Market_Decile;
    prescriber.is_soaanz_prescriber = 1;
    prescriber.Professional_Concentration = Professional_Concentration;
    prescriber.Reverse = Reverse;
    prescriber.Reject = Reject;
    prescriber.Dispense = Dispense;
    prescriber.FlaggedAddresses = false;
    prescriber.IsTrainingDoc = true;

    const createdPrescriber = await this.prescribersRepository.save(prescriber);
    const addClientPrescriber = await this.addClientPrescriber(
      createdPrescriber.Id,
      clientId
    );
    return { status: 201, message: "Prescriber Created" };
  }

  async deletePrescriber(body: any) {
    const { prescriberId, IsDeleted } = body;
    const deletePrescriberQuery = this.prescribersRepository
      .createQueryBuilder()
      .update(Prescriber)
      .set({
        IsDeleted: IsDeleted,
      })
      .where("Id = :prescriberId", { prescriberId });
    const result = await deletePrescriberQuery.execute();

    return {
      message: "Prescriber Deleted",
      status: 200,
    };
  }

  async addClientPrescriber(
    prescriberId: number,
    clientId: number
  ): Promise<Client_Prescriber> {
    const clientPrescriber = new Client_Prescriber();
    clientPrescriber.Prescriber_Id = prescriberId;
    clientPrescriber.Client_Id = clientId;
    return await this.clientPrescriberRepository.save(clientPrescriber);
  }

  async createListName(listName: string): Promise<PrescribersList> {
    const prescribersList = new PrescribersList();
    prescribersList.List_Name = listName;

    return await this.prescribersListRepository.save(prescribersList);
  }

  async createPrescribersListItem(
    prescriberListId: any,
    prescriberId: any
  ): Promise<PrescribersListItem> {
    const prescribersListItem = new PrescribersListItem();
    prescribersListItem.PrescriberList = prescriberListId;
    prescribersListItem.Prescriber = prescriberId;
    return await this.prescribersListItemRepository.save(prescribersListItem);
  }

  async createListByFilters(city: string, state: string, speciality: string) {
    const queryBuilder =
      this.prescribersRepository.createQueryBuilder("prescriber");

    if (state) {
      const state_list = state.split(",");
      const stateString = state_list.map((state) => `State = "${state}"`);
      const filteredStateStrings = stateString.join(" OR ");

      if (state_list.length > 0) {
        queryBuilder.andWhere(`(${filteredStateStrings})`);
      }
    }

    if (city) {
      const city_list = city.split(",");
      const cityString = city_list.map((city) => `City = "${city}"`);
      const filteredCityString = cityString.join(" OR ");
      if (city_list.length > 0) {
        queryBuilder.andWhere(`(${filteredCityString})`);
      }
    }

    if (speciality) {
      const speciality_list = speciality.split(",");
      const specialityString = speciality_list.map(
        (speciality) => `Speciality = "${speciality}"`
      );
      const filteredStateString = specialityString.join(" OR ");

      if (speciality.length > 0) {
        queryBuilder.andWhere(`(${filteredStateString})`);
      }
    }

    const [prescribers, count] = await queryBuilder.getManyAndCount();

    return prescribers;
  }

  async getPrescribersListName() {
    const usersQuery = this.prescribersListRepository
      .createQueryBuilder("prescribers_list")
      .select("*")
      .where("prescribers_list.Is_Deleted = 0")
      .orderBy("prescribers_list.Id", "DESC");

    const prescribersListName = await usersQuery.getRawMany();

    return { prescribersListName };
  }

  async getPrescribersList(body: any) {
    const { listId } = body;
    const usersQuery = this.prescribersListRepository
      .createQueryBuilder("prescribers_list")
      .select("*")
      .innerJoin(
        "prescribers_list_item",
        "pli",
        "prescribers_list.Id = pli.prescriberListId"
      )
      .innerJoin("prescriber", "p", "p.Id = pli.prescriberId")
      .where("pli.prescriberListId = :listId", {
        listId,
      })
      .andWhere("prescribers_list.Is_Deleted = 0")
      .andWhere("pli.Is_Deleted = 0")
      .orderBy("prescribers_list.Id", "DESC");

    const prescribersList = await usersQuery.getRawMany();

    return { prescribersList };
  }

  async deletePrescribersList(body: any) {
    const { id } = body;

    const delete_list_Query = this.prescribersListRepository
      .createQueryBuilder()
      .update(PrescribersList)
      .set({
        Is_Deleted: true,
      })
      .where("Id = :id", { id });

    await delete_list_Query.execute();

    const delete_list_items_Query = this.prescribersListRepository
      .createQueryBuilder()
      .update(PrescribersListItem)
      .set({
        Is_Deleted: true,
      })
      .where("prescriberListId = :id", { id });

    await delete_list_items_Query.execute();

    const updateCustomlist = await this.productAdvocateService.updateCustomlist(
      id
    );

    if (updateCustomlist) {
      return { status: HttpStatus.OK };
    }

    return {
      message: "List Deleted Successfully",
      status: 200,
    };
  }

  async updatePrescriber(body: any) {
    let {
      prescriber_id,
      Street_Address,
      City,
      State,
      Zip,
      Location__Latitude,
      Location__Longitude,
    } = body;
    const query = this.prescribersRepository
      .createQueryBuilder()
      .update(Prescriber)
      .set({
        Street_Address: Street_Address,
        City: City,
        State: State,
        Zip: Zip,
        FlaggedAddresses: false,
        Location__Latitude: Location__Latitude,
        Location__Longitude: Location__Longitude,
      })
      .where("Id = :prescriber_id", { prescriber_id });
    const result = await query.execute();
    return {
      result: result,
      message: "Address Updated",
      status: HttpStatus.OK,
    };
  }

  async updatePrescriberVisitCount(prescriberId: number) {
    const query = this.prescribersRepository
      .createQueryBuilder()
      .update(Prescriber)
      .set({
        VisitCount: () => "VisitCount + 1",
      })
      .where("Id = :prescriberId", { prescriberId });
    const result = await query.execute();
    if (result) {
      return result;
    }
    return false;
  }

  async updateFlaggedAddresses(body: any) {
    let { prescriber_id, FlaggedAddressComment } = body;
    const query = this.prescribersRepository
      .createQueryBuilder()
      .update(Prescriber)
      .set({
        FlaggedAddresses: true,
        FlaggedDate: new Date(),
        FlaggedAddressComment: FlaggedAddressComment,
      })
      .where("Id = :prescriber_id", { prescriber_id });

    const result = await query.execute();
    return {
      result: result.affected,
      message: "Address Flag Updated",
      status: HttpStatus.OK,
    };
  }

  // will be changed from mobile.
  async updateFlaggedAddress(body: any) {
    let { prescriber_id, flagged } = body;
    const query = this.prescribersRepository
      .createQueryBuilder()
      .update(Prescriber)
      .set({
        FlaggedAddresses: flagged,
      })
      .where("Id = :prescriber_id", { prescriber_id });

    const result = await query.execute();
    return {
      result: result.affected,
      message: "Address Flag Updated",
      status: HttpStatus.OK,
    };
  }

  async getPrescribersFlaggedAddresses(body: any) {
    const { clientId } = body;
    const query = this.prescribersRepository
      .createQueryBuilder("prescriber")
      .innerJoin("client_prescriber", "p", "prescriber.Id = p.Prescriber_Id")
      .where("FlaggedAddresses = true AND IsDeleted = 0")
      .orderBy("FlaggedDate", "DESC");

    if (clientId > 1) {
      query.andWhere("p.Client_Id = :clientId", {
        clientId,
      });
    }
    const [result, count] = await query.getManyAndCount();
    return {
      prescribers: result,
      status: HttpStatus.OK,
    };
  }

  async getJobsDoneBasedOnPrescriberId(id: number) {
    const query = this.jobsRepository
      .createQueryBuilder("job")
      .where("Prescriber_Id = :id", { id });
    const [result, count] = await query.getManyAndCount();
    return result;
  }

  async getPrescriber(body: any) {
    const { id } = body;

    const prescriber = await this.getPrescriberData(id);
    if (prescriber) {
      return { prescriber, status: HttpStatus.OK };
    }
  }

  getPrescriberData(Id: number) {
    return this.prescribersRepository.find({
      where: {
        Id: Id,
      },
    });
  }

  getPrescriberById(SalesforceId: string) {
    return this.prescribersRepository.find({
      where: {
        SalesforceId: SalesforceId,
      },
    });
  }

  async getAll(body: any, productAdvocateId: string = "") {
    let { latitude, longitude, radius, show_all } = body;

    longitude = longitude > 0 ? longitude * -1 : longitude;
    const productAdvocate =
      await this.productAdvocateService.getProductAdvocateByEmail(
        productAdvocateId
      );
    const product_advocate_id = productAdvocate[0]?.Id || null;
    const CustomListId = product_advocate_id
      ? await this.productAdvocateService.checkIfCustomListIsAttached(
          product_advocate_id
        )
      : 0;

    const getResult = async () =>
      CustomListId != null && CustomListId > 0
        ? this.getAllPrescriberWithinRadius_CustomList_Filetered(
            CustomListId,
            latitude,
            longitude,
            radius
          )
        : this.getAllPrescriberWithinRadius(latitude, longitude, radius);

    if (show_all) {
      const result = await getResult();
      return {
        result,
        status: HttpStatus.OK,
      };
    } else {
      const prescriber = await this.jobsRepository.query(
        "CALL get_prescriber_jobs_for_address()"
      );

      let excludeAddressSet = new Set();
      let excludedLatLongSet = new Set();

      if (prescriber) {
        prescriber[0].forEach((record: any) => {
          excludeAddressSet.add(record.Street_Address.toLowerCase());
          excludedLatLongSet.add(
            record.Location__Latitude + ":" + record.Location__Longitude
          );
        });
      }

      const result = await getResult();

      const newJobsList = result
        ? result.filter(
            (x) =>
              !excludeAddressSet.has(x.Street_Address.toLowerCase()) &&
              !excludedLatLongSet.has(
                x.Location__Latitude + ":" + x.Location__Longitude
              )
          )
        : [];

      return {
        result: newJobsList,
        status: HttpStatus.OK,
      };
    }
  }

  // async getAll(body: any) {
  //   const { latitude, longitude, radius, show_all } = body;
  //   const excludeAddressList = [];
  //   const newJobsList = [];

  //   if (show_all) {
  //     const result = await this.getAllPrescriberWithinRadius(
  //       latitude,
  //       longitude,
  //       radius
  //     );
  //     return {
  //       result,
  //       status: HttpStatus.OK,
  //     };
  //   } else {
  //     const prescriber = await this.jobsRepository.query(
  //       "CALL get_prescriber_jobs_for_address()"
  //     );
  //     if (prescriber) {
  //       prescriber[0].forEach((record: any) => {
  //         excludeAddressList.push(record.Street_Address);
  //       });
  //     }
  //     const result = await this.getAllPrescriberWithinRadius(
  //       latitude,
  //       longitude,
  //       radius
  //     );
  //     if (result) {
  //       result.forEach((record) => {
  //         if (excludeAddressList.includes(record["Street_Address"])) {
  //           console.log("needs to ignore");
  //         } else {
  //           newJobsList.push(record);
  //         }
  //       });
  //     }
  //     return {
  //       result: newJobsList,
  //       status: HttpStatus.OK,
  //     };
  //   }
  // }

  radians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  calculateDistance(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
  ) {
    const earthRadius = 3959; // in miles

    const lat1 = this.radians(latitude1);
    const lon1 = this.radians(longitude1);
    const lat2 = this.radians(latitude2);
    const lon2 = this.radians(longitude2);

    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;

    const a =
      Math.sin(dlat / 2) * Math.sin(dlat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
  }

  async getAllPrescriberWithinRadius(
    latitude: number,
    longitude: number,
    radius: number
  ) {
    const prescriber = await this.prescribersRepository
      .createQueryBuilder("prescriber")
      .addSelect(
        `(3959 * acos(cos(radians(${latitude})) * cos(radians(Location__Latitude)) * cos(radians(Location__Longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(Location__Latitude))))`,
        "distance"
      )
      .where("prescriber.VisitCount < 5")
      .having(`distance < ${radius}`)
      .orderBy("distance")
      .getMany();

    return prescriber;
  }

  async getAllPrescriberWithinRadius_CustomList_Filetered(
    id: number,
    latitude: number,
    longitude: number,
    radius: number
  ) {
    const prescriber = await this.prescribersRepository
      .createQueryBuilder("prescriber")
      .addSelect(
        `(3959 * acos(cos(radians(${latitude})) * cos(radians(Location__Latitude)) * cos(radians(Location__Longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(Location__Latitude))))`,
        "distance"
      )
      .innerJoin(
        "prescribers_list",
        "pl",
        `pl.Id = ${id} AND pl.Is_Deleted = 0`
      )
      .innerJoin(
        "prescribers_list_item",
        "pli",
        `pli.prescriberId = prescriber.Id AND pli.prescriberListId = ${id} AND pli.Is_Deleted = 0`
      )
      .where("prescriber.VisitCount < 5")
      .having(`distance < ${radius}`)
      .orderBy("distance")
      .getMany();

    return prescriber;
  }

  async getPrescriberFeedback(body: any) {
    const { prescriber_id } = body;
    const query = this.historyRepository
      .createQueryBuilder("pa_history")
      .where("Prescriber_Id = :prescriber_id", { prescriber_id });

    const pa_history = await query.getOne();
    if (pa_history) {
      return pa_history;
    } else {
      return {
        statusCode: 404,
        message: "Record Not Found",
      };
    }
  }

  async prescriberAssociatedData(body: any) {
    const { id } = body;
    const associated_data = [];
    const academic_details = await this.getAcademicDetails(id);
    if (academic_details) {
      associated_data.push(academic_details);
    }

    const affiliated_details = await this.getAffiliatedDetails(id);
    if (affiliated_details) {
      associated_data.push(affiliated_details);
    }

    const insurance_details = await this.getInsuranceDetails(id);
    if (insurance_details) {
      associated_data.push(insurance_details);
    }

    const prescriber_clinical_trails = await this.getClinicalTrialsDetails(id);
    if (prescriber_clinical_trails) {
      associated_data.push(prescriber_clinical_trails);
    }

    const prescriber_practice_location = await this.getPracticeLocationDetails(
      id
    );
    if (prescriber_practice_location) {
      associated_data.push(prescriber_practice_location);
    }

    const prescriber_publications = await this.getPublicationDetails(id);
    if (prescriber_publications) {
      associated_data.push(prescriber_publications);
    }

    return {
      associated_data,
      status: HttpStatus.OK,
    };
  }

  async getAcademicDetails(id: number) {
    const query = this.prescriberAcademicDetailsRepository
      .createQueryBuilder("prescriber_academic_details")
      .where("Id = :id", { id });

    const academic_details = await query.getOne();
    return academic_details;
  }

  async getAffiliatedDetails(id: number) {
    const query = this.prescribersAffiliatedWithHospitalsRepository
      .createQueryBuilder("prescribers_affiliated_with_hospitals")
      .where("Id = :id", { id });

    const affiliated_details = await query.getOne();
    return affiliated_details;
  }

  async getInsuranceDetails(id: number) {
    const query = this.prescriberPanelledInsuranceRepository
      .createQueryBuilder("prescriber_panelled_insurance")
      .where("Id = :id", { id });

    const insurance_details = await query.getOne();
    return insurance_details;
  }

  async getClinicalTrialsDetails(id: number) {
    const query = this.prescriberClinicalTrailsRepository
      .createQueryBuilder("prescriber_clinical_trails")
      .where("Id = :id", { id });

    const prescriber_clinical_trails = await query.getOne();
    return prescriber_clinical_trails;
  }

  async getPracticeLocationDetails(id: number) {
    const query = this.prescriberPracticeLocationRepository
      .createQueryBuilder("prescriber_practice_location")
      .where("Id = :id", { id });

    const prescriber_practice_location = await query.getOne();
    return prescriber_practice_location;
  }

  async getPublicationDetails(id: number) {
    const query = this.prescriberPublicationsRepository
      .createQueryBuilder("prescriber_publications")
      .where("Id = :id", { id });

    const prescriber_publications = await query.getOne();
    return prescriber_publications;
  }

  async emailCurrentPrescriber(body: any) {
    const { latitude, longitude, radius, show_all, user_id, email } = body;
    const excludeAddressList = [];
    const newJobsList = [];

    if (show_all) {
      const result = await this.getAllPrescriberWithinRadius(
        latitude,
        longitude,
        radius
      );
      return {
        result,
        status: HttpStatus.OK,
      };
    } else {
      const prescriber = await this.jobsRepository.query(
        "CALL get_prescriber_jobs_for_address()"
      );

      if (prescriber) {
        prescriber[0].forEach((record: any) => {
          excludeAddressList.push(record.Street_Address);
        });
      }
      const result = await this.getAllPrescriberWithinRadius(
        latitude,
        longitude,
        radius
      );
      if (result) {
        result.forEach((record) => {
          if (excludeAddressList.includes(record["Street_Address"])) {
            console.log("needs to ignore");
          } else {
            newJobsList.push(record);
          }
        });
      }
      if (newJobsList) {
        const filePath = `uploads/Expenses` + user_id.toString() + `.xlsx`;
        const workbook = await XlsxPopulate.fromBlankAsync();
        const new_list = newJobsList.sort((a, b) =>
          a.Name.split(" ").pop().localeCompare(b.Name.split(" ").pop())
        );

        new_list.forEach((record, index) => {
          const address = `${record.Street_Address}, ${record.City}, ${record.State}, ${record.Zip}`;
          workbook
            .sheet(0)
            .cell(`A${index + 1}`)
            .value(record.Name);
          workbook
            .sheet(0)
            .cell(`B${index + 1}`)
            .value(record.Speciality);
          workbook
            .sheet(0)
            .cell(`C${index + 1}`)
            .value(address);
        });

        workbook.toFileAsync(filePath).then(async () => {
          const fileContent = fs.readFileSync(filePath);
          const attachedFile = {
            content: fileContent,
            filename: "attachment.xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            disposition: "attachment",
          };

          const mailSubject = "Doctors list";
          const content = "<strong>PFA</strong>";
          await this.emailService.sendPrescribersListEmail(
            email,
            mailSubject,
            content,
            attachedFile
          );
        });
        return {
          result: "Email Sent",
          status: HttpStatus.OK,
        };
      } else {
        return {
          result: "Error",
          status: HttpStatus.NOT_FOUND,
        };
      }
    }
  }
}
