import MDBox from 'components/MDBox'
import React from 'react'
import { Card, CardContent, CardMedia, Typography, IconButton, Box, Grid } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import avatarIcon from 'assets/mi-banana-icons/avatar-15.png'

const TeamMemberChat = ({ item, handleSingleChat }) => {
    const { name, roles, avatar } = item

    function checkAvatar() {
        if (avatar) {
            return avatar
        } else {
            return avatarIcon
        }
    }
    return (
        <Grid item xs={12} py={2} sm={12} md={6} lg={4} xl={4} xxl={3} position={'relative'}>
            {/* // <MDBox shadow={3} py={3} px={2} mx={2} mt={2} mb={2} variant="gradient" bgColor="light" borderRadius="lg"> */}
            <Card sx={{ maxWidth: 250, margin: 'auto' }}>
                <span style={activeStyle}>Active</span>
                <CardMedia
                    component="img"
                    image={checkAvatar()}
                    sx={{ objectFit: 'scale-down', width: '100%', height: '100px' }}
                    alt={name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontStyle={'italic'}>
                        role : {roles}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end">
                        <IconButton aria-label="chat" onClick={handleSingleChat}>
                            <ChatIcon />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>
            {/* // </MDBox> */}
        </Grid>
    )
}

const activeStyle = {
    position: 'absolute',
    top: '3px',
    right: '5px',
    color: 'yellow-green',
    borderRadius: '30px',
    color: 'yellowgreen',
    fontWeight: 500,
    fontFamily: 'Poppins',
}
const offlineStyle = {
    position: 'absolute',
    top: '3px',
    right: '5px',
    color: 'red',
    borderRadius: '30px',
    fontWeight: 500,
    fontFamily: 'Poppins',
}

export default TeamMemberChat
