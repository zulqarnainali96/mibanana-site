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
import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import MDSnackbar from "components/MDSnackbar";
import RightSideDrawer from "components/RightSideDrawer";
import useRightSideList from 'layouts/Right-side-drawer-list/useRightSideList'
import apiClient from "api/apiClient";
import { socketIO } from "layouts/sockets";

function Dashboard({ reduxActions, reduxState }) {
  const project_list = reduxState.project_list?.CustomerProjects
  const user = reduxState?.userDetails
  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const isDesigner = reduxState.userDetails.roles?.includes("Graphic-Designer") ? true : false
  const { list } = useRightSideList()

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [respMessage, setRespMessage] = useState("")

  const projectQueue = project_list?.filter(item => {
    return item.status === 'Approval'
  })

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
          <MDTypography display={"block"} sx={{ textDecoration: 'underline !important',fontWeight:"300" }} variant="button" fontWeight="medium">
            <MDBox sx={{ "&:hover": { color: "blue" } }} onClick={() => projectActiveorNot(projectid)}>
              {item?.name}
            </MDBox>
          </MDTypography>
        </MDBox>),

      team_members: <MDTypography display="flex" flexDirection="column" gap="10px">
        {item.team_members?.length > 0 ? item.team_members.map(item => <MDTypography color="#333" variant="h6" sx={{fontWeight:'300'}}>{item.name}</MDTypography>) :
          <MDTypography color="#333" fontSize="small" variant="h6" sx={{fontWeight:'300'}}>Currently not Assigned to <br /> any Team members</MDTypography>}
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
      <DashboardNavbar />
      <MDBox p={"24px 12px"} mt={'15px'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Good Evening"
                message={reduxState.userDetails?.name ? `Hi, ${reduxState.userDetails?.name.toUpperCase()} ${getUserRole()}` : ""}
              // count={281}
              // percentage={{
              //   color: "success",
              //   amount: "+55%",
              //   label: "than lask week",
              // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Ready for review"
                message={activeProject?.length ? activeProject?.length + " Active Project" : "0 Active Project "}
              // count="2,300"
              // percentage={{
              //   color: "success",
              //   amount: "+3%",
              //   label: "than last month",
              // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="In Queue"
                message={`${projectQueue?.length ? projectQueue?.length + " Project in Queue" : "0 Projects in Queue"}`}
              // percentage={{
              //   color: "success",
              //   amount: "+1%",
              //   label: "than yesterday",
              // }}
              />
            </MDBox>
          </Grid>
          <Grid item xxl={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Card>
              <MDBox
                // mx={2}
                mt={3}
                sx={({ palette: { light, grey } }) => ({
                  // backgroundColor : light.cream,
                })}>
                <MDBox pt={3}>
                  <ProjectDataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    isfunc={true}
                    noEndBorder
                  />
                  {!rows.length ? <MDTypography textAlign="center" p={1} component="h4">No Projects Found</MDTypography> : null}
                </MDBox>
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

export default reduxContainer(Dashboard);


