import React from 'react'
import { Grid, Menu, MenuItem, MenuList } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MDTypography from 'components/MDTypography'
import { mibananaColor } from 'assets/new-images/colors';
import { handleRole } from 'redux/global/global-functions';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import { MoonLoader } from 'react-spinners';
import { fontsFamily } from 'assets/font-family';

export const ProjectChanges = ({
    withRevision,
    anchorEl,
    handleClose,
    projectAttend1,
    projectForReview1,
    makePriorityHigh,
    handleClick,
    userRole,
    project_user,
    project_id,
    loading,
    userId,
    is500,
}) => {
    const role = handleRole(userRole)
    return (
        <MDTypography
            sx={({ palette: { primary } }) => ({
                fontFamily: fontsFamily.poppins,
                color: mibananaColor.tableHeaderColor,
                fontWeight: "bold",
                fontSize: is500 ? "14px !important" : "16px",
                paddingBottom: "5px",
                borderBottom: `2px solid ${mibananaColor.tableHeaderColor}`,
                display: "flex",
            })}
            variant="h4"
            pb={1}
        >
            <Grid xs={6} style={{ display: "flex", alignItems: "center" }}>Activity</Grid>
            {role?.teamMember && userId !== project_user || role?.projectManager && userId !== project_user ? (
                <Grid
                    id="dropdown-btn"
                    aria-controls={anchorEl ? 'dropdown-menu' : undefined}
                    aria-haspopup="true"
                    arxia-expanded={anchorEl ? 'true' : undefined}
                    onClick={handleClick}
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "end", alignItems: "center", cursor: "pointer", color: '#333' }}
                >
                    Change Status
                    <MoreVertIcon fontSize='small' />
                </Grid>
            ) : null}
            {project_user === userId && (role?.customer || role?.projectManager || role?.teamMember) ? (
                <MDBox display="flex" justifyContent="flex-end" alignItems="center" width="100%" onClick={() => withRevision(project_id)}>
                    {/* <MDButton sx={sendChangeButton} variant="contained" color="primary" >Send Changes to Designer</MDButton> */}
                    <MDButton
                        type="submit"
                        color="warning"
                        endIcon={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <MoonLoader loading={loading} size={18} color='#121212' />
                        </div>}
                        disabled={loading}
                        boxShadow="none"
                        sx={{
                            color: '#000 !important',
                            textTransform: "capitalize",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: '12px'
                        }}
                    >
                        Send Changes to Team Member
                    </MDButton>
                </MDBox>
            ) : null}
            <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                style={{ top: "10px" }}
            >
                <MenuList>
                    {role?.teamMember && userId !== project_user ? (
                        <div>
                            <MenuItem onClick={projectAttend1}>Ongoing</MenuItem>
                            <MenuItem onClick={projectForReview1}>For Review</MenuItem>
                            <MenuItem onClick={makePriorityHigh}>Make High Priority</MenuItem>
                        </div>
                    ) : role?.projectManager && userId !== project_user ? (
                        <div>
                            <MenuItem onClick={projectAttend1}>Ongoing</MenuItem>
                            <MenuItem onClick={projectForReview1}>For Review</MenuItem>
                            <MenuItem onClick={makePriorityHigh}>Make High Priority</MenuItem>
                        </div>
                    ) : null}
                </MenuList>
            </Menu>
        </MDTypography>
    )
}

export default ProjectChanges