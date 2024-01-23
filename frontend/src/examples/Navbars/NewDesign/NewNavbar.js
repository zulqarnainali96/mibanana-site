import React, { useEffect } from 'react'
import MDBox from 'components/MDBox'
import { Badge, Button, Grid, Icon, IconButton, Menu, useMediaQuery } from '@mui/material'
import MibananaIcon from 'assets/new-images/navbars/mibanana-logo.png'
import { useStyles } from './new-navbar-style'
// import personImage from 'assets/new-images/navbars/Rectangle.png'
import MDTypography from 'components/MDTypography'
import { notificationsIcon } from 'assets/new-images/navbars/notificationIcon'
import { AccountCircle } from '@mui/icons-material'
import { useState } from 'react'
import { persistStore } from 'redux-persist'
import { Link, useNavigate } from 'react-router-dom'
import NotificationItem from 'examples/Items/NotificationItem'
import { store } from 'redux/store'
import reduxContainer from 'redux/containers/containers'
import { getProjectData } from 'redux/global/global-functions'
import { getBrandData } from 'redux/global/global-functions'
import MDButton from 'components/MDButton'
import DefaultAvatar from 'assets/mi-banana-icons/default-profile.png'
import { reRenderChatComponent } from "redux/actions/actions";
import apiClient from 'api/apiClient'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { currentUserRole } from 'redux/global/global-functions'
import { mibananaColor } from 'assets/new-images/colors'
import { styled } from '@mui/material/styles'
import { fontsFamily } from 'assets/font-family'
import { projectIcon } from 'assets/new-images/navbars/create-project-icon'
import SuccessModal from 'components/SuccessBox/SuccessModal'
import CreateProject1 from '../Form-modal/new'
import useRightSideList from 'layouts/Right-side-drawer-list/useRightSideList'
import RightSideDrawer from 'components/RightSideDrawer'
import { useMaterialUIController } from 'context'
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import { setMiniSidenav } from 'context'
import "./navbar-style.css"
let image = "image/"

