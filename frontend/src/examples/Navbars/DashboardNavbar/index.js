import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Notepencil from 'assets/mi-banana-icons/NotePencil.png'
import MDBox from "components/MDBox";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import MDSnackbar from 'components/MDSnackbar';
import SuccessModal from 'components/SuccessBox/SuccessModal'
import useRightSideList from 'layouts/Right-side-drawer-list/useRightSideList'
import { store } from 'redux/store'
import { persistStore } from "redux-persist";
import DefaultAvatar from 'assets/mi-banana-icons/default-profile.png'


// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { Badge, Button } from "@mui/material";
import reduxContainer from "redux/containers/containers";
// import CreateProject from '../Form-modal'
import CreateProject1 from "../Form-modal/new";
// import CreateProjectButton from "../Create-project-button";
import apiClient from "api/apiClient";
import { getProjectData } from "redux/global/global-functions";
import { getBrandData } from "redux/global/global-functions";
import { Chat } from "@mui/icons-material";
import RightSideDrawer from "components/RightSideDrawer";
import MDTypography from "components/MDTypography";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { reRenderChatComponent } from "redux/actions/actions";
import MDButton from "components/MDButton";
import { socketIO } from "layouts/sockets";
import miBananaLogo from 'assets/mi-banana-icons/mibanana-logo-1-color 1.png'

let image = "image/"
let pdf = "application/pdf"
let svg = "image/svg+xml"
let docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

