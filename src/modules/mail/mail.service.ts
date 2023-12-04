import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from './interfaces/IMail.service';
import { throwException } from '../shared/errors/all.exception';
import { IUser } from '../user/interfaces/IUser.model';

@Injectable()
export class MailService implements IMailService {
    constructor(
        private readonly mailerService: MailerService
    ) { }

    async sendUserConfirmationMail(email: string, context: { subject: string, data: any }): Promise<string> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: context.subject,
                template: __dirname + '/templates/confirmation',
                context: context.data,
            });
            return Promise.resolve('Mail Sent! ')
        } catch (error: any) {
            return throwException(error);
        }

    }

}
