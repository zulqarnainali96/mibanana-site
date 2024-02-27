import React, { useEffect, useState } from "react";
import MiLayoutCover from "../components/Mi-Layout";
import MDBox from "components/MDBox";
import MiIcon from "assets/mi-banana-icons/mibanana-logo-1-color 1.png";
import { Button, Checkbox, Grid, IconButton, TextField } from "@mui/material";
import CoverImage from "assets/mi-banana-icons/Photo.png";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { Link, useNavigate } from "react-router-dom";
import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import apiClient from "api/apiClient";
import { ArrowForward } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import reduxContainer from "redux/containers/containers";
import MoonLoader from "react-spinners/MoonLoader";
import { getProjectData } from "redux/global/global-functions";
import { socketIO } from "layouts/sockets";

const MiSignIn = ({ reduxActions, reduxState }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [UiChange, setUiChange] = useState(false);

  // State for requried field after login
  const [open, setOpen] = useState(false);
  // const [localstorageData, setLocalStorageData] = useState(null)
  // const [phone, setPhone] = useState("")
  // const [phone2, setPhone2] = useState("")
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    company_name: "",
    primary_email: "",
    contact_person: "",
    primary_phone: "",
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [respMessage, setRespMessage] = useState("");
  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const [msgModal, showMsgModal] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const isSmall = useMediaQuery("(min-width:1000px)");

  const handleSignIn = async (event) => {
    event.preventDefault();
    const data = {
      email,
      password,
    };
    setLoading(true);

    await apiClient
      .post("/authentication/mi-sign-in", data)
      .then(async (resp) => {
        if (resp.status === 200) {
          setEmail("");
          setPassword("");
          setRespMessage(resp?.data?.message);
          setMsg(resp?.data?.message);
          localStorage.setItem("user_details", JSON.stringify(resp?.data?.userDetails));
          reduxActions.getUserDetails(resp?.data?.userDetails);
          const { notifications } = resp.data?.userDetails;
          reduxActions.getUserNewChatMessage(notifications);
          getProjectData(resp?.data?.userDetails?.id, reduxActions.getCustomerProject);
          openSuccessSB();
          setLoading(false);
          navigate("/board");
          // setTimeout(() => {
          //   socketIO.emit('user_online_status', {
          //     status: true,
          //     id: reduxState?.userDetails?.id,
          //     role: reduxState?.userDetails?.roles
          //   });
          // }, 1000);
        } else {
          setLoading(false);
          throw Error;
        }
      })
      .catch((err) => {
        if (err?.response) {
          if (err?.response?.data?.showModal) {
            showMsgModal(true);
            setMsg(err?.response?.data?.message);
            setUiChange(true);
          }
          setRespMessage(err.response.data.message);
          setError(err.response.data.message);
          setError(err.response.data.message);
          setLoading(false);
          setTimeout(() => {
            openErrorSB();
          }, 1200);
          return
        }
        setLoading(false);
        setRespMessage(err.message);
        setTimeout(() => {
          openErrorSB();
        }, 800);
      });
  };

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Error"
      content={respMessage}
      dateTime={new Date().toLocaleTimeString("pk")}
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
      dateTime={new Date().toLocaleTimeString("pk")}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  // const onChange = (event) => {
  //     const { name, value } = event.target
  //     console.log(name)
  //     setFormValue({
  //         ...formValue,
  //         [name]: value
  //     })
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValue.password !== formValue.confirm_password) {
      alert("password not matched with confirm password");
      return;
    }
    setLoading(true);
    await apiClient
      .post("/api/create-new-customer", formValue)
      .then(({ data }) => {
        console.log(data);
        setLoading(false);
        handleClose();
        setMsg(data?.message);
        setTimeout(() => {
          setUiChange(true);
        }, 300);
      })
      .catch((err) => {
        if (err?.response) {
          setRespMessage(err.response.data.message);
          setError(err.response.data.message);
          setLoading(false);
          setTimeout(() => {
            openErrorSB();
          }, 800);
          return
        }
        setLoading(false);
        setRespMessage(err.message);
        setTimeout(() => {
          openErrorSB();
        }, 800);
        console.log(err);
      });
  };

  const Styles = {
    fontWeight: "bold",
    fontSize: "15px",
    marginLeft: 4,
  };
  const noti_msg = {
    width: "100%",
    marginTop: "20px",
    marginBottom: "10px",
    padding: "15px",
    fontSize: "15px",
    backgroundColor: "#f34646",
    // backgroundColor: msgModal ? '#f34646' : '#5cdd5c',
    color: "white",
    borderRadius: "5px",
    textAlign: "center",
  };

  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
      setLoading(false);
      setRespMessage("");
      showMsgModal(false);
    };
  }, []);
  return (
    <MiLayoutCover>
      {/* <ModalLayout
                open={open}
                title="Please complete your account setup"
                height="auto"
                width="50%"
                isBorder={false}
                onClose={handleClose}
                color="dark"
                align="0px auto"
            >
                <RequiredForm
                    onChange={onChange}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    setFormValue={setFormValue}
                    formValue={formValue}
                />
            </ModalLayout> */}
      <MDBox
        bgColor="white"
        sx={({ palette: { light } }) => ({
          width: "calc(100%)",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: light.cream,
        })}
      >
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={-10} pb={4}>
          <img src={MiIcon} width={isSmall ? "100%" : "60%"} />
        </MDBox>
        {UiChange ? (
          <div style={noti_msg}>{msg}</div>
        ) : (
          <Grid container justifyContent={"center"}>
            <Grid
              item
              xxl={3}
              xl={4}
              lg={5}
              sx={{ display: isSmall ? "block" : "none", boxShadow: "4px 3px 7px -2px #cccccc0d" }}
            >
              <img src={CoverImage} width={"100%"} height={"100%"} />
            </Grid>
            <Grid
              item
              xxl={3}
              xl={4}
              lg={5}
              md={6}
              xs={10}
              sx={{
                background: "white",
                boxShadow: "4px 3px 7px -2px #cccccc0d",
                position: "relative",
              }}
            >
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form" onSubmit={handleSignIn}>
                  <MDTypography
                    py={3}
                    verticalAlign="middle"
                    fontWeight="medium"
                    sx={({ palette: { mibanana }, typography: { size } }) => ({
                      color: mibanana.text,
                      textAlign: "center",
                      fontSize: "1.5rem",
                    })}
                  >
                    Login to your account
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item lg={12} xs={12} md={12}>
                      <MDBox mb={2}>
                        <label style={Styles} htmlFor="Email">
                          Email
                        </label>
                        <MDInput
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          variant="outlined"
                          fullWidth
                        />
                      </MDBox>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xxl={12} lg={12} xs={12} md={12}>
                      <MDBox mb={2} sx={{ position: "relative" }}>
                        <label style={Styles} htmlFor="Password">
                          Password
                        </label>
                        <MDInput
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          variant="outlined"
                          required
                          fullWidth
                        />
                        <IconButton
                          onClick={handleClickShowPassword}
                          sx={{
                            position: "absolute",
                            right: 0,
                          }}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                          <br />
                        </IconButton>
                        {error && <div style={noti_msg}>{error}</div>}
                      </MDBox>
                    </Grid>
                  </Grid>
                  <MDBox mt={4} mb={1} pt={3}>
                    <MDButton
                      type="submit"
                      color="warning"
                      fullWidth
                      disabled={loading}
                      circular={true}
                      endIcon={
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <ArrowForward fontSize="large" />&nbsp;
                          <MoonLoader loading={loading} size={23} color="#121212" />
                        </div>}
                      sx={{
                        color: "#000 !important",
                        fontSize: 14,
                        textTransform: "capitalize",
                      }}
                    >
                      Login &nbsp;
                      &nbsp;
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        )}
        <MDBox mt={3} mb={1} textAlign="center">
          {/* <MDTypography variant="button" color="text">
                        Don't have an account?{" "}
                        <MDTypography
                            component={Link}
                            to="/authentication/mi-sign-up"
                            variant="button"
                            color="info"
                            fontWeight="medium"
                            textGradient
                        >
                            Create Account
                        </MDTypography>
                    </MDTypography> */}
          {renderErrorSB}
          {renderSuccessSB}
        </MDBox>
      </MDBox>
    </MiLayoutCover>
  );
};

export default reduxContainer(MiSignIn);

// const handleSubmit = async (e) => {
// e.preventDefault()
// if(formValue.password !== formValue.confirm_password){
//     alert("password must matched")
//     return
// }
// console.log(formValue)
// setLoading(true)
// if (!localstorageData) return
// const { id } = localstorageData
// const formdata = {
//     ...formValue,
//     primary_phone: "+" + phone2,
//     phone: "+" + phone,
// }
// console.log(formdata)
// await apiClient.post('api/req-fields/' + id, formdata).then(({ data }) => {
//     console.log(data)
//     const finalData = {
//         ...localstorageData,
//         phone_no: data.userData.phone
//     }
//     reduxActions.getUserDetails(finalData)
//     localStorage.setItem('user_details', JSON.stringify(finalData))
//     navigate("/dashboard")
//     setLoading(false)
// }).catch(err => {
//     if (err?.response) {
//         setRespMessage(err.response.data.message)
//         setError(err.response.data.message)
//         setLoading(false)
//         setTimeout(() => {
//             openErrorSB()
//         }, 800)
//     }
//     setLoading(false)
//     setRespMessage(err.message)
//     setTimeout(() => {
//         openErrorSB()
//     }, 800)
// })
