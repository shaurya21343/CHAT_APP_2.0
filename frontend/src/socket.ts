import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BackendURI; // backend URL

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,   // connect manually
  transports: ["websocket"], // faster & stable
});
