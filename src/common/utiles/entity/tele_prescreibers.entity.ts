import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TelePrescribers {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ nullable: true, unique: true })
  NPI: number;

  @Column({ nullable: true })
  Last_Name: string;

  @Column({ nullable: true })
  First_Name: string;

  @Column({ nullable: true })
  Street_Address: string;

  @Column({ nullable: true })
  City: string;

  @Column({ nullable: true })
  State: string;

  @Column({ nullable: true })
  Zip: number;

  @Column({ nullable: true })
  Fax: string;

  @Column({ nullable: true })
  Phone: string;

  @Column({ nullable: true })
  F_TRX: number;

  @Column({ nullable: true })
  Decile: number;

  @Column({ nullable: true })
  Specialty: string;

  @Column({ nullable: true })
  FlagDisposition: string;

  @Column({ nullable: true })
  TeleMarkterId: number;

  @Column({ nullable: true })
  isSoaanzPrescriber: boolean;

  @Column({ nullable: true })
  MeetingDate: Date;

  @Column({ default: false })
  isOnCall: boolean;

  @Column({ default: false })
  FlaggedPhoneNumber: boolean;

  @Column({ default: false })
  IsDeleted: boolean;

  @Column({ type: "datetime", nullable: true })
  FlaggedPhoneNumberDate: Date;
}
