import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React from 'react'
import noPageFound from 'assets/new-images/mibanana-team/no-page.png'
import { useMediaQuery } from '@mui/material'


const MibananTeam = () => {
    const is768 = useMediaQuery("(min-width:768px)")
    return (
        <DashboardLayout>
            <MDBox textAlign="center" display="flex" justifyContent="center" pt={4}>
                <img src={noPageFound} width={is768 ? "45%" : "80%"} alt="no-page-found" />
            </MDBox>
        </DashboardLayout>
    )
}

export default MibananTeam
