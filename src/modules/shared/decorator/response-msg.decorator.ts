import { SetMetadata } from "@nestjs/common";

export const RESPONSE_MESSAGE = 'RESPONSE_MESSAGE';
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);