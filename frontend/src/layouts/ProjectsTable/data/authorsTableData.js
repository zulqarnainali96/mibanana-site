import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import { Menu } from "@mui/material";
import apiClient from "api/apiClient";
import MDSnackbar from "components/MDSnackbar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCustomerProject } from "redux/actions/actions";
import { getProjectData } from "redux/global/global-functions";
import MenuItemDropdown from "./MenuItem";
import { actionIcon } from "assets/new-images/projects-table/Group43";
import "./../../../examples/new-table/table-style.css"

export const Author = ({ name, }) => (
  <MDBox lineHeight={1}>
    <MDTypography display="block" variant="button" fontWeight="medium">
      {name}
    </MDTypography>
  </MDBox>
);

export const Job = ({ title, description }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {title}
    </MDTypography>
    <MDTypography variant="caption">{description}</MDTypography>
  </MDBox>
);

export const Action = ({ children, item, resonseMessage, errorSBNot, successSBNot, role }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [loading4, setLoading4] = useState(false)
  const [loading5, setLoading5] = useState(false)
  const [loading6, setLoading6] = useState(false)
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const new_brand = useSelector(state => state.new_brand)
  const userid = useSelector(state => state.userDetails.id)
  const dispatch = useDispatch()

  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const [respMessage, setRespMessage] = useState("")
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const func = (value) => dispatch(getCustomerProject(value))

  const deleteProject = async () => {
    setLoading1(true)
    if (!item._id) {
      setRespMessage('ID not provided')
      setTimeout(() => {
        setLoading1(false)
        openErrorSB()
      }, 1000)
      return
    }
    await apiClient.delete('/graphic-project/' + item._id)
      .then(({ data }) => {
        if (data.message) resonseMessage(data.message)
        setLoading1(false)
        getProjectData(userid, func)
        setTimeout(() => {
          successSBNot()
        }, 900)
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data
          resonseMessage(message)
          setLoading1(false)
          setTimeout(() => {
            errorSBNot()
          }, 900)
        }
        setLoading1(false)
        resonseMessage(err.message)
        setTimeout(() => {
          errorSBNot()
        }, 900)
      })
  }

  const duplicateProject = async () => {
    setLoading2(true)
    if (!item._id) {
      setRespMessage('ID not provided')
      setLoading2(false)
      setTimeout(() => {
        openErrorSB()
      }, 1000)
      return
    }
    const id = item._id
    const data = {
      user: item.user
    }
    await apiClient.post('/api/duplicate-project/' + id, data)
      .then(({ data }) => {
        if (data.message) resonseMessage(data.message)
        setLoading2(false)
        setTimeout(() => {
          getProjectData(userid, func)
          successSBNot()
        }, 900)
      })
      .catch((err) => {
        if (err.response) {
          setLoading2(false)
          const { message } = err.response.data
          resonseMessage(message)
          setTimeout(() => {
            errorSBNot()
          }, 900)
        }
        setLoading2(false)
        resonseMessage(err.message)
        setTimeout(() => {
          errorSBNot()
        }, 900)
      })
  }
  const projectAttend = async () => {
    setLoading5(true)
    if (!item._id) {
      setRespMessage('ID not provided')
      setLoading5(false)
      setTimeout(() => {
        openErrorSB()
      }, 1000)
      return
    }
    const id = item._id
    const data = {
      user: item.user
    }
    await apiClient.get('/api/attend-project/' + id, data)
      .then(({ data }) => {
        if (data.message) resonseMessage(data.message)
        setLoading5(false)
        setTimeout(() => {
          getProjectData(userid, func)
          successSBNot()
        }, 900)
      })
      .catch((err) => {
        if (err.response) {
          setLoading5(false)
          const { message } = err.response.data
          resonseMessage(message)
          setTimeout(() => {
            errorSBNot()
          }, 900)
        }
        setLoading5(false)
        resonseMessage(err.message)
        setTimeout(() => {
          errorSBNot()
        }, 900)
      })
  }
  const projectOngoing = async () => {
    setLoading6(true)
    if (!item._id) {
      setRespMessage('ID not provided')
      setLoading6(false)
      setTimeout(() => {
        openErrorSB()
      }, 1000)
      return
    }
    const id = item._id
    const data = {
      user: item.user
    }
    await apiClient.get('/api/ongoing-project/' + id, data)
      .then(({ data }) => {
        if (data.message) resonseMessage(data.message)
        setLoading6(false)
        setTimeout(() => {
          getProjectData(userid, func)
          successSBNot()
        }, 900)
      })
      .catch((err) => {
        if (err.response) {
          setLoading6(false)
          const { message } = err.response.data
          resonseMessage(message)
          setTimeout(() => {
            errorSBNot()
          }, 900)
        }
        setLoading6(false)
        resonseMessage(err.message)
        setTimeout(() => {
          errorSBNot()
        }, 900)
      })
  }
  const projectSubmitted = async () => {
    setLoading4(true)
    if (!item._id) {
      setRespMessage('ID not provided')
      setLoading4(false)
      setTimeout(() => {
        openErrorSB()
      }, 1000)
      return
    }
    const id = item._id
    const data = {
      user: item.user
    }
    await apiClient.get('/api/submitted-project/' + id, data)
      .then(({ data }) => {
        if (data.message) resonseMessage(data.message)
        setLoading4(false)
        setTimeout(() => {
          getProjectData(userid, func)
          successSBNot()
        }, 900)
      })
      .catch((err) => {
        if (err.response) {
          setLoading4(false)
          const { message } = err.response.data
          resonseMessage(message)
          setTimeout(() => {
            errorSBNot()
          }, 900)
        }
        setLoading4(false)
        resonseMessage(err.message)
        setTimeout(() => {
          errorSBNot()
        }, 900)
      })
  }
  const projectCompleted = async () => {
    setLoading3(true)
    if (!item._id) {
      setRespMessage('ID not provided')
      setLoading3(false)
      setTimeout(() => {
        openErrorSB()
      }, 1000)
      return
    }
    const id = item._id
    await apiClient.get('/api/project-completed/' + id)
      .then(({ data }) => {
        if (data.message) resonseMessage(data.message)
        setLoading3(false)
        setTimeout(() => {
          getProjectData(userid, func)
          successSBNot()
        }, 900)
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data
          setLoading3(false)
          resonseMessage(message)
          setTimeout(() => {
            errorSBNot()
          }, 900)
        }
        setLoading3(false)
        resonseMessage(err.message)
        setTimeout(() => {
          errorSBNot()
        }, 900)
      })
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
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const ActionItem = () => {

  }

  return (
    <MDBox>
      <MDBox onClick={handleMenuOpen}>
        <svg xmlns="http://www.w3.org/2000/svg" className="active-svg" width="27" height="27" fill="none"><path stroke="inherit" stroke-linecap="round" stroke-linejoin="round" d="M21 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10ZM21 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" /></svg>
      </MDBox>
      {children ? children :
        <Menu
          id="dropdown-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          {role?.customer ? <MenuItemDropdown loading={loading1} onClick={deleteProject} title={"Cancel"} /> : null}
          {role?.customer ? <MenuItemDropdown loading={loading2} onClick={duplicateProject} title={"Duplicate"} /> : (
            <MenuItemDropdown loading={loading5} onClick={projectAttend} title={"Attend"} />
          )}
          {!role?.customer && <MenuItemDropdown loading={loading6} onClick={projectOngoing} title={"Ongoing"} />}
          {role?.customer ? <MenuItemDropdown loading={loading3} onClick={projectCompleted} title={"Completed"} /> : (
            <MenuItemDropdown loading={loading4} onClick={projectSubmitted} title={"Submitted"} />
          )}
          {renderSuccessSB}
          {renderErrorSB}
        </Menu>
      }
    </MDBox >
  )
}
function data() {
  // console.log('project ', reduxState.project_list)
  return {
    columns: [
      { Header: "author", accessor: "name", align: "left", },
      { Header: "Team Member", accessor: "team_members", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "Category", accessor: "project_category", align: "center" },
      { Header: "Active on", accessor: "active", align: "center" },
      { Header: "Submitted on", accessor: "createdAt", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    // rows: [
    //   {
    //     author: <Author name="Social Media Designs" />,
    //     team_member: <MDTypography color="dark" variant="h6">Frank</MDTypography>,
    //     function: <Job title="Frank" description="Organization" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="Ongoing" sx={{ "& .MuiBadge-badge": { background: '#FFE135', color: '#333', textTransform: 'capitalize', fontSize: ".8rem" } }} circular="true" size="lg" />
    //       </MDBox>
    //     ),
    //     category: (
    //       <MDTypography variant="h6" color="text" fontWeight="medium">
    //         Graphic Design
    //       </MDTypography>
    //     ),
    //     active: <MDTypography color="dark" variant="p">{new Date().toDateString() + " " + new Date().toLocaleTimeString("pk", {
    //       hour: "numeric",
    //       minute: "numeric"
    //     })}</MDTypography>,
    //     submitted: <MDTypography color="dark" variant="p">{new Date().toDateString() + " " + new Date().toLocaleTimeString("pk", {
    //       hour: "numeric",
    //       minute: "numeric"
    //     })}</MDTypography>,
    //     action: (
    //       <MDTypography component="span" href="#" variant="caption" color="text" fontWeight="medium">
    //         <Action />
    //       </MDTypography>
    //     ),
    //   },
    //   {
    //     author: <Author name="Blog" />,
    //     team_member: <MDTypography color="dark" variant="h6">Jessica</MDTypography>,
    //     function: <Job title="Programator" description="Developer" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="Ongoing" sx={{ "& .MuiBadge-badge": { background: '#FFE135', color: '#333', textTransform: 'capitalize', fontSize: ".8rem" } }} circular="true" size="lg" />
    //       </MDBox>
    //     ),
    //     category: (
    //       <MDTypography variant="h6" color="text" fontWeight="medium">
    //         Video Editing
    //       </MDTypography>
    //     ),
    //     active: <MDTypography color="dark" variant="p">{new Date().toDateString() + " " + new Date().toLocaleTimeString("pk", {
    //       hour: "numeric",
    //       minute: "numeric"
    //     })}</MDTypography>,
    //     submitted: <MDTypography color="dark" variant="p">{new Date().toDateString() + " " + new Date().toLocaleTimeString("pk", {
    //       hour: "numeric",
    //       minute: "numeric"
    //     })}</MDTypography>,
    //     action: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         <Action />
    //       </MDTypography>
    //     ),
    //   },
    //   {
    //     author: <Author name="Instagram Reels" />,
    //     team_member: <MDTypography color="dark" variant="h6">Abdul</MDTypography>,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="Completed" sx={{ "& .MuiBadge-badge": { background: '#E7F7EF', color: '#0FAF62', textTransform: 'capitalize', fontSize: ".8rem" } }} circular="true" size="lg" />
    //       </MDBox>
    //     ),
    //     category: (
    //       <MDTypography variant="h6" color="text" fontWeight="medium">
    //         Copy Writing
    //       </MDTypography>
    //     ),
    //     active: <MDTypography color="dark" variant="p">{new Date().toDateString() + " " + new Date().toLocaleTimeString("pk", {
    //       hour: "numeric",
    //       minute: "numeric"
    //     })}</MDTypography>,
    //     submitted: <MDTypography color="dark" variant="p">{new Date().toDateString() + " " + new Date().toLocaleTimeString("pk", {
    //       hour: "numeric",
    //       minute: "numeric"
    //     })}</MDTypography>,
    //     action: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         <Action />
    //       </MDTypography>
    //     ),
    //   },
    //   {
    //     author: <Author name="Broucher" />,
    //     team_member: <MDTypography color="dark" variant="h6">Gretchen</MDTypography>,
    //     category: (
    //       <MDTypography variant="h6" color="text" fontWeight="medium">
    //         Video Editing
    //       </MDTypography>
    //     ),
    //     active: <MDTypography color="dark" variant="p">{new Date().toDateString()}</MDTypography>,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="Ongoing" sx={{ "& .MuiBadge-badge": { background: '#FFE135', color: '#333', textTransform: 'capitalize', fontSize: ".8rem" } }} circular="true" size="lg" />
    //       </MDBox>
    //     ),
    //     category: (
    //       <MDTypography variant="h6" color="text" fontWeight="medium">
    //         Video Editing
    //       </MDTypography>
    //     ),
    //     active: <MDTypography color="dark" variant="p">{new Date().toDateString() + " " + new Date().toLocaleTimeString("pk", {
    //       hour: "numeric",
    //       minute: "numeric"
    //     })}</MDTypography>,
    //     submitted: <MDTypography color="dark" variant="p">{new Date().toDateString() + " " + new Date().toLocaleTimeString("pk", {
    //       hour: "numeric",
    //       minute: "numeric"
    //     })}</MDTypography>,
    //     action: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         <Action />
    //       </MDTypography>
    //     ),
    //   },
    //   {
    //     author: <Author name="Richard Gran" />,
    //     team_member: <MDTypography color="dark" variant="h6">Zain</MDTypography>,
    //     function: <Job title="Manager" description="Executive" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="Completed" sx={{ "& .MuiBadge-badge": { background: '#E7F7EF', color: '#0FAF62', textTransform: 'capitalize', fontSize: ".8rem" } }} circular="true" size="lg" />
    //       </MDBox>
    //     ),
    //     category: (
    //       <MDTypography variant="h6" color="text" fontWeight="small">
    //         Video Editing
    //       </MDTypography>
    //     ),
    //     active: <MDTypography color="dark" variant="p">{new Date().toDateString() + " " + new Date().toLocaleTimeString("pk", {
    //       hour: "numeric",
    //       minute: "numeric"
    //     })}</MDTypography>,
    //     submitted: <MDTypography color="dark" variant="p">{new Date().toDateString() + " " + new Date().toLocaleTimeString("pk", {
    //       hour: "numeric",
    //       minute: "numeric"
    //     })}</MDTypography>,
    //     action: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         <Action />
    //       </MDTypography>
    //     ),
    //   },

    // ],
  };
}


export default data
