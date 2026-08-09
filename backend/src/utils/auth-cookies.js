import { config } from '../config/index.js';

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: config.authCookies.secure,
  sameSite: config.authCookies.sameSite,
  path: '/',
  maxAge,
  ...(config.authCookies.domain ? { domain: config.authCookies.domain } : {}),
});

export const setAuthCookies = (res, tokens) => {
  res.set('Cache-Control', 'no-store');
  res.cookie(
    config.authCookies.accessName,
    tokens.accessToken,
    cookieOptions(config.authCookies.accessMaxAgeMs)
  );
  res.cookie(
    config.authCookies.refreshName,
    tokens.refreshToken,
    cookieOptions(config.authCookies.refreshMaxAgeMs)
  );
};

export const clearAuthCookies = (res) => {
  const options = cookieOptions(0);
  res.clearCookie(config.authCookies.accessName, options);
  res.clearCookie(config.authCookies.refreshName, options);
};
