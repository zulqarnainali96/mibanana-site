import { ArrowForward, Visibility, VisibilityOff } from '@mui/icons-material'
import { Autocomplete, Grid, IconButton, TextField } from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import React, { useEffect, useState } from 'react'
import { MoonLoader } from 'react-spinners'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { makeStyles } from '@mui/styles'
import MiLayoutCover from 'layouts/authentication/components/Mi-Layout'

const useStyles = makeStyles({
    Container: {
        width: '100%',
    },
    inputStyles: {
        width: '100% !important',
        borderRadius: '5px',
        height: '46px !important'
    }
})
// phone, setPhone, phone2, setPhone2
const NewCustomerForm = ({ onChange, handleSubmit, loading, setFormValue, formValue }) => {
    const classes = useStyles()
    const [currentPassword,setCurrentPassword] = useState(false)
    const [confirmPassword,setConfirmPassword] = useState(false)

    const handlePhoneChange1 = (phone) => {
        setFormValue({
            ...formValue,
            phone: phone
        })
    }
    const handlePhoneChange2 = (phone) => {
        setFormValue({
            ...formValue,
            primary_phone: phone
        })
    }
    const isShowPassword = (setPassword) => {
        setPassword(prev => !prev)
    }
    return (
        <MDBox component="form" role="form" onSubmit={handleSubmit} >
            <MDTypography fontSize="medium" width="21%" marginBottom="15px">
                User Profile
            </MDTypography>
            <Grid container spacing={2} >
                <Grid item xxl={6} xl={6} lg={6} pt={"5px !important"} xs={12} md={12}>
                    <MDBox mb={1}>
                        <label style={Styles} htmlFor='name'>Name <span style={colorRed}>*</span></label>
                        <MDInput type="text" required onChange={onChange} name="name" placeholder="Your name" variant="outlined" fullWidth padding="0.55rem" />
                    </MDBox>
                </Grid>
                <Grid item xxl={6} xl={6} lg={6} pt={"5px !important"} xs={12} md={12}>
                    <MDBox mb={1}>
                        <label style={Styles} htmlFor='email'>Email <span style={colorRed}>*</span></label>
                        <MDInput type="email" required onChange={onChange} name="email" placeholder="Your email" variant="outlined" fullWidth />
                    </MDBox>
                </Grid>
                <Grid item lg={6} pt={"5px !important"} position={"relative"} xs={6} md={6}>
                    <MDBox mb={1}>
                        <label style={Styles} htmlFor='password'>Password <span style={colorRed}>*</span></label>
                        <MDInput type={currentPassword ? "text" : "password"} value={formValue.password} name="password" onChange={onChange} placeholder="Password" variant="outlined" fullWidth />
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
                <Grid item lg={6} pt={"5px !important"} position={"relative"} xs={6} md={6}>
                    <MDBox mb={1}>
                        <label style={Styles} htmlFor='password'>Confirm Password <span style={colorRed}>*</span></label>
                        <MDInput type={confirmPassword ? "text" : "password"} value={formValue.confirm_password} name="confirm_password" onChange={onChange} placeholder="Confirm Password" variant="outlined" fullWidth />
                        <IconButton
                            onClick={() => isShowPassword(setConfirmPassword)}
                            sx={{
                                position: "absolute",
                                right: 0,
                            }}
                        >
                            {confirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </MDBox>
                </Grid>
                <Grid item lg={12} pt={"5px !important"} xs={12} md={12}>
                    <MDBox mb={1}>
                        <label style={Styles} htmlFor='phone'>Phone <span style={colorRed}>*</span></label>
                        <PhoneInput
                            country={"us"}
                            className="marginBottom"
                            value={formValue?.phone}
                            onChange={phone => handlePhoneChange1(phone)}
                            placeholder='Your phone no'
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
            <MDTypography fontSize="medium" width="21%" marginBottom="15px">
                Company Profile
            </MDTypography>
            <Grid container spacing={2} >
                <Grid item xxl={6} lg={6} xs={6} md={6}>
                    <MDBox mb={1} sx={{ position: "relative" }}>
                        <label style={Styles} htmlFor='company_name'>Company Name <span style={colorRed}>*</span></label>
                        <MDInput type={"text"} onChange={onChange} placeholder="Company Name" name="company_name" variant="outlined" required fullWidth
                        />
                    </MDBox>
                </Grid>
                <Grid item xxl={6} xl={6} lg={6} xs={12} md={12}>
                    <MDBox mb={1}>
                        <label style={Styles} htmlFor='primary_email'>Primary Email <span style={colorRed}>*</span> </label>
                        <MDInput type="email" required onChange={onChange} name="primary_email" placeholder="Your primary email" variant="outlined" fullWidth />
                    </MDBox>
                </Grid>
            </Grid>
            <Grid container spacing={2} >
                <Grid item xxl={12} xl={12} lg={12} md={12} xs={12}>
                    <MDBox mb={1}>
                        <label style={Styles} htmlFor='contact_person'>Main Contact Person <span style={colorRed}>*</span></label>
                        <MDInput type="text" required onChange={onChange} name="contact_person" placeholder="Main Contact Person" variant="outlined" fullWidth />
                    </MDBox>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                    <MDBox mb={1}>
                        <label style={Styles} htmlFor='contact_person'>Primary Phone <span style={colorRed}>*</span></label>
                        <PhoneInput
                            country={"us"}
                            className="marginBottom"
                            value={formValue?.primary_phone}
                            onChange={phone => handlePhoneChange2(phone)}
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
            <MDBox mt={4} pt={3} sx={{ display: 'inline-block', float: 'right', bottom: '10px', position: 'relative' }}>
                <MDButton
                    type="submit"
                    color="warning"
                    disabled={loading}
                    fullWidth
                    circular={true}
                    sx={{
                        color: '#000 !important',
                        fontSize: 14,
                        textTransform: "capitalize"
                    }}
                    endIcon={<MoonLoader loading={loading} size={23} color='#121212' />} >
                    Submit &nbsp; <ArrowForward fontSize='large' />&nbsp;
                </MDButton>
            </MDBox>
        </MDBox>
    )
}

const Styles = {
    fontWeight: "bold",
    fontSize: "15px",
    marginLeft: 4
}
const colorRed = {
    color: 'red'
}

export default NewCustomerForm