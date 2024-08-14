import { IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react'
import { useBrandAction } from './useBrandAction';
import MDBox from 'components/MDBox';
import { MoonLoader } from 'react-spinners';
import { fontsFamily } from 'assets/font-family';
import { Link } from 'react-router-dom';


const BrandCreatorAction = ({ deleteBrandList, openBrandModal, loading }) => {
  return (
    <div>
      <MenuItem onClick={openBrandModal}>Edit</MenuItem>
      <MenuItem sx={containerStyles} onClick={deleteBrandList}>
        <h6 style={{ fontWeight: "300", color: "inherit" }}>Delete</h6>
        <IconButton>
          <MoonLoader size={20} loading={loading} />
        </IconButton>
      </MenuItem>

    </div>
  )
}

const AdminAction = ({ deleteBrandList, loading }) => {
  return (
    <MenuItem sx={containerStyles}>
      <h6 style={{ fontWeight: "300", color: "inherit" }} onClick={deleteBrandList}>Delete</h6>
      <IconButton>
        <MoonLoader size={20} loading={loading} />
      </IconButton>
    </MenuItem>
  )
}

const BrandAction = ({
  item,
  setFormValue,
  openEditBrandModal,
  openSuccessSB,
  openErrorSB,
  setRespMessage,
  reduxState,
  reduxActions
}) => {

  const { deleteBrandList, handleMenuOpen, openBrandModal, handleMenuClose, anchorEl, loading, role, userId } = useBrandAction(item,
    setFormValue,
    openEditBrandModal,
    openSuccessSB,
    openErrorSB,
    setRespMessage,
    reduxState,
    reduxActions)
  return (

    <MDBox>
      <MDBox onClick={handleMenuOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="active-svg"
          width="27"
          height="27"
          fill="none"
        >
          <path
            stroke="inherit"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10ZM21 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
          />
        </svg>
      </MDBox>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {userId === item?.user ? (
          <BrandCreatorAction
            openBrandModal={openBrandModal}
            deleteBrandList={deleteBrandList}
            loading={loading}
          />
        ) : role?.admin ? (
          <AdminAction
            deleteBrandList={deleteBrandList}
            loading={loading}
          />
        ) : (
          <MenuItem sx={containerStyles}>
            <Link to={`/brand/${item?._id}`}>
              <h6 style={{ fontWeight: "300", color: fontsFamily.grayColor, fontFamily: fontsFamily.poppins }}>View</h6>
            </Link>
          </MenuItem>
        )}
      </Menu>
    </MDBox>
  )
}

export default BrandAction


const containerStyles = {
  display: "flex",
  justifyContent: "space-between",
};