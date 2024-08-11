import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductAdvocate {
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
  Active: string;

  @Column({ nullable: true })
  Banking_Information: string;

  @Column({ nullable: true })
  Device_Token: string;

  @Column()
  Email: string;

  @Column({ nullable: true })
  License: string;

  @Column({ nullable: true })
  Location: string;

  @Column({ nullable: true })
  Admin: number;

  @Column({ type: "longtext", nullable: true })
  Profile_Picture: string;

  @Column({ nullable: true })
  Region: string;

  @Column({ nullable: true })
  Phone: string;

  @Column({ nullable: true })
  Preview: string;

  @Column({ nullable: true })
  SubView: string;

  @Column({ nullable: true })
  CustomList: number;

  @Column({ nullable: true })
  Stock_20: number;

  @Column({ nullable: true })
  Stock_60: number;
}
