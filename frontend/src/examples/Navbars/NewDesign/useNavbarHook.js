import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from 'sockets';
import { getProjectData } from "redux/global/global-functions";
import { getBrandData } from "redux/global/global-functions";
import { reRenderChatComponent } from "redux/actions/actions";
import DefaultAvatar from "assets/mi-banana-icons/default-profile.png";
import { store } from "redux/store";
import { persistStore } from "redux-persist";
import apiClient from "api/apiClient";
import useRightSideList from "layouts/Right-side-drawer-list/useRightSideList";
import { useMaterialUIController } from "context";
import { projectNotifications } from "redux/global/global-functions";
import { useSelector } from 'react-redux';
import { currentUserRole } from 'redux/global/global-functions';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { notificationSound } from 'redux/global/global-functions';
let image = "image/"

const useNavbarHook = (reduxState, reduxActions) => {
    const socketIO = useRef(useContext(SocketContext));
    const location = useLocation();

    const collapseName = location.pathname.replace("/", "");
    const [userMenu, setUserMenu] = useState(false);
    const handleUserProfileMenu = (event) => setUserMenu(event.currentTarget);
    const handleUserCloseMenu = () => setUserMenu(false);
    const reduxDispatch = useDispatch();
    const render_chat = useSelector((state) => state.re_render_chat);
    const role = currentUserRole(reduxState);
    const personImage = reduxState?.userDetails?.avatar
        ? reduxState?.userDetails?.avatar
        : DefaultAvatar;
    const setChatRender = (payload) => reduxDispatch(reRenderChatComponent(payload));
    const navigate = useNavigate();
    const [respMessage, setRespMessage] = useState("");
    const [errorSB, setErrorSB] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = () => setSuccessSB(true);
    const [add_files, setAddFiles] = useState([]);
    const [upload_files, setUploadFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const openErrorSB = () => setErrorSB(true);
    const brandOption = reduxState?.customerBrand;
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { list } = useRightSideList();

    const [showAccountsbtn, setShowAccountsBtn] = useState(false)
    const [images_loading, setImagesLoading] = useState(false)
    const [edit_loading, setEditLoading] = useState(false)
    const quilRef = useRef();
    // edit modal state
    const [editImages, setEditImages] = useState([])

    // Toogle State
    const [openCopyWriting, setOpenCopyWriting] = useState(false)
    const [openSocialMediaForm, setOpenSocialMediaForm] = useState(false)
    const [openWebsite, setOpenWebsite] = useState(false)
    const [openWebApp, setOpenWebAppApp] = useState(false)
    const [openMobileApp, setOpenMobileApp] = useState(false)

    const [formValue, setFormValue] = useState({
        project_category: "",
        design_type: "",
        brand: {},
        project_title: "",
        project_description: "",
        describe_audience: "",
        sizes: "",
        width: "",
        height: "",
        unit: "",
        resources: "",
        reference_example: "",
        add_files: [],
        file_formats: [],
        specific_software_names: '',
    })
    const theme = useTheme()

    const is1040 = useMediaQuery("(max-width:1040px)")
    const extraLargeScreen = useMediaQuery(theme.breakpoints.up('xxl'))
    const largeScreen = useMediaQuery(theme.breakpoints.down('xxl'))
    const middleScreen = useMediaQuery(theme.breakpoints.down('lg'))
    const mobileScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const handleOpenCopyWriting = () => {
        setOpenCopyWriting(true);
    };

    const handleOpenSocialMedia = () => {
        setOpenSocialMediaForm(true);
    };
    const handleCloseSocialMedia = () => {
        setOpenSocialMediaForm(false);
    };
    const handleWebsite = () => {
        setOpenWebsite(true);
    };
    const handleCloseWebsite = () => {
        setOpenWebsite(false);
    };

    const handleWebAppDev = () => {
        setOpenWebAppApp(true);
    };

    const handleCloseWebAppDev = () => {
        setOpenWebAppApp(false);
    };
    const handleMobileAppDev = () => {
        setOpenMobileApp(true);
    };
    const handleCloseMobileAppDev = () => {
        setOpenMobileApp(false);
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };
    function clearAllNotfications() {
        reduxActions.getUserNewChatMessage([]);
    }
    function getToTheProject(id) {
        if (id) {
            navigate("/chat/" + id);
            setTimeout(() => {
                setChatRender(!render_chat);
            }, 400);
        } else {
            return;
        }
    }
    const handleClose = () => {
        setOpen(false);
        setLoading(false)
        // quilRef.current.getEditor().setText('');
    };

    const handleOpenCopyWritingClose = () => {
        setOpenCopyWriting(false);
    };

    function modalWidth() {
        let size = ""
        if (extraLargeScreen) { size = "40%"; }
        if (largeScreen) { size = "50%"; }
        if (middleScreen) { size = "55%"; }
        if (mobileScreen) { size = "80%"; }
        return size
    }

    const handleEditProjectClose = () => {
        reduxActions.handle_OpenEditProject(false)
    }
    const [reloadProject, setReloadProjects] = useState(false)
    const [controller, dispatch] = useMaterialUIController();
    const [quillError, setQuillError] = useState(false);
    const {
        miniSidenav,
        darkMode,
        whiteSidenav,
        transparentSidenav,
    } = controller;
    const [anchorEl, setAnchorEl] = useState(null);

    let textColor = "white";
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleRole = () => {
        if (role?.designer || role?.mobile_app_developer || role?.web_developer || role?.social_media_manager || role?.copywriter) {
            return {
                teamMember: true
            }
        }
        else if (role?.projectManager) {
            return { projectManager: true }
        }
        else if (role?.customer) {
            return { customer: true }
        }
        else if (role?.admin) {
            return { admin: true }
        }
    }

    function setSizes() {
        let size = ""
        if (formValue.width && formValue.height && formValue.unit) {
            size = `${formValue.width} x ${formValue.height} (${formValue.unit})`;
        }
        else if (formValue.width && formValue.height && !formValue.unit) {
            size = `${formValue.width} x ${formValue.height}`;
        }
        return size
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (upload_files.length === 8) {
            alert("Maximum seven file allowed");
            return;
        }
        if (quilRef.current.getEditor().getText().trim() === '') {
            setQuillError(true);
            return;
        }
        setQuillError(false);
        setLoading(true);
        let data = {
            id: reduxState?.userDetails?.id,
            name: reduxState?.userDetails?.name,
            project_category: formValue.project_category,
            design_type: formValue.design_type,
            brand: formValue.brand,
            project_title: formValue.project_title,
            project_description: formValue.project_description,
            sizes: setSizes(),
            specific_software_names: formValue.specific_software_names,
            file_formats: formValue.file_formats,
            is_active: false,
        };
        await apiClient.post("/graphic-project", data)
            .then((resp) => {
                if (resp?.status === 201) {
                    // const { message } = resp?.data;
                    const projectData = {
                        ...data,
                        brand: formValue.brand.brand_name,
                        user: reduxState?.userDetails?.id,
                        project_id: resp.data?.project._id,
                    };
                    socketIO.current.emit('new-project', projectData)
                    setRespMessage("Project Created Successfully");
                    reduxActions.getNew_Brand(!reduxState?.new_brand);
                    let param = [
                        reduxState?.userDetails?.id,
                        resp.data?.project._id,
                    ];
                    if (upload_files.length > 0) {
                        uploadFile(...param)
                    } else {
                        openSuccessSB()
                    }
                    getProjectData(reduxState?.userDetails?.id, reduxActions.getCustomerProject);
                    setOpen(false);
                    setLoading(false);
                }
                setLoading(false);
                setReloadProjects(true)
            })
            .catch((error) => {
                setLoading(false);
                setRespMessage(error.message);
                setTimeout(() => {
                    openErrorSB();
                }, 1000);
            });
    };

    const removeSingleFile = (img) => {
        const result = add_files.filter((item) => item?.url !== img?.url);
        const result2 = upload_files.filter((item) => item?.name !== img?.filename);
        setAddFiles(result);
        setUploadFiles(result2);
    };
    const deleteOtherSingleFile = (file) => {
        const result2 = upload_files.filter((item) => item?.name !== file?.name);
        setUploadFiles(result2);
    };
    const removeFiles = () => {
        setAddFiles([]);
        setUploadFiles([]);
        setUploadProgress(0);
    };
    const handleFileUpload = (event) => {
        if (event.target.files.length === 8) {
            alert("Upload maximum 7 files");
            setUploadFiles([]);
            setAddFiles([]);
            return;
        }
        const files = event.target.files;
        // const newFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadFiles((prev) => [...prev, file]);
            if (file.type.startsWith(image)) {
                const reader = new FileReader();
                reader.onload = function () {
                    setAddFiles((prev) => [...prev, { filename: file.name, url: reader.result }]);
                };
                reader.readAsDataURL(file);
            }
        }
    };
    const uploadFile = (user_id, project_id) => {
        const formdata = new FormData();
        setUploadProgress(0);
        for (let i = 0; i < upload_files.length; i++) {
            formdata.append("files", upload_files[i]);
        }
        formdata.append("user_id", user_id);
        formdata.append("project_id", project_id);
        apiClient.post("/file/google-cloud", formdata, {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            },
        })
            .then(() => {
                setRespMessage('Project Created Successfully');
                setLoading(false);
                handleClose()
                setTimeout(() => {
                    openSuccessSB();
                }, 1000);

            })
            .catch((err) => {
                setLoading(false);
                setRespMessage(err?.response?.data.message);
                setTimeout(() => {
                    openErrorSB();
                }, 1200);
                console.error("Error Found =>", err);
            });
    };

    function showPersonRoles() {
        if (role?.projectManager) return "(Project Manager)";
        if (role?.admin) return "(Admin)";
        if (role?.designer) return "(Graphic-Designer)";
        if (role?.customer) return "(Customer)";

        if (role?.web_developer) return "(Web Developer)";
        if (role?.mobile_app_developer) return "(Mobile App Developer)";
        if (role?.social_media_manager) return "(Social Media Manager)";
        if (role?.copywriter) return "(CopyWriter)";
    }
    const handleLogout = async () => {
        try {
            persistStore(store).purge();
            localStorage.removeItem("user_details");
            navigate("/authentication/mi-sign-in");
            socketIO.current.disconnect()
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    const onRemoveChange = (state) => {
        setFormValue({ ...formValue, state: "" });
    };

    const clientFiles = async () => {
        setImagesLoading(true);
        await apiClient.get("/get-customer-files/" + reduxState?.currentProjectId)
            .then(({ data }) => {
                setEditImages(data.filesInfo);
                setImagesLoading(false);
            })
            .catch((err) => {
                setEditImages([]);
                setImagesLoading(false);
            });
    }
    const getMessageNotification = () => {
        const is_project_notifications = reduxState?.project_notifications?.some(item => item?.view === true)
        if (is_project_notifications) {
            return true
        } else {
            return false
        }
    }
    const responsiveStyle = ({ breakpoints }) => ({
        [breakpoints.up('lg')]: {
            fontSize: '18px !important',
        },
        [breakpoints.down('lg')]: {
            fontSize: '16px',
        },
    })
    const roleResponsive = ({ breakpoints }) => ({
        [breakpoints.up('lg')]: {
            fontSize: '16px !important',
        },
        [breakpoints.down('lg')]: {
            fontSize: '15px !important',
        },
    })
    const notificationsLength = () => {
        return reduxState?.project_notifications?.filter(item => {
            return item?.view === true
        }).length
    }
    const handleMobileNav = useCallback(() => {
        setShowAccountsBtn(prev => !prev)
    }, [showAccountsbtn])

    useEffect(() => {
        socketIO.current.on('connect', () => {
            const userId = reduxState?.userDetails?.id
            const user_name = reduxState?.userDetails?.name
            const roles = reduxState?.userDetails?.roles
            socketIO.current.emit('user_online', true, userId, roles, user_name)
        })
    }, [])

    useEffect(() => {
        const userId = reduxState?.userDetails?.id
        const user_name = reduxState?.userDetails?.name
        const roles = reduxState?.userDetails?.roles

        socketIO.current.emit('user_online', true, userId, roles, user_name)
        const id = reduxState?.userDetails?.id;
        projectNotifications(id, reduxActions.handleProject_notifications)
    }, [])

    useEffect(() => {
        socketIO.current.on('active_users', (online_users) => {
            const filterUserArray = online_users.filter(user => user.id !== reduxState?.userDetails?.id)
            // console.log(filterUserArray)
            reduxActions.handleOnlineUsers(filterUserArray)
        })
        if (handleRole()?.projectManager) {
            socketIO.current.on('new-project-notification', project_data => {
                getProjectData(reduxState?.userDetails?.id, reduxActions.getCustomerProject)
                notificationSound()
                reduxActions.handleProject_notifications(project_data)
            })
        }
        if (handleRole()?.customer) {
            socketIO.current.on('status-change-notification', project_data => {
                reduxActions.handleProject_notifications(project_data)
            })
        }

        if (handleRole()?.projectManager || handleRole()?.teamMember) {
            socketIO.current.on('getting-customer-notifications', (project_data, id, status) => {
                const filterProject = reduxState?.project_list.CustomerProjects?.map(project => {
                    return project._id === id ? { ...project, status: status } : project
                })
                reduxActions.getCustomerProject({ ...reduxState?.projects_list, CustomerProjects: filterProject })
                reduxActions.handleProject_notifications(project_data)
            })
            socketIO.current.on('send-private-message-notification', (message) => {
                console.log('message', message)
                notificationSound()
                reduxActions.handleUnreadChatMessage(message)
            })
            socketIO.current.on('group-msg-notification', (message) => {
                console.log('message', message)
                notificationSound()
                reduxActions.handleUnreadChatMessage(message)
            })
        }
        if (handleRole()?.teamMember) {
            socketIO.current.on('new-project-assigned', message => {
                reduxActions.handleProject_notifications(message)
            })
        }

        socketIO.current.on('chat-message-notification', message => {
            reduxActions.handleProject_notifications(message)
            console.log('message', message);
        })
        return () => {
            socketIO.current.off('chat-message-notification')
            if (role?.designer) {
                socketIO.current.off('new-project-assigned')
            }
            if (role?.projectManager || role?.designer) {
                socketIO.current.off('getting-customer-notifications')
            }
            if (role?.projectManager) {
                socketIO.current.off('new-project-notification')
            }
            if (role?.customer) {
                socketIO.current.off('status-change-notification')
            }
        }
    }, [socketIO.current])

    useEffect(() => {
        socketIO.current.connect()
    }, [])

    useEffect(() => {
        const id = reduxState?.userDetails?.id;
        getProjectData(id, reduxActions.getCustomerProject);
    }, [reduxState?.project_call])


    useEffect(() => {
        const id = reduxState?.userDetails?.id;
        getProjectData(id, reduxActions.getCustomerProject);
        getBrandData(id, reduxActions.getCustomerBrand);
    }, [reloadProject]);

    useEffect(() => {
        return () => {
            setReloadProjects(false)
            handleClose()
        }
    }, []);

    return {
        open,
        list,
        socketIO,
        respMessage,
        successSB,
        setSuccessSB,
        errorSB,
        setErrorSB,
        formValue,
        handleSubmit,
        setFormValue,
        handleClose,
        openSuccessSB,
        openErrorSB,
        setRespMessage,
        selectedOption,
        setSelectedOption,
        handleChange,
        onRemoveChange,
        add_files,
        upload_files,
        uploadProgress,
        loading,
        quillError,
        quilRef,
        setLoading,
        handleFileUpload,
        removeFiles,
        setShowSuccessModal,
        brandOption,
        removeSingleFile,
        deleteOtherSingleFile,
        handleCloseMobileAppDev,
        handleCloseSocialMedia,
        openCopyWriting,
        handleCloseWebsite,
        handleMobileNav,
        handleOpenCopyWriting,
        handleEditProjectClose,
        editImages,
        setEditImages,
        setEditLoading,
        images_loading,
        edit_loading,
        clientFiles,
        handleOpenCopyWritingClose,
        openSocialMediaForm,
        openWebApp,
        openWebsite,
        handleCloseWebAppDev,
        openMobileApp,
        showSuccessModal,
        modalWidth,
        handleUserProfileMenu,
        personImage,
        showPersonRoles,
        responsiveStyle,
        roleResponsive,
        notificationsLength,
        role,
        handleClickOpen,
        handleOpenSocialMedia,
        handleWebsite,
        handleWebAppDev,
        handleMobileAppDev,
        getMessageNotification,
        showAccountsbtn,
        handleLogout,
        userMenu,
        handleUserCloseMenu,
        collapseName,
        is1040,
        handleMenuOpen,
        anchorEl,
        handleMenuClose,
        navigate,
        textColor,
        darkMode,
        transparentSidenav,
        whiteSidenav,


    }
}

export default useNavbarHook
