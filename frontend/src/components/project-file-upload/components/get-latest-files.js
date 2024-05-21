import React from 'react'
import Grid from '@mui/material/Grid'
import MDButton from 'components/MDButton'
import { MoonLoader } from 'react-spinners'
import "./get-latest-files.css"
import SuccessModal from 'components/SuccessBox/SuccessModal'

const GetLatestFiles = ({ latestButtonProps }) => {
    const {
        showGoogleDriveButton,
        handleDriveLink,
        updateDriveLink,
        closeEditModal,
        updateFigmaLink,
        closeFigmaModal,
        addVersionStyle,
        openFigmaModal,
        handleFigmaLink,
        openFigmaLink,
        clientFiles,
        openDriveLink,
        openEditModal,
        showFigmaButton,
        getLatestDesign,
        openFigmaFiles,
        driveFiles,
        drive_link,
        editModal,
        openFigma,
        showFigmaMenu,
        loading,
        figma_link,
        showMenu
    } = latestButtonProps

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
                        sx={buttonStyle}
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
                        sx={buttonStyle}
                    >
                        Update link
                        &nbsp;
                    </MDButton>
                </div>
            </SuccessModal>
            <React.Fragment>
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
            </React.Fragment>
        </Grid>
    )
}

const buttonStyle = {
    color: "#333 !important",
    marginTop: '36px',
    fontSize: 14,
    textTransform: "capitalize",
    borderRadius: '0px !important',
    width: '195px',
    height: '56px',
}

export default GetLatestFiles
