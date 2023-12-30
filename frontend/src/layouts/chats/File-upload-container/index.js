import { Grid, IconButton, MenuItem, Select, Button, InputLabel, FormControl } from "@mui/material";
import { UploadIcon } from "assets/mi-banana-icons/upload-icon";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { useDropzone } from "react-dropzone";
import React from "react";
import { useStyles } from "./styles";

import ShowFiles from "./show-files/ShowFiles";
import adminImg from "assets/images/admin.svg";
import designerImg from "assets/images/d1.svg";
import UserImg from "assets/images/u1.svg";
import pdfImg from "assets/images/pdf1.svg";
import tickImg from "assets/images/t1.svg";
import { useState, useCallback } from "react";
import ImageContainer from "./image-container/ImageContainer";
import { useEffect } from "react";
import UploadFile from "components/File upload button/FileUpload";
import { useRef } from "react";
import { currentUserRole } from "redux/global/global-functions";
import reduxContainer from "redux/containers/containers";
import apiClient from "api/apiClient";
import { useParams } from "react-router-dom";
import SelectFolder from "./select-folder/SelectFolder";
import { Jpeg, Jpg, Png, Svg } from "redux/global/file-formats";
import FileUpload from "./file-upload-container/File-upload";
import { MoonLoader } from "react-spinners";
import { getProjectData } from "redux/global/global-functions";

const inputSxStyles = {
  "& .MuiInputBase-root > input": {
    padding: "0px 5px !important",
    height: "36px !important",
  },
  "& .MuiInputBase-root > fieldset": {
    border: "none !important",
  },
};
const uploadBtn = {
  backgroundColor: "#98e225",
  padding: "10px 13px",
  width: "100%",
  "& .MuiButtonBase-root:hover": {
    backgroundColor: "#98e225",
  },
};

