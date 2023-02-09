import { SetMetadata } from "@nestjs/common";
import { UserType } from "../utils/enum";

export const USER_TYPE_KEY = 'user type';
export const TypeOfUsers = (...userType: UserType[]) => SetMetadata(USER_TYPE_KEY, userType);