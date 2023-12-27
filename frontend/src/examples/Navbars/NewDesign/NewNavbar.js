import React, { useEffect } from 'react'
import MDBox from 'components/MDBox'
import { Badge, Grid, Icon, Menu, useMediaQuery } from '@mui/material'
import MibananaIcon from 'assets/new-images/navbars/mibanana-logo.png'
import { useStyles } from './new-navbar-style'
// import personImage from 'assets/new-images/navbars/Rectangle.png'
import MDTypography from 'components/MDTypography'
import { notificationsIcon } from 'assets/new-images/navbars/notificationIcon'
import { infoCircle } from 'assets/new-images/navbars/info-circle'
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

const NewNavbar = ({ reduxState, reduxActions }) => {
  const navbarStyles = useStyles()
  const isLarge = useMediaQuery("(max-width:600px)")
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

  const handleLogout = async () => {
    try {
      persistStore(store).purge();
      localStorage.removeItem("user_details");
      navigate("/authentication/mi-sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
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
        console.log(data)
      }).catch((err) => {
        console.error(err.message)
      })
    getToTheProject(item?.project_id)
  }
  function showPersonRoles() {
    if (role?.projectManager) return "(Project Manager)"
    if (role?.admin) return "(Admin)"
    if (role?.graphicDesigner) return "(Graphic-Designer)"
    if (role?.customer) return "(Customer)"
  }
  function showRoles() {
    if (role?.projectManager) return "Manager"
    if (role?.admin) return "Admin"
    if (role?.graphicDesigner) return "Designer)"
    if (role?.customer) return "Customer"
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

  useEffect(() => {
    setInComingMsg(true)
  }, [userNewChatMessage])

  useEffect(() => {
    const id = reduxState?.userDetails?.id
    getProjectData(id, reduxActions.getCustomerProject)
    getBrandData(id, reduxActions.getCustomerBrand)
  }, [reduxState.new_brand])


  return (
    <Grid container className={navbarStyles.gridContainer}>
      <Grid item xxl={8} xl={8} lg={8} md={12} xs={12} textAlign={isLarge && "center"}>
        <img src={MibananaIcon} loading='lazy' width={isLarge ? "60%" : "26%"} />
      </Grid >
      <Grid item xxl={4} xl={4} lg={4} md={12} xs={12}>
        <Grid container alignItems="center">
          <Grid item xxl={2} xl={2} lg={2} pl={"20px"} md={2} xs={2} alignSelf={"flex-end"}>
            <img src={personImage} style={{ display: "block" }} width={"61px"} height={"61px"} />
          </Grid>
          <Grid item xxl={4} xl={4} lg={4} md={12} xs={6}>
            <MDTypography className={navbarStyles.insideText}>Hello {showRoles()}!</MDTypography>
            <MDTypography fontSize="medium" className={`${navbarStyles.poppins} ${navbarStyles.userRole}`}>{showPersonRoles()}</MDTypography>
          </Grid>
          <Grid item xxl={5} xl={5} xs={5}>
            <Grid container spacing={0}>
              <Grid item lg={4}>
                <Badge badgeContent={inComingMessage()} sx={({ palette: { primary } }) => ({

                  "& .MuiBadge-badge": { fontSize: '1rem', backgroundColor: primary.main, color: primary.contrastText }
                })}>
                  <div
                    className={navbarStyles.btnContainer}
                    onClick={handleOpenMenu}
                  >
                    {notificationsIcon}
                  </div>
                </Badge>
              </Grid>
              {renderMenu()}
              <Grid item lg={4}>
                <div className={navbarStyles.btnContainer}>
                  {infoCircle}
                </div>
              </Grid>
              <Grid item lg={4}>
                <div
                  className={navbarStyles.btnContainer}
                  onClick={handleUserProfileMenu}
                >
                  <AccountCircle
                    fontSize='large'
                    sx={{ fill: "#F6F6E8" }} />
                </div>
                {renderUserMenu()}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid >
    </Grid >
  )
}

export default reduxContainer(NewNavbar)

