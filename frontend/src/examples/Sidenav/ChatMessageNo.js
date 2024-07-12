import { ListItemText } from '@mui/material'
import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useChatMessageHook from './use-chat-message-hook'

const ChatMessageNo = ({ reduxState, reduxActions }) => {
    const { chatMessage } = useChatMessageHook(reduxState, reduxActions)

    console.log(chatMessage)
    return (
        <React.Fragment>
            {chatMessage?.length > 0 && <ListItemText
                className="side-nav-text"
                secondary={chatMessage?.length}
                sx={styles}
            />}
        </React.Fragment>
    )
}

const styles = {
    backgroundColor: "red",
    maxWidth: '24px',
    height: '24px',
    borderRadius: '12px',
    textAlign: 'center',
    width: '25px',
    "& > p": {
        color: "#fff",
        fontFamily: '"Poppins", sans-serif',
    }
}

export default reduxContainer(ChatMessageNo)
