import { IsNotEmpty, IsUUID } from "class-validator";

export class OrderDto {
    @IsUUID()
    @IsNotEmpty()
    uuid: string;
}