import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React from 'react'
import { Box, FormControl, Grid, IconButton, InputLabel, List, MenuItem, Select, useMediaQuery } from '@mui/material'
import { fontsFamily } from 'assets/font-family'
import { mibananaColor } from 'assets/new-images/colors'
import useMibananaTeam from './useMibananaTeam'
import reduxContainer from 'redux/containers/containers'
import { BeatLoader } from 'react-spinners'
import ClearIcon from '@mui/icons-material/Clear';


import './miBananaTeamMembers.css'
import PrivateChat from './components/Private-Chat/private-chat'
import FullScreenLoader from 'components/Loader/FullScreenLoader'
import UserOnlineIcon from './components/userOnlineicon'
import TitleContainer from './components/title-container'
import CreateGroupForm from './components/Create-Group-Form/create-group-from'
import FitlerTeamMembers from './components/filter-team-member'
import GroupChat from './components/Group-Chat/group-chat'
import TransitionsErrorModal from 'components/Modal/ErrorModal'
import TransitionsModal from 'components/Modal/Modal'

const MibananaTeam = ({ reduxState, reduxActions }) => {
    const allStates = useMibananaTeam(reduxState, reduxActions)
    const onlineUsers = reduxState.onlineUser
    const {
        loading,
        handleSingleChat,
        user_avatar,
        username,
        open,
        singleChat,
        anchorEl,
        user_id,
        closeChat,
        handleFilterChange,
        handleClick,
        handleClose,
        isReload,
        clearFilter,

        respMessage,
        errorSB,
        setReload,
        resetUnreadMessages,
        handleOpenForm,
        handleCloseForm,
        currentUser,

        setErrorSB,
        setSuccessSB,
        successSB,
        openErrorSB,
        openSuccessSB,
        setRespMessage,

        filter,
        role,
    } = allStates

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
            <CreateGroupForm
                open={open}
                onClose={handleCloseForm}
                openErrorSB={openErrorSB}
                openSuccessSB={openSuccessSB}
                setRespMessage={setRespMessage}
                setReload={setReload}
            />
            <TransitionsModal
                message={respMessage}
                openModal={successSB}
                setOpenModal={setSuccessSB}
            />
            <TransitionsErrorModal
                message={respMessage}
                openModal={errorSB}
                setOpenModal={setErrorSB}
            />

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
                            <Box display={"flex"} justifyContent={"space-between"}>
                                <TitleContainer role={role} handleOpenForm={handleOpenForm} currentUser={currentUser} />
                            </Box>
                            <FormControl variant="outlined" fullWidth margin="normal">
                                <InputLabel>Filter by Role</InputLabel>
                                <Select
                                    value={filter}
                                    onChange={handleFilterChange}
                                    label="Filter by Role"
                                    sx={{ minHeight: '3rem', display: 'flex', alignItems: 'center' }} 
                                    endAdornment={
                                        filter && (
                                            <IconButton
                                                aria-label="clear"
                                                onClick={clearFilter}
                                                edge="end"
                                                sx={{ padding: '0.5rem' }}
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        )
                                    }>
                                    <MenuItem value=""><em>All</em></MenuItem>
                                    <MenuItem value="Mobile-App-Developer">Mobile Developer</MenuItem>
                                    <MenuItem value="Graphic-Designer">Graphic Designer</MenuItem>
                                    <MenuItem value="Copy-Writer">Copy Writer</MenuItem>
                                    <MenuItem value="Web-Developer">Web Developer</MenuItem>
                                    <MenuItem value="Social-Media-Manager">Social Media Manager</MenuItem>
                                </Select>
                            </FormControl>
                            <List>
                                <FitlerTeamMembers
                                    allStates={allStates}
                                    onlineUsers={onlineUsers}
                                    onlineWidth={onlineWidth}
                                    filter={filter}
                                />
                            </List>
                        </Box>
                        {singleChat === null ? null : singleChat?.type === 'group' ? (
                            <GroupChat
                                reduxActions={reduxActions}
                                reduxState={reduxState}
                                closeChat={closeChat}
                                handleClose={handleClose}
                                handleClick={handleClick}
                                boxStyles={boxStyles}
                                anchorEl={anchorEl}
                                userId={user_id}
                                username={username}
                                user_avatar={user_avatar}
                                item={singleChat}
                                setReload={setReload}
                                isReload={isReload}

                            />
                        ) : (
                            <PrivateChat
                                reduxActions={reduxActions}
                                reduxState={reduxState}
                                closeChat={closeChat}
                                boxStyles={boxStyles}
                                userId={user_id}
                                username={username}
                                user_avatar={user_avatar}
                                item={singleChat}
                            />

                        )}
                    </Box>
                )}

            </Grid>
        </DashboardLayout >
    )
}

export default reduxContainer(MibananaTeam)
