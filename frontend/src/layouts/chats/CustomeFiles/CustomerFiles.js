import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Grid } from '@mui/material'
import { Delete, Download, PictureAsPdf } from '@mui/icons-material'
import MDBox from 'components/MDBox'
import { useEffect, useState } from 'react'
import MDTypography from 'components/MDTypography'
import FilesVersion from '../Files-version/FilesVersion'
import apiClient from 'api/apiClient'
import AiLogo from 'assets/mi-banana-icons/ai-logo.png'
import fileImage from 'assets/mi-banana-icons/file-image.png'
import Manager from './Manager/Manager'
import Customer from './Customer/Customer'
import reduxContainer from 'redux/containers/containers'
import { getProjectData } from 'redux/global/global-functions'


let Jpg = "image/jpg"
let Jpeg = "image/jpeg"
let Svg = "image/svg+xml"
let Png = "image/png"

let pdf = "application/pdf"
let aiLogo = "application/postscript"
let psdfile = "image/vnd.adobe.photoshop"

const ImageViewer = ({ item }) => {
    function DownloadFiles(url) {
        window.open(url, '_blank')
    }
    return (
        <MDBox width='100%'>
            {item.type.startsWith(Jpeg) || item.type.startsWith(Jpg) || item.type.startsWith(Png) || item.type.startsWith(Svg) ?
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
                : item.type.startsWith(pdf) ?
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
                    </MDBox> :
                    item.type.startsWith(aiLogo) ?
                        (<MDBox position="relative">
                            <span
                                onClick={() => DownloadFiles(item.download_link)}
                                style={{
                                    position: 'absolute', top: '-40px', cursor: 'pointer'
                                }}>
                                <Download sx={{ fontSize: '2rem !important' }} />
                            </span>
                            <img src={AiLogo} loading='lazy' width={'100%'} height={'100%'} alt={item.name} />
                        </MDBox>) :
                        item.type.startsWith(psdfile) ?
                            (<MDBox position="relative">
                                <span
                                    onClick={() => DownloadFiles(item.download_link)}
                                    style={{
                                        position: 'absolute', top: '-40px', cursor: 'pointer'
                                    }}>
                                    <Download sx={{ fontSize: '2rem !important' }} />
                                </span>
                                <img src={fileImage} loading='lazy' width={'100%'} height={'100%'} alt={item.name} />
                            </MDBox>) : (
                                <MDBox position="relative">
                                    <span
                                        onClick={() => DownloadFiles(item.download_link)}
                                        style={{
                                            position: 'absolute', top: '-40px', cursor: 'pointer'
                                        }}>
                                        <Download sx={{ fontSize: '2rem !important' }} />
                                    </span>
                                    <img src={fileImage} loading='lazy' width={'100%'} height={'100%'} alt={item.name} />
                                </MDBox>)
            }

        </MDBox>
    )
}

