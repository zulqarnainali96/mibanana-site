/* eslint-disable jsx-a11y/alt-text */
import React, { useContext, useEffect, useRef, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import apiClient from "api/apiClient";
import reduxContainer from "redux/containers/containers";
// import { io } from "socket.io-client"
import { useSelector } from "react-redux";
import ImageAvatar from "assets/mi-banana-icons/default-profile.png";
import "./style.css";
import MDSnackbar from "components/MDSnackbar";
import FileModal from "./Files Modal/FileModal";
import SuccessModal from "components/SuccessBox/SuccessModal";
// import { useSocket } from 'sockets';
import FileUploadContainer from "./File-upload-container";
import { currentUserRole } from "redux/global/global-functions";
import ChatsContainer from "./Chat-container";
import { SocketContext } from "sockets";
import { v4 as uuidv4 } from 'uuid';
import { SocketConnection } from "hooks/useSocketConnectoion";
// https://socket-dot-mi-banana-401205.uc.r.appspot.com
// http://34.125.239.154

const Chating = ({ reduxState, reduxActions }) => {
  // const socketIO = useSocket()
  const socketRef = useRef(useContext(SocketContext));
  const role = currentUserRole(reduxState);
  const currentTime = new Date(); // Get the current date and time
  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString();
  const [msgArray, setMsgArray] = useState([]);
  const [message, sendMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [modalState, setModalState] = useState(false);
  const [hideChatBox, setHideChatBox] = useState(false);
  const re_render_chat = useSelector((state) => state.re_render_chat);

  const [open, setOpen] = useState(false);
  const [respMessage, setRespMessage] = useState("");
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const { id } = useParams();
  const { id: user, name } = reduxState?.userDetails;

  let avatar = useSelector((state) => state.userDetails?.avatar);


  const getUserRoles = () => {
    if (role?.designer) return "Graphic-Designer";
    if (role?.projectManager) return "Project-Manager";
    if (role?.admin) return "Admin";
    if (role?.customer) return "Customer";
  };

  const personProject = () => {
    if (reduxState.project_list?.CustomerProjects) {
      const singleProject = reduxState.project_list?.CustomerProjects?.find(
        (item) => item?._id === id
      );
      return singleProject;
    } else {
      return {};
    }
  };
  const team_members = personProject()?.team_members?.length > 0 ? personProject()?.team_members[0]?._id : "";

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
        project_title: personProject().project_title ? personProject().
        project_title : "",
        authorId : personProject() ? personProject()?.user : "",
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

    setMsgArray((prev) => (prev ? [...prev, data.chat_message] : [data.chat_message]));
    socketRef.current.emit("room-message", data.chat_message, id, team_members);
    await apiClient
      .put("/chat-message", data)
      .then(({ data }) => {
        // setIsComingMsg(true)
        // console.log("Message ", data?.message)
      })
      .catch((e) => console.log("Chat Send Error ", e?.response));
    const userData = {
      userId: user,
      projectID: id,
      role: getUserRoles(),
      message: {
        unique : uuidv4(),
        project_id: id,
        project_title: personProject().project_title ? personProject().project_title : "",
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
    await apiClient
      .post("/api/send-message-to-others", userData)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((e) => console.log("Update chat notifications error ", e?.response));
    // sendMessage("");
  };
  function joinChatRoom() {
    setHideChatBox(true);
    socketRef.current.emit("room-message", "", id);
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
    socketRef.current.on("message", (message) => {
      if (message !== "") {
        setMsgArray((prev) => [...prev, message]);
      }
    });
  }, [socketRef.current]);

  useEffect(() => {
    getChatMessage();
  }, []);

  useEffect(() => {
    joinChatRoom();
    getChatMessage();
  }, [re_render_chat]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [msgArray]);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="SUCCESS"
      content={respMessage}
      dateTime={new Date().toLocaleTimeString("pk")}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      delay={3000}
      bgWhite
    />
  );
  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Error"
      content={respMessage}
      dateTime={new Date().toLocaleTimeString("pk")}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      delay={3000}
      bgWhite
    />
  );

  const handleClose = () => setOpen(false);

  useEffect(() => {
    joinChatRoom();
    return () => {
      socketRef.current.emit('leave-room', id)
    }
  }, []);

  useEffect(() => {
    getChatMessage();
  }, [id])

  return (
    <DashboardLayout>
      <FileModal title="Files" open={modalState} setOpen={setModalState} />
      <SuccessModal
        open={open}
        msg={respMessage}
        onClose={handleClose}
        width="35%"
        title="SUCCESS"
        color="#333"
        sideRadius={false}
      />
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
            "::-webkit-scrollbar": {
              width: "0",
              height: "0",
            },

          }}
        >
          <ChatsContainer
            chatContainerRef={chatContainerRef}
            msgArray={msgArray}
            onSendMessage={onSendMessage}
            sendMessage={sendMessage}
            message={message}
            reduxState={reduxState}
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
            setShowMore={setShowMore}
            getChatMessage={getChatMessage}
          />
        </Grid>
        {renderSuccessSB}
        {renderErrorSB}
      </Grid>
    </DashboardLayout>
  );
};



export default reduxContainer(Chating);
