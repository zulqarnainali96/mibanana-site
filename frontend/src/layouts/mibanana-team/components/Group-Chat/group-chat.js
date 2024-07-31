import React from 'react';
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
import FullScreenLoader from 'components/Loader/FullScreenLoader'
import { BeatLoader } from 'react-spinners'
import UserOnlineIcon from '../userOnlineicon'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import reduxContainer from 'redux/containers/containers';
import usePrivateChat from '../Private-Chat/usePrivateChat';
import { fontsFamily } from 'assets/font-family';
import { Close } from '@mui/icons-material';
import "../../miBananaTeamMembers.css";
import { Grid, Menu, MenuItem, MenuList } from '@mui/material';
import MenuItemDropdown from 'layouts/ProjectsTable/data/MenuItem';
import EditGroupChat from '../Edit-Group/edit-group-form';
import useGroupChat from './useGroupChat';
import TransitionsModal from 'components/Modal/Modal';
import TransitionsErrorModal from 'components/Modal/ErrorModal';

const GroupChat = ({
    boxStyles,
    closeChat,
    handleClick,
    handleClose,
    anchorEl,
    userId,
    isReload,
    username,
    user_avatar,
    setReload,
    item,
    reduxState,
    reduxActions, }) => {
    const { group_name, avatar, _id, participant, messages } = item
    const classes = reactQuillStyles2()

    function avatarImage(item) {
        let profileImage = ''
        if (userId === item.sender) {
            profileImage = user_avatar
        } else if (_id === item.sender) {
            profileImage = avatar
        }
        return profileImage
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
    function userName(item) {
        let name = ''
        if (userId === item.sender) {
            name = username
        } else {
            name = item.sender_name
        }
        return name
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

    const onlineWidth = (member) => {
        const currentUser = reduxState.onlineUser?.some(item => item.id === member._id)
        if (currentUser) {
            return { gap: '1rem' }
        }
        else {
            return null
        }
    }

    const { open, handleClose: onClose, handleOpen, respMessage, setRespMessage, successSB, errorSB, openErrorSB, openSuccessSB, setErrorSB, setSuccessSB, loading, message, privateChatRef, sendMessage, setMessage, deleteChatGroup, delLoading } = useGroupChat(setReload, closeChat, userId, _id, 'name', username, avatar, user_avatar, reduxState, reduxActions, item)
    return (
        <Box className={'mainBox'} sx={{ ...boxStyles }}>
            <EditGroupChat
                open={open}
                data={item}
                reduxState={reduxState}
                onClose={onClose}
                openErrorSB={openErrorSB}
                openSuccessSB={openSuccessSB}
                setRespMessage={setRespMessage}
                setReload={setReload}
            />
            <TransitionsModal message={respMessage} openModal={successSB} setOpenModal={setSuccessSB} />
            <TransitionsErrorModal message={respMessage} openModal={errorSB} setOpenModal={setErrorSB} />
            <Box sx={{ width: '100%', display: 'flex', backgroundColor: mibananaColor.headerColor, position: 'relative' }}>
                <ListItem divider >
                    <ListItemButton disableRipple={true} sx={{ "&:hover": { backgroundColor: "transparent !important" }, ...(onlineWidth(item)) }}>
                        <UserOnlineIcon member={item} data={reduxState.onlineUser} />
                        <Grid
                            className='chat-close-icon'
                            id="dropdown-btn"
                            aria-controls={anchorEl ? 'dropdown-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={anchorEl ? 'true' : undefined}
                            onClick={handleClick}
                            item
                            xs={6}
                            sx={{ display: "flex", justifyContent: "end", alignItems: "center", cursor: "pointer", color: '#333' }}
                        >
                            <MoreVertIcon fontSize='medium' />
                        </Grid>
                        <Menu
                            id="dropdown-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            style={{ top: "10px" }}
                        >
                            <MenuList>
                                <MenuItem onClick={handleOpen}>Edit Group</MenuItem>
                                <MenuItemDropdown deleteClass={"delete"} title={"Delete Group"} onClick={deleteChatGroup} loading={delLoading} disabled={delLoading} />
                                <MenuItem onClick={closeChat}>Close Chat</MenuItem>
                            </MenuList>
                        </Menu>

                        <ListItemText
                            primary={
                                <React.Fragment>
                                    {group_name}
                                    <Typography
                                        variant="body2"
                                        component="div"
                                        color="textSecondary"
                                        fontFamily={fontsFamily.poppins}
                                    >
                                        Members :{participant?.map(item => <span>{item.name + ", " + "  "}</span>)}
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
            ) : (
                <Box ref={privateChatRef} className={'chatBoxStyle'}>
                    <Box className={'chatBoxStyle2'}>
                        {reduxState.group_message?.map(item => {
                            return (
                                <ListItem disablePadding sx={{ backgroundColor: '#fff', width: '60%', ...(msgPosition(item)) }}>
                                    <ListItemButton disableRipple={true} sx={{ "&:hover": { backgroundColor: "transparent !important" } }}>
                                        <ListItemIcon>
                                            <Avatar src={''} alt={''} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <React.Fragment>
                                                    {userName(item)}
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

export default reduxContainer(GroupChat)