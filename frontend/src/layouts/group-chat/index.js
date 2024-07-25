import { Box, FormControl, Grid, InputLabel, ListItem, ListItemText, MenuItem, Select, Typography } from '@mui/material'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React from 'react'
import UserOnlineIcon from './components/userOnlineicon'
import FullScreenLoader from 'components/Loader/FullScreenLoader'
import useGroupChat from './useGroupChat'
import { BeatLoader } from 'react-spinners'
import TeamGroupChat from './components/group-chat'
import reduxContainer from 'redux/containers/containers'

const GroupChat = ({ reduxState, reduxActions }) => {
    const { loading, groupChat, user_avatar, user_id, username, filter, handleFilterChange } = useGroupChat(reduxState, reduxActions)

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

                        <Box sx={{ width: groupChat === null ? "100%" : '25%', ...boxStyles }}>
                            <Typography variant="h4" gutterBottom>
                                Group Chat
                            </Typography>
                        </Box>
                        {groupChat === null ? null : <TeamGroupChat
                            reduxActions={reduxActions}
                            reduxState={reduxState}
                            boxStyles={boxStyles}
                            userId={user_id}
                            username={username}
                            user_avatar={user_avatar}
                            item={{ name: 'zain', avatar: '', roles: ['Graphic-Designer'], _id: '123412341928734' }}
                        />}
                    </Box>
                )}
            </Grid>
        </DashboardLayout >
    )
}

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

export default reduxContainer(GroupChat)
