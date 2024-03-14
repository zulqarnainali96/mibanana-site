import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import authorsTableData from "layouts/ProjectsTable/data/authorsTableData";
import ProjectStatus from "examples/Statuses/project-status-filter";
import CategoryFilter from "examples/Statuses/project-category";
import BrandFilter from "examples/Statuses/project-brand-filter";
import reduxContainer from "redux/containers/containers";
import { Action } from "./data/authorsTableData";
import MDBadge from "components/MDBadge";
import { getProjectData } from "redux/global/global-functions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MDSnackbar from "components/MDSnackbar";
import { currentUserRole } from "redux/global/global-functions";
import NewProjectsTable from "examples/new-table";
import { mibananaColor } from "assets/new-images/colors";
import { fontsFamily } from "assets/font-family";
import { useMediaQuery } from "@mui/material";
import { getBrandData, projectStatus } from "redux/global/global-functions";

const ProjectTable = ({ reduxState, reduxActions }) => {
  const { columns, small_columns } = authorsTableData();
  const navigate = useNavigate();
  const { project_list } = reduxState;
  const [respMessage, setRespMessage] = useState("");
  const role = currentUserRole(reduxState);
  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const [projectList, setProjectList] = useState(reduxState.project_list.CustomerProjects);
  const user = useSelector((state) => state.userDetails);
  const [status, setStatus] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [category, setCategory] = React.useState("");

  const [copyProjectList, setCopyProjectList] = useState(reduxState.project_list.CustomerProjects);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const isLg = useMediaQuery("(max-width:768px)")
  const is500 = useMediaQuery("(max-width:500px)")

  function openProjectChat(id) {
    reduxActions.getID(id);
    setTimeout(() => {
      navigate("/chat/" + id);
    }, 400)
  }

  const rows = projectList?.length
    ? projectList?.map((item, i) => {

      return {
        project_title: <MDBox lineHeight={1}>
          <MDTypography
            display={"block"}
            sx={{ textDecoration: "underline !important" }}
            variant="button"
            fontWeight="medium"
          >
            <MDBox
              sx={{
                "&:hover": { color: "blue" },
                fontFamily: fontsFamily.poppins,
                fontWeight: "400  !important",
                color: mibananaColor.yellowTextColor,
              }}
              onClick={() => openProjectChat(item?._id)}
            >
              {item?.project_title}
            </MDBox>
          </MDTypography>
        </MDBox>,
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

        team_members: (
          <MDTypography
            display="flex"
            flexDirection="column"
            gap="10px"
            sx={{
              fontFamily: fontsFamily.poppins,
              fontWeight: "400  !important",
              color: mibananaColor.yellowTextColor,
            }}
          >
            {item.team_members?.length > 0 ? (
              item.team_members.map((item) => (
                <MDTypography
                  color="#333"
                  variant="h6"
                  sx={{ fontFamily: fontsFamily.poppins, fontWeight: "400  !important" }}
                >
                  {item.name}
                </MDTypography>
              ))
            ) : (
              <MDTypography
                color="#333"
                fontSize="small"
                variant="h6"
                sx={{ fontFamily: fontsFamily.poppins, fontWeight: "400  !important" }}
              >
                Currently not Assigned to <br /> any Team members
              </MDTypography>
            )}
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={projectStatus(item?.status)}
              sx={{
                "& .MuiBadge-badge": {
                  background: mibananaColor.yellowColor,
                  color: mibananaColor.yellowTextColor,
                  textTransform: "capitalize",
                  fontSize: ".9rem",
                  borderRadius: "0px",
                  fontFamily: fontsFamily.poppins,
                  fontWeight: "400  !important",
                  width: "10rem",
                  maxWidth: "10rem",
                },
              }}
              circular="true"
              size="lg"
            />
          </MDBox>
        ),
        project_category: (
          <MDTypography
            variant="h6"
            sx={{
              fontFamily: fontsFamily.poppins,
              fontWeight: "400  !important",
              color: mibananaColor.yellowTextColor,
            }}
          >
            {item.project_category}
          </MDTypography>
        ),
        active: (
          <MDTypography
            variant="p"
            sx={{
              fontFamily: fontsFamily.poppins,
              fontWeight: "400  !important",
              color: mibananaColor.yellowTextColor,
            }}
          >
            {!item.is_active ? "Not Active" : item.updatedAt?.map(d => <p>{d}</p>)}
          </MDTypography>
        ),
        createdAt: (
          <MDTypography
            variant="p"
            sx={{
              fontFamily: fontsFamily.poppins,
              fontWeight: "400  !important",
              color: mibananaColor.yellowTextColor,
            }}
          >
            {item?.createdAt?.map(d => <p>{d}</p>)}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            <Action
              item={item}
              resonseMessage={setRespMessage}
              errorSBNot={openErrorSB}
              successSBNot={openSuccessSB}
              role={role}
            />
          </MDTypography>
        ),
      };
    })
    : [];
  const small_rows = projectList?.length
    ? projectList?.map((item) => {
      // const date = new Date(item.createdAt);
      // const year = date.getFullYear();
      // const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-indexed
      // const day = String(date.getDate()).padStart(2, "0");
      // let hours = date.getHours();
      // const minutes = String(date.getMinutes()).padStart(2, "0");
      // const seconds = String(date.getSeconds()).padStart(2, "0");
      // let ampm = "AM";

      // Convert to 12-hour format and set AM/PM
      // if (hours >= 12) {
      //   ampm = "PM";
      //   if (hours > 12) {
      //     hours -= 12;
      //   }
      // }
      // hours = String(hours).padStart(2, "0");
      // const projectid = project_list.CustomerProjects.indexOf(item);
      // socketIO.emit("room-message", "", projectid);

      return {
        project_title: (
          <MDBox lineHeight={1}>
            <MDTypography
              display={"block"}
              sx={{ textDecoration: "underline !important" }}
              variant="button"
              fontWeight="medium"
            >
              <MDBox
                sx={{
                  "&:hover": { color: "blue" },
                  fontFamily: fontsFamily.poppins,
                  fontSize: isLg && '12px',
                  fontWeight: "400  !important",
                  color: mibananaColor.yellowTextColor,
                }}
                onClick={() => openProjectChat(item?._id)}
              >
                {item?.project_title}
              </MDBox>
            </MDTypography>
          </MDBox>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={projectStatus(item?.status)}
              sx={{
                "& .MuiBadge-badge": {
                  background: mibananaColor.yellowColor,
                  color: mibananaColor.yellowTextColor,
                  textTransform: "capitalize",
                  fontSize: isLg ? "12px" : ".9rem",
                  borderRadius: "0px",
                  fontFamily: fontsFamily.poppins,
                  fontWeight: "400  !important",
                  width: "8rem",
                  maxWidth: "8rem",
                },
              }}
              circular="true"
              size="lg"
            />
          </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            <Action
              item={item}
              resonseMessage={setRespMessage}
              errorSBNot={openErrorSB}
              successSBNot={openSuccessSB}
              role={role}
            />
          </MDTypography>
        ),
      };
    })
    : [];

  useEffect(() => {
    const id = reduxState?.userDetails?.id;
    getProjectData(id, reduxActions.getCustomerProject);
    getBrandData(id, reduxActions.getCustomerBrand);
  }, []);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Error"
      content={respMessage}
      dateTime={new Date().toLocaleTimeString("pk")}
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
      dateTime={new Date().toLocaleTimeString("pk")}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  let statuses = [
    "All",
    "Archived",
    "Assigned",
    "Cancel",
    "Project manager",
    "Completed",
    "Ongoing",
    "For Review",
    "Draft",
    "Heads Up!",
  ];
  const filterBrand = reduxState?.customerBrand?.map((item) => item.brand_name);

  const handleStatusChange = useCallback((value) => {
    if (value === "All" || value === "" || value === null) {
      console.log(status)
      setProjectList(copyProjectList);
    } else {
      setProjectList(copyProjectList);
      setProjectList(prevList => {
        return prevList.filter(item => item.status === value);
      });
    }

    setStatus(value);
  },
    [copyProjectList]);


  const handleCategoryChange = useCallback((value) => {
    if (value === "" || value === null) {
      setProjectList(copyProjectList)
    }
    else {
      setProjectList(copyProjectList);
      setProjectList(prevList => {
        return prevList.filter(item => item.project_category === value);
      });
    }
    setCategory(value);
  }, [copyProjectList])

  const handleBrandChange = useCallback((value) => {
    if (value === "" || value === null) {
      setProjectList(copyProjectList)
    }
    else {
      setProjectList(copyProjectList)
      setProjectList(prevList => {
        if (typeof prevList.brand === "string") {
          return prevList.filter(item => item.brand === value);
        } else {
          return prevList.filter(item => item.brand?.brand_name === value);
        }
      })
    }
    setBrand(value);
  }, [copyProjectList])

  // useEffect(() => {
  //   setProjectList(reduxState.project_list.CustomerProjects)
  // }, [reduxState.project_list])


  return (
    <DashboardLayout>
      <MDBox
        p={"24px 12px"}
        sx={({ breakpoints }) => ({ [breakpoints.only("xs")]: { padding: "24px 24px" } })}
        mt={"0px"}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} pt={0}>
            <MDTypography pl={"15px"} sx={{ ...titleStyles, fontSize: is500 ? '2rem' : '3rem' }}>
              miProjects
            </MDTypography>
            <Grid container justifyContent={"space-between"} paddingInlineStart={"17px"} alignItems={"center"} width={"100%"}>
              <Grid item xxl={8} xl={12} lg={12} md={12} xs={12} display={"flex"}>
                <Grid container spacing={2} >
                  <Grid item xl={3} lg={3} md={3} xs={12}>
                    <ProjectStatus
                      data={statuses}
                      value={status}
                      status={"STATUS"}
                      handleChange={handleStatusChange}
                      copyProjectList={copyProjectList}
                    />
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} xs={12}>
                    <CategoryFilter
                      projectList={projectList}
                      setProjectList={setProjectList}
                      data={reduxState.category}
                      personName={category}
                      handleChange={handleCategoryChange}
                      status={"CATEGORY"}
                    // clearValue={clearValue}
                    />
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} xs={12}>
                    <BrandFilter
                      setProjectList={setProjectList}
                      projectList={projectList}
                      data={filterBrand}
                      personName={brand}
                      handleChange={handleBrandChange}
                      status={"BRAND"}
                    // clearValue={clearValue}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Card sx={cardStyles}>
              <MDBox>
                <NewProjectsTable
                  table={{ columns: isLg ? small_columns : columns, rows: isLg ? small_rows : rows }}
                  entriesPerPage={{ defaultValue: 15 }}
                  showTotalEntries={true}
                  pagination={{ variant: "contained", color: "warning" }}
                  noEndBorder={false}
                  canSearch={true}
                  isSorted={true}
                />
                {!rows.length ? (
                  <MDTypography textAlign="center" p={1} component="h4">
                    No Projects Found
                  </MDTypography>
                ) : null}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        {renderSuccessSB}
        {renderErrorSB}
      </MDBox>
    </DashboardLayout>
  );
};

export default reduxContainer(ProjectTable);

const cardStyles = {
  borderRadius: "0px",
  padding: "8px",
  width: "98%",
  marginLeft: "16px",
  backgroundColor: mibananaColor.headerColor,
  mt: "20px",
};
const titleStyles = {
  fontSize: "3rem",
  color: mibananaColor.yellowColor,
  fontFamily: fontsFamily.poppins,
  fontWeight: "bold !important",
  userSelect: "none",
};
