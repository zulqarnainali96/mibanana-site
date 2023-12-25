import { ArrowForward } from '@mui/icons-material'
import { Grid,} from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import MoonLoader from 'react-spinners/MoonLoader'
import React, { useState } from 'react'
import apiClient from 'api/apiClient'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import MDSnackbar from 'components/MDSnackbar'

const CompanyProfile = () => {
    const [companyData, setCompanyData] = useState({
        company_name: '', contact_person: '', company_size: '', primary_email: '', primary_phone: '',
        time_zone: '', company_address: ''
    })
    const [respMessage, setRespMessage] = useState("")
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const [loading, setLoading] = useState(false)
    const id = useSelector(state => state.userDetails?.id)
    const companyName = useSelector(state=> state.userDetails.company_profile)

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const handleChange = (event) => {
        const { name, value } = event.target
        setCompanyData({
            ...companyData,
            [name]: value
        })
    }
    const handleSignUp = (event) => {
        event.preventDefault()
        setLoading(true)
        let data = companyData
        data.id = id 
        apiClient.post("/settings/company-profile", data)
            .then(resp => {
                if (resp.status === 200 || resp.status === 201) {
                    // console.log('post profile => ', resp.data)
                    setRespMessage(resp.data?.message)
                    setLoading(false)
                    setTimeout(() => {
                        openSuccessSB()
                    }, 400)
                } else {
                    setRespMessage(resp.data?.message)
                    setLoading(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                }
            })
            .catch(e => {
                // console.log('error post profile => ', e?.response)
                setLoading(false)
                setRespMessage(e.response?.data?.message)
                setTimeout(() => {
                    openErrorSB()
                }, 400)
            })

    }

    const getProfileDetails = async () => {
        await apiClient.get("/settings/company-profile/" + id)
            .then(resp => {
                setCompanyData({...resp?.data?.company_data})
                // console.log('fetch profile => ', resp.data)
            })
            .catch(e => {
                // console.log('fetch profile => ', e?.response)
            })
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

    useEffect(() => {
        getProfileDetails()
        setCompanyData({
            ...companyData,
            company_name : companyName ? companyName : '' 
        })
    }, [])

    return (
        <DashboardLayout>
            {/* <DashboardNavbar /> */}
            <MDBox pt={6} pb={3}>
                <Grid container >
                    <Grid item xxl={10} xl={10} lg={10} md={12} xs={12} sx={{ background: 'white', boxShadow: "4px 3px 7px -2px #cccccc0d" }}>
                        <MDBox pt={4} pb={3} px={3} >
                            <MDBox component="form" role="form" onSubmit={handleSignUp} >
                                <MDTypography pb={2}
                                    verticalAlign="middle"
                                    fontWeight="medium"
                                    sx={({ palette: { mibanana }, typography: { size } }) => ({
                                        color: mibanana.text,
                                        size: size.lg

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
                                            <label style={Styles} htmlFor='phone'>Primary Phone <span style={colorRed}>*</span></label>
                                            <MDInput type="phone" value={companyData.primary_phone} name="primary_phone" onChange={handleChange} required placeholder="Primary Phone" variant="outlined" fullWidth />
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

                                            }} type="text" value={companyData.company_address} rows={9} cols={100} name="company_address" onChange={handleChange} placeholder="Your Company address" variant="outlined" />
                                        </MDBox>
                                    </Grid>
                                </Grid>
                                <MDBox mt={4} mb={1} pt={3} sx={{ display: 'inline-block', float: 'right', bottom: '10px', position: 'relative' }}>
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
                {renderSuccessSB}
                {renderErrorSB}
            </MDBox>
        </DashboardLayout >
    )
}

const colorRed = {
    color : 'red'
}

const Styles = {
    fontWeight: "bold",
    fontSize: "15px",
    marginLeft: 4
}


export default CompanyProfile
