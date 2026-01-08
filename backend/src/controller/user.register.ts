import { User } from "../model/user.model";
import type { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
    const { username, password, profilePhoto } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists." });
        }
        if(!profilePhoto){
            req.body.profilePhoto = "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png";
        }
        const newUser = new User({ username, password, profilePhoto: req.body.profilePhoto });
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully." });
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};