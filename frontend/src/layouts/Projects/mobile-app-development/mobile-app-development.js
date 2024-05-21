import ProjectsDetails from 'layouts/project-details/project_details'
import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useMobileHook from './useMobileHook'

const MobileAppDevelopment = ({ reduxState }) => {
  const projectState = useMobileHook(reduxState)

  return (
    <React.Fragment>
        <ProjectsDetails
          reduxState={reduxState}
          projectState={projectState}
        />
    </React.Fragment>
  )
}

export default reduxContainer(MobileAppDevelopment)
