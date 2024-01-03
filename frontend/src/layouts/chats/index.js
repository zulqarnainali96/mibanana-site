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
import CustomerFiles from "./CustomeFiles/CustomerFiles";
import { MoonLoader } from "react-spinners";
import SuccessModal from "components/SuccessBox/SuccessModal";
import { socketIO } from "layouts/sockets";
import FileUploadContainer from "./File-upload-container";
import { currentUserRole } from "redux/global/global-functions";
import { Box } from "@mui/material";
import { fontsFamily } from "assets/font-family";
import { mibananaColor } from "assets/new-images/colors";
import { position } from "stylis";
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

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const { id } = useParams();
  const { id: user, name } = reduxState?.userDetails;
  const socketRef = useRef(socketIO);
  let avatar = useSelector((state) => state.userDetails?.avatar);

  const getUserRoles = () => {
    if (reduxState?.userDetails?.roles.includes("Graphic-Designer")) return "Graphic-Designer";
    if (reduxState?.userDetails?.roles.includes("Project-Manager")) return "Project-Manager";
    if (reduxState?.userDetails?.roles.includes("Customer")) return "Customer";
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
  const isManager = reduxState.userDetails?.roles?.includes("Project-Manager") ? true : false;
  const isDesigner = reduxState.userDetails?.roles?.includes("Graphic-Designer") ? true : false;
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
    if (isManager && memberName.length > 0) {
      let project = personProject();
      project.team_members = memberName;
      project.status = "Ongoing";
      project.is_active = isActive;

      let data = {
        project_id: personProject()?._id,
        project_data: project,
        // project_data: {
        //     team_member : memberName,
        //     status : "Ongoing",
        //     is_active : isActive
        // }
      };
      // console.log(data)
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

  function deepCopy(arr) {
    return arr.map((item) => (Array.isArray(item) ? deepCopy(item) : Object.assign({}, item)));
  }

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
    // return () => {
    //     socketRef.current.disconnect();
    // }
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
        paddingInline={"60px"}
        // paddingBlock={"30px"}
        sx={{
          height: "87vh",
        }}
        >
        <Grid
          item
          lg={6}
          xs={12}
          sx={{
            pb:"10% !important",
            position:"relative",
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
          <MDTypography
            sx={({ palette: { primary } }) => ({
              fontFamily: fontsFamily.poppins,
              color: mibananaColor.tableHeaderColor,
              fontWeight: "bold",
              fontSize: "16px",
              paddingBottom: "5px",
              borderBottom: `2px solid ${mibananaColor.tableHeaderColor}`,
            })}
            variant="h4"
            pb={1}
          >
            Activity
          </MDTypography>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            flexDirection={"column"}
            sx={{
              height:"100%",
              overflow: "scroll",
              "::-webkit-scrollbar": {
                width: "10px",
                height: "0",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius:2
              },
            }}
          >
            <Grid item xxl={12} xl={12} lg={12} width={"100%"}>
              <MDBox p={0} ref={chatContainerRef}>
                <Box className="chat">
                  {msgArray?.length
                    ? msgArray.map((item, index, messages) => {
                        return (
                          <pre
                            key={index}
                            className={`message ${
                              item.user === reduxState.userDetails?.id ? "right" : "left"
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
                                  left: item.user === user ? "70px" : "-9px",
                                }}
                              />
                              <Box width="100%" ml={4}>
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
                                >
                                  {item.message}
                                </Box>
                              </Box>
                            </Box>
                          </pre>
                        );
                      })
                    : null}
                </Box>
              </MDBox>
            </Grid>
          </Grid>
              <Box
                width="100%"
                m='auto'
                mt={0}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent:"center",
                  alignItems: "center",
                  position: "absolute",
                  left:"0",
                  bottom:"10px"
                }}
              >
                <Box mr={2}>
                  <img
                    src={avatar ? avatar : ImageAvatar}
                    width={50}
                    height={50}
                    alt="person-image"
                  />
                </Box>
                <textarea
                  rows={2}
                  className="textareaStyle"
                  value={message}
                  placeholder="Type your message here"
                  onChange={(e) => sendMessage(e.target.value)}
                  style={{ fontFamily: fontsFamily.poppins }}
                />
                <SendOutlined
                  fontSize="large"
                  sx={{
                    position: "absolute",
                    right: 65,
                    fill: mibananaColor.tableHeaderColor,
                    cursor: "pointer",
                  }}
                  onClick={onSendMessage}
                />
              </Box>
        </Grid>
        <Grid item lg={6} md={12} xs={12} pt="0 !important" height="100%">
          <Box className="chat">
            <FileUploadContainer
              setRespMessage={setRespMessage}
              openSuccessSB={openSuccessSB}
              openErrorSB={openErrorSB}
            />
          </Box>
        </Grid>
        {renderSuccessSB}
      </Grid>
    </DashboardLayout>
  );
};

const nameStyle = {
  fontFamily: fontsFamily.poppins,
  fontWeight: "600",
  fontSize: "16px",
  color: mibananaColor.yellowTextColor,
};

export default reduxContainer(Chating);
