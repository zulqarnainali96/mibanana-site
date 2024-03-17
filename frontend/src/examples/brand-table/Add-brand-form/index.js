import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import React, { useEffect, useRef, useState } from 'react'
import MDButton from 'components/MDButton'
import Grid from '@mui/material/Grid'
import { Close, CloseOutlined, Remove } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import MDInput from 'components/MDInput'
import PropTypes from 'prop-types'
import MDTypography from 'components/MDTypography'
import MDBox from 'components/MDBox'
import { Checkbox, DialogActions, Divider, FormControlLabel } from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward';
import MoonLoader from 'react-spinners/MoonLoader'
import { makeStyles } from '@mui/styles'
import ReactQuil from 'react-quill'
import { reactQuillStyles } from 'assets/react-quill-settings/react-quill-settings'
import { formats, modules } from 'assets/react-quill-settings/react-quill-settings'
import useBrandData from '../useBrandData'

const BrandModal = styled(Dialog)(({ theme }) => ({
    // '& .MuiInputBase-root': {
    //     paddingBlock: '15px'
    // },
    '& .MuiPaper-root': {
        maxWidth: '45% !important'
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        width: "100% !important"
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
        width: "100%"
    },
    '& .css-bec2k4-MuiButtonBase-root-MuiButton-root svg': {
        fontSize: '1.4rem !important'
    },
}))

const AlignGrid = styled(Grid)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    "& > .MuiSvgIcon-root": {
        fill: '#adff2f',
    },
    cursor: 'pointer'
}))

// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const BrandForm = (props) => {
    const {
        openAddModal,
        onChangeText,
        closeAddBrandModal,
        handleFileUpload,
        image,
        addMoreField,
        setAddMore,
        addMore,
        loading,
        onSubmit,
        setImage,
        setFilesArray,
        filesArray,
        checkState,
        setCheckState,
        getDescriptionText, 
    } = props
    // const {
    //     // openAddModal,
    //     onChangeText,
    //     closeAddBrandModal,
    //     handleFileUpload,
    //     image,
    //     addMoreField,
    //     setAddMore,
    //     addMore,
    //     loading,
    //     onSubmit,
    //     setImage,
    //     setFilesArray,
    //     filesArray,
    //     checkState,
    //     setCheckState,
    //     getDescriptionText,

    // } = useBrandData
    const logoRef = useRef(null)
    const moodboard = useRef(null)
    const brandGuide = useRef(null)
    const isOthers = useRef(null)

    const removeImage = (name) => {
        setImage({ ...image, [name]: [] })
        setFilesArray(filesArray.filter(item => item.name !== name))
    }
    const removeAddField = (item) => {
        const index = addMoreField.indexOf(item)
        setAddMore(addMoreField.filter(more => addMoreField.indexOf(more) !== index))
        setFilesArray(filesArray.filter(list => list.name !== item.name))
    }
    const handleCheckboxes = (name) => {
        setCheckState({
            ...checkState,
            [name]: !checkState[name]
        })
    }
    const useStyles = makeStyles({
        checkedCheckbox: {
            '&.Mui-checked': {
                '&.MuiSvgIcon-root': {
                    backgroundImage: 'linear-gradient(red, green)',
                },
            }
        },
    });
    const classes = useStyles();
    const quillClasses = reactQuillStyles();

    const openLogo = (ref) => {
        ref.current.click()
    }

    useEffect(() => {
    }, [image])

    return (
        <BrandModal open={openAddModal} sx={{ width: '100% !important' }} >
            <DialogTitle display={"flex"} position={"relative"} width={'100%'} justifyContent={"space-between"} alignItems={"center"}>
                <MDTypography color="dark" fontWeight="bold">Add New Brand Details</MDTypography>
                <MDButton
                    onClick={closeAddBrandModal}
                    sx={{ position: "absolute", right: 4, padding: '1.4rem !important' }}
                >
                    <CloseOutlined sx={
                        {
                            fill: '#444'
                        }} />
                </MDButton>
                <Divider light={false} />
            </DialogTitle>
            <DialogContent>
                <Grid container component={"form"} spacing={2} justifyContent={"center"}>
                    <Grid item xxl={12} lg={12} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='Name'>Brand Name</label>
                            <MDInput type="text" name="brand_name" placeholder="Brand Name" variant="outlined" fullWidth onChange={onChangeText} />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={12} lg={12} xs={12} md={12}>
                        <MDBox
                            sx={{
                                display: "flex", flexDirection: "column",
                                "& > textarea:focus": {
                                    outline: 0,
                                }
                            }}>
                            <label style={Styles} htmlFor='brand_description'>Brand Description</label>
                            <ReactQuil
                                theme="snow"
                                onChange={getDescriptionText}
                                modules={modules}
                                formats={formats}
                                className={quillClasses.quill}
                            />
                            {/* <textarea style={textareaStyles}
                                type="text" rows={5} cols={100} name="brand_description" onChange={onChange} placeholder="Brand Description and links" variant="outlined" /> */}
                        </MDBox>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='website'>Website</label>
                            <MDInput type="text" name="web_url" placeholder="Website url" variant="outlined" fullWidth onChange={onChangeText} />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='facebook'>Facebook</label>
                            <MDInput type="text" name="facebook_url" placeholder="Facebook profile url" variant="outlined" fullWidth onChange={onChangeText} />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='instagram'>Instagram</label>
                            <MDInput type="text" name="instagram_url" placeholder="Instagram url" variant="outlined" fullWidth onChange={onChangeText} />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='twitter'>Twitter</label>
                            <MDInput type="text" name="twitter_url" placeholder="Twitter profile url" variant="outlined" fullWidth onChange={onChangeText} />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='linkedin'>Linkedin</label>
                            <MDInput type="text" name="linkedin_url" placeholder="Linkedin url" variant="outlined" fullWidth onChange={onChangeText} />
                        </MDBox>
                        <MDTypography variant="span" fontSize="small">This will help us to know your brand more</MDTypography>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='tiktok'>TikTok</label>
                            <MDInput type="text" name="tiktok_url" placeholder="Tiktok profile url" variant="outlined" fullWidth onChange={onChangeText} />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                        <MDTypography variant="h2" px={2} py={0} fontSize="large" fontWeight="bold">Upload Brand Materials</MDTypography>
                        <MDTypography variant="h6" px={2} py={0} sx={{ color: "#ccc", fontSize: "13px !important" }} fontWeight="bold">Max 7 files allowed</MDTypography>
                        <MDTypography variant="p" px={2} py={0} sx={{ color: "#ccc", fontSize: "12px !important" }}>allowed formats ai .eps .psd .jpg .png .pdf .svg</MDTypography>
                        <Grid container margin={1} justifyContent={"space-between"}
                            sx={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', overflowY: 'scroll', height: '260px' }}
                        >
                            <Grid item xxl={3} xl={3}>
                                <AlignGrid item xxl={4} xl={4} mb={1.5}>
                                    <FormControlLabel sx={{ mr: 0, ml: 0 }} control={<Checkbox
                                        // classes={{ checked: classes.checkedCheckbox }}
                                        checked={checkState?.isLogochk}
                                        sx={{
                                            width: 30,
                                            height: 30,
                                            marginRight: '0px',
                                            marginTop: '5px',

                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        onChange={() => handleCheckboxes('isLogochk')} />}
                                    />
                                    <label style={Styles} htmlFor='logo' aria-label='logo'>Logo</label>
                                </AlignGrid>
                                <AlignGrid item xxl={4} xl={4} mb={1.5}>
                                    <FormControlLabel sx={{ mr: 0, ml: 0 }} control={<Checkbox checked={checkState?.isMoodBoardchk} sx={{ width: 30, height: 30 }}
                                        onChange={() => handleCheckboxes('isMoodBoardchk')}
                                    />} />
                                    <label style={Styles} htmlFor='moodboard' aria-label='moodboard'>Moodboard</label>
                                </AlignGrid>
                                <AlignGrid item xxl={4} xl={4} mb={1.5}>
                                    <FormControlLabel sx={{ mr: 0, ml: 0 }} control={<Checkbox checked={checkState?.isBrandGuidechk} sx={{ width: 30, height: 30 }}
                                        onChange={() => handleCheckboxes('isBrandGuidechk')}
                                    />}
                                    />
                                    <label style={Styles} htmlFor='brand-guidelines' aria-label='guidelines'>Brand Guidelines</label>
                                </AlignGrid>
                                <AlignGrid item xxl={4} xl={4} mb={1.5}>
                                    <FormControlLabel sx={{ mr: 0, ml: 0 }} control={<Checkbox checked={checkState?.isothers} sx={{ width: 30, height: 30 }}
                                        onChange={() => handleCheckboxes('isothers')} />}
                                    />
                                    <label style={Styles} htmlFor='Others' aria-label='others'>Others</label>
                                </AlignGrid>
                            </Grid>
                            <Grid item xxl={9} xl={9} lg={9} mb={1.5}>
                                <AlignGrid item xxl={12} xl={12} lg={12} sx={{ height: '45px', position: 'relative' }}>
                                    {image?.upload_logo?.name ? <Close fontSize='medium'
                                        sx={{
                                            position: 'absolute', cursor: 'pointer',
                                            left: '-29px',
                                            fill: '#000 !important',
                                            background: '#adff2f',
                                            borderRadius: '20px',
                                            padding: '2px',
                                        }}
                                        onClick={() => removeImage('upload_logo')} /> : null}
                                    <MDBox display="flex" flexDirection="column">
                                        <MDInput
                                            type="text"
                                            sx={{
                                                ...inputStyles,
                                                "& fieldset": {
                                                    opacity: checkState?.isLogochk ? 1 : '0.2',
                                                    backgroundColor: '#cccccca1'
                                                },
                                            }}
                                            value={image?.upload_logo?.name ? image.upload_logo?.name : ''}
                                            disabled
                                        />
                                    </MDBox>
                                    &nbsp; &nbsp;
                                    <label htmlFor='upload-logo' style={{ position: 'relative' }}>
                                        <MDButton
                                            py={1}
                                            height="10px"
                                            color="warning"
                                            type="button"
                                            sx={buttonStyles}
                                            onClick={() => openLogo(logoRef)}
                                            disabled={!checkState?.isLogochk}
                                        >
                                            Upload Logo
                                        </MDButton>
                                        <input
                                            type="file"
                                            ref={logoRef}
                                            hidden={true}
                                            name="upload_logo"
                                            style={uploadImage}
                                            accept=".ai, .eps, .psd, .jpg, .png, .pdf, .svg"
                                            id="upload-logo"
                                            onChange={handleFileUpload}
                                            disabled={!checkState?.isLogochk}
                                        />
                                    </label>

                                </AlignGrid>
                                <AlignGrid item xxl={12} xl={12} lg={12} sx={{ height: '45px', position: 'relative' }}>
                                    {image?.upload_moodboard[0]?.name ? <Close fontSize='medium'
                                        sx={{
                                            position: 'absolute', cursor: 'pointer',
                                            left: '-29px',
                                            fill: '#000 !important',
                                            background: '#adff2f',
                                            borderRadius: '20px',
                                            padding: '2px',
                                        }}
                                        onClick={() => removeImage('upload_moodboard')} /> : null}
                                    <MDBox display="flex" flexDirection="column">
                                        <MDInput
                                            sx={{
                                                ...inputStyles,
                                                "& fieldset": {
                                                    opacity: checkState?.isMoodBoardchk ? 1 : '0.2',
                                                    backgroundColor: '#cccccca1'
                                                },
                                            }}
                                            value={image?.upload_moodboard.length ? image?.upload_moodboard[0]?.name : ''}
                                            disabled={!checkState?.isMoodBoardchk} />
                                    </MDBox>
                                    &nbsp; &nbsp;
                                    <label htmlFor='upload-moodboard' style={{ position: 'relative' }}>
                                        <MDButton
                                            py={1}
                                            height="10px"
                                            color="warning"
                                            type="button"
                                            sx={buttonStyles}
                                            onClick={() => openLogo(moodboard)}
                                            disabled={!checkState?.isMoodBoardchk}
                                        >
                                            Upload Moodboard
                                        </MDButton>
                                        <input
                                            type="file"
                                            ref={moodboard}
                                            hidden={true}
                                            style={uploadImage}
                                            accept=".ai, .eps, .psd, .jpg, .png, .pdf, .svg"
                                            name="upload_moodboard"
                                            id="upload-moodboard"
                                            onChange={handleFileUpload}
                                            disabled={!checkState?.isMoodBoardchk}
                                        />
                                    </label>
                                </AlignGrid>
                                <AlignGrid item xxl={12} xl={12} lg={12} sx={{ height: '45px', position: 'relative' }}>
                                    {image?.replace_brand_guidelines[0]?.name ? <Close fontSize='medium'
                                        sx={{
                                            position: 'absolute', cursor: 'pointer',
                                            left: '-29px',
                                            fill: '#000 !important',
                                            background: '#adff2f',
                                            borderRadius: '20px',
                                            padding: '2px',
                                        }}
                                        onClick={() => removeImage('replace_brand_guidelines')} /> : null}
                                    <MDBox display="flex" flexDirection="column">
                                        <MDInput
                                            sx={{
                                                ...inputStyles,
                                                "& fieldset": {
                                                    opacity: checkState?.isBrandGuidechk ? 1 : '0.2',
                                                    backgroundColor: '#cccccca1'
                                                },
                                            }}
                                            value={image?.replace_brand_guidelines.length ? image.replace_brand_guidelines[0]?.name : ''}
                                            disabled

                                        />
                                        {/* <span style={{ fontSize: '12px' }}>allowed file docx, pdf</span> */}
                                    </MDBox>
                                    &nbsp; &nbsp;
                                    <label htmlFor='replace-brand-guide-lines' style={{ position: 'relative' }}>
                                        <MDButton
                                            py={1}
                                            height="10px"
                                            color="warning"
                                            type="button"
                                            sx={buttonStyles}
                                            onClick={() => openLogo(brandGuide)}
                                            disabled={!checkState?.isBrandGuidechk}
                                        >
                                            Replace Brand Guidelines
                                        </MDButton>
                                        <input
                                            type="file"
                                            ref={brandGuide}
                                            hidden
                                            style={uploadImage}
                                            accept=".ai, .eps, .psd, .jpg, .png, .pdf, .svg"
                                            name="replace_brand_guidelines"
                                            id="upload-guide-lines"
                                            onChange={handleFileUpload}
                                            disabled={!checkState?.isBrandGuidechk}
                                        />
                                    </label>
                                </AlignGrid>
                                <AlignGrid item xxl={12} xl={12} lg={12} sx={{ height: '45px', position: 'relative' }}>
                                    {image?.upload_more[0]?.name ? <Close fontSize='medium'
                                        sx={{
                                            position: 'absolute', cursor: 'pointer',
                                            left: '-29px',
                                            fill: '#000 !important',
                                            background: '#adff2f',
                                            borderRadius: '20px',
                                            padding: '2px',
                                        }}
                                        onClick={() => removeImage('upload_more')} /> : null}
                                    <MDBox display="flex" flexDirection="column">
                                        <MDInput
                                            sx={{
                                                ...inputStyles,
                                                "& fieldset": {
                                                    opacity: checkState?.isothers ? 1 : '0.2',
                                                    backgroundColor: '#cccccca1'
                                                },
                                            }}
                                            value={image?.upload_more.length ? image?.upload_more[0]?.name : ''}
                                            disabled
                                        />
                                        {/* <span style={{ fontSize: '12px' }}>allowed any image formats</span> */}
                                    </MDBox>
                                    &nbsp; &nbsp;
                                    <label htmlFor='upload-more' style={{ position: 'relative' }}>
                                        <MDButton
                                            py={1}
                                            height="10px"
                                            color="warning"
                                            type="button"
                                            sx={buttonStyles}
                                            onClick={() => openLogo(isOthers)}
                                            disabled={!checkState?.isothers}
                                        >
                                            Upload More..
                                        </MDButton>
                                        <input
                                            type="file"
                                            ref={isOthers}
                                            hidden
                                            multiple
                                            style={uploadImage}
                                            accept=".ai, .eps, .psd, .jpg, .jpeg, .png, .pdf, .svg"
                                            name="upload_more"
                                            id="upload-more"
                                            onChange={handleFileUpload}
                                            disabled={!checkState?.isothers}
                                        />
                                    </label>
                                </AlignGrid>
                            </Grid>

                            {addMoreField?.length ? addMoreField.map((item, i) => {
                                let value = image[item.name]?.length ? image[item.name][0].name : ''
                                return (
                                    <React.Fragment key={i}>
                                        <Grid item xxl={3} xl={3}>
                                            <AlignGrid item xxl={4} xl={4} mb={1.5}>
                                                <Checkbox sx={{ width: 30, height: 30 }} defaultChecked />
                                                <label style={Styles} htmlFor={`logo${item.name}`} aria-label='logo'>{item.name}</label>
                                            </AlignGrid>
                                        </Grid>
                                        <Grid item xxl={9} xl={9} lg={9} mb={1.5}>
                                            <AlignGrid item xxl={12} xl={12} lg={12} sx={{ height: '45px', position: 'relative' }}>
                                                <Remove
                                                    fontSize='medium'
                                                    sx={{
                                                        position: 'absolute', cursor: 'pointer',
                                                        left: '-29px',
                                                        fill: '#000 !important',
                                                        background: '#adff2f',
                                                        borderRadius: '20px',
                                                        padding: '2px',
                                                        // top : '0px'
                                                    }}
                                                    onClick={() => removeAddField(item)} />
                                                <MDInput
                                                    sx={inputStyles}
                                                    type="text"
                                                    value={value}
                                                    disabled
                                                />
                                                &nbsp; &nbsp;
                                                <label htmlFor='upload-others' style={{ position: 'relative' }}>
                                                    <MDButton
                                                        py={1}
                                                        height="10px"
                                                        color="warning"
                                                        type="button"
                                                        sx={buttonStyles}
                                                    >
                                                        {item?.name}
                                                    </MDButton>
                                                    <MDInput
                                                        type="file"
                                                        hidden
                                                        name={item?.name}
                                                        onChange={handleFileUpload}
                                                        sx={uploadImage}
                                                        accept=".ai, .eps, .psd, .jpg, .png, .pdf, .svg"
                                                        id="upload-logo"
                                                    />
                                                </label>
                                            </AlignGrid>
                                        </Grid>
                                    </React.Fragment>
                                )
                            }) : null}

                            <Grid item xxl={12} xl={12}>
                                <MDButton
                                    py={1}
                                    height="20px"
                                    color="dark"
                                    onClick={addMore}
                                    type="button"
                                    sx={{ ...buttonStyles, color: "#fff", width: 'auto' }}
                                    disabled={addMoreField?.length >= 3}
                                >
                                    Add More
                                </MDButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <DialogActions>
                    <MDButton
                        type="button"
                        disabled={loading}
                        endIcon={<div
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ArrowForward fontSize='medium' />&nbsp;
                            <MoonLoader loading={loading} size={20} color='#121212' />
                        </div>}
                        onClick={onSubmit}
                        size="large"
                        color="warning"
                        sx={{
                            ...buttonStyles,
                            ...submitButton
                        }}>
                        Submit
                    </MDButton>
                </DialogActions>
            </DialogContent>
        </BrandModal >
    )
}

// BrandForm.prototype = {
//     state: PropTypes.object.isRequired,
//     open: PropTypes.bool.isRequired,
//     loading: PropTypes.bool.isRequired,
//     onChange: PropTypes.func.isRequired,
//     onClose: PropTypes.func.isRequired,
//     onSubmit: PropTypes.func.isRequired,

// }

const uploadImage = {
    position: 'absolute',
    left: 0,
    bottom: '-7px',
    // height: '44px',
    top: 0,
    height: '27px',
    opacity: 0,
    cursor: 'pointer',
}

const submitButton = {
    width: '150px',
    paddingBlock: '20px',
    borderRadius: '30px',
    fontSize: '16px',
    textTransform: 'capitalize',
    boxShadow: "none !important",
    "&:hover": {
        boxShadow: "3px 4px 2px 10px #ccc",
    }
}

const inputStyles = {
    // paddingBlock: '.8rem',
    borderRadius: '0px !important',

    "& > .MuiInputBase-root": {
        width: '300px',
        height: '24px',
    }
}
const buttonStyles = {
    width: '244px',
    fontSize: '12px',
    height: '0px',
    color: 'gray',
    minHeight: '25px',
    // "& label > .MuiButtonBase-root": {
    //     borderTopleftRadius: '0px !important',
    //     borderBottomleftRadius: '0px !important',
    // }
}
const Styles = {
    fontWeight: "bold",
    fontSize: "15px",
    marginLeft: 4,
    verticalAlign: 'middle'
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
export default BrandForm


{/* <Grid item xxl={3} xl={4} lg={5} md={6} xs={10} sx={{ background: 'white', boxShadow: "4px 3px 7px -2px #cccccc0d" }}>
<MDBox pt={4} pb={3} px={3} >
    <MDBox component="form" role="form" >
        <Grid container spacing={2}>
            <Grid item lg={6} xs={12} md={12}>
                <MDBox mb={2}>
                    <label style={Styles} htmlFor='Name'>Name</label>
                    <MDInput type="text" placeholder="Full Name" variant="outlined" fullWidth />
                </MDBox>
            </Grid>
            <Grid item lg={6} xs={12} md={12}>
                <MDBox mb={2}>
                    <label style={Styles} htmlFor='Email'>Email</label>
                    <MDInput type="email" placeholder="Email address" variant="outlined" fullWidth />
                </MDBox>
            </Grid>
        </Grid>
        <Grid container spacing={2}>
            <Grid item xxl={12} lg={12} xs={12} md={12}>
                <MDBox mb={2} sx={{ position: "relative" }}>
                    <label style={Styles} htmlFor='Password'>Password</label>
                    <MDInput type="text" placeholder="Password" variant="outlined" fullWidth />
                    <IconButton
                        // onClick={handleClickShowPassword}
                        sx={{
                            position: "absolute",
                            right: 0,
                        }}
                    >
                        {/* {showPassword ? <Visibility /> : <VisibilityOff />} */}
//             </IconButton>
//         </MDBox>
//     </Grid>
// </Grid>
// <Grid container>
//     <Grid item xl={12} xs={12} lg={12} md={12}>
//         <MDBox mb={2} sx={{ position: "relative" }}>
//             <label style={Styles} htmlFor='ConfirmPassword'>Confirm Password</label>
//             <MDInput type={"text"} placeholder="Confirm Password" variant="outlined" fullWidth />
//             <IconButton
//                 // onClick={handleClickConfirmPassword}
//                 sx={{
//                     position: "absolute",
//                     right: 0,
//                 }}
// >
{/* {showConfirmPassword ? <Visibility /> : <VisibilityOff />} */ }
// </IconButton>
// </MDBox>
// </Grid>
// </Grid>
{/* <MDBox display="flex" alignItems="center" ml={-1}>
            <Checkbox />
        </MDBox>
        <MDBox mt={4} mb={1} pt={3}>
            <MDButton type="submit" color="warning" fullWidth
                circular={true}
                sx={{
                    color: '#000 !important',
                    fontSize: 14,
                    textTransform: "capitalize"
                }}
            >
                Submit &nbsp; <ArrowForward fontSize='large' />

            </MDButton>
        </MDBox> */}

//     </MDBox>
// </MDBox>
// </Grid>