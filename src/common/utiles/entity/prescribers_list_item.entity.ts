import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { PrescribersList } from "./prescriber_list.entity";
import { Prescriber } from "./prescriber.entity";

@Entity()
export class PrescribersListItem {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ default: 0 })
  Is_Deleted: boolean;

  @ManyToOne(() => PrescribersList, (list) => list.PrescribersListItem)
  PrescriberList: PrescribersList[];

  @ManyToOne(() => Prescriber, (list) => list.PrescribersList)
  Prescriber: Prescriber[];
}
