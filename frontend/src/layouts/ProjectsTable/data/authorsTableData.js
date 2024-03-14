import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useContext, useEffect, useRef, useState } from "react";
import apiClient from "api/apiClient";
import MDSnackbar from "components/MDSnackbar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCustomerProject } from "redux/actions/actions";
import { getProjectData } from "redux/global/global-functions";
import "./../../../examples/new-table/table-style.css"
import OptionsList from "./options-list";
// import { useSocket } from "sockets";
import { sendingStatusNotification } from "socket-events/socket-event";
import { customerSendingNotification } from "socket-events/socket-event";
import { SocketContext } from "sockets";

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
  // const socketIO = useRef(useSocket())
  const socketIO = useRef(useContext(SocketContext));


  const handleMenuOpen = (event) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget);
  };

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
    setLoading6(true)
    if (!item._id) {
      setRespMessage('ID not provided')
      setTimeout(() => {
        setLoading6(false)
        openErrorSB()
      }, 1000)
      return
    }
    await apiClient.delete('/graphic-project/' + item._id)
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
          const { message } = err.response.data
          resonseMessage(message)
          setLoading6(false)
          setTimeout(() => {
            errorSBNot()
          }, 900)
          return
        }
        setLoading6(false)
        resonseMessage(err.message)
        setTimeout(() => {
          errorSBNot()
        }, 900)
      })
  }
  const projectCancel = async () => {
    setLoading1(true)
    if (!item._id) {
      setRespMessage('ID not provided')
      setLoading1(false)
      setTimeout(() => {
        openErrorSB()
      }, 1000)
      return
    }
    const id = item._id
    await apiClient.get('/api/cancel-project/' + id)
      .then(({ data }) => {
        if (data.message) resonseMessage(data.message)
        setLoading1(false)
        customerSendingNotification(socketIO, item, 'Customer', 'Cancel')
        setTimeout(() => {
          getProjectData(userid, func)
          successSBNot()
        }, 900)
      })
      .catch((err) => {
        if (err.response) {
          setLoading1(false)
          const { message } = err.response.data
          resonseMessage(message)
          setTimeout(() => {
            errorSBNot()
          }, 900)
          return
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
          return
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

        sendingStatusNotification(socketIO, role, item, userid, 'Ongoing')

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
          return
        }
        setLoading5(false)
        resonseMessage(err.message)
        setTimeout(() => {
          errorSBNot()
        }, 900)
      })
  }
  const projectForReview = async () => {
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
    await apiClient.get('/api/for-review-project/' + id, data)
      .then(({ data }) => {
        if (data.message) resonseMessage(data.message)
        setLoading4(false)

        sendingStatusNotification(socketIO, role, item, userid, 'For Review')

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
          return
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

        customerSendingNotification(socketIO, item, 'Customer', 'Completed')

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
          return
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
  const options_props = { item, children, handleMenuOpen, handleMenuClose, anchorEl, role, loading1, loading2, loading3, loading4, loading5, renderErrorSB, renderSuccessSB, projectForReview, projectCompleted, duplicateProject, projectCancel, projectAttend, deleteProject, loading6 };
  return (
    <MDBox>
      <OptionsList {...options_props} />
    </MDBox >
  )
}
function data() {
  return {
    columns: [
      { Header: "project title", accessor: "project_title", align: "left" },
      { Header: "author", accessor: "name", align: "center", },
      { Header: "Team Member", accessor: "team_members", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "Category", accessor: "project_category", align: "center" },
      { Header: "Active on", accessor: "active", align: "center" },
      { Header: "Submitted on", accessor: "createdAt", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    small_columns: [
      { Header: "project title", accessor: "project_title", align: "left", },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
  };
}


export default data
