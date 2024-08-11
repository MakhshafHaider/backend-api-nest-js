import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsString, Length } from "class-validator";
import Platform from "./platform.entity";

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(1, 255)
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Platform, { nullable: false })
  @JoinColumn()
  platform: Platform;

  @Column()
  platformId: number;
}

export default Roles;
