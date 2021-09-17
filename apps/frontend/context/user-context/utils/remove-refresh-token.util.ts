import UniversalCookie from 'universal-cookie';

import { REFRESH_TOKEN_COOKIE_NAME } from '../constant/refresh-token-cookie-name.constant';
import { REMEMBER_USER_COOKIE_NAME } from '../constant/remember-user-cookie-name.constant';

export function removeRefreshToken() {
  try {
    const cookie = new UniversalCookie();

    cookie.remove(REFRESH_TOKEN_COOKIE_NAME);
    cookie.remove(REMEMBER_USER_COOKIE_NAME);
  } catch (error) {
    console.error(
      `Failed to remove refresh token from storage. ${error.message}`,
    );
  }
}
