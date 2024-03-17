import styled from '@emotion/styled'
import { Button } from '@mui/material'
import apiClient from 'api/apiClient'
import { fontsFamily } from 'assets/font-family'
import MDSnackbar from 'components/MDSnackbar'
import React, { useState, useRef, useEffect } from 'react'
import { currentUserRole } from 'redux/global/global-functions'
import { getBrandData } from 'redux/global/global-functions'

const useBrandData = (props) => {
    const { reduxState, reduxActions } = props

    const userID = reduxState.userDetails.id
    const [loading, setLoading] = useState(false)
    const [other, setOther] = useState(1)
    const [addMoreField, setAddMore] = useState([])
    const [editMoreImage, setEditMoreImages] = useState([])

    const role = currentUserRole(reduxState)

    const [respMessage, setRespMessage] = useState("")
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);

    const fileRef = useRef(null)

    const [openAddModal, setAddModal] = useState(false)
    const [openEditModal, setEditModal] = useState(false)

    const [formValue, setFormValue] = useState({
        brand_name: '', brand_description: '', web_url: '',
        facebook_url: '', instagram_url: '', twitter_url: '',
        linkedin_url: '', tiktok_url: ''
    })
    const [image, setImage] = useState({
        upload_logo: [],
        upload_moodboard: [],
        replace_brand_guidelines: [],
        upload_more: []
    })
    const [checkState, setCheckState] = useState({
        isLogochk: true,
        isMoodBoardchk: true,
        isBrandGuidechk: true,
        isothers: true,
    })

    const [filesArray, setFilesArray] = useState([])

    const openAddBrandModal = () => setAddModal(true)
    const closeAddBrandModal = () => setAddModal(false)

    const openEditBrandModal = () => setEditModal(true)
    const closeEditBrandModal = () => setEditModal(false)

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const openSuccessModal = () => setShowSuccessModal(true);
    const closeSuccessModal = () => setShowSuccessModal(false);

    const addMore = () => {
        if (addMoreField.length < 3) {
            setOther(other + 1)
            setAddMore(prev => [...prev, {
                name: `others_${other}`,
                value: ''

            }])
            setImage({
                ...image,
                [`others_${other}`]: []
            })
        } else {
            console.log("You can not add more fields.")
        }
    }

    const editAddMoreImages = () => {
        fileRef.current.click()
    }
    const getDescriptionText = (value) => {
        setFormValue({
            ...formValue,
            brand_description: value
        })
    }
    // onhandleChange
    const onChangeText = (event) => {
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
        if (name === 'upload_logo') {
            const updatedFiles = files[0]
            const { name: new_name, type, size, lastModified } = updatedFiles
            const fileName = `brand-logo-${new_name}`;
            const logoFile = new File([updatedFiles], fileName, { type, size, lastModified });
            setImage(prev => ({ ...prev, [name]: logoFile }))
            setFilesArray(prev => [...prev, { name: name, files: logoFile }])
        } else {
            setImage(prev => ({ ...prev, [name]: files }))
            setFilesArray(prev => [...prev, { name: name, files: files }])
        }
    }

    const getSingleBrandFile = (id) => {
        apiClient.get("/api/get-single-brand-files/" + id)
            .then(({ data }) => {
                console.log(data)
            }).catch(err => console.log(err))
    }

    const onSubmit = async () => {
        setLoading(true)
        let formData = new FormData()
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
            const updatedFiles = filesArray[i]
            if (updatedFiles.name === 'upload_logo') {
                formData.append('files', filesArray[i].files)
            } else {
                formData.append('files', filesArray[i].files[0])
            }
        }
        await apiClient.post("/api/brand", formData)
            .then(({ data }) => {
                setRespMessage(data?.message)
                setLoading(false)
                setAddMore([])
                setImage({
                    upload_logo: [],
                    upload_moodboard: [],
                    replace_brand_guidelines: [],
                    upload_more: [],
                })
                setFilesArray([])
                closeAddBrandModal()
                getSingleBrandFile(data?.customerBrand?._id)
                reduxActions.getNew_Brand(!reduxState.new_brand)

                setTimeout(() => {
                    openSuccessModal(true)
                }, 700)

            })
            .catch((error) => {
                if (error?.response) {
                    setRespMessage(error.response?.data?.message)
                    setLoading(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                    return
                }
                setLoading(false)
            })
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
    const removeEditFiles = (file) => {
        const result = editMoreImage.filter(item => item.name !== file.name)
        setEditMoreImages(result)
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

    useEffect(() => {
        return () => {
            setAddMore([])
            setEditMoreImages([])
        }
    }, [])

    useEffect(() => {
        if (editMoreImage.length > 5) {
            alert("Only upload 5 files")
            setEditMoreImages([])
            return
        }
    }, [editMoreImage])

    useEffect(() => {

    }, [reduxState.new_brand])


    return {
        role,
        image,
        loading,
        openAddModal,
        addMoreField,
        openEditModal,
        renderSuccessSB,
        BrandButton,
        respMessage,
        formValue,
        renderErrorSB,
        showSuccessModal,
        checkState,
        filesArray,
        fileRef,
        removeEditFiles,
        setEditMoreImages,
        editMoreImage,
        handleFileUploadEdit,
        setRespMessage,
        editAddMoreImages,
        openErrorSB,
        openSuccessSB,
        getDescriptionText,
        setFilesArray,
        setImage,
        addMore,
        setAddMore,
        setCheckState,
        onChangeText,
        setFormValue,
        handleFileUpload,
        onSubmit,
        closeSuccessModal,
        openAddBrandModal,
        closeAddBrandModal,
        openEditBrandModal,
        closeEditBrandModal,
    }
}

export default useBrandData