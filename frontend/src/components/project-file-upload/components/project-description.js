import React from 'react'
import IconButton from '@mui/material/IconButton'
import MoonLoader from 'react-spinners/MoonLoader'
import Autocomplete from '@mui/material/Autocomplete'
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ProjectDescription = ({
    loading,
    teamMembers,
    project,
    role,
    designerList,
    memberName,
    SubmitProject,
    deleteDesigner
}) => {
    return (
        <React.Fragment>
            <div className="project-details project-details-1">
                <div className="project-details-div">
                    <h2 className="admin-div1h2">Author</h2>
                    <div className="adminDiv2">
                        <div>
                            <h3 className="admin-div-2h3">{project?.name}</h3>
                        </div>
                    </div>
                </div>
                <div className="project-details-div">
                    <h2 className="admin-div-1h2">Team Member</h2>
                    <div className="adminDiv2">
                        {loading ? (
                            <MoonLoader className="designer-loading" loading={loading} size={24} color='#121212' />
                        )
                            : (
                                <React.Fragment>
                                    {teamMembers?.length > 0 ? (
                                        <>
                                            {teamMembers.map((item, i) => (
                                                <div key={i}>
                                                    {role?.projectManager && (<IconButton size="small" className="remove-designer" onClick={() => deleteDesigner(item)}>
                                                        <CloseRoundedIcon fontSize="small" />
                                                    </IconButton>)}
                                                    <h3 style={{ fontSize: '13px' }}>{item?.name}</h3>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {role?.projectManager ? (
                                                <Autocomplete
                                                    value={memberName}
                                                    onChange={(event, newValue) => {
                                                        SubmitProject(newValue)
                                                    }}
                                                    options={designerList}
                                                    getOptionLabel={(option) => option.name ? option.name : ''}
                                                    sx={{ width: '95%' }}
                                                    renderInput={(params) => <TextField required {...params} placeholder="Select Designer" />}
                                                />
                                            ) : (
                                                <p className="notassign">Not Assigned</p>
                                            )}
                                        </>
                                    )}
                                </React.Fragment>
                            )}
                    </div>
                </div>
                <div className="project-details-div">
                    <h2 className="admin-div1h2">Brand</h2>
                    <div className="adminDiv2">
                        <Link to="/mi-brands">
                            <h3 className="admin-div-2h3" style={{ textDecoration: 'underline', color: '#344767' }} >{(typeof project?.brand === 'string' ? project?.brand : project?.brand?.brand_name)}</h3>
                        </Link>
                    </div>
                </div>
                <div className="project-details-div">
                    <h2 className="admin-div1h2">Category</h2>
                    <div className="adminDiv2">
                        <h3 className="admin-div-2h3">{project?.project_category}</h3>
                    </div>
                </div>
            </div>
            <hr />
            <div className="project-details project-details-2">
                <div className="project-details-div">
                    <h2 className="admin-div1h2">Project Title</h2>
                    <Typography variant="h6" className="desc1">
                        {project?.project_title}
                    </Typography>
                </div>
                <div className="project-details-div">
                    <h2 className="admin-div1h2">Type</h2>
                    <Typography variant="h6" className="desc1">
                        {project?.design_type}
                    </Typography>
                </div>
                <div className="project-details-div">
                    <h2 className="admin-div1h2">File Formats</h2>
                    {project?.file_formats?.map(item => <Typography sx={{ display: 'inline' }} variant="h6" className="desc1">{item},</Typography>)}
                    <Typography sx={{ display: 'inline' }} variant="h6" className="desc1">{project?.specific_software_names}</Typography>
                </div>

                <div className="project-details-div">
                    <h2 className="admin-div1h2">Size</h2>
                    <Typography variant="h6" className="desc1">
                        {project?.sizes}
                    </Typography>
                </div>
                <div className="project-details-div">
                    <h2 className="admin-div1h2">Status</h2>
                    <Typography variant="h6" className="desc1">
                        {project?.is_active ? "Active" : "Not Active"}
                    </Typography>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ProjectDescription
