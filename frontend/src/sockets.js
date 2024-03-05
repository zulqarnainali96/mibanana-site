import { createContext } from "react";

export const SocketContext = createContext()
// import { useMemo } from 'react';
// import { io } from 'socket.io-client';

// export const useSocket = () => {

//     const socket = useMemo(() => {
//         const socket = io('http://localhost:4000', {
//             withCredentials: true
//         });

//         socket.on('connect', () => {
//             console.log(`Connected ${socket.id}`);
//             // const userData = JSON.parse(window.localStorage.getItem('user_details'));
//             // const { id, roles } = userData;
//             // socket.emit('user_online', true, id, roles);
//         });
//         return socket;
//     }, []);

//     return socket;

// };

// export const socketIO = io.connect(process.env.REACT_APP_SOCKET_URL, {
//     withCredentials: true
// })
