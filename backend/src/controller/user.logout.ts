import { User } from "../model/user.model";
import { verifyToken } from "../util/jwt";
import type { Request, Response } from 'express';

const logoutUser = async (req :Request, res:Response) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No token provided." });
        }
                const decoded: any = verifyToken(token);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.status = 'offline';
        await user.save();
        res.clearCookie('token');
        return res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.error("Error logging out user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export default logoutUser;