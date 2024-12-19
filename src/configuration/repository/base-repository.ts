/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NotFoundException } from '@nestjs/common';
import * as _ from 'lodash';
import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { LIMIT_GET_ALL } from '@common/constants/constant';
import { NOT_FOUND } from '@common/constants/error-messages';
import { SortType } from '@common/enums/common.enum';

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(type: EntityTarget<T>, dataSource: DataSource) {
    super(type, dataSource.createEntityManager());
  }

  findOneByCondition(
    condition: object | [],
    select?: string[],
  ): Promise<T | undefined> {
    // @ts-ignore
    return this.findOne({ where: condition, select });
    /**
     * return this.findOneBy(condition);
     */
  }

  findOneByConditionSortCreatedAt(condition: object): Promise<T | undefined> {
    // @ts-ignore
    return this.findOne({
      // @ts-ignore
      where: condition,
      // @ts-ignore
      order: { created_at: SortType.DESC },
    });
  }

  private getConditionForFind(
    condition: object,
    order?: { field: string; type: SortType },
    offset?: number,
    limit?: number,
  ) {
    const query = { where: condition };
    if (order) {
      query['order'] = {};
      query['order'][order.field] = order.type;
    }
    if (offset) {
      query['offset'] = offset;
    }
    if (limit) {
      query['limit'] = limit;
    }
    return query;
  }

  findByCondition(
    condition: object,
    order?: { field: string; type: SortType },
    offset?: number,
    limit?: number,
  ): Promise<T[] | undefined> {
    const query = this.getConditionForFind(condition, order, offset, limit);
    // @ts-ignore
    return this.find(query);
  }

  findByConditionWithDeleted(
    condition: object,
    order?: { field: string; type: SortType },
    offset?: number,
    limit?: number,
  ): Promise<T[] | undefined> {
    const query = this.getConditionForFind(condition, order, offset, limit);
    query['withDeleted'] = true;
    // @ts-ignore
    return this.find(query);
  }

  findOneByConditionWithDeleted(condition: object): Promise<T | undefined> {
    return this.findOne({
      // @ts-ignore
      where: condition,
      withDeleted: true,
      // @ts-ignore
      order: { created_at: 'DESC' },
    });
  }

  findOneByConditionWithDeletedSortCreatedAt(
    condition: object,
  ): Promise<T | undefined> {
    return this.findOne({
      // @ts-ignore
      where: condition,
      withDeleted: true,
      // @ts-ignore
      order: { created_at: SortType.DESC },
    });
  }

  async updateOne(
    conditions: FindOptionsWhere<T>,
    data: Partial<T>,
  ): Promise<void> {
    await this.update(conditions, data);
  }
  async updateMany(
    conditions: FindOptionsWhere<T>,
    data: Partial<T>,
  ): Promise<void> {
    await this.update(conditions, data);
  }

  async findOneByIdValid(id: number | string): Promise<T | undefined> {
    const rs = await this.findOneByCondition({ id });
    if (!rs) throw new NotFoundException(NOT_FOUND);
    return rs;
  }
  async findListByCondition(
    condition: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    skip: number,
    take: number,
    order?: any,
    // select?: string[],
    // relations?: string[],
  ): Promise<Array<T | undefined>> {
    return this.find({
      where: condition,
      skip,
      take,
      order,
    });
  }
  createData(input: T): Promise<T> {
    return this.save(input);
  }
  async countByConditions(conditions: { key: string; value: object }[]) {
    const query = this.createQueryBuilder(this.metadata.tableName).select([
      'count(id) as c',
    ]);
    for (const condition of conditions) {
      query.andWhere(condition.key, condition.value);
    }
    const result = await query.getRawOne();
    if (!result) {
      return 0;
    }
    return result['c'];
  }

  async countByConditionsWithDelete(
    conditions: { key: string; value: object }[],
  ) {
    const query = this.createQueryBuilder(this.metadata.tableName).select([
      'count(id) as c',
    ]);
    for (const condition of conditions) {
      query.andWhere(condition.key, condition.value);
    }
    query.withDeleted();
    const result = await query.getRawOne();
    if (!result) {
      return 0;
    }
    return result['c'];
  }

  async findListByIdsAndSelectField(
    input: number[],
    select?: string[],
    key: string = 'id',
  ) {
    let result = [];
    const limit = LIMIT_GET_ALL;
    let payload = _.cloneDeep(input);
    payload = payload.filter((v, i) => payload.findIndex((u) => u === v) === i);

    while (true) {
      const rowQueue = payload.splice(0, limit);
      if (!rowQueue.length) break;
      const data = await this.find({
        where: { [key]: In(rowQueue) } as any,
        select,
      });
      if (!data?.length) break;
      result = result.concat(data);
      if (data?.length < limit) break;
    }
    return result;
  }

  async findListByConditionAndSelectField(
    condition: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    select?: string[],
  ): Promise<Array<T | undefined>> {
    return this.find({
      where: condition,
      select,
    });
  }
}
