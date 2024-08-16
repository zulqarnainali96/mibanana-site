import apiClient from 'api/apiClient';
import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { notificationSound } from 'redux/global/global-functions';
import { currentUserRole } from 'redux/global/global-functions';
import { useSocket } from 'sockets';
// import { SocketContext } from 'sockets';
import { v4 as uuid } from 'uuid';

const usePrivateChat = (user_id, receiver, name, username, user_avatar, avatar, reduxState, reduxActions, item) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [unreadMessages, setUnreadMessages] = useState(0);
    const role = currentUserRole(reduxState);
    // const socketIO = useRef(useContext(SocketContext));
    const socketIO = useSocket();
    const [scrolling, setScrolling] = useState(false)
    const privateChatRef = useRef(null);

    const handleRole = () => {
        if (role?.designer || role?.mobile_app_developer || role?.web_developer || role?.social_media_manager || role?.copywriter) {
            return { teamMember: true };
        } else if (role?.projectManager) {
            return { projectManager: true };
        } else if (role?.customer) {
            return { customer: true };
        } else if (role?.admin) {
            return { admin: true };
        }
    };

    const userOnline = () => {
        let msg = {
            id: uuid(),
            message,
            receiver,
            sender: user_id,
            date: new Date(),
            type: 'personal-chat',
            sender_name: username,
            avatar: user_avatar,
        };
        if (item?.hasOwnProperty('status')) {
            return { ...msg, view: false };
        } else {
            return { ...msg, view: true };
        }
    };

    const sendMessage = async () => {
        if (message === '') return;
        setScrolling(true)
        const msg = userOnline();
        reduxActions.privateChatMesage(msg);
        try {
            setMessage("");
            await apiClient.post(`/api/create-personal-chat/${user_id}/${receiver}`, msg);
            if (item?.hasOwnProperty('status')) {
                socketIO.emit('send-private-message', msg, receiver, user_id);
            }
        } catch (error) {
            console.log(error);
            setScrolling(false)
        }
    };

    const getPersonalChat = async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get(`/api/get-personal-chat/${user_id}/${receiver}`);
            setLoading(false);
            if (data.chats) {
                setScrolling(true)
                reduxActions.privateChatMesage(data.chats.message);
            }
        } catch (error) {
            setLoading(false);
            setScrolling(false)
            reduxActions.privateChatMesage([]);
            console.log(error);
        }
    };

    const updateDocumentTitle = useCallback(() => {
        if (document.hidden) {
            if (unreadMessages > 0) {
                document.title = `${unreadMessages} New Message${unreadMessages > 1 ? 's' : ''} - MiBanana`;
            } else {
                document.title = 'MiBanana';
            }
        } else {
            document.title = 'MiBanana';
            setUnreadMessages(0); // Reset unread messages count when the tab is active
        }
    }, [unreadMessages]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            updateDocumentTitle();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Initial title update
        updateDocumentTitle();

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [updateDocumentTitle]);

    useEffect(() => {
        getPersonalChat();

        return () => {
            setScrolling(false)
            socketIO.emit('leave-room', receiver);
        };
    }, [receiver]);

    useEffect(() => {
        if (!handleRole()?.customer || !handleRole()?.admin) {
            socketIO.on('receive-private-message', (msg) => {
                notificationSound();
                reduxActions.privateChatMesage(msg);
                if (document.hidden) {
                    setUnreadMessages((prevCount) => prevCount + 1);
                }
            });
            console.log('usePrivateChat')
            return () => {
                socketIO.off('receive-private-message');
            };
        }
    }, [socketIO]);

    // useEffect(() => {
    //     if (privateChatRef.current) {
    //         const lastMessage = privateChatRef.current.lastElementChild;
    //         if (lastMessage) {
    //             lastMessage.scrollIntoView({ behavior: 'smooth' });
    //         }
    //     }
    // }, [reduxState.group_message, item._id]);

    useEffect(() => {
        if (privateChatRef.current) {
            privateChatRef.current.scrollTop = privateChatRef.current.scrollHeight;
        }
    }, [reduxState.group_message, scrolling]);

    return {
        message,
        setMessage,
        chats: reduxState.private_chat_message,
        loading,
        privateChatRef,
        sendMessage,
    };
};

export default usePrivateChat;
