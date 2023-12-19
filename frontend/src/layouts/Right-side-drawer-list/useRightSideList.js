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
import { East } from '@mui/icons-material';
import { setRightSideBar } from 'redux/actions/actions';
import { toggleDrawer } from 'redux/global/global-functions';

const ProjectList = ({ item, index, currentIndex, showProjects }) => {
    const [msg, setMsgArr] = useState([])

    useEffect(() => {
        async function getChatMessage() {
            try {
                const { data } = await apiClient('/chat-message/' + item?._id)
                setMsgArr(data?.chat?.chat_msg)
            } catch (error) {
                setMsgArr([])
            }
        }
        getChatMessage()
    }, [])

    return (
        <MDBox
            display="flex"
            flexDirection="column"
            alignItems="left" p={1}
            border="1px solid #ccc"
            width="98%"
            margin="4px auto"
            shadow={currentIndex === index ? "xl" : "none"}
            // shadow={currentIndex === index ? "8px 6px 19px -1px #ccc" : "1px 4px 8px 2px #ccc"}
            bgColor={currentIndex === index ? "#d5efe25e" : "inherit"}
            sx={{ cursor: "pointer" }}
        >
            <MDBox display="flex" gap="12px" alignItems="center" onClick={() => showProjects(item?._id)}>
                <span style={{ borderRadius: '30px', width: '15px', height: '15px', backgroundColor: item?.status === 'Ongoing' ? '#FFE135' : 'red' }}></span>
                <MDTypography fontSize="small">{item.project_title}</MDTypography>
            </MDBox>
            {/* <Grid container height={"auto"} spacing={2}>
                <Grid item xxl={4} xl={4} md={4} xs={4}>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>last message : &nbsp;</p>
                </Grid>
                <Grid item xxl={7} xl={7} md={7} xs={7}>
                    <span style={{ fontSize: '16px', fontWeight: '300', whiteSpace: 'pre-wrap' }}>{msg.length > 0 ? msg[msg.length - 1].message : 'no msg yet'}</span>
                </Grid>
            </Grid>     
            <MDBox>
                <p style={{ fontSize: '14px', fontWeight: '500' }}>From : <span style={{ fontSize: '14px', fontWeight: '400' }}>{msg[msg?.length - 1]?.role}</span></p>
            </MDBox> */}
            {/* <Button onClick={() => showProjects(item?._id)}>View project</Button> */}
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
            <East fontSize='medium' sx={{ position: 'absolute', top: 10, left: 10, cursor : 'pointer' }} onClick={toggleDrawer("right",false,setState,rightSideDrawer)} />
            <List>
                <MDTypography variant="h5" pt={3} pb={1} textAlign="left">&nbsp;&nbsp;Projects</MDTypography>
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
                {projects?.length === 0 && <MDTypography variant="h6" textAlign="center">No Projects Found</MDTypography>}
            </List>
        </Box>
    );
    return {
        list: list
    }
}