import { Grid } from "@mui/material"
import apiClient from "api/apiClient"
import { MIBananaButton } from "components/banana-button/banana-button"
import Input from "components/Input/Input"
import { useFormik } from "formik"
import React, { useEffect } from "react"
import { resetPassword } from "Schema"
import { verifyStyle } from "./reset-password"
import { FieldsError } from "components/formik-error"
import { Password } from "@mui/icons-material"

const ChangePassword = ({
    setRespMessage,
    setErrorMessage,
    reduxState,
    setShowChangePassword,

}) => {

    const initialValues = {
        new_password: '',
        confirm_password: ''
    }
    const handleChangePassword = async (values) => {
        const data = {
            email: reduxState.userDetails.email,
            password: values.new_password,
        }
        try {
            const resp = await apiClient.post('/api/change-password', data)
            if (resp.status === 200) {
                const data = resp.data
                setErrorMessage("")
                setRespMessage(data.message)
                setShowChangePassword(false)
            } else {
                throw new Error("Something went wrong")
            }
        } catch (err) {
            setErrorMessage("")
            setShowChangePassword(false)
            if (err.response.data) {
                setErrorMessage(err.response.data.message)
            } else {
                setErrorMessage(err.message)
            }
        }

    }
    const { values, handleBlur, isSubmitting, handleChange, touched, errors, handleSubmit } = useFormik({
        initialValues,
        validationSchema: resetPassword,
        onSubmit: handleChangePassword
    })

    return (
        <React.Fragment>

            <Grid item xs={12} position={"relative"} sx={{...verifyStyle, paddingBlock : '1.5rem'}}>
                <Input
                    placeholder="New Password"
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={values.new_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.new_password}
                    errors={errors.new_password}
                />
                {errors.new_password && <FieldsError error={errors.new_password} />}

            </Grid>
            <Grid item xs={12} position={"relative"} sx={{...verifyStyle, paddingBlock : '1.5rem'}}>
                <Input
                    placeholder="Confirm Password"
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={values.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.confirm_password}
                    errors={errors.confirm_password}
                />
                {errors.confirm_password && <FieldsError error={errors.confirm_password} />}
            </Grid>
            <Grid item xs={12} position={"relative"} sx={{
                display: "flex",
                paddingBlock: '.5rem',
                justifyContent: "flex-end",
                alignItems: "center",
            }}>
                <MIBananaButton
                    type="button"
                    loading={isSubmitting}
                    text="Change Pasword"
                    onClick={handleSubmit}
                />
            </Grid>
        </React.Fragment>
    )
}

export default ChangePassword