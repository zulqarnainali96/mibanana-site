import ProjectsDetails from 'layouts/project-details/project_details'
import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useWebAppHook from './useWebAppHook'
import WebAppProjectDescription from './wep-app-project-description'

const WebApp = ({ reduxState, reduxActions }) => {
  const projectState = useWebAppHook(reduxState,reduxActions)
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
        <WebAppProjectDescription
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

export default reduxContainer(WebApp)
