import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
export class Client_PA {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  IsEnabled: boolean;

  @Column()
  Product_Advocate_Id: number;

  @Column()
  Client_Id: number;
}
