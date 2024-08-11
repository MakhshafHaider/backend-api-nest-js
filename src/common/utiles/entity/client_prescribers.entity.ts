import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client_Prescriber {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Prescriber_Id: number;

  @Column({ default: 1 })
  Client_Id: number;
}
