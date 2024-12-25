import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { envConfig } from '@configuration/env.config';
import { MailDetailRepository } from './repositories/mail-detail.repository';
import { MailDetail } from './entities/mail-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailDetail]),
    MailModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: envConfig.MAIL_HOST,
          secure: false,
          pool: true,
          maxConnections: 10,
          maxMessages: Infinity,
          auth: {
            user: envConfig.MAIL_USER,
            pass: envConfig.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: `"No Reply" <${envConfig.MAIL_FROM}>`,
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService, MailDetailRepository],
  exports: [MailerService],
})
export class MailerModule {}
