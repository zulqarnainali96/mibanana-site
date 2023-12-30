import React, { useEffect, useState } from 'react'
import MiLayoutCover from '../components/Mi-Layout'
import MDBox from 'components/MDBox'
import MiIcon from 'assets/mi-banana-icons/mibanana-logo-1-color 1.png'
import { Checkbox, FormControlLabel, Grid, IconButton, TextField } from '@mui/material'
import CoverImage from 'assets/mi-banana-icons/Photo.png';
import MDTypography from 'components/MDTypography'
import MDInput from 'components/MDInput'
import { Link, useNavigate } from 'react-router-dom'
import MDSnackbar from 'components/MDSnackbar'
import MDButton from 'components/MDButton'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import apiClient from "api/apiClient";
import { ArrowForward } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material'
import { MoonLoader } from 'react-spinners'
import { jsx } from '@emotion/react'

const MiSignup = () => {
    const [UiChange, setUiChange] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm_password, setConfirmPassword] = useState("")
    const [company_profile, setCompanyProfile] = useState("")
    const [errMsg, setErrMsg] = useState({
        nameError: '', emailError: '', passwordError: '', confirmPassError: ''
    })
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const navigate = useNavigate()

    const [respMessage, setRespMessage] = useState("")
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const [error, setError] = useState("")
    const [msg, setMsg] = useState("")


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickConfirmPassword = () => setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword);

    const isSmall = useMediaQuery("(min-width:1000px)")

    const handleSignUp = async (event) => {
        event.preventDefault()
        if (!name) {
            setErrMsg({ ...errMsg, nameError: 'Name is required' })
            return
        }
        if (!email) {
            setErrMsg({ ...errMsg, emailError: 'Email is required' })
            return
        }

        if (!password) {
            setErrMsg({ ...errMsg, passwordError: 'Password is required' })
            return
        }
        if (!confirm_password) {
            setErrMsg({ ...errMsg, confirmPassError: 'Confirm pass is required' })
            return
        }
        if (confirm_password !== password) {
            setErrMsg({ ...errMsg, confirmPassError: 'Password not matching' })
            return
        }
        // if (confirm_password !== password || !name && !email) return
        else if (!isCheck) return
        const data = {
            name,
            email,
            password,
            company_profile,
            roles: ["Customer"]
        }
        setLoading(true)
        await apiClient.post('/authentication/mi-sign-up', data)
            .then(resp => {
                setErrMsg({
                    emailError: '', nameError: '', passwordError: '', confirmPassError: ''
                })
                if (resp.status === 200) {
                    setLoading(false)
                    setUiChange(true)
                    setRespMessage(resp?.data.message)
                    setMsg(resp.data.message)
                    setEmail("")
                    setName("")
                    setConfirmPassword("")
                    setPassword("")
                    setTimeout(() => {
                        // openSuccessSB()
                        // navigate("/authentication/mi-sign-in")
                    }, 1200)
                }
                setLoading(false)
            })
            .catch(err => {
                if (err?.response) {
                    console.error(err.response.data.message)
                    setRespMessage(err.response.data.message)
                    setLoading(false)
                    setUiChange(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 1200)
                }
                // console.log(err?.message)
                setLoading(false)
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

    useEffect(() => {
        return () => {
            setUiChange(false)
            setErrMsg({
                emailError: '', nameError: '', passwordError: '', confirmPassError: ''
            })
        }
    }, [])

    return (
        <MiLayoutCover>
            <MDBox
                bgColor="white"
                sx={({ palette: { light } }) => ({
                    width: "calc(100%)",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    background: light.cream
                })}
            >
                <MDBox display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={-10}
                    pb={4}
                >
                    <img src={MiIcon} width={isSmall ? "100%" : "60%"} />
                </MDBox>
                <Grid container justifyContent={"center"}>
                    {UiChange ? null : <Grid item xxl={3} xl={4} lg={5} alignSelf={"center"} sx={{ display: isSmall ? "block" : "none", boxShadow: "4px 3px 7px -2px #cccccc0d" }}>
                        <img src={CoverImage} width={"100%"} height={"95%"} />
                    </Grid>}
                    <Grid item xxl={UiChange ? 6 : 3} xl={UiChange ? 6 : 4} lg={UiChange ? 7 : 5} md={UiChange ? 6 : 7} xs={10} sx={{ background: 'white', boxShadow: "4px 3px 7px -2px #cccccc0d" }}>
                        <MDBox pt={4} pb={3} px={4}>
                            {msg && <div style={noti_msg}>{msg}</div>}
                            {UiChange ? null : <MDBox component="form" role="form" onSubmit={handleSignUp} mt={-3} >
                                <MDTypography pb={2}
                                    verticalAlign="middle"
                                    fontWeight="medium"
                                    sx={({ palette: { mibanana }, typography: { size } }) => ({
                                        color: mibanana.text,
                                        textAlign: "center",
                                        size: size.lg

                                    })}
                                >Create Account</MDTypography>
                                <Grid container spacing={2}>
                                    <Grid item lg={6} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} htmlFor='Name'>Name <span style={colorRed}>*</span></label>
                                            <MDInput type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" variant="outlined" fullWidth />
                                            {errMsg.nameError && <span style={{ color: "red", fontSize: '12px' }}>{errMsg.nameError}</span>}
                                        </MDBox>
                                    </Grid>
                                    <Grid item lg={6} xs={12} md={12}>
                                        <MDBox mb={2}>
                                            <label style={Styles} htmlFor='Email'>Email <span style={colorRed}>*</span></label>
                                            <MDInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" variant="outlined" fullWidth />
                                            {errMsg.emailError && <span style={{ color: "red", fontSize: '12px' }}>{errMsg.emailError}</span>}
                                        </MDBox>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xxl={12} lg={12} xs={12} md={12}>
                                        <MDBox mb={2} sx={{ position: "relative" }}>
                                            <label style={Styles} htmlFor='company_profile'>Company Name <span style={colorRed}>*</span></label>
                                            <MDInput type={"text"} value={company_profile} onChange={(e) => setCompanyProfile(e.target.value)} placeholder="Company Name" variant="outlined" required fullWidth
                                            />
                                        </MDBox>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xxl={12} lg={12} xs={12} md={12}>
                                        <MDBox mb={2} sx={{ position: "relative" }}>
                                            <label style={Styles} htmlFor='Password'>Password <span style={colorRed}>*</span></label>
                                            <MDInput type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" variant="outlined" fullWidth />
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                sx={{
                                                    position: "absolute",
                                                    right: 0,
                                                }}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            {errMsg.passwordError && <span style={{ color: "red", fontSize: '12px' }}>{errMsg.passwordError}</span>}
                                        </MDBox>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xl={12} xs={12} lg={12} md={12}>
                                        <MDBox mb={2} sx={{ position: "relative" }}>
                                            <label style={Styles} htmlFor='ConfirmPassword'>Confirm Password <span style={colorRed}>*</span></label>
                                            <MDInput type={showConfirmPassword ? "text" : "password"} value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" variant="outlined" fullWidth />
                                            <IconButton
                                                onClick={handleClickConfirmPassword}
                                                sx={{
                                                    position: "absolute",
                                                    right: 0,
                                                }}
                                            >
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            {errMsg.confirmPassError && <span style={{ color: "red", fontSize: '12px' }}>{errMsg.confirmPassError} </span>}
                                            <br />
                                            {error && <div style={noti_msg}>{error}</div>}
                                            {msg && <div style={noti_msg}>{msg}</div>}
                                        </MDBox>
                                    </Grid>
                                </Grid>
                                <MDBox display="flex" alignItems="center" ml={-1}>
                                    <FormControlLabel required control={<Checkbox checked={isCheck}
                                        onChange={() => setIsCheck(prev => !prev)} />} sx={{
                                            "& .MuiFormControlLabel-asterisk, .css-4w40rt": {
                                                visibility: 'hidden !important'
                                            }
                                        }} />
                                    <MDTypography
                                        variant="button"
                                        fontWeight="regular"
                                        color="text"
                                        sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                                    >
                                        I agree the&nbsp;
                                    </MDTypography>
                                    <MDTypography
                                        component="a"
                                        href="#"
                                        variant="button"
                                        fontWeight="bold"
                                        color="info"
                                        textGradient
                                    >
                                        Terms and Conditions
                                    </MDTypography>
                                    <span style={{ color: 'black', verticalAlign: 'middle' }}>&nbsp;*</span>
                                </MDBox>
                                <MDBox mb={1} pt={2}>
                                    <MDButton type="submit" color="warning" fullWidth
                                        endIcon={<MoonLoader loading={loading} size={23} color='#121212' />}
                                        circular={true}
                                        sx={{
                                            color: '#000 !important',
                                            fontSize: 14,
                                            textTransform: "capitalize"
                                        }}
                                    >
                                        Submit &nbsp; <ArrowForward fontSize='large' />&nbsp;
                                    </MDButton>
                                </MDBox>
                            </MDBox>}
                        </MDBox>
                    </Grid>
                </Grid>
                <MDBox mt={3} mb={1} textAlign="center">
                    {UiChange ? null : <MDTypography variant="button" color="text">
                        Already have an account?{" "}
                        <MDTypography
                            component={Link}
                            to="/authentication/mi-sign-in"
                            variant="button"
                            color="info"
                            fontWeight="medium"
                            textGradient
                        >
                            Sign In
                        </MDTypography>
                    </MDTypography>}
                    {renderErrorSB}
                    {renderSuccessSB}
                </MDBox>

            </MDBox>
        </MiLayoutCover>
    )
}

const colorRed = {
    color : 'red'
}
const noti_msg = {
    width: '100%',
    marginTop: '20px',
    marginBottom: '10px',
    padding: '15px',
    fontSize: '21px',
    // backgroundColor: '#f34646',
    backgroundColor: '#5cdd5c',
    color: 'white',
    borderRadius: '5px',
    textAlign: 'center',
}

export default MiSignup
