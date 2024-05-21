import ProjectsDetails from 'layouts/project-details/project_details'
import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useWebsiteDevHook from './useWebsiteDevHook'

const WebsiteDevelopment = ({ reduxState }) => {
  const projectState = useWebsiteDevHook(reduxState)
  return (
    <React.Fragment>
      <ProjectsDetails
        reduxState={reduxState}
        projectState={projectState}
      />
    </React.Fragment>
  )
}

export default reduxContainer(WebsiteDevelopment)
