import { ArrowBack, ArrowForward, Visibility, VisibilityOff } from '@mui/icons-material'
import { Autocomplete, Checkbox, FormControlLabel, Grid, IconButton, TextField } from '@mui/material'
import apiClient from 'api/apiClient'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDSnackbar from 'components/MDSnackbar'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MoonLoader } from 'react-spinners'
import reduxContainer from 'redux/containers/containers'


const CurrentCustomerDetails = ({ reduxState }) => {
    const { id } = useParams()
    const currentNonActiveCustomer = reduxState?.non_active_customer_data?.find(item => item._id === id)
    const [loading, setLoading] = useState(false)
    const [isactive, setIsActive] = useState(false)
    const navigate = useNavigate()

    const [respMessage, setRespMessage] = useState("")
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const [currentPassword, setCurrentPassword] = useState(false);
    const [formValue, setFormValue] = useState({
        name: '',
        email: '',
        phone_no: '',
        password: '',
        company_profile: '',
        contact_person: '',
        primary_phone: '',
        primary_email: '',
        roles: ''
    })
    const handleChange = (event) => {
        const { name, value } = event.target
        setFormValue({
            ...formValue,
            [name]: value
        })
    }
    const isShowPassword = (setPassword) => {
        setPassword(prev => !prev)
    }

    const updateCurrentCustomerDetails = async (event) => {
        event.preventDefault();
        setLoading(true)
        const formdata = {
            customer_details: { ...formValue, is_active: isactive },
            roles: reduxState?.userDetails?.roles,
        }
        await apiClient.patch("/api/udpate-customer", formdata).then(({ data }) => {
            setLoading(false)
            setRespMessage(data?.message)
            setTimeout(() => {
                openSuccessSB()
            }, 400)
        }).catch(err => {
            if (err.response) {
                const { message } = err.response?.data
                setRespMessage(message)
                setLoading(false)
                setTimeout( () => {
                    openErrorSB()
                }, 400)
                return
            }
            setRespMessage(err.message)
            setLoading(false)
            setTimeout(() => {
                openErrorSB()
            }, 400)
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
        const getCompanyDetails = async () => {
            if (id) {
                try {
                    const { data } = await apiClient.get("/api/get-company-details/" + id)
                    setFormValue({
                        ...currentNonActiveCustomer,
                        primary_email: data.company_data?.primary_email,
                        primary_phone: data.company_data?.primary_phone,
                        contact_person: data.company_data?.contact_person,
                    })
                } catch (error) {
                    console.error(error)
                }

            }
        }
        getCompanyDetails()
    }, [id])

    return (
        <DashboardLayout>
            <MDBox pt={2} pb={3}>
                <Grid container >
                    <Grid item xxl={10} xl={10} lg={10} md={12} xs={12} sx={{ background: 'white', boxShadow: "4px 3px 7px -2px #cccccc0d", marginLeft: '8px' }}>
                        <MDBox pt={4} pb={3} px={3} >
                            <MDBox component="form" role="form" onSubmit={updateCurrentCustomerDetails} >
                                <IconButton title='go back' onClick={() => navigate("/settings/customers")}>
                                    <ArrowBack fontSize='medium' />
                                </IconButton>
                                <MDTypography pt={2} pb={2}
                                    verticalAlign="middle"
                                    fontWeight="medium"
                                    sx={({ palette: { mibanana }, typography: { size } }) => ({
                                        color: mibanana.text,
                                        size: size.lg
                                    })}
                                >Customer Details
                                </MDTypography>
                                <Grid container spacing={2}>
                                    <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                        <MDBox mb={2} >
                                            <label style={Styles} name="name" htmlFor='username'>Name *</label>
                                            <MDInput type={"text"} value={formValue.name} name="name" onChange={handleChange} placeholder="User name" variant="outlined" fullWidth disabled />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} name="email" htmlFor='email'>Email *</label>
                                            <MDInput type={"text"} value={formValue.email} name="email" onChange={handleChange} placeholder="User Email" variant="outlined" fullWidth disabled />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} name="phone_no" htmlFor='phone_no'>Phone *</label>
                                            <MDInput type={"text"} value={formValue.phone_no} name="phone_no" onChange={handleChange} placeholder="Phone no" variant="outlined" fullWidth disabled />
                                        </MDBox>
                                    </Grid>

                                    <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                        <MDBox mb={2} sx={{ position: "relative" }}>
                                            <label style={Styles} name="password" htmlFor='password'>Password *</label>
                                            <MDInput type={currentPassword ? "text" : "password"} value={formValue.password} name="password" onChange={handleChange} placeholder="Password" variant="outlined" fullWidth disabled />
                                            <IconButton
                                                onClick={() => isShowPassword(setCurrentPassword)}
                                                sx={{
                                                    position: "absolute",
                                                    right: 0,
                                                }}
                                            >
                                                {currentPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} name="company_profile" htmlFor='company_profile'>Company Name *</label>
                                            <MDInput type={"text"} value={formValue.company_profile} name="company_profile" onChange={handleChange} placeholder="Phone no" variant="outlined" fullWidth disabled />
                                        </MDBox>
                                    </Grid>
                                    <Grid item pt={0} xxl={6} xl={6} lg={6} xs={12} md={12}>
                                        <MDBox mt={"-2px"}>
                                            <label style={Styles} name="role" htmlFor='role'>Role *</label>
                                            <Autocomplete
                                                value={formValue.roles}
                                                disabled
                                                onChange={(event, newValue) => {
                                                    setFormValue({
                                                        ...formValue,
                                                        roles: newValue
                                                    })
                                                }}
                                                // onClick={moveToBrandPage}
                                                id="select-role"
                                                options={currentNonActiveCustomer?.roles}
                                                sx={{
                                                    width: '100%', "& .MuiInputBase-root": {
                                                        paddingBlock: '4px !important'
                                                    }
                                                }}
                                                renderInput={(params) => <TextField placeholder='Select Role' {...params} />}

                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} name="primary_email" htmlFor='primary_email'>Primary Email *</label>
                                            <MDInput type={"text"} value={formValue.primary_email} name="primary_email" onChange={handleChange} placeholder="Primary email" variant="outlined" fullWidth disabled />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} name="primary_phone" htmlFor='primary_phone'>Primary phone *</label>
                                            <MDInput type={"text"} value={formValue.primary_phone} name="primary_phone" onChange={handleChange} placeholder="Primary phone" variant="outlined" fullWidth disabled />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} name="contact_person" htmlFor='contact_person'>Main Contact Person *</label>
                                            <MDInput type={"text"} value={formValue.contact_person} name="contact_person" onChange={handleChange} placeholder="Contact person" variant="outlined" fullWidth disabled />
                                        </MDBox>
                                    </Grid>
                                    {/* <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} name="is_active" htmlFor='is_active'>Account Status *</label>
                                            <MDBox display="flex" pl={"1rem"} justifyContent="flex-start" alignItems="center">
                                                <FormControlLabel required control={<Checkbox checked={isactive}
                                                    onChange={() => setIsActive(prev => !prev)} />} sx={{
                                                        "& .MuiFormControlLabel-asterisk, .css-4w40rt": {
                                                            visibility: 'hidden !important'
                                                        }
                                                    }} />
                                                <label>{isactive ? "Make Customer Active" : "Not active"}</label>
                                            </MDBox>
                                        </MDBox>
                                    </Grid> */}
                                </Grid>
                                <MDBox mt={4} mb={1} pt={3} sx={{ display: 'inline-block', float: 'right', bottom: '10px', position: 'relative' }}>
                                    <MDButton
                                        type="submit"
                                        color="warning"
                                        fullWidth
                                        endIcon={
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <ArrowForward fontSize='large' />&nbsp;
                                                <MoonLoader loading={loading} size={18} color='#121212' />
                                            </div>}
                                        disabled={loading}
                                        circular={true}
                                        sx={{
                                            color: '#000 !important',
                                            fontSize: 14,
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        Update Customer &nbsp; 
                                    </MDButton>
                                </MDBox>
                                {renderErrorSB}
                                {renderSuccessSB}
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
    marginLeft: 4
}

export default reduxContainer(CurrentCustomerDetails)
