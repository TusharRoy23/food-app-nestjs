import { SetMetadata } from "@nestjs/common";
import { UserType } from "../utils/enum";

export const USER_TYPE_KEY = 'user type';
export const TypeOfUser = (userType: UserType) => SetMetadata(USER_TYPE_KEY, userType);