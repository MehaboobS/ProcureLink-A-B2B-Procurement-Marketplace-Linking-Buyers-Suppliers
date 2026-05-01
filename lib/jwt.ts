import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_SECRET! + "_refresh";

export function generateTokens(payload: any) {
  const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1d' });

  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

  return { token, refreshToken };
}