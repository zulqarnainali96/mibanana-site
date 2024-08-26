import React, { useRef } from 'react';
import { styled } from "@mui/material/styles";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { Autocomplete, Grid, MenuItem, Select, TextField } from '@mui/material';
import Input from 'components/Input/Input';
import { useFormik } from 'formik';
import { mobileAppSchema } from 'Schema';
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


const initialValues = {
    project_title: '',
    platform: '',
    project_description: "",
    brand: {}
};

const MobileAppDevForm = ({
    open, handleClose, reduxState, reduxActions, brandOption, setRespMessage, openErrorSB, role, openSuccessSB, loading, setLoading, socketIO
}) => {
    const classes = reactQuillStyles()
    const quilRef = useRef();

    const handleMobileFormSubmit = async (values, { resetForm }) => {
        console.log("values", values)
        setLoading(true);
        const dataToSend = {
            ...values,
            user: reduxState.userDetails?.id,
            name: reduxState.userDetails?.name,
            role : reduxState?.userDetails?.roles[0] ?? '',
            project_category : 'mobile-app-development',
        };
        try {
            const { data } = await apiClient.post('/api/create-mobile-app-project', dataToSend);
            setLoading(false);
            if (data.message) {
                handleClose();
                setRespMessage(data.message);
                resetForm(clearForm());
                const socketMsg = {
                    ...dataToSend,
                    project_id: data.mobileAppProject._id,
                    role : reduxState?.userDetails?.roles[0] ?? '',
                    project_category : 'mobile-app-development',
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
            document.getElementById('project_title').value = "";
            quilRef.current.getEditor().setText('');
        }

        resetForm(clearForm());
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: mobileAppSchema,
        onSubmit: handleMobileFormSubmit,
    });


    const onClose = () => {
        handleClose();
        setLoading(false);
    };

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
                <form onSubmit={formik.handleSubmit}>
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
                                value={formik.values.project_title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                touched={formik.touched.project_title}
                                errors={formik.errors.project_title}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MDTypography variant={"h6"} pb={1} className="">
                                Brand
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        name="brand"
                                        value={formik.values.brand}
                                        onChange={(event, newValue) => formik.setFieldValue("brand", newValue)}
                                        id="brand"
                                        getOptionLabel={option => option.brand_name ? option.brand_name : ''}
                                        options={brandOption}
                                        sx={{ width: '100%' }}
                                        renderInput={(params) => <TextField {...params} label="Select Brand" />} />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <MDTypography variant={"h6"} pb={1} className="">
                                Platform
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Select
                                        id="platform"
                                        name="platform"
                                        onBlur={formik.handleBlur}
                                        value={formik.values.platform}
                                        error={formik.touched.platform && Boolean(formik.errors.platform)}
                                        onChange={formik.handleChange}
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

                        <Grid item xs={12}>
                            <MDTypography variant="h6" pb={1} className="">
                                Project Description
                            </MDTypography>
                            <ReactQuill
                                theme="snow"
                                name="project_description"
                                id='project_description'
                                value={formik.values.project_description}
                                onChange={(value) => formik.setFieldValue('project_description', value)}
                                onBlur={() => formik.handleBlur({
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
                                endIcon={<MoonLoader loading={loading} size={18} color='#fff' />}
                            >
                                Submit
                            </MDButton>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </BootstrapDialog>
    );
};

export const submitButtonStyle = { width: '100%', backgroundColor: "#FBDD34", color: "#000", fontWeight: "600" };

export default MobileAppDevForm;
