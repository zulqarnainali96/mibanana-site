import React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { toggleDrawer } from 'redux/global/global-functions';
import styled from '@mui/material/styles/styled'
import { ArrowBack, Chat } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setRightSideBar } from 'redux/actions/actions';
import { chatIcon } from 'assets/new-images/navbars/chats-icon';

const RightSideDrawer = ({ list }) => {
    const rightSideDrawer = useSelector(state => state.rightSideDrawer)
    const dispatch = useDispatch()
    const setState = (payload) => dispatch(setRightSideBar(payload))

    const sx = {
        "& .MuiPaper-root": {
            margin: '0px',
            borderRadius: '0px !important',
            height: '100% !important',
            width: '300px',
        }
    }
    return (
        <div style={styles}>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <span onClick={toggleDrawer(anchor, true, setState, rightSideDrawer)}>
                        {chatIcon}
                    </span>
                    <Drawer
                        sx={sx}
                        anchor={anchor}
                        open={rightSideDrawer[anchor]}
                        onClose={toggleDrawer(anchor, false, setState, rightSideDrawer)}

                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    )
}
export default RightSideDrawer

const styles = {
    transition: 'all .5s ease-in',
}