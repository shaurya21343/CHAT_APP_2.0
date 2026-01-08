import { verifyToken } from "../util/jwt";

import type { User } from "../types/global.d.ts";
import type { Socket, } from "socket.io";

function authMiddleware(socket :Socket,next:Function){
    const token = socket.handshake.headers.cookie?.split('token=')[1];
    try {
        const decoded : User = verifyToken(token!);
        (socket as any).user = decoded;
        next();
    } catch (error) {
        next(new Error("Authentication error"));
    }
}

export {authMiddleware};