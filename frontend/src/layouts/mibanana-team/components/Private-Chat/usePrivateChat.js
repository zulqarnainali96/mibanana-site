import apiClient from 'api/apiClient'
import { useContext, useEffect, useRef, useState } from 'react'
import { notificationSound } from 'redux/global/global-functions'
import { currentUserRole } from 'redux/global/global-functions'
import { SocketContext } from 'sockets'
import { v4 as uuid } from 'uuid'

const usePrivateChat = (user_id, receiver, name, username, user_avatar, avatar, reduxState, reduxActions, item) => {
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
    function userOnline() {
        let msg = {
            id: uuid(),
            message,
            receiver,
            sender: user_id,
            date: new Date(),
            type: 'personal-chat',
            sender_name: username,
            avatar: user_avatar
        }
        if (item?.hasOwnProperty('status')) {
            return { ...msg, view: false }
        } else {
            return { ...msg, view: true }
        }
    }
    const sendMessage = async () => {
        if (message === '') return
        const msg = userOnline()
        reduxActions.privateChatMesage(msg)
        try {
            setMessage("")
            await apiClient.post(`/api/create-personal-chat/${user_id}/${receiver}`, msg)
            if (item?.hasOwnProperty('status')) {
                socketIO.current.emit('send-private-message', msg, receiver, user_id)
            }
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
    function formatMessageDate(msgDate) {
        const date = new Date(msgDate);

        // Format time
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const timeString = `${hours}:${minutes} ${ampm}`;

        // Format date
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear().toString().slice(-2);
        const dateString = `${day}/${month}/${year}`;

        // Combine time and date
        return `${timeString} ${dateString}`;
    }


    useEffect(() => {
        getPersonalChat()

        return () => {
            socketIO.current.emit('leave-room', receiver)
        }
    }, [receiver])

    useEffect(() => {
        if (!handleRole()?.customer || !handleRole()?.admin) {
            socketIO.current.on('receive-private-message', (msg) => {
                // notificationSound()
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
        formatMessageDate,
    }
}

export default usePrivateChat
