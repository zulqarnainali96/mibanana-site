import { Grid, Menu } from '@mui/material'
import MDBox from 'components/MDBox'
import MenuItemDropdown from 'layouts/ProjectsTable/data/MenuItem'
import React, { useEffect, useState } from 'react'
import "./project-menu-style.css";
import SuccessModal from 'components/SuccessBox/SuccessModal';
import apiClient from 'api/apiClient';


const DriveOption = ({ anchorEl, handleMenuClose }) => {
    return (
        <Menu
            id="raw-dropdown-menu"
            sx={{
                '& .MuiMenu-paper': {
                    position: 'absolute',
                    top: '245px !important',
                    right: '115px !important',
                    left: 'initial !important',
                }
            }}
            anchorEl={anchorEl}
            open={anchorEl}
            onClose={handleMenuClose}
            transformOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
        >
            <MenuItemDropdown loading={false} title="Open Drive" />
            <MenuItemDropdown loading={false} title="Edit" />
        </Menu>
    )
}

const ProjectFilesFolder = (props) => {
    const [editModal, setEditModal] = useState(null);
    const [showMenu, setShowMenu] = useState(false)
    const [drive_link, setDriveLink] = useState("")
    const openMenu = () => {
        setShowMenu(prev => !prev)
    }
    const closeMenu = () => {
        setShowMenu(false)
    }


    const { selectedFilePeople, handleFilePeopleChange, activebtn, clientFiles, role, addFileVerion, addVersionStyle, versionHandler, getFullFolderArray, checkVersionEmpty, openErrorSB, openSuccessSB, project, setRespMessage } = props

    useEffect(() => {
    }, [selectedFilePeople])



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
    const openDriveLink = () => {
        if (project.drive_link) {
            window.open(project.drive_link, "_blank");
        } else {
            setRespMessage("Drive link not available")
            setTimeout(() => {
                openErrorSB()
            }, 400)
        }
    }
    
    const openEditModal = () => {
        setEditModal(true)
    }
    const closeEditModal = () => {
        setEditModal(false)
    }
    const handleDriveLink = (e) => {
        setDriveLink(e.target.value)
    }

    const updateDriveLink = () => {
        const driveLink = {
            drive_link,
            id: project._id
        }
        apiClient.post('/api/updating-drive-link', driveLink)
            .then(({ data }) => {
                if (data.message) setRespMessage(data.message)
                setTimeout(() => {
                    openSuccessSB()
                }, 400)
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                } else {
                    setRespMessage(err.message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                }
            })
    }

    // const handleClose = (event) => {
    //     console.log(event)
    //     if(!event.target.closest(".drive-option-container")){
    //         closeMenu()
    //     }
    // }
    return (
        <Grid position="relative" >
            <SuccessModal
                width={450}
                open={editModal}
                onClose={closeEditModal} >
                <div className="drive-input-container">
                    <input type="text" value={drive_link} onChange={handleDriveLink} name="drive_link" placeholder='Drive Link' />
                    <button className='update-drive-button' onClick={updateDriveLink}>Update</button>
                </div>
            </SuccessModal>
            <>
                <select
                    value={selectedFilePeople}
                    onChange={handleFilePeopleChange}
                    className={`selectType1 ${activebtn == "folder" && "activeClass"}`}
                    style={{ textTransform: 'capitalize' }}
                >
                    {getFullFolderArray().map((item, i) => (
                        <option key={i} value={item} disabled={checkVersionEmpty(item)} >{i === 0 || i === 1 ? item : `pre version ${item}`}</option>
                    ))
                    }
                </select>
                <button
                    className="selectType1 addnewversion"
                    onClick={clientFiles}
                    style={addVersionStyle}
                >
                    Customer Folder
                </button>
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
                    <button className="selectType1 addnewversion" onClick={versionHandler} style={addVersionStyle} >
                        Delete version
                    </button>
                ) : null}
                <div className="drive-container">
                    <button className="selectType1 addnewversion" style={addVersionStyle} onClick={driveFiles}>
                        Raw files
                    </button>
                    {showMenu ? <ul className='drive-option-container'>
                        <li onClick={openDriveLink}>Open Drive</li>
                        <li onClick={openEditModal}>Update link</li>
                    </ul> : null}
                </div>
            </>
        </Grid>
    )
}

export default ProjectFilesFolder
