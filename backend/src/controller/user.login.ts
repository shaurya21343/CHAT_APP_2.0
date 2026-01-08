import type { Request, Response } from 'express';
import { User,validatePassword } from '../model/user.model';
import { generateToken } from '../util/jwt';

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    try {
        const user = await User.findOne({ username });
        if (!user || !(await validatePassword.call(user, password))) {
            return res.status(401).json({ message: "Invalid username or password." });
        } 
        user.status = 'online';
        await user.save();
        res.cookie('token', generateToken({
  id: String(user._id),
  username: user.username,
  profilePhoto: user.profilePhoto
}), {
  httpOnly: true,           // cannot access from JS (good)
  secure: process.env.NODE_ENV === 'production', 
  sameSite: 'lax',          // or 'none' + secure:true if cross-site
  maxAge: 3600_000,         // 1 hour
});

        return res.status(200).json({ message: "Login successful." });
    }   
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};