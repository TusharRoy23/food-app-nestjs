import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from './interfaces/IMail.service';

@Injectable()
export class MailService implements IMailService {
    constructor(
        private readonly mailerService: MailerService
    ) { }

    async sendRegistrationMail(email: string, context: any): Promise<string> {
        await this.mailerService.sendMail({
            to: email,
            from: process.env.MAIL_USERNAME,
            subject: 'Welcome to Food App! Confirm your Email',
            template: __dirname + '/templates/confirmation',
            context: context,
        }).then(res => {
            console.log('res: ', res);

        }).catch(error => {
            console.log('email error: ', error);

        })
        return Promise.resolve('Mail Sent! ')
    }

}
