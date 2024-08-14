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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import "../../miBananaTeamMembers.css";
import { Grid, Menu, MenuItem, MenuList } from '@mui/material';
import MenuItemDropdown from 'layouts/ProjectsTable/data/MenuItem';
import EditGroupChat from '../Edit-Group/edit-group-form';
import useGroupChat from './useGroupChat';
import TransitionsModal from 'components/Modal/Modal';
import TransitionsErrorModal from 'components/Modal/ErrorModal';
import { formatMessageDate } from 'redux/global/table-date';
import { handleRole } from 'redux/global/global-functions';

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
    const { group_name, avatar, _id, admin_id, participant, messages } = item
    const classes = reactQuillStyles2()

    function avatarImage(item) {
        let profileImage = ''
        if (userId === item.sender) {
            profileImage = user_avatar
        } else {
            profileImage = item.avatar
        }
        return profileImage
    }

    function getImageAlt(item) {
        let alt = ''
        if (userId === item.sender) {
            alt = item.username
        } else {
            alt = item.sender_name
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

    function copyMessageWithHtml(message) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = message;
        document.body.appendChild(tempElement);
        const range = document.createRange();
        range.selectNodeContents(tempElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        document.body.removeChild(tempElement);
        selection.removeAllRanges();
        alert("Message copied to clipboard!");
    }


    const { open, handleClose: onClose, handleOpen, respMessage, setRespMessage, successSB, errorSB, openErrorSB, openSuccessSB, setErrorSB, setSuccessSB, loading, message, privateChatRef, sendMessage, setMessage, deleteChatGroup, delLoading, role } = useGroupChat(setReload, closeChat, userId, _id, 'name', username, avatar, user_avatar, reduxState, reduxActions, item)

    console.log(privateChatRef.current?.scrollTop)
    return (
        <Box className={'mainBox'} sx={{ ...boxStyles }}>
            <EditGroupChat
                open={open}
                data={item}
                userId={userId}
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
                        {role?.projectManager || handleRole(role)?.teamMember ? <Grid
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
                        </Grid> : <IconButton onClick={closeChat} className='chat-close-icon'><Close /></IconButton>}
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
                                {userId === admin_id ? (
                                    <MenuItem onClick={handleOpen}>
                                        Edit Group
                                    </MenuItem>
                                ) :
                                    (
                                        <MenuItem onClick={handleOpen}>
                                            View Group
                                        </MenuItem>
                                    )
                                }
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
                <Box className={'chatBoxStyle'}>
                    <Box ref={privateChatRef} className={'chatBoxStyle2'}>
                        {reduxState.group_message?.length > 0 ? reduxState.group_message?.map(item => {
                            return (
                                <ListItem disablePadding sx={{ backgroundColor: '#fff', width: '60%', ...(msgPosition(item)) }}>
                                    <ListItemButton disableRipple={true} sx={{ "&:hover": { backgroundColor: "transparent !important" }, position: 'relative' }}>
                                        <ListItemIcon>
                                            <Avatar src={avatarImage(item)} alt={item?.sender_name} />
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
                                                    <Typography
                                                        variant="body2"
                                                        component="span"
                                                        fontFamily={'"Poppins", sans-serif'}
                                                        sx={{
                                                            position: 'absolute',
                                                            color: '#00000070',
                                                            fontSize: '.8rem',
                                                            bottom: '5px',
                                                            right: '15px',
                                                        }}
                                                    >
                                                        {formatMessageDate(item.date)}
                                                    </Typography>
                                                    <IconButton
                                                        onClick={() => copyMessageWithHtml(item.message)}
                                                        sx={{ position: 'absolute', right: 0, top: 5 }}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )
                        }) : (
                            <Typography
                                variant="body2"
                                component="div"
                                color="title"
                                fontFamily={'"Poppins", sans-serif'}
                                textAlign={'center'}
                                sx={{
                                    marginTop: '10px',
                                    fontSize: '1.2rem',
                                    fontWeight: '400'
                                }}
                            >
                                No Messages Found
                            </Typography>
                        )}
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