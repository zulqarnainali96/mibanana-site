import List from '@mui/material/List';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import apiClient from 'api/apiClient';
import { useEffect, useState } from 'react';
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

const ProjectList = ({ item, index, currentIndex, showProjects }) => {
    const [msg, setMsgArr] = useState("")

    useEffect(() => {
        async function getChatMessage() {
            try {
                const { data } = await apiClient('/chat-message/' + item?._id)
                if (data?.chat?.chat_msg?.length > 0) {
                    const chatMessage = data?.chat?.chat_msg
                    const lastMessage = chatMessage[chatMessage?.length - 1].view ? chatMessage[chatMessage?.length - 1].message : 'no unread message' 
                    console.log(chatMessage)
                    setMsgArr(lastMessage)
                } else {
                    setMsgArr("no message inside chat")
                }
            } catch(error) {
                setMsgArr("")
                console.log(error)
            }
        }
        getChatMessage()
    }, [item])


    const statusColor = () => {
        let statusColor = ''
        if (item?.status === 'Ongoing' || item?.status === 'Submitted') {
            statusColor = mibananaColor.greenShade2
        }
        else if (item?.status === 'Completed') {
            statusColor = 'blue'
        }
        else if (item?.status === 'Approval') {
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
    const titleStyle = {
        fontSize: "16px",
        fontsFamily: fontsFamily.poppins,
        fontWeight: '400',
        color: mibananaColor.yellowTextColor
    }
    const chatMsg = {
        fontSize: "13px",
        color: mibananaColor.tableHeaderColor,
        textOverflow: 'ellipsis',
        whiteSpace: "break-spaces",
        
    }
    const shrinkText = () => {
        let shrinkText = msg.substring(0, 80)
        if(msg?.length > 80){
            shrinkText += "....."
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
            <MDBox sx={chatMsg}>{shrinkText()}</MDBox>
        </MDBox >
    )
}
export default () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentIndex = useSelector(state => state.currentIndex)
    const render_chat = useSelector(state => state.re_render_chat)
    const setIndex = (payload) => dispatch(setCurrentIndex(payload))
    const setChatRender = (payload) => dispatch(reRenderChatComponent(payload))
    const projects = useSelector(state => state.project_list.CustomerProjects)
    const setState = (payload) => dispatch(setRightSideBar(payload))
    const rightSideDrawer = useSelector(state => state.rightSideDrawer)
    const notification = useSelector(state => state.userDetails.notifications)

    function showProjects(id, index) {
        setIndex(index)
        setChatRender(!render_chat)
        setTimeout(() => {
            navigate("/chat/" + id)
        }, 400)
    }

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : "100%", marginTop: '3rem' }}
            role="presentation"
        // onClick={toggleDrawer(anchor, false)}
        // onKeyDown={toggleDrawer(anchor, false)}
        >
            <East fontSize='medium' sx={{ position: 'absolute', top: 10, left: 10, cursor: 'pointer', }} onClick={toggleDrawer("right", false, setState, rightSideDrawer)} />
            <List>
                <MDTypography variant="h5" pt={3} pb={1} textAlign="left" sx={{ fontFamily: fontsFamily.poppins, fontWeight: 'bold', color: mibananaColor.yellowTextColor }}>&nbsp;&nbsp;Projects</MDTypography>
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
            </List>
        </Box>
    );
    return {
        list: list
    }
}
