import React from 'react'

const useChatMessageHook = (reduxState, reduxActions) => {
    return {
        chatMessage: reduxState.unread_chat_message,
    }
}

export default useChatMessageHook