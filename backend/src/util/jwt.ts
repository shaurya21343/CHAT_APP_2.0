import jwt from 'jsonwebtoken';
import type { User } from '../types/global.d.ts';

const JWT_SECRET = String(process.env.JWT_SECRET);

export const generateToken = (payload:User): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}   
export const verifyToken = (token: string): User => {
    return jwt.verify(token, JWT_SECRET) as User;
}