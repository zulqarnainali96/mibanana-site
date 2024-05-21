import React, { useEffect, useRef } from 'react'
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
import { mobileAppSchema } from 'Schema/Index';
import apiClient from 'api/apiClient';
import ReactQuill from "react-quill";
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

const userDetailsString = localStorage.getItem('user_details');
const name = userDetailsString ? JSON.parse(userDetailsString).name : '';
const user = userDetailsString ? JSON.parse(userDetailsString).id : "";

const initialValues = {
    user: user,
    name: name,
    project_title: '',
    platform: '',
    project_description: "",
};


const MobileAppDevForm = (props) => {
    const { open, handleClose, setRespMessage, openErrorSB, openSuccessSB, loading, setLoading } = props;
    const classes = reactQuillStyles()

    const handleMobileFormSubmit = async (values, { resetForm }) => {
        setLoading(true)
        const dataToSend = {
            ...values,
            user: user,
            name: name,
        };
        console.log(dataToSend)
        // try {
        //     const { data } = await apiClient.post('/api/create-mobile-app-project', dataToSend)
        //     setLoading(false)
        //     if (data.message) {
        //         handleClose();
        //         setRespMessage(data.message)
        //         resetForm(clearForm());
        //         setTimeout(() => {
        //             openSuccessSB();
        //         }, 500);
        //     }
        // } catch (error) {
        //     setLoading(false)
        //     setRespMessage(error.message)
        //     setTimeout(() => {
        //         openErrorSB();
        //     }, 500);
        //     console.error('Mobile form error:', error);
        // }

        function clearForm() {
            var projectTitle = document.getElementById('project_title');
            projectTitle.value = "";
            var projectDescription = document.getElementById('project_description');
            projectDescription.value = "";
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
        touched,
    } = useFormik({
        initialValues: initialValues,
        validationSchema: mobileAppSchema,
        onSubmit: values => {
            console.log(values)
        },
    });
    const quilRef = useRef()
    // const handleMobileAppDevFormSubmit = async (values, { resetForm }) => {
    //     const dataToSend = {
    //         ...values,
    //         user: user,
    //         name: name,
    //     };
    //     try {
    //         const { data } = await apiClient.post('/api/create-mobile-app-project', dataToSend)
    //         if (data.message) {
    //             handleClose();
    //             setRespMessage(data.message)
    //             resetForm(clearForm());
    //             setTimeout(() => {
    //                 openSuccessSB();
    //                 // setOpenModal(true)
    //             }, 500);
    //         }
    //     } catch (error) {
    //         setRespMessage(error.message)
    //         setTimeout(() => {
    //             openErrorSB();
    //         }, 500);
    //         console.error('Mobile form error:', error);
    //     }

    //     function clearForm() {
    //         var projectTitle = document.getElementById('project_title');
    //         projectTitle.value = "";
    //         var projectDescription = document.getElementById('project_description');
    //         projectDescription.value = "";
    //     }

    //     // Optionally, reset the form after submission
    //     resetForm(clearForm());
    // }

    const onClose = () => {
        handleClose()
        setLoading(false)
    }

    const quilName = () => {
        console.log(quilRef.current.props.name)
    }

    return (
        <BootstrapDialog open={open} sx={{ width: '100% !important' }} >
            <DialogTitle display={"flex"} position={"relative"} width={'100%'} justifyContent={"space-between"} alignItems={"center"} >
                <MDTypography>
                    Mobile App Development Form
                </MDTypography>
                <MDButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 4, padding: '1.4rem !important' }}
                >
                    <CloseOutlined sx={{
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

                        { /*platform*/}
                        <Grid item xs={12}>
                            <MDTypography variant={"h6"} pb={1} className="">
                                Platform
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Select
                                        id="platform"
                                        name="platform"
                                        onBlur={handleBlur}
                                        value={values.platform}
                                        error={touched.platform && Boolean(errors.platform)}
                                        onChange={handleChange}
                                        fullWidth
                                        displayEmpty
                                    >
                                        <MenuItem value="" selected disabled>Select Service Type</MenuItem>
                                        <MenuItem value="android">Android App Development</MenuItem>
                                        <MenuItem value="ios">IOS App Development</MenuItem>
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
                                id="project_description"
                                name="project_description"
                                type="text"
                                multiline
                                rows={4}
                                style={{ width: '100%' }}
                                value={values.project_description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                touched={touched.project_description}
                                error={touched.project_description && Boolean(errors.project_)}
                            /> */}
                            <ReactQuill
                                theme="snow"
                                name="project_description"
                                id='project_description'
                                value={values.project_description}
                                onChange={handleChange}
                                modules={modules}
                                formats={formats}
                                className={classes.quill}
                                ref={quilRef}
                            />
                        </Grid>
                        <button onClick={quilName}>Access</button>
                        <Grid item xs={12}>
                            <MDButton
                                type="submit"
                                style={submitButtonStyle}
                                disabled={loading}
                                endIcon={<MoonLoader loading={loading} size={18} color='#fff' />}
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

export const submitButtonStyle = { width: '100%', backgroundColor: "#FBDD34", color: "#000", fontWeight: "600" }

export default MobileAppDevForm
