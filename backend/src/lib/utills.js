import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();



export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "4d"
  })

res.cookie("jwt", token, {
  httpOnly: true,
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none", // <-- 1. Allow cross-domain
  secure: true,       // <-- 2. "sameSite: none" REQUIRES secure
});

  return token;
}

export default generateToken;
