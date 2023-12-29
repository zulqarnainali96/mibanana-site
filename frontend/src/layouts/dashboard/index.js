import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import reduxContainer from "redux/containers/containers";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import { Action } from 'layouts/ProjectsTable/data/authorsTableData'
import MDBadge from "components/MDBadge";
import ProjectDataTable from "examples/projectsTable";
import { Card, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import MDSnackbar from "components/MDSnackbar";
import RightSideDrawer from "components/RightSideDrawer";
import useRightSideList from 'layouts/Right-side-drawer-list/useRightSideList'
import apiClient from "api/apiClient";
import { socketIO } from "layouts/sockets";
import NewNavbar from 'examples/Navbars/NewDesign/NewNavbar'
import { useStyles } from "./dashboardStyle";
import { checkIcon } from "assets/new-images/dashboard/fi_check-circle (1)";
import { bananaIcon } from "assets/new-images/dashboard/Vector";
import { clockIcon } from "assets/new-images/dashboard/Group42";
import StatusBox from "./status-box";
import NewProjectsTable from "examples/new-table";
import { mibananaColor } from "assets/new-images/colors";
import { fontsFamily } from "assets/font-family";
import "./status-box/status-style.css"

function Dashboard({ reduxActions, reduxState }) {
  const project_list = reduxState.project_list?.CustomerProjects
  const user = reduxState?.userDetails
  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const isDesigner = reduxState.userDetails.roles?.includes("Graphic-Designer") ? true : false
  const { list } = useRightSideList()
  const styles = useStyles()
  const is400 = useMediaQuery("(max-width:500px)")


  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [respMessage, setRespMessage] = useState("")

  const projectQueue = project_list?.filter(item => {
    return item.status === 'Approval'
  })
  const sumbitAndOngoing = () => {
    const Ongoing = project_list?.filter(item => item.status === 'Ongoing')
    const isSubmitted = project_list?.filter(item => item.status === 'Submitted')
    console.log('isSubmitted ', isSubmitted)
    console.log('Ongoing ', Ongoing)
    if (Ongoing?.length > 0 && isSubmitted?.length === 0) return Ongoing?.length
    else if (isSubmitted?.length > 0 && Ongoing?.length === 0) return isSubmitted?.length
    else if (isSubmitted?.length > 0 && Ongoing?.length > 0) return isSubmitted?.length + Ongoing?.length
    else { return 0 }
  }
  console.log(sumbitAndOngoing())
  const projectCompleted = project_list?.filter(item => item.status === 'Completed')

  const activeProject = project_list?.filter(item => {
    return item.status === 'Ongoing'
  })

  const navigate = useNavigate()

  const handleOpen = () => {
    reduxActions.setAlert(true)
  }

  const getUserRole = () => {
    let val = reduxState.userDetails?.roles
    if (val.includes("Graphic-Designer")) {
      return "(GRAPHIC DESIGNER)"
    } else if (val.includes("Project-Manager")) {
      return "(PROJECT MANAGER)"
    } else if (val.includes("Admin")) {
      return "(ADMIN)"
    } else {
      return "(CUSTOMER)"
    }
  }

  async function getAllProjectsID() {
    let Projects = reduxState.project_list?.CustomerProjects
    let filterIDS = Projects?.map(item => item._id)
    console.log(filterIDS)
    const data = {
      user: reduxState.userDetails?.id,
      arrayofIDS: filterIDS
    }
    await apiClient.post("/api/all-projects-ids", data).then((resp) => {
      console.log(resp)
    }).catch((err) => {
      console.log(err)
    })
  }

  // const getAllNotificationsMsg = () => {
  //   const id = reduxState?.userDetails?.id
  //   apiClient.get("/api/get-notifications/" + id).then(({ data }) => {
  //     console.log(data)
  //     localStorage.setItem('user_details', JSON.stringify({
  //       ...reduxState?.userDetails,
  //       ...data.userDetails,
  //     }))
  //     reduxActions.getUserDetails({
  //       ...reduxState?.userDetails,
  //       ...data.userDetails,
  //     })  
  //     reduxActions.getUserNewChatMessage(data.userDetails?.notifications)
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  // }
  // console.log(reduxState)
  useEffect(() => {
    // getAllProjectsID()
    // getAllNotificationsMsg()
  }, [])

  function projectActiveorNot(id) {
    // console.log('ID =>', id)
    reduxActions.getID(id)
    let projectID = project_list[id].hasOwnProperty("_id") ? project_list[id]?._id : project_list[id]?.id
    if (user?.roles?.includes("Project-Manager") || user?.roles?.includes("Graphic-Designer") || user?.roles?.includes("Admin")) {
      navigate("/chat/" + projectID)
      return
    } else {
      navigate("/chat/" + projectID)
      // project_list[id]?.is_active ? navigate("/chat/" + projectID) : handleOpen()
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
  const rows = project_list?.length > 0 ? project_list.map((item, i) => {

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

    const projectid = project_list.indexOf(item)

    // const getUserNotifcations = async () => {
    //   await apiClient.get("/chat-message/" + projectid).then(({ data }) => {
    //     if (data?.chat?.chat_msg.length > 0) {
    //       const messages = data?.chat?.chat_msg
    //       const filterData = messages.filter((item) => item.user !== reduxState?.userDetails?.id)
    //       reduxActions.getUserNewChatMessage(filterData)
    //     }

    //   }).catch((err) => console.log(err))
    // }
    socketIO.emit("room-message", '', projectid)
    // getUserNotifcations()

    return {
      name: (
        <MDBox lineHeight={1}>
          <MDTypography display={"block"} sx={{ textDecoration: 'underline !important' }} variant="button" fontWeight="medium">
            <MDBox sx={{ "&:hover": { color: "blue" }, fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor }} onClick={() => projectActiveorNot(projectid)}>
              {item?.name}
            </MDBox>
          </MDTypography>
        </MDBox>),

      team_members: <MDTypography display="flex" flexDirection="column" gap="10px" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor }}>
        {item.team_members?.length > 0 ? item.team_members.map(item => <MDTypography color="#333" variant="h6" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important' }}>{item.name}</MDTypography>) :
          <MDTypography color="#333" fontSize="small" variant="h6" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important' }}>Currently not Assigned to <br /> any Team members</MDTypography>}
      </MDTypography>,
      status: <MDBox ml={-1}>
        <MDBadge badgeContent={projectStatus(item?.status)}
          sx={{
            "& .MuiBadge-badge":
              { background: mibananaColor.yellowColor, color: mibananaColor.yellowTextColor, textTransform: 'capitalize', fontSize: ".9rem", borderRadius: '0px', fontFamily: fontsFamily.poppins, fontWeight: '400  !important' }
          }} circular="true" size="lg" />
      </MDBox>,
      project_category: <MDTypography variant="h6" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor }}>
        {item.project_category}
      </MDTypography>,
      active: <MDTypography variant="p" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor }}>
        {!item.is_active ? "Not Active" : item.updatedAt}
      </MDTypography>,
      createdAt: <MDTypography variant="p" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor }}>{readableTimestamp}</MDTypography>,
      action: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        <Action item={item} resonseMessage={setRespMessage} errorSBNot={openErrorSB} successSBNot={openSuccessSB} />
      </MDTypography>

    }
  }) : []
  const columns = [
    { Header: "author", accessor: "name", align: "left", },
    { Header: "Team Member", accessor: "team_members", align: "left" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "Category", accessor: "project_category", align: "center" },
    { Header: "Active on", accessor: "active", align: "center" },
    { Header: "Submitted on", accessor: "createdAt", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ]
  return (
    <DashboardLayout>
      <MDBox p={"0px 12px"} mt={'15px'}>
        <Grid container justifyContent={"center"} sx={{ gap: '10px' }}>
          <StatusBox is400={is400}>
            <Grid container alignItems={"center"} sx={{ gap: is400 ? "12px" : "0px" }}>
              <Grid item xxl={8} xl={8} lg={8} >
                <MDTypography className={`${styles.headingStyle} heading-style`} sx={{ fontSize: is400 ? "5rem !important" : "8rem !important", textAlign: "center" }}>{projectCompleted?.length > 0 ? projectCompleted?.length : 0}</MDTypography>
              </Grid>
              <Grid xxl={4} xl={4} lg={4}>
                {checkIcon}
                <MDTypography className={styles.headingStyle2}>Completed Projects</MDTypography>
              </Grid>
            </Grid>
          </StatusBox>
          <StatusBox is400={is400}>
            <Grid container alignItems={"center"} sx={{ gap: is400 ? "12px" : "0px" }}>
              <Grid item xxl={8} xl={8} lg={8} >
                <MDTypography className={styles.headingStyle} sx={{ fontSize: is400 ? "5rem !important" : "8rem !important", textAlign: "center" }}>{sumbitAndOngoing()}</MDTypography>
              </Grid>
              <Grid xxl={3} xl={3} lg={3}>
                {bananaIcon}
                <MDTypography className={styles.headingStyle2}>Active Projects</MDTypography>
              </Grid>
            </Grid>
          </StatusBox>
          <StatusBox is400={is400}>
            <Grid container alignItems={"center"} sx={{ gap: is400 ? "12px" : "0px" }}>
              <Grid item xxl={8} xl={8} lg={8} >
                <MDTypography className={styles.headingStyle} sx={{ fontSize: is400 ? "5rem !important" : "8rem !important", textAlign: "center" }}>{projectQueue?.length > 0 ? projectQueue?.length : 0}</MDTypography>
              </Grid>
              <Grid xxl={3} xl={3} lg={3}>
                {clockIcon}
                <MDTypography className={styles.headingStyle2}>Queue Projects</MDTypography>
              </Grid>
            </Grid>
          </StatusBox>
          <Grid item xxl={11} xl={8} lg={8} md={8} display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Card sx={cardStyles}>
              <MDBox>
                <NewProjectsTable
                  table={{ columns, rows }}
                  entriesPerPage={{ defaultValue: 5 }}
                  showTotalEntries={true}
                  pagination={{ variant: 'contained', color: "warning" }}
                  noEndBorder={false}
                  canSearch={false}
                  isSorted={false}
                />
                {!rows.length ? <MDTypography textAlign="center" p={1} component="h4">No Projects Found</MDTypography> : null}
              </MDBox>
            </Card>
            {renderSuccessSB}
            {renderErrorSB}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

const cardStyles = {
  width: '100%',
  borderRadius: '0px',
  padding: '8px',
  backgroundColor: mibananaColor.headerColor
}
export default reduxContainer(Dashboard);


