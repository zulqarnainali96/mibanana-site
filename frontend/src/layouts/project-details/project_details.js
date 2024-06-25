import { Grid } from '@mui/material'
import TransitionsErrorModal from 'components/Modal/ErrorModal'
import TransitionsModal from 'components/Modal/Modal'
import ProjectChat from 'components/project-chats/project-chat'
import ProjectFileUpload from 'components/project-file-upload/project-file-upload'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React from 'react'
import "./style.css"

const ProjectsDetails = ({ children, reduxState, projectState }) => {
    const userId = reduxState?.userDetails?.id;
    const { msgArray, sendMessage, message, onSendMessage, reload, loading, fileRef, openFileSelect, handleFileUpload, version, getDate, DownloadFile, openImage, handleDeleteFile, handleRole, chatContainerRef, respMessage, successSB, errorSB, setSuccessSB, setErrorSB, showMore, getChatMessage, setRespMessage, setShowMore, openErrorSB, openSuccessSB, getInputProps, SubmitProject, truncatedDescription,
        project, memberName, teamMemberList, teamLoading, teamMembers, deleteTeamMember, getRootProps, isDragActive, latestButtonProps, isSendChanges, setSendChanges, currentImage, isViewerOpen, setIsViewerOpen, closeImageViewer, toggleShowMore,
        withRevision, handleClick, anchorEl, handleClose, projectOngoing, projectForReview
    } = projectState

        return (
        <DashboardLayout>
            <TransitionsModal message={respMessage} openModal={successSB} setOpenModal={setSuccessSB} />
            <TransitionsErrorModal message={respMessage} openModal={errorSB} setOpenModal={setErrorSB} />
            <Grid container
                spacing={2}
                mt={0}
                py={3}
                paddingInline={"45px"}
                sx={({ breakpoints }) => ({
                    height: "87vh",
                    [breakpoints.down('xl')]: {
                        gap: '13px',
                    }
                })}
            >
                <Grid item
                    xxl={6}
                    xl={6}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    sx={GridStyle}
                >
                    <ProjectChat
                        handleRole={handleRole}
                        chatContainerRef={chatContainerRef}
                        userId={userId}
                        loading={isSendChanges}
                        withRevision={withRevision}
                        handleClick={handleClick}
                        anchorEl={anchorEl}
                        handleClose={handleClose}
                        projectForReview={projectForReview}
                        projectOngoing={projectOngoing}
                        msgArray={msgArray}
                        sendMessage={sendMessage}
                        onSendMessage={onSendMessage}
                        message={message}
                    />
                </Grid>
                <Grid item xxl={6} xl={6} lg={12} md={12} sm={12} xs={12} pt="0 !important" height="100%" sx={({ breakpoints }) => ({
                    [breakpoints.down('xl')]: {
                        paddingLeft: '0 !important'
                    }
                })}>

                    <ProjectFileUpload
                        reload={reload}
                        version={version}
                        openImage={openImage}
                        DownloadFile={DownloadFile}
                        handleDeleteFile={handleDeleteFile}
                        fileRef={fileRef}
                        loading={loading}
                        getDate={getDate}
                        handleRole={handleRole}
                        handleFileUpload={handleFileUpload}
                        openFileSelect={openFileSelect}
                        setRespMessage={setRespMessage}
                        respMessage={respMessage}
                        openSuccessSB={openSuccessSB}
                        openErrorSB={openErrorSB}
                        showMore={showMore}
                        setShowMore={setShowMore}
                        getChatMessage={getChatMessage}
                        getInputProps={getInputProps}
                        getRootProps={getRootProps}
                        isDragActive={isDragActive}
                        latestButtonProps={latestButtonProps}
                        isViewerOpen={isViewerOpen}
                        setIsViewerOpen={setIsViewerOpen}
                        closeImageViewer={closeImageViewer}
                        currentImage={currentImage}
                        toggleShowMore={toggleShowMore}
                        truncatedDescription={truncatedDescription}

                        project={project}
                        teamLoading={teamLoading}
                        teamMemberList={teamMemberList}
                        teamMembers={teamMembers}
                        memberName={memberName}
                        SubmitProject={SubmitProject}
                        deleteTeamMember={deleteTeamMember}
                    >
                        {children}
                    </ProjectFileUpload>
                </Grid>
            </Grid>
        </DashboardLayout>
    )
}

const GridStyle = {
    position: "relative",
    bgcolor: "#F6F6E8",
    padding: 0,
    height: "100%",
    overflow: "scroll",
    overflowX: "hidden",
    paddingRight: "16px",
    "::-webkit-scrollbar": {
        width: "0",
        height: "0",
    },

}


export default ProjectsDetails
