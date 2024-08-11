import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FaxLogs {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  faxNumber: string;
  
  @Column('bigint')
  faxId: BigInt

  @Column()
  status: string;

}

