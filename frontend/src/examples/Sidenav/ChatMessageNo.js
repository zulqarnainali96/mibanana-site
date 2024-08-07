import { ListItemText } from '@mui/material'
import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useChatMessageHook from './use-chat-message-hook'

const ChatMessageNo = ({ reduxState, reduxActions, memberId }) => {
    const { chatMessage, getUnreadMessage, messageCount } = useChatMessageHook(reduxState, reduxActions, memberId)

    return (
        <React.Fragment>
            {!memberId && chatMessage?.length > 0 &&
                (
                    <ListItemText
                        className="side-nav-text"
                        secondary={chatMessage?.length}
                        sx={styles}
                    />
                )
            }
            {memberId && getUnreadMessage() !== 0 && (<div style={styles2}>{getUnreadMessage()}</div>)}
        </React.Fragment>
    )
}

const styles2 = {
    position: 'absolute',
    backgroundColor: "red",
    maxWidth: '24px',
    height: '24px',
    color: '#fff',
    borderRadius: '12px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '25px',
    fontFamily: '"Poppins", sans-serif',
    left: '140px',
    color: "#fff",
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
