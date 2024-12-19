import { TIMESTAMP_TYPE } from "@common/constants/constant";
import { IsDate } from "class-validator";
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity as TypeORMBaseEntity,
} from "typeorm";

export abstract class BaseColumnEntity extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "created_at",
    type: TIMESTAMP_TYPE,
    default: () => "CURRENT_TIMESTAMP",
  })
  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  @IsDate()
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: TIMESTAMP_TYPE,
    default: () => "CURRENT_TIMESTAMP",
  })
  @UpdateDateColumn({ type: TIMESTAMP_TYPE })
  @IsDate()
  updatedAt: Date;
}
