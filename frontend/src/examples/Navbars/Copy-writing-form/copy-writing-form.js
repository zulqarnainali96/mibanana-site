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
import axios from 'axios';
import TransitionsModal from 'components/Modal/Modal';
import check from '../../../assets/images/check.png'

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
    project_details: "",
    otherServiceType: "",
    otherWordCount: "",
};

const CopyWritingForm = (props) => {
    const { open, handleClose } = props;
    const [uploadedImages, setUploadedImages] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const fileInputRef = useRef(null);

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
        onSubmit: async (values, { resetForm }) => {
            const dataToSend = {
                ...values,
                user: user,
                name: name,
            };
            try {
                const response = await axios.post('http://localhost:8000/api/create-copywriting-project', dataToSend);
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
                                        id="project_details"
                                        name="project_details"
                                        type="text"
                                        value={values.project_details}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        touched={touched.project_details}
                                        errors={errors.project_details}
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


                        <Grid item xs={12}>
                            <MDButton type="submit" style={{ width: '100%', backgroundColor: "#FBDD34", color: "#000", fontWeight: "600" }}>Submit</MDButton>
                        </Grid>
                    </Grid>
                </form>
                {/*<FormControl>
                    <InputLabel htmlFor="my-input">Email address</InputLabel>
                    <Input id="my-input"  />
        </FormControl>*/}
            </DialogContent>
            <TransitionsModal message="Project created successfully!" check={check} openModal={openModal} setOpenModal=
                {setOpenModal} />
        </BootstrapDialog>
    )
}

export default CopyWritingForm
