import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useSocialMediaHook from './useSocialMediaHook'
import ProjectsDetails from 'layouts/project-details/project_details'
import SocialMediaManagerDescription from './social-media-project-description'

const SocialMediaManager = ({ reduxState, reduxActions }) => {
  const projectState = useSocialMediaHook(reduxState, reduxActions)
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
        <SocialMediaManagerDescription
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

export default reduxContainer(SocialMediaManager)
