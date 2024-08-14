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
import ReactQuill from "react-quill";
import { modules } from 'assets/react-quill-settings/react-quill-settings';
import { formats } from 'assets/react-quill-settings/react-quill-settings';
import { reactQuillStyles } from 'assets/react-quill-settings/react-quill-settings';

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

const initialValues = {
    project_title: '',
    copy_writing_service: '',
    word_count: "",
    project_description: "",
    otherServiceType: "",
    otherWordCount: "",
};
const CopyWritingForm = ({
    open, 
    handleClose, 
    reduxState, 
    reduxActions, 
    setRespMessage, 
    openErrorSB, 
    openSuccessSB, 
    loading, 
    setLoading, 
    socketIO,
    role
}) => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const fileInputRef = useRef(null);
    const classes = reactQuillStyles()
    const quilRef = useRef();

    const customerUploadFiles = async (filType, project_id) => {
        const formdata = new FormData();
        for (let i = 0; i < filType.length; i++) {
            formdata.append("files", filType[i]);
        }
        formdata.append("user_id", reduxState?.userDetails.id);
        formdata.append("project_id", project_id);
        await apiClient.post("/api/file/upload-files", formdata)
            .then(() => { 
                setUploadedImages([]);
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                    return
                } else {
                    setRespMessage(err.message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                }
            })
    };

    const handleCopywritingFormSubmit = async (values, { resetForm }) => {
        setLoading(true);
        const dataToSend = {
            ...values,
            user: reduxState.userDetails?.id,
            name: reduxState.userDetails?.name,
        };
        try {
            const { data } = await apiClient.post('/api/create-copywriting-project', dataToSend);
            setLoading(false);
            if (data.message) {
                if (uploadedImages.length > 0) {
                    customerUploadFiles(uploadedImages, data.copyWriting._id)
                }
                handleClose();
                setRespMessage(data.message);
                resetForm(clearForm());
                const socketMsg = {
                    ...dataToSend,
                    project_id: data.copyWriting._id
                }
                setTimeout(() => {
                    reduxActions.handleGetAllProjects(!reduxState.project_call)
                    if(!role?.admin || !role?.projectManager){
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
        onSubmit: handleCopywritingFormSubmit
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
