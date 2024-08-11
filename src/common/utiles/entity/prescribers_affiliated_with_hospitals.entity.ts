import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PrescribersAffiliatedWithHospitals {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  SalesforceId: string;

  @Column()
  OwnerId: string;

  @Column()
  IsDeleted: boolean;

  @Column()
  Name: string;

  @Column()
  CreatedDate: Date;

  @Column()
  CreatedById: string;

  @Column()
  LastModifiedDate: Date;

  @Column()
  LastModifiedById: string;

  @Column()
  SystemModstamp: Date;

  @Column({ nullable: true })
  City: string;

  @Column({ nullable: true })
  Doctors_Name: string;

  @Column({ nullable: true })
  Hospital_Type: string;

  @Column()
  NPI: number;

  @Column({ nullable: true })
  Ownership: string;

  @Column({ nullable: true })
  State: string;

  @Column({ nullable: true })
  Created_Date: Date;
}
