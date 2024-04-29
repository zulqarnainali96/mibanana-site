import { ArrowForward, CloseOutlined, FolderZip } from '@mui/icons-material';
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, TextField, Typography } from '@mui/material';
import styled from '@mui/material/styles/styled';
import apiClient from 'api/apiClient';
import { fontsFamily } from 'assets/font-family';
import { formats } from 'assets/react-quill-settings/react-quill-settings';
import { reactQuillStyles } from 'assets/react-quill-settings/react-quill-settings';
import { modules } from 'assets/react-quill-settings/react-quill-settings';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill';
import { MoonLoader } from 'react-spinners';
import CloseIcon from '@mui/icons-material/Close';
import { OtherFilesShow, deleteImageSvgIcon } from './new';
import AiLogo from 'assets/mi-banana-icons/ai-logo.png'
import Zipicon from 'assets/mi-banana-icons/zip-icon.png'
import psdFile from "assets/images/psdfile.svg";
import pdffile from "assets/images/pdffile.svg";
import { getProjectData } from 'redux/global/global-functions';


let aiLogo = "application/postscript"
let psdfile = "image/vnd.adobe.photoshop"
let zipfile = 'application/x-zip-compressed'
let pdf = "application/pdf"

const designType = [
    "App",
    "Banner",
    "Book Cover",
    "Brand Guidelines",
    "Business Card",
    "Moodboard",
    "Business Form",
    "eVook Cover",
    "Editing",
    "Email",
    "Social Media",
    "PDF",
    "Ads",
    "Icons",
    "Infographic",
    "Instagram",
    "Label",
    "Landing Page",
    "Logo",
    "Magazine",
    "Marketing Material",
    "Menu",
    "Mock up",
    "Postcard",
    "Poster",
    "Powerpoint",
    "Simple GIF",
    "Stationary",
    "T-shirt Design",
    "Brochure",
    "Webpage",
    "Workbook",
]

const SoftwareNames = [
    "Adobe Photoshop", "Adobe InDesign", "Adobe Illustrator", "Canva", "Figma"
]
const unitOptions = ['px', 'inch', 'cm']
const fileFormats = ["Jpg", "Png", "Pdf", "gif"]
const category = ["Graphic Design"]


