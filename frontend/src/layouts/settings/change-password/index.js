import { ArrowForward } from '@mui/icons-material'
import { Grid, IconButton } from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useState } from 'react'
import { MoonLoader } from 'react-spinners'
import apiClient from 'api/apiClient'
import { useSelector } from 'react-redux'
import MDSnackbar from 'components/MDSnackbar'
import { mibananaColor } from 'assets/new-images/colors'
import { fontsFamily } from 'assets/font-family'

const ChangePassword = () => {
    const [loading, setLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = React.useState(false);
    const [newPassword, setNewPassword] = React.useState(false);
    const [confirmPassword, setConfirmPassword] = React.useState(false);
    const id = useSelector(state => state.userDetails.id)

    const [respMessage, setRespMessage] = useState("")
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const [changePassword, setChangePassword] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    })

    const isShowPassword = (setPassword) => {
        setPassword(prev => !prev)
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setChangePassword({
            ...changePassword,
            [name]: value
        })
    }
    const handleSignUp = (event) => {
        event.preventDefault()
        setLoading(true)
        if (changePassword.new_password !== changePassword.confirm_password || !changePassword.current_password) {
            setLoading(false)
            return
        }
        const data = { id: id, password: changePassword.current_password, new_password: changePassword.new_password }
        apiClient.put("/api/settings/forget-password", data)
            .then(({ data }) => {
                setRespMessage(data?.message)
                setLoading(false)
                setChangePassword({ current_password: '', confirm_password: '', new_password: '' })
                openSuccessSB()
            })
            .catch(error => {
                if (error.response) {
                    const { message } = error?.response?.data
                    setRespMessage(message)
                    openErrorSB()
                    setLoading(false)
                    return
                }
                setRespMessage(error.message)
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
                    <Grid item xxl={10} xl={10} lg={10} md={12} xs={12} sx={{ background: 'white', boxShadow: "4px 3px 7px -2px #cccccc0d", marginLeft: '8px' }}>
                        <MDBox pt={4} pb={3} px={3} >
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
                                >Change Password
                                </MDTypography>
                                <Grid container spacing={2}>
                                    <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                                        <MDBox mb={2} sx={{ position: "relative" }}>
                                            <label style={Styles} name="current_password" htmlFor='current_password'>Current Password *</label>
                                            <MDInput type={currentPassword ? "text" : "password"} name="current_password" onChange={handleChange} placeholder="Current Password" required variant="outlined" fullWidth />
                                            <IconButton
                                                onClick={() => isShowPassword(setCurrentPassword)}
                                                sx={{
                                                    position: "absolute",
                                                    right: 0,
                                                }}
                                            >
                                                {currentPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            {!changePassword.current_password ? <span style={{ color: "red", fontSize: '12px' }}>Current Password is required</span> : null}
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                                        <MDBox mb={2} sx={{ position: "relative" }}>
                                            <label style={Styles} name="new_password" htmlFor='new_password'>New Password *</label>
                                            <MDInput type={newPassword ? "text" : "password"} name="new_password" onChange={handleChange} placeholder="New Password" required variant="outlined" fullWidth />
                                            <IconButton
                                                onClick={() => isShowPassword(setNewPassword)}
                                                sx={{
                                                    position: "absolute",
                                                    right: 0,
                                                }}
                                            >
                                                {newPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            {changePassword.new_password !== changePassword.confirm_password ? <span style={{ color: "red", fontSize: '12px' }}>New and Confirm password not matched</span> : null}
                                        </MDBox>
                                    </Grid>
                                    <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                                        <MDBox mb={2} sx={{ position: "relative" }}>
                                            <label style={Styles} name="confirm_password" htmlFor='confirm_password'>Confirm Password *</label>
                                            <MDInput type={confirmPassword ? "text" : "password"} name="confirm_password" onChange={handleChange} placeholder="Confirm Password" required variant="outlined" fullWidth />
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
                                </Grid>
                                <MDBox mt={4} mb={1} pt={3} sx={{ display: 'inline-block', float: 'right', bottom: '10px', position: 'relative' }}>
                                    <MDButton
                                        type="submit"
                                        color="warning"
                                        fullWidth
                                        endIcon={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                        Save &nbsp;
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

const titleStyles = {
    fontSize: '2.5rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}

export default ChangePassword
