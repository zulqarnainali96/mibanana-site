import { Link, NavLink, useParams } from 'react-router-dom'
import ModalLayout from '../../../examples/ModalLayout'
import { useSelector } from 'react-redux'
import { Grid } from '@mui/material'
import { otherFileStyle } from 'examples/Navbars/Form-modal'
import { ArticleOutlined, Download, PictureAsPdf } from '@mui/icons-material'
import MDBox from 'components/MDBox'
import Profile from 'assets/mi-banana-icons/Photo.png'
import { useEffect, useState } from 'react'
import MDTypography from 'components/MDTypography'
import MDButton from 'components/MDButton'
import FilesVersion from '../Files-version/FilesVersion'
import apiClient from 'api/apiClient'

let image = 'image/'
let docx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
let pdf = "application/pdf"

const downloadStyles = { postion: 'absolute !important', top: '0px', left: '282px !important' }

const ImageViewer = ({ item }) => {
    function DownloadFiles(url) {
        window.open(url, '_blank')
    }
    return (
        <MDBox width='100%'>
            {item.type.startsWith(image) ?
                <MDBox position="relative">
                    <span
                        onClick={() => DownloadFiles(item.download_link)}
                        style={{
                            position: 'absolute', top: '-40px', cursor: 'pointer'
                        }}>
                        <Download sx={{ fontSize: '2rem !important' }} />
                    </span>
                    <img src={item.url} loading='lazy' width={'100%'} height={'100%'} alt={item.name} />
                </MDBox>
                : item.type.startsWith(docx)
                    ?
                    <MDBox position="relative">
                        <span
                            onClick={() => DownloadFiles(item.download_link)}
                            style={{
                                position: 'absolute', top: '-40px', cursor: 'pointer'
                            }}>
                            <Download sx={{ fontSize: '2rem !important', }} />
                        </span>
                        <ArticleOutlined sx={{
                            fontSize: '20rem !important',
                        }} />
                    </MDBox>
                    :
                    item.type.startsWith(pdf) ?
                        <MDBox position="relative">
                            <span
                                onClick={() => DownloadFiles(item.download_link)}
                                style={{
                                    position: 'absolute', top: '-40px', cursor: 'pointer'
                                }}>
                                <Download sx={{ fontSize: '2rem !important', }} />
                            </span>
                            <PictureAsPdf
                                sx={{
                                    fontSize: '20rem !important',
                                    // border: '1px dashed blue'
                                }} />
                        </MDBox>
                        : null
            }
        </MDBox>
    )
}

const FileModal = ({ title, open, setOpen }) => {
    const projects = useSelector(state => state.project_list?.CustomerProjects)
    const [imageView, setImageView] = useState([])
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    // const { id : userId } = useSelector(state=>state.userDetails)
    const project = projects?.find(item => item._id === id)
    const version1 = project?.add_files[0]?.version1
    const [version, setVersion] = useState(version1)
    const isDesigner = useSelector(state => state.userDetails)?.roles?.includes("Graphic-Designer") ? true : false
    const ismanager = useSelector(state => state.userDetails)?.roles?.includes("Project-Manager") ? true : false
    const isManager = isDesigner || ismanager ? true : false
    const [files, setFiles] = useState([])
    const [filesType, setFilesType] = useState([])

    const handleFileUpload = (event) => {
        const files = event.target.files
        const newFiles = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            setFilesType(prev => [...prev, file])
            if (file.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.onload = function () {
                    newFiles.push(reader.result)
                    setFiles(newFiles)
                }
                reader.readAsDataURL(file)
            }
        }

    }
    const removeFiles = () => {
        setFiles([])
        setFilesType([])
    }
    const handleSubmit = async () => {
        setLoading(true)
        const formdata = new FormData
        for (let i = 0; i < filesType.length; i++) {
            formdata.append('files', filesType[i])
        }
        await apiClient.post('/api/designer-uploads/' + id, formdata)
            .then(({ data }) => {
                // console.log(data.message)
                setLoading(false)
                setFiles([])
                setFilesType([])
            })
            .catch((err) => {
                setLoading(false)
                console.error(err.message)
            })
    }
    async function clientFiles() {
        // if (add_files.length) {
        //     setVersion(add_files[0].version1)
        // }
        setVersion([])
        await apiClient.get('/get-customer-files/' + id)
            .then(({ data }) => {
                setVersion(data.filesInfo)
                // console.log(data.message)
            }).catch((err) => {
                setVersion([])
                // console.log(err.message)
            })
    }

    useEffect( () => {
        clientFiles()
    },[])

    return (
        <ModalLayout
            title={title}
            open={open}
            // setOpen={setOpen}
            onClose={() => setOpen(false)}
            height={'65%'}
            width={'800px !important'}
            isManager={isManager}
            filesModalStyle={filesModalStyle}
            removeFiles={removeFiles}
            handleFileUpload={handleFileUpload}
            files={files}
            filesType={filesType}
            submitFiles={handleSubmit}
            loading={loading}
            isBorder={true}
            color={"dark"}
        >

            {project?.add_files?.length > 0 ?
                <>
                    <Grid container spacing={1} flexDirection={'row'}>
                        <FilesVersion clientFiles={clientFiles} setVersion={setVersion} version={version} />
                        <Grid item xxl={3} sx={{
                            overflowY: 'auto', height: '510px',
                            '& ::-webkit-scrollbar': {
                                width: '12px' /* Width of the scrollbar */
                            },
                            '& ::-webkit-scrollbar-thumb': {
                                backgroundColor: '#888', /* Color of the thumb */
                                borderRadius: '6px' /* Rounded corners for the thumb */
                            }
                        }}>
                            {version?.map((item) => {
                                return (
                                    <Grid item xxl={12} {...styleProps} sx={{ cursor: 'pointer' }}>
                                        {item.type.startsWith(image) ?
                                            <>
                                                <span style={{ fontSize: '12px', paddingBottom: '10px' }}>{item.name}</span>
                                                <img src={item.url} width={'54%'} height={'auto'} loading='lazy' alt={item.name} onClick={() => setImageView([item])} />
                                            </>
                                            : item.type.startsWith(docx) ?
                                                <>
                                                    <span style={{ fontSize: '12px', paddingBottom: '10px' }}>{item.name}</span>
                                                    <ArticleOutlined
                                                        onClick={() => setImageView([item])}
                                                        sx={{
                                                            fontSize: '4rem !important',
                                                            // marginLeft : '-30px',
                                                        }} />
                                                </>
                                                : item.type.startsWith(pdf) ?
                                                    <>
                                                        <span style={{ fontSize: '12px', paddingBottom: '10px' }}>{item.name}</span>
                                                        <PictureAsPdf
                                                            onClick={() => setImageView([item])}
                                                            sx={{
                                                                fontSize: '4rem !important',
                                                                // border: '1px dashed blue'
                                                            }} />

                                                    </> : null
                                        }
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <Grid item xxl={6} pt={'1rem'} borderLeft={'1px solid #ccc'} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                            {imageView.map(item => <ImageViewer item={item} />)}
                        </Grid>
                    </Grid>
                </>
                :
                <MDTypography>
                    No Files Found
                </MDTypography>

            }
        </ModalLayout >
    )


}
export default FileModal

const styleProps = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer'
}
const filesModalStyle = {
    position: 'absolute',
    height: '498px',
    width: '457px',
    opacity: 1,
    color: '#344767',
    borderRadius: 'none',
    boxShadow: 'none',
    right: '0.8%',
    top: '70px',
    zIndex: '2'
}