const FileUploadContainer = ({
  openErrorSB,
  openSuccessSB,
  setRespMessage,
  reduxState,
  reduxActions,
}) => {
  const projects = reduxState?.project_list?.CustomerProjects;
  const [currentImage, setCurrentImage] = useState({
    name: "",
    url: "",
    type: "",
  });
  const classes = useStyles();
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with dropped files
    console.log("Dropped files:", acceptedFiles);
    // You can handle the dropped files here or trigger your existing file upload logic
    // For example, you can upload the dropped files by iterating through acceptedFiles and processing them
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [selectedFileType, setSelectedFileType] = useState("");

  const [currentFolder, setCurrentFolder] = useState("Customer Uploads");
  const [filesType, setFilesType] = useState([]);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [isRender, setIsRender] = useState(false);

  const project = projects?.find((item) => item._id === id);
  const version1 = project?.add_files[0]?.version1;
  const [version, setVersion] = useState(version1);
  const [downloadfileName, setDownloadFileName] = useState("");
  const [files, setFiles] = useState([]);
  const [fileMsg, setFileMsg] = useState("");
  const re_render_chat = reduxState?.re_render_chat;
  const fileRef = useRef(null);
  const role = currentUserRole(reduxState);

  const openFileSelect = () => {
    fileRef.current.click();
  };
  const handleFileTypeChange = (event) => {
    setSelectedFileType(event.target.value); // Update selected file type on change
  };

  console.log("version", version);
  async function clientFiles() {
    setVersion([]);
    setFileMsg("");
    setLoading(true);
    await apiClient
      .get("/get-customer-files/" + id)
      .then(({ data }) => {
        setVersion(data.filesInfo);
        setFileMsg("");
        setLoading(false);
      })
      .catch((err) => {
        setFileMsg("No Files Found");
        setCurrentImage({ url: "" });
        setVersion([]);
        setLoading(false);
      });
  }
  async function designerFiles() {
    setVersion([]);
    setFileMsg("");
    setFileLoading(true);
    await apiClient
      .get("/api/designer-uploads/" + id)
      .then(({ data }) => {
        setVersion(data.filesInfo);
        setFileMsg("");
        setFileLoading(false);
      })
      .catch((err) => {
        setFileMsg("No Files Found");
        setCurrentImage({ url: "" });
        setVersion([]);
        setFileLoading(false);
      });
  }
  // const handleFileUpload = (event) => {
  //   const files = event.target.files;
  //   const newFiles = [];
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     setFilesType((prev) => [...prev, file]);
  //     if (
  //       file.type.startsWith(Jpg) ||
  //       file.type.startsWith(Jpeg) ||
  //       file.type.startsWith(Png) ||
  //       file.type.startsWith(Svg)
  //     ) {
  //       const reader = new FileReader();
  //       reader.onload = function () {
  //         newFiles.push(reader.result);
  //         setFiles(newFiles);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    let filType = [];
    for (let i = 0; i < files.length; i++) {
      console.log("files[0]", files[0]);
      setFilesType(files[i]);
      filType.push(files[i]);
    }
    console.log("filType12", filType);
    await handleSubmit(filType);
  };
  const deleteDesignerFiles = async (filename) => {
    setFileLoading(true);
    await apiClient
      .delete(`/api/del-designer-files/${id}/${filename}`)
      .then(({ data }) => {
        const { message } = data;
        setRespMessage(message);
        setTimeout(() => {
          setFileLoading(false);
          // setImageView([])
          openSuccessSB();
          designerFiles();
        }, 1000);
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data;
          // setImageView([])
          setFileLoading(false);
          setRespMessage(message);
          setTimeout(() => {
            openErrorSB();
          }, 1000);
        } else {
          setFileLoading(false);
          setRespMessage(err.message);
          setTimeout(() => {
            openErrorSB();
          }, 1000);
        }
      });
  };
  const deleteCustomerFiles = async (filename) => {
    setFileLoading(true);
    await apiClient
      .delete(`/api/del-customer-files/${id}/${filename}`)
      .then(({ data }) => {
        const { message } = data;
        setRespMessage(message);
        setTimeout(() => {
          setFileLoading(false);
          openSuccessSB();
          clientFiles();
        }, 1000);
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data;
          // setImageView([])
          setFileLoading(false);
          setRespMessage(message);
          setVersion([]);
          setTimeout(() => {
            openErrorSB();
          }, 1000);
        } else {
          setFileLoading(false);
          // setImageView([])
          setVersion([]);
          setRespMessage(err.message);
          setTimeout(() => {
            openErrorSB();
          }, 1000);
        }
      });
  };
  const deleteFile = async (filename) => {
    if (role?.projectManager || role?.designer || role?.admin) deleteDesignerFiles(filename);
    else {
      deleteCustomerFiles(filename);
    }
  };
  const managerUploadFiles = async (filType) => {
    setLoading(true);
    const formdata = new FormData();
    for (let i = 0; i < filType.length; i++) {
      formdata.append("files", filType[i]);
    }
    await apiClient
      .post("/api/designer-uploads/" + id, formdata)
      .then(({ data }) => {
        setLoading(false);
        setFiles([]);
        setFilesType([]);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err.message);
      });
  };
  const customerUploadFiles = async (filType) => {
    console.log("filTypcustomere,filType 1", filType.length);
    console.log("filTypcustomere,filType 2", filesType.length);
    setLoading(true);
    if (filType.length === 0) return;
    const formdata = new FormData();
    for (let i = 0; i < filType.length; i++) {
      formdata.append("files", filType[i]);
    }
    formdata.append("user_id", reduxState?.userDetails.id);
    formdata.append("name", reduxState?.userDetails.name);
    formdata.append("project_title", project.project_title);
    formdata.append("project_id", project?._id);
    await apiClient
      .post("/file/google-cloud", formdata)
      .then(() => {
        const data = {
          user_id: reduxState?.userDetails.id,
          name: reduxState?.userDetails.name,
          project_id: project?._id,
          project_title: project?.project_title,
        };
        apiClient
          .post("/file/get-files", data)
          .then(async () => {
            removeFiles();
            setLoading(false);
            setRespMessage("Files Uploaded");
            await getProjectData(reduxState.userDetails.id, reduxActions.getCustomerProject);
            await clientFiles();
            setTimeout(() => {
              openSuccessSB();
            }, 2000);
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        setLoading(false);
        setRespMessage(err?.response?.data.message);
        setTimeout(() => {
          openErrorSB();
        }, 1200);
        console.error("Error Found =>", err);
      });
  };

  const handleSubmit = async (filType) => {
    console.log("role", role);
    if (role?.designer || role?.projectManager || role?.admin) {
      managerUploadFiles(filType);
    } else {
      customerUploadFiles(filType);
    }
  };
  const showImageOnContainer = (item) => {
    setDownloadFileName(item?.download_link);
    setCurrentImage({
      name: item?.name,
      url: item?.url,
      type: item?.type,
    });
  };
  const DownloadFile = () => {
    if (!downloadfileName) return alert("Please select file");
    window.open(downloadfileName, "_blank");
  };
  const handleFolderName = (newValue) => {
    setCurrentFolder(newValue);
    if (newValue === "Customer Uploads") clientFiles();
    if (newValue === "Designer Uploads") designerFiles();
  };
  const removeFiles = () => {
    setFiles([]);
    setFilesType([]);
  };

  useEffect(() => {
    clientFiles();
    // designerFiles()
  }, []);
  // useEffect(() => {
  //     clientFiles()
  //     // designerFiles()
  // }, [re_render_chat])
  const dateFun = (timestamp) => {
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });

    const formattedDate = `${day}-${month}`;
    return formattedDate;
  };

  return (
    <MDBox className={classes.Container}>
      <Grid>
        <div className={classes.driveDiv}>
          <p>DRIVE</p>
        </div>
      </Grid>
      <hr />
      <Grid>
        <div className={classes.uploadbtndiv}>
          <button className={classes.uploadbtn}>Files</button>
          <button className={classes.uploadbtn}>Folders</button>

          <select value={selectedFileType} onChange={handleFileTypeChange} className="selectType1">
            <option value="">Type</option>
            <option value="svg">SVG</option>
            <option value="png">PNG</option>
            <option value="pdf">PDF</option>
          </select>
          <select value={selectedFileType} onChange={handleFileTypeChange} className="selectType1">
            <option value="">People</option>
            <option value="customer">Customer</option>
            <option value="designer">Designer</option>
          </select>
          <button className={classes.uploadbtn}>Date</button>
        </div>
      </Grid>
      <Grid container>
        {version?.length > 0 ? (
          <>
            {version?.map((ver) => (
              <>
                <Grid item xxl={4} xl={4} lg={4} md={4} xs={4}>
                  <div className={classes.uploadedfileMainDiv}>
                    <div className={classes.fileDiv2}>
                      <img src={pdfImg} />
                      <p className={classes.fileDiv2p}>{ver.name}</p>
                    </div>
                    <div className={classes.UserDiv}>
                      <img src={designerImg} className="adminImg1" />
                      <div>
                        <h6 className="userName1">Designer</h6>
                        <p className="date1">{dateFun(ver?.time)}</p>
                      </div>
                      <img src={tickImg} className="TickImg1" />
                    </div>
                  </div>
                </Grid>
              </>
            ))}
          </>
        ) : (
          <></>
        )}
      </Grid>

      <Grid container>
        <Grid item xxl={12} xl={12} lg={12} md={12} xs={12}>
          <div {...getRootProps()} className={classes.dropfileDiv} onClick={openFileSelect}>
            <input
              {...getInputProps()}
              id="new-file-upload"
              type="file"
              ref={fileRef}
              accept=".ai, .eps, .psd, .zip, .jpg, .png, .pdf, .jpeg, .svg"
              hidden={true}
              onChange={handleFileUpload}
              multiple
            />
            {isDragActive ? <p>Drop the files here...</p> : <p>Upload or drop file right here.</p>}
          </div>
          <button
            variant="mibanana"
            sx={uploadBtn}
            onClick={openFileSelect}
            className={"uploadfilebtn"}
          >
            Upload Files
          </button>
          <input
            id="new-file-upload"
            type="file"
            ref={fileRef}
            accept=".ai, .eps, .psd, .zip, .jpg, .png, .pdf, .jpeg, .svg"
            hidden={true}
            onChange={handleFileUpload}
            multiple
          />
        </Grid>
        <Grid item xxl={3} xl={3} lg={3} md={3} xs={3}></Grid>
      </Grid>
      <Grid container className={classes.adminDivGrid}>
        <div className={classes.adminDiv1}>
          <h2 className={classes.adminDiv1h2}>Author</h2>
          <div className="adminDiv2">
            <img src={adminImg} className="adminImg1" />
            <div>
              <h3 className={classes.adminDiv2h3}>Admin</h3>

              <p className={classes.adminDiv2p}>(super admin)</p>
            </div>
          </div>
        </div>
        <div className={classes.adminDiv1}>
          <h2 className={classes.adminDiv1h2}>Team Member</h2>
          <div className="adminDiv2">
            <img src={designerImg} className="adminImg1" />
            <div>
              <h3 className={classes.adminDiv2h3}>Designer b.</h3>
              <p className={classes.adminDiv2p}>(you)</p>
            </div>
          </div>
        </div>
        <div className={classes.adminDiv1}>
          <h2 className={classes.adminDiv1h2}>Brand</h2>
          <div className="adminDiv2">
            <img src={UserImg} className="adminImg1" />
            <div>
              <h3 className={classes.adminDiv2h3}>Desihgn M</h3>

              {/* <p className={classes.adminDiv2p}>(super admin)</p> */}
            </div>
          </div>
        </div>
      </Grid>
      <hr />
      <div className={classes.catdivmain}>
        <div className={classes.catdiv1}>
          <h2 className={classes.adminDiv1h2}>Category</h2>
          <p className="desc1">Graphic Design</p>
        </div>
        <div className={classes.catdiv1}>
          <h2 className={classes.adminDiv1h2}>Type</h2>
          <p className="desc1">Book Cover</p>
        </div>
        <div className={classes.catdiv1}>
          <h2 className={classes.adminDiv1h2}>Description</h2>
          <p className="desc1">Lorem ipsum dolor sit amet,</p>
        </div>
        <div className={classes.catdiv1}>
          <h2 className={classes.adminDiv1h2}>Size</h2>
          <p className="desc1">1024 X 1440px</p>
        </div>
        <div className={classes.catdiv1}>
          <h2 className={classes.adminDiv1h2}>Details</h2>
          <p className="desc1">Active</p>
        </div>
      </div>
      {/* <MDBox className={classes.mainImageContainer}>
        {files.length > 0 || filesType.length > 0 ? (
          <FileUpload
            files={files}
            filesType={filesType}
            handleSubmit={handleSubmit}
            loading={loading}
            removeFiles={removeFiles}
          />
        ) : (
          <ImageContainer item={currentImage} renderComponent={isRender} />
        )}
      </MDBox>
      <MDBox className={classes.sideBarContainer}>
        <SelectFolder handleChange={handleFolderName} name={currentFolder} />
        {fileMsg ? (
          <p style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>{fileMsg}</p>
        ) : null}
        {version.map((item, key) => (
          <ShowFiles
            key={key}
            item={item}
            showImageOnContainer={showImageOnContainer}
            deleteFile={deleteFile}
            currentImage={currentImage.name}
          />
        ))}
      </MDBox>
      <MDBox className={classes.secondContainer}>
        <MDTypography fontSize="medium" variant="h5">
          YOUR ARTWORK
        </MDTypography>
        <MoonLoader loading={loading || fileLoading ? true : false} size={22} color="#121212" />
      </MDBox> */}
    </MDBox>
  );
};

export default reduxContainer(FileUploadContainer);
