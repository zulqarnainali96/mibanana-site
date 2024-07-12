import React from 'react'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import SendOutlined from '@mui/icons-material/SendOutlined'
import { mibananaColor } from 'assets/new-images/colors'
import ReactQuill from "react-quill";
import { reactQuillStyles2 } from 'assets/react-quill-settings/react-quill-settings';
import { modules } from 'assets/react-quill-settings/react-quill-settings'
import { formats } from 'assets/react-quill-settings/react-quill-settings'
import usePrivateChat from './usePrivateChat'
import { Close } from '@mui/icons-material'
import FullScreenLoader from 'components/Loader/FullScreenLoader'
import { BeatLoader } from 'react-spinners'


const PrivateChat = ({
    boxStyles,
    userId,
    username,
    user_avatar,
    item,
    reduxState,
    reduxActions,

}) => {
    const { name, avatar, roles, _id } = item
    const classes = reactQuillStyles2()
    const { message, setMessage, chats, loading, sendMessage, privateChatRef } = usePrivateChat(userId, _id, name, username, avatar, user_avatar, reduxState, reduxActions)

    function avatarImage(item) {
        let avatar = ''
        if (userId === item.sender) {
            avatar = item.sender_avatar
        } else {
            avatar = item.receivar_avatar
        }
        return avatar
    }
    function getImageAlt(item) {
        let alt = ''
        if (userId === item.sender) {
            alt = item.sender_name
        } else {
            alt = item.receivar_name
        }
        return alt
    }
    function msgPosition(item) {
        let align = ''
        let bgColor = ''
        if (userId === item.sender) {
            align = 'flex-end'
            bgColor = '#bbf8b9'
        } else {
            align = 'flex-start'
            bgColor = '#fff'
        }
        return {
            alignSelf: align,
            backgroundColor: bgColor,

        }
    }
    const scrollStyle = {
        "&::-webkit-scrollbar": {
            width: '10px',
            height: '16px'
        },
        "&::-webkit-scrollbar-track": {
            background: '#f1f1f1',
        },
        "&::-webkit-scrollbar-thumb": {
            background: '#888',
            borderRadius: '10px',
        },
        "&::-webkit-scrollbar-thumb:hover": {
            background: '#555',
        }
    }
    const chatBoxStyle = { marginLeft: '10px', width: '100%', height: '100%', display: 'flex', padding: '0.5rem', paddingBottom: '14px', overflowY: "scroll", ...scrollStyle }
    const chatBoxStyle2 = { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '1.5rem', paddingBottom: "12px" }

    return (
        <Box sx={{ position: 'relative', width: '75%', marginLeft: "unset !important", boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", borderRadius: "10px", ...boxStyles, display: "flex", flexDirection: "column", padding: "1.5rem", justifyContent: "space-between", transition: "width 0.5s ease-in-out", backgroundColor: mibananaColor.headerColor, }}>

            {/* <span style={{ position: 'absolute', right: 12 }}><IconButton><Close fontSize='medium' /></IconButton></span> */}
            <Box sx={{ width: '100%', display: 'flex', backgroundColor: mibananaColor.headerColor, }}>
                <ListItem divider focusRipple={true} disableTouchRipple={true} disableRipple={true} >
                    <ListItemButton sx={{ "&:hover": { backgroundColor: "transparent !important" } }}>
                        <ListItemIcon>
                            <Avatar src={""} alt={""} />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    {name}
                                    <Typography
                                        variant="body2"
                                        component="div"
                                        color="textSecondary"
                                    >
                                        role : <i>{roles?.length ? roles[0] : ''}</i>
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            </Box>
            {loading ? (
                <FullScreenLoader>
                    <BeatLoader size={25} color={'#fff'} />
                </FullScreenLoader>
            ) : (<Box ref={privateChatRef} sx={chatBoxStyle} >
                <Box sx={chatBoxStyle2}>
                    {chats?.map(item => {
                        return (
                            <ListItem disablePadding sx={{ backgroundColor: '#fff', width: '60%', ...(msgPosition(item)) }}>
                                <ListItemButton sx={{ "&:hover": { backgroundColor: "transparent !important" } }}>
                                    <ListItemIcon>
                                        <Avatar src={avatarImage(item)} alt={getImageAlt(item)} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                Zain
                                                <Typography
                                                    variant="body2"
                                                    component="div"
                                                    color="textSecondary"
                                                    fontFamily={'"Poppins", sans-serif'}
                                                    dangerouslySetInnerHTML={{ __html: item.message }}
                                                >

                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </Box>


            </Box>
            )}


            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: mibananaColor.headerColor }}>
                <ReactQuill
                    theme="snow"
                    value={message}
                    onChange={(value) => setMessage(value)}
                    modules={modules}
                    formats={formats}
                    className={classes.quill}
                    style={{ width: '94%' }}
                />
                <IconButton onClick={sendMessage}>
                    <SendOutlined
                        fontSize="large"
                        sx={{
                            fontSize: "2.67rem !important",
                            scale: 1.5,
                            right: 20,
                            top: 54,
                            fill: 'rgba(0,0,0,0.7)',
                            cursor: "pointer",
                        }}
                    />
                </IconButton>
            </Box>
        </Box>
    )
}

export default PrivateChat
