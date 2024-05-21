import React, { useRef, useState } from 'react';
import { styled } from "@mui/material/styles";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DialogContent from '@mui/material/DialogContent';
import { Grid, MenuItem, Select } from '@mui/material';
import Input from 'components/Input/Input';
import { copyWritingSchema } from '../../../Schema/Index';
import { useFormik } from 'formik';
import apiClient from 'api/apiClient';
import { MoonLoader } from 'react-spinners';
import { submitButtonStyle } from '../mobile-app-dev-form/mobile-app-dev-form';

const BootstrapDialog = styled(Dialog)(({ theme: { breakpoints } }) => ({
    '& .MuiPaper-root': {
        maxWidth: '60% !important',
        width: "100% !important",
        [breakpoints.down('lg')]: {
            width: '95%'
        },
    },
    '& .MuiInputBase-root': {
        paddingBlock: '15px'
    },
    '& .MuiDialogContent-root': {
        padding: '16px',
    },
    '& .MuiDialogActions-root': {
        padding: '8px',
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
    copy_writing_service: '',
    word_count: "",
    project_description: "",
    otherServiceType: "",
    otherWordCount: "",
};

const CopyWritingForm = (props) => {
    const { open, handleClose, reduxState, setRespMessage, openErrorSB, openSuccessSB, loading, setLoading } = props;
    const [uploadedImages, setUploadedImages] = useState([]);
    const fileInputRef = useRef(null);


    const uploadCopyWriteFile = async () => {

    }

    const handleCopywritingFormSubmit = async (values, { resetForm }) => {
        console.log(values)
        if (uploadedImages.length === 8) {
            alert("Maximum 7 file allowed");
            return;
        }
        setLoading(true);
        const formData = {
            ...values,
            user: user,
            name: name,
        };
        console.log(formData)
        console.log(uploadedImages)
        await apiClient.post("api/create-copywriting-project", formData)
            .then(({ data }) => {
                console.log(data)
                setLoading(false);

                // if (resp.status === 201) {
                //     const projectData = {
                //         ...formData,
                //         user: reduxState.userDetails?.id,
                //         project_id: resp.data?.project._id,
                //     };
                //     socketIO.current.emit('new-project', projectData)
                //     // setRespMessage("Project Created Successfully");
                //     reduxActions.getNew_Brand(!reduxState.new_brand);
                //     let param = [
                //         reduxState.userDetails?.id,
                //         reduxState.userDetails?.name,
                //         resp.data?.project._id,
                //         resp.data?.project.project_title,
                //     ];
                //     if (uploadedImages.length > 0 ) {
                //         uploadCopyWriteFile(...param);
                //     }
                //     // getProjectData(reduxState.userDetails?.id, reduxActions.getCustomerProject);
                //     setOpen(false);
                //     setTimeout(() => {
                //         // openSuccessSB()
                //         setLoading(false);
                //         setRespMessage()
                //         setOpenModal(true);
                //         setRespMessage("Project created successfully!")
                //     }, 300);
                // }
                // setLoading(false);
                // setReloadProjects(true)
            })
            .catch((error) => {
                // setLoading(false);
                // setRespMessage(error.message);
                // setTimeout(() => {
                //     openErrorSB();
                // }, 1000);
                console.log(error.message)
            });



        // setLoading(true)
        // const dataToSend = {
        //     ...values,
        //     user: user,
        //     name: name,
        // };
        // console.log(dataToSend)
        // try {
        //     const { data } = await apiClient.post('/api/create-copywriting-project', dataToSend)
        //     setLoading(false)
        //     if (data.message) {
        //         console.log(data)
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
        //     console.error('Copy form error:', error);
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
        setFieldValue
    } = useFormik({
        initialValues: initialValues,
        validationSchema: copyWritingSchema,
        onSubmit: (values) => {
            console.log('values')
        },
        // onSubmit: handleCopywritingFormSubmit(),
        //async (values, { resetForm }) => {
        //     const dataToSend = {
        //         ...values,
        //         user: user,
        //         name: name,
        //     };
        //     try {
        //         const response = await axios.post('http://localhost:8000/api/create-copywriting-project', dataToSend);
        //         // handleClose();
        //         resetForm(clearForm());
        //         setOpenModal(true)
        //         setTimeout(() => {
        //             handleClose();
        //         }, 5000);
        //     } catch (error) {
        //         console.error('Error:', error);
        //     }
        //     function clearForm() {
        //         var projectTitle = document.getElementById('project_title');
        //         projectTitle.value = "";
        //         var projectDetail = document.getElementById('project_description');
        //         projectDetail.value = "";
        //     }

        //     // Optionally, reset the form after submission
        //     resetForm(clearForm());
        // },
    });

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const uploadedImagesArray = [...uploadedImages];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadedImagesArray.push(file);
        }
        setUploadedImages(uploadedImagesArray);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileInputChange = (e) => {
        const files = e.target.files;
        handleFiles(files);
    };

    const removeImage = (indexToRemove) => {
        const filteredImages = uploadedImages.filter((image, index) => index !== indexToRemove);
        setUploadedImages(filteredImages);
    };

    const customChangeService = (e) => {
        handleChange(e)
        if (handleChange(e) !== "other") {
            setFieldValue("otherServiceType", "");
            var serviceType = document.getElementById("otherServiceType");
            serviceType.value = "";
        }
    }
    const customChangeCount = (e) => {
        handleChange(e)
        if (handleChange(e) !== "other") {
            setFieldValue("otherWordCount", "");
            var wordCount = document.getElementById("otherWordCount");
            wordCount.value = "";
        }
    }


    return (
        <BootstrapDialog open={open}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <MDTypography>
                    Copywriting Request Form
                </MDTypography>
                <MDButton onClick={handleClose} sx={{ position: "absolute", right: 4 }}>
                    <CloseOutlined />
                </MDButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <MDTypography variant="h6" pb={1} className="copywriting-title">
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
                        <Grid item xs={6}>
                            <MDTypography variant={"h6"} pb={1} className="copywriting-title">
                                Select Copywriting Service Type
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Select
                                        id="copy_writing_service"
                                        name="copy_writing_service"
                                        value={values.copy_writing_service}
                                        onChange={customChangeService}
                                        onBlur={handleBlur}
                                        error={touched.copy_writing_service && Boolean(errors.copy_writing_service)}
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

                        <Grid item xs={6}>
                            <MDTypography variant={"h6"} pb={1} className="copywriting-title">
                                Others
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Input
                                        type="text"
                                        id="otherServiceType"
                                        name="otherServiceType"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        touched={touched.otherServiceType}
                                        value={values.otherServiceType}
                                        placeholder="Specify other service type"
                                        disabled={values.copy_writing_service !== "other"} />

                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={6}>
                            <MDTypography variant={"h6"} pb={1} className="copywriting-title">
                                Word Count
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Select
                                        id="word_count"
                                        name="word_count"
                                        value={values.word_count}
                                        onChange={customChangeCount}
                                        onBlur={handleBlur}
                                        error={touched.word_count && Boolean(errors.word_count)}
                                        displayEmpty
                                        fullWidth
                                    >
                                        <MenuItem value="" disabled>Select Word Count</MenuItem>
                                        <MenuItem value="499">Less than 500 words</MenuItem>
                                        <MenuItem value="500-1000">500-1000 words</MenuItem>
                                        <MenuItem value="1000-2000">1000-2000 words</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={6}>
                            <MDTypography variant={"h6"} pb={1} className="copywriting-title">
                                Others
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Input
                                        type="number"
                                        id="otherWordCount"
                                        name="otherWordCount"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        touched={touched.otherWordCount}
                                        value={values.otherWordCount}
                                        placeholder="Specify number of words"
                                        disabled={values.word_count !== "other"} />

                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <MDTypography variant={"h6"} pb={1} className="copywriting-title">
                                Project Details
                            </MDTypography>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Input
                                        placeholder="Enter your project details"
                                        id="project_description"
                                        name="project_description"
                                        type="text"
                                        value={values.project_description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        touched={touched.project_description}
                                        errors={errors.project_description}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* Add Drag and Drop area */}
                        <Grid item xs={12}>
                            <label htmlFor="fileInput" style={{ display: 'block', cursor: 'pointer' }}>
                                <div
                                    style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <p>Drag & Drop Images Here</p>
                                </div>
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileInputChange}
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                            />
                            {/* Display uploaded images */}
                            {uploadedImages.map((image, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                    <img src={URL.createObjectURL(image)} alt={`uploaded-${index}`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '10px', width: "150px", height: "150px", objectFit: "cover" }} />
                                    <button
                                        onClick={() => removeImage(index)}
                                        style={{ position: 'absolute', top: 10, right: 10, padding: '4px', background: '#000', border: 'none', cursor: 'pointer' }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </Grid>
                        <button type='submit'>
                            Submit
                        </button>
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
                {/*<FormControl>
                    <InputLabel htmlFor="my-input">Email address</InputLabel>
                    <Input id="my-input"  />
        </FormControl>*/}
            </DialogContent>
        </BootstrapDialog>
    )
}

export default CopyWritingForm
