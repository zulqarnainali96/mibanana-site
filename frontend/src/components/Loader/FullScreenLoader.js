import MDBox from 'components/MDBox'
import React from 'react'


const FullScreenLoader = ({ children }) => {
    return (
        <MDBox width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            {children}
        </MDBox>
    )
}

export default FullScreenLoader
