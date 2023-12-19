import React, { useState, memo, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import MDInput from 'components/MDInput';
import { useTheme } from '@mui/material/styles';
import CloseSharp from '@mui/icons-material/CloseSharp';
import MDButton from 'components/MDButton';
import apiClient from 'api/apiClient';
import reduxContainer from 'redux/containers/containers';
import { MoonLoader } from 'react-spinners'
import { useEffect } from 'react';
import { getProjectData } from 'redux/global/global-functions';
import { getBrandData } from 'redux/global/global-functions';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { ArticleOutlined, PictureAsPdf, PictureAsPdfOutlined } from '@mui/icons-material';
import UploadFile from 'components/File upload button/FileUpload';

const category = [
    "Graphic Design",
    "Copywriting",
    "Illustrations",
    "Video Editing",
    "Motion Graphics",
    "Web Development",
    "Voice Overs",
    "Social Media Lite",
]
const designType = [
    "App",
    "Banner",
    "Book Cover",
    "Brand Guidelines",
    "Business Card",
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
const brands = [
    "Nike",
    "Ideas",
    "cougar",
]

const sizes = [
    { title: "1080 x 1080" },
    { title: "1080 x 1920" },
    { title: "1920 x 1080" }
]

const SoftwareNames = [
    "Adobe Photoshop", "Adobe Illustrator", "Canva", "Figma"
]


function CreateProject({
    reduxState, reduxActions,
    handleClose, open, handleChange,
    openSuccessSB, openErrorSB, setRespMessage,
    formValue, }) {

    const filter = createFilterOptions()
    const [add_files, setAddFiles] = useState([])
    const [upload_files, setUploadFiles] = useState([])
    const [loading, setLoading] = useState(false)

    const project_categoryRef = useRef(null)
    const design_typeRef = useRef(null)
    const brandRef = useRef(null)
    const project_titleRef = useRef(null)
    const describe_audienceRef = useRef(null)
    const project_descriptionRef = useRef(null)
    const sizesRef = useRef(null)
    const resourcesRef = useRef(null)
    const reference_exampleRef = useRef(null)
    const files = useRef(null)
    const specific_software_namesRef = useRef(null)
    const [selectedOption, setSelectedOption] = useState(null)

    const [uploadProgress, setUploadProgress] = useState(0);


    // Styling Options

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        // console.log(formValue)
        let data = {
            id: reduxState.userDetails?.id,
            name: reduxState.userDetails?.name,
            project_category: project_categoryRef.current.value,
            design_type: design_typeRef.current.value,
            brand: brandRef.current.value,
            project_title: project_titleRef.current.value,
            project_description: project_descriptionRef.current.value,
            sizes: selectedOption?.title,
            specific_software_names: specific_software_namesRef.current.value,
            is_active: false,

            // add_files: [],
            // describe_audience: describe_audienceRef.current,
            // resources: resourcesRef.current,
            // reference_example: reference_exampleRef.current,
        }
        // console.log(data)
        await apiClient.post('/graphic-project', data)
            .then(resp => {
                if (resp?.status === 201) {
                    const { message } = resp?.data
                    setRespMessage(message)
                    reduxActions.getNew_Brand(!reduxState.new_brand)

                    let param = [
                        reduxState.userDetails?.id,
                        reduxState.userDetails?.name,
                        resp.data?.project._id,
                        resp.data?.project.project_title
                    ]
                    uploadFile(...param)
                    setTimeout(() => {
                        openSuccessSB()
                    }, 1000)
                }
                setLoading(false)
            })
            .catch(error => {
                throw error
                // if (error.response) {
                //     const { message } = error?.response?.data
                //     openErrorSB()
                //     setLoading(false)
                //     setRespMessage(message)
                //     openErrorSB()
                //     setLoading(false)
                //     console.log('Error ', message)
                // }
                // setLoading(false)
                // console.log(error)
            })
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiInputBase-root': {
            paddingBlock: '15px'
        },
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
            width: "100%"
        },
    }));


    function onStateClear(state) {
        // setFormValue({
        //     ...formValue,
        //     [state]: ''
        // })
    }
    // =================== END =====================
    let image = "image/"
    let pdf = "application/pdf"
    let svg = "image/svg+xml"
    let docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    const handleFileUpload = (event) => {
        if (event.target.files.length > 7) {
            setUploadFiles([])
            setAddFiles([])
            return
        }
        setUploadFiles([])
        setAddFiles([])
        const files = event.target.files;
        const newFiles = [];
        // const selectedFiles = []
        let img = Object.keys(files).filter(f => f.type == image)
        // console.log('img', img)
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // selectedFiles.push(file)
            setUploadFiles(prev => [...prev, file])
            if (file.type.startsWith(image)) {
                const reader = new FileReader();
                reader.onload = function () {
                    newFiles.push(reader.result);
                    // if (newFiles.length === files.length) {
                    setAddFiles(newFiles)
                    // setFormValue({
                    //     ...formValue,
                    //     add_files: newFiles
                    // });
                    // }
                };

                reader.readAsDataURL(file);
            }

            // if (file.type.startsWith(image)) {
            // }
        }
    };

    const removeFiles = () => {
        setAddFiles([])
        setUploadFiles([])
        setUploadProgress(0)
    }

    const OtherFilesShow = ({ file }) => {
        return (
            <>
                {file.type.includes(docx) ?
                    (<span style={otherFileStyle}>
                        <ArticleOutlined sx={{
                            fontSize: '6rem !important',
                            border: '1px dashed blue'
                        }} />

                    </span >
                    )
                    : file.type.includes(pdf) ?
                        (<span style={otherFileStyle}>
                            <PictureAsPdf
                                sx={{
                                    fontSize: '6rem !important',
                                    border: '1px dashed blue'
                                }} />
                        </span>) : null
                }
            </>

        )
    }

    const uploadFile = (user_id, name, project_id, project_title) => {
        const formdata = new FormData
        setUploadProgress(0);
        for (let i = 0; i < upload_files.length; i++) {
            formdata.append('files', upload_files[i]);
            
        }
        formdata.append('user_id', user_id)
        formdata.append('name', name)
        formdata.append('project_title', project_title)
        formdata.append('project_id', project_id)

        apiClient.post("/file/google-cloud", formdata, {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                // console.log(percentCompleted)
                setUploadProgress(percentCompleted)
            }
        }).then(() => {
            const data = {
                user_id,
                name,
                project_id,
                project_title
            }
            apiClient.post("/file/get-files", data)
                .then(({ data }) => {
                    removeFiles()
                    setLoading(false)
                    handleClose()
                    setRespMessage(data?.message)
                    setTimeout(() => {
                        openSuccessSB()
                    }, 2000)
                    // console.log(data?.message)
                }).catch(err => { throw err })
        }).catch((err) => {
            setLoading(false)
            setRespMessage(err?.response?.data.message)
            setTimeout(() => {
                openErrorSB()
            }, 1200)
            console.error('Error Found =>', err)
        })
    }

    const refSetting = (value, ref) => {
        ref.current.value = value
    }

    // useEffect(() => {
    //     const id = reduxState?.userDetails?.id
    //     getProjectData(id, reduxActions.getCustomerProject)
    //     getBrandData(id, reduxActions.getCustomerBrand)
    // }, [reduxState.new_brand])

    return (
        <BootstrapDialog open={open} sx={{ width: '100% !important' }} >
            <DialogTitle>
                <MDTypography sx={({ palette: { light } }) => (
                    {
                        backgroundColor: light.cream,
                        border: `1px solid ${light.cream}`,
                    }
                )}>
                    Create Project
                </MDTypography>
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Grid width={"100%"} container spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                        <Grid item xxl={6} xl={6}>
                            <FormControl sx={{ m: 1, width: '100%', }}>
                                <InputLabel htmlFor='project_category_label' >Select Project Category</InputLabel>
                                <Select
                                    labelId="project_category_label"
                                    name="project_category"
                                    // value={formValue.project_category}
                                    variant='filled'
                                    IconComponent={() => <CloseSharp onClick={() => onStateClear('project_category')} fontSize='small' sx={{ marginRight: 1, cursor: "pointer" }} />}
                                    input={<OutlinedInput
                                        id="project_category"
                                        label="Select Project Category" />}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {category.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                            disabled={name !== 'Graphic Design'}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xxl={6} xl={6}>
                            <FormControl sx={{ width: '100%', }}>
                                <InputLabel htmlFor="design_type_label">Select Design Type</InputLabel>
                                <Select
                                    labelId="design_type_label"
                                    // value={formValue.design_type}
                                    MenuProps={MenuProps}
                                    onChange={handleChange}
                                    // IconComponent={() => <CloseSharp onClick={() => onStateClear('design_type')} fontSize='small' sx={{ marginRight: 1, cursor: "pointer" }} />}
                                    input={<OutlinedInput label="Select Design Type" />}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {designType.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xxl={6} xl={6}>
                            <FormControl sx={{ m: 1, width: '100%' }}>
                                <InputLabel htmlFor="brand_label">Select Brand</InputLabel>
                                <Select
                                    labelId='brand_label'
                                    name="brand"
                                    // value={formValue.brand}
                                    ref={brandRef}
                                    IconComponent={() => <CloseSharp onClick={() => onStateClear('brand')} fontSize='small' sx={{ marginRight: 1, cursor: "pointer" }} />}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Select Brand" />}
                                >
                                    {/* <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem> */}
                                    {reduxState?.customerBrand?.length ? reduxState?.customerBrand?.map((item, i) => (
                                        <MenuItem
                                            key={i}
                                            value={item?.brand_name}
                                        >
                                            {item?.brand_name}
                                        </MenuItem>
                                    )) : <MenuItem value={''} ><em>No brands found create brand first</em>
                                    </MenuItem>}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xxl={6} xl={6}>
                            <FormControl sx={{ m: 1, width: '100%', }}>
                                <MDInput type="text"
                                    name="project_title"
                                    // value={formValue.project_title}
                                    onChange={handleChange}
                                    placeholder="Project Title" variant="outlined" fullWidth
                                    sx={{
                                        "& > *": {
                                            // backgroundColor : 'red',
                                            padding: '4px 8px !important'
                                        }
                                    }}
                                />
                            </FormControl>

                        </Grid>
                        <Grid item xxl={12} xl={12}>
                            <MDBox mb={2} sx={{
                                display: "flex", flexDirection: "column",
                                "& > textarea:focus": {
                                    outline: 0,
                                }
                            }}>
                                <label htmlFor='company_address'>Project Description</label>
                                <textarea
                                    style={textareaStyles}
                                    type="text"
                                    rows={9}
                                    // value={formValue.project_description}
                                    cols={100}
                                    name="project_description"
                                    onChange={handleChange}
                                    placeholder="Project Description" variant="outlined" />
                            </MDBox>
                        </Grid>
                        {/* <Grid item xxl={4} xl={4}>
                            <MDBox mb={2} sx={{
                                display: "flex", flexDirection: "column",
                                "& > textarea:focus": {
                                    outline: 0,
                                }
                            }}>
                                <label htmlFor='reference'>Resource</label>
                                <textarea
                                    style={textareaStyles}
                                    type="text"
                                    rows={9}
                                    cols={100}
                                    name="reference"
                                    onChange={(e) => refSetting(e.target.value, resourcesRef)}
                                    // onChange={handleChange}
                                    // value={formValue.reference}
                                    ref={resourcesRef}
                                    placeholder="Your content here"
                                    variant="outlined" />
                            </MDBox>
                        </Grid> */}
                        {/* <Grid item xxl={4} xl={4}>
                            <MDBox mb={2} sx={{
                                display: "flex", flexDirection: "column",
                                "& > textarea:focus": {
                                    outline: 0,
                                }
                            }}>
                                <label htmlFor='describe_audience'>Describe Audience</label>
                                <textarea style={textareaStyles}
                                    type="text" rows={9}
                                    cols={100}
                                    // onChange={handleChange}
                                    name="describe_audience"
                                    onChange={(e) => refSetting(e.target.value, describe_audienceRef)}
                                    ref={describe_audienceRef}
                                    // value={formValue.describe_audience}
                                    placeholder="Describe audience here" variant="outlined" />
                            </MDBox>
                        </Grid> */}

                        <Grid item xxl={6} xl={6}>
                            {/* <FormControl sx={{ m: 1, width: '100%' }}>
                                <InputLabel htmlFor="sizes_label">Select Sizes</InputLabel>
                                <Select
                                    labelId='sizes'
                                    id="sizes"
                                    name="sizes"
                                    ref={sizesRef}
                                    // value={formValue.sizes}
                                    // onChange={handleChange}
                                    onChange={(e) => refSetting(e.target.value, sizesRef)}
                                    IconComponent={() => <CloseSharp onClick={() => onStateClear('sizes')} fontSize='small' sx={{ marginRight: 1, cursor: "pointer" }} />}
                                    input={<OutlinedInput label="Select Sizes" />}>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {sizes.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                            <Autocomplete
                                sx={{
                                    "& .MuiAutocomplete-root": {
                                        width: '100%'
                                    }
                                }}
                                value={selectedOption}
                                onChange={(event, newValue) => {
                                    if (typeof newValue === 'string') {
                                        setSelectedOption({
                                            title: newValue,
                                        });
                                    } else if (newValue && newValue.inputValue) {
                                        // Create a new value from the user input
                                        setSelectedOption({
                                            title: newValue.inputValue,
                                        });
                                    } else {
                                        setSelectedOption(newValue);
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);

                                    const { inputValue } = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some((option) => inputValue === option.title);
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({
                                            inputValue,
                                            title: `Add "${inputValue}"`,
                                        });
                                    }

                                    return filtered;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                id="free-solo-with-text-demo"
                                options={sizes}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return option.title;
                                }}
                                renderOption={(props, option) => <li {...props}>{option.title}</li>}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField {...params} label="Select size" />
                                )}
                            />
                        </Grid>

                        <Grid item xxl={6} xl={6}>
                            <FormControl sx={{ m: 1, width: '100%' }}>
                                <InputLabel htmlFor="select_specific_software_recomendations">Select Your Specific Software</InputLabel>
                                <Select
                                    labelId='select_specific_software_recomendations'
                                    name="specific_software_names"
                                    // value={formValue.specific_software_names}
                                    // onChange={handleChange}
                                    ref={specific_software_namesRef}
                                    onChange={(e) => refSetting(e.target.value, specific_software_namesRef)}
                                    IconComponent={() => <CloseSharp onClick={() => onStateClear('')} fontSize='small' sx={{ marginRight: 1, cursor: "pointer" }} />}
                                    input={<OutlinedInput label="Select Your Specific Software" />}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {SoftwareNames.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xxl={3} xl={3}>
                            <MDBox>
                                <UploadFile
                                    add_files={add_files}
                                    upload_files={upload_files}
                                    handleFileUpload={handleFileUpload}
                                    removeFiles={removeFiles}
                                    isCloseIcon={true}
                                    
                                />
                            </MDBox>
                            <MDTypography component="span" sx={{ color: 'red', fontWeight: '300', fontSize: '14px' }} >Note : Only .png, .pdf, <br /> .docx, .jpg, .jpeg  <br />formats are allowed <br /> Max Select 7</MDTypography>

                        </Grid>
                        <Grid item xxl={9} xl={9} ml={-10} alignSelf={"flex-start"} sx={{
                            height: '124px',
                            overflowY: 'auto'
                        }} >
                            {add_files.length ? add_files.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={"image"}
                                    width={100}
                                    loading={"lazy"}
                                    height={100}
                                    style={uploadImageStyles}
                                />

                            )) : null}
                            <>
                                {
                                    upload_files.length > 0 ? upload_files.map((file) => (
                                        <>{file.type.startsWith(docx) || file.type.startsWith(pdf) ? <OtherFilesShow file={file} /> : <></>}</>
                                    )) : null
                                }
                            </>

                        </Grid>
                    </Grid>
                    <DialogActions>
                        <MDBox marginRight="100px">
                            {uploadProgress > 0 && (
                                <>
                                    <p>Upload Progress: {uploadProgress}%</p>
                                    <progress value={uploadProgress} max="100"></progress>
                                </>
                            )}

                        </MDBox>
                        <Button onClick={handleClose}>Cancel</Button>
                        <SubmitButton variant='contained' type='button' onClick={uploadFile}>Upload Project Files</SubmitButton>
                        <SubmitButton variant='contained' type='submit'>
                            Submit &nbsp;&nbsp;
                            <MoonLoader loading={loading} size={18} color='#fff' />
                        </SubmitButton>
                    </DialogActions>
                </Box>
            </DialogContent>

        </BootstrapDialog >
    );
}

export default reduxContainer(CreateProject)

const SubmitButton = styled(Button)(({ theme: { palette } }) => ({
    color: 'white'
}))


export const otherFileStyle = {
    width: 'auto',
    height: '100px',
    // backgroundColor: 'red', 
    // position: 'absolute',
    marginRight: '8px',
    cursor: 'pointer'
}

const textareaStyles = {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontFamily: 'sans-serif',
    fontSize: '17px',
    backgroundColor: 'transparent',
    fontWeight: '400',

}
const Styles = {
    fontWeight: "bold",
    fontSize: "15px",
    marginLeft: 4
}
const uploadImageStyles = {
    border: '1px dashed blue',
    padding: 3,
    marginRight: '8px',
    cursor: 'pointer'
}