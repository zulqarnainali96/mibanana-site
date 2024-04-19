import { createContext } from "react";
import { io } from "socket.io-client";

// process.env.REACT_APP_SOCKET_URL
// 'http://localhost:4000'
//'https://test-socket.mibanana.com'
// https://chat.mibanana.com live site url for socket

export const socket = io('https://test-socket.mibanana.com', {
    withCredentials: true,
    autoConnect: false
})

export const SocketContext = createContext()


