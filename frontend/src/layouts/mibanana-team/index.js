import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React, { useState } from 'react'
import noPageFound from 'assets/new-images/mibanana-team/no-page.png'
import { Box, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Typography, useMediaQuery } from '@mui/material'
import SendOutlined from '@mui/icons-material/SendOutlined';
import MDTypography from 'components/MDTypography'
import { fontsFamily } from 'assets/font-family'
import { mibananaColor } from 'assets/new-images/colors'
import TeamMemberChat from 'layouts/team-member-chat'
import useMibananaTeam from './useMibananaTeam'
import ChatIcon from '@mui/icons-material/Chat';
import SingleChat from 'layouts/team-member-chat/components/singleChat'
import reduxContainer from 'redux/containers/containers'
import { BeatLoader } from 'react-spinners'


import './miBananaTeamMembers.css'
import PrivateChat from './components/private-chat'
import FullScreenLoader from 'components/Loader/FullScreenLoader'
import UserOnlineIcon from './components/userOnlineicon'
import ChatMessageNo from 'examples/Sidenav/ChatMessageNo'
import Chat from '@mui/icons-material/Chat'

const MibananaTeam = ({ reduxState, reduxActions }) => {
    const is768 = useMediaQuery("(min-width:768px)")
    const onlineUsers = reduxState.onlineUser
    const {
        loading,
        handleSingleChat,
        user_avatar,
        username,
        singleChat,
        user_id,
        filteredMembers,
        handleFilterChange,
        resetUnreadMessages,
        filter
    } = useMibananaTeam(reduxState, reduxActions)

    const boxStyles = {
        padding: "1.5rem",
        // margin: "0 1rem",
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        borderRadius: "10px",
        // maxHeight: "90vh",
        height: "84vh",
        overflow: "hidden",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
            width: "0.4rem",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "lightgray",
            borderRadius: "10px",
        },
    };
    // console.log(filteredMembers)
    const onlineWidth = (member) => {
        const currentUser = onlineUsers?.some(item => item.id === member._id)
        if (currentUser) {
            return { gap: '1rem' }
        }
        else {
            return null
        }
    }
    return (
        <DashboardLayout>
            <Grid container spacing={0} py={0} px={2} height={"100%"} justifyContent={'center'} alignItems={"center"} width={"100%"} sx={{
                backgroundColor: loading ? 'rgb(0, 0, 0, .2);' : 'inherit'
            }}>
                {loading ? (
                    <FullScreenLoader>
                        <BeatLoader size={25} color={'#fff'} />
                    </FullScreenLoader>
                ) : (
                    <Box sx={{ width: '100%', display: 'flex', gap: '.7rem', justifyContent: 'flex-start', alignItems: 'center', xpadding: '1rem', borderRadius: '10px' }}>

                        <Box sx={{ width: singleChat === null ? "100%" : '25%', ...boxStyles }}>
                            <Typography variant="h4" gutterBottom>
                                Team Members
                            </Typography>
                            <FormControl variant="outlined" fullWidth margin="normal">
                                <InputLabel>Filter by Role</InputLabel>
                                <Select
                                    value={filter}
                                    onChange={handleFilterChange}
                                    label="Filter by Role"
                                    sx={{ minHeight: '3rem', display: 'flex', alignItems: 'center' }}
                                >
                                    <MenuItem value=""><em>All</em></MenuItem>
                                    <MenuItem value="Mobile-App-Developer">Mobile Developer</MenuItem>
                                    <MenuItem value="Graphic-Designer">Graphic Designer</MenuItem>
                                    <MenuItem value="Copy-Writer">Copy Writer</MenuItem>
                                    <MenuItem value="Web-Developer">Web Developer</MenuItem>
                                    <MenuItem value="Social-Media-Manager">Social Media Manager</MenuItem>
                                </Select>
                            </FormControl>
                            <List>
                                {
                                    filteredMembers.map((member, index) => (
                                        <ListItem key={index} disablePadding sx={{
                                            "&:focus-within": {
                                                backgroundColor: (filteredMembers?.some(member => member._id === singleChat?._id)) ? "rgba(149, 157, 165, 0.2) !important" : null,
                                            },
                                        }} onClick={() => handleSingleChat(member)}>
                                            <ListItemButton sx={onlineWidth(member)} onClick={() => resetUnreadMessages(member._id)}>
                                                <UserOnlineIcon member={member} data={onlineUsers} />
                                                <ListItemText
                                                    sx={{ position: 'relative' }}
                                                    primary={
                                                        <React.Fragment>
                                                            {member.name}
                                                            {"   "}
                                                            <ChatMessageNo memberId={member._id} />
                                                            <Typography
                                                                variant="body2"
                                                                component="div"
                                                                color="textSecondary"
                                                            >
                                                                {member.roles}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Box>
                        {singleChat === null ? null : <PrivateChat
                            reduxActions={reduxActions}
                            reduxState={reduxState}
                            boxStyles={boxStyles}
                            userId={user_id}
                            username={username}
                            user_avatar={user_avatar}
                            item={singleChat}
                        />}
                    </Box>
                )}

            </Grid>
        </DashboardLayout >
    )
}

const titleStyles = {
    fontSize: '2.5rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}
const titleStyles2 = {
    fontSize: '1.5rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}
export default reduxContainer(MibananaTeam)
