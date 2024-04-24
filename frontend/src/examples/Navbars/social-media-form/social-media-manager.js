import React, { useRef, useState } from "react";
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
import axios from "axios";
import TransitionsModal from "components/Modal/Modal";
import check from '../../../assets/images/check.png';


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
  user: user,
  name: name,
  project_title: "",
  service_type: "",
  platforms: "",
  plan: "",
  project_details: "",
  otherServiceType:"",
  otherPlatform:"",
  otherPlan:""
}

const SocialMediaManager = (props) => {
  const { open, handleClose } = props;
  const [uploadedImages, setUploadedImages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const fileInputRef = useRef(null);

  const {
    values,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
    setFieldValue
  } = useFormik({
    initialValues: initialValues,
    validationSchema: socialMediaSchema,
    onSubmit: async (values,{resetForm}) => {
      const dataToSend = {
          ...values,
          user: user,
          name: name,
      };
      try {
          const response = await axios.post('http://localhost:8000/api/create-social-media-project', dataToSend);
          // handleClose();
          resetForm(clearForm());
          setOpenModal(true)
          setTimeout(() => {
              handleClose();
          }, 5000);
      } catch (error) {
          console.error('Error:', error);
      }
      function clearForm() {
          var projectTitle = document.getElementById('project_title');
          projectTitle.value = "";
          var projectDetail = document.getElementById('project_details');
          projectDetail.value = "";
      }

      // Optionally, reset the form after submission
      resetForm(clearForm());
  },
  })

  const customChangeService = (e) => {
    handleChange(e)
    if (handleChange(e) !== "other") {
        setFieldValue("otherServiceType", "");
        var serviceType = document.getElementById("otherServiceType");
        serviceType.value = "";
    }
}
const customChangePlatform = (e) => {
    handleChange(e)
    if (handleChange(e) !== "other") {
        setFieldValue("otherPlatform", "");
        var wordCount = document.getElementById("otherPlatform");
        wordCount.value = "";
    }
}
const customChangePlan = (e) => {
    handleChange(e)
    if (handleChange(e) !== "other") {
        setFieldValue("otherPlan", "");
        var wordCount = document.getElementById("otherPlan");
        wordCount.value = "";
    }
}

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const uploadedImagesArray = [...uploadedImages];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadedImagesArray.push(file);
    }
    setUploadedImages(uploadedImagesArray);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const removeImage = (indexToRemove) => {
    const filteredImages = uploadedImages.filter((image, index) => index !== indexToRemove);
    setUploadedImages(filteredImages);
  };



  return (
    <BootstrapDialog open={open} sx={{ width: "100% !important" }}>
      <DialogTitle
        display={"flex"}
        position={"relative"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
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
                    onChange={customChangeService}
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
                    disabled={values.service_type !== "other"} />

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
                    onChange={customChangePlatform}
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
                    disabled={values.platforms !== "other"} />

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
                    onChange={customChangePlan}
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
                    id="otherPlan"
                    name="otherPlan"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.otherPlatform}
                    value={values.otherPlatform}
                    placeholder="Specify other service type"
                    disabled={values.plan !== "other"} />

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
                style={{ width: '100%' }}
                className={touched.project_details && Boolean(errors.project_details) ? 'border-color-red' : ''}
              />
            </Grid>

            {/* Add Drag and Drop area */}
            <Grid item xs={12}>
              <label htmlFor="fileInput" style={{ display: 'block', cursor: 'pointer' }}>
                <div
                  style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <p>Drag & Drop Images Here</p>
                </div>
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              {/* Display uploaded images */}
              {uploadedImages.map((image, index) => (
                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={URL.createObjectURL(image)} alt={`uploaded-${index}`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '10px', width: "150px", height: "150px", objectFit: "cover" }} />
                  <button
                    onClick={() => removeImage(index)}
                    style={{ position: 'absolute', top: 10, right: 10, padding: '4px', background: '#000', border: 'none', cursor: 'pointer' }}
                  >
                    X
                  </button>
                </div>
              ))}
            </Grid>




            <Grid item xs={12}>
              <MDButton type="submit" style={{ width: '100%', backgroundColor: "#FBDD34", color: "#000", fontWeight: "600" }}>Submit</MDButton>
            </Grid>

          </Grid>
        </form>
      </DialogContent>
      <TransitionsModal message="Project created successfully!" check={check} openModal={openModal} setOpenModal=
        {setOpenModal} />
    </BootstrapDialog>
  );
};

export default SocialMediaManager;
