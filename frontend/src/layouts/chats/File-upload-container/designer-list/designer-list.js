import { CloseRounded } from '@mui/icons-material'
import { Autocomplete, IconButton, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MoonLoader } from 'react-spinners'

const DesignerList = ({
    designerLoading,
    project,
    role,
    memberName,
    SubmitProject,
    designerList,
    classes,
    designerImg,
    deleteDesigner
}) => {

    const [teamMembers, setTeamMembers] = useState(project?.team_members)
    useEffect(() => {
        setTeamMembers(project?.team_members)
    }, [teamMembers])

    return (
        <>
            {designerLoading ? <MoonLoader className="designer-loading" loading={designerLoading} size={24} color='#121212' /> : (
                <>
                    {teamMembers?.length > 0 ? (
                        <>
                            <img src={designerImg} className="adminImg1" />
                            {teamMembers?.map((item, i) => (
                                <div key={i}>
                                    {role?.projectManager && (<IconButton className="remove-designer" onClick={() => deleteDesigner(item)}>
                                        <CloseRounded fontSize="small" />
                                    </IconButton>)}
                                    <h3 className={classes.adminDiv2h3}>{item.name}</h3>
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
                </>
            )}
        </>
    )
}

export default DesignerList
