import { IsOptional } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Appointment {
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
  Status?: boolean;

  @Column()
  Date_Time: Date;

  @Column({ nullable: true })
  Epoch_Time: Date;

  @Column({ nullable: true })
  @IsOptional()
  Reason?: string;

  @Column({ nullable: true })
  @IsOptional()
  Appointment_Type: string;

  @Column({ nullable: true })
  @IsOptional()
  Job?: string;

  @Column({ nullable: true })
  Product_Advocate?: string;
}
