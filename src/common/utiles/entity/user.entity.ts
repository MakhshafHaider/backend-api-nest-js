import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";
import { Roles } from "./roles.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsString()
  @Length(1, 255)
  last_name: string;

  @Column({ nullable: true })
  @IsString()
  @Length(1, 255)
  first_name: string;

  @Column({ nullable: true })
  @IsString()
  @Length(1, 255)
  name: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value || "").toString())
  @IsString()
  @Length(10, 20)
  @IsNotEmpty()
  mobile: string;

  @Column({ nullable: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  is_active: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: null, nullable: true })
  token: string;

  @Column({ default: false })
  company_name: string;

  @ManyToOne(() => Roles)
  @JoinColumn()
  role: Roles;

  @Column({ default: 1 })
  roleId: number;

  @Column({ default: 1 })
  clientId: number;
}
