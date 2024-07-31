import React, { useCallback } from 'react'

const useChatMessageHook = (reduxState, reduxActions, memberId) => {

    const getUnreadMessage = useCallback(() => {
        const result = reduxState.unread_chat_message?.filter(item => {
            if (item?.type === 'group-chat') {
                return item._id === memberId
            } else {
                return item.sender === memberId
            }
        })
        return result.length
    }, [reduxState.unread_chat_message])

    return {
        chatMessage: reduxState.unread_chat_message,
        getUnreadMessage,
    }
}

export default useChatMessageHook