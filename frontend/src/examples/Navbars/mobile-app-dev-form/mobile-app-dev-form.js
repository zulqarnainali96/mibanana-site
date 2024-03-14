import React from 'react'
import { styled } from "@mui/material/styles";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import CloseOutlined from '@mui/icons-material/CloseOutlined';


const BootstrapDialog = styled(Dialog)(({ theme: { breakpoints, spacing } }) => ({
    '& .MuiPaper-root': {
        maxWidth: '70% !important',
        [breakpoints.down('lg')]: {
            width: '95%'
        },
    },
    '& .MuiInputBase-root': {
        paddingBlock: '15px'
    },
    '& .MuiDialogContent-root': {
        padding: spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: spacing(1),
        width: "100%"
    },
}));

const MobileAppDevForm = (props) => {
    const { open, handleClose } = props

    return (
        <BootstrapDialog open={open} sx={{ width: '100% !important' }} >
            <DialogTitle display={"flex"} position={"relative"} width={'100%'} justifyContent={"space-between"} alignItems={"center"} >
                <MDTypography sx={({ palette: { light } }) => (
                    {
                        backgroundColor: light.cream,
                        border: `1px solid ${light.cream}`
                    }
                )}>
                    Create Mobile
                </MDTypography>
                <MDButton
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 4, padding: '1.4rem !important' }}
                >
                    <CloseOutlined sx={
                        {
                            fill: '#444'
                        }} />
                </MDButton>
            </DialogTitle>

        </BootstrapDialog>
    )
}

export default MobileAppDevForm
