import React, { useRef, useState } from 'react'
import { styled } from "@mui/material/styles";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { Grid, MenuItem, Select, TextField } from '@mui/material';
import Input from 'components/Input/Input';
import { useFormik } from 'formik';
import axios from 'axios';
import { webDevelopmentSchema } from 'Schema/Index';
import TransitionsModal from 'components/Modal/Modal';
import apiClient from 'api/apiClient';
import { submitButtonStyle } from '../mobile-app-dev-form/mobile-app-dev-form';
import { MoonLoader } from 'react-spinners';
import ReactQuill from "react-quill";
import { modules } from 'assets/react-quill-settings/react-quill-settings';
import { formats } from 'assets/react-quill-settings/react-quill-settings';
import { reactQuillStyles } from 'assets/react-quill-settings/react-quill-settings';


const BootstrapDialog = styled(Dialog)(({ theme: { breakpoints, spacing } }) => ({
    '& .MuiPaper-root': {
        maxWidth: '60% !important',
        width: '100%',
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


const initialValues = {
    project_title: '',
    website_type: '',
    preferred_stack: "",
    project_description: "",
};

const WebsiteForm = ({
    open, role, handleClose, openSuccessSB, openErrorSB, reduxState, reduxActions, setLoading, loading, setRespMessage, socketIO
}) => {
    const classes = reactQuillStyles()
    const quilRef = useRef()

    const handleWebsiteForm = async (values, { resetForm }) => {
        setLoading(true)
        const dataToSend = {
            ...values,
            user: reduxState.userDetails?.id,
            name: reduxState.userDetails?.name,
            role: reduxState?.userDetails?.roles[0] ?? '',
            project_category: 'website-development',
        };
        try {
            const { data } = await apiClient.post('/api/create-website-project', dataToSend);
            setLoading(false);
            if (data.message) {
                handleClose();
                setRespMessage(data.message);
                resetForm(clearForm());
                const socketMsg = {
                    ...dataToSend,
                    project_id: data.websiteProject._id,
                    role: reduxState?.userDetails?.roles[0] ?? '',
                    project_category: 'website-development',
                }
                setTimeout(() => {
                    reduxActions.handleGetAllProjects(!reduxState.project_call)
                    if (!role?.admin || !role?.projectManager) {
                        socketIO.emit('new-project', socketMsg)
                    }
                    openSuccessSB();
                }, 500);
            }
        } catch (error) {
            if (error.response.data) {
                setRespMessage(error.response.data.message)
            } else {
                setRespMessage(error.message)
            }
            setLoading(false)
            setTimeout(() => {
                openErrorSB();
            }, 500);
        }
        function clearForm() {
            var projectTitle = document.getElementById('project_title');
            projectTitle.value = "";
            quilRef.current.getEditor().setText('');
        }
        // Optionally, reset the form after submission
        resetForm(clearForm());
    }
    const {
        values,
        errors,
        handleSubmit,
        setFieldValue,
        handleChange,
        handleBlur,
        touched,
    } = useFormik({
        initialValues: initialValues,
        validationSchema: webDevelopmentSchema,
        onSubmit: handleWebsiteForm,
    });

    return (
        <BootstrapDialog open={open} sx={{ width: '100% !important' }} >
            <DialogTitle display={"flex"} position={"relative"} width={'100%'} justifyContent={"space-between"} alignItems={"center"} >
                <MDTypography>
                    Website Development Form
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

            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <MDTypography variant="h6" pb={1} className="">
                                Project Title
                            </MDTypography>
                            <Input
                                placeholder="Enter your Project Title"
                                id="project_title"
                                name="project_title"
                                type="text"
                                value={values.project_title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                touched={touched.project_title}
                                errors={errors.project_title}
                            />
                        </Grid>

                        { /*website type*/}
                        <Grid item xs={6}>
                            <MDTypography variant={"h6"} pb={1} className="">
                                Website Type
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Select
                                        id="website_type"
                                        name="website_type"
                                        value={values.website_type}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.website_type && Boolean(errors.website_type)}
                                        fullWidth
                                        displayEmpty
                                    >
                                        <MenuItem value="" selected disabled>Select Service Type</MenuItem>
                                        <MenuItem value="e-commerce">E-commerce</MenuItem>
                                        <MenuItem value="portfolio">Portfolio</MenuItem>
                                        <MenuItem value="e-learning">E-Learning</MenuItem>
                                        <MenuItem value="landingPage">Landing Page</MenuItem>
                                    </Select>


                                </Grid>
                            </Grid>

                        </Grid>

                        { /*preffered stack*/}
                        <Grid item xs={6}>
                            <MDTypography variant={"h6"} pb={1} className="">
                                Preffered Stack
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Select
                                        id="preferred_stack"
                                        name="preferred_stack"
                                        value={values.preferred_stack}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.preferred_stack && Boolean(errors.preferred_stack)}
                                        fullWidth
                                        displayEmpty
                                    >
                                        <MenuItem value="" selected disabled>Select Service Type</MenuItem>
                                        <MenuItem value="wordpress">Wordpress</MenuItem>
                                        <MenuItem value="shopify">Shopify</MenuItem>
                                        <MenuItem value="react">React JS</MenuItem>
                                        <MenuItem value="vue">Vue JS</MenuItem>
                                        <MenuItem value="angular">Angular JS</MenuItem>
                                    </Select>


                                </Grid>
                            </Grid>

                        </Grid>

                        {/*description*/}
                        <Grid item xs={12}>
                            <MDTypography variant="h6" pb={1} className="">
                                Project Description
                            </MDTypography>
                            {/* <TextField
                                placeholder="Enter your Project Description"
                                id="project_details"
                                name="project_details"
                                type="text"
                                value={values.project_details}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.project_details && Boolean(errors.project_details)}
                                multiline
                                rows={4}
                                style={{ width: '100%' }}
                            /> */}
                            <ReactQuill
                                theme="snow"
                                name="project_description"
                                id='project_description'
                                value={values.project_description}
                                onChange={(value) => setFieldValue('project_description', value)}
                                onBlur={() => handleBlur({
                                    target: {
                                        name: 'project_description'
                                    }
                                })}
                                modules={modules}
                                formats={formats}
                                className={classes.quill}
                                ref={quilRef}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <MDButton
                                type="submit"
                                style={submitButtonStyle}
                                disabled={loading}
                                endIcon={<MoonLoader loading={loading} size={18} color='#fff' />}>
                                Submit
                            </MDButton>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </BootstrapDialog>
    )
}

export default WebsiteForm
