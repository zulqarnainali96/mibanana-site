import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useSocialMediaHook from './useSocialMediaHook'
import ProjectsDetails from 'layouts/project-details/project_details'

const SocialMediaManager = ({ reduxState, }) => {
  const projectState = useSocialMediaHook(reduxState)
  return (
    <React.Fragment>
      <ProjectsDetails
        reduxState={reduxState}
        projectState={projectState}
      />
    </React.Fragment>
  )
}

export default reduxContainer(SocialMediaManager)
