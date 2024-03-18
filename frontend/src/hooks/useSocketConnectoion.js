import { io } from "socket.io-client"

export const SocketConnection = (cb, unique_key, id, roles, socketIO) => {
    if (socketIO.current) {
        cb(unique_key)
    } else {
        const socket = io("http://localhost:4000", {
            withCredentials: true
        })
        socket.on('connect', () => {
            socket.current.emit('user_online', true, id, roles)
            cb(unique_key)
        })

    }

}