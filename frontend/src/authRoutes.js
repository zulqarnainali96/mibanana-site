import MiSignup from "layouts/authentication/mi-sign-up";
import MiSignIn from "layouts/authentication/mi-sign-in";
import Icon from "@mui/material/Icon";
import EmailVerify from "layouts/email-verify/EmailVerify";
import { Navigate } from "react-router-dom";
import SuccessModal from 'components/SuccessBox/SuccessModal'

const authRoutes = [
    {
        type: "collapse",
        name: "Mi Sign Up",
        key: "mi-sign-up",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/authentication/mi-sign-up",
        component: <MiSignup />,
    },
    {
        type: "collapse",
        name: "Mi Sign In",
        key: "mi-sign-in",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/authentication/mi-sign-in",
        component: <MiSignIn />,
    },
    {
        type : 'collapse',
        key : 'verify-user',
        route: "/auth/user/:id/verify/:token",
        component: <EmailVerify />,
    },
    {
        type : 'collapse',
        key : 'modal',
        route: "/modal",
        component: <SuccessModal />,
    }
]

export default authRoutes