import { Menu, MenuItem } from '@mui/material'
import MDBox from 'components/MDBox'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MDTypography from 'components/MDTypography'
import MenuItemDropdown from 'layouts/ProjectsTable/data/MenuItem'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from 'api/apiClient';
import MDSnackbar from 'components/MDSnackbar';

const Action = ({ openCurrentCustomerDetails, id }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(false)

  const [respMessage, setRespMessage] = useState("")
  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const deleteCurrentCustomer = async () => {
    setLoading(true)
    await apiClient.delete("/api/delete-customer/" + id).then(({ data }) => {
      console.log(data?.message)
      setLoading(false)
      setRespMessage(data?.message)
      setTimeout(() => {
        openSuccessSB()
      }, 400)
    }).catch(err => {
      if (err.response) {
        const { message } = err.response?.data
        setRespMessage(message)
        openErrorSB()
        setLoading(false)
      }
      setRespMessage(err.message)
      setLoading(false)
      setTimeout(() => {
        openErrorSB()
      }, 400)
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
  return (
    <>
      <MoreVertIcon onClick={handleMenuOpen} sx={{ width: "1em", height: "1em", fontSize: '27px !important', fill: "dark" }} />
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
        <MenuItemDropdown loading={false} title="Edit" onClick={openCurrentCustomerDetails}>Edit</MenuItemDropdown>
        <MenuItemDropdown loading={loading} title="Delete" onClick={deleteCurrentCustomer}>Delete</MenuItemDropdown>
        {renderSuccessSB}
        {renderErrorSB}
      </Menu>
    </>
  )
}
const useCustomerTable = (data) => {
  const navigate = useNavigate()

  const rows = data?.length > 0 ? data.map((item) => {

    const openCurrentCustomerDetails = () => {
      navigate(`/settings/customers/${item?._id}`)
    }
    const statusStyle = {
      textTransform: 'uppercase',
      padding: '7px',
      backgroundColor: item?.is_active ? "#54eb54" : '#ff00009e',
      color: 'white',
      borderRadius: '11px',
      boxShadow: 'inset -1px 0px 24px 1px #0000003b',
      fontSize: '13px',
      marginInline: '7px'
    }

    return {
      name: item?.name,
      email: item?.email,
      phone: item?.phone_no,
      is_active: <span style={statusStyle}>{item?.is_active ? "Active" : "PENDING"}</span>,
      company_name: item?.company_profile,
      action: <Action openCurrentCustomerDetails={openCurrentCustomerDetails} id={item?._id} />,
    }
  }) : []
  const columns = [
    { Header: "Name", accessor: "name", align: "left", },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Status", accessor: "is_active", align: "center" },
    { Header: "Phone", accessor: "phone", align: "center" },
    { Header: "Company Name", accessor: "company_name", align: "center" },
    { Header: "Action", accessor: "action", align: "right" },
  ]
  return {
    rows,
    columns
  }
}

export default useCustomerTable
