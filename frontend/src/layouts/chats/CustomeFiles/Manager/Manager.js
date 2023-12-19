import { PictureAsPdf } from '@mui/icons-material'
import Close from '@mui/icons-material/Close'
import { Grid } from '@mui/material'
import UploadFile from 'components/File upload button/FileUpload'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import React from 'react'
import MoonLoader from 'react-spinners/MoonLoader'
import AiLogo from 'assets/mi-banana-icons/ai-logo.png'
import fileImage from 'assets/mi-banana-icons/file-image.png'

const Manager = ({ isManager, handleFileUpload, files, removeFiles, filesType, filesModalStyle, handleSubmit, loading }) => {
    let Jpg = "image/jpg"
    let Jpeg = "image/jpeg"
    let Svg = "image/svg+xml"
    let Png = "image/png"

    let pdf = "application/pdf"
    let aiLogo = "application/postscript"
    let psdfile = "image/vnd.adobe.photoshop"

    return (
        <>
            {isManager &&
                // <MDBox bgColor="#f0eaea91" width="100%" position="absolute" zIndex={12} height="100%">
                <>
                    <MDBox paddingRight={'4rem'}>
                        <UploadFile
                            handleFileUpload={handleFileUpload}
                            add_files={[]}
                            upload_files={[]}
                            removeFiles={removeFiles}
                            size="small"
                            variant="outlined"
                            isManager={isManager}
                            files={files}
                            isCloseIcon={false}
                            id="manager-upload"
                        />
                    </MDBox>

                    {files.length || filesType.length ?
                        (
                            <MDBox {...filesModalStyle} bgColor="#f6f6f6" paddingBlock="11px"
                                paddingLeft="15px">
                                <Close
                                    fontSize='medium'
                                    sx={{ position: 'absolute', right: '14px', cursor: 'pointer' }}
                                    onClick={removeFiles}
                                />
                                <Grid container spacing={2} marginTop="11px">
                                    {files.length > 0 ? files.map((img, i) => {
                                        return (
                                            <>
                                                <Grid item xxl={3} key={i} boxShadow={"6px 3px 9px -3px #ccc"}>
                                                    <img src={img} width="90px" height="90px" alt={"user-files"} />
                                                </Grid>
                                            </>
                                        )
                                    }
                                    ) : null}
                                    {filesType.length > 0 ? filesType.map((item, i) => {
                                        return (
                                            <>
                                                {item.type.startsWith(pdf) ?
                                                    (
                                                        <Grid item xxl={3} key={i} boxShadow={"6px 3px 9px -3px #ccc"}>
                                                            <PictureAsPdf
                                                                sx={{
                                                                    fontSize: '7rem !important',
                                                                }}
                                                            />
                                                        </Grid>
                                                    )
                                                    : item.type.startsWith(aiLogo) ?
                                                        (
                                                            <Grid item xxl={3} key={i} boxShadow={"6px 3px 9px -3px #ccc"}>
                                                                <img src={AiLogo} width="90px" height="90px" alt={item.name} />
                                                            </Grid>
                                                        )
                                                        : item.type.startsWith(psdfile) ?
                                                        (
                                                            <Grid item xxl={3} key={i} boxShadow={"6px 3px 9px -3px #ccc"}>
                                                                <img src={fileImage} width="90px" height="90px" alt={item.name} />
                                                            </Grid>
                                                        ) : null
                                                }
                                            </>
                                        )
                                    }) : null}
                                    
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
                        : null}
                </>
                // </MDBox>
            }

        </>
    )
}

export default Manager
