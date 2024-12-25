import { BaseRepository } from '@configuration/repository/base-repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MailDetail } from '../entities/mail-detail.entity';

@Injectable()
export class MailDetailRepository extends BaseRepository<MailDetail> {
  constructor(dataSource: DataSource) {
    super(MailDetail, dataSource);
  }
}
