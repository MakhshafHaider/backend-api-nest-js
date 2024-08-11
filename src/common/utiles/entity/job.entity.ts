import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Prescriber } from "./prescriber.entity";

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ nullable: true })
  SalesforceId: string;

  @Column({ nullable: true })
  OwnerId: string;

  @Column({ nullable: true })
  IsDeleted: boolean;

  @Column({ nullable: true })
  Name: string;

  @Column({ nullable: true })
  CreatedDate: Date;

  @Column({ nullable: true })
  CreatedById: string;

  @Column({ nullable: true })
  LastModifiedDate: Date;

  @Column({ nullable: true })
  LastModifiedById: string;

  @Column({ nullable: true })
  SystemModstamp: Date;

  @Column({ nullable: true })
  Appointment_Date_Time: Date;

  @Column({ nullable: true })
  Client: string;

  @Column({ nullable: true })
  Cost: number;

  @Column({ nullable: true })
  Drug: string;

  @Column({ nullable: true })
  Drug_Id: number;

  @Column({ nullable: true, type: "decimal", precision: 15, scale: 7 })
  Location__Latitude: number;

  @Column({ nullable: true, type: "decimal", precision: 15, scale: 7 })
  Location__Longitude: number;

  @Column({ nullable: true })
  Logo: string;

  @Column({ nullable: true })
  Materials_Received_Date: Date;

  @Column({ nullable: true })
  Materials_Shipped_Date: Date;

  @Column({ nullable: true })
  Problem_Occurred: string;

  @Column({ nullable: true })
  Status: string;

  @Column({ nullable: true })
  Prescriber: string;

  @Column({ nullable: true })
  Prescriber_Id: number;

  @Column({ nullable: true })
  Product_Advocate: string;

  @Column({ nullable: true })
  Product_Advocate_Id: number;

  @Column({ nullable: true })
  question_1: boolean;

  @Column({ nullable: true })
  question_2: string;

  @Column({ nullable: true })
  feedback_submitted_at: Date;

  @Column({ nullable: true })
  question_3: boolean;

  @Column({ nullable: true })
  question_4: boolean;

  @Column({ nullable: true })
  question_5: boolean;

  @Column({ nullable: true })
  question_6: boolean;

  @Column({ nullable: true })
  question_7: boolean;

  @Column({ nullable: true })
  question_7A: string;

  @Column({ nullable: true })
  question_8: boolean;

  @Column({ nullable: true })
  question_9: boolean;

  @Column({ nullable: true })
  question_10: boolean;

  @Column({ nullable: true })
  question_11: boolean;

  @Column({ nullable: true })
  question_12: boolean;

  @Column({ nullable: true })
  question_12A: string;

  @Column({ nullable: true })
  question_12B: string;

  @Column({ nullable: true })
  question_12C: string;

  @Column({ nullable: true })
  question_13: boolean;

  @Column({ nullable: true })
  question_13A: Date;

  @Column({ type: "varchar", length: 500, nullable: true })
  question_14: string;

  @Column({ nullable: true })
  question_l_1A: string;

  @Column({ nullable: true })
  question_l_1B: string;

  @Column({ nullable: true })
  question_l_2: number;

  @Column({ nullable: true })
  question_l_4: string;

  @Column({ nullable: true })
  question_l_0: Date;

  @Column({ nullable: true })
  question_l_1C: number;

  @Column({ nullable: true })
  question_l_1D: string;

  @Column({ nullable: true })
  difference_location_doctor: string;

  @Column({ nullable: true, type: "decimal", precision: 15, scale: 7 })
  Distance_To_Doctor: number;

  @Column({ nullable: true })
  selected_far_doctor: boolean;

  @Column({ nullable: true, type: "decimal", precision: 15, scale: 7 })
  Time_Spent_At_Job: number;

  @ManyToOne(() => Prescriber, (prescriber) => prescriber.jobs)
  prescribers: Prescriber[];
}
