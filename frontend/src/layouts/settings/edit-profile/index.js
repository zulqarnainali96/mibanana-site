import { ArrowForward } from '@mui/icons-material'
import { Grid, useMediaQuery } from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React, { useState } from 'react'
import reduxContainer from 'redux/containers/containers'
import { MoonLoader } from 'react-spinners'
import { mibananaColor } from 'assets/new-images/colors'
import { fontsFamily } from 'assets/font-family'
import PhoneInput from 'react-phone-input-2'
import { makeStyles } from '@mui/styles'
import useEditProfile from './useEditProfile'


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
    const is991 = useMediaQuery("(min-width:990px)")
    const classes = useStyles()
    
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const { 
        respMessage, 
        profileData, 
        loading, 
        imageUrl, 
        handleChange, 
        handleFileUpload, 
        handlePhoneChange1, 
        UpdateProfile } = 
        useEditProfile({ openSuccessSB, openErrorSB, reduxActions, reduxState })
    
    const props = { respMessage, closeErrorSB, closeSuccessSB, successSB, errorSB }

    const Styles = {
        fontWeight: "bold",
        fontSize: "15px",
        marginLeft: 4
    }
    return (
        <DashboardLayout {...props}>
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
                            {/* {renderErrorSB}
                            {renderSuccessSB} */}
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