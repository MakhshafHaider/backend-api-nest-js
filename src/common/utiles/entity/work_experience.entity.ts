import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WorkExperience {
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

  @Column({ nullable: true })
  Experience_Details: string;

  @Column({ nullable: true })
  Product_Advocate_Id: string;

  @Column({ nullable: true })
  Year: string;
}
