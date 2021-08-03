import { TokenResponse } from '../../cognito/interface/auth-response.interface';
import { User } from '../user.entity';

export interface UserWithAuth {
  user: User;
  auth: TokenResponse;
}
