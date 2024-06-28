import apiClient from 'api/apiClient'
import { mibananaColor } from 'assets/new-images/colors'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useParams } from 'react-router-dom'
import { currentUserRole } from 'redux/global/global-functions'

// Images
import psdfile from "assets/images/psdfile.svg";
import eps from "assets/images/eps.svg";
import ai_logo from "assets/mi-banana-icons/ai-logo.png"
import pdffile from "assets/images/pdffile.svg";
import xls from "assets/images/xls.svg";

import { sendingStatusNotification } from 'socket-events/socket-event'
import ImageAvatar from "assets/mi-banana-icons/default-profile.png";
import { SocketContext } from 'sockets'
import { getUserRoles } from 'redux/global/global-functions'
import { getProjectById } from 'redux/global/global-functions'


const useSocialMediaHook = (reduxState, reduxActions) => {
    const { id } = useParams()
    const role = currentUserRole(reduxState)
    const userId = reduxState?.userDetails?.id
    const [project, setProject] = useState(reduxState.project_list.CustomerProjects?.find(item => item._id === id))
    const team_members = project?.team_members?.length > 0 ? project?.team_members[0]?._id : "";
    const avatar = reduxState.userDetails?.avatar;
    const chatContainerRef = useRef(null)
    const [respMessage, setRespMessage] = useState("")
    const [message, sendMessage] = useState("");
    const [selectedFilePeople, setSelectedFilePeople] = useState("");
    const [driveLoading, setDriveLoading] = useState(false)
    const [teamLoading, setTeamLoading] = useState(false)
    const [teamMembers, setTeamMembers] = useState(project?.team_members)
    const [memberName, setMemberName] = useState([]);

    const currentTime = new Date(); // Get the current date and time
    const formattedTime = currentTime.toLocaleTimeString();
    const formattedDate = currentTime.toLocaleDateString();

    const [successSB, setSuccessSB] = useState(false);
    const [loading, setLoading] = useState(false)
    const [errorSB, setErrorSB] = useState(false);
    const [isSendChanges, setSendChanges] = useState(false)
    const [reloadState, setReloadState] = useState(false)

    const [teamMemberList, setTeamMemberList] = useState([]);
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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0)
    const fileRef = useRef(null);
    const socketIO = useRef(useContext(SocketContext));

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const openFileSelect = () => {
        fileRef.current.click();
    }
    const customerUploadFiles = async (filType) => {
        setLoading(true);
        if (filType.length === 0) return;
        const formdata = new FormData();
        for (let i = 0; i < filType.length; i++) {
            formdata.append("files", filType[i]);
        }
        formdata.append("user_id", reduxState?.userDetails.id);
        // formdata.append("name", reduxState?.userDetails.name);
        // formdata.append("project_title", project.project_title);
        formdata.append("project_id", project?._id);
        await apiClient
            .post("/file/google-cloud", formdata)
            .then(() => {
                setLoading(false);
                setRespMessage('Files Uploaded Successfully');
                setTimeout(() => {
                    clientFiles();
                    openSuccessSB();
                }, 1200);
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setLoading(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                    return
                } else {
                    setLoading(false)
                    setRespMessage(err.message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                }
            })
    };
    const versionUploads = async (filType, current_version) => {
        setLoading(true);
        const formdata = new FormData();
        for (let i = 0; i < filType.length; i++) {
            formdata.append("files", filType[i]);
        }
        await apiClient.post(`/api/version-uploads/${current_version}/${project.project_category}/${id}`, formdata)
            .then(async ({ data }) => {
                setLoading(false);
                // setFiles([]);
                // setFilesType([]);
                setTimeout(() => {
                    getFilesOnVerion(current_version)
                }, 700)
                if (data.message) {
                    setRespMessage(data.message)
                    setTimeout(() => {
                        openSuccessSB()
                    },)
                }
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setLoading(false)
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
    };

    const handleSubmit = (fileType) => {
        if (handleRole().teamMember || handleRole().projectManager || handleRole().admin) {
            const latest_version = [...fileVersion]?.pop()
            versionUploads(fileType, latest_version)
        }
        else if (handleRole().customer) {
            setSelectedFilePeople("customer")
            customerUploadFiles(fileType);
        }
    };
    const handleFileUpload = async (event) => {
        const files = event.target.files;
        let filType = [];
        for (let i = 0; i < files.length; i++) {
            filType.push(files[i]);
        }
        handleSubmit(filType);
    };

    const onDrop = async (acceptedFiles) => {
        // Do something with dropped files
        handleSubmit(acceptedFiles);
    };
    const openMenu = () => {
        setShowFigmaMenu(false)
        setShowMenu(prev => !prev)
    }
    const openFigmaMenu = () => {
        setShowMenu(false)
        setShowFigmaMenu(prev => !prev)
    }
    const getAllVersionFiles = async () => {
        if (fileVersion?.length === 0) return []
        let allversionfiles = []
        for (let b = 0; b < fileVersion?.length; b++) {
            const current_version = fileVersion[b]
            try {
                const { data } = await apiClient.get(`/api/get-version-uploads/${current_version}/${project.project_category}/${id}`);
                if (allversionfiles.length > 0) {
                    const files = [...allversionfiles, ...data?.filesInfo]
                    allversionfiles = files
                } else {
                    allversionfiles = data?.filesInfo
                }
            } catch (err) {
                console.error('Error No file found in ' + current_version)
            }
        }
        return allversionfiles
    }

    const getAllfiles = async () => {
        setLoading(true);
        if (!navigator.onLine) {
            setRespMessage("You are currently offline. Please check your internet connection.");
            setTimeout(() => {
                openErrorSB()
            }, 300)
            setLoading(false);
            return;
        }

        try {
            const get_all_version_Files = await getAllVersionFiles();
            const combinedData = [...get_all_version_Files];
            handlePreviewImages(combinedData);
        } catch (error) {
            // Handle API call errors
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    const getSocialMediaManagerList = async () => {
        await apiClient.get(`/api/get-team-member-list/${project.project_category}/${userId}`)
            .then(({ data }) => {
                setTeamMemberList(data?.list)
            })
            .catch((e) => {
            });
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    function joinChatRoom() {
        socketIO.current.emit("join-room", id);
    }
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
    async function reloadAllData() {
        if (handleRole().projectManager || handleRole().admin) { getSocialMediaManagerList() }
        setReloadState(prev => !prev)
        getChatMessage()
        setSelectedFilePeople("All Files")
        getProjectById(id, setProject, project.project_category, setFileVersionList)
        await getAllfiles()
    }

    const handleRole = () => {
        if (role.designer || role.mobile_app_developer || role.web_developer || role.social_media_manager || role.copywriter) {
            return {
                teamMember: true
            }
        }
        else if (role.projectManager) {
            return { projectManager: true }
        }
        else if (role.customer) {
            return { customer: true }
        }
        else if (role.admin) {
            return { admin: true }
        }
    }
    const handlePreviewImages = (images) => {
        let arr = []
        for (let i = 0; i < images?.length; i++) {
            const file_type = images[i]?.type?.split('/').pop()
            const currentImage = images[i]?.url
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
            .get(`/api/get-version-uploads/${value}/${project.project_category}/${id}`)
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
            .get(`/api/get-customer-files/${project.project_category}/${id}`)
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
    const handleFigmaLink = (e) => {
        setFigmaLink(e.target.value)
    }
    const closeFigmaModal = () => {
        setOpenFigmaModal(false)
    }
    const closeEditModal = () => {
        setEditModal(false)
    }
    const updateDriveLink = () => {
        if (!navigator.onLine) {
            setRespMessage("You are currently offline. Please check your internet connection.");
            setTimeout(() => {
                openErrorSB()
            }, 300)
            return;
        }
        const driveLink = {
            id: project._id,
            category: project.project_category,
            drive_link,
        }
        setDriveLoading(true)
        apiClient.post('/api/updating-drive-link', driveLink)
            .then(({ data }) => {
                setDriveLoading(false)
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
                    setDriveLoading(false)
                    const { message } = err.response.data
                    setRespMessage(message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                } else {
                    setDriveLoading(false)
                    setRespMessage(err.message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                }
            })
    }
    const updateFigmaLink = () => {
        if (!navigator.onLine) {
            setRespMessage("You are currently offline. Please check your internet connection.");
            setTimeout(() => {
                openErrorSB()
            }, 300)
            return;
        }
        const figmaLink = {
            category: project.project_category,
            figma_link,
            id: project._id
        }
        setDriveLoading(true)
        apiClient.post('/api/updating-figma-link', figmaLink)
            .then(({ data }) => {
                setDriveLoading(false)
                if (data.message) {
                    setRespMessage(data.message)
                    setFigmaLink(data.figma_link)
                }
                setTimeout(() => {
                    openSuccessSB()
                    setOpenFigmaModal(false)
                }, 400)
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setDriveLoading(false)
                    setRespMessage(message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                } else {
                    setDriveLoading(false)
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
    const onSendMessage = async (event) => {
        const user_message = message
        sendMessage("")
        event.preventDefault();
        if (user_message === "") {
            return;
        }
        const data = {
            project_id: id,
            chat_message: {
                type: "chat-message",
                project_id: id,
                project_title: project.project_title || "",
                authorId: project.user || '',
                userId,
                name: reduxState.userDetails.name,
                avatar: avatar ? avatar : ImageAvatar,
                time_data: formattedTime,
                date: formattedDate,
                message: user_message,
                role: getUserRoles(role),
                view: true,
            },
        };

        setMsgArray((prev) => (prev ? [...prev, data.chat_message] : [data.chat_message]));
        socketIO.current.emit("room-message", data.chat_message, id, team_members);
        await apiClient
            .put("/chat-message", data)
            .then(({ data }) => {
                // console.log("Message ", data?.message)
            })
            .catch((e) => console.log("Chat Send Error ", e?.response));
    };
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
    const projectForReview = async () => {
        setSendChanges(true)
        await apiClient.get('/api/social-media/for-review/' + id)
            .then(({ data }) => {
                sendingStatusNotification(socketIO, role, project, userId, 'For Review')
                handleClose()
                setRespMessage(data.message)
                setSendChanges(false)
                setTimeout(() => {
                    reduxActions.handleGetAllProjects(!reduxState.project_call)
                    openSuccessSB()
                }, 600)
            })
            .catch((err) => {
                if (err.response.data) {
                    setRespMessage(err.response.data.message)
                    setSendChanges(false)
                    openErrorSB()
                } else {
                    setRespMessage(err.message)
                    setSendChanges(false)
                    openErrorSB()
                }
            })
    }
    const projectOngoing = async () => {
        setSendChanges(true)
        await apiClient.get('/api/social-media/ongoing/' + id)
            .then(({ data }) => {
                sendingStatusNotification(socketIO, role, project, userId, 'Ongoing')
                handleClose()
                setRespMessage(data.message)
                setSendChanges(false)
                setTimeout(() => {
                    reduxActions.handleGetAllProjects(!reduxState.project_call)
                    openSuccessSB()
                }, 600)
            })
            .catch((err) => {
                if (err.response.data) {
                    setRespMessage(err.response.data.message)
                    setSendChanges(false)
                    openErrorSB()
                } else {
                    setRespMessage(err.message)
                    setSendChanges(false)
                    openErrorSB()
                }
            })
    }
    const withRevision = async () => {
        setSendChanges(true)
        await apiClient.get('/api/social-media/with-revision/' + id)
            .then(({ data }) => {
                sendingStatusNotification(socketIO, role, project, userId, 'With Revision')
                handleClose()
                setRespMessage(data.message)
                setSendChanges(false)
                setTimeout(() => {
                    reduxActions.handleGetAllProjects(!reduxState.project_call)
                    openSuccessSB()
                }, 600)
            })
            .catch((err) => {
                if (err.response.data) {
                    setRespMessage(err.response.data.message)
                    setSendChanges(false)
                    openErrorSB()
                } else {
                    setRespMessage(err.message)
                    setSendChanges(false)
                    openErrorSB()
                }
            })
    }
    function getDate(localDate) {
        const date = new Date(localDate);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        let ampm = "AM";
        if (hours >= 12) {
            ampm = "PM";
            hours = hours % 12;
        }
        hours = String(hours).padStart(2, "0");
        let formattedDate = `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`;
        return { formattedDate };
    }
    const DownloadFile = (downloadfileName) => {
        if (!downloadfileName) return alert("Please select file");
        window.open(downloadfileName, "_blank");
    };
    const openImage = useCallback((index) => {
        setIsViewerOpen(true)
        setCurrentImage(index)
    }, [isViewerOpen])

    const closeImageViewer = () => {
        setIsViewerOpen(false);
    };
    const toggleShowMore = () => {
        setShowMore(!showMore);
    };
    const makePriorityHigh = async () => {
        await apiClient.post("/api/set-project-priority", { project_id: id, priority: "High" })
            .then(({ data }) => {
                setRespMessage(data.message)
                getProjectById(id, setProject, project.project_category, setFileVersionList)
                setTimeout(() => {
                    openSuccessSB()
                }, 500)
            })
            .catch((err) => {
                setRespMessage(err.response.data.message)
                openErrorSB()
            })
    }
    const deleteTeamMember = (val) => {
        setTeamLoading(true)
        const formdata = {
            user: val?._id,
            project_id: id
        }
        apiClient.put(`/api/delete-team-member/${project.project_category}/`, formdata)
            .then(({ data }) => {
                setTeamLoading(false);
                // getProjectData(reduxState?.userDetails?.id, reduxActions.getCustomerProject);
                if (data.message) {
                    setRespMessage(data.message)
                    setTimeout(() => {
                        setTeamMembers([])
                        openSuccessSB()
                    }, 500)
                }
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setTeamLoading(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                } else {
                    setTeamLoading(false)
                    setRespMessage(err.message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                }
            })

    }
    const SubmitProject = async (value) => {
        setMemberName(value);
        if (value) {
            setTeamLoading(true);;
            project.team_members = [value];
            project.status = "Assigned";
            project.is_active = true;

            let data = {
                category: project.project_category,
                project_id: project._id,
                project_data: project,
            };
            await apiClient.patch(`/api/projects/update-team`, data)
                .then(({ data }) => {
                    const { save } = data;
                    const message = {
                        teamId: value._id,
                        user: reduxState.userDetails.id,
                        name: reduxState.userDetails.name,
                        type: 'project-assigned',
                        project_id: project._id,
                        project_title: project.project_title,
                        role: 'Project-Manager',
                        msg: 'New Project assigned',
                        view: true,
                    }
                    socketIO.current.emit('project-assigned', value._id, message)
                    setTeamMembers(save?.team_members)
                    // setsuccessMessage(data?.message);
                    // setsuccessOpen(true);
                    setRespMessage(data?.message);
                    openSuccessSB()
                    setTeamLoading(false)
                })
                .catch((e) => {
                    setTeamLoading(false)
                    console.error("Error assgin project => ", e?.response?.data?.message);
                });
        }
    };
    const handleDeleteFile = async (fileData) => {
        const formdata = {
            file_name: fileData?.name,
            folder_name: fileData?.folder_name
        }
        await apiClient.post(`/api/delete-file`, formdata)
            .then(({ data }) => {
                if (data?.message) {
                    const filterData = version?.filter(item => item?.id !== fileData?.id)
                    setVersion(filterData)
                    setRespMessage(data.message)
                    setTimeout(() => {
                        openSuccessSB()
                    }, 500)
                }
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                } else {
                    setRespMessage(err.message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                }
            })
    };
    const truncatedDescription = project?.project_description?.substring(0, 240);

    const latestButtonProps = {
        showGoogleDriveButton,
        handleDriveLink,
        handleFigmaLink,
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
        driveLoading,
        figma_link,
        drive_link,
        editModal,
        openFigma,
        showFigmaMenu,
        loading,
        showMenu,
    }
    useEffect(() => {
        socketIO.current.on("message", (message) => {
            if (message !== "") {
                setMsgArray((prev) => [...prev, message]);
            }
        });
    }, [socketIO.current]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [msgArray]);


    useEffect(() => {
        if (handleRole().projectManager || handleRole().admin) { 
            getSocialMediaManagerList() 
        }
        joinChatRoom();
        return () => {
            socketIO.current.emit('leave-room', id)
        }
    }, []);

    useEffect(() => {
        const category = project.project_category
        getProjectById(id, setProject, category, setFileVersionList)
        getChatMessage();
    }, [id])

    return {
        role,
        showMore,

        project,
        memberName,
        teamMembers,
        teamMemberList,
        teamLoading,
        deleteTeamMember,

        toggleShowMore,
        truncatedDescription,

        loading,
        message,
        fileRef,
        version,
        openImage,
        isViewerOpen,
        setIsViewerOpen,
        DownloadFile,
        handleDeleteFile,
        getDate,
        handleFileUpload,
        reload: reloadAllData,
        closeImageViewer,
        makePriorityHigh,
        SubmitProject,
        sendMessage,
        currentImage,
        onSendMessage,
        setSuccessSB,
        successSB,
        setErrorSB,
        errorSB,
        msgArray,
        handleRole,
        projectOngoing,
        projectForReview,
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
        isSendChanges,
        setSendChanges,
        withRevision,
        handleClick,
        openFileSelect,
        anchorEl,
        handleClose,

    }
}

export default useSocialMediaHook
