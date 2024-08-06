import React from 'react'
import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import NewCustomerForm from './form/new-customer-form'
import { Card } from '@mui/material'
import reduxContainer from 'redux/containers/containers'
import TransitionsModal from 'components/Modal/Modal'
import useSignUpHook from './useSignUpHook'
import TransitionsErrorModal from 'components/Modal/ErrorModal'

const SignUp = ({ reduxState }) => {
    const {
        confirmPassword,
        currentPassword,
        handlePhoneChange1,
        handlePhoneChange2,
        setConfirmPassword,
        setOpen,
        formValue,
        handleChange,
        SubmitForm,
        setFormValue,
        open,
        isShowPassword,
        loading,
        errorSB,
        respMessage,
        setErrorSB,
        setCurrentPassword,
    } = useSignUpHook(reduxState)


    return (
        <DashboardLayout>
            <TransitionsModal openModal={open} message={respMessage} setOpenModal={setOpen} />
            <TransitionsErrorModal openModal={errorSB} message={respMessage} setOpenModal={setErrorSB} />
            <MDBox px={4} py={6} width="75%">
                <Card sx={{ padding: '22px' }}>
                    <NewCustomerForm
                        loading={loading}
                        onChange={handleChange}
                        formValue={formValue}
                        handleSubmit={SubmitForm}
                        setFormValue={setFormValue}
                        currentPassword={currentPassword}
                        confirmPassword={confirmPassword}
                        handlePhoneChange1={handlePhoneChange1}
                        handlePhoneChange2={handlePhoneChange2}
                        setCurrentPassword={setCurrentPassword}
                        setConfirmPassword={setConfirmPassword}
                        isShowPassword={isShowPassword}
                    />
                </Card>
            </MDBox>
        </DashboardLayout>
    )
}

export default reduxContainer(SignUp)
