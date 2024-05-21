import apiClient from 'api/apiClient'
import { mibananaColor } from 'assets/new-images/colors'
import React, { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useParams } from 'react-router-dom'
import { currentUserRole } from 'redux/global/global-functions'

// Images
import psdfile from "assets/images/psdfile.svg";
import eps from "assets/images/eps.svg";
import ai_logo from "assets/mi-banana-icons/ai-logo.png"
import pdffile from "assets/images/pdffile.svg";
import xls from "assets/images/xls.svg";


const useSocialMediaHook = (reduxState) => {
    const id = useParams()
    const role = currentUserRole(reduxState)
    const project = reduxState.project_list.CustomerProjects?.find(item => item._id === id)
    const chatContainerRef = useRef(null)
    const [respMessage, setRespMessage] = useState("")
    const [successSB, setSuccessSB] = useState(false);
    const [loading, setLoading] = useState(false)
    const [errorSB, setErrorSB] = useState(false);

    const [fileMsg, setFileMsg] = useState("");
    const [version, setVersion] = useState(false);
    const [fileVersion, setFileVersionList] = useState(project?.version.length > 0 ? project?.version : []);


    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const [showFigmaMenu, setShowFigmaMenu] = useState(false)
    const [showMore, setShowMore] = useState(false);
    const [msgArray, setMsgArray] = useState([]);
    const [openFigma, setOpenFigmaModal] = useState(null);
    const [figma_link, setFigmaLink] = useState(project?.figma_link)
    const [drive_link, setDriveLink] = useState(project?.drive_link)
    const [editModal, setEditModal] = useState(null);
    const [showMenu, setShowMenu] = useState(false)

    const handleSubmit = async () => {

    }

    const onDrop = async (acceptedFiles) => {
        // Do something with dropped files
        await handleSubmit(acceptedFiles);
    };
    const openMenu = () => {
        setShowFigmaMenu(false)
        setShowMenu(prev => !prev)
    }
    const openFigmaMenu = () => {
        setShowMenu(false)
        setShowFigmaMenu(prev => !prev)
    }


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const getChatMessage = async () => {
        await apiClient
            .get("/chat-message/" + id)
            .then(({ data }) => {
                if (data.chat?.chat_msg?.length) {
                    setMsgArray(data.chat?.chat_msg);
                }
            })
            .catch((e) => {
                setMsgArray([]);
                console.error("error ", e.response);
            });
    };

    const handleRole = () => {
        if (role.designer || role.mobile_app_developer || role.web_developer || role.social_media_manager || role.copywriter) {
            return {
                teamMember: true
            }
        }
        else if (role.project_manager) {
            return { projectManger: true }
        }
        else if (role.customer) {
            return { customer: true }
        }
    }
    const handlePreviewImages = (images) => {
        let arr = []
        for (let i = 0; i < images?.length; i++) {
            const file_type = images[i]?.type?.split('/').pop()
            const currentImage = images[i]?.url
            const id = images[i]?.id
            if (file_type === "pdf") {
                arr.push({ ...images[i], image: pdffile })
            } else if (file_type === "ai") {
                arr.push({ ...images[i], image: ai_logo })
            } else if (file_type === "xlsx" || file_type === "xls") {
                arr.push({ ...images[i], image: xls })
            } else if (file_type === "postscript") {
                arr.push({ ...images[i], image: eps })
            } else if (file_type === "psd") {
                arr.push({ ...images[i], image: psdfile })
            } else if (file_type === "svg+xml") {
                arr.push({ ...images[i], image: currentImage })
            } else {
                arr.push({ ...images[i], image: currentImage })
            }
        }
        // setPreviewAllImages(arr)
        setVersion(arr)
    }
    async function getFilesOnVerion(value) {
        setVersion([]);
        setFileMsg("");
        setLoading(true);
        await apiClient
            .get(`/api/get-version-uploads/${value}/${id}`)
            .then(({ data }) => {
                // setVersion(data.filesInfo);
                handlePreviewImages(data?.filesInfo)
                setFileMsg("");
                setLoading(false);
            })
            .catch((err) => {
                setFileMsg("No Files Found");
                setRespMessage("No Files Found");
                // openErrorSB()
                setVersion([]);
                setLoading(false);
            });
    }
    async function clientFiles() {
        setVersion([]);
        setFileMsg("");
        setLoading(true);
        await apiClient
            .get("/get-customer-files/" + id)
            .then(({ data }) => {
                setVersion(data.filesInfo);
                handlePreviewImages(data?.filesInfo)
                setFileMsg("");
                setLoading(false);
            })
            .catch((err) => {
                setFileMsg("No Files Found");
                setRespMessage("No Files Found")
                // openErrorSB()
                setVersion([]);
                setLoading(false);
            });
    }

    const getLatestDesign = () => {
        const latestDesign = [...fileVersion].pop()
        getFilesOnVerion(latestDesign)
    }
    const handleDriveLink = (e) => {
        setDriveLink(e.target.value)
    }
    const closeFigmaModal = () => {
        setOpenFigmaModal(false)
    }
    const closeEditModal = () => {
        setEditModal(false)
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
    const addVersionStyle = {
        backgroundColor: mibananaColor.headerColor,
        color: "#000",
    };
    const openFigmaModal = () => {
        setOpenFigmaModal(true)
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
    const openEditModal = () => {
        setEditModal(true)
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

    const latestButtonProps = {
        showGoogleDriveButton,
        handleDriveLink,
        updateDriveLink,
        closeEditModal,
        updateFigmaLink,
        closeFigmaModal,
        addVersionStyle,
        openFigmaModal,
        openFigmaLink,
        clientFiles,
        openDriveLink,
        openEditModal,
        showFigmaButton,
        getLatestDesign,
        openFigmaFiles,
        driveFiles,
        figma_link,
        drive_link,
        editModal,
        openFigma,
        showFigmaMenu,
        loading,
        showMenu,
    }

    useEffect(() => {
        getChatMessage();
    }, [id])

    return {
        role,
        showMore,
        successSB,
        errorSB,
        handleRole,
        respMessage,
        openErrorSB,
        closeErrorSB,
        chatContainerRef,
        respMessage,
        setShowMore,
        openSuccessSB,
        setRespMessage,
        closeSuccessSB,
        getChatMessage,
        getInputProps,
        getRootProps,
        isDragActive,
        latestButtonProps,

    }
}

export default useSocialMediaHook
