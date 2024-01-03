import { ArrowBack, ArrowForward, Visibility, VisibilityOff } from '@mui/icons-material'
import { Autocomplete, Checkbox, FormControlLabel, Grid, IconButton, TextField } from '@mui/material'
import apiClient from 'api/apiClient'
import { fontsFamily } from 'assets/font-family'
import { mibananaColor } from 'assets/new-images/colors'
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


const ViewBrand = ({ reduxState }) => {
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
                setTimeout(() => {
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
                                <IconButton title='go back' onClick={() => navigate("/mi-brands")}>
                                    <ArrowBack fontSize='medium' />
                                </IconButton>
                                <MDTypography sx={titleStyles}>Current Brand</MDTypography>
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

const titleStyles = {
    fontSize: '2rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}

export default reduxContainer(ViewBrand)
