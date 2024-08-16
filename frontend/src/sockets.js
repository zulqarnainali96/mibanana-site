import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'

// const baseURL =  process.env.REACT_APP_SOCKET_URL
const baseURL = 'http://localhost:4000'
// const baseURL = 'https://test-socket.mibanana.com'
// // https://chat.mibanana.com live site url for socket

const SocketContext = createContext()


export const useSocket = () => {
    return useContext(SocketContext)
}


export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const newSocket = io(baseURL, {
            withCredentials: true,
            // transports: ['websocket'],
            autoConnect : false,
            upgrade: false,
        });
        setSocket(newSocket)

        return () => newSocket.disconnect()
    }, [])

    if (!socket) {
        return null; // Or some loading indicator
    }


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}














// import { createContext } from "react";
// import { io } from "socket.io-client";

// // const baseURL =  process.env.REACT_APP_SOCKET_URL
//    const baseURL = 'http://localhost:4000'
// // const baseURL = 'https://test-socket.mibanana.com'
// // https://chat.mibanana.com live site url for socket
// // 34.118.52.166

// export const socket = io(baseURL, {
//     withCredentials: true,
//     autoConnect: false
// })
// export const SocketContext = createContext()