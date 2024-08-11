import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsString, Length } from "class-validator";
import { User } from "./user.entity";

@Entity()
export class Login {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(1, 255)
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  isLoggedIn: boolean;

  @Column({ nullable: true })
  timeOut: Date;

  @Column({ nullable: true })
  token: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @Column()
  userId: number;
}

export default Login;
