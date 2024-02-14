import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import MoonLoader from 'react-spinners/MoonLoader'

const MenuItemDropdown = ({ title, onClick, loading, disabled }) => {
    return (
        <MenuItem sx={containerStyles} onClick={onClick} disabled={disabled}>
            <h6 style={{ fontWeight: '300', color: 'inherit' }}>{title}</h6>
            <IconButton>
                <MoonLoader size={20} loading={loading} />
            </IconButton>
        </MenuItem>
    )
}

export default MenuItemDropdown


const containerStyles = {
    display: 'flex',
    justifyContent: 'space-between'
  }
