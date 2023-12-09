import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { MAIL_SERVICE } from './interfaces/IMail.service';

const mailService = { useClass: MailService, provide: MAIL_SERVICE }

@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: process.env.SMTP_PORT,
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASS
                    }
                },
                defaults: {
                    from: `"Food App" <${process.env.MAIL_USERNAME}>`
                },
                template: {
                    dir: __dirname + "/templates",
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            }),
        })
    ],
    providers: [
        mailService
    ],
    exports: [
        mailService
    ]
})
export class MailModule { }
