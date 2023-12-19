import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import ProjectDataTable from 'examples/projectsTable'
import React, { useEffect, useState } from 'react'
import authorsTableData from 'layouts/ProjectsTable/data/authorsTableData'
import ProjectStatus from 'examples/Statuses'
import reduxContainer from 'redux/containers/containers'
import { Action } from './data/authorsTableData'
import MDBadge from 'components/MDBadge'
import { getProjectData } from 'redux/global/global-functions'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import MDSnackbar from 'components/MDSnackbar'
import { setAlert } from 'redux/actions/actions'
import { useDispatch } from 'react-redux'
// import CreateProjectButton from 'examples/Navbars/Create-project-button'
import { socketIO } from 'layouts/sockets'
import apiClient from 'api/apiClient'
import { currentUserRole } from 'redux/global/global-functions'


const ProjectTable = ({ reduxState, reduxActions }) => {
    const { columns } = authorsTableData()
    const navigate = useNavigate()
    const { project_list } = reduxState
    const [respMessage, setRespMessage] = useState("")
    const role  = currentUserRole(reduxState)
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const projectList = useSelector(state => state.project_list.CustomerProjects)
    const user = useSelector(state => state.userDetails)
    const isDesigner = reduxState.userDetails.roles?.includes("Graphic-Designer") ? true : false
    const [personName, setPersonName] = React.useState('');
    const [copyProjectList, setCopyProjectList] = useState({})

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const dispatch = useDispatch()

    // const [open, setOpen] = useState(false)
    // const [formValue, setFormValue] = useState({
    //     project_category: '',
    //     design_type: '',
    //     brand: '',
    //     project_title: '',
    //     project_description: '',
    //     describe_audience: '',
    //     sizes: '',
    //     resources: '',
    //     reference_example: '',
    //     add_files: [],
    //     specific_software_names: '',
    // })
    // const handleChange = (event) => {
    //     // event.stopPropagation();
    //     const { name, value } = event.target
    //     console.log(name, value)
    //     setFormValue({
    //         ...formValue,
    //         [name]: value
    //     })
    // }

    // const handleClose = () => {
    //     setOpen(false)
    // }

    // const handleClickOpen = () => {
    //     setOpen(true)
    // }

    const handleOpen = () => {
        dispatch(setAlert(true))
    }
    function projectActiveorNot(id) {
        reduxActions.getID(id)
        let projectID = projectList[id]._id

        if (user.roles?.includes("Project-Manager") || user?.roles?.includes("Graphic-Designer") || user?.roles?.includes("Admin")) {
            navigate("/chat/" + projectID)
            return
        } else {
            navigate("/chat/" + projectID)
            // projectList[id]?.is_active ? navigate("/chat/" + projectID) : handleOpen()
        }
    }
    function projectStatus(status) {
        switch (status) {
            case 'Approval':
                return "Approval"
            case 'Completed':
                return "Completed"
            case 'Ongoing':
                return "Ongoing"
            case 'HeadsUp':
                return "HeadsUp"
            case 'Attend':
                return "Attend"
            case 'Submitted':
                return "Submitted"
            default:
                return "End"
        }
    }
    function getStatusStyle(status) {
        switch (status) {
            case 'Approval':
                return "#c5495d"
            case 'Completed':
                return "#E7F7EF"
            // return "#0FAF62"
            case 'Ongoing':
                return "#FFE135"
            case 'HeadsUp':
                return "#FFE135"
            case 'Attend':
                return "#0b7b0da1"
            case 'Submitted':
                return "#242924a1"
            default:
                return "#c5495d"
        }
    }
    function getStatusColor(status) {
        switch (status) {
            case 'Approval':
                return "white"
            case 'Completed':
                return "#0FAF62"
            case 'Ongoing':
                return "#191B1C"
            case 'HeadsUp':
                return "#FFE135"
            case 'Attend':
                return "white"
            case 'Submitted':
                return "white"
            default:
                return "#c5495d"
        }
    }

    // useEffect(() => {
    //     socketIO.on("message", (message) => {
    //         reduxActions.getUserNewChatMessage(message)
    //     })

    // }, [socketIO])

    const rows = project_list?.CustomerProjects?.length ? project_list.CustomerProjects.map((item, i) => {
        const date = new Date(item.createdAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-indexed
        const day = String(date.getDate()).padStart(2, "0");
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        let ampm = "AM";

        // Convert to 12-hour format and set AM/PM
        if (hours >= 12) {
            ampm = "PM";
            if (hours > 12) {
                hours -= 12;
            }
        }
        hours = String(hours).padStart(2, "0");
        const readableTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;

        const projectid = project_list.CustomerProjects.indexOf(item)

        const getUserNotifcations = async () => {
            await apiClient.get("/chat-message/" + projectid).then(({ data }) => {
                if (data?.chat?.chat_msg.length > 0) {
                    const messages = data?.chat?.chat_msg
                    const filterData = messages.filter((item) => item.user !== reduxState?.userDetails?.id)
                    reduxActions.getUserNewChatMessage(filterData)
                }

            }).catch((err) => console.log(err))
        }
        socketIO.emit("room-message", '', projectid)
        // getUserNotifcations()

        return {
            name: (
                <MDBox lineHeight={1}>
                    <MDTypography display="block" sx={{ textDecoration: 'underline ' + '!important', fontWeight : '300' }} variant="button" fontWeight="medium">
                        <MDBox sx={{ "&:hover": { color: "blue" } }} onClick={() => projectActiveorNot(projectid)}>
                            {item?.name}
                        </MDBox>
                    </MDTypography>
                </MDBox>),

            team_members: <MDTypography display="flex" flexDirection="column" gap="10px" >
                {item.team_members?.length > 0 ? item.team_members.map(item => <MDTypography color="#333" variant="h6" sx={{fontWeight:'300'}}>{item.name}</MDTypography>) :
                    <MDTypography color="#333" fontSize="small" sx={{fontWeight:'300'}} variant="h6">Currently not Assigned to <br /> any Team members</MDTypography>}
            </MDTypography>,

            status: <MDBox ml={-1}>
                <MDBadge badgeContent={projectStatus(item?.status)}
                    sx={{
                        "& .MuiBadge-badge":
                            { background: getStatusStyle(item?.status), color: getStatusColor(item?.status), textTransform: 'capitalize', fontSize: ".8rem" }
                    }} circular="true" size="lg" />
            </MDBox>,

            project_category: <MDTypography variant="h6" color="text" fontWeight="medium" sx={{fontWeight:'300'}}>
                {item.project_category}
            </MDTypography>,
            active: <MDTypography color="dark" variant="p" sx={{fontWeight:'300'}}>{!item.is_active ? "Not Active" : item.updatedAt}</MDTypography>,
            createdAt: <MDTypography color="dark" variant="p" sx={{fontWeight:'300'}}>{readableTimestamp}</MDTypography>,
            action: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                <Action item={item} resonseMessage={setRespMessage} errorSBNot={openErrorSB} successSBNot={openSuccessSB} role={role} />
            </MDTypography>

        }
    }) : []

    useEffect(() => {
        const id = reduxState?.userDetails?.id
        getProjectData(id, reduxActions.getCustomerProject)
    }, [])

    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title="Error"
            content={respMessage}
            dateTime={new Date().toLocaleTimeString('pk')}
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="SUCCESS"
            content={respMessage}
            dateTime={new Date().toLocaleTimeString('pk')}
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );
    let statuses = [
        "All",
        "Archived",
        "Cancelled",
        "Approval",
        "Completed",
        "Ongoing",
        "For Review",
        "Draft",
        "Heads Up!",
    ]
    const filterBrand = reduxState?.customerBrand?.map(item => item.brand_name)

    const handleStatusChange = (event) => {
        const {
            target: { value },
        } = event;
        setCopyProjectList(reduxState.project_list)
        if (value) {
            const filterAccordingtoStatus = reduxState?.project_list?.CustomerProjects?.filter(item => {
                return item.status === value
            })
            reduxActions.getCustomerProject({ CustomerProjects: filterAccordingtoStatus })
        }
        console.log(value === 'All')
        if (value === 'All') {
            reduxActions.getCustomerProject(copyProjectList)
        }
        setPersonName(value)
    };
    const handleCategoryChange = (event) => {
        const {
            target: { value },
        } = event;
        setCopyProjectList(reduxState.project_list)
        if (value) {
            const filterAccordingtoStatus = reduxState?.project_list?.CustomerProjects?.filter(item => {
                console.log(value, item.project_category)
                return item.project_category === value
            })
            reduxActions.getCustomerProject({ CustomerProjects: filterAccordingtoStatus })
        }
        setPersonName(value)
    };
    const handleBrandChange = (event) => {
        const {
            target: { value },
        } = event;
        setCopyProjectList(reduxState.project_list)
        if (value) {
            const filterAccordingtoStatus = reduxState?.project_list?.CustomerProjects?.filter(item => {
                return item.brand === value
            })
            reduxActions.getCustomerProject({ CustomerProjects: filterAccordingtoStatus })
        }
        setPersonName(value)
    };

    console.log(reduxState)
    const clearValue = () => {
        setPersonName("")
        reduxActions.getCustomerProject(copyProjectList)
    }
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox p={"24px 12px"} mt={'15px'}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Grid container justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
                            <Grid item xxl={8} display={'flex'}>
                                <Grid item xl={3} lg={3} md={3}>
                                    <ProjectStatus data={statuses} personName={personName} handleChange={handleStatusChange} status={"STATUS"} clearValue={clearValue} />
                                </Grid>
                                <Grid item xl={3} lg={3} md={3}>
                                    <ProjectStatus data={reduxState.category} personName={personName} handleChange={handleCategoryChange} clearValue={clearValue} status={"CATEGORY"} />
                                </Grid>
                                <Grid item xl={3} lg={3} md={3}>
                                    <ProjectStatus data={filterBrand} personName={personName} handleChange={handleBrandChange} status={"BRAND"} clearValue={clearValue} />
                                </Grid>
                            </Grid>
                            <Grid item xxl={4} xl={4} textAlign={"right"}>
                            </Grid>
                        </Grid>

                        <Card>
                            <MDBox
                                mx={2}
                                mt={3}
                                sx={({ palette: { light, grey } }) => ({
                                    // backgroundColor : light.cream,
                                })}
                            >
                                <MDTypography variant="h6" color="dark">
                                    MiProjects
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <ProjectDataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    pagination={{ variant: 'contained', color: 'success' }}
                                    // isfunc={true}
                                    noEndBorder
                                />
                                {!rows.length ? <MDTypography textAlign="center" p={1} component="h4">No Projects Found</MDTypography> : null}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
                {renderSuccessSB}
                {renderErrorSB}
            </MDBox>
        </DashboardLayout>
    )
}

export default reduxContainer(ProjectTable)
