import React, { useEffect, useCallback } from 'react';

const useChatMessageHook = (reduxState, reduxActions, memberId, fullArray) => {

    // const totalUnreadCount = fullArray.reduce((sum, item) => {
    //     return sum + parseInt(item.unread_messages_count || "0", 10);
    // }, 0);

const getUnreadMessage = useCallback(() => {
    const result = reduxState.unread_chat_message?.filter(item => {
        if (item?.type === 'group-chat') {
            return item._id === memberId;
        } else {
            return item.sender === memberId;
        }
    });
    return result.length;
}, [reduxState.unread_chat_message, memberId]);

useEffect(() => {

    const updateDocumentTitle = () => {
        const unreadCount = reduxState.unread_chat_message.length;
        if (document.hidden && unreadCount !== 0) {
            document.title = `${unreadCount} New Messages - MiBanana`;
        } else {
            document.title = 'MiBanana';
        }
    };

    const handleVisibilityChange = () => {
        updateDocumentTitle();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial title update
    updateDocumentTitle();

    // Cleanup event listener on component unmount
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}, [getUnreadMessage]);

return {
    chatMessage: reduxState.unread_chat_message,
    getUnreadMessage,
};
};

export default useChatMessageHook;

