import React, { useRef, useState } from 'react'
import { styled } from "@mui/material/styles";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { Grid, MenuItem, Select } from '@mui/material';
import Input from 'components/Input/Input';
import TransitionsModal from 'components/Modal/Modal';
import ReactQuill from "react-quill";
import { webAppSchema } from 'Schema/Index';
import { useFormik } from 'formik';
import apiClient from 'api/apiClient';
import { MoonLoader } from 'react-spinners';
import { modules } from 'assets/react-quill-settings/react-quill-settings';
import { formats } from 'assets/react-quill-settings/react-quill-settings';
import { reactQuillStyles } from 'assets/react-quill-settings/react-quill-settings';


const BootstrapDialog = styled(Dialog)(({ theme: { breakpoints, spacing } }) => ({
    '& .MuiPaper-root': {
        maxWidth: '60% !important',
        width: "100%",
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
    preferred_stack: "",
    backend_tech: "",
    project_description: "",
};

const WebAppDevForm = ({
    open, handleClose, setRespMessage, setLoading, loading, reduxState, reduxActions, openErrorSB, openSuccessSB, socketIO
}) => {
    const classes = reactQuillStyles()
    const quilRef = useRef();

    const handleWebFormSubmit = async (values, { resetForm }) => {
        const dataToSend = {
            ...values,
            user: reduxState.userDetails?.id,
            name: reduxState.userDetails?.name,
        };
        setLoading(true)
        try {
            const { data } = await apiClient.post('/api/create-web-app-project', dataToSend)
            if (data.message) {
                handleClose();
                setLoading(false)
                setRespMessage(data.message)
                resetForm(clearForm());
                const socketMsg = {
                    ...dataToSend,
                    project_id: data.webAppProject._id
                }
                setTimeout(() => {
                    reduxActions.handleGetAllProjects(!reduxState.project_call)
                    socketIO.current.emit('new-project', socketMsg)
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
            document.getElementById('project_title').value = "";
            quilRef.current.getEditor().setText('');
        }
        // Optionally, reset the form after submission
        resetForm(clearForm());
    }
    const {
        values,
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
        touched,
    } = useFormik({
        initialValues: initialValues,
        validationSchema: webAppSchema,
        onSubmit: handleWebFormSubmit,
    });

    return (
        <BootstrapDialog open={open} sx={{ width: '100% !important' }} >
            <DialogTitle display={"flex"} position={"relative"} width={'100%'} justifyContent={"space-between"} alignItems={"center"} >
                <MDTypography>
                    Web App Form
                </MDTypography>
                <MDButton
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 4, padding: '1.4rem !important' }}
                >
                    <CloseOutlined sx={{ fill: '#444' }} />
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
                                onBlur={handleBlur}
                                onChange={handleChange}
                                touched={touched.project_title}
                                errors={errors.project_title}
                            />
                        </Grid>
                        { /*website type*/}
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
                                        <MenuItem value="html_css">HTML CSS</MenuItem>
                                        <MenuItem value="react_js">React JS</MenuItem>
                                        <MenuItem value="vue_js">Vue JS</MenuItem>
                                        <MenuItem value="angular_js">Angular JS</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                        </Grid>

                        { /*preffered stack*/}
                        <Grid item xs={6}>
                            <MDTypography variant={"h6"} pb={1} className="">
                                Backend
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Select
                                        id="backend_tech"
                                        name="backend_tech"
                                        value={values.backend_tech}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.backend_tech && Boolean(errors.backend_tech)}
                                        fullWidth
                                        displayEmpty
                                    >
                                        <MenuItem value="" selected disabled>Select Service Type</MenuItem>
                                        <MenuItem value="php">Php</MenuItem>
                                        <MenuItem value="node">Node</MenuItem>
                                        <MenuItem value="python">Python</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                        </Grid>

                        {/*description*/}
                        <Grid item xs={12}>
                            <MDTypography variant="h6" pb={1} className="">
                                Project Description
                            </MDTypography>
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
                                endIcon={<MoonLoader size={22} loading={loading} color='#fff' />}
                            >
                                Submit
                            </MDButton>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </BootstrapDialog>
    )
}

const submitButtonStyle = { width: '100%', backgroundColor: "#FBDD34", color: "#000", fontWeight: "600" }


export default WebAppDevForm
