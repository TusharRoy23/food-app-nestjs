export const MAIL_SERVICE = 'MAIL_SERVICE';

export interface IMailService {
    sendUserConfirmationMail(email: string, context: { subject: string, data: any }): Promise<string>;
}