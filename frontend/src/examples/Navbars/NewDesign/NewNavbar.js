import React, { useCallback, useContext, useEffect, useRef } from "react";
import MDBox from "components/MDBox";
import {
  Avatar,
  Button,
  Grid,
  Icon,
  Menu,
  MenuItem,
  fabClasses,
  useMediaQuery,
} from "@mui/material";
import MibananaIcon from "assets/new-images/navbars/mibanana-logo.png";
import MDTypography from "components/MDTypography";
import { useLocation, NavLink, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { persistStore } from "redux-persist";
import NotificationItem from "examples/Items/NotificationItem";
import Divider from "@mui/material/Divider";
import { store } from "redux/store";
import reduxContainer from "redux/containers/containers";
import { getProjectData } from "redux/global/global-functions";
import { getBrandData } from "redux/global/global-functions";
import MDButton from "components/MDButton";
import DefaultAvatar from "assets/mi-banana-icons/default-profile.png";
import { reRenderChatComponent } from "redux/actions/actions";
import apiClient from "api/apiClient";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { currentUserRole } from "redux/global/global-functions";
import { mibananaColor } from "assets/new-images/colors";
import { styled } from "@mui/material/styles";
import { fontsFamily } from "assets/font-family";
import { projectIcon } from "assets/new-images/navbars/create-project-icon";
import SuccessModal from "components/SuccessBox/SuccessModal";
import CreateProject1 from "../Form-modal/new";
import useRightSideList from "layouts/Right-side-drawer-list/useRightSideList";
import RightSideDrawer from "components/RightSideDrawer";
import { useMaterialUIController } from "context";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import List from "@mui/material/List";
import { setMiniSidenav } from 'context'
import "./navbar-style.css"
import MenuIcon from "@mui/icons-material/Menu"

// import { useSocket } from 'sockets';
import { projectNotifications } from "redux/global/global-functions";
// import discordSound from 'assets/sound/discord.mp3'
import notif from 'assets/sound/notif.wav'
import { SocketContext } from "sockets";
import ProjectMenuOptions from "../create-project-poper/project-menu-poper";
import CopyWritingForm from "../Copy-writing-form/copy-writing-form";
import SocialMediaManager from "../social-media-form/social-media-manager";
import WebsiteForm from "../website-form/website-form";
import WebAppDevForm from "../web-app-form/web-app-dev-form";
import MobileAppDevForm from "../mobile-app-dev-form/mobile-app-dev-form";
let image = "image/"

const NewNavbar = ({ reduxState, reduxActions, routes }) => {
  // const socketIO = useRef(useSocket())
  const socketIO = useRef(useContext(SocketContext));
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const [userMenu, setUserMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [inComingMsg, setInComingMsg] = useState(false);
  const userNewChatMessage = reduxState.userNewChatMessage;
  const handleUserProfileMenu = (event) => setUserMenu(event.currentTarget);
  const handleUserCloseMenu = () => setUserMenu(false);
  const handleCloseMenu = () => setOpenMenu(false);
  const reduxDispatch = useDispatch();
  const render_chat = useSelector((state) => state.re_render_chat);
  const role = currentUserRole(reduxState);
  const personImage = reduxState?.userDetails?.avatar
    ? reduxState?.userDetails?.avatar
    : DefaultAvatar;
  const setChatRender = (payload) => reduxDispatch(reRenderChatComponent(payload));
  const navigate = useNavigate();
  const [respMessage, setRespMessage] = useState("");
  const [errorSB, setErrorSB] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const [add_files, setAddFiles] = useState([]);
  const [upload_files, setUploadFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const openErrorSB = () => setErrorSB(true);
  const brandOption = reduxState.customerBrand;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { list } = useRightSideList();
  const [formValue, setFormValue] = useState({
    project_category: "",
    design_type: "",
    brand: {},
    project_title: "",
    project_description: "",
    describe_audience: "",
    sizes: "",
    width: "",
    height: "",
    unit: "",
    resources: "",
    reference_example: "",
    add_files: [],
    file_formats: [],
    specific_software_names: '',
  })
  const [showAccountsbtn, setShowAccountsBtn] = useState(false)

  const [openCopyWriting, setOpenCopyWriting] = useState(false)
  const [openSocialMediaForm, setOpenSocialMediaForm] = useState(false)
  const [openWebsite, setOpenWebsite] = useState(false)
  const [openWebApp, setOpenWebAppApp] = useState(false)
  const [openMobileApp, setOpenMobileApp] = useState(false)

  const is1040 = useMediaQuery("(max-width:1040px)")


  const [reloadProject, setReloadProjects] = useState(false)
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    darkMode,
    whiteSidenav,
    transparentSidenav,
  } = controller;
  const [anchorEl, setAnchorEl] = useState(null);

  const [openProjectMenu, setOpenProjectMenu] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = useCallback(() => {
    setOpenProjectMenu((prevOpen) => !prevOpen);
  }, [openProjectMenu]);

  let textColor = "white";
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleLogout = async () => {
    try {
      persistStore(store).purge();
      localStorage.removeItem("user_details");
      navigate("/authentication/mi-sign-in");
      // socketIO.current.disconnect()
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleOpenCopyWriting = () => {
    setOpenCopyWriting(true);
  };

  const handleOpenSocialMedia = () => {
    setOpenSocialMediaForm(true);
  };
  const handleCloseSocialMedia = () => {
    setOpenSocialMediaForm(false);
  };
  const handleWebsite = () => {
    setOpenWebsite(true);
  };
  const handleCloseWebsite = () => {
    setOpenWebsite(false);
  };

  const handleWebAppDev = () => {
    setOpenWebAppApp(true);
  };

  const handleCloseWebAppDev = () => {
    setOpenWebAppApp(false);
  };
  const handleMobileAppDev = () => {
    setOpenMobileApp(true);
  };
  const handleCloseMobileAppDev = () => {
    setOpenMobileApp(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenCopyWritingClose = () => {
    setOpenCopyWriting(false);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };
  const handleOpenMenu = (event) => {
    setInComingMsg(false);
    setOpenMenu(event.currentTarget);
  };
  function clearAllNotfications() {
    reduxActions.getUserNewChatMessage([]);
  }
  function getToTheProject(id) {
    if (id) {
      navigate("/chat/" + id);
      setTimeout(() => {
        setChatRender(!render_chat);
      }, 400);
    } else {
      return;
    }
  }
  function clearIncomingMsg(item, index) {
    const userId = index;
    const _id = reduxState?.userDetails?.id;
    apiClient
      .get(`/api/udpate-notifications/${userId}/${_id}`)
      .then(({ data }) => {
        reduxActions.getUserNewChatMessage(data?.msgArray);
      })
      .catch((err) => {
        console.error(err.message);
      });
    getToTheProject(item?.project_id);
  }

  async function updateAllChatMessage() {
    const id = reduxState.userDetails?.id
    if (getMessageNotification()) {
      await apiClient.get(`/api/udpate-all-notifications/${id}`)
        .then(({ data }) => {
          // console.log('updated chat data =>', data)
          reduxActions.getUserNewChatMessage(data?.msgArray)
        }).catch((err) => {
          console.error(err.message)
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  }
  function showPersonRoles() {
    if (role?.projectManager) return "(Project Manager)";
    if (role?.admin) return "(Admin)";
    if (role?.designer) return "(Graphic-Designer)";
    if (role?.customer) return "(Customer)";
  }
  function showRoles() {
    const { name } = reduxState.userDetails
    return name
  }
  const removeSingleFile = (img) => {
    const result = add_files.filter((item) => item?.url !== img?.url);
    const result2 = upload_files.filter((item) => item?.name !== img?.filename);
    setAddFiles(result);
    setUploadFiles(result2);
  };
  const deleteOtherSingleFile = (file) => {
    const result2 = upload_files.filter((item) => item?.name !== file?.name);
    setUploadFiles(result2);
  };
  const removeFiles = () => {
    setAddFiles([]);
    setUploadFiles([]);
    setUploadProgress(0);
  };
  const handleFileUpload = (event) => {
    if (event.target.files.length === 8) {
      alert("Upload maximum 7 files");
      setUploadFiles([]);
      setAddFiles([]);
      return;
    }
    const files = event.target.files;
    // const newFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadFiles((prev) => [...prev, file]);
      if (file.type.startsWith(image)) {
        const reader = new FileReader();
        reader.onload = function () {
          setAddFiles((prev) => [...prev, { filename: file.name, url: reader.result }]);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  const onRemoveChange = (state) => {
    setFormValue({ ...formValue, state: "" });
  };
  const uploadFile = (user_id, name, project_id, project_title) => {
    const formdata = new FormData();
    setUploadProgress(0);
    for (let i = 0; i < upload_files.length; i++) {
      formdata.append("files", upload_files[i]);
    }
    formdata.append("user_id", user_id);
    formdata.append("name", name);
    formdata.append("project_title", project_title);
    formdata.append("project_id", project_id);
    apiClient
      .post("/file/google-cloud", formdata, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      })
      .then(() => {
        const data = {
          user_id,
          name,
          project_id,
          project_title,
        };
        apiClient
          .post("/file/get-files", data)
          .then(({ data }) => {
            removeFiles();
            setLoading(false);
            // handleClose()
            setRespMessage(data?.message);
            setTimeout(() => {
              openSuccessSB();
            }, 2000);
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        setLoading(false);
        setRespMessage(err?.response?.data.message);
        setTimeout(() => {
          openErrorSB();
        }, 1200);
        console.error("Error Found =>", err);
      });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (add_files.length > 0 && upload_files.length > 0) {
      if (add_files.length === 8 && upload_files.length === 8) {
        alert("Maximum seven file allowed");
        return;
      }
    }
    setLoading(true);
    let data = {
      id: reduxState.userDetails?.id,
      name: reduxState.userDetails?.name,
      project_category: formValue.project_category,
      design_type: formValue.design_type,
      brand: formValue.brand,
      project_title: formValue.project_title,
      project_description: formValue.project_description,
      sizes: `${formValue.width} x ${formValue.height} (${formValue.unit})`,
      specific_software_names: formValue.specific_software_names,
      file_formats: formValue.file_formats,
      is_active: false,
    };
    await apiClient.post("/graphic-project", data)
      .then((resp) => {
        if (resp?.status === 201) {
          const { message } = resp?.data;
          const projectData = {
            ...data,
            brand: formValue.brand.brand_name,
            user: reduxState.userDetails?.id,
            project_id: resp.data?.project._id,
          };
          socketIO.current.emit('new-project', projectData)
          setRespMessage("Project Created Successfully");
          reduxActions.getNew_Brand(!reduxState.new_brand);
          let param = [
            reduxState.userDetails?.id,
            reduxState.userDetails?.name,
            resp.data?.project._id,
            resp.data?.project.project_title,
          ];
          if (add_files.length > 0 && upload_files.length > 0) {
            uploadFile(...param);
          }
          getProjectData(reduxState.userDetails?.id, reduxActions.getCustomerProject);
          setOpen(false);
          setTimeout(() => {
            // openSuccessSB()
            setLoading(false);
            setShowSuccessModal(true);
          }, 300);
        }
        setLoading(false);
        setReloadProjects(true)
      })
      .catch((error) => {
        setLoading(false);
        setRespMessage(error.message);
        setTimeout(() => {
          openErrorSB();
        }, 1000);
      });
  };
  const getAllNotificationsMsg = () => {
    const id = reduxState?.userDetails?.id;
    apiClient
      .get("/api/get-notifications/" + id)
      .then(({ data }) => {
        localStorage.setItem(
          "user_details",
          JSON.stringify({
            ...reduxState?.userDetails,
            ...data.userDetails,
          })
        );
        reduxActions.getUserDetails({
          ...reduxState?.userDetails,
          ...data.userDetails,
        });
        reduxActions.getUserNewChatMessage(data.userDetails?.notifications);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Accunts Dropdown
  const renderUserMenu = () => (
    <Menu
      anchorEl={userMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={Boolean(userMenu)}
      onClose={handleUserCloseMenu}
      sx={{ mt: 2 }}
    >
      <Link to="/settings/profile">
        <NotificationItem icon={<Icon>person</Icon>} title="Profile" />
      </Link>
      <Link to="/settings/company-profile">
        <NotificationItem icon={<Icon>account_box</Icon>} title="Company Profile" />
      </Link>
      <Link to="/settings/change-password">
        <NotificationItem icon={<Icon>key</Icon>} title="Change Password" />
      </Link>
      <NotificationItem icon={<Icon>logout</Icon>} onClick={handleLogout} title="Logout" />
    </Menu>
  );

  // Notifications Dropdown
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{
        mt: 2,
        height: 400,
        borderRadius: "0px",
        padding: "10px",
      }}
    >
      {userNewChatMessage?.length > 0 && (
        <MDButton
          variant="filled"
          color="info"
          p={1}
          sx={{ width: "100%", fontsFamily: fontsFamily.poppins }}
          onClick={clearAllNotfications}
        >
          clear all message
        </MDButton>
      )}
      {userNewChatMessage?.length > 0 ? (
        userNewChatMessage.map((newMsg, i) => (
          <MDBox
            display="flex"
            key={i}
            flexDirection="column"
            p={0.8}
            mb={0.2}
            width="240px"
            gap="5px"
            sx={{
              backgroundColor: newMsg?.view ? "#4b45458c" : "white",
              ":hover": {
                backgroundColor: "#ddd",
                cursor: "pointer",
                borderRadius: "0px !important",
              },
            }}
            onClick={() => clearIncomingMsg(newMsg, i)}
          >
            <MDTypography fontSize="medium" fontWeight="bold" sx={notificationStyles}>
              {newMsg?.project_title}
            </MDTypography>
            <MDBox display="flex" gap="8px" width="100%">
              {newMsg?.avatar ? (
                <img
                  src={newMsg?.avatar}
                  loading="lazy"
                  width={'100%'}
                  height={'100%'}
                  style={{ borderRadius: "20px" }}
                />
              ) : (
                <img
                  src={DefaultAvatar}
                  loading="lazy"
                  width={'100%'}
                  height={'100%'}
                  style={{ borderRadius: "20px" }}
                />
              )}
              <MDBox display="flex" flexDirection="column" gap="5px" width="100%">
                <MDTypography fontSize="small" fontWeight="300" sx={notificationStyles}>
                  {newMsg?.message}
                </MDTypography>
                <MDTypography
                  fontSize="small"
                  fontWeight="300"
                  sx={{
                    fontFamily: fontsFamily.poppins,
                    color: mibananaColor.tableHeaderColor,
                    fontStyle: "italic",
                  }}
                >
                  {"received message from "}
                  <b style={{ display: "block" }}>{newMsg?.role}</b>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        ))
      ) : (
        <>
          <NotificationItem title="No message found" />
        </>
      )}
    </Menu>
  );

  const notificationSound = () => {
    const audio = new Audio(notif);
    audio.play();
  }

  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Upcoming Event', {
        body: `Allow app to play notifications sound`,
      });

      // Play the notification sound
      notificationSound();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Upcoming Event', {
            body: `Allow app to play notifications sound!`,
          });
          notificationSound();
        }
      });
    }
  };


  useEffect(() => {
    setInComingMsg(true);
  }, [userNewChatMessage]);

  useEffect(() => {
    if (role?.projectManager) {
      socketIO.current.on('new-project-notification', project_data => {
        // showNotification()
        notificationSound()
        reduxActions.handleProject_notifications(project_data)
      })
    }
    if (role?.customer) {
      socketIO.current.on('status-change-notification', project_data => {
        // notificationSound()
        // console.log('Customer', project_data)
        reduxActions.handleProject_notifications(project_data)
      })
    } if (role?.projectManager || role?.designer) {
      socketIO.current.on('getting-customer-notifications', (project_data, id, status) => {
        // notificationSound()
        const filterProject = reduxState.project_list.CustomerProjects?.map(project => {
          return project._id === id ? { ...project, status: status } : project
        })
        reduxActions.getCustomerProject({ ...reduxState.projects_list, CustomerProjects: filterProject })
        reduxActions.handleProject_notifications(project_data)
      })
    }
  }, [socketIO.current])

  useEffect(() => {
    const id = reduxState.userDetails?.id;
    getProjectData(id, reduxActions.getCustomerProject);
    getBrandData(id, reduxActions.getCustomerBrand);
  }, [reloadProject]);


  useEffect(() => {
    const id = reduxState.userDetails?.id;
    getProjectData(id, reduxActions.getCustomerProject);
    getBrandData(id, reduxActions.getCustomerBrand);
  }, []);

  const ProjectButton = styled(Button)(({ theme: { palette } }) => {
    const { primary } = palette;
    return {
      backgroundColor: primary.main,
      fontFamily: fontsFamily.poppins,
      fontWeight: "400",
      paddingBlock: "0.9rem",
      borderRadius: 0,
      height: "100%",
      "&:hover": {
        backgroundColor: "#d9ba08",
      },
      "&:focus": {
        backgroundColor: "#d9ba08 !important",
      },
    };
  });

  const ProjectButton2 = styled(Button)(({ theme: { palette } }) => {
    const { primary } = palette;
    return {
      backgroundColor: primary.main,
      fontFamily: fontsFamily.poppins,
      fontWeight: "400",
      paddingInline: is1040 ? '13px !important' : '12px !important',
      fontSize: is1040 ? '10px !important' : '13px !important',
      padding: is1040 ? '4px !important' : '12px',
      paddingBlock: "0.9rem",
      borderRadius: 0,
      height: "100%",
      "&:hover": {
        backgroundColor: "#d9ba08",
      },
      "&:focus": {
        backgroundColor: "#d9ba08 !important",
      },
    };
  });
  const responsiveStyle = ({ breakpoints }) => ({
    [breakpoints.up('lg')]: {
      fontSize: '18px !important',
    },
    [breakpoints.down('lg')]: {
      fontSize: '16px',
    },
  })
  const roleResponsive = ({ breakpoints }) => ({
    [breakpoints.up('lg')]: {
      fontSize: '16px !important',
    },
    [breakpoints.down('lg')]: {
      fontSize: '15px !important',
    },
  })
  const getMessageNotification = () => {
    const isnotifications = userNewChatMessage?.some(item => item?.view === true)
    const is_project_notifications = reduxState.project_notifications?.some(item => item?.view === true)
    if (is_project_notifications || isnotifications) {
      return true
    } else {
      return false
    }
    // return isnotifications
  }
  useEffect(() => {
    getAllNotificationsMsg();
    return () => {
      setReloadProjects(false)
    }
  }, []);
  const renderRoutes = routes?.map(
    ({ type, name, icon, title, noCollapse, collapse, key, href, route }) => {
      let returnValue;
      if (type) {
        if (type === "collapse") {
          returnValue = href ? (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          ) : (
            <NavLink key={key} to={route}>
              <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
            </NavLink>
          );
        } else if (type === "collapse-dropdown" && collapse) {
          returnValue = (
            <div key={key} className="small-bar-icon-style">
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                onClick={handleMenuOpen}
              />
              <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {collapse.map(({ name, key, route, icon }) => (
                  <MenuItem
                    key={key}
                    onClick={() => navigate(route)}
                    selected={key === collapseName}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          );
        } else if (type === "title") {
          returnValue = (
            <MDTypography
              key={key}
              color={textColor}
              display="block"
              variant="caption"
              fontWeight="bold"
              textTransform="uppercase"
              pl={3}
              mt={2}
              mb={1}
              ml={1}
            >
              {title}
            </MDTypography>
          );
        } else if (type === "divider") {
          returnValue = (
            <Divider
              key={key}
              light={
                (!darkMode && !whiteSidenav && !transparentSidenav) ||
                (darkMode && !transparentSidenav && whiteSidenav)
              }
            />
          );
        }
      }

      return returnValue;
    }
  );

  const handleMobileNav = useCallback(() => {
    setShowAccountsBtn(prev => !prev)
  }, [showAccountsbtn])

  // const projectNotifications = async () => {
  //   const id = reduxState?.userDetails?.id;
  //   await apiClient
  //     .get("/api/project-notifications/" + id)
  //     .then(({ data }) => {
  //       const reverseArray = data.project_notifications?.reverse()
  //       reduxActions.handleProject_notifications(reverseArray)
  //     })
  //     .catch((err) => {
  //     });
  // };

  useEffect(() => {
    socketIO.current.emit('user_online', true, reduxState?.userDetails?.id, reduxState?.userDetails?.roles)
    // socketIO.on('active_users', (data) => {
    // })
    const id = reduxState?.userDetails?.id;
    projectNotifications(id, reduxActions.handleProject_notifications)
  }, [])

  console.log('Checking')
  return (
    <>
      <CreateProject1
        formValue={formValue}
        setFormValue={setFormValue}
        open={open}
        onSubmit={handleSubmit}
        handleClose={handleClose}
        handleChange={handleChange}
        openSuccessSB={openSuccessSB}
        openErrorSB={openErrorSB}
        setRespMessage={setRespMessage}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        onRemoveChange={onRemoveChange}
        add_files={add_files}
        upload_files={upload_files}
        uploadProgress={uploadProgress}
        loading={loading}
        handleFileUpload={handleFileUpload}
        removeFiles={removeFiles}
        reduxState={reduxState}
        setShowSuccessModal={setShowSuccessModal}
        brandOption={brandOption}
        removeSingleFile={removeSingleFile}
        deleteOtherSingleFile={deleteOtherSingleFile}
      />
      <CopyWritingForm
        open={openCopyWriting}
        handleClose={handleOpenCopyWritingClose}
      />

      <SocialMediaManager
        open={openSocialMediaForm}
        handleClose={handleCloseSocialMedia}
      />

      <WebsiteForm
        open={openWebsite}
        handleClose={handleCloseWebsite}
      />

      <WebAppDevForm
        open={openWebApp}
        handleClose={handleCloseWebAppDev}
      />

      <MobileAppDevForm
        open={openMobileApp}
        handleClose={handleCloseMobileAppDev}
      />


      <SuccessModal
        msg={respMessage}
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        width="35%"
        color="#333333"
        sideRadius={false}
      />
      <Grid container className="grid-container">
        <Grid className="grid-1" item xxl={6} xl={5} lg={5} md={6} sm={6} xs={6}>
          <img className='logo-image' src={MibananaIcon} loading='lazy' />
        </Grid>
        <Grid className="grid-2" item xxl={6} xl={7} lg={6} md={6} sm={6} xs={6}>
          <MDBox className="grid-2-box" onClick={handleUserProfileMenu}>
            <Avatar className="person-image" src={personImage} />
            <div className='hello-text-container'>
              <MDTypography className="hello-text" sx={responsiveStyle}>Hello {showRoles()}!</MDTypography>
              <MDTypography className="person-role" sx={roleResponsive}>{showPersonRoles()}</MDTypography>
            </div>
          </MDBox>
          <MDBox className="grid-2-box">
            <div className="btn-container" onClick={updateAllChatMessage}>
              {getMessageNotification() ? (
                <span className="notifications-point"></span>
              ) : null}
              <RightSideDrawer list={list} />
            </div>
            {/* <div className="btn-container"
              onClick={handleUserProfileMenu}>
              <AccountCircle fontSize="large" />
              </div>*/}
            <div className="btn-container menu-icon" onClick={handleMobileNav} >
              <MenuIcon fontSize="large" />
            </div>
            {renderUserMenu()}
            {/* {role?.customer && (
              <ProjectButton
                variant="contained"
                size="medium"
                className="create-project-btn"
                startIcon={projectIcon}
                ref={anchorRef}
                id="composition-button"
                aria-controls={openProjectMenu ? 'composition-menu' : undefined}
                aria-expanded={openProjectMenu ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              // onClick={handleClickOpen}
              >
                Create Project
              </ProjectButton>
            )} */}
            {role?.customer && <ProjectMenuOptions
              size="medium"
              handleClickOpen={handleClickOpen}
              handleCopyWriting={handleOpenCopyWriting}
              handleSocialMedia={handleOpenSocialMedia}
              handleWebsite={handleWebsite}
              handleWebAppDev={handleWebAppDev}
              handleMobileAppDev={handleMobileAppDev}
            />}
          </MDBox>
        </Grid>
        <Grid className="grid-3" item style={{ display: showAccountsbtn ? 'flex' : 'none' }}>
          <div className="btn-container" onClick={updateAllChatMessage}>

            {getMessageNotification() ? (
              <span className="notifications-point"></span>
            ) : null}
            <RightSideDrawer list={list} />
          </div>
          {/*<div className="btn-container"
            onClick={handleUserProfileMenu}>
            <AccountCircle fontSize="large" />
            </div>*/}
          {role?.customer && (
            // <ProjectButton2
            //   variant="contained"
            //   size="small"
            //   startIcon={projectIcon}
            //   onClick={handleClickOpen}
            // >
            //   Create Project
            // </ProjectButton2>
            <ProjectMenuOptions
              size={"small"}
              handleClickOpen={handleClickOpen}
              handleCopyWriting={handleOpenCopyWriting}
              handleSocialMedia={handleOpenSocialMedia}
              handleWebsite={handleWebsite}
              handleWebAppDev={handleWebAppDev}
              handleMobileAppDev={handleMobileAppDev}
            />
          )}
        </Grid>
      </Grid>
      <div className="small-navbar-container">
        <List className="headesidebar">{renderRoutes}</List>
      </div>
    </>
  )
}

const notificationStyles = {
  fontFamily: fontsFamily.poppins,
  color: mibananaColor.yellowTextColor,
  wordBreak: "break-word",
};

export default reduxContainer(NewNavbar);
