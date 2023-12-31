import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React from 'react'
import NewCustomerForm from './form/new-customer-form'
import { useState } from 'react'
import { Card } from '@mui/material'
import reduxContainer from 'redux/containers/containers'
import MDSnackbar from 'components/MDSnackbar'
import apiClient from 'api/apiClient'
import SuccessModal from 'components/SuccessBox/SuccessModal'

const SignUp = ({ reduxState }) => {
    const [respMessage, setRespMessage] = useState("")
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const [open, setOpen] = useState(false)
    const [formValue, setFormValue] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
        company_name: '',
        primary_email: '',
        contact_person: '',
        primary_phone: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormValue({
            ...formValue,
            [name]: value
        })
    }
    const handleOpen = () => {
        setOpen(true)
    }
    const SubmitForm = async (event) => {
        event.preventDefault()
        setLoading(true)
        console.log(formValue)
        if (formValue.password !== formValue.confirm_password) {
            alert("Password not matched with Confirm password")
            setLoading(false)
            return
        }
        const formdata = {
            ...formValue,
            roles: reduxState?.userDetails?.roles
        }
        await apiClient.patch("/api/udpate-customer", formdata).then(({ data }) => {
            console.log('data => ', data)
            setRespMessage(data?.message)
            setLoading(false)
            setFormValue({
                name: '', email: '', primary_email: '', primary_phone: '',
                phone: '', password: '', company_name: '', confirm_password: '', contact_person: ''
            })
            setTimeout(() => {
                handleOpen(true)
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
            setOpen(false)
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

    return (
        <DashboardLayout>
            <SuccessModal
                msg={respMessage}
                open={open}
                onClose={() => setOpen(false)}
                width="40%"
                color="#288e28"
                title="SUCCESS"
                sideRadius={false}
            />
            <MDBox px={4} py={6} width="75%">
                <Card sx={{ padding: '22px' }}>
                    <NewCustomerForm
                        loading={loading}
                        onChange={handleChange}
                        formValue={formValue}
                        handleSubmit={SubmitForm}
                        setFormValue={setFormValue}
                    />
                </Card>
                {renderSuccessSB}
                {renderErrorSB}
            </MDBox>
        </DashboardLayout>
    )
}

export default reduxContainer(SignUp)
