import ProjectsDetails from 'layouts/project-details/project_details'
import React from 'react'
import reduxContainer from 'redux/containers/containers'
import useCopyWritingHook from './useCopyWritingHook'

const CopyWriting = ({ reduxState }) => {
  const projectState = useCopyWritingHook(reduxState)
  return (
    <React.Fragment>
      <ProjectsDetails
        reduxState={reduxState}
        projectState={projectState}
      />
    </React.Fragment>
  )
}

export default reduxContainer(CopyWriting)
