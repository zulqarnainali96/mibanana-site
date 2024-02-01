import {
  Grid,
  Box,
  Typography,
  Autocomplete,
  TextField,
  IconButton,
} from "@mui/material";
// import { UploadIcon } from "assets/mi-banana-icons/upload-icon";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
// import ImageViewer from "react-simple-image-viewer";
// import SelectMembers from "../team-members/select-members";
import pdffile from "assets/images/pdffile.svg";
import xls from "assets/images/xls.svg";
import eps from "assets/images/eps.svg";
import psdfile from "assets/images/psdfile.svg";
import ai_logo from "assets/mi-banana-icons/ai-logo.png"

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
// import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { useDropzone } from "react-dropzone";
import React from "react";
import { useStyles } from "./styles";
import SuccessModal from "components/SuccessBox/SuccessModal";

import ShowFiles from "./show-files/ShowFiles";
import adminImg from "assets/images/admin.svg";
import designerImg from "assets/images/d1.svg";
// import UserImg from "assets/images/u1.svg";
import pdfImg from "assets/images/pdf1.svg";
// import tickImg from "assets/images/t1.svg";
import { useState, useCallback } from "react";
// import ImageContainer from "./image-container/ImageContainer";
import { useEffect } from "react";
// import UploadFile from "components/File upload button/FileUpload";
import { useRef } from "react";
import { currentUserRole } from "redux/global/global-functions";
import reduxContainer from "redux/containers/containers";
import apiClient from "api/apiClient";
import { Link, useParams } from "react-router-dom";
// import SelectFolder from "./select-folder/SelectFolder";
// import { Jpeg, Jpg, Png, Svg } from "redux/global/file-formats";
// import FileUpload from "./file-upload-container/File-upload";
import { MoonLoader } from "react-spinners";
import { getProjectData } from "redux/global/global-functions";
import { mibananaColor } from "assets/new-images/colors";
import { fontsFamily } from "assets/font-family";
import { useSelector } from "react-redux";
import ImageViewModal from "examples/image-modal";
import "./file-upload.css"
import { Close, CloseRounded } from "@mui/icons-material";

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
  respMessage,
  reduxActions,
  showMore,
  setShowMore
}) => {
  const person_id = useSelector((state) => state.userDetails?.id);
  const projects = reduxState?.project_list?.CustomerProjects;
  const classes = useStyles();
  // const [previewAllImages, setPreviewAllImages] = useState([])

  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFilePeople, setSelectedFilePeople] = useState("");
  const [filesType, setFilesType] = useState([]);
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [activebtn, setActiveBtn] = useState("");

  const project = projects?.find((item) => item._id === id);
  const version1 = project?.add_files[0]?.version1;
  const [version, setVersion] = useState(version1);
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
  const [successOpen, setsuccessOpen] = useState(false);
  const [successMessage, setsuccessMessage] = useState("");
  const [currentImage, setCurrentImage] = useState(0)

  const [designerLoading, setDesignerLoading] = useState(false)
  const [teamMembers, setTeamMembers] = useState(project?.team_members)


  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const truncatedDescription = project?.project_description?.substring(0, 240);

  const openImage = useCallback((index) => {
    setIsViewerOpen(true)
    setCurrentImage(index)
  }, [isViewerOpen])

  const handleChange = (event) => {
    setMemberName(event.target.value);
  };

  const closeImageViewer = () => {
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
    if (fileVersion?.length === 0) {
      setFileVersionList(["1"]);
    } else {
      const lastNumber = parseInt(fileVersion[fileVersion?.length - 1]);
      const newNumber = (lastNumber + 1).toString();
      setFileVersionList((prev) => [...prev, newNumber]);
    }
  };

  // Client Files ====================================
  async function clientFiles() {
    setVersion([]);
    setFileMsg("");
    setLoading(true);
    await apiClient
      .get("/get-customer-files/" + id)
      .then(({ data }) => {
        // setVersion(data.filesInfo);
        handlePreviewImages(data?.filesInfo)
        setFileMsg("");
        setLoading(false);
      })
      .catch((err) => {
        setFileMsg("No Files Found");
        setVersion([]);
        setLoading(false);
      });
  }

  // Designer Files ====================================
  async function designerFiles() {
    setVersion([]);
    setFileMsg("");
    setLoading(true);
    await apiClient
      .get("/api/designer-uploads/" + id)
      .then(({ data }) => {
        // setVersion(data.filesInfo);
        handlePreviewImages(data?.filesInfo)
        setFileMsg("");
        setLoading(false);
      })
      .catch((err) => {
        setFileMsg("No Files Found");
        setVersion([]);
        setLoading(false);
      });
  }
  async function getFilesOnVerion(value) {
    setVersion([]);
    setFileMsg("");
    setLoading(true);
    await apiClient
      .get(`/api/get-version-uploads/${value}/${id}`)
      .then(({ data }) => {
        // setVersion(data.filesInfo);
        handlePreviewImages(data?.filesInfo)
        setFileMsg("");
        setLoading(false);
      })
      .catch((err) => {
        setFileMsg("No Files Found");
        setVersion([]);
        setLoading(false);
      });
  }
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    let filType = [];
    for (let i = 0; i < files.length; i++) {
      setFilesType(files[i]);
      filType.push(files[i]);
    }
    await handleSubmit(filType);
  };

  const onDrop = async (acceptedFiles) => {
    // Do something with dropped files
    await handleSubmit(acceptedFiles);

    // You can handle the dropped files here or trigger your existing file upload logic
    // For example, you can upload the dropped files by iterating through acceptedFiles and processing them
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const deleteDesignerFiles = async (filename) => {
    setLoading(true)
    await apiClient
      .delete(`/api/del-designer-files/${id}/${filename}`)
      .then(({ data }) => {
        const { message } = data;
        setRespMessage(message);
        setLoading(false)
        setTimeout(() => {
          openSuccessSB();
          designerFiles();
        }, 1000);
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data;
          setRespMessage(message);
          setLoading(false)
          setTimeout(() => {
            openErrorSB();
          }, 1000)
        } else {
          setRespMessage(err.message);
          setLoading(false)
          setTimeout(() => {
            openErrorSB();
          }, 1000);
        }
      });
  };
  // const deleteCustomerFiles = async (filename) => {
  //   await apiClient
  //     .delete(`/api/del-customer-files/${id}/${filename}`)
  //     .then(({ data }) => {
  //       const { message } = data;
  //       setRespMessage(message);
  //       setTimeout(() => {
  //         openSuccessSB();
  //         clientFiles();
  //       }, 1000);
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         const { message } = err.response.data;
  //         setRespMessage(message);
  //         setVersion([]);
  //         setTimeout(() => {
  //           openErrorSB();
  //         }, 1000);
  //       } else {
  //         setVersion([]);
  //         setRespMessage(err.message);
  //         setTimeout(() => {
  //           openErrorSB();
  //         }, 1000);
  //       }
  //     });
  // };
  const deleteFile = async (filename) => {
    if (role?.projectManager || role?.designer || role?.admin) {
      deleteDesignerFiles(filename)
    }

  };
  const getListThroughVersion = (e) => {
    if (e.target.value) {
      setSelectVersion(e.target.value);
      getFilesOnVerion(e.target.value);
    } else {
      setSelectVersion("")
    }
  };
  const managerUploadFiles = useCallback(async (filType) => {
    setLoading(true);
    const formdata = new FormData();
    for (let i = 0; i < filType.length; i++) {
      formdata.append("files", filType[i]);
    }
    await apiClient
      .post("/api/designer-uploads/" + id, formdata)
      .then(({ data }) => {
        setLoading(false);
        if (data?.message) {
          setRespMessage(data.message)
          setTimeout(() => {
            openSuccessSB()
          }, 400)
        }
        setFiles([]);
        setFilesType([]);
        designerFiles();
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data
          setRespMessage(message)
          setLoading(false)
          setTimeout(() => {
            openErrorSB()
          }, 400)
        } else {

          setLoading(false)
          setRespMessage(err.message)
          setTimeout(() => {
            openErrorSB()
          }, 400)
        }
      })
  }, [loading, respMessage, files, filesType])

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
        if (err.response) {
          const { message } = err.response.data
          setRespMessage(message)
          setLoading(false)
          setTimeout(() => {
            openErrorSB()
          }, 400)
          return
        }
        setLoading(false)
        setRespMessage(err.message)
        setTimeout(() => {
          openErrorSB()
        }, 400)
      })
  };
  const versionUploads = async (filType) => {
    if (!currentVersion) {
      console.log(currentVersion)
      alert("please select version first")
      return
    }
    setLoading(true);
    const formdata = new FormData();
    for (let i = 0; i < filType.length; i++) {
      formdata.append("files", filType[i]);
    }
    await apiClient
      .post(`/api/version-uploads/${currentVersion}/${id}`, formdata)
      .then(async ({ data }) => {
        setLoading(false);
        setFiles([]);
        setFilesType([]);
        await getProjectData(reduxState?.userDetails?.id, reduxActions.getCustomerProject);
        setTimeout(() => {
          getFilesOnVerion(currentVersion)
        }, 700)
        if (data.message) {
          setRespMessage(data.message)
          setTimeout(() => {
            openSuccessSB()
          },)
        }
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data
          setRespMessage(message)
          setLoading(false)
          setTimeout(() => {
            openErrorSB()
          }, 400)
        } else {
          setLoading(false)
          setRespMessage(err.message)
          setTimeout(() => {
            openErrorSB()
          }, 400)
        }
      })
  };
  const handleSubmit = async (fileType) => {
    if (role?.designer || role?.projectManager || role?.admin) {
      if (currentVersion) {
        versionUploads(fileType);
        console.log('version upload')
      } else {
        console.log('designer upload ' + currentVersion)
        managerUploadFiles(fileType);
      }
    } else {
      customerUploadFiles(fileType);
    }
  };
  const deleteDesigner = (val) => {
    console.log(val)
    setDesignerLoading(true)
    const formdata = {
      user: val?._id,
      project_id: id
    }
    apiClient.put(`/api/delete-designer`, formdata)
      .then(({ data }) => {
        setDesignerLoading(false);
        getProjectData(reduxState?.userDetails?.id, reduxActions.getCustomerProject);
        if (data.message) {
          // setRespMessage(data.message)
          setsuccessMessage(data.message)
          setTimeout(() => {
            setTeamMembers([])
            setsuccessOpen(true)
            // openSuccessSB()
          }, 500)
        }
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data
          setRespMessage(message)
          setDesignerLoading(false)
          setTimeout(() => {
            openErrorSB()
          }, 500)
        } else {
          setDesignerLoading(false)
          setRespMessage(err.message)
          setTimeout(() => {
            openErrorSB()
          }, 500)
        }
      })

  }

  const DownloadFile = (downloadfileName) => {
    if (!downloadfileName) return alert("Please select file");
    window.open(downloadfileName, "_blank");
  };
  const removeFiles = () => {
    setFiles([]);
    setFilesType([]);
  };
  useEffect(() => {
    getAllfiles();
  }, []);

  useEffect(() => {
    setFileVersionList(project?.version)
  }, [project?.version])

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

  // ---------- Version Files for All

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
      const response = await apiClient.get("/api/designer-uploads/" + id);
      const { data } = response;

      return data.filesInfo || [];
    } catch (err) {
      return [];
    }
  };
  const getAllVersionFiles = async () => {
    if (fileVersion?.length === 0) return []
    let allversionfiles = []
    for (let b = 0; b < fileVersion?.length; b++) {
      const current_version = fileVersion[b]
      try {
        const { data } = await apiClient.get(`/api/get-version-uploads/${current_version}/${id}`);
        if (allversionfiles.length > 0) {
          const files = [...allversionfiles, ...data?.filesInfo]
          allversionfiles = files
          console.log(files)
        } else {
          allversionfiles = data?.filesInfo
        }
      } catch (err) {
        console.error('Error No file found in ' + current_version)
      }
    }
    return allversionfiles
  }
  // ---------- Version Files for All

  const handlePreviewImages = (images) => {
    let arr = []
    for (let i = 0; i < images?.length; i++) {
      const file_type = images[i]?.type?.split('/').pop()
      const currentImage = images[i]?.url
      const id = images[i]?.id
      if (file_type === "pdf") {
        arr.push({ ...images[i], image: pdffile })
      } else if (file_type === "ai") {
        arr.push({ ...images[i], image: ai_logo })
      } else if (file_type === "xlsx" || file_type === "xls") {
        arr.push({ ...images[i], image: xls })
      } else if (file_type === "postscript") {
        arr.push({ ...images[i], image: eps })
      } else if (file_type === "psd") {
        arr.push({ ...images[i], image: psdfile })
      } else if (file_type === "svg+xml") {
        arr.push({ ...images[i], image: currentImage })
      } else {
        arr.push({ ...images[i], image: currentImage })
      }
    }
    // setPreviewAllImages(arr)
    setVersion(arr)
  }

  const getAllfiles = async () => {
    setLoading(true);
    const clientFilesData = await clientFilesforAll();
    const designerFiles = await designerFilesforAll();
    const get_all_version_Files = await getAllVersionFiles()
    const combinedData = [...clientFilesData, ...designerFiles, ...get_all_version_Files];
    console.log(combinedData)
    // setVersion(combinedData);
    handlePreviewImages(combinedData)
    setLoading(false);
  };
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
  const getAllDesignersList = async () => {
    await apiClient.get("/api/get-designer-list/" + person_id)
      .then(({ data }) => {
        setDesignerList(data?.designerlist)
      })
      .catch((e) => {

      });
  }

  useEffect(() => {
    getAllDesignersList()
    getAllfiles()
  }, []);

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
  const SubmitProject = async (value) => {
    setMemberName(value);
    if (value) {
      setDesignerLoading(true);
      let project = personProject();
      project.team_members = [value];
      project.status = "Assigned";
      project.is_active = true;

      let data = {
        project_id: personProject()?._id,
        project_data: project,
      };
      await apiClient.patch("/graphic-project", data)
        .then(({ data }) => {
          const { save } = data;
          setTeamMembers(save?.team_members)
          setsuccessMessage(data?.message);
          setsuccessOpen(true);
          setDesignerLoading(false)
        })
        .catch((e) => {
          setDesignerLoading(false)
          console.error("Error assgin project => ", e?.response?.data?.message);
        });
    }
  };

  const deleteVersion = async (version) => {
    setLoading(true)
    apiClient.delete(`/api/del-version-uploads/${version}/${id}`)
      .then(({ data }) => {
        setLoading(false);
        getProjectData(reduxState?.userDetails?.id, reduxActions.getCustomerProject)
        setVersion([])
        if (data?.message) {
          setRespMessage(data.message)
          setTimeout(() => {
            openSuccessSB()
          }, 400)
        }
      }).catch((err) => {
        if (err.response) {
          const { message } = err.response.data
          setRespMessage(message)
          setLoading(false)
          setTimeout(() => {
            openErrorSB()
          }, 400)
          return
        }
        setLoading(false)
        setRespMessage(err.message)
        setTimeout(() => {
          openErrorSB()
        }, 400)
      })
  };
  const versionHandler = async () => {
    if (!currentVersion.length) {
      let message = "Type version no that you want to delete";
      const val = parseInt(prompt(message));
      if (val) {
        await deleteVersion(val)
      }
    } else {
      await deleteVersion(currentVersion)
    }
  };
  const handleClose = () => setsuccessOpen(false);
  useEffect(() => {

  }, [teamMembers])

  return (
    <MDBox className="chat-2" sx={{ height: '100%', backgroundColor: mibananaColor.headerColor }}>

      <MDBox
        sx={{
          bgcolor: "#F6F6E8",
          px: 1,
          height: showMore ? undefined : '100%'
        }}
      >
        <SuccessModal
          open={successOpen}
          msg={successMessage}
          onClose={handleClose}
          width="35%"
          color="#333"
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
                className={`uploadbtn ${activebtn == "files" && "activeClass"}`}
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
                <button className="selectType1 addnewversion" onClick={versionHandler} style={addVersionStyle}>
                  Delete version
                </button>
              ) : null}
            </>
          </Grid>
          {!loading ? (
            <Grid container className="filesGrid" display={"grid"} position={"relative"}>
              <>
                {" "}
                {version?.length > 0 ? (
                  <>
                    {filterFunction(version).length > 0 ? (
                      filterFunction(version)?.map((ver, index) => (
                        <>
                          <Grid item xxl={3} xl={3} lg={3} md={3} xs={6} className="file-grid-item" height={version?.length < 5 ? "147px" : undefined}>
                            <div className={`upload-file-main ${classes.uploadedfileMainDiv}`}>
                              {(role?.projectManager || role?.designer || role?.admin) && (
                                <IconButton onClick={() => deleteFile(ver?.name)} className="deleteIcon">
                                  <Close fontSize="small" />
                                </IconButton>
                              )}

                              <DownloadForOfflineIcon
                                onClick={() => DownloadFile(ver?.download_link)}
                                className="downloadicon"
                              />
                              <div className={classes.fileDiv2}>
                                <div className="file-image-container">
                                  <ShowFiles
                                    src={ver?.image}
                                    altname={ver?.name}
                                    onClick={() => openImage(index)}
                                  />
                                  {/* <img src={ver?.image} click={openImage} className="fileImg1" /> */}
                                </div>
                                <p className={classes.fileDiv2p}>{ver?.name?.substring(0, 4)}</p>
                              </div>

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

            </Grid>
          ) : (
            <>
              <Grid container justifyContent={"center"} height="30vh" alignItems={"center"}>
                <Grid item textAlign="center" xxl={12} xl={12} md={12} lg={12} sm={12} xs={12}>
                  <CircularProgress />
                </Grid>
              </Grid>
            </>
          )}
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

          <div className="project-details project-details-1">
            <div className="project-details-div">
              <h2 className={classes.adminDiv1h2}>Author</h2>
              <div className="adminDiv2">
                <img src={adminImg} className="adminImg1" />
                <div>
                  <h3 className={classes.adminDiv2h3}>{project?.name}</h3>
                </div>
              </div>
            </div>
            <div className="project-details-div">
              <h2 className={classes.adminDiv1h2}>Team Member</h2>
              <div className="adminDiv2">
                {designerLoading ? <MoonLoader className="designer-loading" loading={designerLoading} size={24} color='#121212' /> : (
                  <>
                    {teamMembers.length > 0 ? (
                      <>
                        <img src={designerImg} className="adminImg1" />
                        {teamMembers.map((item, i) => (
                          <div key={i}>
                            {role?.projectManager && (<IconButton className="remove-designer" onClick={() => deleteDesigner(item)}>
                              <CloseRounded fontSize="small" />
                            </IconButton>)}
                            <h3 className={classes.adminDiv2h3}>{item?.name}</h3>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {role?.projectManager ? (
                          <Autocomplete
                            value={memberName}
                            onChange={(event, newValue) => {
                              SubmitProject(newValue)
                            }}
                            options={designerList}
                            getOptionLabel={(option) => option.name ? option.name : ''}
                            sx={{ width: '95%' }}
                            renderInput={(params) => <TextField required {...params} placeholder="Select Designer" />}
                          />
                        ) : (
                          <p className="notassign">Not Assigned</p>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="project-details-div">
              <h2 className={classes.adminDiv1h2}>Brand</h2>
              <div className="adminDiv2">
                <h3 className={classes.adminDiv2h3}>{project?.brand}</h3>
              </div>
            </div>
            <div className="project-details-div">
              <h2 className={classes.adminDiv1h2}>Category</h2>
              <div className="adminDiv2">
                <h3 className={classes.adminDiv2h3}>{project?.project_category}</h3>
              </div>
              {/* <Typography variant="h6">
                  {project?.project_category}
                </Typography> */}
            </div>
          </div>
          <hr />
          <div className="project-details project-details-2">
            <div className="project-details-div">
              <h2 className={classes.adminDiv1h2}>Project Title</h2>
              <Typography variant="h6" className="desc1">
                {project?.project_title?.length > 10 ? project?.project_title?.substring(0, 10) + '...' : project?.project_title}
              </Typography>
            </div>
            <div className="project-details-div">
              <h2 className={classes.adminDiv1h2}>Type</h2>
              <Typography variant="h6" className="desc1">
                {project?.design_type}
              </Typography>
            </div>

            <div className="project-details-div">
              <h2 className={classes.adminDiv1h2}>Size</h2>
              <Typography variant="h6" className="desc1">
                {project?.sizes}
              </Typography>
            </div>
            <div className="project-details-div">
              <h2 className={classes.adminDiv1h2}>Details</h2>
              <Typography variant="h6" className="desc1">
                {project?.is_Active ? "Active" : "Not Active"}
              </Typography>
            </div>
          </div>
        </Box>
        <div className="project-details project-details-3">
          <div className={classes.descriptiondiv}>
            <h2 className={classes.adminDiv1h2}>Description</h2>
            <Typography
              variant="h6"
              className="desc1"
              dangerouslySetInnerHTML={{
                __html: showMore ? project?.project_description : truncatedDescription,
              }}
            ></Typography>
            {project?.project_description?.length > 240 && (
              <Link
                style={{
                  fontSize: '12px',
                  color: '#344767',
                  fontWeight: 600,
                  fontFamily: fontsFamily.poppins,
                }} onClick={toggleShowMore}>{showMore ? "Show Less" : "Show More"}</Link>
            )}
          </div>
        </div>
        {isViewerOpen && (
          <ImageViewModal
            open={isViewerOpen}
            onClose={closeImageViewer}
            allImages={version}
            currentImage={currentImage}
          />
        )}
      </MDBox>
    </MDBox>
  );
};

const addVersionStyle = {
  backgroundColor: mibananaColor.headerColor,
  color: "#000",
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
