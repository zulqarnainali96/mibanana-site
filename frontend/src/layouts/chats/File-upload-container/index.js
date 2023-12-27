import { Grid, IconButton } from "@mui/material";
import { UploadIcon } from "assets/mi-banana-icons/upload-icon";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import React from "react";
import { useStyles } from "./styles";
import ShowFiles from "./show-files/ShowFiles";
import { useState } from "react";
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
  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setFilesType((prev) => [...prev, file]);
      if (
        file.type.startsWith(Jpg) ||
        file.type.startsWith(Jpeg) ||
        file.type.startsWith(Png) ||
        file.type.startsWith(Svg)
      ) {
        const reader = new FileReader();
        reader.onload = function () {
          newFiles.push(reader.result);
          setFiles(newFiles);
        };
        reader.readAsDataURL(file);
      }
    }
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
  const managerUploadFiles = async () => {
    setLoading(true);
    const formdata = new FormData();
    for (let i = 0; i < filesType.length; i++) {
      formdata.append("files", filesType[i]);
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
  const customerUploadFiles = async () => {
    setLoading(true);
    if (filesType.length === 0) return;
    const formdata = new FormData();
    for (let i = 0; i < filesType.length; i++) {
      formdata.append("files", filesType[i]);
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

  const handleSubmit = async () => {
    if (role?.designer || role?.projectManager || role?.admin) {
      managerUploadFiles();
    } else {
      customerUploadFiles();
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

  return (
    <MDBox className={classes.Container}>
      <Grid>
        <p>DRIVE</p>
      </Grid>
      <hr />
      <Grid container className={classes.uploadBox}>
        <Grid item xxl={8} xl={8} lg={8} md={8} xs={8}>
          {/* <MDBox className={classes.fileNameContainer}>
            <MDInput
              type="text"
              sx={inputSxStyles}
              value={currentImage.name}
              className={classes.fileNameInput}
            />
            <IconButton className={classes.iconBtn} onClick={DownloadFile} TouchRippleProps={false}>
              {UploadIcon}
            </IconButton>
          </MDBox> */}
        </Grid>
        <Grid item xxl={3} xl={3} lg={3} md={3} xs={3}>
          {/* <MDButton variant="mibanana" sx={uploadBtn} onClick={openFileSelect}>
            Upload Files
          </MDButton>
          <input
            id="new-file-upload"
            type="file"
            ref={fileRef}
            accept=".ai, .eps, .psd, .zip, .jpg, .png, .pdf, .jpeg, .svg"
            hidden={true}
            onChange={handleFileUpload}
            multiple
          /> */}
          {/* <IconButton className={classes.iconBtn} TouchRippleProps={false} >
                        {UploadIcon}
                    </IconButton> */}
        </Grid>
      </Grid>
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
