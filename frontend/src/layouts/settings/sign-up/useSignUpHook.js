import apiClient from 'api/apiClient'
import React, { useEffect, useState } from 'react'

const useSignUpHook = (reduxState) => {
    const [currentPassword, setCurrentPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState(false)

    const [respMessage, setRespMessage] = useState("")
    const [errorSB, setErrorSB] = useState(false);
    const openErrorSB = () => setErrorSB(true);
    const [open, setOpen] = useState(false)
    const openSuccessSB = () => setOpen(true);


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
    const SubmitForm = async (event) => {
        event.preventDefault()
        setLoading(true)
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
            setRespMessage(data?.message)
            setFormValue({
                name: '', email: '', primary_email: '', primary_phone: '',
                phone: '', password: '', company_name: '', confirm_password: '', contact_person: ''
            })
            setLoading(false)
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
            } else {
                setRespMessage(err.message)
                setLoading(false)
                setTimeout(() => {
                    openErrorSB()
                }, 400)
            }
        })
    }
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
    return {
        currentPassword,
        confirmPassword,
        setCurrentPassword,
        handlePhoneChange1,
        handlePhoneChange2,
        setOpen,
        open,
        formValue,
        handleChange,
        SubmitForm,
        setConfirmPassword,
        isShowPassword,
        loading,
        respMessage,
        errorSB,
        setErrorSB
    }
}

export default useSignUpHook
