import type { Document } from "mongoose";
import MessageModel from "../model/Message.model";
import type { Request, Response } from "express";

// Define TypeScript type for Message
export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fetch paginated messages between current user and another user
const FetchMessage = async (req: Request, res: Response) => {
  try {
    const fromUserId = req.user?.id;
    const toUserId = req.query.toUserId as string;
    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt(req.query.limit as string) || 20;

    console.log('FetchMessage called with:', { fromUserId, toUserId, cursor, limit });

    if (!fromUserId) return res.status(401).json({ message: "Unauthorized" });
    if (!toUserId) return res.status(400).json({ message: "toUserId is required" });

    // Build query
    const query: any = {
      $or: [
        { from: fromUserId, to: toUserId },
        { from: toUserId, to: fromUserId },
      ],
    };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // Fetch messages and type them
    let messages: IMessage[] = await MessageModel.find(query)
      .sort({ createdAt: -1 }) // newest first
      .limit(limit)
      .lean<IMessage[]>(); // convert to plain JS objects, type-safe

    if (messages.length === 0) {
      return res.status(200).json({
        messages: [],
        nextCursor: null,
      });
    }

    // Determine nextCursor safely
    let nextCursor: string | null = null;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.createdAt) {
      nextCursor = new Date(lastMessage.createdAt).toISOString();
    }

    // Reverse to send oldest first
    messages = messages.reverse();

    return res.status(200).json({
      messages,
      nextCursor,
    });
  } catch (err) {
    console.error("FetchMessage error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default FetchMessage;
