import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();



export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "4d"
  })

  res.cookie("jwt", token, {
    maxAge: 4 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development"
  })

  return token;
}

export default generateToken;