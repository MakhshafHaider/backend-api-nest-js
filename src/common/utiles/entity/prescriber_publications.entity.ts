import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PrescriberPublications {
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

  @Column({ type: "varchar", length: 5000, nullable: true })
  Authors: string;

  @Column({ default: null })
  Created_Date: Date;

  @Column({ nullable: true, default: null })
  Doctors_Name: string;

  @Column({ nullable: true, default: null })
  NPI: number;

  @Column({ type: "varchar", length: 5000, nullable: true })
  Topic: string;
}
