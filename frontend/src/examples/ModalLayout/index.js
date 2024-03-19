import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import styled from '@mui/material/styles/styled'
import MDTypography from 'components/MDTypography'
import MDButton from 'components/MDButton'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import UploadFile from 'components/File upload button/FileUpload'
import MDBox from 'components/MDBox'
import { Grid } from '@mui/material'
import { ArticleOutlined, PictureAsPdf } from '@mui/icons-material'
import { MoonLoader } from 'react-spinners'
import { useParams } from 'react-router-dom'


let image = 'image/'
let docx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
let pdf = "application/pdf"

const ModalLayout = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {}
}))

const Modal = ({
    children,
    title,
    open,
    onClose,
    setOpen,
    height,
    width,
    isManager,
    removeFiles,
    filesModalStyle,
    handleFileUpload,
    files,
    filesType,
    submitFiles,
    loading,
    isBorder,
    sideRadius,
    align,
    color,
}) => {
    const { id } = useParams()
    return (
        <ModalLayout open={open} sx={{
            "& .MuiDialog-paper": { maxHeight: height, maxWidth: width, width: width, borderRadius: !sideRadius && "0px", backgroundColor: '#F6F6E8' },
        }}>
            <DialogTitle
                display={"flex"}
                position={"relative"}
                width={'100%'}
                justifyContent={"space-between"}
                alignItems={"center"}
                borderBottom={isBorder && '2px solid #ccc'}
            >
                <MDTypography sx={{ color: color, margin: align ? align : '0xp' }} fontWeight="bold">{title}</MDTypography>
                {isManager &&
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
                                isCloseIcon={true}
                                files={files}
                                id="brand-upload"
                            />
                        </MDBox>
                        {files.length || filesType.length ?
                            (
                                <MDBox {...filesModalStyle} bgColor="white" paddingLeft="2px">
                                    <Grid container spacing={2} marginTop="11px">
                                        {files.length > 0 ? files.map((img, i) => {
                                            return <Grid item xxl={3} key={i} boxShadow={"6px 3px 9px -3px #ccc"}>
                                                <img src={img} width="90px" height="90px" />
                                            </Grid>
                                        }) : null}
                                        {filesType?.length > 0 ? filesType.map((item) => {
                                            return (
                                                <>
                                                    {item.type?.startsWith(pdf) ?
                                                        <Grid item boxShadow={"6px 3px 9px -3px #ccc"}>
                                                            <PictureAsPdf
                                                                sx={{
                                                                    fontSize: '7rem !important',
                                                                }}
                                                            />
                                                        </Grid> : item.type?.startsWith(docx) ?
                                                            <Grid item>
                                                                <ArticleOutlined
                                                                    sx={{
                                                                        fontSize: '7rem !important',
                                                                    }}
                                                                />
                                                            </Grid>
                                                            : null}
                                                </>
                                            )
                                        })
                                            : null}
                                        <Grid item xxl={12} textAlign={"right"} position={"absolute"} bottom={0} right={"20px"}>
                                            <MDButton disabled={loading} type="button" variant="contained" color="warning"
                                                endIcon={<MoonLoader loading={loading} size={18} color='#121212' />}
                                                sx={{

                                                    color: '#000'
                                                }}
                                                onClick={submitFiles}
                                            >Sumbit</MDButton>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            )
                            : null}

                    </>
                }
                <MDButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: isBorder ? 4 : 1, padding: '1rem !important', top: isBorder ? undefined : '4px', backgroundColor: 'transparent !important' }} variant="contained">
                    <CloseOutlined
                        sx={{ fill: '#444' }}
                        fontSize={"large"}
                    />
                </MDButton>
            </DialogTitle>
            <DialogContent>
                {children}
                <DialogActions></DialogActions>
            </DialogContent>
        </ModalLayout>
    )
}
export default Modal
