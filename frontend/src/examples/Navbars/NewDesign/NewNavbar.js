import React, { useCallback, useContext, useEffect, useRef } from "react";
import MDBox from "components/MDBox";
import {
  Avatar,
  Button,
  Grid,
  Icon,
  Menu,
  MenuItem,
} from "@mui/material";
import MibananaIcon from "assets/new-images/navbars/mibanana-logo.png";
import MDTypography from "components/MDTypography";
import { NavLink, Link } from "react-router-dom";
// import { useState } from "react";
// import { persistStore } from "redux-persist";
import NotificationItem from "examples/Items/NotificationItem";
import Divider from "@mui/material/Divider";

import reduxContainer from "redux/containers/containers";
import { mibananaColor } from "assets/new-images/colors";
import { styled } from "@mui/material/styles";
import { fontsFamily } from "assets/font-family";
import SuccessModal from "components/SuccessBox/SuccessModal";
import CreateProject1 from "../Form-modal/new";
import RightSideDrawer from "components/RightSideDrawer";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import List from "@mui/material/List";
import "./navbar-style.css"
import MenuIcon from "@mui/icons-material/Menu"

import ProjectMenuOptions from "../create-project-poper/project-menu-poper";
import CopyWritingForm from "../Copy-writing-form/copy-writing-form";
import SocialMediaManager from "../social-media-form/social-media-manager";
import WebsiteForm from "../website-form/website-form";
import WebAppDevForm from "../web-app-form/web-app-dev-form";
import MobileAppDevForm from "../mobile-app-dev-form/mobile-app-dev-form";
import TransitionsModal from "components/Modal/Modal";
import EditProjectModal from "../Form-modal/editProject";
import TransitionsErrorModal from "components/Modal/ErrorModal";
import useNavbarHook from "./useNavbarHook";


