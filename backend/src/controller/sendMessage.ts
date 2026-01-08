import type { Request } from "express";
import type { Response } from "express";
import { sendMessageToUser } from "../socket.io/message";
import MessageModel from "../model/Message.model";
import { getUserSocket } from "../socket.io/socket";



const sendMessage = (req: Request, res: Response) => {
    const { toUserId, message } = req.body;
    if(!toUserId || !message){
        return res.status(400).json({ message: "toUserId and message are required." });
    }
    const fromUserId = req.user?.id;
    if(fromUserId === toUserId){
        return res.status(400).json({ message: "You cannot send message to yourself." });
    }
    if (!fromUserId) {
        return res.status(401).json({ message: "Authentication required." });
    }

    const newMessage = new MessageModel({
        from: fromUserId,
        to: toUserId,
        content: message
    });
    newMessage.save();
    console.log(`Message from ${fromUserId} to ${toUserId}: ${message}`);

    sendMessageToUser(fromUserId, toUserId, 'new-message', { message });
    res.status(200).json({ message: "Message sent." });
}  

export { sendMessage };