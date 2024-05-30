import ProjectsDetails from 'layouts/project-details/project_details'
import React from 'react'
import reduxContainer from 'redux/containers/containers'
import WebsiteProjectDescription from './website-development-description'
import useWebsiteHook from './useWebsiteDevHook'

const WebsiteDevelopment = ({ reduxState, reduxActions }) => {
  const projectState = useWebsiteHook(reduxState, reduxActions)
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
        <WebsiteProjectDescription
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

export default reduxContainer(WebsiteDevelopment)
