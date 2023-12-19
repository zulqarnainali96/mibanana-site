import React from 'react'
import MDBox from 'components/MDBox'
import { Close, PictureAsPdf } from '@mui/icons-material'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import AiImage from 'assets/mi-banana-icons/ai-logo.png'
import fileImage from 'assets/mi-banana-icons/file-image.png'
import { Jpg, Jpeg, Svg, Png, PDF, PsdFile, Ailogo, Zip } from 'redux/global/file-formats'
import zipIcon from 'assets/mi-banana-icons/zip-icon.png'
import MDButton from 'components/MDButton'
import { MoonLoader } from 'react-spinners'

const useStyles = makeStyles({
    filesModalStyle: {
        position: 'relative',
        height: '498px',
        width: '90% !important',
        opacity: 1,
        color: '#344767',
        border: '1px solid #ddd',
        boxShadow: '12px 6px 28px 15px #ddd !important',
        zIndex: '10',
        padding: '8px !important',
        overflowY: 'auto'
    }
})

const ImageBox2 = ({ item }) => {
    const gridProps = {
        item: true,
        xxl: 3,
        boxShadow: "6px 3px 9px -3px #ccc",
    }
    return (
        <Grid {...gridProps} padding={0} marginLeft={'6px'}>
            <img src={item} width="100%" height="100%" loading='lazy' alt={'user-image'} onClick={() => { }} />
        </Grid>
    )
}

const ImageBox = ({ item }) => {
    const gridProps = {
        item: true,
        xxl: 3,
        boxShadow: "6px 3px 9px -3px #ccc",
    }
    if (item?.type?.startsWith(PDF)) {
        return (
            <Grid {...gridProps} padding={0} marginLeft={'6px'}>
                <PictureAsPdf sx={{ fontSize: '6rem !important' }} />
            </Grid>)
    } else if (item?.type?.startsWith(Ailogo)) {
        return (
            <Grid {...gridProps} padding={0} marginLeft={'6px'}>
                <img src={AiImage} loading='lazy' width="90px" height="90px" alt={item.name} />
            </Grid>)
    } else if (item?.type?.startsWith(PsdFile) || item?.type == "") {
        return (
            <Grid {...gridProps} padding={0} marginLeft={'6px'}>
                <img src={fileImage} loading='lazy' width="90px" height="90px" alt={item.name} />
            </Grid>)
    } else if (item?.type?.startsWith(Zip)) {
        return (
            <Grid {...gridProps} padding={0} marginLeft={'6px'}>
                <img src={zipIcon} loading='lazy' width="90px" height="90px" alt={item.name} />
            </Grid>)
    }
}

const FileUpload = ({ files, filesType, removeFiles, loading, handleSubmit   }) => {
    console.log('files', filesType)
    const classes = useStyles()
    return (
        <MDBox className={classes.filesModalStyle} bgColor="#f6f6f6" paddingBlock="11px" paddingLeft="15px">
            <Close
                fontSize='medium'
                sx={{ position: 'absolute', right: '14px', cursor: 'pointer' }}
                onClick={removeFiles}
            />
            <Grid container spacing={2} marginTop="8px">
                {files?.map((item, i) => (
                    <ImageBox2 key={i} item={item} />
                ))}
                {filesType?.map((item, i) => (
                    <ImageBox key={i} item={item} />
                ))}
                <Grid item xxl={12} textAlign={"right"} position={"absolute"} bottom={10} right={"20px"}>
                    <MDButton disabled={loading} type="button" variant="contained" color="warning"
                        endIcon={<MoonLoader loading={loading} size={18} color='#121212' />}
                        sx={{
                            color: '#000'
                        }}
                        onClick={handleSubmit}
                    >Sumbit</MDButton>
                </Grid>
            </Grid>
        </MDBox>
    )
}

export default FileUpload
