import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const createTokenPayload = (user) => ({
  sub: user._id.toString(),
  role: user.role,
  sv: user.sessionVersion || 0,
});

export const signAccessToken = (user) =>
  jwt.sign(createTokenPayload(user), config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });

export const signRefreshToken = (user) =>
  jwt.sign(createTokenPayload(user), config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

export const verifyAccessToken = (token) => jwt.verify(token, config.jwt.accessSecret);

export const verifyRefreshToken = (token) => jwt.verify(token, config.jwt.refreshSecret);

export const decodeToken = (token) => jwt.decode(token);

const getPasswordResetSecret = (user) => `${config.jwt.refreshSecret}.${user.passwordHash}`;

export const signPasswordResetToken = (user) =>
  jwt.sign({ sub: user._id.toString(), purpose: 'password_reset' }, getPasswordResetSecret(user), {
    expiresIn: config.jwt.passwordResetExpiresIn,
  });

export const verifyPasswordResetToken = (token, user) =>
  jwt.verify(token, getPasswordResetSecret(user));

export const issueAuthTokens = (user) => ({
  accessToken: signAccessToken(user),
  refreshToken: signRefreshToken(user),
  tokenType: 'Bearer',
  expiresIn: config.jwt.accessExpiresIn,
});
