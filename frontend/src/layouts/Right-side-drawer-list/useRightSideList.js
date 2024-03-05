import List from '@mui/material/List';
import { Badge, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import apiClient from 'api/apiClient';
import React, { useEffect, useState } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { setCurrentIndex } from 'redux/actions/actions';
import { useDispatch } from 'react-redux';
import { reRenderChatComponent } from 'redux/actions/actions';
import { East, StarRate } from '@mui/icons-material';
import { setRightSideBar } from 'redux/actions/actions';
import { toggleDrawer } from 'redux/global/global-functions';
import { fontsFamily } from 'assets/font-family';
import { mibananaColor } from 'assets/new-images/colors';
import MDButton from 'components/MDButton';
import { ToogleChatsAction } from 'redux/actions/actions';
import ProjectNotification from './project-notification';

const titleStyle = {
    fontSize: "16px",
    whiteSpace: 'normal',
    wordBreak: "auto-phrase",
    fontsFamily: fontsFamily.poppins,
    fontWeight: '400',
    color: mibananaColor.yellowTextColor
}
const chatMsg = {
    fontSize: "13px",
    color: mibananaColor.tableHeaderColor,
    padding: '10px',
    textOverflow: 'ellipsis',
    whiteSpace: "break-spaces",
    "> p, span h1, ul li, b ,i": {
        wordBreak: "break-word",
        whiteSpace: "normal",
    }

}

const projectBoxStyles = {
    paddingInlineStart: '5px',
}

const ProjectList = ({ item, index, currentIndex, showProjects }) => {
    const [msg, setMsgArr] = useState("")

    // const truncatedDescription = project?.project_description?.substring(0, 240);

    useEffect(() => {
        async function getChatMessage() {
            try {
                const { data } = await apiClient('/chat-message/' + item?._id)
                if (data?.chat?.chat_msg?.length > 0) {
                    const chatMessage = data?.chat?.chat_msg
                    const lastMessage = chatMessage[chatMessage?.length - 1].view ? chatMessage[chatMessage?.length - 1].message : 'no unread message'
                    setMsgArr(lastMessage)
                } else {
                    setMsgArr("no message inside chat")
                }
            } catch (error) {
                setMsgArr("")
            }
        }
        getChatMessage()
    }, [item])


    const statusColor = () => {
        let statusColor = ''
        if (item?.status === 'Ongoing' || item?.status === 'Submitted' || item?.status === 'Assigned') {
            statusColor = mibananaColor.greenShade2
        }
        else if (item?.status === 'Completed') {
            statusColor = 'green'
        }
        else if (item?.status === 'Project manager') {
            statusColor = 'red'
        } else {
            statusColor = '#ccc'
        }
        return {
            borderRadius: '30px',
            display: 'block',
            width: '13px',
            height: '13px',
            backgroundColor: statusColor
        }
    }
    const statusStyle = () => {
        return {
            fontSize: '13px',
            fontFamily: fontsFamily.poppins,
            fontWeight: '300',
            color: mibananaColor.greenShade2
        }
    }

    const shrinkText = () => {
        let shrinkText = msg.substring(0, 80)
        if (msg?.length > 80) {
            shrinkText += "...."
        }
        return shrinkText
    }

    return (
        <MDBox
            display="flex"
            flexDirection="column"
            alignItems="left" p={1}
            width="98%"
            margin="8px auto"
            shadow={currentIndex === index ? "xl" : "none"}
            // shadow={currentIndex === index ? "8px 6px 19px -1px #ccc" : "1px 4px 8px 2px #ccc"}
            // bgColor={currentIndex === index ? "#d5efe25e" : "inherit"}
            bgColor={mibananaColor.headerColor}
            sx={{ cursor: "pointer" }}
            onClick={() => showProjects(item?._id)}
        >
            <MDBox display="flex" gap="12px" justifyContent="space-between" alignItems="center" >
                <MDTypography sx={titleStyle}>{item.project_title}</MDTypography>
                <MDBox display="flex" gap="5px" alignItems="center">
                    <span style={statusColor()}></span>
                    <span style={statusStyle()}>{item?.status}</span>
                </MDBox>
            </MDBox>
            <MDBox sx={chatMsg} dangerouslySetInnerHTML={{ __html: shrinkText() }}></MDBox>
        </MDBox >
    )
}
export default () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentIndex = useSelector(state => state.currentIndex)
    const toogle_chats = useSelector(state => state.toogle_chats)
    const userDetails = useSelector(state => state.userDetails)
    const render_chat = useSelector(state => state.re_render_chat)
    const setIndex = (payload) => dispatch(setCurrentIndex(payload))
    const setChatRender = (payload) => dispatch(reRenderChatComponent(payload))
    let projects = useSelector(state => state.project_list?.CustomerProjects?.filter(item => { return item.status !== "Completed" }))
    const setState = (payload) => dispatch(setRightSideBar(payload))
    const toggleNotifcations = (payload) => dispatch(ToogleChatsAction(payload))
    const rightSideDrawer = useSelector(state => state.rightSideDrawer)

    const userNewChatMessage = useSelector(state => state.userNewChatMessage)
    const project_notifications = useSelector(state => state.project_notifications)

    const showChatPoints = () => {
        const isnotifications = userNewChatMessage?.some(item => item?.view === true)
        return isnotifications
    }

    const showOtherPoints = () => {
        const is_project_notifications = project_notifications?.some(item => item?.view === true)

        return is_project_notifications
    }

    function showProjects(id, index) {
        setIndex(index)
        setChatRender(!render_chat)
        setTimeout(() => {
            navigate("/chat/" + id)
        }, 400)
    }
    function toggleShowNotifications() {
        toggleNotifcations(!toogle_chats)
    }

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : "100%", marginTop: '3rem' }}
            role="presentation"
        // onClick={toggleDrawer(anchor, false)}
        // onKeyDown={toggleDrawer(anchor, false)}
        >
            <East fontSize='medium' sx={{ position: 'absolute', top: 10, left: 10, cursor: 'pointer', }} onClick={toggleDrawer("right", false, setState, rightSideDrawer)} />

            <List sx={projectBoxStyles}>
                <MDTypography variant="h5" pt={1} pb={1} textAlign="left" sx={{ fontFamily: fontsFamily.poppins, fontWeight: 'bold', color: mibananaColor.yellowTextColor }}>&nbsp;&nbsp;Projects</MDTypography>
                <MDBox
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '5px',
                        marginBlock: '14px',
                    }}
                >
                    <MDButton
                        color="error"
                        size="small"
                        disabled={toogle_chats === false}
                        variant="contained"
                        opacity={toogle_chats ? 1 : 0.7}
                        onClick={toggleShowNotifications}
                        position="relative"
                    // sx={{ color: mibananaColor.yellowTextColor }}
                    >
                        Chats msg
                        {showChatPoints() && <span className="notifications-point" style={{
                            top: '-8px', right: '1px'
                        }}></span>}
                    </MDButton>
                    <MDButton
                        color="error"
                        size="small"
                        variant="contained"
                        disabled={toogle_chats === true}
                        opacity={toogle_chats ? 0.7 : 1}
                        onClick={toggleShowNotifications}
                        position="relative"
                    // sx={{color:mibananaColor.yellowTextColor}}
                    >
                        Other Notification
                        {showOtherPoints() && <span className="notifications-point" style={{
                            top: '-8px', right: '1px'
                        }}></span>}
                    </MDButton>
                </MDBox>
                {toogle_chats ? <ProjectNotification project_notifications={project_notifications} /> :
                    <React.Fragment>
                        {projects?.map((item, index) => {
                            return (
                                <ProjectList
                                    key={index}
                                    item={item}
                                    index={index}
                                    showProjects={() => showProjects(item?._id, index)}
                                    currentIndex={currentIndex}
                                />
                            )
                        }
                        )}
                        {projects?.length === 0 && <MDTypography variant="h6" sx={{ fontFamily: fontsFamily.poppins, fontWeight: 'bold' }} textAlign="center">No Projects Found</MDTypography>}
                    </React.Fragment>
                }

            </List>
        </Box>
    );
    return {
        list: list
    }
}
