import React, { useState } from 'react'
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
import check from '../../../assets/images/check.png'


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


const userDetailsString = localStorage.getItem('user_details');
const name = userDetailsString ? JSON.parse(userDetailsString).name : '';
const user = userDetailsString ? JSON.parse(userDetailsString).id : "";

const initialValues = {
    user: user,
    name: name,
    project_title: '',
    website_type: '',
    preferred_stack: "",
    project_details: "",
};

const WebsiteForm = (props) => {
    const { open, handleClose } = props;
    const [openModal, setOpenModal] = useState(false);

    const {
        values,
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
    } = useFormik({
        initialValues: initialValues,
        validationSchema: webDevelopmentSchema,
        onSubmit: async (values, { resetForm }) => {
            const dataToSend = {
                ...values,
                user: user,
                name: name,
            };
            try {
                const response = await axios.post('http://localhost:8000/api/create-website-project', dataToSend);
                // console.log(dataToSend)
                // handleClose();
                resetForm(clearForm());
                setOpenModal(true)
                setTimeout(() => {
                    handleClose();
                }, 5000);
            } catch (error) {
                console.error('Error:', error);
            }
            function clearForm() {
                var projectTitle = document.getElementById('project_title');
                projectTitle.value = "";
                var projectDetail = document.getElementById('project_details');
                projectDetail.value = "";
            }

            // Optionally, reset the form after submission
            resetForm(clearForm());
        },
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
                            <TextField
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
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <MDButton type="submit" style={{ width: '100%', backgroundColor: "#FBDD34", color: "#000", fontWeight: "600" }}>Submit</MDButton>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <TransitionsModal message="Project created successfully!" check={check} openModal={openModal} setOpenModal=
                {setOpenModal} />
        </BootstrapDialog>
    )
}

export default WebsiteForm
