import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./project-menu-style.css";
import SuccessModal from 'components/SuccessBox/SuccessModal';
import apiClient from 'api/apiClient';
// import { getProjectData } from 'redux/global/global-functions';
import { MoonLoader } from 'react-spinners';
import MDButton from 'components/MDButton';


const ProjectFilesFolder = (props) => {
    const { selectedFilePeople, handleFilePeopleChange, activebtn, clientFiles, role, addFileVerion, addVersionStyle, versionHandler, getFullFolderArray, checkVersionEmpty, openErrorSB, openSuccessSB, project, setRespMessage, reduxActions, reloadState, getLatestDesign } = props

    const [loading, setLoading] = useState(false)
    const [editModal, setEditModal] = useState(null);
    const [showMenu, setShowMenu] = useState(false)
    const [drive_link, setDriveLink] = useState(project?.drive_link)

    const [openFigma, setOpenFigmaModal] = useState(null);
    const [figma_link, setFigmaLink] = useState(project?.figma_link)
    const [showFigmaMenu, setShowFigmaMenu] = useState(false)

    const openMenu = () => {
        setShowFigmaMenu(false)
        setShowMenu(prev => !prev)
    }
    const openFigmaMenu = () => {
        setShowMenu(false)
        setShowFigmaMenu(prev => !prev)
    }

    useEffect(() => {
    }, [selectedFilePeople])

    useEffect(() => {
    }, [reloadState])


    const driveFiles = () => {
        if (role?.customer) {
            if (project.drive_link) {
                window.open(project.drive_link, "_blank");
            } else {
                setRespMessage("Drive link not available")
                setTimeout(() => {
                    openErrorSB()
                }, 400)
            }
        }
        else if (role?.designer || role?.admin || role?.projectManager) {
            openMenu()
        }
    }
    const openFigmaFiles = () => {
        if (role?.customer) {
            if (project.figma_link) {
                window.open(project.figma_link, "_blank");
            } else {
                setRespMessage("Figma link not available")
                setTimeout(() => {
                    openErrorSB()
                }, 400)
            }
        }
        else if (role?.designer || role?.admin || role?.projectManager) {
            openFigmaMenu()
        }
    }
    const openDriveLink = () => {
        if (drive_link) {
            window.open(drive_link, "_blank");
        }
        else {
            setRespMessage("Drive link not available")
            setTimeout(() => {
                openErrorSB()
            }, 400)
        }
    }
    const openFigmaLink = () => {
        if (figma_link) {
            window.open(figma_link, "_blank");
        }
        else {
            setRespMessage("Figma link not available")
            setTimeout(() => {
                openErrorSB()
            }, 400)
        }
    }

    const openEditModal = () => {
        setEditModal(true)
    }
    const openFigmaModal = () => {
        setOpenFigmaModal(true)
    }
    const closeFigmaModal = () => {
        setOpenFigmaModal(false)
    }

    const closeEditModal = () => {
        setEditModal(false)
    }
    const handleDriveLink = (e) => {
        setDriveLink(e.target.value)
    }
    const handleFigmaLink = (e) => {
        setFigmaLink(e.target.value)
    }

    const updateDriveLink = () => {
        const driveLink = {
            drive_link,
            id: project._id
        }
        setLoading(true)
        apiClient.post('/api/updating-drive-link', driveLink)
            .then(({ data }) => {
                setLoading(false)
                if (data.message) {
                    setRespMessage(data.message)
                    setDriveLink(data.drive_link)
                }
                setTimeout(() => {
                    openSuccessSB()
                    closeEditModal()
                    setShowMenu(false)
                    // getProjectData(project?._id, reduxActions.getCustomerProject)
                }, 400)
            })
            .catch((err) => {
                if (err.response) {
                    setLoading(false)
                    const { message } = err.response.data
                    setRespMessage(message)
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
    }
    
    const updateFigmaLink = () => {
        const figmaLink = {
            figma_link,
            id: project._id
        }
        setLoading(true)
        apiClient.post('/api/updating-figma-link', figmaLink)
            .then(({ data }) => {
                setLoading(false)
                if (data.message) {
                    setRespMessage(data.message)
                    setFigmaLink(data.figma_link)
                }
                setTimeout(() => {
                    openSuccessSB()
                    setOpenFigmaModal(false)
                    // getProjectData(project?._id, reduxActions.getCustomerProject)
                }, 400)
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setLoading(false)
                    setRespMessage(message)
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
    }

    function showGoogleDriveButton() {
        let result = false
        if (role.customer) {
            if (!project?.hasOwnProperty("drive_link")) {
                result = false
                return result
            }
            else if (project?.hasOwnProperty("drive_link") && project?.drive_link.length === 0) {
                result = false
                return result
            }
            else if (project?.hasOwnProperty("drive_link") && project?.drive_link.length > 0) {
                result = true
                return result
            } else {
                return result
            }
        } else {
            return true
        }
    }

    function showFigmaButton() {
        let result = false
        if (role.customer) {
            if (!project?.hasOwnProperty("figma_link")) {
                result = false
                return result
            }
            else if (project?.hasOwnProperty("figma_link") && project?.figma_link.length === 0) {
                result = false
                return result
            }
            else if (project?.hasOwnProperty("figma_link") && project?.figma_link.length > 0) {
                result = true
                return result
            } else {
                return result
            }
        } else {
            return true
        }
    }
    return (
        <Grid position="relative" >
            <SuccessModal
                width={620}
                open={editModal}
                onClose={closeEditModal} >
                <div className="drive-input-container">
                    <input type="text" value={drive_link} onChange={handleDriveLink} name="drive_link" placeholder='Drive Link' />
                    <MDButton
                        type="button"
                        onClick={updateDriveLink}
                        color="warning"
                        disabled={loading}
                        circular={true}
                        endIcon={
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <MoonLoader loading={loading} size={18} color="#121212" />
                            </div>}
                        sx={{
                            color: "#333 !important",
                            marginTop: '36px',
                            fontSize: 14,
                            textTransform: "capitalize",
                            borderRadius: '0px !important',
                            width: '195px',
                            height: '56px'
                        }}
                    >
                        Update link
                        &nbsp;
                    </MDButton>
                </div>
            </SuccessModal>
            <SuccessModal
                width={620}
                open={openFigma}
                onClose={closeFigmaModal} >
                <div className="drive-input-container">
                    <input type="text" value={figma_link} onChange={handleFigmaLink} name="figma_link" placeholder='Figma Link' />
                    {/* <button className='update-drive-button' onClick={updateFigmaLink}>Update Link
                        <MoonLoader loading={true} size={20} color="#121212" />
                    </button> */}
                    <MDButton
                        type="button"
                        color="warning"
                        onClick={updateFigmaLink}
                        disabled={loading}
                        circular={true}
                        endIcon={
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <MoonLoader loading={loading} size={18} color="#121212" />
                            </div>}
                        sx={{
                            color: "#333 !important",
                            marginTop: '36px',
                            fontSize: 14,
                            textTransform: "capitalize",
                            borderRadius: '0px !important',
                            width: '195px',
                            height: '56px'
                        }}
                    >
                        Update link
                        &nbsp;
                    </MDButton>
                </div>
            </SuccessModal>
            <>
                {/* <select
                    value={selectedFilePeople}
                    onChange={handleFilePeopleChange}
                    className={`selectType1 ${activebtn == "folder" && "activeClass"}`}
                    style={{ textTransform: 'capitalize' }}
                >
                    {getFullFolderArray().map((item, i) => (
                        <option key={i} value={item} disabled={checkVersionEmpty(item)} >{i === 0 || i === 1 ? item : `pre version ${item}`}</option>
                    ))
                    }
                </select> */}
                <button
                    className="selectType1 addnewversion"
                    onClick={getLatestDesign}
                    style={addVersionStyle}
                >
                    Latest Design
                </button>
                <button
                    className="selectType1 addnewversion"
                    onClick={clientFiles}
                    style={addVersionStyle}
                >
                    Customer Folder
                </button>
                {/* {role?.projectManager || role?.designer || role?.admin ? (
                    <button
                        className="selectType1 addnewversion"
                        onClick={addFileVerion}
                        style={addVersionStyle}
                    >
                        Add new version
                    </button>
                ) : null} */}
                {/* {role?.projectManager || role?.designer || role?.admin ? (
                    <button className="selectType1 addnewversion" onClick={versionHandler} style={addVersionStyle} >
                        Delete version
                    </button>
                ) : null} */}
                {showGoogleDriveButton() ? (
                    <div className="drive-container">
                        <button className="selectType1 addnewversion" style={addVersionStyle} onClick={driveFiles}>
                            Google Drive
                        </button>
                        {showMenu ? <ul className='drive-option-container'>
                            <li onClick={openDriveLink}>Open Drive</li>
                            <li onClick={openEditModal}>Update link</li>
                        </ul> : null}
                    </div>
                ) : null}

                {showFigmaButton() ? (
                    <div className="drive-container">
                        <button className="selectType1 addnewversion" style={addVersionStyle} onClick={openFigmaFiles}>
                            Figma
                        </button>
                        {showFigmaMenu ? <ul className='drive-option-container'>
                            <li onClick={openFigmaLink}>Open Figma</li>
                            <li onClick={openFigmaModal}>Update link</li>
                        </ul> : null}
                    </div>
                ) : null}
            </>
        </Grid>
    )
}

export default ProjectFilesFolder
