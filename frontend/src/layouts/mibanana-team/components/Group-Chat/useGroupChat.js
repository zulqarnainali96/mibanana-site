import apiClient from "api/apiClient";
// import { SocketContext } from "sockets";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { currentUserRole } from "redux/global/global-functions";
import { v4 as uuid } from 'uuid';
import { notificationSound } from "redux/global/global-functions";
import { useSocket } from "sockets";

const useGroupChat = (setReload, closeChat, userId, _id, name, username, avatar, user_avatar, reduxState, reduxActions, item) => {
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [unreadMessages, setUnreadMessages] = useState(0);
    const role = currentUserRole(reduxState);
    // const socketIO = useRef(useContext(SocketContext));
    const socketIO = useSocket();
    const privateChatRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [respMessage, setRespMessage] = useState("");
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const openErrorSB = () => setErrorSB(true);

    function userOnline() {
        let msg = {
            id: uuid(),
            view: true,
            message,
            sender: userId,
            date: new Date(),
            type: 'group-chat',
            avatar: user_avatar,
            sender_name: username,
        };
        return msg;
    }

    const sendMessage = async () => {
        if (message.trim() === "") {
            return;
        }
        const msg = userOnline();
        socketIO.emit('send-group-message', { _id: item._id, ...msg }, item._id);
        reduxActions.handleGroupMessage(msg);
        setMessage("");
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deleteChatGroup = async () => {
        setDelLoading(true);
        try {
            const { data, status } = await apiClient.delete(`/api/delete-group/${item._id}`);
            if (status === 200) {
                setDelLoading(false);
                setRespMessage(data.message);
                setTimeout(() => {
                    openSuccessSB();
                }, 800);
                setTimeout(() => {
                    closeChat();
                    setReload(prev => !prev);
                }, 300);
            }
        } catch (err) {
            if (err.response) {
                const { message } = err.response.data;
                setRespMessage(message);
                setTimeout(() => {
                    openErrorSB();
                }, 400);
            } else {
                setRespMessage(err.message);
                setTimeout(() => {
                    openErrorSB();
                }, 400);
            }
            setDelLoading(false);
        }
    };

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

    const getGroupChatData = async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get(`api/get-groups-messages/${item._id}`);
            setLoading(false);
            if (data) {
                reduxActions.handleGroupMessage(data.messages);
            }
        } catch (err) {
            if (err.response) {
                const { message } = err.response.data;
                setRespMessage(message);
                setTimeout(() => {
                    openErrorSB();
                }, 400);
            } else {
                setRespMessage(err.message);
                setTimeout(() => {
                    openErrorSB();
                }, 400);
            }
            setLoading(false);
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
        getGroupChatData();

        return () => {
            socketIO.emit('leave-room', item._id);
        };
    }, [item._id]);

    useEffect(() => {
        if (privateChatRef.current) {
            privateChatRef.current.scrollTop = privateChatRef.current.scrollHeight;
        }
    }, [reduxState.group_message]);

    useEffect(() => {
        if (!handleRole()?.customer || !handleRole()?.admin) {
            socketIO.on('receive-group-message', (msg) => {
                   notificationSound();
                reduxActions.handleGroupMessage(msg);
                if (document.hidden) {
                    setUnreadMessages((prevCount) => prevCount + 1);
                }
            });
            console.log('useGroupChat')
            return () => {
                socketIO.off('receive-group-message');
            }
        }
    }, [socketIO]);

    return {
        open,
        handleOpen,
        handleClose,
        respMessage,
        setRespMessage,
        successSB,
        setSuccessSB,
        errorSB,
        setErrorSB,
        openSuccessSB,
        openErrorSB,
        deleteChatGroup,
        delLoading,
        role,
        sendMessage,
        privateChatRef,
        loading,
        message,
        setMessage,
    };
};

export default useGroupChat;