const NewNavbar = ({ reduxState, reduxActions, routes }) => {

  const { open, socketIO, formValue, respMessage, successSB, setSuccessSB, setErrorSB, errorSB, handleSubmit, setFormValue, handleClose, openErrorSB, openSuccessSB, setRespMessage, selectedOption, setSelectedOption, handleChange, add_files, brandOption, deleteOtherSingleFile, handleFileUpload, loading, onRemoveChange, quilRef, quillError, removeFiles, removeSingleFile, setShowSuccessModal, uploadProgress, upload_files, handleCloseMobileAppDev, handleCloseSocialMedia, handleCloseWebsite, handleMobileNav, openCopyWriting, handleOpenCopyWriting, clientFiles, editImages, edit_loading, handleClickOpen, handleCloseWebAppDev, handleEditProjectClose, handleMobileAppDev, handleOpenCopyWritingClose, handleOpenSocialMedia, handleUserProfileMenu, handleWebAppDev, handleWebsite, images_loading, modalWidth, notificationsLength, openMobileApp, openSocialMediaForm, openWebApp, openWebsite, personImage, responsiveStyle, role, roleResponsive, setEditImages, setEditLoading, setLoading, showPersonRoles, showSuccessModal, list, getMessageNotification, handleLogout, showAccountsbtn, userMenu, handleUserCloseMenu, anchorEl, collapseName, darkMode, handleMenuClose, handleMenuOpen, is1040, navigate, textColor, transparentSidenav, whiteSidenav } = useNavbarHook(reduxState, reduxActions)

  function showRoles() {
    const { name } = reduxState?.userDetails
    return name
  }

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
  // const notificationSound = () => {
  //   const audio = new Audio(notif);
  //   audio.play();
  // }

  // const showNotification = () => {
  //   if (Notification.permission === 'granted') {
  //     new Notification('Upcoming Event', {
  //       body: `Allow app to play notifications sound`,
  //     });

  //     // Play the notification sound
  //     notificationSound();
  //   } else if (Notification.permission !== 'denied') {
  //     Notification.requestPermission().then((permission) => {
  //       if (permission === 'granted') {
  //         new Notification('Upcoming Event', {
  //           body: `Allow app to play notifications sound!`,
  //         });
  //         notificationSound();
  //       }
  //     });
  //   }
  // };

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

  return (
    <>
      <TransitionsModal message={respMessage} openModal={successSB} setOpenModal={setSuccessSB} />
      <TransitionsErrorModal message={respMessage} openModal={errorSB} setOpenModal={setErrorSB} />
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
        quillError={quillError}
        quilRef={quilRef}
        handleFileUpload={handleFileUpload}
        removeFiles={removeFiles}
        reduxState={reduxState}
        reduxActions={reduxActions}
        setShowSuccessModal={setShowSuccessModal}
        brandOption={brandOption}
        removeSingleFile={removeSingleFile}
        deleteOtherSingleFile={deleteOtherSingleFile}
      />
      <EditProjectModal
        open={reduxState.edit_project}
        handleClose={handleEditProjectClose}
        current_id={reduxState.currentProjectId}
        projects={reduxState?.project_list?.CustomerProjects}
        brandOption={brandOption}
        files={editImages}
        setEditImages={setEditImages}
        userId={reduxState.userDetails?.id}
        callback={reduxActions.getCustomerProject}
        // setOpenModal={setOpenModal}
        setRespMessage={setRespMessage}
        reduxState={reduxState}
        setEditLoading={setEditLoading}
        images_loading={images_loading}
        loading={edit_loading}
        clientFiles={clientFiles}
      />

      <CopyWritingForm
        open={openCopyWriting}
        handleClose={handleOpenCopyWritingClose}
        socketIO={socketIO}
        reduxState={reduxState}
        reduxActions={reduxActions}
        setRespMessage={setRespMessage}
        respMessage={respMessage}
        openErrorSB={openErrorSB}
        openSuccessSB={openSuccessSB}
        loading={loading}
        setLoading={setLoading}
      />

      <SocialMediaManager
        open={openSocialMediaForm}
        handleClose={handleCloseSocialMedia}
        socketIO={socketIO}

        formValue={formValue}
        setFormValue={setFormValue}
        add_files={add_files}
        upload_files={upload_files}
        handleFileUpload={handleFileUpload}
        removeFiles={removeFiles}

        setLoading={setLoading}
        setRespMessage={setRespMessage}
        openErrorSB={openErrorSB}
        openSuccessSB={openSuccessSB}
        reduxState={reduxState}
        reduxActions={reduxActions}
        loading={loading}
      />

      <WebsiteForm
        open={openWebsite}
        socketIO={socketIO}
        handleClose={handleCloseWebsite}
        setRespMessage={setRespMessage}
        openErrorSB={openErrorSB}
        openSuccessSB={openSuccessSB}
        reduxState={reduxState}
        reduxActions={reduxActions}
        loading={loading}
        setLoading={setLoading}

      />

      <WebAppDevForm
        open={openWebApp}
        socketIO={socketIO}
        handleClose={handleCloseWebAppDev}
        setRespMessage={setRespMessage}
        respMessage={respMessage}
        openErrorSB={openErrorSB}
        openSuccessSB={openSuccessSB}
        reduxState={reduxState}
        reduxActions={reduxActions}
        loading={loading}
        setLoading={setLoading}
      />

      <MobileAppDevForm
        open={openMobileApp}
        socketIO={socketIO}
        handleClose={handleCloseMobileAppDev}
        setRespMessage={setRespMessage}
        reduxState={reduxState}
        reduxActions={reduxActions}
        respMessage={respMessage}
        openErrorSB={openErrorSB}
        openSuccessSB={openSuccessSB}
        loading={loading}
        setLoading={setLoading}
      />


      <SuccessModal
        msg={respMessage}
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        width={modalWidth()}
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
            <div className="btn-container">
              {getMessageNotification() ? (
                <span className="notifications-point">{notificationsLength()}</span>
              ) : null}
              <RightSideDrawer list={list} />
            </div>
            <div className="btn-container menu-icon" onClick={handleMobileNav} >
              <MenuIcon fontSize="large" />
            </div>
            {renderUserMenu()}
            {role?.customer &&
              // (
              //   <ProjectButton
              //     variant="contained"
              //     size="medium"
              //     className="create-project-btn"
              //     startIcon={projectIcon}
              //     onClick={handleClickOpen}

              //   >
              //     Create Project
              //   </ProjectButton>
              // )
              <ProjectMenuOptions
                size="medium"
                handleClickOpen={handleClickOpen}
                handleCopyWriting={handleOpenCopyWriting}
                handleSocialMedia={handleOpenSocialMedia}
                handleWebsite={handleWebsite}
                handleWebAppDev={handleWebAppDev}
                handleMobileAppDev={handleMobileAppDev}
              />
            }
          </MDBox>
        </Grid>
        <Grid className="grid-3" item style={{ display: showAccountsbtn ? 'flex' : 'none' }}>
          <div className="btn-container">

            {getMessageNotification() ? (
              <span className="notifications-point">{notificationsLength()}</span>
            ) : null}
            <RightSideDrawer list={list} />
          </div>
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
