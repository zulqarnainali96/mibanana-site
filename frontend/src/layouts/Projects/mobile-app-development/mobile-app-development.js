import ProjectsDetails from 'layouts/project-details/project_details'
import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useMobileHook from './useMobileHook'
import MobileProjectDescription from './mobile-projects-description'

const MobileAppDevelopment = ({ reduxState, reduxActions }) => {
  const projectState = useMobileHook(reduxState, reduxActions)
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
        <MobileProjectDescription
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

export default reduxContainer(MobileAppDevelopment)
