import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsString } from "class-validator";

@Entity()
export class Platform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;
}

export default Platform;
