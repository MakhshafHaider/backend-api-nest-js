import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsOptional } from "class-validator";

@Entity()
export class Drug {
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
  @IsOptional()
  Class?: string;

  @Column({ nullable: true })
  @IsOptional()
  Client?: string;

  @Column({ nullable: true })
  @IsOptional()
  Contra_Indication?: string;

  @Column({ nullable: true })
  @IsOptional()
  Description?: string;

  @Column({ nullable: true })
  @IsOptional()
  Dosage_Form?: string;

  @Column({ nullable: true })
  @IsOptional()
  Generic_Name?: string;

  @Column({ nullable: true })
  @IsOptional()
  Logo?: string;

  @Column({ nullable: true })
  @IsOptional()
  Prescriber_Information_Link?: string;

  @Column({ nullable: true })
  @IsOptional()
  Strengths?: string;

  @Column({ nullable: true })
  @IsOptional()
  Video_Link?: string;

  @Column({ nullable: true })
  @IsOptional()
  Job?: string;

  @Column({ nullable: true })
  @IsOptional()
  NDC?: string;
}
