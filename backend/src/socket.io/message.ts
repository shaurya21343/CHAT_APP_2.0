import { io } from "../index"
import { users } from "./socket";
import { getUserSocket } from "./socket";


const sendMessageToUser = (fromUserId: string, userId: string, event: string, message: any) => {
    const socket = getUserSocket(userId);
    console.log('socket:', socket);
    console.log(
        `Sending message from user ${fromUserId} to user ${userId} on event ${event} with message:`,
        message

    )
    if (socket) {
        io.to(String(socket)).emit("message", { from: fromUserId, ...message });
    }
    
};


export { sendMessageToUser };