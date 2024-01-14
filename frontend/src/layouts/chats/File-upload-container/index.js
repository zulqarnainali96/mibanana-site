import {
  Grid,
  Box,
  IconButton,
  MenuItem,
  Select,
  OutlinedInput,
  Button,
  InputLabel,
  FormControl,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { UploadIcon } from "assets/mi-banana-icons/upload-icon";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ImageViewer from "react-simple-image-viewer";
import SelectMembers from "../team-members/select-members";
import pdffile from "assets/images/pdffile.svg";
import xls from "assets/images/xls.svg";
import eps from "assets/images/eps.svg";
import psdfile from "assets/images/psdfile.svg";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { useDropzone } from "react-dropzone";
import React from "react";
import { useStyles } from "./styles";
import SuccessModal from "components/SuccessBox/SuccessModal";

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
import { mibananaColor } from "assets/new-images/colors";
import { fontsFamily } from "assets/font-family";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";

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
  const idIs = useSelector((state) => state.userDetails?.id);
  const projects = reduxState?.project_list?.CustomerProjects;
  const [currentImage, setCurrentImage] = useState({
    name: "",
    url: "",
    type: "",
  });
  const classes = useStyles();

  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFilePeople, setSelectedFilePeople] = useState("");

  const [currentFolder, setCurrentFolder] = useState("Customer Uploads");
  const [filesType, setFilesType] = useState([]);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [isRender, setIsRender] = useState(false);
  const [activebtn, setActiveBtn] = useState("");

  const project = projects?.find((item) => item._id === id);
  const version1 = project?.add_files[0]?.version1;
  const [version, setVersion] = useState(version1);
  const [downloadfileName, setDownloadFileName] = useState("");
  const [memberName, setMemberName] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileMsg, setFileMsg] = useState("");
  const re_render_chat = reduxState?.re_render_chat;
  const fileRef = useRef(null);
  const role = currentUserRole(reduxState);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [previewimg, setpreviewimg] = useState("");
  const [currentVersion, setSelectVersion] = useState("");
  const [fileVersion, setFileVersionList] = useState(project?.version);
  const [designerObj, setDesignerObj] = useState([]);
  const [designerList, setDesignerList] = useState([]);
  const [is_member, setIsMember] = useState(false);
  const [successOpen, setsuccessOpen] = useState(false);
  const [successMessage, setsuccessMessage] = useState("");
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const truncatedDescription = project?.project_description?.substring(0, 50);

  const openImageViewer = useCallback((img) => {
    console.log("image", img, pdffile);
    const fileExtension = img.split(".").pop();
    console.log("File extension:", fileExtension);
    if (fileExtension === "pdf") {
      setpreviewimg(pdffile);
      setIsViewerOpen(true);
    } else if (fileExtension === "ai") {
      setpreviewimg(img);
      setIsViewerOpen(true);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      setpreviewimg(xls);
      setIsViewerOpen(true);
    } else if (fileExtension === "eps") {
      setpreviewimg(eps);
      setIsViewerOpen(true);
    } else if (fileExtension === "psd") {
      setpreviewimg(psdfile);
      setIsViewerOpen(true);
    } else {
      setpreviewimg(img);
      setIsViewerOpen(true);
    }
  }, []);
  const handleChange = (event) => {
    setMemberName(event.target.value);
  };

  const closeImageViewer = () => {
    setpreviewimg("");
    setIsViewerOpen(false);
  };

  const openFileSelect = () => {
    fileRef.current.click();
  };
  const handleFileTypeChange = (event) => {
    setActiveBtn("type");
    setSelectedFileType(event.target.value); // Update selected file type on change
  };
  const handleFilePeopleChange = (event) => {
    setActiveBtn("folder");
    setSelectedFilePeople(event.target.value); // Update selected file type on change
  };

  const addFileVerion = () => {
    const lastNumber = parseInt(fileVersion[fileVersion?.length - 1]);
    const newNumber = (lastNumber + 1).toString();
    setFileVersionList((prev) => [...prev, newNumber]);
  };

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
    setLoading(true);
    await apiClient
      .get("/api/designer-uploads/" + id)
      .then(({ data }) => {
        setVersion(data.filesInfo);
        setFileMsg("");
        setFileLoading(false);
        setLoading(false);
      })
      .catch((err) => {
        setFileMsg("No Files Found");
        setCurrentImage({ url: "" });
        setVersion([]);
        setFileLoading(false);
        setLoading(false);
      });
  }
  async function getFilesOnVerion(value) {
    setVersion([]);
    setFileMsg("");
    setFileLoading(true);
    setLoading(true);
    await apiClient
      .get(`/api/get-version-uploads/${value}/${id}`)
      .then(({ data }) => {
        setVersion(data.filesInfo);
        setFileMsg("");
        setFileLoading(false);
        setLoading(false);
      })
      .catch((err) => {
        setFileMsg("No Files Found");
        setCurrentImage({ url: "" });
        setVersion([]);
        setFileLoading(false);
        setLoading(false);
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
      setFilesType(files[i]);
      filType.push(files[i]);
    }
    await handleSubmit(filType);
  };
  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with dropped files
    await handleSubmit(acceptedFiles);

    // You can handle the dropped files here or trigger your existing file upload logic
    // For example, you can upload the dropped files by iterating through acceptedFiles and processing them
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
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
          return;
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
    if (selectedFilePeople == "customer") {
      deleteCustomerFiles(filename);
      return;
    }
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
        designerFiles();
      })
      .catch((err) => {
        setLoading(false);
        console.error(err.message);
      });
  };
  const customerUploadFiles = async (filType) => {
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
            }, 1000);
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
  const versionUploads = async (filType) => {
    setLoading(true);
    const formdata = new FormData();
    for (let i = 0; i < filType.length; i++) {
      formdata.append("files", filType[i]);
    }
    await apiClient
      .post(`/api/version-uploads/${currentVersion}/${id}`, formdata)
      .then(({ data }) => {
        setLoading(false);
        setFiles([]);
        setFilesType([]);
        getProjectData(reduxState?.userDetails?.id, reduxActions.getCustomerProject);
        // designerFiles();
      })
      .catch((err) => {
        setLoading(false);
        console.error(err.message);
      });
  };
  const handleSubmit = async (filType) => {
    if (currentVersion) {
      versionUploads(filType);
      openSuccessSB();
    } else {
      if (role?.designer || role?.projectManager || role?.admin) {
        managerUploadFiles(filType);
        openSuccessSB();
      } else {
        customerUploadFiles(filType);
        openSuccessSB();
      }
    }
  };
  const clearCurrentVersion = () => {
    setSelectVersion("");
  };
  const showImageOnContainer = (item) => {
    setDownloadFileName(item?.download_link);
    setCurrentImage({
      name: item?.name,
      url: item?.url,
      type: item?.type,
    });
  };
  const DownloadFile = (downloadfileName) => {
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
    getAllfiles();
  }, []);
  useEffect(() => {
    getfiles();
  }, [selectedFilePeople]);

  const getfiles = () => {
    if (selectedFilePeople == "designer") {
      designerFiles();
    } else if (selectedFilePeople == "customer") {
      clientFiles();
    } else {
      role?.projectManager || role?.designer || role?.admin ? designerFiles() : clientFiles();
    }
  };

  async function clientFilesforAll() {
    try {
      const response = await apiClient.get("/get-customer-files/" + id);
      const { data } = response;

      return data.filesInfo || [];
    } catch (err) {
      return [];
    }
  }
  const designerFilesforAll = async () => {
    try {
      setFileLoading(true);
      const response = await apiClient.get("/api/designer-uploads/" + id);
      const { data } = response;
      setFileLoading(false);

      return data.filesInfo || [];
    } catch (err) {
      setFileLoading(false);
      return [];
    }
  };
  const getAllfiles = async () => {
    setLoading(true);
    const clientFilesData = await clientFilesforAll();
    const designerFiles = await designerFilesforAll();
    const combinedData = [...clientFilesData, ...designerFiles];
    setVersion(combinedData);
    setLoading(false);
  };
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
  const filterFunction = (files) => {
    if (selectedFileType) {
      const filterFiles = files.filter((file) => {
        const fileExtension = file?.name.split(".").pop();
        return fileExtension === selectedFileType;
      });
      // sort on the base of latest
      filterFiles.sort((a, b) => new Date(b.time) - new Date(a.time));
      return filterFiles;
    } else {
      files.sort((a, b) => new Date(b.time) - new Date(a.time));
      return files;
    }
  };
  const getListThroughVersion = (e) => {
    setSelectVersion(e.target.value);
    getFilesOnVerion(e.target.value);
  };
  console.log(currentVersion);
  // console.log("idIs", idIs);
  // console.log("id", id);
  useEffect(() => {
    if (role?.projectManager) {
      apiClient
        .get("/api/get-designer-list/" + idIs)
        .then(({ data }) => {
          setDesignerObj(data?.designerlist);
          setDesignerList(data?.designerlist);
        })
        .catch((e) => {
          // console.log('Getting designer list ', e?.response?.data?.message)
        });
    }
  }, [is_member]);
  const personProject = () => {
    if (reduxState.project_list?.CustomerProjects) {
      const singleProject = reduxState.project_list?.CustomerProjects?.find(
        (item) => item?._id === id
      );
      return singleProject;
    } else {
      return {};
    }
  };

  const SubmitProject = async (e) => {
    setMemberName(e.target.value);
    console.log("selected member", e.target.value, role?.projectManager);

    if (role?.projectManager && e.target.value) {
      let project = personProject();
      project.team_members = [e.target.value];
      project.status = "Ongoing";
      project.is_active = true;

      let data = {
        project_id: personProject()?._id,
        project_data: project,
        // project_data: {
        //     team_member : memberName,
        //     status : "Ongoing",
        //     is_active : isActive
        // }
      };
      console.log("data is", data);
      setLoading(true);
      await apiClient
        .patch("/graphic-project", data)
        .then(({ data }) => {
          const { save } = data;
          setsuccessMessage(data?.message);
          setsuccessOpen(true);
          // const updatedProjects = reduxState.project_list.CustomerProjects.filter( item => item._id !== save.id)
          // const allProject = [...updatedProjects,save]
          // reduxFunctions.getCustomerProjects(allProject)
          // setRespMessage(data?.message);
          setIsMember((prev) => !prev);
          setLoading(false);
          // setTimeout(() => {
          //   handleOpen();
          //   // openSuccessSB()
          // }, 600);
        })
        .catch((e) => {
          setLoading(false);
          console.error("Error assgin project => ", e?.response?.data?.message);
        });
    }
  };

  const deleteVersion = () => {
    const deleteFile = () => {
      apiClient.delete(``);
    };
    if (!currentVersion.length) {
      let message = "Type version no that you want to delete";
      const val = prompt(message);
      if (val) {
      }
    } else {
      console.log(currentVersion);
    }
  };
  const handleClose = () => setsuccessOpen(false);

  return (
    <MDBox
      sx={{
        bgcolor: "#F6F6E8",
        px: 1,
      }}
    >
      <SuccessModal
        open={successOpen}
        msg={successMessage}
        onClose={handleClose}
        width="30%"
        color="#288e28"
        title="SUCCESS"
        sideRadius={false}
      />
      <Grid>
        <MDTypography
          sx={({ palette: { primary } }) => ({
            fontFamily: fontsFamily.poppins,
            color: mibananaColor.tableHeaderColor,
            fontWeight: "bold",
            fontSize: "16px",
            padding: "10px 0",
            borderBottom: `2px solid ${mibananaColor.tableHeaderColor}`,
          })}
          variant="h4"
          pb={1}
        >
          DRIVE
        </MDTypography>
      </Grid>
      <Box sx={{ background: "#fff", mt: 1, pt: 1 }}>
        <Grid>
          <>
            <button
              className={`${classes.uploadbtn} ${activebtn == "files" && "activeClass"}`}
              onClick={() => {
                setActiveBtn("files");
                getAllfiles();
              }}
            >
              Files
            </button>
            <select
              value={selectedFilePeople}
              onChange={handleFilePeopleChange}
              className={`selectType1 ${activebtn == "folder" && "activeClass"}`}
            >
              <option value="">Folders</option>
              <option value="customer">Customer</option>
              <option value="designer">Designer</option>
            </select>
            <select
              value={selectedFileType}
              onChange={handleFileTypeChange}
              className={`selectType1 ${activebtn == "type" && "activeClass"}`}
            >
              <option value="">Type</option>
              <option value="svg">SVG</option>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="pdf">PDF</option>
            </select>
            <select
              className="selectType1"
              style={{ borderRight: "0px" }}
              value={currentVersion}
              onChange={getListThroughVersion}
            >
              <option value="">Not Selected</option>
              {fileVersion?.length > 0 ? (
                fileVersion.map((item) => (
                  <>
                    <option value={item}>{`version ${item}`}</option>
                  </>
                ))
              ) : (
                <>
                  <option value="">no options</option>
                </>
              )}
            </select>
            {/* <button
              className="selectType1"
              onClick={clearCurrentVersion}
              style={removeVersionStyle}
            >
              <Close sx={{ marginTop: "3px" }} />
            </button> */}
            {role?.projectManager || role?.designer || role?.admin ? (
              <button
                className="selectType1 addnewversion"
                onClick={addFileVerion}
                style={addVersionStyle}
              >
                Add new version
              </button>
            ) : null}
            {role?.projectManager || role?.designer || role?.admin ? (
              <button className=" addnewversion" onClick={deleteVersion} style={addVersionStyle}>
                Delete version
              </button>
            ) : null}
          </>
        </Grid>
        <Grid container className="filesGrid">
          {!loading ? (
            <>
              {" "}
              {version?.length > 0 ? (
                <>
                  {filterFunction(version).length > 0 ? (
                    filterFunction(version)?.map((ver) => (
                      <>
                        <Grid item xxl={4} xl={4} lg={4} md={4} xs={4}>
                          <div className={classes.uploadedfileMainDiv}>
                            {(role?.projectManager || role?.designer || role?.admin) && (
                              <div onClick={() => deleteFile(ver?.name)} className="deleteIcon">
                                x
                              </div>
                            )}

                            <DownloadForOfflineIcon
                              onClick={() => DownloadFile(ver?.download_link)}
                              className="downloadicon"
                            />
                            {console.log("var", ver)}
                            <div className={classes.fileDiv2}>
                              <div>
                                <img
                                  src={ver.url}
                                  className="fileImg1"
                                  onClick={() => openImageViewer(ver.url)}
                                />
                                {isViewerOpen && (
                                  <ImageViewer
                                    src={[previewimg]}
                                    disableScroll={false}
                                    closeOnClickOutside={true}
                                    onClose={closeImageViewer}
                                    style={{ width: "100%", height: "100px" }}
                                  />
                                )}
                              </div>
                              <p className={classes.fileDiv2p}>{ver.name.substring(0, 15)}</p>
                            </div>
                            {/* <div className={classes.UserDiv}>
                        <img src={designerImg} className="adminImg1" />
                        <div>
                          <h6 className="userName1">Designer</h6>
                          <p className="date1">{dateFun(ver?.time)}</p>
                        </div>
                        <img src={tickImg} className="TickImg1" />
                      </div> */}
                          </div>
                        </Grid>
                      </>
                    ))
                  ) : (
                    <div className="nofilefoundDiv">
                      {" "}
                      <h1>No file found</h1>
                    </div>
                  )}
                </>
              ) : (
                <div className="nofilefoundDiv">
                  {" "}
                  <h1>No data found</h1>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="loaderfile">
                <CircularProgress />
              </div>
            </>
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
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <p>Upload or drop file right here.</p>
              )}
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
                <h3 className={classes.adminDiv2h3}>{project?.name}</h3>

                {/* <p className={classes.adminDiv2p}>(super admin)</p> */}
              </div>
            </div>
          </div>
          <div className={classes.adminDiv1}>
            <h2 className={classes.adminDiv1h2}>Team Member</h2>
            <div className="adminDiv2">
              {console.log("projectproject", project)}
              {project?.team_members.length > 0 ? (
                <>
                  {" "}
                  <img src={designerImg} className="adminImg1" />
                  <div>
                    {project?.team_members.map((item) => (
                      <h3 className={classes.adminDiv2h3}>{item.name}</h3>
                    ))}
                    {/* <p className={classes.adminDiv2p}>(you)</p> */}
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  {role?.projectManager ? (
                    <Select
                      value={memberName}
                      onChange={SubmitProject}
                      displayEmpty
                      className={`selectType2 ${activebtn === "folder" && "activeClass"}`}
                    >
                      <MenuItem value="" className="">
                        Select team member
                      </MenuItem>
                      {designerList?.length &&
                        designerList.map((item) => (
                          <MenuItem value={item} key={item._id} className="">
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  ) : (
                    <p className="notassign">Not Assigned</p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className={classes.adminDiv1}>
            <h2 className={classes.adminDiv1h2}>Brand</h2>
            <div className="adminDiv2">
              {/* <img src={UserImg} className="adminImg1" /> */}
              <div style={{ marginTop: "25px" }}>
                <h3 className={classes.adminDiv2h3}>{project?.brand}</h3>
                {/* <p className={classes.adminDiv2p}>(super admin)</p> */}
              </div>
            </div>
          </div>
          <div className={classes.adminDiv1}>
            <h2 className={classes.adminDiv1h2}>Category</h2>
            <Typography variant="h6" sx={{ marginTop: "25px" }}>
              {project?.project_category}
            </Typography>
          </div>
        </Grid>
        <hr />
        <div className={classes.catdivmain}>
          <div className={classes.catdiv1}>
            <h2 className={classes.adminDiv1h2}>Type</h2>
            <Typography variant="h6" className="desc1">
              {project?.design_type}
            </Typography>
          </div>

          <div className={classes.catdiv1}>
            <h2 className={classes.adminDiv1h2}>Size</h2>
            <Typography variant="h6" className="desc1">
              {project?.sizes}
            </Typography>
          </div>
          <div className={classes.catdiv1}>
            <h2 className={classes.adminDiv1h2}>Details</h2>
            <Typography variant="h6" className="desc1">
              {project?.is_Active ? "ACtive" : "Not Active"}
            </Typography>
          </div>
        </div>
      </Box>
      <div className={classes.adminDivGrid}>
        <div className={classes.descriptiondiv}>
          <h2 className={classes.adminDiv1h2}>Description</h2>
          <Typography
            variant="h6"
            className="desc1"
            dangerouslySetInnerHTML={{
              __html: showMore ? project?.project_description : truncatedDescription,
            }}
          ></Typography>
          {project?.project_description.length > 50 && (
            <Button onClick={toggleShowMore}>{showMore ? "Show Less" : "Show More"}</Button>
          )}
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

const addVersionStyle = {
  backgroundColor: mibananaColor.headerColor,
  outline: 1,
  color: "#000",
  marginLeft: "-10px",
};

const removeVersionStyle = {
  backgroundColor: "transparent",
  color: "#000",
  paddingInline: 11,
  height: 30,
  marginLeft: "-13px",
  border: "1px solid #000",
  borderLeft: "0px",
};
export default reduxContainer(FileUploadContainer);
