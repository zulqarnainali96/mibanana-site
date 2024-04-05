import React from "react";
import { styled } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { useFormik } from "formik";
import Input from "components/Input/Input";
import { Grid, MenuItem, Select, TextField } from "@mui/material";
import { socialMediaSchema } from "Schema/Index";

const borderColorRed = {
  borderColor: "red",
};


const BootstrapDialog = styled(Dialog)(({ theme: { breakpoints, spacing } }) => ({
  "& .MuiPaper-root": {
    maxWidth: "60% !important",
    width: "100%",
    [breakpoints.down("lg")]: {
      width: "95%",
    },
  },
  "& .MuiInputBase-root": {
    paddingBlock: "15px",
  },
  "& .MuiDialogContent-root": {
    padding: spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: spacing(1),
    width: "100%",
  },
}));

const userDetailsString = localStorage.getItem('user_details');
const name = userDetailsString ? JSON.parse(userDetailsString).name : '';
const user = userDetailsString ? JSON.parse(userDetailsString).id : "";

const initialValues = {
  name: name,
  user: user,
  project_title: "",
  project_details: "",
  plan: "",
  platforms: "", 
  service_type: "",
}

const SocialMediaManager = (props) => {
  const { open, handleClose } = props;

  const {
    values,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    touched
  } = useFormik({
    initialValues: initialValues,
    validationSchema: socialMediaSchema,
    onSubmit: (values) => {
      console.log(values)
    }
  })

  return (
    <BootstrapDialog open={open} sx={{ width: "100% !important" }}>
      <DialogTitle
        display={"flex"}
        position={"relative"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        borderBottom={`1px solid #ccc !important`}
      >
        <MDTypography className="fontsStyle">Social Media Request Form</MDTypography>
        <MDButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 4, padding: "1.4rem !important" }}
        >
          <CloseOutlined sx={{ fill: "#444" }} />
        </MDButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/*project title*/}
            <Grid item xs={12}>
              <MDTypography variant="h6" pb={1} className="">
                Project Title
              </MDTypography>
              <Input
                placeholder="Enter your Project Title"
                id="project_title"
                name="project_title"
                type="text"
                value={values.project_title}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.project_title}
                errors={errors.project_title}
              />
            </Grid>

            {/*service type*/}
            <Grid item xs={6}>
              <MDTypography variant={"h6"} pb={1} className="">
                Select Service Type
              </MDTypography>
              <Grid container>
                <Grid item xs={12}>
                  <Select
                    id="service_type"
                    name="service_type"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.service_type}
                    error={touched.service_type && Boolean(errors.service_type)}
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value="" selected disabled>Select Service Type</MenuItem>
                    <MenuItem value="content creation">Content Creation</MenuItem>
                    <MenuItem value="posting schedule">Posting Schedule</MenuItem>
                    <MenuItem value="engagement strategy">Engagement Strategy</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>


                </Grid>
              </Grid>

            </Grid>

            <Grid item xs={6}>
              <MDTypography variant={"h6"} pb={1} className="">
                Others
              </MDTypography>
              <Grid container>
                <Grid item xs={12}>
                  <Input
                    type="text"
                    id="otherServiceType"
                    name="otherServiceType"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.otherServiceType}
                    value={values.otherServiceType}
                    placeholder="Specify other service type"
                    disabled={values.social_media_service !== "other"} />

                </Grid>
              </Grid>

            </Grid>

            {/*choose platform*/}

            <Grid item xs={6}>
              <MDTypography variant={"h6"} pb={1} className="">
                Choose Platform
              </MDTypography>
              <Grid container>
                <Grid item xs={12}>
                  <Select
                    id="platforms"
                    name="platforms"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.platforms}
                    error={touched.platforms && Boolean(errors.platforms)}
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value="" selected disabled>Choose Platform</MenuItem>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="facebook">Facebook</MenuItem>
                    <MenuItem value="instagram">Instagram</MenuItem>
                    <MenuItem value="twitter">Twitter</MenuItem>
                    <MenuItem value="linkedIn">LinkedIn</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>


                </Grid>
              </Grid>

            </Grid>

            <Grid item xs={6}>
              <MDTypography variant={"h6"} pb={1} className="">
                Others
              </MDTypography>
              <Grid container>
                <Grid item xs={12}>
                  <Input
                    type="text"
                    id="otherPlatform"
                    name="otherPlatform"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.otherPlatform}
                    value={values.otherPlatform}
                    placeholder="Specify other service type"
                    disabled={values.social_media_platform !== "other"} />

                </Grid>
              </Grid>

            </Grid>

            {/*choose plan*/}

            <Grid item xs={6}>
              <MDTypography variant={"h6"} pb={1} className="">
                Choose Plan
              </MDTypography>
              <Grid container>
                <Grid item xs={12}>
                  <Select
                    id="plan"
                    name="plan"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.plan}
                    error={touched.plan && Boolean(errors.plan)}
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value="" selected disabled>Choose Plan</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly Plan</MenuItem>
                    <MenuItem value="quarterly">Quarterly Plan</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>


                </Grid>
              </Grid>

            </Grid>

            <Grid item xs={6}>
              <MDTypography variant={"h6"} pb={1} className="">
                Others
              </MDTypography>
              <Grid container>
                <Grid item xs={12}>
                  <Input
                    type="text"
                    id="otherPlatform"
                    name="otherPlatform"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.otherPlatform}
                    value={values.otherPlatform}
                    placeholder="Specify other service type"
                    disabled={values.social_media_plan !== "other"} />

                </Grid>
              </Grid>

            </Grid>

            {/*description*/}
            <Grid item xs={12}>
              <MDTypography variant="h6" pb={1} className="">
                Project Description
              </MDTypography>
              <TextField
                placeholder="Enter your Project Description"
                id="project_details"
                name="project_details"
                type="text"
                value={values.project_details}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.project_details}
                errors={errors.project_details}
                multiline
                rows={4}
                maxRows={8}
                style={{ width: '100%' }}
                className={touched.project_details && Boolean(errors.project_details) ? 'border-color-red' : ''}
              />
            </Grid>

            <Grid item xs={12}>
              <MDButton type="submit" style={{ width: '100%', backgroundColor: "#FBDD34", color: "#000", fontWeight: "600" }}>Submit</MDButton>
            </Grid>

          </Grid>
        </form>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default SocialMediaManager;
