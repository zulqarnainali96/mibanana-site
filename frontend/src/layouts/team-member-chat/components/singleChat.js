import IconButton from '@mui/material/IconButton'
import ArrowBack from '@mui/icons-material/ArrowBack'
import MDBox from 'components/MDBox'
import React from 'react'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import ReactQuill from "react-quill";
import { reactQuillStyles2 } from 'assets/react-quill-settings/react-quill-settings';
import { modules } from 'assets/react-quill-settings/react-quill-settings'
import { formats } from 'assets/react-quill-settings/react-quill-settings'
import SendOutlined from '@mui/icons-material/SendOutlined';
import MDTypography from 'components/MDTypography'
import defaultIcon from 'assets/mi-banana-icons/default-profile.png'
import useSingleChat from './useSingleChat'
import { Box } from '@mui/material'
import { fontsFamily } from 'assets/font-family'
import { mibananaColor } from 'assets/new-images/colors'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';

const SingleChat = ({ userId, handleSingleChat, item, username, user_avatar }) => {
    const { name, avatar, roles, _id } = item
    const classes = reactQuillStyles2()
    const { message, setMessage, chats, loading, sendMessage } = useSingleChat(userId, _id, name, username, avatar, user_avatar)
    return (<MDBox display='flex' width='100%' alignItems='baseline' shadow={'xs'} height="72vh">
        <Grid container width='100%' display='flex' flexDirection="column" minHeight={'100%'} justifyContent={'space-between'}>
            <Grid item xs={12} py={0} px={0} width={'100%'} borderRadius={'10px'}>
                <MDBox display='flex' justifyContent='flex-start' bgColor="#FDD700" gap="1rem" width='100%' alignItems='center' borderBottom="1px solid #e5e5e5">
                    <IconButton title='go back' onClick={handleSingleChat}>
                        <ArrowBack fontSize='medium' />
                    </IconButton>
                    <MDBox display='flex' gap="1rem" paddingBlock="10px" justifyContent='flex-start' borderLeft="1px solid gray" width='100%' alignItems='center' paddingInline="20px" >
                        <Avatar src={avatar ? avatar : defaultIcon} sx={{
                            width: '40px',
                            height: '40px',
                        }} />
                        <MDTypography variant='h5' width='80%' fontWeight='medium' fontFamily="Poppins, sans-serif" >
                            {name}
                        </MDTypography>
                        <MDTypography justifySelf="flex-end" sx={{ userSelect: "none" }} variant='h6' fontWeight='300' fontFamily="Poppins, sans-serif" >
                            role : <i>{roles[0]}</i>
                        </MDTypography>
                    </MDBox>
                </MDBox>
            </Grid>
            <Grid item xs={12} py={2} width={'100%'} sx={{ backgroundColor: '#f6f6e8' }}>
                {chats?.map((item, i) => <prev key={i}
                    className={`message ${item.receiver === _id ? "left" : "right"}`}
                    style={{ position: "relative" }}>
                    <Box
                        sx={{ mt: 1, p: '7px', ...nameStyle, fontWeight: "300", fontSize: "13px" }}
                        className="message-content"
                        dangerouslySetInnerHTML={{ __html: item.message }}
                    >

                    </Box>
                </prev>)}
            </Grid>
            <Grid item xs={12} py={2} width={'100%'} sx={{ paddingInline: '30px !important', position: 'relative', }}>
                <ReactQuill
                    theme="snow"
                    value={message}
                    onChange={(value) => setMessage(value)}
                    modules={modules}
                    formats={formats}
                    className={classes.quill}
                    style={{ width: '98%' }}
                />
                <SendOutlined
                    fontSize="medium"
                    sx={{
                        position: "absolute",
                        right: 20,
                        top: 54,
                        fill: 'rgba(0,0,0,0.7)',
                        cursor: "pointer",
                    }}
                    onClick={sendMessage}
                />
            </Grid>
        </Grid>
    </MDBox>
    )
}

const nameStyle = {
    fontFamily: fontsFamily.poppins,
    fontWeight: "600",
    fontSize: "16px",
    color: mibananaColor.yellowTextColor,
};

export default SingleChat
