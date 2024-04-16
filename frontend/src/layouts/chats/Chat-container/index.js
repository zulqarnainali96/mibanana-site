import { useState } from 'react';
import SendOutlined from '@mui/icons-material/SendOutlined';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { mibananaColor } from 'assets/new-images/colors';
import { modules } from 'assets/react-quill-settings/react-quill-settings';
import { formats } from 'assets/react-quill-settings/react-quill-settings';
import { reactQuillStyles2 } from 'assets/react-quill-settings/react-quill-settings';
import MDTypography from 'components/MDTypography';
import React from 'react'
import ReactQuill from "react-quill";
import { fontsFamily } from 'assets/font-family';
import imageAvatar from "assets/mi-banana-icons/default-profile.png";
import { MenuList, useMediaQuery } from '@mui/material';
import MDBox from 'components/MDBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const ChatsContainer = ({
    chatContainerRef,
    msgArray,
    onSendMessage,
    reduxState,
    sendMessage,
    message,
    projectAttend,
    projectForReview
}) => {
    const classes = reactQuillStyles2()
    const avatar = reduxState?.userDetails?.avatar;
    const id = reduxState?.userDetails?.id
    const is500 = useMediaQuery("(max-width:500px)")
    const projectId = reduxState?.customerBrand[0]._id;

    // handle dropdown menu for change status in chat
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const userDetailsString = localStorage.getItem('user_details');
    const userRole = userDetailsString ? JSON.parse(userDetailsString).roles[0] : '';

    const projectAttend1 = (itemId) => {
        // Implement your logic here to handle project completion
        console.log(`Project with ID ${itemId} Ongoing`);
        alert("Ongoing")
    };
    const projectForReview1 = (itemId) => {
        // Implement your logic here to handle project completion
        console.log(`Project with ID ${itemId} for review`);
        alert("For Review")
    };
    const withRevision = (itemId) => {
        // Implement your logic here to handle project completion
        console.log(`Project with ID ${itemId} revision`);
        alert("For Revision")
    };

    return (
        <React.Fragment>
            <MDTypography
                sx={({ palette: { primary } }) => ({
                    fontFamily: fontsFamily.poppins,
                    color: mibananaColor.tableHeaderColor,
                    fontWeight: "bold",
                    fontSize: is500 ? "14px !important" : "16px",
                    paddingBottom: "5px",
                    borderBottom: `2px solid ${mibananaColor.tableHeaderColor}`,
                    display: "flex",
                })}
                variant="h4"
                pb={1}
            >
                <Grid xs={6} style={{display:"flex", alignItems:"center"}}>Activity</Grid>
                {userRole === 'Graphic-Designer' && (
                    <Grid
                        id="dropdown-btn"
                        aria-controls={anchorEl ? 'dropdown-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={anchorEl ? 'true' : undefined}
                        onClick={handleClick}
                        item
                        xs={6}
                        style={{ display: "flex", justifyContent: "end", alignItems: "center", cursor: "pointer" }}
                    >
                        Change Status
                        <MoreVertIcon />
                    </Grid>
                )}
                {userRole === 'Customer' && (
                    <Grid
                        id="dropdown-btn-customer"
                        aria-controls={anchorEl ? 'dropdown-menu-customer' : undefined}
                        aria-haspopup="true"
                        aria-expanded={anchorEl ? 'true' : undefined}
                        onClick={handleClick}
                        item
                        xs={6}
                        style={{ display: "flex", justifyContent: "end", alignItems: "center", cursor: "pointer" }}
                    >
                        <span style={{backgroundColor: "#FFE135", color: "#636e72", padding:"0.5rem 0.8rem", display: "flex", alignItems:"center"}}>
                            Send Changes to Designer
                            <MoreVertIcon />
                        </span>
                    </Grid>
                )}
                <Menu
                    id="dropdown-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    style={{ top: "10px" }}
                >
                    <MenuList>
                        {userRole === 'Graphic-Designer' && (
                            <div>
                                <MenuItem onClick={()=>{projectAttend1(projectId); handleClose();}}>Ongoing</MenuItem>
                                <MenuItem onClick={()=>{projectForReview1(projectId); handleClose();}}>For Review</MenuItem>
                            </div>
                        )}
                        {userRole === 'Customer' && (
                            <MenuItem onClick={()=>{handleClose(); withRevision(projectId)}}>Revisions</MenuItem>
                        )}
                    </MenuList>
                </Menu>



            </MDTypography>
            <Grid
                ref={chatContainerRef}
                container
                justifyContent={"space-between"}
                alignItems={"flex-start"}
                flexDirection={"column"}
                sx={{
                    height: "86%",
                    overflowY: "scroll",
                    "::-webkit-scrollbar": {
                        width: "10px",
                        height: "0",
                    },
                    "::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                        borderRadius: 2
                    },
                }}
            >
                <h1 className='h1-style'>CHAT</h1>
                <Grid item xxl={12} xl={12} lg={12} width={"100%"}>
                    <Box className="chat" >
                        {msgArray?.length
                            ? msgArray.map((item, index, messages) => {
                                return (
                                    <>
                                        {is500 ? (
                                            <prev key={index}
                                                className={`message ${item.user === id ? "right" : "left"
                                                    }`}
                                                style={{ position: "relative" }}>
                                                <MDBox display="flex" gap="12px">
                                                    <p style={{ ...nameStyle, position: "relative", width: "100%", fontSize: "11px" }}>
                                                        {item.name}
                                                        <span
                                                            style={{ ...nameStyle, fontWeight: "300", fontSize: "9px" }}
                                                        >
                                                            {" (" + item?.role + ")"}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: "8px",
                                                                fontWeight: "300",
                                                                position: "absolute",
                                                                right: "10px",
                                                                color: mibananaColor.tableHeaderColor,
                                                            }}
                                                        >
                                                            {item.time_data ? item.time_data : null}
                                                        </span>
                                                    </p>
                                                </MDBox>
                                                <Box
                                                    sx={{ mt: 1, p: '7px', paddingInline: is500 && '18px', ...nameStyle, fontWeight: "300", fontSize: "10px" }}
                                                    className="message-content"
                                                    dangerouslySetInnerHTML={{ __html: item.message }}
                                                >

                                                </Box>
                                            </prev>
                                        ) : (
                                            <pre
                                                key={index}
                                                className={`message ${item.user === id ? "right" : "left"
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
                                                            left: item.user === id ? "70px" : "-9px",
                                                        }}
                                                    />
                                                    <Box width="100%" ml={"18px"}>
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
                                                            dangerouslySetInnerHTML={{ __html: item.message }}
                                                        >

                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </pre>)}
                                    </>
                                );
                            })
                            : null}
                    </Box>
                </Grid>
            </Grid>
            <Box
                width="98%"
                m='auto'
                mt={0}
                p={1}
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "absolute",
                    paddingBlock: '10px',
                    left: "0",
                    bottom: "0px",
                    gap: '15px',
                    backgroundColor: mibananaColor.headerColor
                }}
            >
                <Box sx={{ display: is500 ? "none" : 'block' }}>
                    <img
                        src={avatar ? avatar : imageAvatar}
                        width={is500 ? 34 : 50}
                        height={is500 ? "auto" : 50}
                        alt="person-image"
                    />
                </Box>
                <ReactQuill
                    theme="snow"
                    value={message}
                    onChange={(value) => sendMessage(value)}
                    modules={modules}
                    formats={formats}
                    className={classes.quill}
                    style={{ width: is500 ? '97%' : '87%' }}
                />
                <SendOutlined
                    fontSize="medium"
                    sx={{
                        position: "absolute",
                        right: 20,
                        top: 54,
                        fill: 'rgba(0,0,0,0.7)',
                        cursor: "pointer",
                    }}
                    onClick={onSendMessage}
                />
            </Box>
        </React.Fragment>
    )
}

const nameStyle = {
    fontFamily: fontsFamily.poppins,
    fontWeight: "600",
    fontSize: "16px",
    color: mibananaColor.yellowTextColor,
};

export default ChatsContainer
