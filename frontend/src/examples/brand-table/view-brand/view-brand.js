import { ArrowBack, ContentCopy, Download, PictureAsPdf } from '@mui/icons-material'
import { Grid, IconButton, TextField } from '@mui/material'
import apiClient from 'api/apiClient'
import { fontsFamily } from 'assets/font-family'
import { mibananaColor } from 'assets/new-images/colors'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDSnackbar from 'components/MDSnackbar'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MoonLoader } from 'react-spinners'
import AiLogo from 'assets/mi-banana-icons/ai-logo.png'
import fileImage from 'assets/mi-banana-icons/file-image.png'
import reduxContainer from 'redux/containers/containers'
import "../brand-table.css"

let Jpg = "image/jpg"
let Jpeg = "image/jpeg"
let Svg = "image/svg+xml"
let Png = "image/png"
let pdf = "application/pdf"
let aiLogo = "application/postscript"
let psdfile = "image/vnd.adobe.photoshop"


const ViewBrand = ({ reduxState, onChange }) => {
    const { id } = useParams()
    const form1 = useRef(null);
    const form2 = useRef(null);
    const form3 = useRef(null);
    const form4 = useRef(null);
    const form5 = useRef(null);
    const form6 = useRef(null);
    const form7 = useRef(null);
    const form8 = useRef(null);

    const navigate = useNavigate()
    const [formValue, setFormValue] = useState({
        brand_name: '', brand_description: '', web_url: '',
        facebook_url: '', instagram_url: '', twitter_url: '',
        linkedin_url: '', tiktok_url: ''
    })

    function downloadImage(url) {
        window.open(url, '_blank')
    }
    const copyText = (ref) => {
        if (ref.current) {
            navigator.clipboard.writeText(ref.current.value)
                .then(() => { })
                .catch(err => { });
        }
    };
    const copyBrandDescriptionText = () => {
        navigator.clipboard.writeText(formValue?.brand_description)
            .then(() => {  })
            .catch(err => {alert("failed to copy text") });
    }

    const currentBrand = reduxState.customerBrand?.find(item => item._id === id)
    useEffect(() => {
        setFormValue({
            ...formValue,
            ...currentBrand
        })

    }, [id])

    return (
        <DashboardLayout>
            <MDBox pt={2} pb={0}>
                <Grid container >
                    <Grid item xxl={10} xl={10} lg={10} md={12} xs={12} sx={{ background: 'white', boxShadow: "4px 3px 7px -2px #cccccc0d", marginLeft: '8px' }}>
                        <MDBox pt={4} pb={3} px={3} >
                            <MDBox component="form" role="form" >
                                <IconButton title='go back' onClick={() => navigate("/mi-brands")}>
                                    <ArrowBack fontSize='medium' />
                                </IconButton>
                                <MDTypography sx={titleStyles}>Current Brand</MDTypography>
                                <Grid container spacing={2}>
                                    <Grid item xxl={6} lg={6} sm={12} xs={12} md={12}>
                                        <MDBox sx={contInput}>
                                            <label style={Styles} htmlFor='Name'>Brand Name</label>
                                            <input
                                                type='text'
                                                placeholder='Brand Name'
                                                value={formValue.brand_name}
                                                name="brand_name"
                                                style={inputStyle}
                                                ref={form1}
                                                disabled
                                                className='formstyle'
                                            />
                                            <ContentCopy fontSize="medium" sx={copySvg} onClick={() => copyText(form1)} />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} lg={6} sm={12} xs={12} md={12}>
                                        <MDBox sx={contInput}>
                                            <label style={Styles} htmlFor='website'>Website</label>
                                            <input
                                                type='text'
                                                placeholder="Website url"
                                                value={formValue.web_url}
                                                name="web_url"
                                                style={inputStyle}
                                                ref={form2}
                                                disabled
                                                className='formstyle'
                                            />
                                            <ContentCopy fontSize="medium" sx={copySvg} onClick={() => copyText(form2)} />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                                        <MDBox sx={contInput}>
                                            <label style={Styles} htmlFor='facebook'>Facebook</label>
                                            <input
                                                type="text"
                                                placeholder="Facebook profile url"
                                                value={formValue.facebook_url}
                                                name="facebook_url"
                                                style={inputStyle}
                                                ref={form3}
                                                disabled
                                                className='formstyle'
                                            />
                                            <ContentCopy fontSize="medium" sx={copySvg} onClick={() => copyText(form3)} />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                                        <MDBox sx={contInput}>
                                            <label style={Styles} htmlFor='instagram'>Instagram</label>
                                            <input
                                                type="text"
                                                placeholder="Instagram url"
                                                value={formValue.instagram_url}
                                                name="instagram_url"
                                                style={inputStyle}
                                                ref={form4}
                                                disabled
                                                className='formstyle'
                                            />

                                            <ContentCopy fontSize="medium" sx={copySvg} onClick={() => copyText(form4)} />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                                        <MDBox sx={contInput}>
                                            <label style={Styles} htmlFor='twitter'>Twitter</label>
                                            <input
                                                type="text"
                                                placeholder="Twitter profile url"
                                                value={formValue.twitter_url}
                                                name="twitter_url"
                                                style={inputStyle}
                                                ref={form5}
                                                disabled
                                                className='formstyle'
                                            />
                                            <ContentCopy fontSize="medium" sx={copySvg} onClick={() => copyText(form5)} />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                                        <MDBox sx={contInput}>
                                            <label style={Styles} htmlFor='linkedin'>Linkedin</label>
                                            <input
                                                type="text"
                                                placeholder="Linkedin url"
                                                value={formValue.linkedin_url}
                                                name="linkedin_url"
                                                style={inputStyle}
                                                ref={form6}
                                                disabled
                                                className='formstyle'

                                            />
                                            <ContentCopy fontSize="medium" sx={copySvg} onClick={() => copyText(form6)} />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} lg={6} xs={12} md={12}>
                                        <MDBox sx={contInput}>
                                            <label style={Styles} htmlFor='tiktok'>TikTok</label>
                                            <input
                                                type="text"
                                                placeholder="Tiktok profile url"
                                                value={formValue.tiktok_url}
                                                name="tiktok_url"
                                                style={inputStyle}
                                                ref={form7}
                                                disabled
                                                className='formstyle'
                                            />
                                            <ContentCopy fontSize="medium" sx={copySvg} onClick={() => copyText(form7)} />
                                        </MDBox>
                                    </Grid>

                                    <Grid item xxl={12} lg={12} xs={12} md={12}>
                                        <MDBox
                                            sx={{
                                                ...contInput,
                                                display: "flex", flexDirection: "column",
                                                "& > textarea:focus": {
                                                    outline: 0,
                                                }
                                            }}>
                                            <label style={Styles} htmlFor='brand_description'>Brand Description</label>
                                            {/* <textarea 
                                                style={textareaStyles}
                                                value={formValue.brand_description}
                                                dangerouslySetInnerHTML={{__html:formValue.brand_description}}
                                                ref={form8}
                                                type="text"
                                                disabled
                                                className='formstyle'
                                                rows={5}
                                                cols={100}
                                                name="brand_description"
                                                placeholder="Brand Description and links"
                                            /> */}
                                            <MDBox
                                                sx={textareaStyles}
                                                dangerouslySetInnerHTML={{ __html: formValue?.brand_description }}
                                            >
                                            </MDBox>
                                            <ContentCopy fontSize="medium" sx={{ ...copySvg, right: 9 }} onClick={copyBrandDescriptionText} />
                                        </MDBox>
                                    </Grid>
                                    <Grid item pt={"20px"} xxl={12} lg={12} sm={12} xs={12} md={12}>
                                        <Grid container spacing={1}
                                            sx={{
                                                overflowY: 'auto',
                                                height: '140px',
                                                border: '1px solid #ccc',
                                                borderRadius: '11px',
                                                marginInline: '-3px',
                                            }}>
                                            {formValue?.files?.length > 0 ? formValue?.files?.map((item) => {
                                                return (
                                                    <Grid item xxl={3} xl={3} display={'flex'} gap={'10px'} justifyContent={"center"} flexDirection={'column'} alignItems={'center'} position={"relative"}>
                                                        {
                                                            item?.type?.startsWith(Jpg) || item?.type?.startsWith(Png) || item?.type?.startsWith(Svg) || item?.type?.startsWith(Jpeg) ? (
                                                                <>
                                                                    <img src={item.url} width={70} height={70} loading='lazy' style={imageStyles} onClick={() => window.open(item.url, '_blank')} />
                                                                    <span style={{ fontSize: '12px', color: '#333' }}>{item.name}</span>
                                                                    <Download fontSize='small' sx={{ cursor: 'pointer' }} onClick={() => downloadImage(item.download_link)} />
                                                                </>
                                                            ) : item?.type?.startsWith(aiLogo) ? (
                                                                <>
                                                                    <img src={AiLogo} width={70} height={70} loading='lazy' style={imageStyles} onClick={() => window.open(item.url, '_blank')} />
                                                                    <span style={{ fontSize: '12px', color: '#333' }}>{item.name}</span>
                                                                    <Download fontSize='small' sx={{ cursor: 'pointer' }} onClick={() => downloadImage(item.download_link)} />
                                                                </>
                                                            ) : item?.type?.startsWith(pdf) ?
                                                                (<>
                                                                    <PictureAsPdf sx={{
                                                                        fontSize: '4rem !important',
                                                                    }} />
                                                                    <span style={{ fontSize: '12px', color: '#333' }}>{item.name}</span>
                                                                    <Download fontSize='small' sx={{ cursor: 'pointer' }} onClick={() => downloadImage(item.download_link)} />
                                                                </>)
                                                                : item.type?.includes(psdfile) ?
                                                                    (<>
                                                                        <img src={fileImage} width={70} height={70} loading='lazy' style={imageStyles} onClick={() => window.open(item.url, '_blank')} />
                                                                        <span style={{ fontSize: '12px', color: '#333' }}>{item.name}</span>
                                                                        <Download fontSize='small' sx={{ cursor: 'pointer' }} onClick={() => downloadImage(item.download_link)} />

                                                                    </>) : (
                                                                        <>
                                                                            <img src={fileImage} width={70} height={70} loading='lazy' style={imageStyles} onClick={() => window.open(item.url, '_blank')} />
                                                                            <span style={{ fontSize: '12px', color: '#333' }}>{item.name}</span>
                                                                            <Download fontSize='small' sx={{ cursor: 'pointer' }} onClick={() => downloadImage(item.download_link)} />

                                                                        </>)
                                                        }
                                                    </Grid>
                                                )
                                            }) : <p>No images found</p>}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    )
}

