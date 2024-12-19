import { IsDate } from 'class-validator';
import { DeleteDateColumn } from 'typeorm';
import { TIMESTAMP_TYPE } from '@common/constants/constant';
import { BaseColumnEntity } from './base-column.entity';

export abstract class BaseSoftDeleteEntity extends BaseColumnEntity {
  @DeleteDateColumn({ name: 'deleted_at', type: TIMESTAMP_TYPE })
  @IsDate()
  deletedAt?: Date;

  async softDelete() {
    this.deletedAt = new Date();
    await this.save();
  }
}
