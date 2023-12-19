import MDButton from "components/MDButton"
import CloseIcon from '@mui/icons-material/Close'

const UploadFile = ({
    add_files,
    upload_files,
    handleFileUpload,
    removeFiles,
    isManager = false,
    files = [],
    size = 'small',
    variant = 'contained',
    isCloseIcon,
    id,
}) => {
    return (
        <div>
            {isManager && isCloseIcon ? <CloseIcon size="large" titleAccess='Clear images' onClick={removeFiles} sx={{ ...closeIconStyles, marginRight: '20px' }} /> : null}
            <label htmlFor={id}>
                <MDButton disableRipple size={size} variant={variant} color="info" component="span">
                    Upload Files
                </MDButton>
                <input
                    id={id}
                    multiple
                    hidden
                    // accept="image/.png, .PNG, .jpg,.pdf,.jpeg,.doc,.docx,.svg,.gif"
                    accept=".ai, .eps, .psd, .zip, .jpg, .png, .pdf, .jpeg, .svg"
                    type="file"
                    style={{ background: 'red' }}
                    onChange={handleFileUpload}
                />
            </label >
            <>
                {!isManager && add_files.length && upload_files.length ? <CloseIcon size="large" titleAccess='Clear images' onClick={removeFiles}
                    sx={closeIconStyles} /> : null}
            </>
        </div>
    )
}

export default UploadFile

const closeIconStyles = {
    verticalAlign: 'middle', marginLeft: '8px',
    borderRadius: '10px', backgroundColor: 'Highlight',
    width: '20px',
    height: '20px',
    fill: '#fff',
    cursor: 'pointer',
    right: '20px'
}