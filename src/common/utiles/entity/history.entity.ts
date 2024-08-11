import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PAHistory {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ default: null })
  SalesforceId: string;

  @Column({ default: null })
  OwnerId: string;

  @Column({ default: null })
  IsDeleted: boolean;

  @Column({ default: null })
  Name: string;

  @Column({ default: null })
  CreatedDate: Date;

  @Column({ default: null })
  CreatedById: string;

  @Column({ default: null })
  LastModifiedDate: Date;

  @Column({ default: null })
  LastModifiedById: string;

  @Column({ default: null })
  SystemModstamp: Date;

  @Column({ default: null })
  Date_Time: Date;

  @Column({ default: null })
  Note: string;

  @Column({ default: null, nullable: true })
  Job: string;

  @Column({ default: null, nullable: true })
  Prescriber_Id: string;

  @Column({ default: null, nullable: true })
  Product_Advocate_Id: string;

  @Column({
    type: "decimal",
    precision: 15,
    scale: 7,
    default: null,
    nullable: true,
  })
  PA_Location__Latitude: number;

  @Column({
    type: "decimal",
    precision: 15,
    scale: 7,
    default: null,
    nullable: true,
  })
  PA_Location__Longitude: number;
}
