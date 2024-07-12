import apiClient from 'api/apiClient'
import { useContext, useEffect, useRef, useState } from 'react'
import { currentUserRole } from 'redux/global/global-functions'
import { SocketContext } from 'sockets'
import { v4 as uuid } from 'uuid'

const usePrivateChat = (user_id, receiver, name, username, user_avatar, avatar, reduxState, reduxActions) => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const role = currentUserRole(reduxState)
    // const [chats, setChats] = useState(reduxState.private_chat_message)
    const socketIO = useRef(useContext(SocketContext));
    const privateChatRef = useRef(null);


    const handleRole = () => {
        if (role?.designer || role?.mobile_app_developer || role?.web_developer || role?.social_media_manager || role?.copywriter) {
            return {
                teamMember: true
            }
        }
        else if (role?.projectManager) {
            return { projectManager: true }
        }
        else if (role?.customer) {
            return { customer: true }
        }
        else if (role?.admin) {
            return { admin: true }
        }
    }
    // console.log(reduxState.private_chat_message)
    const sendMessage = async () => {
        const msg = {
            id: uuid(),
            message,
            receiver,
            sender: user_id,
            date: new Date(),
            type: 'personal-chat',
            receiver_name: name,
            sender_name: username,
            receiver_avatar: avatar,
            sender_avatar: user_avatar
        }
        reduxActions.privateChatMesage(msg)
        socketIO.current.emit('send-private-message', msg)

        try {
            setMessage("")
            await apiClient.post(`/api/create-personal-chat/${user_id}/${receiver}`, msg)
            // console.log(resp)
        }
        catch (error) {
            console.log(error)
        }
    }

    const getPersonalChat = async (id) => {
        setLoading(true)
        try {
            const { data } = await apiClient.get(`/api/get-personal-chat/${user_id}/${receiver}`)
            setLoading(false)
            // console.log(data)
            if (data.chats) {
                reduxActions.privateChatMesage(data.chats.message)
            }
        }
        catch (error) {
            setLoading(false)
            reduxActions.privateChatMesage([])
            console.log(error)
        }
    }
    useEffect(() => {
        getPersonalChat()

        return () => {
            socketIO.current.emit('leave-private-chat', receiver)
        }
    }, [receiver])

    useEffect(() => {
        if (!handleRole()?.customer || !handleRole()?.admin) {
            socketIO.current.on('receive-private-message', (msg) => {
                // console.log(msg)
                reduxActions.privateChatMesage(msg)
            })
        }
    }, [socketIO.current])

    useEffect(() => {
        if (privateChatRef.current) {
            privateChatRef.current.scrollTop = privateChatRef.current.scrollHeight;
        }
    }, [reduxState.private_chat_message]);

    return {
        message,
        setMessage,
        chats: reduxState.private_chat_message,
        loading,
        privateChatRef,
        sendMessage,
    }
}

export default usePrivateChat
