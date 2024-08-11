import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CallLogs {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ nullable: true })
  TelemarketerId: number;

  @Column()
  PrescriberId: number;

  @Column({ nullable: true })
  LoggedDate: Date;

  @Column({ default: null })
  CallTime: number;

  @Column({ default: null })
  CallReceiverName: string;

  @Column({ default: null })
  CallReceiverPosition: string;

  @Column({ default: null })
  CallDisposition: string;

  @Column({ default: null })
  CallFeedback: string;

  @Column({ default: false })
  isAvailable: boolean;
}

export default CallLogs;
