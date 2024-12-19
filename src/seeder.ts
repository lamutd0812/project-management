import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import ormConfig from './configuration/orm.config';
import { MailTemplateSeeder } from './seeders/mail-template.seeder';

seeder({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(ormConfig)],
}).run([MailTemplateSeeder]);
