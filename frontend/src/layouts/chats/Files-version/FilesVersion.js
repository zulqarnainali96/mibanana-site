import Folder from "@mui/icons-material/Folder"
import { IconButton } from "@mui/material"
import Grid from "@mui/material/Grid"
import MDTypography from "components/MDTypography"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { MoonLoader } from "react-spinners"

const FilesVersion = ({ designerFiles, version, clientFiles, loading, fileLoading }) => {
    const { id } = useParams()
    // const { add_files } = useSelector(state => state.project_list?.CustomerProjects)?.find((item => item._id === id))


    return (
        <Grid item xxl={2} xl={2} display={'flex'} borderRight={'1px solid #ccc'} flexDirection={'column'}>
            <div style={{ position: 'relative' }}>
                <Folder fontSize="large" sx={{ fontSize: '5rem !important', cursor: 'pointer' }} onClick={clientFiles} />
                <IconButton sx={loadderStyles}>
                    <MoonLoader loading={loading} size={23} color='#fff' />
                </IconButton>
            </div>
            <MDTypography variant="span" fontSize="small">Customer Uploads</MDTypography>
            <div style={{ position: 'relative' }}>
                <Folder fontSize="large" sx={{ fontSize: '5rem !important', cursor: 'pointer' }} onClick={designerFiles} />
                <IconButton sx={loadderStyles}>
                    <MoonLoader loading={fileLoading} size={23} color='#fff' />
                </IconButton>
            </div>
            <MDTypography variant="span" fontSize="small">Designer Uploads</MDTypography>
            {!version?.length > 0 ? <span style={{ color: 'red', fontSize: '11px' }}>Empty Folder</span> : null}
        </Grid>
    )
}

export default FilesVersion

const loadderStyles = {
    position: 'absolute',
    top: '20px',
    left: '18px',
    background: 'transparent',
}
