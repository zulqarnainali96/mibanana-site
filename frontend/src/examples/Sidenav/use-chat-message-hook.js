import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SocketContext } from 'sockets'

const useChatMessageHook = (reduxState, reduxActions) => {
    const socketIO = useRef(useContext(SocketContext))
    const [chatMessage, setChatMessage] = useState([])
    const pathname = useLocation().pathname?.replace(/\//g, '')

    useEffect(() => {
        if (pathname !== 'mibanana-team') {
            console.log("Running")
            socketIO.current.on('receive-private-message', (message) => {
                console.log('message', message)
                reduxActions.handleUnreadChatMessage(message)
                // console.log(reduxState.private_chat_message)
                // setChatMessage(prev => [...prev, message])
            })
        }

    }, [socketIO.current])
    return {
        chatMessage: reduxState.unread_chat_message,
    }
}

export default useChatMessageHook
