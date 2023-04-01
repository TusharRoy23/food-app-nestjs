import { User } from '../../user/schemas/user.schema';

export const REQUEST_SERVICE = 'REQUEST_SERVICE';

export interface IRequestService {
  setUserInfo(user: User);
  getUserInfo(): User;
}
