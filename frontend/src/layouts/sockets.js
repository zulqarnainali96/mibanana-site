import { io } from "socket.io-client"

// export const socketIO = io.connect('http://localhost:4000', {
//     withCredentials: true
// })
export const socketIO = io.connect(process.env.REACT_APP_SOCKET_URL, {
    withCredentials: true
})
