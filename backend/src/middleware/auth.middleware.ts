import { verifyToken } from "../util/jwt";
import type { Request, Response, NextFunction } from "express";
import type { User } from "../types/global.d.ts";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    try {
        const decoded : User = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        next();
    }
};

export const preventLogedInUsers = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        return res.status(400).json({ message: "You are already logged in." });
    }
    next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required." });
    }
    next();
};