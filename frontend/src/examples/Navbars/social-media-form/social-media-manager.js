import React from 'react'
import { styled } from "@mui/material/styles";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import Grid from '@mui/material/Grid';
import "./style.css"
import { Checkbox, FormControlLabel } from '@mui/material';
import useSocialMediaManager from './useSocialMediaManager';

const BootstrapDialog = styled(Dialog)(({ theme: { breakpoints, spacing } }) => ({
    '& .MuiPaper-root': {
        maxWidth: '100% !important',
        width: '45%',
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

const SocialMediaManager = (props) => {
    const { open, } = props
    const {
        handleModalClose,
        handleSelectPlan,
        handleChoosePlatform,
        handleContent,
        selectService,
        choosePlatform,
        selectPlan,
        
    } = useSocialMediaManager(props)

    return (
        <BootstrapDialog open={open} sx={{ width: '100% !important' }} >
            <DialogTitle display={"flex"} position={"relative"} width={'100%'} justifyContent={"space-between"} alignItems={"center"} borderBottom={`1px solid #ccc !important`}>
                <MDTypography className="fontsStyle">Create Social Media Form</MDTypography>
                <MDButton
                    onClick={handleModalClose}
                    sx={{ position: "absolute", right: 4, padding: '1.4rem !important' }}>
                    <CloseOutlined sx={{ fill: '#444' }} />
                </MDButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} className='grid-social-container'>
                    <Grid item xs={4} className='grid-social-item-1'>
                        <MDTypography variant={"h6"} pb={1} className="social-head-title">Select Service Type</MDTypography>
                        <Grid container>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={selectService.contentCreation} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleContent('contentCreation')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Content Creation</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={selectService.postingSchedule} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleContent('postingSchedule')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Posting Schedule</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={selectService.engagementStrategy} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleContent('engagementStrategy')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Engagement Strategy</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={selectService.otherServiceType} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleContent('otherServiceType')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Other Service type</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} className='grid-social-item-1'>
                        <MDTypography variant={"h6"} pb={1} className="social-head-title">Chosse Platforms</MDTypography>
                        <Grid container>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={choosePlatform.All} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleChoosePlatform('All')}
                                />
                                <MDTypography variant={"h6"} className="social-head">All</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={choosePlatform.facebook} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleChoosePlatform('facebook')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Facebook</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={choosePlatform.twitter} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleChoosePlatform('twitter')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Twitter</MDTypography>
                            </Grid>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={choosePlatform.linkedin} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleChoosePlatform('linkedin')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Linkedin</MDTypography>
                            </Grid>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={choosePlatform.otherMediaPlatform} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleChoosePlatform('otherMediaPlatform')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Other Social Media Platforms</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} className='grid-social-item-1'>
                        <MDTypography variant={"h6"} pb={1} className="social-head-title">Select Plan</MDTypography>
                        <Grid container>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={selectPlan.weekly} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleSelectPlan('weekly')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Weekly Plan</MDTypography>
                            </Grid>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={selectPlan.monthly} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleSelectPlan('monthly')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Monthly Plan</MDTypography>
                            </Grid>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={selectPlan.quarter} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleSelectPlan('quarter')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Quarter Plan</MDTypography>
                            </Grid>
                            <Grid item xs={8} className='grid-social-item-1-inside'>
                                <FormControlLabel
                                    sx={{ mr: 0, ml: 0 }}
                                    control={<Checkbox checked={selectPlan.otherPlan} sx={{ width: 30, height: 30 }} />}
                                    onChange={handleSelectPlan('otherPlan')}
                                />
                                <MDTypography variant={"h6"} className="social-head">Other Plan Options</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </BootstrapDialog>
    )
}

export default SocialMediaManager
