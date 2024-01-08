import { ArrowForward } from '@mui/icons-material'
import { Grid, Stack, useMediaQuery } from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useState } from 'react'
import defaultImage from "assets/mi-banana-icons/default-profile.png"
import apiClient from 'api/apiClient'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import reduxContainer from 'redux/containers/containers'
import { MoonLoader } from 'react-spinners'
import MDSnackbar from 'components/MDSnackbar'
import { mibananaColor } from 'assets/new-images/colors'
import { fontsFamily } from 'assets/font-family'
import PhoneInput from 'react-phone-input-2'
import { makeStyles } from '@mui/styles'


const useStyles = makeStyles({
    Container: {
        width: '90%',
    },
    inputStyles: {
        width: '100% !important',
        borderRadius: '5px',
        height: '46px !important',
        borderRadius: 8
    }
})

const EditProfile = ({ reduxState, reduxActions }) => {
    const [imageUrl, setImageUrl] = useState(defaultImage);
    const [loading, setLoading] = useState(false)
    const [profileData, setProfileData] = useState({
        fullName: '', email: '', phone: '', user_avatar: ''
    })
    const [profileImage, setProfileImage] = useState([])
    const userID = useSelector(state => state.userDetails)
    const ID = userID?.hasOwnProperty("_id") ? userID?._id : userID?.id
    const is991 = useMediaQuery("(min-width:990px)")
    const classes = useStyles()
    const [respMessage, setRespMessage] = useState("")
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const handleChange = (event) => {
        const { name, value } = event.target
        setProfileData({
            ...profileData,
            [name]: value
        })
    }
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage([file])
            const reader = new FileReader();

            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            // console.log("file ", file)
            // console.log("result ", reader.result)
            reader.readAsDataURL(file);
        } else {
            // console.log("No file selected")
        }
    };

    // const handleSignUp = async (event) => {
    //     event.preventDefault()
    //     setLoading(true)
    //     const formData = new FormData
    //     formData.append('avatar', profileData.user_avatar)
    //     formData.append('email', profileData.email)
    //     formData.append('fullName', profileData.fullName)
    //     formData.append('phone', profileData.phone)
    //     formData.append('user', ID)
    //     await apiClient.post("/api/settings-profile", formData)
    //         .then(({ data }) => {
    //             if (data?.profile !== null) {
    //                 setLoading(false)
    //                 setRespMessage(data?.message)
    //                 const { fullName, phone, avatar, email, } = data?.profile
    //                 setProfileData({ ...profileData, fullName, phone, email })
    //                 setImageUrl(avatar)
    //                 reduxActions.getUserAvatarUrl(avatar)
    //                 setTimeout(() => {
    //                     openSuccessSB()
    //                 }, 1200)
    //             }
    //         })
    //         .catch(err => {
    //             if (err?.response) {
    //                 console.error(err.response.data.message)
    //                 setRespMessage(err.response.data.message)
    //                 setLoading(false)
    //                 setTimeout(() => {
    //                     openErrorSB()
    //                 }, 1200)
    //             }
    //             setLoading(false)
    //             console.log(err?.message)
    //         })
    // }

    // useEffect(() => {
    //     function getProfileData() {
    //         apiClient.get("/api/settings-profile/" + ID)
    //             .then(({ data }) => {
    //                 if (data?.profile !== null) {
    //                     // console.log(data?.profie)
    //                     const { fullName, phone, avatar, email, } = data?.profile
    //                     setProfileData({ ...profileData, fullName: fullName, phone: phone, email: email, })
    //                     setImageUrl(avatar?.length ? avatar : defaultImage)
    //                     reduxActions.getUserAvatarUrl(avatar?.length ? avatar : defaultImage)
    //                 }
    //             }).catch((e) => console.log("Fetching profile Error ", e))
    //     }
    //     getProfileData()
    // }, [])

    async function uploadWithProfile() {
        setLoading(true)
        const formData = new FormData
        formData.append('email', profileData.email)
        formData.append('phone_no', profileData.phone)
        formData.append('fullname', profileData.fullName)
        formData.append('file', profileImage[0])

        const id = reduxState.userDetails.id
        await apiClient.post('/api/user/profile/' + id, formData)
            .then(({ data }) => {
                const { message, profileData } = data
                setRespMessage(message)
                const { avatar } = profileData
                setProfileData({ ...profileData })

                const update = {
                    name: profileData.fullname,
                    email: profileData.email,
                    phone_no: profileData.phone,
                    avatar
                }
                localStorage.setItem('user_details', JSON.stringify({
                    ...reduxState.userDetails,
                    ...update,
                }))
                reduxActions.getUserDetails({
                    ...reduxState.userDetails,
                    ...update
                })
                setImageUrl(avatar)
                setLoading(false)
                setProfileImage([])
                setProfileData()
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
    async function uploadWithoutProfile() {
        setLoading(true)
        const data = {
            email: profileData.email,
            phone_no: profileData.phone,
            fullname: profileData.fullName
        }
        const id = reduxState.userDetails.id
        await apiClient.post('/api/user/no-profile/' + id, data)
            .then(({ data }) => {
                const { message, profileData } = data
                setRespMessage(message)
                const update = {
                    name: profileData.fullname,
                    email: profileData.email,
                    phone_no: profileData.phone,
                }
                localStorage.setItem('user_details', JSON.stringify({
                    ...reduxState.userDetails,
                    ...update,
                }))
                reduxActions.getUserDetails({
                    ...reduxState.userDetails,
                    ...update
                })
                setLoading(false)
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
    async function UpdateProfile(event) {
        event.preventDefault()
        // console.log(profileData.email,profileData.fullName,profileData.phone)
        if (profileImage.length) {
            uploadWithProfile()
        } else {
            uploadWithoutProfile()
        }
    }
    const handlePhoneChange1 = (phone) => {
        setProfileData({
            ...profileData,
            phone: phone
        })
    }
    useEffect(() => {
        function getProfile() {
            const { email, name: fullName, phone_no: phone, avatar: user_avatar } = reduxState.userDetails
            setProfileData({ email, fullName, phone, user_avatar })
            if (user_avatar?.length) {
                setImageUrl(user_avatar)
            }
        }
        getProfile()
    }, [])
    console.log(reduxState.userDetails)

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

    const Styles = {
        fontWeight: "bold",
        fontSize: "15px",
        marginLeft: 4
    }

    return (
        <DashboardLayout>
            {/* <DashboardNavbar /> */}
            <MDBox pt={6} pb={3}>
                <Grid container >
                    <Grid item xxl={12} xl={12} lg={12} md={12} xs={12} sx={{ background: 'white', boxShadow: "4px 3px 7px -2px #cccccc0d" }}>
                        <MDBox pt={4} pb={3} px={3} >
                            <MDBox component="form" role="form" onSubmit={UpdateProfile} >
                                <MDTypography pb={2}
                                    sx={({ breakpoints }) => ({
                                        [breakpoints.down('md')]: {
                                            ...titleStyles,
                                            fontSize: '1.6rem !important',
                                        },
                                        [breakpoints.up('md')]: {
                                            ...titleStyles
                                        }
                                    })}
                                >My Profile</MDTypography>
                                <Grid container spacing={2} sx={{
                                    flexDirection: is991 ? "row" : "column-reverse"
                                }}>
                                    <Grid item xxl={9} xl={9} lg={9} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} name="fullName" htmlFor='fullName'>Full Name *</label>
                                            <MDInput type="text" value={profileData?.fullName} name="fullName" onChange={handleChange} placeholder="Company Name" required variant="outlined" fullWidth />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={9} xl={9} lg={9} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} name="email" htmlFor='email'>Email *</label>
                                            <MDInput type="email" value={profileData?.email} name="email" onChange={handleChange} placeholder="Email address of contact person in company" variant="outlined" fullWidth required />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={3} xl={3} lg={3} xs={12} md={12}>
                                        <MDBox mb={2} borderRadius="10px" display="flex" justifyContent="center" flexDirection="column" gap="1rem" alignItems="center" mt={is991 ? "-155px" : "0"} py={2} sx={{
                                            border: '2px solid gray',
                                            background: '#fffff9'

                                        }}
                                        >
                                            {imageUrl && <img src={imageUrl} loading='lazy' alt="Uploaded Image" height="180px" width={"180px"} style={{
                                                backgroundSize: 'contain',
                                                borderRadius: '110px',
                                            }} />}
                                            <label htmlFor="upload-image">
                                                <MDButton variant="contained" color="info" component="span">
                                                    Upload Profile
                                                </MDButton>
                                                <input
                                                    id="upload-image"
                                                    hidden
                                                    accept="image/*"
                                                    type="file"
                                                    onChange={handleFileUpload}
                                                />
                                            </label>
                                        </MDBox>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xxl={10} xl={10} lg={10} xs={12} md={12}>
                                        <MDBox mb={2} sx={{ position: "relative" }}>
                                            <label style={Styles} htmlFor='phone'>Phone *</label>
                                            <PhoneInput
                                                country={"us"}
                                                className="marginBottom"
                                                value={profileData?.phone}
                                                onChange={phone => handlePhoneChange1(phone)}
                                                placeholder='Your primary phone no'
                                                inputProps={{
                                                    name: 'phone',
                                                    required: true,
                                                    autoFocus: true,
                                                }}
                                                enableSearch
                                                containerClass={classes.Container}
                                                inputClass={classes.inputStyles}
                                            />
                                        </MDBox>
                                    </Grid>
                                </Grid>
                                <MDBox mt={4} mb={1} pt={3} sx={{ display: 'inline-block', float: 'right', bottom: '10px', position: 'relative' }}>
                                    <MDButton type="submit" color="warning" fullWidth
                                        circular={true}
                                        endIcon={
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <ArrowForward fontSize='large' />&nbsp;
                                                <MoonLoader loading={loading} size={20} color='#121212' />
                                            </div>}
                                        sx={{
                                            color: '#000 !important',
                                            fontSize: 14,
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {profileData?.fullName ? "Update" : "Submit"} &nbsp;
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                            {renderErrorSB}
                            {renderSuccessSB}
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout >

    )
}

export default reduxContainer(EditProfile)

const titleStyles = {
    fontSize: '2.5rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}