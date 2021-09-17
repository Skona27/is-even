import UniversalCookie from 'universal-cookie';
import { addMonths } from 'date-fns';

import { Authentication } from '@common/interface/authentication.interface';

import { REFRESH_TOKEN_COOKIE_NAME } from '../constant/refresh-token-cookie-name.constant';
import { REMEMBER_USER_COOKIE_NAME } from '../constant/remember-user-cookie-name.constant';

export function persistRefreshToken(authentication: Authentication) {
  try {
    const remember = authentication.remember;
    const refreshToken = authentication.refreshToken;

    const now = new Date();
    const nextMonth = addMonths(now, 1);

    const cookie = new UniversalCookie();

    cookie.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      path: '/',
      expires: remember ? nextMonth : undefined,
    });

    if (remember) {
      cookie.set(REMEMBER_USER_COOKIE_NAME, remember, {
        path: '/',
        expires: nextMonth,
      });
    }
  } catch (error) {
    console.error(`Failed to store refresh token in storage. ${error.message}`);
  }
}