const CustomerFiles = ({ openErrorSB, openSuccessSB, setRespMessage, reduxState, reduxActions }) => {
    const projects = useSelector(state => state.project_list?.CustomerProjects)
    const [imageView, setImageView] = useState([])
    const [loading, setLoading] = useState(false)
    const [fileLoading, setFileLoading] = useState(false)
    const re_render_chat = useSelector(state => state.re_render_chat)
    // const [isDeleteNotShowforCustomer, setIsDeleteNotShow] = useState(false)

    const { id } = useParams()
    // const { id : userId } = useSelector(state=>state.userDetails)
    const project = projects?.find(item => item._id === id)
    const version1 = project?.add_files[0]?.version1
    const [version, setVersion] = useState(version1)
    const isDesigner = useSelector(state => state.userDetails)?.roles?.includes("Graphic-Designer") ? true : false
    const ismanager = useSelector(state => state.userDetails)?.roles?.includes("Project-Manager") ? true : false
    const isAdmin = useSelector(state => state.userDetails)?.roles?.includes("Admin") ? true : false
    const isCustomer = useSelector(state => state.userDetails)?.roles?.includes("Customer") ? true : false
    const currentProject = reduxState.project_list?.CustomerProjects?.find(item => item._id === id)
    const isManager = isDesigner || ismanager || isAdmin ? true : false
    const [files, setFiles] = useState([])
    const [filesType, setFilesType] = useState([])

    const handleFileUpload = (event) => {
        const files = event.target.files
        const newFiles = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            setFilesType(prev => [...prev, file])
            if (file.type.startsWith(Jpg) || file.type.startsWith(Jpeg) || file.type.startsWith(Png) || file.type.startsWith(Svg)) {
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

    const uploadFile = async () => {
        setLoading(true)
        const formdata = new FormData()
        for (let i = 0; i < filesType.length; i++) {
            formdata.append('files', filesType[i])
        }
        formdata.append('user_id', reduxState?.userDetails.id)
        formdata.append('name', reduxState?.userDetails.name)
        formdata.append('project_title', currentProject.project_title)
        formdata.append('project_id', currentProject?._id)
        await apiClient.post("/file/google-cloud", formdata).then(() => {
            const data = {
                user_id: reduxState?.userDetails.id,
                name: reduxState?.userDetails.name,
                project_id: currentProject._id,
                project_title: currentProject.project_title
            }
            apiClient.post("/file/get-files", data)
                .then(async () => {
                    removeFiles()
                    setLoading(false)
                    setRespMessage("Files Uploaded")
                    await getProjectData(reduxState.userDetails.id, reduxActions.getCustomerProject)
                    await clientFiles()
                    setTimeout(() => {
                        openSuccessSB()
                    }, 2000)
                }).catch(err => { throw err })
        }).catch((err) => {
            setLoading(false)
            setRespMessage(err?.response?.data.message)
            setTimeout(() => {
                openErrorSB()
            }, 1200)
            console.error('Error Found =>', err)
        })
    }

    const managerUpload = async () => {
        setLoading(true)
        const formdata = new FormData
        for (let i = 0; i < filesType.length; i++) {
            formdata.append('files', filesType[i])
        }
        await apiClient.post('/api/designer-uploads/' + id, formdata)
            .then(({ data }) => {
                setLoading(false)
                setFiles([])
                setFilesType([])
            })
            .catch((err) => {
                setLoading(false)
                console.error(err.message)
            })
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isManager) {
            managerUpload()
        } else {
            uploadFile()
        }
    }
    async function clientFiles() {
        setVersion([])
        setLoading(true)
        await apiClient.get('/get-customer-files/' + id)
            .then(({ data }) => {
                setVersion(data.filesInfo)
                setLoading(false)
            }).catch((err) => {
                setLoading(false)
            })
    }

    async function designerFiles() {
        setVersion([])
        setFileLoading(true)
        await apiClient.get('/api/designer-uploads/' + id)
            .then(({ data }) => {
                setVersion(data.filesInfo)
                setFileLoading(false)
            }).catch((err) => {
                setFileLoading(false)
            })
    }

    async function deleteFiles(filename) {
        setFileLoading(true)
        await apiClient.delete(`/api/del-designer-files/${id}/${filename}`).then(({ data }) => {
            const { message } = data
            setRespMessage(message)
            setTimeout(() => {
                setFileLoading(false)
                setImageView([])
                openSuccessSB()
                designerFiles()
            }, 1000)

        }).catch(err => {
            if (err.response) {
                const { message } = err.response.data
                setImageView([])
                setFileLoading(false)
                setRespMessage(message)
                setTimeout(() => {
                    openErrorSB()
                }, 1000)
                return
            } else {
                setFileLoading(false)
                setImageView([])
                setRespMessage(err.message)
                setTimeout(() => {
                    openErrorSB()
                }, 1000)
            }

        })
    }

    async function deleteCustomerFiles() {
        alert("zain")
    }

    useEffect(() => {
        clientFiles()
        designerFiles()
    }, [])

    useEffect(() => {
        clientFiles()
        designerFiles()
    }, [re_render_chat])

    return (
        <MDBox border="3px solid #33333321" height="87vh" p={1} borderRadius="8px" position="relative">
            <Manager
                handleFileUpload={handleFileUpload}
                loading={loading}
                isManager={isManager}
                handleSubmit={handleSubmit}
                removeFiles={removeFiles}
                files={files}
                filesModalStyle={filesModalStyle}
                filesType={filesType}
            />
            <Customer
                isCustomer={isCustomer}
                handleFileUpload={handleFileUpload}
                loading={loading}
                handleSubmit={handleSubmit}
                removeFiles={removeFiles}
                files={files}
                filesModalStyle={filesModalStyle}
                filesType={filesType}
            />
            <MDTypography pt={2}>Files</MDTypography>
            {
                project?.add_files?.length > 0 || version?.length > 0 ?
                    <>
                        <Grid container spacing={1} flexDirection={'row'} height={'92%'}>
                            <FilesVersion designerFiles={designerFiles} fileLoading={fileLoading} clientFiles={clientFiles} loading={loading} version={version} />
                            <Grid item xxl={3} sx={{
                                overflowY: 'auto', height: '100%',
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
                                        <Grid item xxl={12} marginTop={'15px'} {...styleProps} sx={{ cursor: 'pointer', position: 'relative' }}>
                                            {item.type.startsWith(Jpeg) || item.type.startsWith(Jpg) || item.type.startsWith(Png) || item.type.startsWith(Svg) ?
                                                <>
                                                    {isManager && !isCustomer ? (
                                                        <Delete
                                                            sx={{ position: 'absolute', fill: "red", top: '50px', left: '0px' }} fontSize='medium'
                                                            onClick={() => deleteFiles(item.name)}
                                                        />) : (
                                                        <Delete
                                                            sx={{ position: 'absolute', fill: "red", top: '50px', left: '0px' }} fontSize='medium'
                                                            onClick={() => deleteCustomerFiles()}
                                                        />
                                                    )}
                                                    <span
                                                        style={imageNameStyle}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    <img src={item.url} width={'50%'} height={'auto'} loading='lazy' alt={item.name} onClick={() => setImageView([item])} />
                                                </>
                                                : item.type.startsWith(pdf) ?
                                                    <>
                                                        {isManager && !isCustomer ? (
                                                            <Delete
                                                                sx={{ position: 'absolute', fill: "red", top: '50px', left: '0px' }} fontSize='medium'
                                                                onClick={() => deleteFiles(item.name)}
                                                            />) : (
                                                            <Delete
                                                                sx={{ position: 'absolute', fill: "red", top: '50px', left: '0px' }} fontSize='medium'
                                                                onClick={() => deleteCustomerFiles()}
                                                            />
                                                        )}
                                                        <span style={imageNameStyle}>{item.name}</span>
                                                        <PictureAsPdf
                                                            onClick={() => setImageView([item])}
                                                            sx={{
                                                                fontSize: '4rem !important',
                                                                // border: '1px dashed blue'
                                                            }} />

                                                    </> : item.type.startsWith(aiLogo) ? (
                                                        <>
                                                            {isManager && !isCustomer ? (
                                                                <Delete
                                                                    sx={{ position: 'absolute', fill: "red", top: '50px', left: '0px' }} fontSize='medium'
                                                                    onClick={() => deleteFiles(item.name)}
                                                                />) : (
                                                                <Delete
                                                                    sx={{ position: 'absolute', fill: "red", top: '50px', left: '0px' }} fontSize='medium'
                                                                    onClick={() => deleteCustomerFiles()}
                                                                />
                                                            )}
                                                            <img src={AiLogo} width={80} height={80} loading='lazy' style={{ cursor: 'pointer' }} alt={item.name} onClick={() => setImageView([item])} />
                                                            <span style={imageNameStyle}>{item.name}</span>

                                                        </>
                                                    ) : item.type.startsWith(psdfile) ? (
                                                        <>
                                                            {isManager && !isCustomer ? (
                                                                <Delete
                                                                    sx={{ position: 'absolute', fill: "red", top: '50px', left: '0px' }} fontSize='medium'
                                                                    onClick={() => deleteFiles(item.name)}
                                                                />) : (
                                                                <Delete
                                                                    sx={{ position: 'absolute', fill: "red", top: '50px', left: '0px' }} fontSize='medium'
                                                                    onClick={() => deleteCustomerFiles()}
                                                                />
                                                            )}
                                                            <img src={fileImage} width={80} height={80} loading='lazy' style={{ cursor: 'pointer' }} alt={item.name} onClick={() => setImageView([item])} />
                                                            <span style={imageNameStyle}>{item.name}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isManager && !isCustomer ? (
                                                                <Delete
                                                                    sx={{ position: 'absolute', fill: "red", top: '50px', left: '0px' }} fontSize='medium'
                                                                    onClick={() => deleteFiles(item.name)}
                                                                />) : (
                                                                <Delete
                                                                    sx={{ position: 'absolute', fill: "red", top: '50px', left: '0px' }} fontSize='medium'
                                                                    onClick={() => deleteCustomerFiles()}
                                                                />
                                                            )}
                                                            <img src={fileImage} width={80} height={80} loading='lazy' style={{ cursor: 'pointer' }} alt={item.name} onClick={() => setImageView([item])} />
                                                            <span style={imageNameStyle}>{item.name}</span>
                                                        </>
                                                    )
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
        </MDBox >
    )


}
export default reduxContainer(CustomerFiles)

const imageNameStyle = {
    fontSize: '12px',
    paddingBottom: '10px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '80px'
}

const styleProps = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer'
}
const filesModalStyle = {
    position: 'absolute',
    height: '498px',
    width: '465px',
    opacity: 1,
    color: '#344767',
    border: '1px solid #ddd',
    boxShadow: '12px 6px 28px 15px #ddd !important',
    zIndex: '10',
    left: '110px',
    top: '150px',
    padding: '8px',
}