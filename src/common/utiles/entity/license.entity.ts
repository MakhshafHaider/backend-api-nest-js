import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class License {
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
  License_Number: string;

  @Column({ nullable: true })
  License_Type: string;

  @Column({ nullable: true })
  State: string;
}
