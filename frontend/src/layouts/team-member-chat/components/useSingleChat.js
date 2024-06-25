import apiClient from 'api/apiClient'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

const useSingleChat = (user_id, receiver, name, username, user_avatar, avatar) => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [chats, setChats] = useState([])

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
        try {
            const resp = await apiClient.post(`/api/create-personal-chat/${user_id}/${receiver}`, msg)
            console.log(resp)
        }
        catch (error) {
            console.log(error)
        }
    }

    const getPersonalChat = async (id) => {
        setLoading(true)
        try {
            const {data} = await apiClient.get(`/api/get-personal-chat/${user_id}/${receiver}`)
            setLoading(false)
            if(data.chats){
                setChats(data.chats.message)
            }
        }
        catch (error) {
            setLoading(false)
            setChats([])
            console.log(error)
        }
    }
    useEffect(() => {
        getPersonalChat()
    }, [])

    return {
        message,
        setMessage,
        chats,
        loading,
        sendMessage,
    }
}

export default useSingleChat
