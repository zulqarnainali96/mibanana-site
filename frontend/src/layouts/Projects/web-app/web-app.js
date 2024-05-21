import ProjectsDetails from 'layouts/project-details/project_details'
import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useWebAppHook from './useWebAppHook'

const WebApp = ({ reduxState }) => {
  const projectState = useWebAppHook(reduxState)
  return (
    <React.Fragment>
      <ProjectsDetails
        reduxState={reduxState}
        projectState={projectState}
      />
    </React.Fragment>
  )
}

export default reduxContainer(WebApp)
