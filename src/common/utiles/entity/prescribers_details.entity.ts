import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PrescriberAcademicDetails {
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

  @Column()
  Doctors_Name: string;

  @Column()
  NPI: number;

  @Column()
  University_Name: string;

  @Column()
  University_Type: string;

  @Column({ nullable: true })
  Year_Degree_Awarded: number;

  @Column()
  Created_Date: Date;
}
