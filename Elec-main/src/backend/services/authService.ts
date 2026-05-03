import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "super_secret_jwt_key_for_electiq";
const EXPIRE_MINUTES = parseInt(process.env.JWT_EXPIRE_MINUTES || "10080");

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const verifyPassword = (plain: string, hashed: string) => {
  return bcrypt.compareSync(plain, hashed);
};

export const createAccessToken = (data: { sub: string }) => {
  return jwt.sign(data, JWT_SECRET, { expiresIn: `${EXPIRE_MINUTES}m` });
};
