import { Schema } from "mongoose";
import { model } from "mongoose";

export const MessageSchema = new Schema(
    {
        from: { type: String, required: true },
        to: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export interface IMessage {
    from: string;
    to: string;
    content: string;
    timestamp: Date;
}

const MessageModel = model<IMessage>("Message", MessageSchema);

export default MessageModel;