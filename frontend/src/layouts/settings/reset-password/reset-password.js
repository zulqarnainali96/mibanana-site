import { CloseOutlined } from "@mui/icons-material"
import { Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import MDTypography from "components/MDTypography";
import { useResetPassword } from "./use-reset-pass-hook";
import MDButton from "components/MDButton";
import Input from "components/Input/Input";
import reduxContainer from "redux/containers/containers";
import { FieldsError } from "components/formik-error";
import { MIBananaButton } from "components/banana-button/banana-button";
import { fontsFamily } from "assets/font-family";
import ChangePassword from "./change-password";

const BootstrapDialog = styled(Dialog)(({ theme: { breakpoints } }) => ({
    '& .MuiPaper-root': {
        maxWidth: '60% !important',
        width: "100% !important",
        [breakpoints.down('lg')]: {
            width: '95%'
        },
    },
    '& .MuiInputBase-root': {
        paddingBlock: '15px'
    },
    '& .MuiDialogContent-root': {
        padding: '16px',
    },
    '& .MuiDialogActions-root': {
        padding: '8px',
        width: "100%"
    },
}));

const ResetPassword = ({ reduxState, reduxActions, open, closeResetModal }) => {


    const { handleBlur, handleChange, handleSubmit, verify_code, errors, touched, values, handleVerifyCode, showVerifyCode, isSubmitting, respMessage, errorMessage, handleVerifyEmailCode, showChangePassword, setErrorMessage, setRespMessage, loading, setShowChangePassword } = useResetPassword(reduxState, reduxActions);
    return (
        <BootstrapDialog open={open}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <MDTypography>
                    Reset Password
                </MDTypography>
                <MDButton onClick={closeResetModal} sx={{ position: "absolute", right: 4 }}>
                    <CloseOutlined />
                </MDButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} width={"100%"}>
                        <Grid item xs={12} position={"relative"} sx={verifyStyle}>
                            <Input
                                placeholder="Enter your email"
                                id="email"
                                name="email"
                                type="text"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                touched={touched.email}
                                errors={errors.email}
                            />
                            {errors.email && <FieldsError error={errors.email} />}
                            <MIBananaButton
                                type="submit"
                                loading={isSubmitting}
                                text="reset password"
                            />

                        </Grid>
                        {respMessage && <MDTypography
                            textAlign="center"
                            color="success"
                            variant="h5"
                            sx={{
                                width: '100%',
                                fontWeight: '300',
                                marginBlock: '.4rem',
                                fontFamily: fontsFamily.poppins
                            }}>
                            {respMessage}
                        </MDTypography>}

                        {errorMessage && <MDTypography
                            textAlign="center"
                            color="error"
                            variant="h5"
                            sx={{
                                width: '100%',
                                fontWeight: '300',
                                marginBlock: '.4rem',
                                fontFamily: fontsFamily.poppins
                            }}>
                            {errorMessage}
                        </MDTypography>}

                        {showVerifyCode && (<Grid item xs={12} sx={verifyStyle} >
                            <Input
                                type="text"
                                id="verify_code"
                                name="verify_code"
                                value={verify_code}
                                onChange={handleVerifyCode}
                                placeholder="Enter verification code"
                            />
                            {errors.email && <FieldsError error={errors.email} />}
                            <MIBananaButton
                                type="button"
                                onClick={handleVerifyEmailCode}
                                loading={loading}
                                text="Verify Code"
                            />
                        </Grid>)}
                        {showChangePassword && (
                            <ChangePassword
                                setRespMessage={setRespMessage}
                                setErrorMessage={setErrorMessage}
                                setShowChangePassword={setShowChangePassword}
                                reduxState={reduxState}
                            />
                        )}
                    </Grid>
                </form>

            </DialogContent>
        </BootstrapDialog>
    )
}

const cardStyle = {
    justifyContent: 'center',
    width: '80%',
    marginLeft: '50px',
    marginTop: '100px',
    padding: '20px',
    borderRadius: '10px',
    displayplay: 'flex',
    flexDirection: 'column',
    gap: '2em',
    height: '500px'
}

export const verifyStyle = {
    paddingBlock: '1rem',
    position: "relative",
    paddingBlock: '1rem',
    display: 'flex',
    gap: '1rem',
}

export default reduxContainer(ResetPassword)