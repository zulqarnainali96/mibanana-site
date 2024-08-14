/* eslint-disable jsx-a11y/alt-text */
import React, { useContext, useEffect, useRef, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import apiClient from "api/apiClient";
import reduxContainer from "redux/containers/containers";
import { useSelector } from "react-redux";
import ImageAvatar from "assets/mi-banana-icons/default-profile.png";
import "./style.css";
// import MDSnackbar from "components/MDSnackbar";
import FileModal from "./Files Modal/FileModal";
import FileUploadContainer from "./File-upload-container";
import { currentUserRole } from "redux/global/global-functions";
import ChatsContainer from "./Chat-container";
// import { SocketContext } from "sockets";
import { v4 as uuidv4 } from 'uuid';
import { Action } from 'layouts/ProjectsTable/data/authorsTableData';
import TransitionsModal from "components/Modal/Modal";
import TransitionsErrorModal from "components/Modal/ErrorModal";
import { getUserRoles } from "redux/global/global-functions";
import { useSocket } from "sockets";
import { handleRole } from "redux/global/global-functions";

const Chating = ({ reduxState, reduxActions }) => {
  const socketRef = useSocket()
  // const socketRef = useRef(useContext(SocketContext));
  const role = currentUserRole(reduxState)
  const options = {
    timeZone: 'Europe/Berlin',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Use 24-hour format
  };
  const { id } = useParams();
  const [project, setProject] = useState(reduxState.project_list?.CustomerProjects?.find(item => item._id === id || {}))
  const [fileVersion, setFileVersionList] = useState(project?.version.length > 0 ? project?.version : []);

  const currentTime = new Date(); // Get the current date and time
  const formattedTime = new Intl.DateTimeFormat('en-GB', options).format(currentTime);
  const formattedDate = currentTime.toLocaleDateString();
  const [msgArray, setMsgArray] = useState([]);
  const [message, sendMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [modalState, setModalState] = useState(false);

  const [open, setOpen] = useState(false);
  const [respMessage, setRespMessage] = useState("");
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const { id: user, name } = reduxState?.userDetails;

  let avatar = useSelector((state) => state.userDetails?.avatar);

  const team_members = project?.team_members?.length > 0 ? project?.team_members[0]?._id : "";

  const onSendMessage = async (event) => {
    const user_message = message
    sendMessage("")
    event.preventDefault();
    if (user_message === "") {
      return;
    }
    const data = {
      project_id: id,
      chat_message: {
        type: "chat-message",
        project_id: id,
        project_title: project?.project_title,
        project_category : project.project_category,
        authorId: project?.user,
        user,
        name: name,
        avatar: avatar ? avatar : ImageAvatar,
        time_data: formattedTime,
        date: formattedDate,
        message: user_message,
        role: getUserRoles(role),
        view: true,
      },
    };

    setMsgArray((prev) => (prev ? [...prev, data.chat_message] : [data.chat_message]));
    socketRef.emit("room-message", data.chat_message, id, team_members);
    await apiClient
      .put("/chat-message", data)
      .then(({ data }) => {
        // console.log("Message ", data?.message)
      })
      .catch((e) => console.log("Chat Send Error ", e?.response));
    const userData = {
      userId: user,
      projectID: id,
      role: getUserRoles(),
      message: {
        unique: uuidv4(),
        project_id: id,
        project_title: project.project_title,
        user,
        name: name,
        avatar: avatar ? avatar : ImageAvatar,
        time_data: formattedTime,
        date: formattedDate,
        message: user_message,
        role: getUserRoles(),
        view: true,
      },
    };
    // await apiClient
    //   .post("/api/send-message-to-others", userData)
    //   .then(({ data }) => {
    //     console.log(data);
    //   })
    //   .catch((e) => console.log("Update chat notifications error ", e?.response));
    // sendMessage("");
  };
  function joinChatRoom() {
    // setHideChatBox(true);
    // socketRef.current.emit("room-message", "", id);
    socketRef.emit("join-room", id);
  }

  const getChatMessage = async () => {
    await apiClient
      .get("/chat-message/" + id)
      .then(({ data }) => {
        if (data.chat?.chat_msg?.length) {
          setMsgArray(data.chat?.chat_msg);
        }
      })
      .catch((e) => {
        setMsgArray([]);
        console.error("error ", e.response);
      });
  };

  useEffect(() => {
    socketRef.on("message", (message) => {
      if (message !== "") {
        setMsgArray((prev) => [...prev, message]);
      }
    });
  }, [socketRef]);

  useEffect(() => {
    getChatMessage();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [msgArray]);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    joinChatRoom();
    // return () => {
    //   socketRef.current.emit('leave-room', id)
    // }
  }, []);

  useEffect(() => {
    getChatMessage();
  }, [id])

  return (
    <DashboardLayout>
      <FileModal title="Files" open={modalState} setOpen={setModalState} />
      <TransitionsModal message={respMessage} openModal={successSB} setOpenModal={setSuccessSB} />
      <TransitionsErrorModal message={respMessage} openModal={errorSB} setOpenModal={setErrorSB} />

      <Grid
        container
        spacing={2}
        mt={0}
        py={3}
        paddingInline={"45px"}
        sx={({ breakpoints }) => ({
          height: "87vh",
          [breakpoints.down('xl')]: {
            gap: '13px',
            //  overflowY : 'auto' 
          }
        })}
      >
        <Grid
          item
          xxl={6}
          xl={6}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          sx={{
            position: "relative",
            bgcolor: "#F6F6E8",
            padding: 0,
            height: "100%",
            overflow: "scroll",
            overflowX: "hidden",
            paddingRight: "16px",
            "::-webkit-scrollbar": {
              width: "0",
              height: "0",
            },

          }}
        >
          <ChatsContainer
            chatContainerRef={chatContainerRef}
            setRespMessage={setRespMessage}
            setFileVersion={setFileVersionList}
            openSuccessSB={openSuccessSB}
            openErrorSB={openErrorSB}
            msgArray={msgArray}
            onSendMessage={onSendMessage}
            setProject={setProject}
            project={project}
            sendMessage={sendMessage}
            message={message}
            reduxState={reduxState}
            projectAttend={() => Action.projectAttend(id)}
            projectForReview={() => Action.projectForReview(id)}
          />

        </Grid>
        <Grid item xxl={6} xl={6} lg={12} md={12} sm={12} xs={12} pt="0 !important" height="100%" sx={({ breakpoints }) => ({
          [breakpoints.down('xl')]: {
            paddingLeft: '0 !important'
            //  overflowY : 'auto' 
          }
        })}>
          <FileUploadContainer
            setRespMessage={setRespMessage}
            respMessage={respMessage}
            openSuccessSB={openSuccessSB}
            openErrorSB={openErrorSB}
            showMore={showMore}
            fileVersion={fileVersion}
            setFileVersionList={setFileVersionList}
            setShowMore={setShowMore}
            getChatMessage={getChatMessage}
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};



export default reduxContainer(Chating);
