import React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { toggleDrawer } from 'redux/global/global-functions';
import styled from '@mui/material/styles/styled'
import { ArrowBack, Chat } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setRightSideBar } from 'redux/actions/actions';

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
                    <Button size='small' sx={{ border: '1px solid #444', padding: '10px 14px' }} onClick={toggleDrawer(anchor, true, setState, rightSideDrawer)}>
                        Chat &nbsp;
                        <ArrowBack sx={{ color: '#7b809a' }} fontSize='large' />
                    </Button>
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