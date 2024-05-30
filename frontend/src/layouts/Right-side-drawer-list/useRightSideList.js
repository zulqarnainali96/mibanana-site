import List from '@mui/material/List';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import React from 'react';
import MDTypography from 'components/MDTypography';
import { setCurrentIndex } from 'redux/actions/actions';
import { useDispatch } from 'react-redux';
import { reRenderChatComponent } from 'redux/actions/actions';
import { East } from '@mui/icons-material';
import { setRightSideBar } from 'redux/actions/actions';
import { toggleDrawer } from 'redux/global/global-functions';
import { fontsFamily } from 'assets/font-family';
import { mibananaColor } from 'assets/new-images/colors';
import ProjectNotification from './project-notification';


const projectBoxStyles = {
    paddingInlineStart: '5px',
}

export default () => {
    const dispatch = useDispatch()
    const setState = (payload) => dispatch(setRightSideBar(payload))
    const rightSideDrawer = useSelector(state => state.rightSideDrawer)

    const project_notifications = useSelector(state => state.project_notifications)

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : "100%", marginTop: '3rem' }}
            role="presentation"
        >
            <East fontSize='medium' sx={{ position: 'absolute', top: 10, left: 10, cursor: 'pointer', }} onClick={toggleDrawer("right", false, setState, rightSideDrawer)} />

            <List sx={projectBoxStyles}>
                <MDTypography variant="h5" pt={1} pb={1} textAlign="left" sx={{ fontFamily: fontsFamily.poppins, fontWeight: 'bold', color: mibananaColor.yellowTextColor }}>&nbsp;&nbsp;Projects chats</MDTypography>
                <ProjectNotification project_notifications={project_notifications} />
            </List>
        </Box>
    );
    return {
        list: list
    }
}
