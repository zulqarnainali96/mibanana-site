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
import { mobileAppSchema } from 'Schema/Index';
import TransitionsModal from 'components/Modal/Modal';


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
    project_title: '',
    platform: '',
    project_details: "",
    name: name,
    user: user,
};

const MobileAppDevForm = (props) => {
    const { open, handleClose } = props;
const [openModal, setOpenModal] = useState(false)

    const {
        values,
        errors,
        handleBlur,
        handleSubmit,
        handleChange,
        touched
    } = useFormik({
        initialValues: initialValues,
        // validationSchema: mobileAppSchema,
        onSubmit: (values) => {
            setOpenModal(true);
            console.log(values)
        }
    })


    return (
        <BootstrapDialog open={open} sx={{ width: '100% !important' }} >
            <DialogTitle display={"flex"} position={"relative"} width={'100%'} justifyContent={"space-between"} alignItems={"center"} >
                <MDTypography sx={({ palette: { light } }) => (
                    {
                        backgroundColor: light.cream,
                        border: `1px solid ${light.cream}`
                    }
                )}>
                    Mobile App Development Form
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

                        { /*platform*/}
                        <Grid item xs={12}>
                            <MDTypography variant={"h6"} pb={1} className="">
                                Platform
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Select
                                        id="app_platform"
                                        name="app_platform"
                                        onBlur={handleBlur}
                                        value={values.platform}
                                        error={touched.platform && Boolean(errors.platform)}
                                        onChange={handleChange}
                                        fullWidth
                                        displayEmpty
                                    >
                                        <MenuItem value="" selected disabled>Select Service Type</MenuItem>
                                        <MenuItem value="web content">Website Content</MenuItem>
                                        <MenuItem value="blog post">Blog Posts</MenuItem>
                                        <MenuItem value="social media copy">Social Media Copy</MenuItem>
                                        <MenuItem value="product description">Product Descriptions</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
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
                                multiline
                                rows={4}
                                maxRows={8}
                                style={{ width: '100%' }}
                                value={values.project_details}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                touched={touched.project_details}
                                errors={errors.project_details}
                                className={touched.project_details && Boolean(errors.project_details) ? 'border-color-red' : ''}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <MDButton type="submit" style={{ width: '100%', backgroundColor: "#FBDD34", color: "#000", fontWeight: "600" }}>Submit</MDButton>
                        </Grid>
                        
                        <TransitionsModal message="hello there!" openModal={openModal} setOpenModal=
                        {setOpenModal}  />
                    </Grid>
                </form>
            </DialogContent>

        </BootstrapDialog>
    )
}

export default MobileAppDevForm
