import React, { useEffect, useState } from 'react'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import ArrowForward from '@mui/icons-material/ArrowForward';
import MoonLoader from 'react-spinners/MoonLoader'
import { styled } from '@mui/material/styles'
import MDTypography from 'components/MDTypography'
import MDButton from 'components/MDButton'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import { Grid } from '@mui/material'
import MDBox from 'components/MDBox'
import MDInput from 'components/MDInput'
import { useSelector } from 'react-redux'
import { Close, PictureAsPdf, RemoveCircle, Download } from '@mui/icons-material'
import apiClient from 'api/apiClient'
import { useDispatch } from 'react-redux'
import { getNew_Brand } from 'redux/actions/actions'
import ReactQuil from 'react-quill'
import AiLogo from 'assets/mi-banana-icons/ai-logo.png'
import fileImage from 'assets/mi-banana-icons/file-image.png'
import { modules } from 'assets/react-quill-settings/react-quill-settings'
import { reactQuillStyles } from 'assets/react-quill-settings/react-quill-settings'
import { formats } from 'assets/react-quill-settings/react-quill-settings'

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



const EditBrand = ({
    onChange,
    onClose,
    fileRef,
    open,
    formValue,
    setFormValue,
    openErrorSB,
    openSuccessSB,
    setRespMessage,
    editAddMoreImages,
    editMoreImage,
    handleFileUploadEdit,
    setEditMoreImages,
    removeEditFiles,
    getDescriptionText,
}) => {
    const [loading, setLoading] = useState(false)
    const currentid = useSelector(state => state.currentBrandId)
    const customerBrand = useSelector(state => state.customerBrand)
    const iseditBrand = useSelector(state => state.iseditBrand)
    const [deleteFiles, setDeleteFiles] = useState([])
    const name = useSelector(state => state.userDetails.name)
    const dispatch = useDispatch()
    const new_brand = useSelector(state => state.new_brand)
    const quillClasses = reactQuillStyles();


    let Jpg = "image/jpg"
    let Jpeg = "image/jpeg"
    let Svg = "image/svg+xml"
    let Png = "image/png"
    let pdf = "application/pdf"
    let aiLogo = "application/postscript"
    let psdfile = "image/vnd.adobe.photoshop"


    async function handleUpateFiles() {
        setLoading(true)
        const data = {
            ...formValue,
            name: name,
            files_name: deleteFiles,
        }
        await apiClient.patch('/api/brand', data)
            .then(async ({ data }) => {
                const { message } = data
                setRespMessage(message)
                dispatch(getNew_Brand(!new_brand))
                setLoading(false)
                if (editMoreImage.length > 0) {
                    setLoading(true)
                    const formdata = new FormData()
                    formdata.append('brandName', formValue.brand_name)
                    formdata.append('brand_id', formValue?._id)
                    for (let u = 0; u < editMoreImage?.length; u++) {
                        formdata.append('files', editMoreImage[u])
                    }
                    await apiClient.post('/api/add-more-files/' + formValue?.user, formdata).then(resp => {
                        console.log(resp?.data?.message)
                        setEditMoreImages([])
                        setTimeout(() => {
                            dispatch(getNew_Brand(!new_brand))
                        }, 1000)
                        setLoading(false)
                    }).catch(err => {
                        console.log("found error")
                        setLoading(false)
                    })
                }
                setTimeout(() => {
                    openSuccessSB()
                }, 800)
            })
            .catch(err => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setLoading(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 800)
                    return
                }
                setRespMessage(err.message)
                setLoading(false)
                setTimeout(() => {
                    openErrorSB()
                }, 800)
            })
    }

    function downloadImage(url) {
        window.open(url, '_blank')
    }

    function handleDeleteFiles(name) {
        setDeleteFiles(prev => [...prev, name])
    }
    function removeDeleteFiles(item) {
        setDeleteFiles(deleteFiles.filter(name => name !== item))
    }

    useEffect(() => {
        const filterBrand = customerBrand?.find(item => item._id === currentid)
        console.log(filterBrand)
        setFormValue({ ...filterBrand })

    }, [])

    console.log(iseditBrand, " ", currentid, " ", formValue)
    return (
        <BrandModal open={open} sx={{ width: '100% !important' }} >
            <DialogTitle display={"flex"} position={"relative"} width={'100%'} justifyContent={"space-between"} alignItems={"center"}>
                <MDTypography color="dark" fontWeight="bold">Edit Brand Details</MDTypography>
                <MDButton
                    onClick={onClose}
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
                            <MDInput type="text" name="brand_name" value={formValue.brand_name} placeholder="Brand Name" variant="outlined" fullWidth onChange={onChange} />
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
                            {/* <textarea style={textareaStyles}
                                type="text" rows={5} cols={100} name="brand_description" value={formValue.brand_description} onChange={onChange} placeholder="Brand Description and links" variant="outlined" /> */}
                            <ReactQuil
                                theme="snow"
                                onChange={getDescriptionText}
                                modules={modules}
                                value={formValue.brand_description}
                                formats={formats}
                                className={quillClasses.quill}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='website'>Website</label>
                            <MDInput type="text" name="web_url" value={formValue.web_url} placeholder="Website url" variant="outlined" fullWidth onChange={onChange} />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='facebook'>Facebook</label>
                            <MDInput type="text" name="facebook_url" value={formValue.facebook_url} placeholder="Facebook profile url" variant="outlined" fullWidth onChange={onChange} />
                        </MDBox>
                    </Grid>

                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='instagram'>Instagram</label>
                            <MDInput type="text" name="instagram_url" value={formValue.instagram_url} placeholder="Instagram url" variant="outlined" fullWidth onChange={onChange} />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='twitter'>Twitter</label>
                            <MDInput type="text" name="twitter_url" value={formValue.twitter_url} placeholder="Twitter profile url" variant="outlined" fullWidth onChange={onChange} />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='linkedin'>Linkedin</label>
                            <MDInput type="text" name="linkedin_url" value={formValue.linkedin_url} placeholder="Linkedin url" variant="outlined" fullWidth onChange={onChange} />
                        </MDBox>
                        <MDTypography variant="span" fontSize="small">This will help us to know your brand more</MDTypography>
                    </Grid>
                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                        <MDBox>
                            <label style={Styles} htmlFor='tiktok'>TikTok</label>
                            <MDInput type="text" name="tiktok_url" value={formValue.tiktok_url} placeholder="Tiktok profile url" variant="outlined" fullWidth onChange={onChange} />
                        </MDBox>
                    </Grid>
                    <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                        <MDTypography variant="h4" px={2} py={0} fontSize="large" fontWeight="bold">Brand Images</MDTypography>
                        <Grid container spacing={2} margin={0} justifyContent={formValue?.files?.length === 2 ? "center" : "space-between"}
                            sx={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', overflowY: 'scroll', height: '260px' }}
                        >
                            {formValue?.files?.length > 0 ? formValue?.files?.map((item) => {
                                return (
                                    <Grid item xxl={3} xl={3} display={'flex'} gap={'10px'} justifyContent={"center"} flexDirection={'column'} alignItems={'center'} position={"relative"}>
                                        {
                                            item?.type?.startsWith(Jpg) || item?.type?.startsWith(Png) || item?.type?.startsWith(Svg) || item?.type?.startsWith(Jpeg) ? (
                                                <>
                                                    {deleteFiles?.includes(item.name) ? (
                                                        <RemoveCircle fontSize='medium' sx={{ position: 'absolute', top: '0px', right: '-5px', background: '#ddd', borderRadius: '20px', cursor: 'pointer', transition: 'all.4s ease-in' }} onClick={() => removeDeleteFiles(item.name)} />
                                                    ) : (
                                                        <Close fontSize='medium' sx={{ position: 'absolute', top: '0px', right: '-5px', background: '#ddd', borderRadius: '20px', cursor: 'pointer', transition: 'all.4s ease-in' }} onClick={() => handleDeleteFiles(item.name)} />
                                                    )}
                                                    <img src={item.url} width={100} height={100} loading='lazy' style={{ cursor: 'pointer' }} onClick={() => window.open(item.url, '_blank')} />
                                                    <span style={{ fontSize: '12px', color: '#333' }}>{item.name}</span>
                                                    <Download fontSize='large' sx={{ cursor: 'pointer' }} onClick={() => downloadImage(item.download_link)} />
                                                </>
                                            ) : item?.type?.startsWith(aiLogo) ? (
                                                <>
                                                    {deleteFiles?.includes(item.name) ? (
                                                        <RemoveCircle fontSize='medium' sx={{ position: 'absolute', top: '0px', right: '-5px', background: '#ddd', borderRadius: '20px', cursor: 'pointer', transition: 'all.4s ease-in' }} onClick={() => removeDeleteFiles(item.name)} />
                                                    ) : (
                                                        <Close fontSize='medium' sx={{ position: 'absolute', top: '0px', right: '-5px', background: '#ddd', borderRadius: '20px', cursor: 'pointer', transition: 'all.4s ease-in' }} onClick={() => handleDeleteFiles(item.name)} />
                                                    )}
                                                    <img src={AiLogo} width={100} height={100} loading='lazy' style={{ cursor: 'pointer' }} onClick={() => window.open(item.url, '_blank')} />
                                                    <span style={{ fontSize: '12px', color: '#333' }}>{item.name}</span>
                                                    <Download fontSize='large' sx={{ cursor: 'pointer' }} onClick={() => downloadImage(item.download_link)} />
                                                </>
                                            ) : item?.type?.startsWith(pdf) ?
                                                (<>
                                                    {deleteFiles?.includes(item.name) ? (
                                                        <RemoveCircle fontSize='medium' sx={{ position: 'absolute', top: '0px', right: '-5px', background: '#ddd', borderRadius: '20px', transition: 'all.4s ease-in', cursor: 'pointer' }} onClick={() => removeDeleteFiles(item.name)} />
                                                    ) : (
                                                        <Close fontSize='medium' sx={{ position: 'absolute', top: '0px !important', right: '-5px', background: '#ddd', borderRadius: '20px', cursor: 'pointer', transition: 'all.4s ease-in' }} onClick={() => handleDeleteFiles(item.name)} />
                                                    )}
                                                    <PictureAsPdf sx={{
                                                        fontSize: '4rem !important',
                                                    }} />
                                                    <span style={{ fontSize: '12px', color: '#333' }}>{item.name}</span>
                                                    <Download fontSize='large' sx={{ cursor: 'pointer' }} onClick={() => downloadImage(item.download_link)} />
                                                </>)
                                                : item.type?.includes(psdfile) ?
                                                    (<>
                                                        {deleteFiles?.includes(item.name) ? (
                                                            <RemoveCircle fontSize='medium' sx={{ position: 'absolute', top: '0px', right: '-5px', background: '#ddd', borderRadius: '20px', cursor: 'pointer', transition: 'all.4s ease-in' }} onClick={() => removeDeleteFiles(item.name)} />
                                                        ) : (
                                                            <Close fontSize='medium' sx={{ position: 'absolute', top: '0px', right: '-5px', background: '#ddd', borderRadius: '20px', cursor: 'pointer', transition: 'all.4s ease-in' }} onClick={() => handleDeleteFiles(item.name)} />
                                                        )}
                                                        <img src={fileImage} width={100} height={100} loading='lazy' style={{ cursor: 'pointer' }} onClick={() => window.open(item.url, '_blank')} />
                                                        <span style={{ fontSize: '12px', color: '#333' }}>{item.name}</span>
                                                        <Download fontSize='large' sx={{ cursor: 'pointer' }} onClick={() => downloadImage(item.download_link)} />

                                                    </>) : (
                                                        <>
                                                            {deleteFiles?.includes(item.name) ? (
                                                                <RemoveCircle fontSize='medium' sx={{ position: 'absolute', top: '0px', right: '-5px', background: '#ddd', borderRadius: '20px', cursor: 'pointer', transition: 'all.4s ease-in' }} onClick={() => removeDeleteFiles(item.name)} />
                                                            ) : (
                                                                <Close fontSize='medium' sx={{ position: 'absolute', top: '0px', right: '-5px', background: '#ddd', borderRadius: '20px', cursor: 'pointer', transition: 'all.4s ease-in' }} onClick={() => handleDeleteFiles(item.name)} />
                                                            )}
                                                            <img src={fileImage} width={100} height={100} loading='lazy' style={{ cursor: 'pointer' }} onClick={() => window.open(item.url, '_blank')} />
                                                            <span style={{ fontSize: '12px', color: '#333' }}>{item.name}</span>
                                                            <Download fontSize='large' sx={{ cursor: 'pointer' }} onClick={() => downloadImage(item.download_link)} />

                                                        </>)
                                        }
                                    </Grid>
                                )
                            }) : <p>No files found</p>}
                            {/* // top: formValue?.files?.length === 2 ? '0px' : undefined  */}

                        </Grid>
                    </Grid>
                    <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                        <h6 style={{ color: "red", fontSize: '13px', alignSelf: "flex-start", fontWeight: '400', fontFamily: 'sans-serif' }}>Select up to 5 more files</h6>
                    </Grid>
                    <Grid item xxl={12} xl={12} lg={12} xs={12} md={12} >
                        <MDBox display="flex" gap="10px" flexWrap={"wrap"}>
                            {editMoreImage?.length > 0 ? editMoreImage.map(file => (
                                <MDBox sx={{ cursor: "pointer", transition: '.8s padding ease-in', }} {...addImagesFlexContainer}>
                                    <div>{file.name}</div>
                                    <Close fontSize="medium" onClick={() => removeEditFiles(file)} />
                                </MDBox>
                            )) : null}
                        </MDBox>
                    </Grid>
                    <Grid item xxl={12} xl={12}>
                        <label htmlFor='add-more' style={{ position: 'relative', cursor: 'pointer' }}>
                            <MDButton
                                py={1}
                                height="10px"
                                color="dark"
                                type="button"
                                onClick={editAddMoreImages}
                                sx={{ ...buttonStyles, color: "#fff", width: 'auto' }}
                            >
                                Upload More..
                            </MDButton>
                            <input
                                type="file"
                                sx={uploadImage}
                                ref={fileRef}
                                accept=".png, .jpg, .jpeg, .svg, .pdf, .ai, .eps, .psd, .indd"
                                name="add_more"
                                id="add-more"
                                multiple={true}
                                hidden
                                onChange={handleFileUploadEdit}
                            />
                        </label>
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
                        onClick={handleUpateFiles}
                        size="large"
                        color="warning"
                        sx={{
                            ...buttonStyles,
                            ...submitButton
                        }}>
                        Update
                    </MDButton>
                </DialogActions>
            </DialogContent >
        </BrandModal >
    )
}

export default EditBrand


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
const addImagesFlexContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    bgColor: "#ccc",
    borderRadius: '25px',
    p: "6px 12px",
    gap: "10px",
    m: "4px",
}
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