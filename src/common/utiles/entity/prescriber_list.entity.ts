import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { PrescribersListItem } from "./prescribers_list_item.entity";

@Entity()
export class PrescribersList {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  List_Name: string;

  @Column({ default: 0 })
  Is_Deleted: boolean;

  @OneToMany((type) => PrescribersListItem, (item) => item.PrescriberList)
  PrescribersListItem: PrescribersListItem[];
}