const EditProjectModal = (props) => {
    const { open, handleClose, current_id, projects, brandOption, files, setEditImages, userId, callback, setOpenModal, setRespMessage, reduxState } = props
    const [loading, setEditLoading] = useState(false)
    const [images_loading, setImagesLoading] = useState(false)
    const formRef = useRef(null)
    const [formValue, setFormValue] = useState({
        project_category: "",
        design_type: "",
        brand: {},
        project_title: "",
        project_description: "",
        describe_audience: "",
        sizes: "",
        width: "",
        height: "",
        unit: "",
        resources: "",
        reference_example: "",
        add_files: [],
        file_formats: [],
        specific_software_names: '',
    })
    const fileInputRef = useRef(null);
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value)
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };
    const classes = reactQuillStyles()
    const project = projects?.find(project => project?._id === current_id)

    const getOptionDisabled = (option, newValue) => {
        if (formValue.file_formats.length === 3) {
            const disable = !fileFormats.includes(formValue.file_formats.map(item => { return item }))
            return disable

        } else {
            return false
        }
    };
    const getDescriptionText = (value) => {
        setFormValue({
            ...formValue,
            project_description: value
        })
    }
    function setSizes() {
        let size = ""
        if (formValue.width && formValue.height && formValue.unit) {
            size = `${formValue.width} x ${formValue.height} (${formValue.unit})`;
        }
        else if (formValue.width && formValue.height && !formValue.unit) {
            size = `${formValue.width} x ${formValue.height}`;
        }
        return size
    }

    const uploadFile = (user_id, project_id) => {
        const formdata = new FormData();
        for (let i = 0; i < uploadedImages.length; i++) {
            formdata.append("files", uploadedImages[i]);
        }
        formdata.append("user_id", user_id);
        formdata.append("project_id", project_id);
        apiClient.post("/file/google-cloud", formdata).then((res) => {
            console.log('Edit files uploaded successfully')
        }).catch(err => {
            console.error("Error uploading files Found =>", err);
        })
    };

    const updateEditForm = (event) => {
        event.preventDefault()
        setEditLoading(true)
        const formData = {
            ...formValue,
            sizes: setSizes(),
        }
        apiClient.patch('/api/update-current-project/' + current_id, formData)
            .then(({ data }) => {
                if (uploadedImages.length > 0) {
                    uploadFile(userId, current_id)

                    setEditLoading(false)
                    setRespMessage("Project updated successfully")
                    setOpenModal(true)
                    getProjectData(userId, callback);
                    setUploadedImages([])
                    clientFiles()
                    handleClose()
                } else {
                    setEditLoading(false)
                    setRespMessage("Project updated successfully")
                    setOpenModal(true)
                    getProjectData(userId, callback);
                    setUploadedImages([])
                    clientFiles()
                    handleClose()
                }
            }).catch(error => {
                setEditLoading(false)
                console.log(error)
            })
    }

    const handleButton = (event) => {
        event.preventDefault();
        // Trigger form submission programmatically
        if (formRef.current) {
            formRef.current.submit();
        }
        console.log(formRef.current)
    }

    const clientFiles = async () => {
        setImagesLoading(true);
        await apiClient.get("/get-customer-files/" + current_id)
            .then(({ data }) => {
                setEditImages(data.filesInfo);
                setImagesLoading(false);
            })
            .catch((err) => {
                setEditImages([]);
                setImagesLoading(false);
            });
    }

    const removeSingleFile = async (file) => {
        console.log(file)
        const formdata = {
            file_name: file?.name,
            folder_name: file?.folder_name
        }
        await apiClient.post(`/api/delete-file`, formdata)
            .then(({ data }) => {
                if (data?.message) {
                    setEditImages(files?.filter(item => item?.id !== file?.id))
                    console.log('file deleted')
                    // setRespMessage(data.message)
                    // setTimeout(() => {
                    //     openSuccessSB()
                    // }, 500)
                }
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    console.log('error deleting file')
                    // setTimeout(() => {
                    //     openErrorSB()
                    // }, 500)
                } else {
                    // setRespMessage(err.message)
                    // setTimeout(() => {
                    //     openErrorSB()
                    // }, 500)
                }
            })
    }

    const handleFiles = (files) => {
        const MAX_FILES = 5
        if (files?.length > MAX_FILES) {
            alert("You can upload only 5 files")
            return
        }
        if (uploadedImages.length >= MAX_FILES) {
            alert("You can upload only 5 files")
            return
        } else {
            const uploadedImagesArray = [...uploadedImages];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                uploadedImagesArray.push(file);
            }
            setUploadedImages(uploadedImagesArray);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleFiles(files);
    };
    const removeImage = (file) => {
        const indexToRemove = uploadedImages.indexOf(file)
        const filteredImages = uploadedImages.filter((image, index) => index !== indexToRemove);
        setUploadedImages(filteredImages);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleFileInputChange = (e) => {
        const files = e.target.files;
        handleFiles(files);
    };


    useEffect(() => {
        if (project?.sizes) {
            setFormValue({
                project_category: "",
                design_type: "",
                brand: {},
                project_title: "",
                project_description: "",
                describe_audience: "",
                sizes: "",
                width: "",
                height: "",
                unit: "",
                resources: "",
                reference_example: "",
                add_files: [],
                file_formats: [],
                specific_software_names: '',
            })
            const regex = /(\d+)\s*x\s*(\d+)\s*\((\w+)\)/;
            const match = regex.exec(project?.sizes);
            if (match?.length > 0) {
                const width = parseInt(match[1]);
                const height = parseInt(match[2]);
                const unit = match.includes('inch') || match.includes('px') || match.includes('cm') ? match[3] : "";
                setFormValue({
                    ...project,
                    width,
                    height,
                    unit: unit,
                })
            }
        } else {
            setFormValue({
                ...project,
            })
        }
        clientFiles()
        return () => {
            handleClose()
        }
    }, [current_id])

    useEffect(() => {
        return () => {
            setUploadedImages([])
            setEditImages([])
        }
    }, [])

    const marginNone = (breakpoints) => ({
        m: 1,
        width: '100%',
        [breakpoints.down('md')]: {
            margin: '0px'
        }
    })
    return (
        <Dialog open={open} sx={{ "& .MuiPaper-root": { maxWidth: '70% !important' } }}>
            <DialogTitle display={"flex"} position={"relative"} width={'100%'} justifyContent={"space-between"} alignItems={"center"} >
                <MDTypography sx={({ palette: { light } }) => (
                    {
                        border: `1px solid ${light.cream}`,
                    }
                )}>
                    Edit Project
                </MDTypography>
                <MDButton
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 4, padding: '1.4rem !important' }}
                >
                    <CloseOutlined sx={{ fill: '#444' }} />
                </MDButton>
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }} onSubmit={updateEditForm}>
                    <Grid width={"100%"} container spacing={2} justifyContent={"space-between"} alignItems={"center"}>

                        <Grid item xxl={6} xl={6} lg={12} md={12} xs={12}>
                            <FormControl sx={({ breakpoints }) => marginNone(breakpoints)}>
                                <Autocomplete
                                    value={formValue.project_category}
                                    onChange={(event, newValue) => {
                                        setFormValue({
                                            ...formValue,
                                            project_category: newValue
                                        })
                                    }}
                                    options={category}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField disabled={category.some(item => item !== 'Graphic Design')} required {...params} label="Select Project Category" />}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xxl={6} xl={6} lg={12} md={12} xs={12}>
                            <FormControl sx={({ breakpoints }) => marginNone(breakpoints)}>
                                <Autocomplete
                                    value={formValue.design_type}
                                    onChange={(event, newValue) => {
                                        setFormValue({
                                            ...formValue,
                                            design_type: newValue
                                        })
                                    }}
                                    freeSolo
                                    id="select-design-demo"
                                    options={designType}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField required {...params} label="Select Design Type" />}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xxl={6} xl={6} lg={12} pt={"24px !important"} md={12} xs={12}>
                            <FormControl sx={({ breakpoints }) => ({
                                m: 1, width: '100%', position: 'relative', [breakpoints.down('md')]: {
                                    margin: 0,
                                }
                            })}>
                                <Autocomplete
                                    value={formValue.brand}
                                    onChange={(event, newValue) => {
                                        setFormValue({
                                            ...formValue,
                                            brand: newValue
                                        })
                                    }}
                                    id="select-brand-demo"
                                    getOptionLabel={option => option.brand_name ? option.brand_name : ''}
                                    options={brandOption}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField required {...params} label="Select Brand" />}

                                />
                            </FormControl>
                        </Grid>
                        <Grid item xxl={6} xl={6} lg={12} pt={"0 !important"} md={12} xs={12}>
                            <FormControl sx={({ breakpoints }) => ({
                                m: 1, width: '100%',
                                paddingTop: '23px !important',
                                [breakpoints.down('md')]: {
                                    margin: 0,
                                }
                            })}>
                                <MDInput type="text"
                                    name="project_title"
                                    onChange={handleChange}
                                    value={formValue.project_title}
                                    required
                                    placeholder="Project Title *" variant="outlined" fullWidth
                                    sx={{
                                        "& > *": {
                                            padding: '6px 8px !important',
                                        }
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xxl={12} xl={12} lg={12} md={12} xs={12} mt={2}>
                            <MDBox mb={2} sx={{
                                display: "flex", flexDirection: "column",
                                "& > textarea:focus": {
                                    outline: 0,
                                }
                            }}>
                                <label htmlFor='company_address'>Project Description *</label>
                                <ReactQuill
                                    theme="snow"
                                    value={formValue.project_description || ''}
                                    onChange={getDescriptionText}
                                    modules={modules}
                                    formats={formats}
                                    className={classes.quill}
                                />
                            </MDBox>
                        </Grid>
                        <Grid item xxl={6} xl={6} lg={12} md={12} xs={12}>
                            <Typography variant="h4" size="medium">Custom width</Typography>
                            <FormControl sx={({ breakpoints }) => ({
                                m: 1, width: '30%',
                                [breakpoints.down('lg')]: {
                                    width: '100%'
                                },
                                [breakpoints.down('md')]: {
                                    margin: 0,
                                    marginBottom: '6px'
                                }
                            })}>
                                <MDInput
                                    type="number"
                                    name="width"
                                    required={formValue.height}
                                    onChange={handleChange}
                                    value={formValue.width}
                                    placeholder="Width" variant="outlined" fullWidth
                                    sx={({ breakpoints, spacing }) => ({
                                        "& > *": {
                                            padding: '6px 8px !important'
                                        },
                                        [breakpoints.down('lg')]: {
                                            paddingBlock: '5px',
                                            fontSize: '13px'
                                        }

                                    })}
                                />
                            </FormControl>
                            <FormControl sx={({ breakpoints }) => ({
                                m: 1, width: '30%',
                                [breakpoints.down('lg')]: {
                                    width: '100%'
                                },
                                [breakpoints.down('md')]: {
                                    margin: 0,
                                    marginBottom: '6px'
                                }
                            })}>
                                <MDInput
                                    type="number"
                                    name="height"
                                    required={formValue.width}
                                    value={formValue.height}
                                    onChange={handleChange}
                                    placeholder="Height" variant="outlined" fullWidth
                                    sx={({ breakpoints }) => ({
                                        "& > *": {
                                            padding: '6px 8px !important'
                                        },
                                        [breakpoints.down('md')]: {
                                            paddingBlock: '5px !important',
                                            fontSize: '13px'
                                        }

                                    })}
                                />
                            </FormControl>
                            <FormControl sx={({ breakpoints }) => ({
                                m: 1, width: '30%',
                                [breakpoints.down('md')]: {
                                    width: '100% !important',
                                    margin: 0,
                                    marginBottom: '6px'
                                },
                            })}>
                                <Autocomplete
                                    onChange={(event, newValue) => {
                                        setFormValue({
                                            ...formValue,
                                            unit: newValue
                                        })
                                    }}
                                    id="select-units"
                                    options={unitOptions}
                                    value={formValue?.unit}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField {...params} label="Select Units" sx={{
                                        "&.MuiOutlinedInput-root": {
                                            paddingBlock: '11px',
                                            backgroundColor: 'red !important'
                                        },
                                    }} />}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xxl={6} pt={"18px"} xl={6} lg={12} sm={12} md={12} xs={12}>
                            <MDBox display="flex" gap="5px" sx={({ breakpoints }) => ({
                                m: 1, marginTop: '28px', width: '100%',
                                [breakpoints.down('md')]: {
                                    flexWrap: "wrap",
                                    marginTop: '20px',
                                    margin: 0,
                                }
                            })}>
                                <FormControl sx={({ breakpoints }) => ({
                                    m: 1, width: '100%', [breakpoints.down('md')]: {
                                        margin: 0,
                                        marginBottom: '6px'
                                    }
                                })}>
                                    <Autocomplete
                                        value={formValue.file_formats}
                                        onChange={(event, newValue) => {
                                            setFormValue({
                                                ...formValue,
                                                file_formats: newValue
                                            })
                                        }}
                                        getOptionDisabled={getOptionDisabled}
                                        id="select-file-formats"
                                        aria-required
                                        options={fileFormats}
                                        sx={{ width: '100%' }}
                                        renderInput={(params) => <TextField {...params} label="Select File Formats" />}
                                        multiple
                                    />
                                </FormControl>
                                <FormControl sx={({ breakpoints }) => ({
                                    m: 1, width: '100%', [breakpoints.down('md')]: {
                                        margin: 0,
                                    }
                                })}>
                                    <Autocomplete
                                        value={formValue.specific_software_names}
                                        onChange={(event, newValue) => {
                                            setFormValue({
                                                ...formValue,
                                                specific_software_names: newValue
                                            })
                                        }}
                                        id="select-specific-software-demo"
                                        options={SoftwareNames}
                                        sx={{
                                            width: '100%',
                                            "& > .MuiChip-filled": {
                                                backgroundColor: "#ddd !important"
                                            }
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Select Specific Software" />}
                                    />
                                </FormControl>
                            </MDBox>

                        </Grid>
                        <Grid item xxl={12} xl={12} lg={12} sm={12} md={12} xs={12} p={2}>
                            <MDTypography variant="h6" fontWeight="400" sx={{ fontFamily: fontsFamily.poppins }}>Project Images</MDTypography>
                            <MDBox sx={imageBox}>
                                {images_loading ? (
                                    <MoonLoader loading={images_loading} size={32} color='#121212' />
                                ) : (
                                    <MDBox sx={{ display: 'grid', gridTemplateColumns: `repeat(${files?.length}, 1fr)`, gap: '16px' }}>
                                        <React.Fragment>
                                            {images_loading ? (
                                                <React.Fragment>
                                                    <MoonLoader loading={loading} size={18} color='#121212' />
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    {files?.length > 0 ? (
                                                        <React.Fragment>
                                                            {files?.map(image => {
                                                                return <MDBox key={image.id} sx={{ position: 'relative' }}>
                                                                    {image?.type?.startsWith("image/") ? (
                                                                        <React.Fragment>
                                                                            <CloseIcon
                                                                                fontSize='medium'
                                                                                onClick={() => removeSingleFile(image)}
                                                                                sx={{
                                                                                    ...deleteImageSvgIcon,
                                                                                    right: '-8px',
                                                                                    top: '-15px'
                                                                                }}
                                                                            />

                                                                            <img
                                                                                src={image.url}
                                                                                alt={image.name}
                                                                                width={80} height={80}
                                                                            />
                                                                        </React.Fragment>
                                                                    ) : (
                                                                        <React.Fragment>
                                                                            <CloseIcon
                                                                                fontSize='medium'
                                                                                onClick={() => removeSingleFile(image)}
                                                                                sx={{
                                                                                    ...deleteImageSvgIcon,
                                                                                    right: '-8px',
                                                                                    top: '-15px'
                                                                                }}
                                                                            />
                                                                            {/* <ShowOtherFiles file={image} /> */}
                                                                            {image.type?.includes(aiLogo) ? (
                                                                                <img src={AiLogo} width={80} height={80} loading='lazy' />
                                                                            ) : image.type?.includes(pdf) ? (
                                                                                <img src={pdffile} width={80} height={80} loading='lazy' />
                                                                            ) : image.type?.includes(psdfile) ? (
                                                                                <img src={psdFile} width={80} height={80} loading='lazy' />
                                                                            ) : image.type?.includes(zipfile) ? (
                                                                                <img src={Zipicon} width={80} height={80} loading='lazy' />
                                                                            ) : null
                                                                            }
                                                                        </React.Fragment>
                                                                    )}
                                                                    <React.Fragment>
                                                                    </React.Fragment>
                                                                </MDBox>
                                                            })}
                                                        </React.Fragment>
                                                    ) :
                                                        <span>No Images Found</span>
                                                    }
                                                </React.Fragment>
                                            )}
                                        </React.Fragment>

                                    </MDBox>
                                )}
                            </MDBox>

                        </Grid>
                        <MDTypography variant="body2" fontWeight="400"
                            sx={{
                                paddingInlineStart: '15px',
                                fontSize: '13px',
                                fontFamily: fontsFamily.poppins,
                                color: 'red',
                                fontWeight: '500',


                            }} >5 files allowed</MDTypography>
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
                                multiple
                                accept=".ai, .eps, .psd, .zip, .jpg, .png, .pdf, .jpeg, .svg"
                                onChange={handleFileInputChange}
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                            />
                            {/* Display uploaded images */}
                            {uploadedImages.map((image, index) => {
                                return (
                                    <React.Fragment>
                                        {image?.type?.startsWith("image/") ? (
                                            <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                                <img src={URL.createObjectURL(image)} alt={`uploaded-${index}`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '10px', width: "80px", height: "80px", objectFit: "cover" }} />
                                                <CloseIcon
                                                    fontSize='medium'
                                                    onClick={() => removeImage(image)}
                                                    sx={{
                                                        ...deleteImageSvgIcon,
                                                        right: '1px',
                                                        top: '1px'
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <OtherFilesShow file={image} deleteOtherSingleFile={removeImage} />
                                        )}

                                    </React.Fragment>
                                )
                            })}
                        </Grid>
                        <Grid display={"flex"} justifyContent={"flex-end"} position={"relative"} paddingBlock={"30px !important"} alignItems={"center"} item xxl={12} xl={12} lg={12} sm={12} md={12} xs={12} p={2} pt={"10px"}>
                            <MDBox display="flex" justifyContent="flex-end" alignItems="center" position="absolute !important" bottom="-15px">
                                <MDButton
                                    type="submit"
                                    // onClick={updateEditForm}
                                    // onClick={handleButton}
                                    color="warning"
                                    fullWidth
                                    endIcon={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <ArrowForward fontSize='large' />&nbsp;
                                        <MoonLoader loading={loading} size={18} color='#121212' />
                                    </div>}
                                    disabled={loading}
                                    circular={false}
                                    sx={{
                                        color: '#000 !important',
                                        fontSize: 14,
                                        textTransform: "capitalize",
                                    }}
                                >
                                    Update &nbsp;
                                </MDButton>
                            </MDBox>
                        </Grid>

                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                {/* <MDBox display="flex" justifyContent="flex-end" alignItems="center">
                    <MDButton
                        type="button"
                        // onClick={updateEditForm}
                        onClick={handleButton}
                        color="warning"
                        fullWidth
                        endIcon={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ArrowForward fontSize='large' />&nbsp;
                            <MoonLoader loading={loading} size={18} color='#121212' />
                        </div>}
                        disabled={loading}
                        circular={false}
                        sx={{
                            color: '#000 !important',
                            fontSize: 14,
                            textTransform: "capitalize",
                        }}
                    >
                        Update &nbsp;
                    </MDButton>
                </MDBox> */}
            </DialogActions>
        </Dialog>
    )
}

const imageBox = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc',
    padding: '12px',
    borderRadius: '4px',
    widht: '100%',
    height: '120px'
}
export default EditProjectModal
