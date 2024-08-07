import React from 'react'
import GroupAdd from '@mui/icons-material/GroupAdd'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

const TitleContainer = ({ role, handleOpenForm, currentUser }) => {
    return (
        <React.Fragment>
            <Typography variant="h4" gutterBottom>
                Team Members
            </Typography>
            {role.admin || role.projectManager || currentUser?.teamMember ? (
                <IconButton onClick={handleOpenForm}>
                    <GroupAdd fontSize='medium' />
                </IconButton>
            ) : null}
        </React.Fragment>
    )
}

export default TitleContainer
