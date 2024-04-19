import { ArrowForward, CloseOutlined } from '@mui/icons-material';
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
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import { MoonLoader } from 'react-spinners';
import CloseIcon from '@mui/icons-material/Close';
import { deleteImageSvgIcon } from './new';
import { getProjectData } from 'redux/global/global-functions';


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
    const { open, handleClose, current_id, projects, brandOption, imagesLoading, files, setImagesLoading, setEditImages, editImages, userId, callback } = props

    const [loading, setEditLoading] = useState(false)
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


    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value)
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };
    const classes = reactQuillStyles()
    const project = projects.find(project => project?._id === current_id)

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

    const updateEditForm = async () => {
        setEditLoading(true)
        const formData = {
            ...formValue,
            sizes : `${formValue.width} x ${formValue.height} (${formValue.unit})`,
        }
        await apiClient.patch('/api/update-current-project/' + current_id, formData)
            .then(({ data }) => {
                console.log(data)
                setEditLoading(false)
                getProjectData(userId,callback);
                handleClose()
            }).catch(error => {
                setEditLoading(false)
                console.log(error)
            })
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
    const removeSingleFile = () => {
        // logic to remove single file from editImages array

    }

    useEffect(() => {
        console.log(project)
        const regex = /(\d+)\s*x\s*(\d+)\s*\((\w+)\)/;
        const match = regex.exec(project?.sizes);
        const width = parseInt(match[1]);
        const height = parseInt(match[2]);
        const unit = match[3];
        setFormValue({
            ...project,
            width,
            height,
            unit,
        })
        clientFiles()
        return () => {
            handleClose()
        }
    }, [])
    const marginNone = (breakpoints) => ({
        m: 1,
        width: '100%',
        [breakpoints.down('md')]: {
            margin: '0px'
        }
    })
    console.log(editImages)
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
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
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
                        {/* <Grid item xxl={12} xl={12} lg={12} sm={12} md={12} xs={12} p={2}>
                            <MDTypography variant="h6" fontWeight="400" sx={{ fontFamily: fontsFamily.poppins }}>Project Images</MDTypography>
                            <MDBox sx={imageBox}>
                                {imagesLoading ? (
                                    <MoonLoader loading={imagesLoading} size={32} color='#121212' />
                                ) : (
                                    <MDBox sx={{ display: 'grid', gridTemplateColumns: `repeat(${editImages?.length}, 1fr)`, gap: '16px' }}>
                                        {editImages?.length > 0 ? (
                                            <>{editImages?.map(image => {
                                                return (
                                                    <MDBox key={image.id} sx={{ position: 'relative' }}>
                                                        <CloseIcon
                                                            fontSize='medium'
                                                            onClick={() => removeSingleFile(image.id)}
                                                            sx={{...deleteImageSvgIcon,
                                                                right:'-13px'
                                                            }}
                                                        />

                                                        <img
                                                            src={image.url}
                                                            alt={image.name}
                                                            width={80} height={80}
                                                        />
                                                    </MDBox>
                                                )
                                            })}</>
                                        ) :
                                            <span>No Images Found</span>
                                        }
                                    </MDBox>
                                )}
                            </MDBox>

                        </Grid> */}
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <MDBox display="flex" justifyContent="flex-end" alignItems="center">
                    <MDButton
                        type="button"
                        onClick={updateEditForm}
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