function DashboardNavbar({ absolute, light, isMini, reduxActions, reduxState, children }) {
  const [navbarType, setNavbarType] = useState();
  const [loading, setLoading] = useState(false)
  const { list } = useRightSideList()

  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;

  const [openMenu, setOpenMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [open, setOpen] = useState(false);

  const isDesignerAndManagerAdmin = reduxState.userDetails?.roles?.includes("Graphic-Designer") || reduxState.userDetails?.roles?.includes("Project-Manager") || reduxState.userDetails?.roles?.includes("Admin") ? true : false

  const [respMessage, setRespMessage] = useState("")
  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const openErrorSB = () => setErrorSB(true);
  const [formValue, setFormValue] = useState({
    project_category: '',
    design_type: '',
    brand: '',
    project_title: '',
    project_description: '',
    describe_audience: '',
    sizes: '',
    width: '',
    height: '',
    unit: '',
    resources: '',
    reference_example: '',
    add_files: [],
    file_formats: [],
    specific_software_names: '',
  })
  const [add_files, setAddFiles] = useState([])
  const [upload_files, setUploadFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [inComingMsg, setInComingMsg] = useState(false)
  const userNewChatMessage = reduxState.userNewChatMessage
  const render_chat = useSelector(state => state.re_render_chat)
  const reduxDispatch = useDispatch()
  const setChatRender = (payload) => reduxDispatch(reRenderChatComponent(payload))

  const handleClose = () => {
    // reduxActions.showModal(false)
    setOpen(false)
  };
  const handleChange = (event) => {
    // event.stopPropagation();
    const { name, value } = event.target
    setFormValue({
      ...formValue,
      [name]: value
    })
  }

  const onRemoveChange = (state) => {
    setFormValue({ ...formValue, state: '' })
  }

  const handleClickOpen = () => {
    // reduxActions.showModal(true)
    setOpen(true)
  };
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      persistStore(store).purge();
      localStorage.removeItem("user_details");
      navigate("/authentication/mi-sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => {
    setInComingMsg(false)
    setOpenMenu(event.currentTarget)
  };
  const handleUserProfileMenu = (event) => setUserMenu(event.currentTarget);
  const handleUserCloseMenu = () => setUserMenu(false);
  const handleCloseMenu = () => setOpenMenu(false);
  const [selectedOption, setSelectedOption] = useState(null)

  function getToTheProject(id) {
    if (id) {
      navigate("/chat/" + id)
      setTimeout(() => {
        setChatRender(!render_chat)
      }, 400)
    } else {
      return
    }
  }
  // Render the notifications menu

  function clearIncomingMsg(item, index) {
    // let arr = []
    // arr = []
    // arr = [...userNewChatMessage]
    // const newIndex = arr.findIndex((l, i) => i === index)
    // console.log(newIndex)
    // let obj = { ...item, view: false }
    // arr.splice(newIndex, 1, obj)
    const userId = index
    const _id = reduxState?.userDetails?.id
    apiClient.get(`/api/udpate-notifications/${userId}/${_id}`)
      .then(({ data }) => {
        reduxActions.getUserNewChatMessage(data?.msgArray)
        console.log(data)
      }).catch((err) => {
        console.error(err.message)
      })
    getToTheProject(item?.project_id)
  }
  const getAllNotificationsMsg = () => {
    const id = reduxState?.userDetails?.id
    apiClient.get("/api/get-notifications/" + id).then(({ data }) => {
      console.log(data)
      localStorage.setItem('user_details', JSON.stringify({
        ...reduxState?.userDetails,
        ...data.userDetails,
      }))
      reduxActions.getUserDetails({
        ...reduxState?.userDetails,
        ...data.userDetails,
      })
      reduxActions.getUserNewChatMessage(data.userDetails?.notifications)
    }).catch((err) => {
      console.log(err)
    })
  }

  function inComingMessage() {
    if (reduxState?.userDetails?.roles?.includes("Admin")) return
    const arr = userNewChatMessage?.filter(item => item.view === true)
    if (arr?.length === 0) return ""
    else {
      return arr?.length
    }
  }
  function clearAllNotfications() {
    reduxActions.getUserNewChatMessage([])
  }
  useEffect(() => {
    getAllNotificationsMsg()
  }, [])

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
      sx={{ mt: 2, height: 400, borderRadius: '10px', padding: '10px', }}
    >
      {userNewChatMessage?.length > 0 && <MDButton variant="filled" color="info" p={1} sx={{ width: '100%' }} onClick={clearAllNotfications}>clear all message</MDButton>}
      {userNewChatMessage?.length > 0 ? userNewChatMessage.map((newMsg, i) => (
        <MDBox
          display="flex"
          key={i}
          flexDirection="column"
          p={.8}
          mb={.2}
          width="230px"
          borderRadius="5px"
          gap="5px"
          sx={{ backgroundColor: newMsg?.view ? "#ccc" : "white", ":hover": { backgroundColor: '#ddd', cursor: 'pointer' } }}
          onClick={() => clearIncomingMsg(newMsg, i)}
        >
          <MDTypography fontSize="medium">{newMsg?.project_title}</MDTypography>
          <MDBox display="flex" gap="8px" width="100%">
            {newMsg?.avatar ? <img src={newMsg?.avatar} loading="lazy" width={40} height={40} style={{ borderRadius: '20px' }} /> : <img src={DefaultAvatar} loading="lazy" width={40} height={40} style={{ borderRadius: '20px' }} />}
            <MDBox display="flex" flexDirection="column" gap="5px" width="100%">
              <MDTypography fontSize="small">{newMsg?.message}</MDTypography>
              <MDTypography fontSize="small">{"New Message from "}<b style={{ display: 'block' }}>{newMsg?.role}</b></MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      )) : (
        <>
          <NotificationItem title="No message found" />
        </>
      )}
      {/* <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" /> */}
      {/* <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" /> */}
    </Menu>
  );
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
      <Link to={"/settings/profile"}>
        <NotificationItem icon={<Icon>person</Icon>} title="Profile" />
      </Link>
      <Link to={"/settings/company-profile"}>
        <NotificationItem icon={<Icon>account_box</Icon>} title="Company Profile" />
      </Link>
      <NotificationItem icon={<Icon>logout</Icon>} onClick={handleLogout} title="Logout" />

    </Menu >
  );
  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });
  // console.log('upload_files ', upload_files)
  // console.log('add_files ', add_files)

  const handleFileUpload = (event) => {
    if (event.target.files.length === 8) {
      alert("Upload maximum 7 files")
      setUploadFiles([])
      setAddFiles([])
      return
    }
    // setUploadFiles([])
    // setAddFiles([])
    const files = event.target.files;
    const newFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadFiles(prev => [...prev, file])
      if (file.type.startsWith(image)) {
        const reader = new FileReader();
        reader.onload = function () {
          setAddFiles(prev => [...prev, { filename: file.name, url: reader.result }])
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeFiles = () => {
    setAddFiles([])
    setUploadFiles([])
    setUploadProgress(0)
  }

  const removeSingleFile = (img) => {
    const result = add_files.filter(item => item?.url !== img?.url)
    const result2 = upload_files.filter(item => item?.name !== img?.filename)
    setAddFiles(result)
    setUploadFiles(result2)
  }
  const deleteOtherSingleFile = (file) => {
    const result2 = upload_files.filter(item => item?.name !== file?.name)
    setUploadFiles(result2)
  }
  const uploadFile = (user_id, name, project_id, project_title) => {
    const formdata = new FormData
    setUploadProgress(0);
    for (let i = 0; i < upload_files.length; i++) {
      formdata.append('files', upload_files[i]);
    }
    formdata.append('user_id', user_id)
    formdata.append('name', name)
    formdata.append('project_title', project_title)
    formdata.append('project_id', project_id)
    apiClient.post("/file/google-cloud", formdata, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadProgress(percentCompleted)
      }
    }).then(() => {
      const data = {
        user_id,
        name,
        project_id,
        project_title
      }
      apiClient.post("/file/get-files", data)
        .then(({ data }) => {
          removeFiles()
          setLoading(false)
          // handleClose()
          setRespMessage(data?.message)
          setTimeout(() => {
            openSuccessSB()
          }, 2000)
        }).catch(err => { throw err })
    }).catch((err) => {
      setLoading(false)
      setRespMessage(err?.response?.data.message)
      setTimeout(() => {
        openErrorSB()
      }, 1200)
      console.error('Error Found =>', err)
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (add_files.length > 0 && upload_files.length > 0) {
      if (add_files.length === 8 && upload_files.length === 8) {
        alert('Maximum seven file allowed')
        return
      }
    }
    setLoading(true)
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
    }
    console.log('data  ', data, 'form value  ', formValue)
    await apiClient.post('/graphic-project', data)
      .then(resp => {
        if (resp?.status === 201) {
          const { message } = resp?.data
          console.log(resp?.data)
          setRespMessage(message)
          reduxActions.getNew_Brand(!reduxState.new_brand)
          let param = [
            reduxState.userDetails?.id,
            reduxState.userDetails?.name,
            resp.data?.project._id,
            resp.data?.project.project_title
          ]
          if (add_files.length > 0 && upload_files.length > 0) {
            uploadFile(...param)
          }
          setOpen(false)
          setTimeout(() => {
            // openSuccessSB()
            setLoading(false)
            setShowSuccessModal(true)
          }, 300)
        }
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        setRespMessage(error.message)
        setTimeout(() => {
          openErrorSB()
        }, 1000)
      })

  }

  const closeSuccessSB = () => setSuccessSB(false);
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Error"
      content={respMessage}
      dateTime={new Date().toLocaleTimeString('pk')}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="SUCCESS"
      content={respMessage}
      dateTime={new Date().toLocaleTimeString('pk')}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  useEffect(() => {
    setInComingMsg(true)
  }, [userNewChatMessage])

  useEffect(() => {
    const id = reduxState?.userDetails?.id
    getProjectData(id, reduxActions.getCustomerProject)
    getBrandData(id, reduxActions.getCustomerBrand)
  }, [reduxState.new_brand])

  const brandOption = reduxState.customerBrand?.map(item => item.brand_name)
  // useEffect( () => {
  //   socketIO.on('message',(message) => {
  //     console.log('message ',message)
  //     if(message !== ''){
  //       reduxActions.getUserNewChatMessage(message)
  //     }
  //   })
  // }, [socketIO])

  return (
    <>
      <AppBar
        position={absolute ? "absolute" : navbarType}
        color="inherit"
        // sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
        sx={{ boxShadow: '-17px 3px 28px -20px #191b1cad', padding: '8px 3px' }}
      >
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
        <SuccessModal
          msg={respMessage}
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          width="30%"
        />

        <Toolbar sx={(theme) => navbarContainer(theme)}>
          <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
            {/* <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} /> */}
            <MDBox>
              <img src={miBananaLogo} loading="lazy" width={"35%"} />
            </MDBox>
          </MDBox>
          {isMini ? null : (
            <>
              <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
                {isDesignerAndManagerAdmin ? null : <MDBox pr={1}>
                  {/* <MDInput label="Search here" /> */}
                  <Button
                    variant="contained"
                    disableFocusRipple
                    onClick={handleClickOpen}
                    sx={{
                      backgroundColor: "#adff2f",
                      borderRadius: 30,
                      "&:hover": { background: "#98e225" }, "&:focus ": { background: "#adff2f " + "!important" }
                    }}
                    disableElevation
                  >
                    <img src={Notepencil} alt="create project" width={24} height={22} />
                    &nbsp;{" "}Create Project
                  </Button>
                </MDBox>}
                <MDBox color={light ? "white" : "inherit"}>
                  <Badge badgeContent={inComingMessage()} color={inComingMessage() ? "error" : "transparent"} sx={{ "& .MuiBadge-badge": { fontSize: '1rem' } }}>
                    <IconButton
                      size="large"
                      disableRipple
                      color="inherit"
                      sx={{ ...navbarIconButton, padding: '5px' }}
                      aria-controls="notification-menu"
                      aria-haspopup="true"
                      variant="contained"
                      onClick={handleOpenMenu}
                    >
                      <Icon sx={iconsStyle}>notifications</Icon>
                    </IconButton>
                  </Badge>
                  {renderMenu()}
                  <IconButton
                    size="large"
                    disableRipple
                    color="inherit"
                    sx={navbarIconButton}
                    aria-controls="notification-menu"
                    aria-haspopup="true"
                    variant="contained"
                    onClick={handleUserProfileMenu}
                  >
                    <Icon sx={iconsStyle}>account_circle</Icon>
                  </IconButton>
                  {renderUserMenu()}
                  <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    sx={navbarMobileMenu}
                    onClick={handleMiniSidenav}
                  >
                    <Icon sx={iconsStyle} fontSize="medium">
                      {miniSidenav ? "menu_open" : "menu"}
                    </Icon>
                  </IconButton>
                  {/* <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton> */}
                </MDBox>
                <RightSideDrawer list={list} />
                {renderSuccessSB}
                {renderErrorSB}
              </MDBox>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>

  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default reduxContainer(DashboardNavbar);
