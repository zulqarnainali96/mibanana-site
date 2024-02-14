import { ArrowForward } from '@mui/icons-material'
import { Card, Grid, } from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import MoonLoader from 'react-spinners/MoonLoader'
import React, { useState } from 'react'
import MDSnackbar from 'components/MDSnackbar'
import { mibananaColor } from 'assets/new-images/colors'
import { fontsFamily } from 'assets/font-family'
import PhoneInput from 'react-phone-input-2'
import { makeStyles } from '@mui/styles'
import { useCompanyProfileData } from './useCompanyProfileData'

const useStyles = makeStyles({
    Container: {
        width: '100%',
    },
    inputStyles: {
        width: '100% !important',
        height: '46px !important',
        borderRadius: 8
    }
})

const CompanyProfile = () => {
    const classes = useStyles()
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    // const { openSuccessSB, openErrorSB } = useToasterHook()

    const { handleChange, handleSignUp, loading, handlePhoneChange1, companyData, respMessage } = useCompanyProfileData({ openSuccessSB, openErrorSB  })

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

    return (
        <DashboardLayout>
            <MDBox pt={3} ml={1.5} pb={3}
                sx={({ breakpoints }) => ({
                    [breakpoints.down('md')]: {
                        width: '98%',
                        marginLeft: '3px',
                    },
                    [breakpoints.up('md')]: {
                        width: '75%',
                    }
                })}>
                <Card>
                    <Grid container >
                        <Grid item xxl={12} xl={12} lg={12} md={12} xs={12} sx={{ background: 'white', }}>
                            <MDBox pt={4} pb={3} px={2} >
                                <MDBox component="form" role="form" onSubmit={handleSignUp} >
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
                                    >Company Profile</MDTypography>
                                    <Grid container spacing={2} sx={{
                                    }}>
                                        <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                                            <MDBox mb={2}>
                                                <label style={Styles} name="company_name" htmlFor='company_name'>Company Name <span style={colorRed}>*</span></label>
                                                <MDInput type="text" name="company_name" value={companyData.company_name} onChange={handleChange} placeholder="Company Name" required variant="outlined" fullWidth />
                                            </MDBox>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                            <MDBox mb={2}>
                                                <label style={Styles} name="contact_person" htmlFor='contact_person'>Main Contact Person <span style={colorRed}>*</span></label>
                                                <MDInput type="text" value={companyData.contact_person} onChange={handleChange} placeholder="Name of Contact Person" name="contact_person" variant="outlined" fullWidth required />
                                            </MDBox>
                                        </Grid>
                                        <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                            <MDBox mb={2} sx={{ position: "relative" }}>
                                                <label style={Styles} htmlFor='company_size'>Company Size</label>
                                                <MDInput type="phone" value={companyData.company_size} name="company_size" onChange={handleChange} placeholder="No of People in the Company" variant="outlined" fullWidth />
                                            </MDBox>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                            <MDBox mb={2}>
                                                <label style={Styles} name="email" htmlFor='email'>Primary Email <span style={colorRed}>*</span></label>
                                                <MDInput type="email" value={companyData.primary_email} onChange={handleChange} placeholder="Name of Contact Person" name="primary_email" variant="outlined" fullWidth required />
                                            </MDBox>
                                        </Grid>
                                        <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                            <MDBox mb={2} sx={{ position: "relative" }}>
                                                <label style={Styles} htmlFor='phone'>Primary Phone <span style={colorRed}>*</span>
                                                </label>
                                                <PhoneInput
                                                    country={"us"}
                                                    className="marginBottom"
                                                    value={companyData?.primary_phone}
                                                    onChange={phone => handlePhoneChange1(phone)}
                                                    placeholder='Primary Phone '
                                                    inputProps={{
                                                        name: 'primary_phone',
                                                        required: true,
                                                        autoFocus: true,
                                                    }}
                                                    enableSearch
                                                    containerClass={classes.Container}
                                                    inputClass={classes.inputStyles}
                                                />
                                            </MDBox>
                                        </Grid>
                                        <Grid item xxl={10} xl={10} lg={10} xs={12} md={12}>
                                            <MDBox mb={2} sx={{ position: "relative" }}>
                                                <label style={Styles} htmlFor='time_zone'>Time Zone</label>
                                                <MDInput type="text" name="time_zone" value={companyData.time_zone} onChange={handleChange} placeholder="Select Time Zone" variant="outlined" fullWidth />
                                            </MDBox>
                                        </Grid>
                                        <Grid item xxl={10} xl={10} lg={10} xs={12} md={12}>
                                            <MDBox mb={2} sx={{
                                                display: "flex", flexDirection: "column",
                                                "& > textarea:focus": {
                                                    outline: 0,
                                                }
                                            }}>
                                                <label style={Styles} htmlFor='company_address'>Company Address</label>
                                                <textarea style={{
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ccc',
                                                    fontFamily: 'sans-serif',
                                                    fontSize: '17px',
                                                    fontWeight: '400',

                                                }} type="text" value={companyData.company_address} rows={8} cols={100} name="company_address" onChange={handleChange} placeholder="Your Company address" variant="outlined" />
                                            </MDBox>
                                        </Grid>
                                    </Grid>
                                    <MDBox mt={4} mb={1} pt={1} sx={{ display: 'inline-block', float: 'right', bottom: '10px', position: 'relative' }}>
                                        <MDButton type="submit" color="warning" fullWidth
                                            circular={true}
                                            sx={{
                                                color: '#000 !important',
                                                fontSize: 14,
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            Submit &nbsp; <ArrowForward fontSize='large' />&nbsp;
                                            <MoonLoader loading={loading} size={23} color='#121212' />
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Grid>
                    </Grid>
                </Card>
                {renderSuccessSB}
                {renderErrorSB}
            </MDBox>
        </DashboardLayout >
    )
}

const colorRed = {
    color: 'red'
}

const Styles = {
    fontWeight: "bold",
    fontSize: "15px",
    marginLeft: 4
}
const titleStyles = {
    fontSize: '2.5rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}

export default CompanyProfile
