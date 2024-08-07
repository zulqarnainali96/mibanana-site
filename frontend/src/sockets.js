import { createContext } from "react";
import { io } from "socket.io-client";

// const baseURL =  process.env.REACT_APP_SOCKET_URL
const baseURL = 'http://localhost:4000'
// const baseURL = 'https://test-socket.mibanana.com'
// https://chat.mibanana.com live site url for socket
// 34.118.52.166

export const socket = io(baseURL, {
    withCredentials: true,
    autoConnect: false
})
export const SocketContext = createContext()