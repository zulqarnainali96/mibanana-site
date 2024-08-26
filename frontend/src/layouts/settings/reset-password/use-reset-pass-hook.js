import apiClient from "api/apiClient"
import { useFormik } from "formik"
import { useEffect, useRef, useState } from "react"
import { emailSchema } from "Schema"
import { resetPassword } from "Schema"

export const useResetPassword = (reduxState, reduxActions) => {
    const [showPassword, setShowPasswordChange] = useState(false)
    const [respMessage, setRespMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [showVerifyCode, setShowVerifyCode] = useState(false)
    const [verify_code, setVerifyCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)


    const handleResetPassword = async (values) => {
        try {
            const res = await apiClient.post('/api/reset-password', values)
            if (res.status === 200) {
                const data = res.data
                setRespMessage(data.message)
                setErrorMessage("")
                setShowVerifyCode(true)
            } else {
                throw new Error("Something went wrong")
            }
        } catch (err) {
            setRespMessage("")
            if (err.response.data) {
                setErrorMessage(err.response.data.message)
            } else {
                setErrorMessage(err.message)
            }
        }
    }
    const handleVerifyCode = (e) => {
        setRespMessage("")
        setVerifyCode(e.target.value)
    }

    const handleVerifyEmailCode = async () => {
        setLoading(true)
        const data = {
            code: verify_code
        }
        try {
            const res = await apiClient.post('/api/verify-authen-code', data)
            if (res.status === 200) {
                setErrorMessage("")
                setVerifyCode("")
                setLoading(false)
                setShowVerifyCode(false)
                setShowChangePassword(true)
            } else {
                setLoading(false)
                throw new Error("Something went wrong")
            }
        } catch (err) {
            setErrorMessage("")
            setVerifyCode("")
            setLoading(false)
            if (err.response.data) {
                setErrorMessage(err.response.data.message)
            } else {
                setErrorMessage(err.message)
            }
        }
    }

    const initialValues = {
        email: reduxState?.userDetails.email,

    }

    const { values, handleBlur, handleChange, touched, handleSubmit, errors, isSubmitting } = useFormik({
        initialValues,
        validationSchema: emailSchema,
        onSubmit: handleResetPassword,
    })

    useEffect(() => {
        return () => {
            setShowChangePassword(false)
            setShowVerifyCode(false)
            setRespMessage("")
            setErrorMessage("")
        }
    }, [])

    return {
        values,
        handleBlur,
        handleChange,
        touched,
        handleSubmit,
        handleVerifyCode,
        errors,
        verify_code,
        showVerifyCode,
        isSubmitting,
        respMessage,
        setRespMessage,
        setErrorMessage,
        loading,
        errorMessage,
        showChangePassword,
        handleVerifyEmailCode,
        setShowChangePassword
    }

}

