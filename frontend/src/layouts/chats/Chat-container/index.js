import { useContext, useRef, useState } from 'react';
import SendOutlined from '@mui/icons-material/SendOutlined';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { mibananaColor } from 'assets/new-images/colors';
import { modules } from 'assets/react-quill-settings/react-quill-settings';
import { formats } from 'assets/react-quill-settings/react-quill-settings';
import { reactQuillStyles2 } from 'assets/react-quill-settings/react-quill-settings';
import MDTypography from 'components/MDTypography';
import React from 'react'
import ReactQuill from "react-quill";
import { fontsFamily } from 'assets/font-family';
import imageAvatar from "assets/mi-banana-icons/default-profile.png";
import { MenuList, useMediaQuery } from '@mui/material';
import MDBox from 'components/MDBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useParams } from 'react-router-dom';
import MDButton from 'components/MDButton';
import apiClient from 'api/apiClient';
import { sendingStatusNotification } from 'socket-events/socket-event';
// import { SocketContext } from 'sockets';
import { getProjectData } from 'redux/global/global-functions';
import { ArrowForward } from '@mui/icons-material';
import { MoonLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { getCustomerProject } from 'redux/actions/actions';
import { currentUserRole } from 'redux/global/global-functions';
import TransitionsModal from 'components/Modal/Modal';
import { handleRole } from 'redux/global/global-functions';
import { getProjectById } from 'redux/global/global-functions';
import { useSocket } from 'sockets';
import ProjectChanges from './project-changes';

const ChatsContainer = ({
    chatContainerRef,
    msgArray,
    setProject,
    project,
    setRespMessage,
    openSuccessSB,
    openErrorSB,
    onSendMessage,
    reduxState,
    sendMessage,
    message,
    setFileVersionList,
    projectAttend,
    projectForReview
}) => {
    const classes = reactQuillStyles2()
    const avatar = reduxState?.userDetails?.avatar;
    const userId = reduxState?.userDetails?.id
    const is500 = useMediaQuery("(max-width:500px)")
    const [loading, setLoading] = useState(false)
    // const socketIO = useRef(useContext(SocketContext));
    const socketIO = useSocket();

    const role = currentUserRole(reduxState);
    const { id } = useParams();
    const currentProject = reduxState?.project_list?.CustomerProjects?.find(item => item._id === id);
    const dispatch = useDispatch()
    const func = (value) => dispatch(getCustomerProject(value))
    const [openModal, setOpenModal] = useState(false)

    // handle dropdown menu for change status in chat
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const userDetailsString = localStorage.getItem('user_details');
    const userRole = userDetailsString ? JSON.parse(userDetailsString).roles[0] : '';

    const projectAttend1 = async (itemId) => {
        const data = {
            user: currentProject?.user
        }
        await apiClient.get('/api/attend-project/' + id, data)
            .then(({ data }) => {
                sendingStatusNotification(socketIO, role, currentProject, userId, 'Ongoing')
                handleClose()
                setTimeout(() => {
                    getProjectData(userId, func)
                    //   show Pop notifications here
                    setOpenModal(true)
                }, 800)
            })
            .catch((err) => {
                handleClose()
                console.log(err.message)
                // Show Error POp here

            })
        // Implement your logic here to handle project completion

    };
    const projectForReview1 = async () => {
        // Implement your logic here to handle project completion
        const data = {
            user: currentProject?.user
        }
        await apiClient.get('/api/for-review-project/' + id, data)
            .then(({ data }) => {
                sendingStatusNotification(socketIO, role, currentProject, userId, 'For Review')
                handleClose()
                setTimeout(() => {
                    getProjectData(userId, func)
                    //   show Pop notifications here
                    setOpenModal(true)
                }, 800)
            })
            .catch((err) => {
                console.log(err.message)
                handleClose()
                // Show Error POp here

            })

    };
    const withRevision = async () => {
        setLoading(true)
        await apiClient.get('/api/with-revision/' + id)
            .then(({ data }) => {
                setTimeout(() => {
                    getProjectData(userId, func)
                    //   show Pop notifications here
                    setOpenModal(true)
                }, 800)
                handleClose()
                setLoading(false)
                sendingStatusNotification(socketIO, role, currentProject, userId, 'With Revision')
            })
            .catch((err) => {
                handleClose()
                setLoading(false)

                // Show Error POp here

            })
    }
    const makePriorityHigh = async () => {
        await apiClient.post("/api/set-project-priority", { project_id: id, priority: "High" })
            .then(({ data }) => {
                setRespMessage(data.message)
                getProjectById(id, setProject, project.project_category, setFileVersionList)
                setTimeout(() => {
                    openSuccessSB()
                }, 800)
            })
            .catch((err) => {
                setRespMessage(err.response.data.message)
                openErrorSB()
            })
    }
    return (
        <React.Fragment>
            <ProjectChanges
                withRevision={withRevision}
                anchorEl={anchorEl}
                handleClose={handleClose}
                projectAttend1={projectAttend1}
                projectForReview1={projectForReview1}
                makePriorityHigh={makePriorityHigh}
                handleClick={handleClick}
                loading={loading}
                userRole={role}
                project_user={project?.user}
                project_id={id}
                userId={userId}
                is500={is500}
            />

            <Grid
                ref={chatContainerRef}
                container
                justifyContent={"space-between"}
                alignItems={"flex-start"}
                flexDirection={"column"}
                sx={{
                    height: "86%",
                    overflowY: "scroll",
                    "::-webkit-scrollbar": {
                        width: "10px",
                        height: "0",
                    },
                    "::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                        borderRadius: 2
                    },
                }}
            >
                <h1 className='h1-style'>CHAT</h1>
                <Grid item xxl={12} xl={12} lg={12} width={"100%"}>
                    <Box className="chat" >
                        {msgArray?.length
                            ? msgArray.map((item, index, messages) => {
                                return (
                                    <>
                                        {is500 ? (
                                            <prev key={index}
                                                className={`message ${item.user === userId ? "right" : "left"
                                                    }`}
                                                style={{ position: "relative" }}>
                                                <MDBox display="flex" gap="12px">
                                                    <p style={{ ...nameStyle, position: "relative", width: "100%", fontSize: "11px" }}>
                                                        {item.name}
                                                        <span
                                                            style={{ ...nameStyle, fontWeight: "300", fontSize: "9px" }}
                                                        >
                                                            {" (" + item?.role + ")"}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: "8px",
                                                                fontWeight: "300",
                                                                position: "absolute",
                                                                right: "10px",
                                                                color: mibananaColor.tableHeaderColor,
                                                            }}
                                                        >
                                                            {item.time_data ? item.time_data : null}
                                                        </span>
                                                    </p>
                                                </MDBox>
                                                <Box
                                                    sx={{ mt: 1, p: '7px', paddingInline: is500 && '18px', ...nameStyle, fontWeight: "300", fontSize: "10px" }}
                                                    className="message-content"
                                                    dangerouslySetInnerHTML={{ __html: item.message }}
                                                >

                                                </Box>
                                            </prev>
                                        ) : (
                                            <pre
                                                key={index}
                                                className={`message ${item.user === userId ? "right" : "left"
                                                    }`}
                                                style={{ position: "relative" }}
                                            >
                                                <Box sx={{ display: "flex" }}>
                                                    <img
                                                        src={item.avatar}
                                                        width={50}
                                                        height={50}
                                                        loading="lazy"
                                                        style={{
                                                            borderRadius: 0,
                                                            marginTop: -7,
                                                            display: "inline-block",
                                                            left: item.user === userId ? "70px" : "-9px",
                                                        }}
                                                    />
                                                    <Box width="100%" ml={"18px"}>
                                                        <Box
                                                            className="user-name"
                                                            style={{
                                                                display: "flex",
                                                                gap: "8px",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <p style={{ ...nameStyle, position: "relative", width: "100%" }}>
                                                                {item.name}
                                                                <span
                                                                    style={{ ...nameStyle, fontWeight: "300", fontSize: "12px" }}
                                                                >
                                                                    {" (" + item?.role + ")"}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        fontSize: "10px",
                                                                        fontWeight: "300",
                                                                        position: "absolute",
                                                                        right: "10px",
                                                                        color: mibananaColor.tableHeaderColor,
                                                                    }}
                                                                >
                                                                    {item.time_data ? item.time_data : null}
                                                                </span>
                                                            </p>
                                                        </Box>
                                                        <Box
                                                            sx={{ p: 2, ...nameStyle, fontWeight: "300", fontSize: "12px" }}
                                                            className="message-content"
                                                            dangerouslySetInnerHTML={{ __html: item.message }}
                                                        >

                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </pre>)}
                                    </>
                                );
                            })
                            : null}
                    </Box>
                </Grid>
            </Grid>
            <Box
                width="98%"
                m='auto'
                mt={0}
                p={1}
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "absolute",
                    paddingBlock: '10px',
                    left: "0",
                    bottom: "0px",
                    gap: '15px',
                    backgroundColor: mibananaColor.headerColor
                }}
            >
                <Box sx={{ display: is500 ? "none" : 'block' }}>
                    <img
                        src={avatar ? avatar : imageAvatar}
                        width={is500 ? 34 : 50}
                        height={is500 ? "auto" : 50}
                        alt="person-image"
                    />
                </Box>
                <ReactQuill
                    theme="snow"
                    value={message}
                    onChange={(value) => sendMessage(value)}
                    modules={modules}
                    formats={formats}
                    className={classes.quill}
                    style={{ width: is500 ? '97%' : '87%' }}
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
                    onClick={onSendMessage}
                />
            </Box>
            <TransitionsModal message="Status change successfully" openModal={openModal} setOpenModal=
                {setOpenModal} />
        </React.Fragment>
    )
}

const nameStyle = {
    fontFamily: fontsFamily.poppins,
    fontWeight: "600",
    fontSize: "16px",
    color: mibananaColor.yellowTextColor,
};

const sendChangeButton = {
    color: '#333',
    textTransform: 'capitalize',
    "&.MuiButton-root:focus": {
        backgroundColor: "#FFE135"
    }
}
export default ChatsContainer
