import { Server, Socket } from "socket.io"
import type { Server as HttpServer } from "http"
import { authMiddleware } from "../middleware/socket.io-auth-middleware";


const users : { [userId : string]: Socket } ={

}

export const getUserSocket = (userId: string): Socket | undefined => {
  console.log('Getting socket for userId:', userId);
  console.log('Current users mapping:', users[userId]);
  return users[userId];
}

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  })
  io.use(authMiddleware);

  io.on("connection", (socket: any) => {
    console.log(`Socket connected: ${socket.id}`)
    console.log(socket.user)
    users[socket.user.id] = socket.id;
    console.log(users);
    
    socket.on("disconnect", () => {
      delete users[socket.user.id];
      console.log(`Socket disconnected: ${socket.id}`)
    })
  })

  return io
}

export { users };
