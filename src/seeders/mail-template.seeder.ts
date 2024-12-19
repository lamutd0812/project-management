import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { DataSource } from 'typeorm';

@Injectable()
export class MailTemplateSeeder implements Seeder {
  constructor(private connection: DataSource) {}

  private dataRef: string[] = [];

  async seed(): Promise<any> {
    // console.log('table', this.connection.getMetadata(MailTemplate).tableName);
    // const arrDataInit = [];
    // const dataConfig = MAIL_TEMPLATE_DEFAULT;
    // this.dataRef = MAIL_TEMPLATE_DEFAULT.map((o) => o.type);
    // const ids = dataConfig.map((o) => o.id);
    // const pipeline = `SELECT *
    //                   FROM ${this.connection.getMetadata(MailTemplate).tableName}
    //                   WHERE id = ANY ($1);`;
    // const rs = await this.connection.query(pipeline, [ids]);
    // const dbIds = rs.map((o) => o.id);
    // const dataUpdate = dataConfig.filter((o) => dbIds.includes(o.id));
    // const dataInsert = dataConfig.filter((o) => !dbIds.includes(o.id));
    // for (const d of dataUpdate) {
    //   await this.connection
    //     .getRepository(MailTemplate)
    //     .createQueryBuilder('mail_template')
    //     .update<MailTemplate>(MailTemplate, d)
    //     .where('mail_template.id = :id', { id: d.id })
    //     .execute();
    // }
    // if (dataInsert.length > 0) {
    //   for (const d of dataInsert) {
    //     let query = `insert into mail_template(id, type, name, content, subject) values ($1, $2, $3, $4, $5)`;
    //     await this.connection.query(query, [
    //       d.id,
    //       d.type,
    //       d.name,
    //       d.content,
    //       d.subject,
    //     ]);
    //   }
    // }
  }

  async drop(): Promise<any> {
    // await this.connection
    //   .createQueryBuilder()
    //   .delete()
    //   .from(MailTemplate)
    //   .where('"type" IN (:...types)', { types: this.dataRef })
    //   .execute();
  }
}
