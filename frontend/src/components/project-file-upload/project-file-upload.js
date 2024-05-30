import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { fontsFamily } from 'assets/font-family'
import { mibananaColor } from 'assets/new-images/colors'
import MDBox from 'components/MDBox'
import React from 'react'
import ShowingFilesContainer from './components/showing-files'
import "./file-upload.css"
import CircularProgressLoader from './components/circular-progress-loader'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import CachedIcon from "@mui/icons-material/Cached";
import IconButton from "@mui/material/IconButton";
import MDTypography from 'components/MDTypography'
import ImageViewModal from 'examples/image-modal'
import GetLatestFiles from './components/get-latest-files'

const FileUploadButtons = ({
    openFileSelect,
    getInputProps,
    getRootProps,
    fileRef,
    handleFileUpload,
    isDragActive,
}) => {

    return <Grid container>
        <Grid item xxl={12} xl={12} lg={12} md={12} xs={12}>
            <div
                {...getRootProps()}
                className="drop-file-div" onClick={openFileSelect}>
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
}

const ProjectFileUpload = ({
    role,
    fileRef,
    project,
    openImage,
    children,
    currentImage,
    DownloadFile,
    handleDeleteFile,
    closeImageViewer,
    isViewerOpen,
    setIsViewerOpen,
    getDate,
    version,
    loading,
    showMore,
    handleRole,
    reload,
    openFileSelect,
    toggleShowMore,
    getRootProps,
    getInputProps,
    handleFileUpload,
    isDragActive,
    truncatedDescription,
    latestButtonProps,
}) => {

    const fileChild = {
        bgcolor: "#F6F6E8",
        px: 1,
        height: showMore ? undefined : '100%'
    }

    return (
        <MDBox className="chat-2" sx={fileUpContainer}>
            <MDBox sx={fileChild}>
                <Grid container sx={gridStyle}>
                    <Grid item xs={6} md={6} lg={6} xl={6}>
                        <MDTypography
                            sx={typographyStyle}
                            variant="h4"
                            pb={1}
                        >
                            DRIVE
                        </MDTypography>
                    </Grid>
                    <Grid item xs={6} md={6} lg={6} xl={6} textAlign={"right"}>
                        <IconButton onClick={reload}>
                            <CachedIcon size="medium" />
                        </IconButton>
                    </Grid>
                </Grid>
                <Box sx={boxSetting}>
                    <GetLatestFiles latestButtonProps={latestButtonProps} />
                    {!loading ? (
                        <ShowingFilesContainer
                            version={version}
                            handleRole={handleRole}
                            DownloadFile={DownloadFile}
                            handleDeleteFile={handleDeleteFile}
                            getDate={getDate}
                            openImage={openImage}
                        />
                    ) : (
                        <CircularProgressLoader />
                    )}
                    <FileUploadButtons
                        openFileSelect={openFileSelect}
                        getInputProps={getInputProps}
                        getRootProps={getRootProps}
                        fileRef={fileRef}
                        handleFileUpload={handleFileUpload}
                        isDragActive={isDragActive}
                    />
                    {children}
                </Box>
                <div className="project-details project-details-3">
                    <div className="description-div">
                        <h2 className="admin-div1h2">Description</h2>
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
                        onOpen={() => setIsViewerOpen(true)}
                    />
                )}
            </MDBox>
        </MDBox>
    )
}

const boxSetting = { background: "#fff", mt: 1, pt: 1 }

const uploadBtn = {
    backgroundColor: "#98e225",
    padding: "10px 13px",
    width: "100%",
    "& .MuiButtonBase-root:hover": {
        backgroundColor: "#98e225",
    },
};

const typographyStyle = ({ palette: { primary } }) => ({
    fontFamily: fontsFamily.poppins,
    color: mibananaColor.tableHeaderColor,
    fontWeight: "bold",
    fontSize: "16px",
    padding: "10px 0"
})

const gridStyle = {
    justifyContent: "space-arround",
    alignItems: "center",
    borderBottom: `2px solid ${mibananaColor.tableHeaderColor}`
}
const fileUpContainer = {
    height: '100%',
    backgroundColor: mibananaColor.headerColor
}



export default ProjectFileUpload
