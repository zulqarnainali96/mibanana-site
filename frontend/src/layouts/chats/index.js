/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { SendOutlined } from "@mui/icons-material";
import MDTypography from "components/MDTypography";
import { useParams } from "react-router-dom";
import apiClient from "api/apiClient";
import reduxContainer from "redux/containers/containers";
import { useCallback } from "react";
// import { io } from "socket.io-client"
import { useSelector } from "react-redux";
import ImageAvatar from "assets/mi-banana-icons/default-profile.png";
import TeamMembers from "./team-members/TeamMembers";
import SelectMembers from "./team-members/select-members";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "./style.css";
import MDSnackbar from "components/MDSnackbar";
import FileModal from "./Files Modal/FileModal";
import SuccessModal from "components/SuccessBox/SuccessModal";
import { socketIO } from "layouts/sockets";
import FileUploadContainer from "./File-upload-container";
import { currentUserRole } from "redux/global/global-functions";
import { Box } from "@mui/material";
import { fontsFamily } from "assets/font-family";
import { mibananaColor } from "assets/new-images/colors";
import { position } from "stylis";
import ReactQuill from "react-quill";
import { modules, formats, reactQuillStyles2 } from "assets/react-quill-settings/react-quill-settings";
import ChatsContainer from "./Chat-container";
// https://socket-dot-mi-banana-401205.uc.r.appspot.com
// http://34.125.239.154

// const socket = io.connect("http://localhost:5000", {
//     withCredentials: true
// })
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         },
//     },
// };
const Chating = ({ reduxState, reduxActions }) => {
  const c = console.log.bind(this);
  const role = currentUserRole(reduxState);
  const currentTime = new Date(); // Get the current date and time
  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString();
  const [msgArray, setMsgArray] = useState([]);
  const [limit, setLimit] = useState(15);
  const [message, sendMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [modalState, setModalState] = useState(false);
  const [hideChatBox, setHideChatBox] = useState(false);
  const [memberName, setMemberName] = useState([]);
  const [IsComingMsg, setIsComingMsg] = useState(false);
  const [is_member, setIsMember] = useState(false);
  const re_render_chat = useSelector((state) => state.re_render_chat);
  const userNewChatMessage = useSelector((state) => state.userNewChatMessage);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [designerObj, setDesignerObj] = useState([]);
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
  const socketRef = useRef(socketIO);
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
  const [isActive, setIsActive] = useState(personProject()?.is_active);
  const handleChange = (event) => {
    setMemberName(event.target.value);
  };

  const handleCheckbox = useCallback(() => setIsActive((prev) => !prev), [isActive]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
    }
  };
  const onSendMessage = async (event) => {
    event.preventDefault();
    if (message === "") {
      return;
    }
    const data = {
      project_id: id,
      chat_message: {
        project_id: id,
        project_title: personProject().project_title ? personProject().project_title : "",
        user,
        name: name,
        avatar: avatar ? avatar : ImageAvatar,
        time_data: formattedTime,
        date: formattedDate,
        message: message,
        role: getUserRoles(),
        view: true,
      },
    };

    setMsgArray((prev) => (prev ? [...prev, data.chat_message] : [data.chat_message]));
    socketRef.current.emit("room-message", data.chat_message, id);
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
        project_id: id,
        project_title: personProject().project_title ? personProject().project_title : "",
        user,
        name: name,
        avatar: avatar ? avatar : ImageAvatar,
        time_data: formattedTime,
        date: formattedDate,
        message: message,
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
    sendMessage("");
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

  const SubmitProject = async () => {
    if (memberName.length === 0) {
      alert("Select team members");
      return;
    }
    if (role?.projectManager && memberName.length > 0) {
      let project = personProject();
      project.team_members = memberName;
      project.status = "Ongoing";
      project.is_active = isActive;

      let data = {
        project_id: personProject()?._id,
        project_data: project,
      };
      setLoading(true);
      await apiClient
        .patch("/graphic-project", data)
        .then(({ data }) => {
          const { save } = data;
          // const updatedProjects = reduxState.project_list.CustomerProjects.filter( item => item._id !== save.id)
          // const allProject = [...updatedProjects,save]
          // reduxFunctions.getCustomerProjects(allProject)
          setRespMessage(data?.message);
          setIsMember((prev) => !prev);
          setLoading(false);
          setTimeout(() => {
            handleOpen();
            // openSuccessSB()
          }, 600);
        })
        .catch((e) => {
          setLoading(false);
          console.error("Error assgin project => ", e?.response?.data?.message);
        });
    }
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
      bgWhite
    />
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    joinChatRoom();
  }, []);

  return (
    <DashboardLayout>
      <FileModal title="Files" open={modalState} setOpen={setModalState} />
      <SuccessModal
        open={open}
        msg={respMessage}
        onClose={handleClose}
        width="30%"
        title="SUCCESS"
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
            paddingLeft : '0 !important'
            //  overflowY : 'auto' 
          }
        })}>
          <FileUploadContainer
            setRespMessage={setRespMessage}
            openSuccessSB={openSuccessSB}
            openErrorSB={openErrorSB}
            showMore={showMore}
            setShowMore={setShowMore}
          />
        </Grid>
        {renderSuccessSB}
      </Grid>
    </DashboardLayout>
  );
};



export default reduxContainer(Chating);