const NewNavbar = ({ reduxState, reduxActions }) => {
  const navbarStyles = useStyles()
  const isLarge = useMediaQuery("(min-width:800px)")
  const [userMenu, setUserMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [inComingMsg, setInComingMsg] = useState(false)
  const userNewChatMessage = reduxState.userNewChatMessage
  const handleUserProfileMenu = (event) => setUserMenu(event.currentTarget);
  const handleUserCloseMenu = () => setUserMenu(false);
  const handleCloseMenu = () => setOpenMenu(false);
  const reduxDispatch = useDispatch()
  const render_chat = useSelector(state => state.re_render_chat)
  const role = currentUserRole(reduxState)
  const personImage = reduxState?.userDetails?.avatar ? reduxState?.userDetails?.avatar : DefaultAvatar
  const setChatRender = (payload) => reduxDispatch(reRenderChatComponent(payload))
  const navigate = useNavigate()
  const [respMessage, setRespMessage] = useState("")
  const [errorSB, setErrorSB] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const [add_files, setAddFiles] = useState([])
  const [upload_files, setUploadFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null)
  const openErrorSB = () => setErrorSB(true);
  const brandOption = reduxState.customerBrand?.map(item => item.brand_name)
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { list } = useRightSideList()
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
  const is600 = useMediaQuery("(min-width:600px)")
  const is800 = useMediaQuery("(min-width:800px)")
  const islg = useMediaQuery("(min-width:911px)")

  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  const handleClickOpen = () => {
    setOpen(true)
  };
  const handleLogout = async () => {
    try {
      persistStore(store).purge();
      localStorage.removeItem("user_details");
      navigate("/authentication/mi-sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleClose = () => {
    // reduxActions.showModal(false)
    setOpen(false)
  };
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValue({
      ...formValue,
      [name]: value
    })
  }
  const handleOpenMenu = (event) => {
    setInComingMsg(false)
    setOpenMenu(event.currentTarget)
  };
  function clearAllNotfications() {
    reduxActions.getUserNewChatMessage([])
  }
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
  function inComingMessage() {
    if (reduxState?.userDetails?.roles?.includes("Admin")) return
    const arr = userNewChatMessage?.filter(item => item.view === true)
    if (arr?.length === 0) return ""
    else {
      return arr?.length
    }
  }
  function clearIncomingMsg(item, index) {
    const userId = index
    const _id = reduxState?.userDetails?.id
    apiClient.get(`/api/udpate-notifications/${userId}/${_id}`)
      .then(({ data }) => {
        reduxActions.getUserNewChatMessage(data?.msgArray)
      }).catch((err) => {
        console.error(err.message)
      })
    getToTheProject(item?.project_id)
  }
  async function updateAllChatMessage() {
    const id = reduxState.userDetails?.id
    if (getMessageNotification()) {
      await apiClient.get(`/api/udpate-all-notifications/${id}`)
        .then(({ data }) => {
          console.log('updated chat data =>', data)
          reduxActions.getUserNewChatMessage(data?.msgArray)
        }).catch((err) => {
          console.error(err.message)
        })
    }
  }
  function showPersonRoles() {
    if (role?.projectManager) return "(Project Manager)"
    if (role?.admin) return "(Admin)"
    if (role?.designer) return "(Graphic-Designer)"
    if (role?.customer) return "(Customer)"
  }
  function showRoles() {
    if (role?.projectManager) return "Manager"
    if (role?.admin) return "Admin"
    if (role?.designer) return "Designer"
    if (role?.customer) return "Customer"
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
  const removeFiles = () => {
    setAddFiles([])
    setUploadFiles([])
    setUploadProgress(0)
  }
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
  const onRemoveChange = (state) => {
    setFormValue({ ...formValue, state: '' })
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
  const getAllNotificationsMsg = () => {
    const id = reduxState?.userDetails?.id
    apiClient.get("/api/get-notifications/" + id).then(({ data }) => {
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
      <Link to={"/settings/profile"}>
        <NotificationItem icon={<Icon>person</Icon>} title="Profile" />
      </Link>
      <Link to={"/settings/company-profile"}>
        <NotificationItem icon={<Icon>account_box</Icon>} title="Company Profile" />
      </Link>
      <NotificationItem icon={<Icon>logout</Icon>} onClick={handleLogout} title="Logout" />

    </Menu >
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
        borderRadius: '0px',
        padding: '10px',

      }}
    >
      {userNewChatMessage?.length > 0 && (
        <MDButton variant="filled" color="info" p={1} sx={{ width: '100%', fontsFamily: fontsFamily.poppins }} onClick={clearAllNotfications}>
          clear all message
        </MDButton>
      )}
      {userNewChatMessage?.length > 0 ? userNewChatMessage.map((newMsg, i) => (
        <MDBox
          display="flex"
          key={i}
          flexDirection="column"
          p={.8}
          mb={.2}
          width="240px"
          gap="5px"
          sx={{ backgroundColor: newMsg?.view ? "#4b45458c" : "white", ":hover": { backgroundColor: '#ddd', cursor: 'pointer', borderRadius: '0px !important' } }}
          onClick={() => clearIncomingMsg(newMsg, i)}
        >
          <MDTypography fontSize="medium" fontWeight="bold" sx={notificationStyles}>{newMsg?.project_title}</MDTypography>
          <MDBox display="flex" gap="8px" width="100%">
            {newMsg?.avatar ? <img src={newMsg?.avatar} loading="lazy" width={40} height={40} style={{ borderRadius: '20px' }} /> : <img src={DefaultAvatar} loading="lazy" width={40} height={40} style={{ borderRadius: '20px' }} />}
            <MDBox display="flex" flexDirection="column" gap="5px" width="100%">
              <MDTypography fontSize="small" fontWeight="300" sx={notificationStyles}>{newMsg?.message}</MDTypography>
              <MDTypography fontSize="small" fontWeight="300" sx={{ fontFamily: fontsFamily.poppins, color: mibananaColor.tableHeaderColor, fontStyle: 'italic' }}>{"received message from "}<b style={{ display: 'block' }}>{newMsg?.role}</b></MDTypography>
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
  useEffect(() => {
    setInComingMsg(true)
  }, [userNewChatMessage])

  useEffect(() => {
    const id = reduxState?.userDetails?.id
    getProjectData(id, reduxActions.getCustomerProject)
    getBrandData(id, reduxActions.getCustomerBrand)
  }, [reduxState.new_brand])

  const ProjectButton = styled(Button)(({ theme: { palette } }) => {
    const { primary } = palette
    return {
      backgroundColor: primary.main,
      fontFamily: fontsFamily.poppins,
      fontWeight: '400',
      borderRadius: 0,
      height: '100%',
      "&:hover": {
        backgroundColor: "#d9ba08",
      },
      "&:focus": {
        backgroundColor: "#d9ba08 !important",
      }
    }
  })
  const gridItemResponsive = ({ breakpoints }) => ({
    [breakpoints.up('xs')]: {
      padding: '12px'
    },
    [breakpoints.down('xs')]: {
      padding: '0px !important'
    },
  })
  const responsiveStyle = ({ breakpoints }) => ({
    [breakpoints.up('lg')]: {
      fontSize: '20px !important',
    },
    [breakpoints.down('lg')]: {
      fontSize: '16px !important',
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
  const imgResponsive = () => {
    let width = ''
    let height = ''
    if (!is800) {
      width = '50px'
      height = '50px'
    } else if (!is600) {
      width = '45px'
      height = '45px'
    }
    return {
      width,
      height
    }

  }
  const getMessageNotification = () => {
    const isnotifications = userNewChatMessage?.some(item => item?.view === true)
    return isnotifications
  }
  // console.log('get notifications ', getMessageNotification())
  useEffect(() => {
    getAllNotificationsMsg()
  }, [])

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
        deleteOtherSingleFile={deleteOtherSingleFile} s
      />
      <SuccessModal
        msg={respMessage}
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        width="30%"
        color="#288e28"
        // title="SUCCESS"
        sideRadius={false}
      />
      <Grid container className={navbarStyles.gridContainer} sx={
        { paddingInline: !is600 ? "0.5rem" : "5rem", alignItems: !is800 && "center", paddingBlock: !islg ? "13px" : '20px', }}>
        <Grid item xxl={6.5} xl={4} lg={4} md={5} sm={6} xs={5} display={"flex"} alignItems={"center"} textAlign={!isLarge && "center"}>
          <img className='logo-image' src={MibananaIcon} loading='lazy' />
        </Grid >
        <Grid item xxl={5.5} xl={8} lg={8} md={7} sm={6} xs={7}>
          <Grid container alignItems="center">
            <Grid item xxl={5} xl={5} display={"flex"} gap="18px" lg={5} md={12} sm={12} xs={12} sx={gridItemResponsive}>
              <img className="person-image" src={personImage} />
              <div className='hello-text-container'>
                <MDTypography className="hello-text" sx={responsiveStyle}>Hello {showRoles()}!</MDTypography>
                <MDTypography className="person-role" sx={roleResponsive}>{showPersonRoles()}</MDTypography>
              </div>
            </Grid>
            <Grid item xxl={7} xl={7} lg={6} md={6} xs={12} sx={({ breakpoints }) => ({
              [breakpoints.down('lg')]: {
                display: 'none'
              }
            })}>
              <Grid container justifyContent={"center"}>
                <Grid item xxl={12} xl={12} lg={12} md={12} sm={12} xs={12} display="flex" alignItems={"center"} gap={"8px"} sx={({ breakpoints }) => ({ [breakpoints.only('xs')]: { paddingBottom: '14px' } })}>
                  <div className={navbarStyles.btnContainer} onClick={updateAllChatMessage}>
                    {getMessageNotification() ? <span className={navbarStyles.notificationPoint}></span> : null}
                    <RightSideDrawer list={list} />
                  </div>
                  <div
                    className={navbarStyles.btnContainer}
                    onClick={handleUserProfileMenu}
                  >
                    <AccountCircle
                      fontSize='large'
                      sx={{ fill: "#F6F6E8" }} />
                  </div>
                  {renderUserMenu()}
                  {role?.customer && <ProjectButton
                    variant="contained"
                    size='medium'
                    startIcon={projectIcon}
                    onClick={handleClickOpen}
                  >
                    Create Project
                  </ProjectButton>}
                </Grid>
                {/* <Grid item xxl={6} xl={6} lg={6} md={6} xs={12} sx={({ breakpoints }) => ({
                  [breakpoints.only('xs')]: {
                    paddingTop: '5px',
                    paddingBottom: '14px',
                    textAlign: 'center'
                  }
                })}>
                  <ProjectButton
                    variant="contained"
                    size='medium'
                    startIcon={projectIcon}
                    onClick={handleClickOpen}
                  >
                    Create Project
                  </ProjectButton>
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid >
      </Grid >
    </>
  )
}

const notificationStyles = {
  fontFamily: fontsFamily.poppins,
  color: mibananaColor.yellowTextColor,
  wordBreak: 'break-word',
}

export default reduxContainer(NewNavbar)

