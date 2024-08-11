import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IsOptional } from "class-validator";

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ nullable: true })
  SalesforceId: string;

  @Column({ nullable: true })
  OwnerId: string;

  @Column({ nullable: true })
  IsDeleted: boolean;

  @Column({ nullable: true })
  Name: string;

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
  @IsOptional()
  Logo?: string;

  @Column({ nullable: true })
  Primary_Account_Owner: string;
}