const Styles = {
    fontWeight: "bold",
    fontSize: "15px",
    marginLeft: 4,
    fontFamily: fontsFamily.poppins,
    color: mibananaColor.yellowColorTextColor,
    fontWeight: 'bold',
}
const imageStyles = {
    maxWidth: '100px',
    maxHeight: '100px',
    height: 'auto',
    width: '100px',
    cursor: 'pointer',
}

const colorRed = {
    color: 'red'
}

const titleStyles = {
    fontSize: '2rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}

const textareaStyles = {
    padding: '10px',
    height: '160px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontFamily: fontsFamily.poppins,
    fontSize: '15px',
    backgroundColor: 'transparent',
    fontWeight: '300',
    paddingInline: '25px',
    overflowY: 'auto'
}
const inputStyle = {
    position: 'relative',
    width: '100%',
    fontFamily: fontsFamily.poppins,
    fontWeight: '300',
    fontSize: '16px !important',
    border: '1px solid #ccc',
}
const contInput = {
    position: "relative"
}
const copySvg = {
    position: 'absolute',
    top: '30px',
    right: '10px',
    cursor: 'pointer',
    "&:hover": {
        fill: '#ccc'
    },
    "&:active": {
        fill: '#444'
    }
}

export default reduxContainer(ViewBrand)
