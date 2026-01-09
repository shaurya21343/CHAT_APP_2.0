import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectMongoDB from "./lib/mongo.connect";
import userRouter from "./routes/user.router";
import MessageRouter from "./routes/message.router";
import utilityRouter from "./routes/utility.router";
import { authMiddleware, requireAuth } from "./middleware/auth.middleware";
import { initSocket } from "./socket.io/socket";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin:"https://chat-app-2-0-1-geii.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.options("/*", cors()); // ✅ FIXED



// Database Connection
connectMongoDB(String(process.env.MONGO_URL)).catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
});

// Routes
app.use("/api/user", authMiddleware, userRouter);
app.use("/api/message", authMiddleware, requireAuth, MessageRouter);
app.use("/api/utility", authMiddleware,requireAuth, utilityRouter);

// Server
const server = http.createServer(app);

const io = initSocket(server);

server.listen(PORT, () => {
    if (PORT === 3001) {
        console.warn("Warning: Using default port 3001. Consider setting a custom port in the .env file.");
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});

export { io };
