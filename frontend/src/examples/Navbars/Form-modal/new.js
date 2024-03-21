import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@mui/material/styles/styled';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import { MoonLoader } from 'react-spinners'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { CloseOutlined, FolderZip, PictureAsPdf } from '@mui/icons-material';
import UploadFile from 'components/File upload button/FileUpload';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openBrandModalFunc } from 'redux/actions/actions';
import { Typography, useMediaQuery } from '@mui/material';
import AiLogo from 'assets/mi-banana-icons/ai-logo.png'
import fileImage from 'assets/mi-banana-icons/file-image.png'
import ReactQuil from "react-quill";
import { formats } from 'assets/react-quill-settings/react-quill-settings';
import { modules } from 'assets/react-quill-settings/react-quill-settings';
import { reactQuillStyles } from 'assets/react-quill-settings/react-quill-settings';
// import { useSocket } from 'sockets';
import { useContext, useRef } from 'react';
import { SocketContext } from 'sockets';

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

let aiLogo = "application/postscript"
let psdfile = "image/vnd.adobe.photoshop"
let zipfile = 'application/x-zip-compressed'
let pdf = "application/pdf"

const OtherFilesShow = ({ file, deleteOtherSingleFile }) => {
    return (
        <>
            {file.type.startsWith(zipfile) ?
                (<div style={deleteImageContainer}>
                    <CloseIcon fontSize="medium" sx={deleteImageSvgIcon} onClick={() => deleteOtherSingleFile(file)} />
                    <FolderZip sx={{
                        fontSize: '6rem !important',
                    }} />
                </div >
                )
                : file.type.includes(aiLogo) ?
                    (
                        <div style={deleteImageContainer}>
                            <CloseIcon fontSize="medium" sx={deleteImageSvgIcon} onClick={() => deleteOtherSingleFile(file)} />
                            <img src={AiLogo} width={100} height={100} loading='lazy' />
                        </div>
                    ) : file.type.startsWith(psdfile) || file.type === "" ?
                        (
                            <div style={deleteImageContainer}>
                                <CloseIcon fontSize="medium" sx={deleteImageSvgIcon} onClick={() => deleteOtherSingleFile(file)} />
                                <img src={fileImage} width={100} height={100} loading='lazy' />
                            </div>
                        ) : file.type.includes(pdf) ?
                            (
                                <div style={deleteImageContainer}>
                                    <CloseIcon fontSize="medium" sx={deleteImageSvgIcon} onClick={() => deleteOtherSingleFile(file)} />
                                    <PictureAsPdf
                                        sx={{
                                            fontSize: '6rem !important',
                                        }} />
                                </div>
                            ) : null
            }
        </>

    )
}
const BootstrapDialog = styled(Dialog)(({ theme: { breakpoints, spacing } }) => ({
    '& .MuiPaper-root': {
        maxWidth: '70% !important',
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
const category = [
    "Graphic Design",
    // "Copywriting",
    // "Illustrations",
    // "Video Editing",
    // "Motion Graphics",
    // "Web Development",
    // "Voice Overs",
    // "Social Media Lite",
]
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
const sizes = [
    { title: "1080 x 1080" },
    { title: "1080 x 1920" },
    { title: "1920 x 1080" }
]
const fileFormats = ["Jpg", "Png", "Pdf", "gif"]
const SoftwareNames = [
    "Adobe Photoshop", "Adobe InDesign", "Adobe Illustrator", "Canva", "Figma"
]
const unitOptions = ['px', 'inch', 'cm']


const CreateProject1 = ({
    reduxState, handleClose, open, handleChange,
    loading, onSubmit, formValue, setSelectedOption,
    selectedOption, onRemoveChange, add_files,
    upload_files, uploadProgress, setFormValue,
    brandOption, handleFileUpload, removeFiles,
    removeSingleFile, deleteOtherSingleFile
}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const is768 = useMediaQuery("(min-width:768px)")
    const func = () => dispatch(openBrandModalFunc(true))
    const filter = createFilterOptions()
    const classes = reactQuillStyles()

    function moveToBrandPage() {
        handleClose()
        navigate("/mi-brands")
        func()
    }
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
    const marginNone = (breakpoints) => ({
        m: 1,
        width: '100%',
        [breakpoints.down('md')]: {
            margin: '0px'
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
                    Create Project
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
                <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexWrap: 'wrap' }}>
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
                                    onClick={moveToBrandPage}
                                    id="select-brand-demo"
                                    getOptionLabel={option => option.brand_name ? option.brand_name : ''}
                                    options={brandOption}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField required {...params} label="Select Brand" />}

                                />
                            </FormControl>
                            <MDTypography
                                variant="a"
                                size="medium"
                                sx={{ position: 'sticky', left: '30px', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                onClick={moveToBrandPage}>
                                Create brand
                            </MDTypography>
                        </Grid>
                        <Grid item xxl={6} xl={6} lg={12} pt={"0 !important"} md={12} xs={12}>
                            <FormControl sx={({ breakpoints }) => ({
                                m: 1, width: '100%', [breakpoints.down('md')]: {
                                    margin: 0,
                                }
                            })}>
                                <MDInput type="text"
                                    name="project_title"
                                    onChange={handleChange}
                                    required
                                    placeholder="Project Title *" variant="outlined" fullWidth
                                    sx={{
                                        "& > *": {
                                            padding: '6px 8px !important'
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
                                {/* <textarea
                                    style={textareaStyles}
                                    type="text"
                                    rows={9}
                                    required
                                    // value={formValue.project_description}
                                    cols={100}
                                    name="project_description"
                                    onChange={handleChange}
                                    placeholder="Project Description" variant="outlined"
                                /> */}
                                <ReactQuil
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
                            <Typography variant="h4" size="medium">Custom width*</Typography>
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
                                    required
                                    placeholder="Width *" variant="outlined" fullWidth
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
                                    onChange={handleChange}
                                    placeholder="Height *" variant="outlined" fullWidth
                                    required
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
                                    aria-required
                                    id="select-units"
                                    options={unitOptions}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField required {...params} label="Select Units" />}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xxl={6} xl={6} lg={12} sm={12} md={12} xs={12}>
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
                                        renderInput={(params) => <TextField required {...params} label="Select Specific Software" />}
                                    />
                                </FormControl>
                            </MDBox>
                        </Grid>
                        <Grid item xxl={3} xl={3} lg={12} md={12} xs={12} >
                            <MDBox>
                                <UploadFile
                                    id="customer-upload-image"
                                    add_files={add_files}
                                    upload_files={upload_files}
                                    handleFileUpload={handleFileUpload}
                                    removeFiles={removeFiles}
                                    isCloseIcon={true}
                                />
                            </MDBox>
                            <MDTypography
                                component="h5"
                                sx={{ color: '#b19d9db5', fontWeight: '300', fontSize: '12px', paddingTop: '10px' }}
                            >
                                Note : Only .png, .pdf, .jpg, .jpeg,<br />  .ai, .zip, .psd, .eps
                                formats are allowed <br />  Max Select 7
                            </MDTypography>

                        </Grid>
                        <Grid item xxl={9} xl={9} lg={12} md={12} xs={12} ml={-10} alignSelf={"flex-start"} sx={{
                            height: '124px',
                            overflowY: 'auto'
                        }} >
                            {add_files.length ? add_files.map((img, i) => (
                                <div style={deleteImageContainer} key={i}>
                                    <CloseIcon fontSize='medium' onClick={() => removeSingleFile(img)} sx={deleteImageSvgIcon} />
                                    <img
                                        src={img?.url}
                                        alt="upload-image"
                                        loading="lazy"
                                        style={uploadImageStyles}
                                    />
                                </div>

                            )) : null}
                            <>
                                {
                                    upload_files.length > 0 ? upload_files.map((file, index) => (
                                        <>
                                            {file.type.startsWith(aiLogo) || file.type.startsWith(psdfile) || file.type === "" || file.type.startsWith(zipfile) || file.type.startsWith(pdf) ? <OtherFilesShow key={index} file={file} deleteOtherSingleFile={deleteOtherSingleFile} /> : <></>}
                                        </>
                                    )) : null
                                }
                            </>
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <MDBox marginRight="100px" sx={!is768 ? {
                            marginRight: '-4px',
                            fontSize: '13px',
                            position: 'absolute !important',
                            bottom: '100px',
                            textAlign: 'center',
                            width: '82%',
                        } : {}}>
                            {uploadProgress > 0 && (
                                <>
                                    <p>Upload Progress: {uploadProgress}%</p>
                                    <progress value={uploadProgress} max="100"></progress>
                                </>
                            )}
                        </MDBox>
                        <Button onClick={handleClose} >Cancel</Button>
                        
                        <SubmitButton sx={{ color: 'white !important' }} disabled={loading} variant='contained' type='submit' 
                            endIcon={<MoonLoader loading={loading} size={18} color='#fff' />}
                        >
                            Submit &nbsp;&nbsp;
                        </SubmitButton>
                        {/* <SubmitButton sx={{ color: 'white !important' }} onClick={sendTestMessage}></SubmitButton> */}
                    </DialogActions>
                </Box>
            </DialogContent>

        </BootstrapDialog >
    )


}

export default CreateProject1

const SubmitButton = styled(Button)(({ theme: { palette } }) => ({
    color: 'white',
    "&.MuiButtonBase-root:disabled": {
        backgroundColor: '#007bff'
    }
}))

export const otherFileStyle = {
    width: '300px',
    height: '120px',
    // display : 'flex',
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
    padding: 3,
    marginRight: '8px',
    cursor: 'pointer',
    border: '1px solid #333',
    maxWidth: '100px',
    maxHeight: '100px',
    width: '100px',
    height: 'auto',
}
const closeIconStyles = {
    verticalAlign: 'middle', marginLeft: '8px',
    borderRadius: '10px', backgroundColor: 'Highlight',
    width: '20px',
    height: '20px',
    fill: '#fff',
    cursor: 'pointer',
    right: '20px'
}

const deleteImageContainer = {
    position: 'relative',
    display: 'inline-block'
    // width: '125px',
}

const deleteImageSvgIcon = {
    borderRadius: '20px',
    padding: '4px',
    position: 'absolute',
    right: '1px',
    top: '-13px',
    backgroundColor: '#ccccccba',
    cursor: 'pointer',
}
