import { Injectable, Logger } from '@nestjs/common';
import { MailerService as MailService } from '@nestjs-modules/mailer';
import Mail from 'nodemailer/lib/mailer';
import {
  MailDetail,
  MailDetailStatus,
  MailDetailType,
} from './entities/mail-detail.entity';
import { MailDetailRepository } from './repositories/mail-detail.repository';
import { envConfig } from '@configuration/env.config';

@Injectable()
export class MailerService {
  private readonly logger = new Logger('MailerService');

  constructor(
    private mailService: MailService,
    private readonly mailDetailRepository: MailDetailRepository,
  ) {}

  async sendTaskAssignedEmail(params: SendTaskNotificationEmailParams) {
    const { toEmail, ...context } = params;
    const subject = '[PMSystem] A task has been assigned to you.';
    const template = './tasks/task-assigned';

    await this.sendAndCreateMailDetail({
      toEmail,
      subject,
      template,
      context,
      mailType: MailDetailType.TASK_ASSIGNED,
      taskId: params.taskId,
    });
  }

  async sendResetPasswordEmail(params: SendResetPasswordEmailParams) {
    const { toEmail, ...context } = params;
    const subject = '[PMSystem] Your reset password request has been accepted.';
    const template = './users/reset-password';

    await this.sendAndCreateMailDetail({
      toEmail,
      subject,
      template,
      context,
      mailType: MailDetailType.TASK_ASSIGNED,
      taskId: null,
    });
  }

  //#region helper
  private async sendAndCreateMailDetail(params: CreateMailDetailParams) {
    const {
      toEmail,
      subject,
      template,
      attachments = [],
      context,
      mailType,
      taskId,
    } = params;

    const res = await this.mailService.sendMail({
      from: envConfig.MAIL_FROM,
      to: toEmail,
      subject,
      template,
      attachments,
      context,
    });

    const mailObj = {
      to: toEmail,
      mailType,
      mailSubject: subject,
      mailTemplate: template,
      taskId,
    } as MailDetail;

    if (res?.response?.includes?.('OK')) {
      mailObj.status = MailDetailStatus.SUCCESS;
    } else {
      mailObj.status = MailDetailStatus.FAILED;
    }
    const newMailDetail = await this.mailDetailRepository.save(mailObj);
    this.logger.log('>> mail detail saved: ', JSON.stringify(newMailDetail));
  }
  //#endregion helper
}

type CreateMailDetailParams = {
  toEmail: string;
  subject: string;
  template: string;
  attachments?: Mail.Attachment[];
  context?: Record<any, any>;
  mailType: MailDetailType;
  taskId: string;
};

type SendTaskNotificationEmailParams = {
  toEmail: string;
  taskId: string;
  assigneeFullName: string;
  taskName: string;
  dueDate: Date;
  taskUrl: string;
};

type SendResetPasswordEmailParams = {
  toEmail: string;
  userFullName: string;
  username: string;
  otp: number;
  resetPasswordUrl: string;
};
