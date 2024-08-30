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
import { Autocomplete, Grid, MenuItem, Select, TextField } from "@mui/material";
import { socialMediaSchema } from "Schema";
import ReactQuill from "react-quill";
import { modules } from 'assets/react-quill-settings/react-quill-settings';
import { formats } from 'assets/react-quill-settings/react-quill-settings';
import { reactQuillStyles } from 'assets/react-quill-settings/react-quill-settings';
import apiClient from "api/apiClient";
import { MoonLoader } from "react-spinners";
import { submitButtonStyle } from "../mobile-app-dev-form/mobile-app-dev-form";
import PDFIMAGE from '../../../assets/images/pdffile.svg'


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

const initialValues = {
  project_title: "",
  service_type: "",
  platforms: "",
  plan: "",
  brand: {},
  project_details: "",
  otherServiceType: "",
  otherPlatform: "",
  otherPlan: ""
}

const SocialMediaManager = ({
  open, role, handleClose, reduxState, reduxActions, openSuccessSB, openErrorSB, setRespMessage, setLoading, loading, socketIO, brandOption,
}) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);
  const classes = reactQuillStyles()
  const quilRef = useRef();

  const customerUploadFiles = async (filType, project_id) => {
    const formdata = new FormData();
    for (let i = 0; i < filType.length; i++) {
      formdata.append("files", filType[i]);
    }
    formdata.append("user_id", reduxState?.userDetails.id);
    formdata.append("project_id", project_id);
    await apiClient.post("/api/file/upload-files", formdata)
      .then(() => {
        setUploadedImages([]);
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data
          setRespMessage(message)
          setTimeout(() => {
            openErrorSB()
          }, 400)
          return
        } else {
          setRespMessage(err.message)
          setTimeout(() => {
            openErrorSB()
          }, 400)
        }
      })
  };

  const handleSocialMediForm = async (values, { resetForm }) => {
    setLoading(true);
    const dataToSend = {
      ...values,
      user: reduxState.userDetails?.id,
      name: reduxState.userDetails?.name,
      role: reduxState?.userDetails?.roles[0] ?? '',
      project_category: 'social-media-manager',
    };
    try {
      const { data } = await apiClient.post('/api/create-social-media-project', dataToSend);
      setLoading(false);
      if (data.message) {
        if (uploadedImages.length > 0) {
          customerUploadFiles(uploadedImages, data.socialMedia._id)
        }
        handleClose();
        setRespMessage(data.message);
        resetForm(clearForm());
        const socketMsg = {
          ...dataToSend,
          project_id: data.socialMedia._id,
          role: reduxState?.userDetails?.roles[0] ?? '',
          project_category: 'social-media-manager',
        }
        setTimeout(() => {
          reduxActions.handleGetAllProjects(!reduxState.project_call)
          if (!role?.admin || !role?.projectManager) {
            socketIO.emit('new-project', socketMsg)
          }
          openSuccessSB();
        }, 500);
      }
    } catch (error) {
      if (error.response.data) {
        setRespMessage(error.response.data.message)
      } else {
        setRespMessage(error.message)
      }
      setLoading(false)
      setTimeout(() => {
        openErrorSB();
      }, 500);
    }
    function clearForm() {
      document.getElementById('project_title').value = "";
      quilRef.current.getEditor().setText('');
    }

    resetForm(clearForm());
  }

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
    onSubmit: handleSocialMediForm
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

    // Reset the file input value to ensure the same file can be uploaded again
    e.target.value = '';
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
            <Grid item xs={12}>
              <MDTypography variant={"h6"} pb={1} className="">
                Brand
              </MDTypography>
              <Grid container>
                <Grid item xs={12}>
                  <Autocomplete
                    name="brand"
                    value={values.brand}
                    onChange={(event, newValue) => setFieldValue("brand", newValue)}
                    id="brand"
                    getOptionLabel={option => option.brand_name ? option.brand_name : ''}
                    options={brandOption}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} label="Select Brand" />} />
                </Grid>
              </Grid>
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
              <ReactQuill
                theme="snow"
                name="project_description"
                id='project_description'
                value={values.project_description}
                onChange={(value) => setFieldValue('project_description', value)}
                onBlur={() => handleBlur({
                  target: {
                    name: 'project_description'
                  }
                })}
                modules={modules}
                formats={formats}
                className={classes.quill}
                ref={quilRef}
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
                accept="image/*,.pdf"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              {/* Display uploaded images */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {uploadedImages.map((file, index) => (
                  <div key={index} style={{ position: 'relative', width: '150px', height: '150px', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px' }}>
                    {file.type === "application/pdf" ? (
                      <img src={PDFIMAGE} alt="PDF file" style={{ width: '48px', height: '48px' }} />
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`uploaded-${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                    <button
                      onClick={() => removeImage(index)}
                      style={{ position: 'absolute', top: 10, right: 10, padding: '4px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </Grid>
            
            <Grid item xs={12}>
              <MDButton
                type="submit"
                style={submitButtonStyle}
                disabled={loading}
                endIcon={<MoonLoader loading={loading} size={18} color='#fff' />}
              >
                Submit
              </MDButton>
            </Grid>

          </Grid>
        </form>
      </DialogContent>
    </BootstrapDialog>
  );
}

export default SocialMediaManager;
