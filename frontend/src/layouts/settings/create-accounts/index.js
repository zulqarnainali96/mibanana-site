import { ArrowForward } from '@mui/icons-material'
import { Autocomplete, Card, Grid, IconButton, TextField } from '@mui/material'
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

const CreateAccounts = () => {
    const [loading, setLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = React.useState(false);
    const id = useSelector(state => state.userDetails.id)

    const [respMessage, setRespMessage] = useState("")
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const [formValue, setFormValue] = useState({
        username: '',
        email: '',
        roles: '',
        password: ''
    })

    const isShowPassword = (setPassword) => {
        setPassword(prev => !prev)
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormValue({
            ...formValue,
            [name]: value
        })
    }
    const handleSignUp = (event) => {
        event.preventDefault()
        const data = {
            ...formValue,
            roles: [formValue.roles],
            verified: true,
            is_active: true,
        }
        setLoading(true)
        apiClient.post('/api/create-user', data).then(({ data }) => {
            setRespMessage(data?.message)
            setFormValue({ roles: '', email: '', username: '', password: '' })
            setLoading(false)
            setTimeout(() => {
                openSuccessSB()
            }, 400)
        }).catch(error => {
            if (error?.response) {
                setRespMessage(error.response.data.message)
                setLoading(false)
                setTimeout(() => {
                    openErrorSB()
                }, 1200)
                return
            }
            setLoading(false)
            console.error(error)
            setRespMessage(error.message)
            setTimeout(() => {
                openErrorSB()
            }, 800)
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
            <MDBox pt={6} pb={3} sx={({ breakpoints }) => ({
                [breakpoints.down('md')]: {
                    width: '98%',
                },
                [breakpoints.up('md')]: {
                    width: '80%',
                }
            })}>
                <Card sx={{ marginLeft: '10px' }}>
                    <Grid container >
                        <Grid item xxl={10} xl={10} lg={10} md={12} xs={12}>
                            <MDBox pt={4} px={3} >
                                <MDBox component="form" role="form" onSubmit={handleSignUp} >
                                    <MDTypography
                                        sx={({ breakpoints }) => ({
                                            [breakpoints.down('md')]: {
                                                ...titleStyles,
                                                fontSize: '1.6rem !important',
                                            },
                                            [breakpoints.up('md')]: {
                                                ...titleStyles
                                            }
                                        })}

                                        pb={2}
                                    // verticalAlign="middle"
                                    // fontWeight="medium"
                                    // sx={({ palette: { mibanana }, typography: { size } }) => ({
                                    //     color: mibanana.text,
                                    //     size: size.lg
                                    // })}
                                    >Create Accounts
                                    </MDTypography>
                                    <Grid container spacing={2}>
                                        <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                                            <MDBox mb={2} >
                                                <label style={Styles} name="username" htmlFor='username'>Name *</label>
                                                <MDInput type={"text"} name="username" onChange={handleChange} placeholder="User name" required variant="outlined" fullWidth />
                                            </MDBox>
                                        </Grid>
                                        <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                                            <MDBox mb={2}>
                                                <label style={Styles} name="email" htmlFor='email'>Email *</label>
                                                <MDInput type={"text"} name="email" onChange={handleChange} placeholder="User Email" required variant="outlined" fullWidth />
                                            </MDBox>
                                        </Grid>
                                        <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                                            <MDBox mb={2}>
                                                <Autocomplete
                                                    onChange={(event, newValue) => {
                                                        setFormValue({
                                                            ...formValue,
                                                            roles: newValue
                                                        })
                                                    }}
                                                    // onClick={moveToBrandPage}
                                                    id="select-role-demo"
                                                    options={["Project-Manager", "Graphic-Designer","Social-Media-Manager"]}
                                                    sx={{ width: '100%' }}
                                                    renderInput={(params) => <TextField required placeholder='Select Role' {...params} />}

                                                />
                                            </MDBox>
                                        </Grid>
                                        <Grid item xxl={12} xl={12} lg={12} xs={12} md={12}>
                                            <MDBox mb={2} sx={{ position: "relative" }}>
                                                <label style={Styles} name="password" htmlFor='password'>Password *</label>
                                                <MDInput type={currentPassword ? "text" : "password"} name="password" onChange={handleChange} placeholder="Password" required variant="outlined" fullWidth />
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
                </Card>
            </MDBox>

        </DashboardLayout>
    )
}

export default CreateAccounts

const titleStyles = {
    fontSize: '2.5rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}