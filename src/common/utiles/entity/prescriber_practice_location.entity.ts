import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PrescriberPracticeLocation {
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
  Doctors_Name: string;

  @Column({ nullable: true })
  NPI: number;

  @Column({ nullable: true })
  Phone_Number: string;

  @Column({ nullable: true })
  State: string;

  @Column({ nullable: true })
  Street_Address: string;

  @Column({ nullable: true })
  Zip: number;
}
