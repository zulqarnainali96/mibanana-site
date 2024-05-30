import ProjectsDetails from 'layouts/project-details/project_details'
import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useCopyWritingHook from './useCopyWritingHook'
import CopyWritingProjectDescription from './copy-writing-project-description'

const CopyWriting = ({ reduxState, reduxActions }) => {
  const projectState = useCopyWritingHook(reduxState, reduxActions)
  const {
    project,
    teamLoading,
    teamMembers,
    handleRole,
    teamMemberList,
    memberName,
    SubmitProject,
    deleteTeamMember
  } = projectState
  return (
    <React.Fragment>
      <ProjectsDetails
        reduxState={reduxState}
        projectState={projectState}
      >
        <CopyWritingProjectDescription
          loading={teamLoading}
          project={project}
          handleRole={handleRole}
          teamMembers={teamMembers}
          teamMemberList={teamMemberList}
          memberName={memberName}
          SubmitProject={SubmitProject}
          deleteTeamMember={deleteTeamMember}
        />
      </ProjectsDetails>
    </React.Fragment>
  )
}

export default reduxContainer(CopyWriting)
