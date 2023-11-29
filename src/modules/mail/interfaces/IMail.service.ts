export const MAIL_SERVICE = 'MAIL_SERVICE';

export interface IMailService {
    sendRegistrationMail(email: string, context: any): Promise<string>;
}