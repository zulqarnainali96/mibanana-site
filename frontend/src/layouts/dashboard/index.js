import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import reduxContainer from "redux/containers/containers";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import { Action } from 'layouts/ProjectsTable/data/authorsTableData'
import MDBadge from "components/MDBadge";
import { Card, useMediaQuery } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import MDSnackbar from "components/MDSnackbar";
// import { useSocket } from "sockets";
import { checkIcon } from "assets/new-images/dashboard/fi_check-circle (1)";
import { bananaIcon } from "assets/new-images/dashboard/Vector";
import { clockIcon } from "assets/new-images/dashboard/Group42";
import StatusBox from "./status-box";
import NewProjectsTable from "examples/new-table";
import { mibananaColor } from "assets/new-images/colors";
import { fontsFamily } from "assets/font-family";
import "./status-box/status-style.css"
import { currentUserRole, projectStatus } from "redux/global/global-functions";
import "./status-box/status-style.css"
import { SocketContext } from "sockets";
import { Assigned } from "redux/global/status";
import { ForReview } from "redux/global/status";
import { Ongoing } from "redux/global/status";
import { Project_manager } from "redux/global/status";
import { Completed } from "redux/global/status";

function Dashboard({ reduxActions, reduxState }) {
  const [project_list, setProject_List] = useState(reduxState.project_list?.CustomerProjects)
  // const socketIO = useRef(useSocket())
  const socketIO = useRef(useContext(SocketContext));
  const role = currentUserRole(reduxState)
  const user = reduxState?.userDetails
  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const isLg = useMediaQuery("(max-width:768px)")

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [respMessage, setRespMessage] = useState("")

  const projectQueue = project_list?.filter(item => {
    return item.status === Project_manager
  })
  const sumbitAndOngoing = () => {
    const filterStatus = project_list?.filter(item => item.status === Assigned || item.status === ForReview || item.status === Ongoing)
    return filterStatus?.length
  }
  const projectCompleted = project_list?.filter(item => item.status === Completed)

  const navigate = useNavigate()
  function projectActiveorNot(id) {
    reduxActions.getID(id)
    let projectID = project_list[id].hasOwnProperty("_id") ? project_list[id]?._id : project_list[id]?.id
    navigate("/chat/" + projectID)
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

    const projectid = project_list.indexOf(item)

    socketIO.current.emit("room-message", '', projectid)

    return {
      project_title: (
        <MDBox lineHeight={1}>
          <MDTypography display={"block"} sx={{ textDecoration: 'underline !important' }} variant="button" fontWeight="medium">
            <MDBox sx={{ "&:hover": { color: "blue" }, fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor }} onClick={() => projectActiveorNot(projectid)}>
              {item?.project_title}
            </MDBox>
          </MDTypography>
        </MDBox>),
      name: (
        <MDTypography
          variant="h6"
          sx={{
            fontFamily: fontsFamily.poppins,
            fontWeight: "400  !important",
            color: mibananaColor.yellowTextColor,
          }}
        >
          {item?.name}
        </MDTypography>
      ),
      team_members: <MDTypography display="flex" flexDirection="column" gap="10px" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor }}>
        {item.team_members?.length > 0 ? item.team_members.map(item => <MDTypography color="#333" variant="h6" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important' }}>{item.name}</MDTypography>) :
          <MDTypography color="#333" fontSize="small" variant="h6" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important' }}>Currently not Assigned to <br /> any Team members</MDTypography>}
      </MDTypography>,
      status: <MDBox ml={-1}>
        <MDBadge badgeContent={projectStatus(item?.status)}
          sx={{
            "& .MuiBadge-badge":
              { background: mibananaColor.yellowColor, color: mibananaColor.yellowTextColor, textTransform: 'capitalize', fontSize: ".9rem", borderRadius: '0px', fontFamily: fontsFamily.poppins, fontWeight: '400  !important', width: "10rem", maxWidth: '10rem' }
          }} circular="true" size="lg" />
      </MDBox>,
      project_category: <MDTypography variant="h6" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor }}>
        {item.project_category}
      </MDTypography>,
      active: <MDTypography variant="p" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor }}>
        {!item.is_active ? "Not Active" : item.updatedAt?.map(d => <p>{d}</p>)}
      </MDTypography>,
      createdAt: <MDTypography variant="p" sx={{ fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor }}>{item?.createdAt?.map(d => <p>{d}</p>)}</MDTypography>,
      action: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        <Action item={item} resonseMessage={setRespMessage} errorSBNot={openErrorSB} successSBNot={openSuccessSB} role={role} />
      </MDTypography>

    }
  }) : []

  const small_rows = project_list?.length > 0 ? project_list.map((item, i) => {

    const date = new Date(item.createdAt);
    let hours = date.getHours();
    let ampm = "AM";

    if (hours >= 12) {
      ampm = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    }
    hours = String(hours).padStart(2, "0");
    const projectid = project_list.indexOf(item)
    socketIO.current.emit("room-message", '', projectid)

    return {
      project_title: (
        <MDBox lineHeight={1}>
          <MDTypography display={"block"} sx={{ textDecoration: 'underline !important' }} variant="button" fontWeight="medium">
            <MDBox sx={{ "&:hover": { color: "blue" }, fontFamily: fontsFamily.poppins, fontWeight: '400  !important', color: mibananaColor.yellowTextColor, fontSize: isLg && '12px' }} onClick={() => projectActiveorNot(projectid)}>
              {item?.project_title}
            </MDBox>
          </MDTypography>
        </MDBox>),
      status: <MDBox ml={-1}>
        <MDBadge badgeContent={projectStatus(item?.status)}
          sx={{
            "& .MuiBadge-badge":
              { background: mibananaColor.yellowColor, color: mibananaColor.yellowTextColor, textTransform: 'capitalize', fontSize: isLg ? "12px" : ".9rem", borderRadius: '0px', fontFamily: fontsFamily.poppins, fontWeight: '400  !important', width: "8rem", maxWidth: "8rem", }
          }} circular="true" size="lg" />
      </MDBox>,
      action: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        <Action item={item} resonseMessage={setRespMessage} errorSBNot={openErrorSB} successSBNot={openSuccessSB} role={role} />
      </MDTypography>

    }
  }) : []

  const columns = [
    { Header: "project title", accessor: "project_title", align: "left", },
    { Header: "author", accessor: "name", align: "left", },
    { Header: "Team Member", accessor: "team_members", align: "left" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "Category", accessor: "project_category", align: "center" },
    { Header: "Active on", accessor: "active", align: "center" },
    { Header: "Submitted on", accessor: "createdAt", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ]
  const small_columns = [
    { Header: "project title", accessor: "project_title", align: "left", },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ]


  useEffect(() => {
    setProject_List(reduxState.project_list.CustomerProjects)
  }, [reduxState.project_list])

  return (
    <DashboardLayout>
      <MDBox p={"10px 12px"} mt={'0px'} sx={{ backgroundColor: 'white !important' }}>
        <Grid container className="status-container">
          <StatusBox>
            <Grid container alignItems={"center"} height="100%" >
              <Grid item xxl={8} xl={8} lg={7} md={7} xs={7} >
                <MDTypography className="heading-style" >{projectCompleted?.length > 0 ? projectCompleted?.length : 0}</MDTypography>
              </Grid>
              <Grid xxl={3} xl={3} lg={5} md={5} xs={5}>
                {checkIcon}
                <MDTypography className="heading-style-2">Completed Projects</MDTypography>
              </Grid>
            </Grid>
          </StatusBox>
          <StatusBox>
            <Grid container alignItems={"center"} height="100%">
              <Grid item xxl={8} xl={8} lg={7} md={7} xs={7}>
                <MDTypography className="heading-style">{sumbitAndOngoing()}</MDTypography>
              </Grid>
              <Grid xxl={3} xl={3} lg={5} md={5} xs={5}>
                {bananaIcon}
                <MDTypography className="heading-style-2">Active Projects</MDTypography>
              </Grid>
            </Grid>
          </StatusBox>
          <StatusBox>
            <Grid container alignItems={"center"} height="100%">
              <Grid item xxl={8} xl={8} lg={7} md={7} xs={7} >
                <MDTypography className="heading-style">{projectQueue?.length > 0 ? projectQueue?.length : 0}</MDTypography>
              </Grid>
              <Grid xxl={3} xl={3} lg={5} md={5} xs={5}>
                {clockIcon}
                <MDTypography className="heading-style-2">Queue Projects</MDTypography>
              </Grid>
            </Grid>
          </StatusBox>
          <Grid item xxl={11} xl={11} lg={11} md={11} xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Card sx={cardStyles}>
              <MDBox>
                <NewProjectsTable
                  table={{ columns: isLg ? small_columns : columns, rows: isLg ? small_rows : rows }}
                  entriesPerPage={{ defaultValue: '15' }}
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


