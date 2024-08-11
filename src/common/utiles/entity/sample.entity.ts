import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sample {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ nullable: true })
  SalesforceId: string;

  @Column({ nullable: true })
  OwnerId: string;

  @Column({ nullable: true })
  IsDeleted: boolean;

  @Column({ nullable: true })
  Name: number; //confussion

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
  Prescriber: string;

  @Column({ nullable: true })
  Prescriber_Id: number;

  @Column({ nullable: true })
  Product_Advocate: string;

  @Column({ nullable: true })
  Product_Advocate_Id: number;

  @Column({ nullable: true, type: "text" })
  Pre_Sign: string;

  @Column({ nullable: true, type: "text" })
  Post_Sign: string;

  @Column({ nullable: true })
  Prescriber_Name: string;

  @Column({ nullable: true })
  Prescriber_Speciality: string;

  @Column({ nullable: true })
  Prescriber_Street: string;

  @Column({ nullable: true })
  Prescriber_City: string;

  @Column({ nullable: true })
  Prescriber_State: string;

  @Column({ nullable: true })
  Prescriber_Zip: number;

  @Column({ nullable: true })
  Prescriber_Phone: string;

  @Column({ nullable: true })
  Prescriber_Email: string;

  @Column({ nullable: true })
  Prescriber_Npi: string;

  @Column({ nullable: true })
  Drug: string;

  @Column({ nullable: true })
  Quantity: number;

  @Column({ nullable: true, type: "datetime" })
  Pre_Sign_Date: Date;

  @Column({ nullable: true, type: "datetime" })
  Post_Sign_Date: Date;

  @Column({ nullable: true })
  Quantity_20: number;

  @Column({ nullable: true })
  Quantity_60: number;

  @Column({ nullable: true })
  Status: string;

  @Column({ type: "decimal", precision: 17, scale: 13, nullable: true })
  Pre_Sign_Location__Latitude__s: number;

  @Column({ type: "decimal", precision: 17, scale: 13, nullable: true })
  Pre_Sign_Location__Longitude__s: number;

  @Column({ type: "decimal", precision: 17, scale: 13, nullable: true })
  Post_Sign_Location__Latitude__s: number;

  @Column({ type: "decimal", precision: 17, scale: 13, nullable: true })
  Post_Sign_Location__Longitude__s: number;
}
