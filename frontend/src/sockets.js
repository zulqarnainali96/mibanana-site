import { createContext } from "react";
import { io } from "socket.io-client";

// process.env.REACT_APP_SOCKET_URL
// 'http://localhost:4000'
//'https://test-socket.mibanana.com'
// https://chat.mibanana.com live site url for socket
// 34.118.52.166

export const socket = io(process.env.REACT_APP_SOCKET_URL, {
    withCredentials: true,
    autoConnect: false
})
export const SocketContext = createContext()
// 