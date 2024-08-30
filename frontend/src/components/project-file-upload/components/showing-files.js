import React from 'react'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ShowFiles from 'layouts/chats/File-upload-container/show-files/ShowFiles'



const NoFilesFound = () => {
    return <div className="nofilefoundDiv">
        {" "}
        <h1>No file found</h1>
    </div>

}

export const NoDataFound = () => {
    return <div className="nofilefoundDiv">
        {" "}
        <h1>No Data found</h1>
    </div>

}

const ShowingFilesContainer = ({
    version,
    handleRole,
    handleDeleteFile,
    DownloadFile,
    getDate,
    openImage
}) => {
    return (
        <Grid container className="filesGrid" display={"grid"} position={"relative"}>
            <React.Fragment>
                {version?.length > 0 ? (
                    <React.Fragment>
                        {version.map((ver, index) => (
                            <Grid item
                                xxl={3}
                                xl={3}
                                lg={3}
                                md={3}
                                xs={6}
                                className="file-grid-item"
                                height={version?.length < 5 ? "147px" : undefined}
                            >
                                <div className="upload-file-main uploaded-file-main-div">
                                    {(handleRole().teamMember || handleRole().admin || handleRole().projectManager) && (
                                        <IconButton onClick={() => handleDeleteFile(ver)} className="deleteIcon">
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    )}


                                    <DownloadForOfflineIcon
                                        onClick={() => DownloadFile(ver?.download_link)}
                                        className="downloadicon"
                                    />
                                    <div className="file-div2">
                                        <div className="file-image-container">
                                            <ShowFiles
                                                src={ver?.image}
                                                altname={ver?.name}
                                                onClick={() => openImage(index)}
                                            />
                                        </div>
                                        <p className="file-div-2p">{ver?.name?.substring(0, 10)}</p>
                                        <p className="folder-dir">{getDate(ver?.time).formattedDate}</p>
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </React.Fragment>
                ) : <NoFilesFound />
                }
            </React.Fragment>
            {/* {!version?.length && <NoDataFound />} */}
        </Grid>
    )
}

export default ShowingFilesContainer
