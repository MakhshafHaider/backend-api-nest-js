import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { Job } from "./job.entity";
import { PrescribersListItem } from "./prescribers_list_item.entity";

@Entity()
export class Prescriber {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ nullable: true })
  SalesforceId: string;

  @Column({ nullable: true })
  OwnerId: string;

  @Column({ default: false })
  IsDeleted: boolean;

  @Column({ nullable: true })
  Name: string;

  @Column({ type: "datetime" })
  CreatedDate: Date;

  @Column()
  CreatedById: string;

  @Column({ type: "datetime" })
  LastModifiedDate: Date;

  @Column({ nullable: true })
  LastModifiedById: string;

  @Column({ type: "datetime" })
  SystemModstamp: Date;

  @Column({ nullable: true })
  Age: number;

  @Column({ nullable: true })
  City: string;

  @Column({ nullable: true })
  Credential: string;

  @Column({ nullable: true })
  Description: string;

  @Column({ nullable: true })
  Email: string;

  @Column({ nullable: true })
  Experience: string;

  @Column({ nullable: true })
  Fax: string;

  @Column({ nullable: true })
  First_Name: string;

  @Column({ nullable: true })
  Gender: string;

  @Column()
  Hospital: string;

  @Column()
  Is_Active: boolean;

  @Column({ nullable: true })
  Job: string;

  @Column({ nullable: true })
  Last_Name: string;

  @Column({ nullable: true })
  Major_Ethnicity: string;

  @Column({ nullable: true })
  Middle_Name: string;

  @Column({ nullable: true, unique: true })
  NPI: number;

  @Column({ nullable: true })
  Ownership: string;

  @Column({ nullable: true })
  Phone: string;

  @Column({ nullable: true })
  Profile_Picture: string;

  @Column({ nullable: true })
  Rating: string;

  @Column({ nullable: true })
  Speciality: string;

  @Column({ nullable: true })
  State: string;

  @Column({ nullable: true })
  Street_Address: string;

  @Column({ nullable: true })
  URL: string;

  @Column({ nullable: true })
  Zip: string;

  @Column({ type: "datetime", nullable: true })
  Created_Date: Date;

  @Column({ type: "decimal", precision: 15, scale: 7 })
  Location__Latitude: number;

  @Column({ type: "decimal", precision: 15, scale: 7 })
  Location__Longitude: number;

  @Column({ nullable: true })
  Market_Decile: number;

  @Column({ nullable: true })
  Furosemide_Trx: number;

  @Column({ default: 0 })
  is_soaanz_prescriber: number;

  @Column({ nullable: true })
  Professional_Concentration: string;

  @Column({ nullable: true })
  Reverse: string;

  @Column({ nullable: true })
  Reject: string;

  @Column({ nullable: true })
  Dispense: string;

  @Column({ default: false })
  FlaggedAddresses: boolean;

  @Column({ default: null })
  FlaggedAddressComment: string;

  @Column({ default: false })
  IsTrainingDoc: boolean;

  @Column({ default: 0 })
  VisitCount: number;

  @Column({ type: "datetime" })
  FlaggedDate: Date;

  @OneToMany((type) => Job, (job) => job.prescribers)
  jobs: Job[];

  @OneToMany((type) => PrescribersListItem, (item) => item.PrescriberList)
  PrescribersList: PrescribersListItem;
}
