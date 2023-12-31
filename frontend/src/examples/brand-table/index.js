import Card from '@mui/material/Card'
import MDBox from 'components/MDBox'
import React, { useEffect, useRef, useState } from 'react'
import "./brand-table.css"
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Add from '@mui/icons-material/Add'
import BrandForm from './Add-brand-form'
import apiClient from 'api/apiClient'
import MDSnackbar from 'components/MDSnackbar'
import ProjectDataTable from 'examples/projectsTable'
import useBrandData from './brandData'
import MDTypography from 'components/MDTypography'
import { useDispatch } from 'react-redux'
import { getNew_Brand } from 'redux/actions/actions'
import { useSelector } from 'react-redux'
import { getBrandData } from 'redux/global/global-functions'
import reduxContainer from 'redux/containers/containers'
import EditBrand from './Edit-Brand/EditBrand'
import { openEditBrandModal } from 'redux/actions/actions'
import SuccessModal from 'components/SuccessBox/SuccessModal'
import NewProjectsTable from 'examples/new-table'
import { mibananaColor } from 'assets/new-images/colors'
import { fontsFamily } from 'assets/font-family'
import { styled } from '@mui/material'

const MIBrandTable = ({ reduxState, reduxActions }) => {
    const open = reduxState.openBrandModel
    const [loading, setLoading] = useState(false)
    const [other, setOther] = useState(1)
    const [addMoreField, setAddMore] = useState([])
    const [editMoreImage, setEditMoreImages] = useState([])
    const id = reduxState.userDetails.id
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);

    // State for Checkbox
    const [checkState, setCheckState] = useState({
        isLogochk: true,
        isMoodBoardchk: true,
        isBrandGuidechk: true,
        isothers: true,
    })
    const isDesignerAndManagerAdmin = reduxState.userDetails?.roles?.includes("Graphic-Designer") || reduxState.userDetails?.roles?.includes("Project-Manager") || reduxState.userDetails?.roles?.includes("Admin") ? true : false
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [respMessage, setRespMessage] = useState("")
    const fileRef = useRef(null)
    const [image, setImage] = useState({
        upload_logo: [],
        upload_moodboard: [],
        replace_brand_guidelines: [],
        upload_more: []
    })
    const { rows, columns } = useBrandData()
    const [formValue, setFormValue] = useState({
        brand_name: '', brand_description: '', web_url: '',
        facebook_url: '', instagram_url: '', twitter_url: '',
        linkedin_url: '', tiktok_url: ''
    })
    const dispatch = useDispatch()
    const userID = reduxState.userDetails.id
    const [filesArray, setFilesArray] = useState([])

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const closeBrandModal = () => dispatch(openEditBrandModal(false))
    const iseditBrand = useSelector(state => state.iseditBrand)

    const handleOpen = () => {
        // setOpen(true)
        reduxActions.openBrandModalFunc(true)
    }

    const handleClose = () => {
        // setOpen(false)
        reduxActions.openBrandModalFunc(false)
        setOther(1)
        setAddMore([])
    }

    const onhandleChange = (event) => {
        event.stopPropagation();
        const { name, value } = event.target
        setFormValue({
            ...formValue,
            [name]: value,
        })

    }
    const handleFileUpload = (event) => {
        if (!event.target.files.length) return
        const { name, files } = event.target
        setImage(prev => ({ ...prev, [name]: files }))
        setFilesArray(prev => [...prev, { name: name, files: files }])
    }
    const handleFileUploadEdit = (event) => {
        const files = event.target.files
        if (files?.length > 5) {
            alert("Only upload 5 files")
            setEditMoreImages([])
            return
        }
        for (let key = 0; key < files.length; key++) {
            const file = files[key]
            setEditMoreImages(prev => [...prev, file])
        }
    }

    useEffect(() => {
        if (editMoreImage.length > 5) {
            alert("Only upload 5 files")
            setEditMoreImages([])
            return
        }
    }, [editMoreImage])

    const removeEditFiles = (file) => {
        const result = editMoreImage.filter(item => item.name !== file.name)
        setEditMoreImages(result)
    }
    const addMore = () => {
        setOther(other + 1)
        setAddMore(prev => [...prev, {
            name: `others_${other}`,
            value: ''

        }])
        setImage({
            ...image,
            [`others_${other}`]: []
        })
    }
    const editAddMoreImages = () => {
        // setOther(other + 1)
        // setEditMoreImages(prev => [...prev, {
        //     name: `image_${other}`,
        //     value: ''
        // }])
        fileRef.current.click()
    }
    const onSubmit = async () => {
        setLoading(true)
        let formData = new FormData
        formData.append('brand_name', formValue.brand_name)
        formData.append('brand_description', formValue.brand_description)
        formData.append('web_url', formValue.web_url)
        formData.append('facebook_url', formValue.facebook_url)
        formData.append('instagram_url', formValue.instagram_url)
        formData.append('twitter_url', formValue.twitter_url)
        formData.append('linkedin_url', formValue.linkedin_url)
        formData.append('tiktok_url', formValue.tiktok_url)
        formData.append('user', reduxState.userDetails?.id)
        formData.append('name', reduxState.userDetails?.name)

        for (let i = 0; i < filesArray.length; i++) {

            formData.append('files', filesArray[i].files[0])
        }
        await apiClient.post("/api/brand", formData)
            .then(({ data }) => {
                setRespMessage(data?.message)
                dispatch(getNew_Brand(true))
                setLoading(false)
                // openSuccessSB()
                setAddMore([])
                setImage({
                    upload_logo: [],
                    upload_moodboard: [],
                    replace_brand_guidelines: [],
                    upload_more: [],
                })
                setFilesArray([])
                closeBrandModal()
                handleClose()
                setTimeout(() => {
                    setShowSuccessModal(true)
                    getBrandData(userID, reduxActions.getCustomerBrand)
                }, 700)

            })
            .catch((error) => {
                if (error?.response) {
                    // dispatch(getNew_Brand(!new_brand))
                    setRespMessage(error.response?.data?.message)
                    setLoading(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                    return
                }
                setLoading(false)
            })
        console.log(filesArray)
    }
    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title="Error"
            content={respMessage}
            dateTime={new Date().toLocaleTimeString('pk')}
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="SUCCESS"
            content={respMessage}
            dateTime={new Date().toLocaleTimeString('pk')}
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );
    const brandModelProps = {
        handleFileUpload, open,
        image, other, addMoreField,
        addMore, loading, onSubmit,
        setImage, setAddMore, setFilesArray,
        filesArray,
    }
    useEffect(() => {
        return () => {
            setAddMore([])
            setEditMoreImages([])
        }
    }, [])
    useEffect(() => {
    }, [reduxState.customerBrand])

    const BrandButton = styled(Button)(({ theme: { palette } }) => {
        const { primary } = palette
        return {
            backgroundColor: primary.main,
            fontFamily: fontsFamily.poppins,
            fontWeight: '400',
            borderRadius: 0,
            height: '100%',
            "&:hover": {
                backgroundColor: "#d9ba08",
            },
            "&:focus": {
                backgroundColor: "#d9ba08 !important",
            }
        }
    })
    return (
        <DashboardLayout>
            <BrandForm
                state={formValue}
                checkboxState={checkState}
                setCheckState={setCheckState}
                onChange={onhandleChange}
                onClose={handleClose}

                {...brandModelProps}
            />
            <EditBrand
                onChange={onhandleChange}
                onClose={closeBrandModal}
                open={iseditBrand}
                setFormValue={setFormValue}
                formValue={formValue}
                openErrorSB={openErrorSB}
                openSuccessSB={openSuccessSB}
                setRespMessage={setRespMessage}
                editAddMoreImages={editAddMoreImages}
                editMoreImage={editMoreImage}
                handleFileUploadEdit={handleFileUploadEdit}
                fileRef={fileRef}
                removeEditFiles={removeEditFiles}
                setEditMoreImages={setEditMoreImages}
            />
            <SuccessModal
                msg={respMessage}
                open={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                width="30%"
                color="#288e28"
                title="SUCCESS"
                sideRadius={false}
            />
            <MDBox ml={4} pt={2} pb={3}>
                <Grid container pt={isDesignerAndManagerAdmin && "0px"} justifyContent={"flex-end"} alignItems={"center"} spacing={2}>
                    <Grid item xxl={12} xl={12} md={12} xs={12}>
                        <Grid container alignItems={"center"} justifyContent={"space-around"}>
                            <Grid item xxl={isDesignerAndManagerAdmin ? 12 : 6} xl={isDesignerAndManagerAdmin ? 12 : 6}>
                                <MDTypography sx={titleStyles}>miBrands</MDTypography>
                            </Grid>
                            {isDesignerAndManagerAdmin ? null :
                                (<Grid item xxl={6} xl={6}>
                                    <MDBox width={"100%"} sx={{ textAlign: "right", paddingInline: '32px' }}>
                                        <BrandButton
                                            variant="contained"
                                            size='medium'
                                            disableFocusRipple
                                            type="button"
                                            startIcon={<Add cursor={"pointer"} fontSize='large'
                                                sx={{
                                                    fontSize: '1.3rem !important',
                                                    display: 'inline-flex'
                                                }} />}
                                            onClick={handleOpen}
                                        >
                                            ADD Brand
                                        </BrandButton>
                                    </MDBox>

                                </Grid>
                                )}
                        </Grid>
                    </Grid>
                    <Grid item xxl={12} xl={12} lg={12} md={12} xs={12}>
                        <Card sx={{ width: "98%", mt: '20px' }}>
                            <NewProjectsTable
                                table={{ columns, rows }}
                                entriesPerPage={{ defaultValue: 5 }}
                                showTotalEntries={true}
                                pagination={{ variant: 'contained', color: "warning" }}
                                noEndBorder={false}
                                canSearch={false}
                                isSorted={false}
                            />
                            {!rows?.length ? <MDTypography textAlign="center" p={1} component="h4">No Brands Found</MDTypography> : null}
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            {renderErrorSB}
            {renderSuccessSB}
        </DashboardLayout>


    )
}

export default reduxContainer(MIBrandTable)

const titleStyles = {
    fontSize: '3rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}