import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // backend URL

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,   // connect manually
  transports: ["websocket"], // faster & stable
});
