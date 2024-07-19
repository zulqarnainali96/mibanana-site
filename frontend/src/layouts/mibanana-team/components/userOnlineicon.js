import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import React from 'react'

const UserOnlineIcon = ({
    data,
    member,
}) => {
    const checkUserOnline = () => {
        const currentUser = data?.some(item => item.id === member._id)
        if (currentUser) {
            return { minWidth: '46px !important', ...greenCircle }
        } else {
            return { minWidth: '56px' }
        }
    }
    return (
        <ListItemIcon sx={checkUserOnline()}>
            <Avatar src={member.avatar} alt={member.name} />
        </ListItemIcon>
    )
}

const greenCircle = {
    border: '2px solid #5ccd5c',
    borderRadius: '25px',
    padding: '2px',
}
export default UserOnlineIcon
