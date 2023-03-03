import { User } from "../../user/schemas/user.schema";
import { IRequestService } from "../interfaces/IRequest.service";

export class RequestService implements IRequestService {
    private user: User;

    setUserInfo(user: User) {
        this.user = user;
    }
    getUserInfo(): User {
        return this.user;
    }

}