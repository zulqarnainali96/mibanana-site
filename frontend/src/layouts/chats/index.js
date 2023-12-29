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
      <SuccessModal open={open} msg={respMessage} onClose={handleClose} width="30%" />
      <Grid container spacing={2} height="100%" paddingInline={"25px"}>
        <Grid
          item
          xxl={6}
          xl={6}
          lg={6}
          md={12}
          xs={12}
          sx={{
            bgcolor: "#F6F6E8",
            // height: '90vh'
          }}
        >
          <MDTypography
            sx={({ palette: { primary } }) => ({
              padding: "10px",
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "6px",
              color: "gray",
            })}
            variant="h4"
            pb={1}
          >
            Activity
          </MDTypography>
          <hr />
          <Grid
            container
            justifyContent={"space-between"}
            spacing={4}
            alignItems={"center"}>
            {isManager ? (
              <Grid item xxl={12} alignSelf={"flex-end"} textAlign={"right"}>
                <MDButton
                  disabled={loading}
                  endIcon={<MoonLoader loading={loading} size={18} color="#fff" />}
                  color="dark"
                  bgColor="success"
                  type="button"
                  onClick={SubmitProject}
                >
                  Submit
                </MDButton>
              </Grid>
            ) : null}
            <Grid item xxl={12} lg={12} md={12} xs={12} position={"relative"}>
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"flex-start"}
                flexDirection={"column"}
              >
                <Grid item xxl={12} xl={12} lg={12} width={"100%"}>
                  <MDBox height="722px"
                    p={0}
                    ref={chatContainerRef}
                  >
                    <Box className="chat">
                      {msgArray?.length
                        ? msgArray.map((item, index, messages) => {
                          return (
                            <pre
                              key={index}
                              className={`message ${item.user === reduxState.userDetails?.id ? "right" : "left"
                                }`}
                              style={{ position: "relative" }}
                            >
                              <Box sx={{ display: "flex" }}>
                                <img
                                  src={item.avatar}
                                  width={40}
                                  height={40}
                                  loading="lazy"
                                  style={{
                                    borderRadius: 30,
                                    display: "inline-block",
                                    // width: "25px",
                                    // height: "25px",
                                    // top: "-32px",
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
                                    <p className="ff" style={{ fontSize: "11px" }}>
                                      {item.name}
                                      <span style={{ fontSize: "11px" }}>
                                        {" (" + item?.role + ")"}
                                      </span>
                                    </p>
                                  </Box>
                                  <Box sx={{ p: 2 }} className="message-content">
                                    {item.message}
                                  </Box>
                                </Box>
                              </Box>
                              <span
                                className="ff"
                                style={{
                                  fontSize: "9px",
                                  fontWeight: "400",
                                  color: "#444",
                                }}
                              >
                                {item.time_data ? item.time_data : null}
                              </span>
                            </pre>
                          );
                        })
                        : null}
                    </Box>
                  </MDBox>
                </Grid>
                <Grid item xxl={12} xl={12} lg={12} md={12} width={"100%"}>
                  <MDBox
                    height={"6vh"}
                    width="100%"
                    p={1}
                    sx={{
                      borderBottomLeftRadius: "12px",
                      borderBottomRightRadius: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "10px",
                      // backgroundColor : "#f1f2f2"
                    }}
                  >
                    <textarea
                      rows={2}
                      color="15"
                      className="textareaStyle"
                      value={message}
                      placeholder="Type your message here"
                      onChange={(e) => sendMessage(e.target.value)}
                    />
                    <SendOutlined
                      fontSize="medium"
                      onClick={onSendMessage}
                      className="sendIcon1"
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xxl={6} xl={6} lg={6} md={12} xs={12}>
          <FileUploadContainer
              setRespMessage={setRespMessage}
              openSuccessSB={openSuccessSB}
              openErrorSB={openErrorSB}
            />
        </Grid>
        {renderSuccessSB}
      </Grid>
    </DashboardLayout>
  );
};

const Styles = {
  fontWeight: "bold",
  fontSize: "15px",
  marginLeft: 4,
};

const stylesProps2 = {
  sx: {
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    overflowY: "auto",
  },
  sx2: {
    height: "486px",
    width: "100%",
    border: "3px solid #ccc",
    bgColor: "#f0f0f0",
    // background-color: #f0f0f0;
  },
};

const sendButton = {  
  borderRadius: "4px !important",
  minHeight: "42px",
  border: "1px solid #444",
};

const inComingMsg = {
  padding: "15px",
  variant: "h5",
  color: "light",
  mt: 1,
};
const inComingMsg2 = {
  // backgroundColor: "green",
  borderBottomLeftRadius: "18px",
  borderTopRightRadius: "18px",
  display: "inline-block",
};

const styleProps = {
  // mt: 2,
  border: "5px solid #33333321",
  borderRadius: "10px",
  // bgColor: "primary",
  height: "87vh",
  overflowy: "auto",
};

export default reduxContainer(Chating);
